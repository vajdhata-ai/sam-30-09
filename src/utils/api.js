// Auto-detect environment: Use relative path for Vercel, localhost for dev
const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction ? '/api' : 'http://localhost:5050/api';

// Backend server endpoints (when server is running)
export const GEMINI_API_URL = `${API_BASE_URL}/ai/gemini`;
export const GROQ_API_URL = `${API_BASE_URL}/ai/groq`;
export const PODCAST_API_URL = `${API_BASE_URL}/ai/podcast`;
export const TTS_API_URL = `${API_BASE_URL}/ai/tts`;
export const YOUTUBE_TRANSCRIPT_URL = `${API_BASE_URL}/ai/youtube-transcript`;

// Direct API clients (no backend needed)
import { callGemini } from './geminiClient';
import { callAI as callGroq } from './apiRouter';

// Shared message formatter (OpenAI-style, works for both Gemini & Groq)
export const formatGroqPayload = (userContent, systemContent, options = {}) => {
    return {
        messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent }
        ],
        ...(options.temperature !== undefined && { temperature: options.temperature }),
        ...(options.max_tokens !== undefined && { max_tokens: options.max_tokens }),
    };
};
export const formatGeminiPayload = formatGroqPayload;

import { auth } from '../firebase';

// Simple fast hash to use for caching AI requests
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

/**
 * Smart AI fetch: Calls Groq/Gemini DIRECTLY from the browser first.
 * Falls back to backend server if the direct call fails.
 * No retry delays — fails fast and surfaces errors immediately.
 */
export const retryableFetch = async (url, options = {}, retries = 2) => {
    const isAICall = url.includes('/ai/gemini') || url.includes('/ai/groq') || url.includes('/ai/podcast');

    if (isAICall && options.body) {
        let cacheKey = null;
        try {
            cacheKey = `aurem_ai_cache_${hashString(options.body)}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                console.log('[AI] Used Session Cache! Tokens saved.');
                return JSON.parse(cached);
            }
        } catch (e) { /* ignore cache read errors */ }

        try {
            const payload = JSON.parse(options.body);
            if (payload.messages && payload.messages.length > 0) {
                const isGroqModel = payload.model && (payload.model.includes('llama') || payload.model.includes('mixtral'));
                const isGeminiModel = payload.model && payload.model.includes('gemini');

                if (isGeminiModel) {
                    console.log('[AI] Calling Gemini directly (vision/gemini model)...');
                    const result = await callGemini(payload.messages, payload.model);
                    if (result && result.choices && result.choices.length > 0) {
                        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch(e){}
                        return result;
                    }
                } else if (isGroqModel) {
                    console.log('[AI] Calling Groq directly...');
                    const hasImage = payload.messages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'image_url'));
                    const result = await callGroq(payload.messages, payload.model, hasImage, {
                        temperature: payload.temperature,
                        max_tokens: payload.max_tokens
                    });
                    if (result && result.choices && result.choices.length > 0) {
                        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch(e){}
                        return result;
                    }
                } else {
                    console.log('[AI] Calling Gemini directly...');
                    const result = await callGemini(payload.messages, payload.model);
                    if (result && result.choices && result.choices.length > 0) {
                        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch(e){}
                        return result;
                    }
                }
            }
        } catch (directErr) {
            console.warn('[AI] Direct API call failed, trying backend...', directErr.message);
        }
    }

    // Fallback: call the backend server
    try {
        const headers = { ...options.headers };

        if (auth.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken();
                headers['Authorization'] = `Bearer ${token}`;
            } catch (authErr) {
                console.warn('[Auth] Could not get token:', authErr.message);
            }
        }

        const response = await fetch(url, { ...options, headers });

        if (response.status === 429 && retries > 0) {
            console.warn(`[AI] Rate limit hit, retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 1000 * (3 - retries + 1))); // Exponential backoff
            return retryableFetch(url, options, retries - 1);
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            let errorMessage = data.error
                ? (data.details ? `${data.error}: ${data.details}` : data.error)
                : data.message || `HTTP ${response.status} error.`;

            // Production-ready user-friendly error overriding
            const lowerError = String(errorMessage).toLowerCase();
            if (response.status === 429 || lowerError.includes('exhausted') || lowerError.includes('limit') || lowerError.includes('quota')) {
                errorMessage = "Our cognitive engines are currently operating at maximum capacity. Please pause for a moment and try again.";
            } else if (response.status >= 500 || lowerError.includes('unavailable') || lowerError.includes('down')) {
                errorMessage = "Our network stream is temporarily unstable. If you are utilizing a VPN, adjusting your region might provide a seamless connection.";
            }

            return {
                ...data,
                error: errorMessage
            };
        }

        return data;
    } catch (err) {
        if (retries > 0) {
            console.warn(`[AI] Network error: ${err.message}. Retrying...`);
            await new Promise(r => setTimeout(r, 1000 * (3 - retries + 1)));
            return retryableFetch(url, options, retries - 1);
        }
        
        let clientError = err.message || 'Network error';
        if (clientError.toLowerCase().includes('fetch') || clientError.toLowerCase().includes('network')) {
            clientError = "Secure connection interrupted. Please check your network stability or VPN configuration to ensure a seamless experience. (Internal msg: " + err.message + ")";
        }

        return {
            error: clientError,
            choices: [{ message: { role: 'assistant', content: clientError }, finish_reason: 'stop' }]
        };
    }
};

export const useRetryableFetch = () => {
    return { retryableFetch };
};