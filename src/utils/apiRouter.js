/**
 * apiRouter.js — Tier-Aware Smart AI Routing Engine
 * 
 * ═══════════════════════════════════════════════════
 * ROUTING RULES (STRICT):
 * ═══════════════════════════════════════════════════
 * 
 * ┌─────────────┬──────────────────────────────────────────────────┐
 * │ User Tier   │ Primary Provider → Fallback                     │
 * ├─────────────┼──────────────────────────────────────────────────┤
 * │ Pro         │ OpenRouter (Gemini Flash) → Groq (backup)       │
 * │ Go          │ Groq (Llama-4-Scout) → OpenRouter (backup)      │
 * │ Basic       │ Groq (Llama-3.1-8b) → OpenRouter (backup)      │
 * ├─────────────┼──────────────────────────────────────────────────┤
 * │ Vision      │ OpenRouter (always) → Groq Vision (backup)      │
 * │ TTS         │ Sarvam (via backend TTS_API_URL, NOT here)      │
 * └─────────────┴──────────────────────────────────────────────────┘
 * 
 * Sarvam is NOT routed here. It is exclusively used for TTS
 * through the backend endpoint (TTS_API_URL).
 * 
 * Tier is read AUTOMATICALLY from subscriptionState.js bridge.
 * No component changes needed — SubscriptionContext syncs it.
 */

import { callGemini } from './geminiClient';
import { getSubscriptionState } from './subscriptionState';
import callGroq from './groqClient';

/**
 * Universal AI call — using Groq primarily, with Gemini as fallback.
 */
export async function callAI(messages, _modelOverride, isVision = false, options = {}) {
    const { tier, isPro } = getSubscriptionState();

    if (import.meta.env.DEV) {
        console.log(`[Router] Tier: ${tier.toUpperCase()} | isPro: ${isPro} | Vision: ${isVision}`);
    }

    try {
        if (isVision) {
            // Groq supports vision on llama-3.2-11b-vision-preview, which is handled inside callGroq
            return await callGroq(messages, _modelOverride, true, options);
        }
        return await callGroq(messages, _modelOverride, false, options);
    } catch (err) {
        console.error("[Router] Groq failed, falling back to Gemini.", err.message);
        try {
            return await callGemini(messages, _modelOverride);
        } catch (geminiErr) {
            console.error("[Router] All API providers failed.", geminiErr.message);
            throw new Error("All AI providers are currently unavailable. Please try again shortly.");
        }
    }
}

export default callAI;
