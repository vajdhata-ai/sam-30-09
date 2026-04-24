/**
 * openRouterClient.js — Direct client-side OpenRouter API calls for Gemini Flash.
 * Handles vision and text requests with JSON parsing.
 */

import { keyManager } from './keyManager';

export async function callOpenRouter(messages, options = {}, _retryCount = 0) {
    const apiKey = keyManager.getKey('openrouter');
    if (!apiKey) throw new Error("No available OpenRouter API keys.");

    const url = "https://openrouter.ai/api/v1/chat/completions";

    const payload = {
        model: "google/gemini-2.5-flash",
        messages: messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.max_tokens ?? 4000,
        ...(options.response_format && { response_format: options.response_format })
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin, // OpenRouter requires Referer
            'X-Title': 'Aurem Intelligence'        // Optional but recommended
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        if (response.status === 429 || response.status === 403 || response.status === 402) {
            keyManager.markKeyExhausted('openrouter');
            
            if (_retryCount < 7) {
                console.warn(`[OpenRouter] ${response.status}. Retrying with next key...`);
                return callOpenRouter(messages, options, _retryCount + 1);
            }
        }
        
        const errText = await response.text();
        console.error(`[OpenRouter] API Error ${response.status}:`, errText);
        throw new Error(`OpenRouter API Error ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export default callOpenRouter;
