import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserPreferencesContext = createContext();

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    const [globalInstructions, setGlobalInstructions] = useState('');
    const [understandingLevel, setUnderstandingLevel] = useState('auto'); // 'auto', 'beginner', 'intermediate', 'expert'

    // Load from localStorage and Firebase on mount or user change
    useEffect(() => {
        const loadPreferences = async () => {
            if (!currentUser?.uid) {
                setGlobalInstructions('');
                setUnderstandingLevel('auto');
                return;
            }

            try {
                const storedPrefs = localStorage.getItem(`aurem_prefs_${currentUser.uid}`);
                if (storedPrefs) {
                    const parsed = JSON.parse(storedPrefs);
                    setGlobalInstructions(parsed.globalInstructions || '');
                    setUnderstandingLevel(parsed.understandingLevel || 'auto');
                }

                // Sync from Firebase
                const docRef = doc(db, 'userPreferences', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.globalInstructions !== undefined) {
                        setGlobalInstructions(data.globalInstructions);
                    }
                    if (data.understandingLevel !== undefined) {
                        setUnderstandingLevel(data.understandingLevel);
                    }
                    localStorage.setItem(`aurem_prefs_${currentUser.uid}`, JSON.stringify({
                        globalInstructions: data.globalInstructions || '',
                        understandingLevel: data.understandingLevel || 'auto'
                    }));
                }
            } catch (e) {
                console.error("Failed to load user preferences", e);
            }
        };
        loadPreferences();
    }, [currentUser]);

    // Save to localStorage and Firebase whenever it changes
    useEffect(() => {
        if (!currentUser?.uid) return;
        
        const savePreferences = async () => {
            try {
                const prefsObj = { globalInstructions, understandingLevel };
                localStorage.setItem(`aurem_prefs_${currentUser.uid}`, JSON.stringify(prefsObj));
                
                const docRef = doc(db, 'userPreferences', currentUser.uid);
                await setDoc(docRef, prefsObj, { merge: true });
            } catch (e) {
                console.error("Failed to save user preferences to cloud", e);
            }
        };
        
        const timeoutId = setTimeout(savePreferences, 1500);
        return () => clearTimeout(timeoutId);
    }, [globalInstructions, understandingLevel, currentUser]);

    const value = {
        globalInstructions,
        setGlobalInstructions,
        understandingLevel,
        setUnderstandingLevel
    };

    return (
        <UserPreferencesContext.Provider value={value}>
            {children}
        </UserPreferencesContext.Provider>
    );
};
