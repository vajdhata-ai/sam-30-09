// src/utils/keyManager.js

// Pre-load keys from environment variables
const GROQ_KEYS = [
    import.meta.env.VITE_GROQ_KEY_1,
    import.meta.env.VITE_GROQ_KEY_2,
    import.meta.env.VITE_GROQ_KEY_3,
    import.meta.env.VITE_GROQ_KEY_4,
    import.meta.env.VITE_GROQ_KEY_5,
    import.meta.env.VITE_GROQ_KEY_6,
    import.meta.env.VITE_GROQ_KEY_7,
].filter(Boolean);

const OPENROUTER_KEYS = [
    import.meta.env.VITE_OPENROUTER_KEY_1,
    import.meta.env.VITE_OPENROUTER_KEY_2,
    import.meta.env.VITE_OPENROUTER_KEY_3,
    import.meta.env.VITE_OPENROUTER_KEY_4,
    import.meta.env.VITE_OPENROUTER_KEY_5,
    import.meta.env.VITE_OPENROUTER_KEY_6,
    import.meta.env.VITE_OPENROUTER_KEY_7,
].filter(Boolean);

const SARVAM_KEYS = [
    import.meta.env.VITE_SARVAM_KEY_1,
    import.meta.env.VITE_SARVAM_KEY_2,
    import.meta.env.VITE_SARVAM_KEY_3,
    import.meta.env.VITE_SARVAM_KEY_4,
    import.meta.env.VITE_SARVAM_KEY_5,
    import.meta.env.VITE_SARVAM_KEY_6,
    import.meta.env.VITE_SARVAM_KEY_7,
    import.meta.env.VITE_SARVAM_KEY_8,
    import.meta.env.VITE_SARVAM_KEY_9,
].filter(Boolean);

class KeyManager {
    constructor() {
        this.providers = {
            groq: { keys: GROQ_KEYS, currentIndex: 0, exhausted: new Set() },
            openrouter: { keys: OPENROUTER_KEYS, currentIndex: 0, exhausted: new Set() },
            sarvam: { keys: SARVAM_KEYS, currentIndex: 0, exhausted: new Set() }
        };
        this.lastResetDate = new Date().toDateString();

        // Check for midnight reset on init
        this.checkMidnightReset();
    }

    checkMidnightReset() {
        const today = new Date().toDateString();
        if (this.lastResetDate !== today) {
            // It's a new day, clear exhausted keys
            console.log(`[KeyManager] Midnight Reset: Clearing all exhausted keys for new day (${today})`);
            Object.keys(this.providers).forEach(provider => {
                this.providers[provider].exhausted.clear();
                this.providers[provider].currentIndex = 0;
            });
            this.lastResetDate = today;
        }
    }

    /**
     * Gets an available key for a specified provider.
     * @param {string} provider 'groq', 'openrouter', or 'sarvam'
     * @returns {string|null} The API key, or null if all keys for provider are exhausted.
     */
    getKey(provider) {
        this.checkMidnightReset();

        const pData = this.providers[provider];
        if (!pData || pData.keys.length === 0) return null;

        // Try to find a non-exhausted key starting from currentIndex
        const startIndex = pData.currentIndex;
        let loops = 0;

        while (loops < pData.keys.length) {
            if (!pData.exhausted.has(pData.currentIndex)) {
                const key = pData.keys[pData.currentIndex];
                if (import.meta.env.DEV) {
                    console.log(`[KeyManager] Using ${provider.toUpperCase()} Key #${pData.currentIndex + 1}`);
                }
                return key;
            }
            // Move to next key
            pData.currentIndex = (pData.currentIndex + 1) % pData.keys.length;
            loops++;
        }

        // All keys exhausted
        console.warn(`[KeyManager] ALL keys for ${provider.toUpperCase()} are EXHAUSTED for the day.`);
        return null;
    }

    /**
     * Mark the current key as exhausted for the day and rotate.
     * Called when receiving a 429 or 403.
     * @param {string} provider 'groq', 'openrouter', or 'sarvam'
     */
    markKeyExhausted(provider) {
        const pData = this.providers[provider];
        if (!pData) return;

        console.warn(`[KeyManager] Key #${pData.currentIndex + 1} for ${provider.toUpperCase()} marked as exhausted (429/403). Rotating...`);
        pData.exhausted.add(pData.currentIndex);
        
        // Move to next key
        pData.currentIndex = (pData.currentIndex + 1) % pData.keys.length;
    }

    /**
     * Check if a provider has any available keys left.
     */
    hasAvailableKeys(provider) {
        this.checkMidnightReset();
        const pData = this.providers[provider];
        if (!pData || pData.keys.length === 0) return false;
        return pData.exhausted.size < pData.keys.length;
    }
}

export const keyManager = new KeyManager();
