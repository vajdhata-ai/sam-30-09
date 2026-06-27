import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); 
    const [userProfile, setUserProfile] = useState(null);
    const [isRoleSet, setIsRoleSet] = useState(false);

    // Track whether loginWithCredentials already set the role (to avoid race with onAuthStateChanged)
    const roleSetByLogin = React.useRef(false);

    const loginWithCredentials = async (regNumber, password, role) => {
        try {
            if (!regNumber || !password) throw new Error("Please fill in all fields.");
            if (role === 'co' && password !== 'admin123') throw new Error("Invalid Officer credentials.");
            
            const sanitizedReg = regNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const email = `${sanitizedReg}@ncc.com`;
            
            roleSetByLogin.current = true;
            setUserRole(role);
            setIsRoleSet(true);
            localStorage.setItem('userRole', role);

            let userCredential;
            try {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                console.warn("SignIn failed, attempting create:", err.code);
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
                    try {
                        userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    } catch (createErr) {
                        console.error("CreateUser failed:", createErr.code, createErr.message);
                        roleSetByLogin.current = false;
                        setUserRole(null);
                        setIsRoleSet(false);
                        localStorage.removeItem('userRole');
                        throw createErr;
                    }
                } else {
                    roleSetByLogin.current = false;
                    setUserRole(null);
                    setIsRoleSet(false);
                    localStorage.removeItem('userRole');
                    throw err;
                }
            }

            const user = userCredential.user;
            
            // Save role to Firestore
            try {
                await setDoc(doc(db, 'userRoles', user.uid), { role, regimentalNumber: regNumber }, { merge: true });
                
                // Fetch profile if exists
                const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
                if (profileDoc.exists()) {
                    setUserProfile(profileDoc.data());
                } else {
                    // Create default profile for new users
                    const defaultProfile = {
                        regimentalNumber: regNumber,
                        wing: 'army',
                        certificateLevel: 'B',
                        battalion: '1st Battalion',
                        rank: role === 'co' ? 'Lieutenant' : 'Cadet'
                    };
                    await setDoc(doc(db, 'userProfiles', user.uid), defaultProfile, { merge: true });
                    setUserProfile(defaultProfile);
                }
            } catch (e) {
                console.warn("Firestore save/fetch failed, relying on local auth state", e);
            }

            setCurrentUser(user);
            return user;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const updateProfile = async (profileData) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        try {
            await setDoc(doc(db, 'userProfiles', auth.currentUser.uid), profileData, { merge: true });
            setUserProfile(prev => ({ ...prev, ...profileData }));
        } catch (e) {
            console.error("Failed to update profile", e);
            throw e;
        }
    };

    const assignRole = async (role, accessCode = null) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        if (role === 'co' && accessCode !== 'NCC-CO-2026') {
            throw new Error("Invalid access code for Commanding Officer");
        }
        try {
            await setDoc(doc(db, 'userRoles', auth.currentUser.uid), { role }, { merge: true });
        } catch (e) {
            console.warn("Firestore save blocked, relying on local auth state", e);
        }
        setUserRole(role);
        setIsRoleSet(true);
        localStorage.setItem('userRole', role);
    };

    const logout = async () => {
        setUserRole(null);
        setUserProfile(null);
        setIsRoleSet(false);
        localStorage.removeItem('userRole');
        await signOut(auth);
    };

    const deleteAccount = async () => {
        logout();
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                if (roleSetByLogin.current) {
                    roleSetByLogin.current = false;
                    setLoading(false);
                    return;
                }

                try {
                    const [roleDoc, profileDoc] = await Promise.all([
                        getDoc(doc(db, 'userRoles', user.uid)),
                        getDoc(doc(db, 'userProfiles', user.uid))
                    ]);

                    if (roleDoc.exists() && roleDoc.data().role) {
                        setUserRole(roleDoc.data().role);
                        setIsRoleSet(true);
                        localStorage.setItem('userRole', roleDoc.data().role);
                    } else {
                        const localRole = localStorage.getItem('userRole');
                        if (localRole) {
                            setUserRole(localRole);
                            setIsRoleSet(true);
                        } else {
                            setUserRole('cadet');
                            setIsRoleSet(true);
                        }
                    }

                    if (profileDoc.exists()) {
                        setUserProfile(profileDoc.data());
                    }
                } catch (err) {
                    console.error('[Auth] Failed to fetch data from Firestore. Falling back to local storage:', err);
                    const localRole = localStorage.getItem('userRole');
                    if (localRole) {
                        setUserRole(localRole);
                        setIsRoleSet(true);
                    } else {
                        setUserRole('cadet');
                        setIsRoleSet(true);
                    }
                }
            } else {
                setUserRole(null);
                setUserProfile(null);
                setIsRoleSet(false);
                localStorage.removeItem('userRole');
            }
            
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithCredentials,
        logout,
        deleteAccount,
        loading,
        userRole,
        userProfile,
        updateProfile,
        isRoleSet,
        assignRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
