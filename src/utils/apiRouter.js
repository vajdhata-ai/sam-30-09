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

import { callGroq } from './groqClient';
import { callOpenRouter } from './openRouterClient';
import { keyManager } from './keyManager';
import { getSubscriptionState } from './subscriptionState';

// Model selection per tier for Groq
const GROQ_MODELS = {
    basic: "llama-3.1-8b-instant",                      // Smallest, fastest, least tokens
    go:    "meta-llama/llama-4-scout-17b-16e-instruct",  // Mid-tier, good quality
    pro:   "llama-3.3-70b-versatile"                     // Best Groq model (fallback only for Pro)
};

/**
 * Universal AI call — drop-in replacement for callGroq.
 * Same signature: callAI(messages, model, isVision, options)
 * 
 * Tier is auto-detected from subscriptionState. 
 * Components don't need to pass tier info.
 */
export async function callAI(messages, _modelOverride, isVision = false, options = {}) {
    // Auto-detect tier from the global subscription bridge
    const { tier, isPro } = getSubscriptionState();

    if (import.meta.env.DEV) {
        console.log(`[Router] Tier: ${tier.toUpperCase()} | isPro: ${isPro} | Vision: ${isVision}`);
    }

    // ═══════════════════════════════════
    // 1. VISION TASKS → Always OpenRouter first
    // ═══════════════════════════════════
    if (isVision) {
        if (keyManager.hasAvailableKeys('openrouter')) {
            try {
                if (import.meta.env.DEV) console.log('[Router] Vision → OpenRouter (Gemini Flash)');
                return await callOpenRouter(messages, options);
            } catch (err) {
                console.error("[Router] OpenRouter Vision failed:", err);
                console.warn("[Router] Trying Groq Vision fallback...", err.message);
            }
        }
        if (keyManager.hasAvailableKeys('groq')) {
            try {
                if (import.meta.env.DEV) console.log('[Router] Vision → Groq (llama-3.2-vision, fallback)');
                return await callGroq(messages, null, true, options);
            } catch (err) {
                console.error("[Router] Groq Vision also failed.", err.message);
                throw new Error("All vision providers are currently unavailable. Please try again.");
            }
        }
        throw new Error("No available API keys for vision tasks.");
    }

    // ═══════════════════════════════════
    // 2. PRO USERS → OpenRouter Primary, Groq Backup
    //    (Gemini Flash = highest quality, long outputs)
    // ═══════════════════════════════════
    if (isPro) {
        if (keyManager.hasAvailableKeys('openrouter')) {
            try {
                if (import.meta.env.DEV) console.log('[Router] Pro → OpenRouter (Gemini Flash)');
                return await callOpenRouter(messages, options);
            } catch (err) {
                console.warn("[Router] OpenRouter failed for Pro, falling back to Groq...", err.message);
            }
        }
        if (keyManager.hasAvailableKeys('groq')) {
            try {
                if (import.meta.env.DEV) console.log('[Router] Pro → Groq (fallback, llama-3.3-70b)');
                return await callGroq(messages, GROQ_MODELS.pro, false, options);
            } catch (err) {
                console.error("[Router] Groq fallback also failed for Pro.", err.message);
                throw new Error("All AI providers are currently unavailable. Please try again shortly.");
            }
        }
        throw new Error("All AI providers are currently exhausted. Please try again later.");
    }

    // ═══════════════════════════════════
    // 3. BASIC / GO USERS → Groq Primary, OpenRouter Backup
    //    (Free/fast models, conserve OpenRouter tokens)
    // ═══════════════════════════════════
    const groqModel = tier === 'go' ? GROQ_MODELS.go : GROQ_MODELS.basic;

    if (keyManager.hasAvailableKeys('groq')) {
        try {
            if (import.meta.env.DEV) console.log(`[Router] ${tier.toUpperCase()} → Groq (${groqModel})`);
            return await callGroq(messages, groqModel, false, options);
        } catch (err) {
            console.warn(`[Router] Groq failed for ${tier}, falling back to OpenRouter...`, err.message);
        }
    }

    if (keyManager.hasAvailableKeys('openrouter')) {
        try {
            if (import.meta.env.DEV) console.log(`[Router] ${tier.toUpperCase()} → OpenRouter (fallback)`);
            return await callOpenRouter(messages, options);
        } catch (err) {
            console.error(`[Router] OpenRouter fallback also failed for ${tier}.`, err.message);
            throw new Error("All AI providers are currently unavailable. Please try again shortly.");
        }
    }

    throw new Error("All AI providers are currently exhausted. Please try again later.");
}

export default callAI;
