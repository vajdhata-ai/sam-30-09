import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { updateUserSubscription as firestoreUpdateSubscription } from '../utils/firestoreSubscription';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

// Daily limits for Basic tier
const BASIC_LIMITS = {
    'college-compass': 1,
    'podcast': 1,
    'quiz': 2,
    'mindmap': 2,
    'flashcards': 3,  // Auremous Lens flashcards - 3 uses per day
    'youtube': 0,     // YouTube video loading - Premium only
    // Doubt Solver and Document Study core are UNLIMITED
};

// Daily limits for Go tier
const GO_LIMITS = {
    'college-compass': 5,
    'podcast': 5,
    'quiz': 10,
    'mindmap': 10,
    'flashcards': 15,
    'youtube': 2,
};

// Check if we're in dev/testing mode
const isDevMode = () => {
    try {
        return import.meta.env.VITE_DEV_MODE === 'true';
    } catch {
        return false;
    }
};

const getDefaultTier = () => {
    try {
        const tier = import.meta.env.VITE_DEFAULT_TIER;
        if (tier === 'pro' || tier === 'go' || tier === 'dev') return tier;
        return 'basic';
    } catch {
        return 'basic';
    }
};

export const SubscriptionProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [tier, setTier] = useState(getDefaultTier());
    const [subscriptionStatus, setSubscriptionStatus] = useState('active');
    const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);
    const [dailyUsage, setDailyUsage] = useState({});
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState('');
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
    const unsubscribeSnapshotRef = useRef(null);

    // ═══════════════════════════════════
    // REAL-TIME FIRESTORE LISTENER
    // ═══════════════════════════════════
    // Uses onSnapshot for instant subscription updates (no stale reads)

    useEffect(() => {
        // Cleanup previous listener
        if (unsubscribeSnapshotRef.current) {
            unsubscribeSnapshotRef.current();
            unsubscribeSnapshotRef.current = null;
        }

        if (!currentUser?.uid) {
            setTier(getDefaultTier());
            setSubscriptionStatus('active');
            setSubscriptionExpiry(null);
            setIsLoadingSubscription(false);
            return;
        }

        setIsLoadingSubscription(true);

        // Immediately load from localStorage cache for fast UI render
        const cachedTier = localStorage.getItem(`aurem_tier_${currentUser.uid}`);
        if (cachedTier === 'pro' || cachedTier === 'go' || cachedTier === 'dev') {
            setTier(cachedTier === 'dev' ? 'pro' : cachedTier);
        }

        // Set up real-time Firestore listener (source of truth)
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();

                // Read subscription fields (backward compatible with old field names)
                const firestorePlan = data.subscriptionPlan || data.subscriptionTier || 'basic';
                const firestoreStatus = data.subscriptionStatus || 'active';
                const firestoreExpiry = data.subscriptionExpiry || null;

                // Check if subscription has expired
                let effectivePlan = firestorePlan;
                let effectiveStatus = firestoreStatus;

                if (firestoreExpiry && effectiveStatus === 'active') {
                    const expiryDate = firestoreExpiry.toDate ? firestoreExpiry.toDate() : new Date(firestoreExpiry);
                    if (expiryDate < new Date()) {
                        effectiveStatus = 'expired';
                        effectivePlan = 'basic'; // Revert to basic if expired
                    }
                }

                console.log('[Subscription] Firestore snapshot:', effectivePlan, effectiveStatus);
                setTier(effectivePlan);
                setSubscriptionStatus(effectiveStatus);
                setSubscriptionExpiry(firestoreExpiry);

                // Update localStorage cache
                localStorage.setItem(`aurem_tier_${currentUser.uid}`, effectivePlan);

                // Also sync daily usage from Firestore if present
                if (data.dailyUsage) {
                    const today = new Date().toDateString();
                    if (data.dailyUsage.date === today) {
                        setDailyUsage(prev => {
                            const merged = { ...prev };
                            for (const key in data.dailyUsage.usage) {
                                merged[key] = Math.max(merged[key] || 0, data.dailyUsage.usage[key]);
                            }
                            return merged;
                        });
                    }
                }
            } else {
                // Document doesn't exist yet — AuthContext should create it
                // Fall back to defaults
                console.warn('[Subscription] No Firestore document found for user, using defaults');
                setTier(getDefaultTier());
                setSubscriptionStatus('active');
                setSubscriptionExpiry(null);
            }

            setIsLoadingSubscription(false);
        }, (error) => {
            console.error('[Subscription] Firestore onSnapshot error:', error);
            // Fallback to localStorage on error
            const storedTier = localStorage.getItem(`aurem_tier_${currentUser.uid}`);
            if (storedTier === 'pro' || storedTier === 'dev' || storedTier === 'go') {
                setTier(storedTier === 'dev' ? 'pro' : storedTier);
            } else {
                setTier(getDefaultTier());
            }
            setIsLoadingSubscription(false);
        });

        unsubscribeSnapshotRef.current = unsubscribe;

        return () => {
            if (unsubscribeSnapshotRef.current) {
                unsubscribeSnapshotRef.current();
                unsubscribeSnapshotRef.current = null;
            }
        };
    }, [currentUser]);

    // ═══════════════════════════════════
    // DAILY USAGE MANAGEMENT
    // ═══════════════════════════════════

    // Load usage from localStorage on mount
    useEffect(() => {
        const today = new Date().toDateString();
        const storedData = localStorage.getItem('aurem_usage');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed.date === today) {
                    setDailyUsage(parsed.usage || {});
                }
            } catch {}
        }
    }, [currentUser]);

    // Save usage to localStorage and Firebase when it changes
    useEffect(() => {
        const today = new Date().toDateString();
        localStorage.setItem('aurem_usage', JSON.stringify({ date: today, usage: dailyUsage }));

        if (currentUser?.uid && Object.keys(dailyUsage).length > 0) {
            const saveUsageToCloud = async () => {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    await setDoc(userDocRef, { dailyUsage: { date: today, usage: dailyUsage } }, { merge: true });
                } catch (e) {
                    console.error("Failed to save usage to cloud", e);
                }
            };
            const timeoutId = setTimeout(saveUsageToCloud, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [dailyUsage, currentUser]);

    // ═══════════════════════════════════
    // FEATURE GATING
    // ═══════════════════════════════════

    // Check if user can use a feature
    const canUseFeature = (feature) => {
        // Dev mode or Pro tier = unlimited
        if (isDevMode() || tier === 'dev' || tier === 'pro') {
            return true;
        }

        const limits = tier === 'go' ? GO_LIMITS : BASIC_LIMITS;

        // Features without limits (Doubt Solver, Document Study core)
        if (limits[feature] === undefined) {
            return true;
        }

        // Check daily limit
        const currentUsage = dailyUsage[feature] || 0;
        return currentUsage < limits[feature];
    };

    // Increment usage for a feature
    const incrementUsage = (feature) => {
        const limits = tier === 'go' ? GO_LIMITS : BASIC_LIMITS;

        if (limits[feature] === undefined) return; // No tracking for unlimited features

        setDailyUsage(prev => ({
            ...prev,
            [feature]: (prev[feature] || 0) + 1
        }));
    };

    // Get remaining uses for a feature
    const getRemainingUses = (feature) => {
        if (isDevMode() || tier === 'dev' || tier === 'pro') {
            return Infinity;
        }

        const limits = tier === 'go' ? GO_LIMITS : BASIC_LIMITS;

        if (limits[feature] === undefined) {
            return Infinity;
        }

        const currentUsage = dailyUsage[feature] || 0;
        return Math.max(0, limits[feature] - currentUsage);
    };

    // Trigger upgrade modal
    const triggerUpgradeModal = (feature) => {
        setUpgradeFeature(feature);
        setShowUpgradeModal(true);
    };

    // ═══════════════════════════════════
    // SUBSCRIPTION MUTATIONS
    // ═══════════════════════════════════

    // Upgrade to Go - persists to Firestore via utility function
    const upgradeToGo = useCallback(async () => {
        setTier('go');
        if (currentUser?.uid) {
            localStorage.setItem(`aurem_tier_${currentUser.uid}`, 'go');
            try {
                await firestoreUpdateSubscription(currentUser.uid, 'go', 'active', null);
            } catch (err) {
                console.error('[Subscription] Firestore save error:', err);
                alert("Failed to sync premium status to cloud. Please contact support.");
            }
        }
    }, [currentUser]);

    // Upgrade to pro - persists to Firestore via utility function
    const upgradeToPro = useCallback(async () => {
        setTier('pro');
        if (currentUser?.uid) {
            localStorage.setItem(`aurem_tier_${currentUser.uid}`, 'pro');
            try {
                await firestoreUpdateSubscription(currentUser.uid, 'pro', 'active', null);
                console.log('[Subscription] Upgraded to Pro - saved to Firestore');
            } catch (err) {
                console.error('[Subscription] Firestore save error:', err);
                alert("Failed to sync premium status to cloud. Please contact support.");
            }
        }
    }, [currentUser]);

    // Downgrade to basic - persists to Firestore via utility function
    const downgradeToBasic = useCallback(async () => {
        setTier('basic');
        if (currentUser?.uid) {
            localStorage.removeItem(`aurem_tier_${currentUser.uid}`);
            try {
                await firestoreUpdateSubscription(currentUser.uid, 'basic', 'active', null);
                console.log('[Subscription] Downgraded to Basic - saved to Firestore');
            } catch (err) {
                console.error('[Subscription] Firestore save error:', err);
                alert("Failed to sync premium status to cloud. Please contact support.");
            }
        }
    }, [currentUser]);

    const value = {
        tier,
        setTier,
        subscriptionStatus,
        subscriptionExpiry,
        canUseFeature,
        incrementUsage,
        getRemainingUses,
        showUpgradeModal,
        setShowUpgradeModal,
        upgradeFeature,
        triggerUpgradeModal,
        upgradeToGo,
        upgradeToPro,
        downgradeToBasic,
        isDevMode: isDevMode(),
        isGo: tier === 'go',
        isPro: tier === 'pro' || tier === 'dev' || isDevMode(),
        isLoadingSubscription,
        BASIC_LIMITS,
        GO_LIMITS
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};
