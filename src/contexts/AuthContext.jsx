import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, getAdditionalUserInfo, deleteUser } from 'firebase/auth';
import { ensureUserDocument } from '../utils/firestoreSubscription';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const additionalInfo = getAdditionalUserInfo(result);
            if (additionalInfo && additionalInfo.isNewUser) {
                localStorage.setItem('showOnboarding', 'true');
            }

            // Ensure Firestore user document exists (creates with default "basic" plan if new)
            try {
                await ensureUserDocument(result.user);
                console.log('[Auth] Firestore user document ensured after Google sign-in');
            } catch (firestoreErr) {
                console.error('[Auth] Firestore ensureUserDocument failed (non-blocking):', firestoreErr);
                // Non-blocking — auth still succeeds even if Firestore write fails
            }

            return result.user;
        } catch (error) {
            console.error("Google Sign In Error:", error);
            throw error;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const deleteAccount = async () => {
        if (auth.currentUser) {
            try {
                await deleteUser(auth.currentUser);
            } catch (error) {
                console.error("Error deleting user:", error);
                throw error;
            }
        }
    };

    useEffect(() => {
        console.log("AuthContext: Setting up listener");
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("AuthContext: User Changed", user);
            setCurrentUser(user);
            setLoading(false);

            // On auth state restored (page reload, returning user), ensure Firestore doc exists
            if (user) {
                try {
                    await ensureUserDocument(user);
                } catch (err) {
                    console.error('[Auth] ensureUserDocument on auth restore failed (non-blocking):', err);
                }
            }
        }, (error) => {
            console.error("AuthContext: Error", error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithGoogle,
        logout,
        deleteAccount,
        loading
    };

    // Non-blocking loading to prevent white screen (black text on black bg)
    // if (loading) return <div>...</div>;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
