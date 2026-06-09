import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, getAdditionalUserInfo, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ensureUserDocument } from '../utils/firestoreSubscription';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // 'cadet' | 'co' | null
    const [isRoleSet, setIsRoleSet] = useState(null); // null = loading, true = role set, false = no role

    const assignRole = async (role, accessCode = null) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        
        if (role === 'co' && accessCode !== 'NCC-CO-2026') {
            throw new Error("Invalid access code for Commanding Officer");
        }

        try {
            await setDoc(doc(db, 'userRoles', auth.currentUser.uid), { role }, { merge: true });
            setUserRole(role);
            setIsRoleSet(true);
        } catch (error) {
            console.warn("Firestore error assigning role, falling back to local storage:", error);
            localStorage.setItem(`samvada_role_${auth.currentUser.uid}`, role);
            setUserRole(role);
            setIsRoleSet(true);
        }
    };

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
        setUserRole(null);
        setIsRoleSet(null);
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

            if (user) {
                // Fetch role
                try {
                    const roleDoc = await getDoc(doc(db, 'userRoles', user.uid));
                    if (roleDoc.exists() && roleDoc.data().role) {
                        setUserRole(roleDoc.data().role);
                        setIsRoleSet(true);
                    } else {
                        const localRole = localStorage.getItem(`samvada_role_${user.uid}`);
                        if (localRole) {
                            setUserRole(localRole);
                            setIsRoleSet(true);
                        } else {
                            setUserRole(null);
                            setIsRoleSet(false);
                        }
                    }
                } catch (err) {
                    console.error('[Auth] Failed to fetch user role:', err);
                    const localRole = localStorage.getItem(`samvada_role_${user.uid}`);
                    if (localRole) {
                        setUserRole(localRole);
                        setIsRoleSet(true);
                    } else {
                        setUserRole(null);
                        setIsRoleSet(false);
                    }
                }

                // Ensure Firestore user document exists
                try {
                    await ensureUserDocument(user);
                } catch (err) {
                    console.error('[Auth] ensureUserDocument on auth restore failed (non-blocking):', err);
                }
            } else {
                setUserRole(null);
                setIsRoleSet(false); // No user = definitively no role
            }
            
            setLoading(false);
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
        loading,
        userRole,
        isRoleSet,
        assignRole
    };

    // Non-blocking loading to prevent white screen (black text on black bg)
    // if (loading) return <div>...</div>;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
