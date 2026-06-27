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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        const loadPerformance = async () => {
            if (!currentUser?.uid) {
                setPerformanceData([]);
                setXp(0);
                setIsLoaded(true);
                return;
            }

            try {
                const storedPerf = localStorage.getItem(`aurem_perf_${currentUser.uid}`);
                if (storedPerf) setPerformanceData(JSON.parse(storedPerf));
                
                const storedXp = localStorage.getItem(`aurem_xp_${currentUser.uid}`);
                if (storedXp) setXp(parseInt(storedXp, 10));

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
            } finally {
                setIsLoaded(true);
            }
        };
        loadPerformance();
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser?.uid || !isLoaded) return;
        
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
    }, [performanceData, xp, currentUser, isLoaded]);

    const addRecord = (featureId, score) => {
        const newRecord = {
            id: Date.now().toString(),
            featureId,
            score: Number(score),
            timestamp: new Date().toISOString()
        };

        setPerformanceData(prev => {
            const updated = [newRecord, ...prev];
            return updated.slice(0, 50);
        });
    };

    const getRecords = (featureId = null) => {
        if (featureId) {
            return performanceData.filter(r => r.featureId === featureId);
        }
        return performanceData;
    };

    const getDifficultyLevel = (scoreOverride = null) => {
        let scoreToUse = scoreOverride;

        if (scoreToUse === null) {
            if (performanceData.length === 0) return 'intermediate';

            const recent = performanceData.slice(0, 3);
            const sum = recent.reduce((acc, curr) => acc + curr.score, 0);
            scoreToUse = sum / recent.length;
        }

        if (scoreToUse <= 60) return 'easy';
        if (scoreToUse <= 80) return 'intermediate';
        return 'hard';
    };

    const addXp = (amount) => {
        setXp(prev => prev + amount);
    };

    const getLevelInfo = () => {
        const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
        const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
        const xpIntoLevel = xp - xpForCurrentLevel;
        const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
        const progressPercentage = (xpIntoLevel / xpNeededForNext) * 100;

        let rankTitle = "Cadet";
        let rankAbbr = "CDT";
        
        if (currentLevel >= 5) { rankTitle = "Lance Corporal"; rankAbbr = "L/CPL"; }
        if (currentLevel >= 10) { rankTitle = "Corporal"; rankAbbr = "CPL"; }
        if (currentLevel >= 20) { rankTitle = "Sergeant"; rankAbbr = "SGT"; }
        if (currentLevel >= 35) { rankTitle = "Under Officer"; rankAbbr = "UO"; }
        if (currentLevel >= 50) { rankTitle = "Senior Under Officer"; rankAbbr = "SUO"; }

        return {
            level: currentLevel,
            rankTitle,
            rankAbbr,
            xp,
            xpForNextLevel,
            progressPercentage: Math.min(100, Math.max(0, progressPercentage))
        };
    };

    const getPerformanceData = () => {
        const quizzesTaken = performanceData.length;
        const accuracy = quizzesTaken === 0 ? 0 : performanceData.reduce((acc, curr) => acc + curr.score, 0) / (quizzesTaken * 100);
        return { accuracy, quizzesTaken };
    };

    const value = {
        performanceData,
        addRecord,
        getRecords,
        getDifficultyLevel,
        xp,
        addXp,
        getLevelInfo,
        getPerformanceData
    };

    return (
        <PerformanceContext.Provider value={value}>
            {children}
        </PerformanceContext.Provider>
    );
};
