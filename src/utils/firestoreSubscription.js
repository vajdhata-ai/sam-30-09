/**
 * firestoreSubscription.js
 * 
 * Standalone Firestore utility functions for user document management
 * and subscription persistence. These are NOT React hooks — they can
 * be used from any context (hooks, event handlers, server-side, etc.)
 * 
 * Collection: users/{uid}
 */

import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// ═══════════════════════════════════
// USER DOCUMENT MANAGEMENT
// ═══════════════════════════════════

/**
 * Ensures a Firestore user document exists for the given Firebase Auth user.
 * If the document already exists, updates lastLogin.
 * If it doesn't exist, creates it with default "basic" (free) subscription.
 * 
 * @param {Object} user - Firebase Auth user object (uid, email, displayName, photoURL)
 * @returns {Object} The user document data
 */
export async function ensureUserDocument(user) {
    if (!user?.uid) {
        throw new Error('[Firestore] ensureUserDocument called without a valid user');
    }

    const userDocRef = doc(db, 'users', user.uid);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            // Document exists — update lastLogin and any changed profile fields
            const existingData = userDoc.data();
            const updates = {
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Sync profile fields that may have changed (e.g., after Google profile update)
            if (user.email && user.email !== existingData.email) updates.email = user.email;
            if (user.displayName && user.displayName !== existingData.displayName) updates.displayName = user.displayName;
            if (user.photoURL && user.photoURL !== existingData.photoURL) updates.photoURL = user.photoURL;

            await setDoc(userDocRef, updates, { merge: true });

            console.log('[Firestore] User document updated (lastLogin):', user.uid);
            return { ...existingData, ...updates };
        } else {
            // New user — create document with default subscription
            const newUserData = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                subscriptionPlan: 'basic',         // "basic" | "go" | "pro"
                subscriptionStatus: 'active',       // "active" | "expired" | "cancelled"
                subscriptionExpiry: null,            // null = no expiry (free tier) | Timestamp
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            };

            await setDoc(userDocRef, newUserData);
            console.log('[Firestore] New user document created:', user.uid);
            return newUserData;
        }
    } catch (error) {
        console.error('[Firestore] Error in ensureUserDocument:', error);
        throw error;
    }
}


// ═══════════════════════════════════
// SUBSCRIPTION READS
// ═══════════════════════════════════

/**
 * Reads the subscription data for a given user from Firestore.
 * 
 * @param {string} uid - Firebase Auth UID
 * @returns {Object|null} { plan, status, expiry } or null if not found
 */
export async function getUserSubscription(uid) {
    if (!uid) return null;

    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.warn('[Firestore] getUserSubscription: No document for uid:', uid);
            return null;
        }

        const data = userDoc.data();

        // Backward-compatible read: check both old and new field names
        const plan = data.subscriptionPlan || data.subscriptionTier || 'basic';
        const status = data.subscriptionStatus || 'active';
        const expiry = data.subscriptionExpiry || null;

        return { plan, status, expiry };
    } catch (error) {
        console.error('[Firestore] getUserSubscription error:', error);
        return null;
    }
}


/**
 * Quick boolean check: is this user on a premium (Go or Pro) plan
 * that hasn't expired?
 * 
 * @param {string} uid - Firebase Auth UID
 * @returns {Object} { isPremium: boolean, plan: string, expiry: Date|null }
 */
export async function isPremiumUser(uid) {
    const sub = await getUserSubscription(uid);

    if (!sub) {
        return { isPremium: false, plan: 'basic', expiry: null };
    }

    const { plan, status, expiry } = sub;

    // Check expiry if set
    if (expiry) {
        const expiryDate = expiry instanceof Timestamp ? expiry.toDate() : new Date(expiry);
        if (expiryDate < new Date()) {
            return { isPremium: false, plan, expiry: expiryDate };
        }
    }

    // Check status
    if (status === 'expired' || status === 'cancelled') {
        return { isPremium: false, plan, expiry: null };
    }

    // Go and Pro are premium
    const isPremium = plan === 'go' || plan === 'pro' || plan === 'dev';
    return { isPremium, plan, expiry: expiry ? (expiry instanceof Timestamp ? expiry.toDate() : new Date(expiry)) : null };
}


// ═══════════════════════════════════
// SUBSCRIPTION WRITES
// ═══════════════════════════════════

/**
 * Updates the subscription data for a user in Firestore.
 * 
 * @param {string} uid - Firebase Auth UID
 * @param {string} plan - "basic" | "go" | "pro"
 * @param {string} [status="active"] - "active" | "expired" | "cancelled"
 * @param {Date|null} [expiryDate=null] - When the subscription expires (null = never)
 */
export async function updateUserSubscription(uid, plan, status = 'active', expiryDate = null) {
    if (!uid) {
        throw new Error('[Firestore] updateUserSubscription called without uid');
    }

    const validPlans = ['basic', 'go', 'pro', 'dev'];
    if (!validPlans.includes(plan)) {
        throw new Error(`[Firestore] Invalid plan: ${plan}. Must be one of: ${validPlans.join(', ')}`);
    }

    try {
        const userDocRef = doc(db, 'users', uid);
        const updateData = {
            subscriptionPlan: plan,
            subscriptionStatus: status,
            subscriptionExpiry: expiryDate ? Timestamp.fromDate(new Date(expiryDate)) : null,
            updatedAt: serverTimestamp(),
        };

        // Also keep the legacy field in sync for backward compatibility
        updateData.subscriptionTier = plan;

        await setDoc(userDocRef, updateData, { merge: true });
        console.log(`[Firestore] Subscription updated: ${uid} → ${plan} (${status})`);
    } catch (error) {
        console.error('[Firestore] updateUserSubscription error:', error);
        throw error;
    }
}
