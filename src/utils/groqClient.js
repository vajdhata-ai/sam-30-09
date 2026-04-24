/**
 * groqClient.js — Direct client-side Groq API calls.
 * Uses Llama 4 Scout (30,000 TPM free) as default for maximum throughput.
 * Handles 429/413 errors with automatic retry + reduced token strategy.
 */

import { keyManager } from './keyManager';
// Default free-tier model with highest TPM (30,000 TPM free)
const DEFAULT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Fallback chain: each model has progressively lower requirements
const FALLBACK_CHAIN = [
    "meta-llama/llama-4-scout-17b-16e-instruct",  // 30,000 TPM
    "llama-3.3-70b-versatile",                      // 12,000 TPM
    "llama-3.1-8b-instant",                         //  6,000 TPM
];

export async function callGroq(messages, model, isVision = false, options = {}, _retryCount = 0, _modelIndex = 0) {
    const apiKey = keyManager.getKey('groq');
    if (!apiKey) throw new Error("No available Groq API keys.");

    let groqModel = model || DEFAULT_MODEL;

    // Handle Vision Fallback
    if (isVision) {
        groqModel = "llama-3.2-11b-vision-preview";
    }

    const url = "https://api.groq.com/openai/v1/chat/completions";

    // Progressive max_tokens reduction on retries
    let maxTokens = options.max_tokens ?? 4096;
    if (isVision) maxTokens = Math.min(maxTokens, 4096); // Groq vision limit
    if (_retryCount === 1) maxTokens = Math.min(maxTokens, 2048);
    if (_retryCount >= 2) maxTokens = Math.min(maxTokens, 1024);

    const payload = {
        model: groqModel,
        messages: messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: maxTokens,
        ...(options.response_format && { response_format: options.response_format })
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();

        if (response.status === 429 || response.status === 403 || response.status === 413 || response.status === 400) {
            // Rate limited or quota exhausted -> Retire the key immediately
            if (response.status === 429 || response.status === 403) {
                keyManager.markKeyExhausted('groq');
            }

            // Strategy 1: Try next model in fallback chain
            const currentIdx = FALLBACK_CHAIN.indexOf(groqModel);
            if (currentIdx >= 0 && currentIdx < FALLBACK_CHAIN.length - 1) {
                const nextModel = FALLBACK_CHAIN[currentIdx + 1];
                console.warn(`[Groq] ${response.status} on ${groqModel}. Falling back to ${nextModel}...`);
                return callGroq(messages, nextModel, isVision, options, _retryCount, currentIdx + 1);
            }

            // Strategy 2: Retry with smaller tokens + trimmed content after wait
            if (_retryCount < 7) {
                const waitMs = response.status === 429 ? 5000 * (_retryCount + 1) : 1000;
                console.warn(`[Groq] ${response.status}. Retry ${_retryCount + 1}/7 in ${waitMs}ms...`);
                await new Promise(r => setTimeout(r, waitMs));
                const trimmedMessages = trimMessages(messages);
                return callGroq(trimmedMessages, groqModel, isVision, options, _retryCount + 1, _modelIndex);
            }
        }

        console.error(`[Groq] API Error ${response.status}:`, errText);
        throw new Error(`Groq API Error ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data;
}

/** Trim long message content to reduce token count on retry */
function trimMessages(messages) {
    return messages.map(msg => {
        if (typeof msg.content === 'string' && msg.content.length > 4000) {
            return { ...msg, content: msg.content.slice(0, 4000) + "\n\n[Content trimmed for processing limits]" };
        }
        return msg;
    });
}

export default callGroq;
