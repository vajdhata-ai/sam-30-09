/**
 * subscriptionState.js — Lightweight module-level subscription state bridge
 * 
 * Problem: The apiRouter needs to know the user's tier (basic/go/pro)
 * to route requests correctly, but it can't access React context.
 * 
 * Solution: SubscriptionContext writes the current tier here on every change.
 * The apiRouter reads from here automatically. No component changes needed.
 */

let _currentTier = 'basic';
let _isPro = false;

/**
 * Called by SubscriptionContext whenever the tier changes.
 */
export const setSubscriptionState = (tier, isPro) => {
    _currentTier = tier;
    _isPro = isPro;
    if (import.meta.env.DEV) {
        console.log(`[SubscriptionState] Tier synced: ${tier} | isPro: ${isPro}`);
    }
};

/**
 * Called by apiRouter to get the current tier without React context.
 */
export const getSubscriptionState = () => ({
    tier: _currentTier,
    isPro: _isPro
});
