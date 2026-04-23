import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);

export const PerformanceProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [performanceData, setPerformanceData] = useState([]);
    const [xp, setXp] = useState(0);

    // Load from localStorage and Firebase on mount or user change
    useEffect(() => {
        const loadPerformance = async () => {
            if (!currentUser?.uid) {
                setPerformanceData([]);
                return;
            }

            try {
                const storedPerf = localStorage.getItem(`aurem_perf_${currentUser.uid}`);
                if (storedPerf) setPerformanceData(JSON.parse(storedPerf));
                
                const storedXp = localStorage.getItem(`aurem_xp_${currentUser.uid}`);
                if (storedXp) setXp(parseInt(storedXp, 10));

                // Sync from Firebase
                const docRef = doc(db, 'userPerformance', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.performanceData) {
                        setPerformanceData(data.performanceData);
                        localStorage.setItem(`aurem_perf_${currentUser.uid}`, JSON.stringify(data.performanceData));
                    }
                    if (data.xp !== undefined) {
                        setXp(data.xp);
                        localStorage.setItem(`aurem_xp_${currentUser.uid}`, data.xp.toString());
                    }
                }
            } catch (e) {
                console.error("Failed to load performance data", e);
            }
        };
        loadPerformance();
    }, [currentUser]);

    // Save to localStorage and Firebase whenever it changes
    useEffect(() => {
        if (!currentUser?.uid) return;
        
        const savePerformance = async () => {
            try {
                localStorage.setItem(`aurem_perf_${currentUser.uid}`, JSON.stringify(performanceData));
                localStorage.setItem(`aurem_xp_${currentUser.uid}`, xp.toString());
                
                const docRef = doc(db, 'userPerformance', currentUser.uid);
                await setDoc(docRef, { performanceData, xp }, { merge: true });
            } catch (e) {
                console.error("Failed to save performance data to cloud", e);
            }
        };
        
        const timeoutId = setTimeout(savePerformance, 1500);
        return () => clearTimeout(timeoutId);
    }, [performanceData, xp, currentUser]);

    // Add a new performance record (score out of 100)
    const addRecord = (featureId, score) => {
        const newRecord = {
            id: Date.now().toString(),
            featureId,
            score: Number(score),
            timestamp: new Date().toISOString()
        };

        setPerformanceData(prev => {
            // Keep only the last 50 recs to prevent bloating
            const updated = [newRecord, ...prev];
            return updated.slice(0, 50);
        });
    };

    // Get all records for a specific feature, or all if none specified
    const getRecords = (featureId = null) => {
        if (featureId) {
            return performanceData.filter(r => r.featureId === featureId);
        }
        return performanceData;
    };

    // Determine difficulty level based on recent average or specific score
    // 0-60: easy, 61-80: intermediate, 81-100: hard
    const getDifficultyLevel = (scoreOverride = null) => {
        let scoreToUse = scoreOverride;

        if (scoreToUse === null) {
            if (performanceData.length === 0) return 'intermediate'; // Default

            // Average last 3 scores to determine current level
            const recent = performanceData.slice(0, 3);
            const sum = recent.reduce((acc, curr) => acc + curr.score, 0);
            scoreToUse = sum / recent.length;
        }

        if (scoreToUse <= 60) return 'easy';
        if (scoreToUse <= 80) return 'intermediate';
        return 'hard';
    };

    // ═══════════════════════════════════
    // GAMIFICATION (XP & LEVEL)
    // ═══════════════════════════════════
    const addXp = (amount) => {
        setXp(prev => prev + amount);
    };

    const getLevelInfo = () => {
        // Simple scaling: Lvl 1 = 0 XP, Lvl 2 = 100 XP, Lvl 3 = 400 XP... Level = floor(sqrt(xp/100)) + 1
        const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
        
        // XP required for next level = (currentLevel)^2 * 100
        const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
        
        // XP required for current level = (currentLevel - 1)^2 * 100
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
        
        // Progress into current level
        const xpIntoLevel = xp - xpForCurrentLevel;
        const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
        const progressPercentage = (xpIntoLevel / xpNeededForNext) * 100;

        let rankTitle = "Novice";
        if (currentLevel >= 5) rankTitle = "Apprentice";
        if (currentLevel >= 15) rankTitle = "Scholar";
        if (currentLevel >= 30) rankTitle = "Master";
        if (currentLevel >= 50) rankTitle = "Grandmaster";

        return {
            level: currentLevel,
            rankTitle,
            xp,
            xpForNextLevel,
            progressPercentage: Math.min(100, Math.max(0, progressPercentage))
        };
    };

    const value = {
        performanceData,
        addRecord,
        getRecords,
        getDifficultyLevel,
        xp,
        addXp,
        getLevelInfo
    };

    return (
        <PerformanceContext.Provider value={value}>
            {children}
        </PerformanceContext.Provider>
    );
};
