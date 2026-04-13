/**
 * Competitive Hub — Firebase Service Layer
 * All Firestore operations for the competitive hub feature.
 */
import { db } from '../firebase';
import {
    doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs,
    addDoc, deleteDoc, writeBatch, serverTimestamp, orderBy
} from 'firebase/firestore';

// ═══ PROFILE ═══
export async function getCompetitiveProfile(uid) {
    const cacheKey = `competitive_profile_${uid}`;
    // Fast cache return
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        // Sync in background
        getDoc(doc(db, 'competitiveProfiles', uid)).then(snap => {
            if (snap.exists()) localStorage.setItem(cacheKey, JSON.stringify(snap.data()));
        }).catch(console.error);
        return JSON.parse(cached);
    }

    const ref = doc(db, 'competitiveProfiles', uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : null;
    if (data) localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
}

export async function saveCompetitiveProfile(uid, data) {
    const cacheKey = `competitive_profile_${uid}`;
    
    // Optimistic cache update
    const current = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    localStorage.setItem(cacheKey, JSON.stringify({ ...current, ...data }));

    const ref = doc(db, 'competitiveProfiles', uid);
    await setDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

// ═══ USER EXAMS ═══
export async function saveUserExam(uid, examData) {
    const id = `${uid}_${examData.examSlug}`;
    const cacheKey = `competitive_exams_${uid}`;
    
    // Optimistically update cache so getUserExams returns this exam instantly
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    const idx = existing.findIndex(e => e.examSlug === examData.examSlug);
    const entry = { id, userId: uid, ...examData };
    if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...entry };
    } else {
        existing.push(entry);
    }
    localStorage.setItem(cacheKey, JSON.stringify(existing));

    const ref = doc(db, 'competitiveUserExams', id);
    await setDoc(ref, {
        userId: uid,
        ...examData,
        createdAt: serverTimestamp()
    }, { merge: true });
    return id;
}

export async function getUserExams(uid) {
    const cacheKey = `competitive_exams_${uid}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        // Background sync
        const q = query(collection(db, 'competitiveUserExams'), where('userId', '==', uid));
        getDocs(q).then(snap => {
            const freshData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            localStorage.setItem(cacheKey, JSON.stringify(freshData));
        }).catch(console.error);
        return JSON.parse(cached);
    }

    const q = query(collection(db, 'competitiveUserExams'), where('userId', '==', uid));
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
}

export async function updateUserExam(docId, data) {
    const ref = doc(db, 'competitiveUserExams', docId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    // Note: Can't easily update local array cache without uid, so let the background sync handle it next load.
}

// ═══ TOPIC PROGRESS ═══
export async function getTopicProgress(uid, examSlug) {
    const cacheKey = `competitive_progress_${uid}_${examSlug}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        // Background sync
        const q = query(
            collection(db, 'competitiveTopicProgress'),
            where('userId', '==', uid),
            where('examSlug', '==', examSlug)
        );
        getDocs(q).then(snap => {
            const map = {};
            snap.docs.forEach(d => { map[d.data().topicId] = { id: d.id, ...d.data() }; });
            localStorage.setItem(cacheKey, JSON.stringify(map));
        }).catch(console.error);
        return JSON.parse(cached);
    }

    const q = query(
        collection(db, 'competitiveTopicProgress'),
        where('userId', '==', uid),
        where('examSlug', '==', examSlug)
    );
    const snap = await getDocs(q);
    const map = {};
    snap.docs.forEach(d => { map[d.data().topicId] = { id: d.id, ...d.data() }; });
    localStorage.setItem(cacheKey, JSON.stringify(map));
    return map;
}

export async function updateTopicProgress(uid, topicId, examSlug, data) {
    const cacheKey = `competitive_progress_${uid}_${examSlug}`;
    const id = `${uid}_${topicId}`;
    
    // Optimistic cache update
    const currentMap = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    currentMap[topicId] = { ...currentMap[topicId], ...data, topicId, examSlug, userId: uid };
    localStorage.setItem(cacheKey, JSON.stringify(currentMap));

    const ref = doc(db, 'competitiveTopicProgress', id);
    await setDoc(ref, {
        userId: uid,
        topicId,
        examSlug,
        ...data,
        lastAccessed: serverTimestamp()
    }, { merge: true });
}

// ═══ ANSWERS ═══
export async function saveUserAnswer(uid, answerData) {
    await addDoc(collection(db, 'competitiveAnswers'), {
        userId: uid,
        ...answerData,
        attemptedAt: serverTimestamp()
    });
}

export async function getTopicAnswers(uid, topicId) {
    const q = query(
        collection(db, 'competitiveAnswers'),
        where('userId', '==', uid),
        where('topicId', '==', topicId),
        orderBy('attemptedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ═══ DAILY TASKS (TIMETABLE) ═══
export async function saveDailyTasks(uid, examSlug, schedule) {
    // Firestore limit is 500 writes per batch. We chunk at 400 for safety.
    const CHUNK_SIZE = 400; 
    let currentBatch = writeBatch(db);
    let currentCount = 0;
    const allBatches = [];

    const getWritableBatch = () => {
        if (currentCount >= CHUNK_SIZE) {
            allBatches.push(currentBatch);
            currentBatch = writeBatch(db);
            currentCount = 0;
        }
        currentCount++;
        return currentBatch;
    };

    // Delete old future tasks first
    const oldQ = query(
        collection(db, 'competitiveDailyTasks'),
        where('userId', '==', uid),
        where('examSlug', '==', examSlug),
        where('isCompleted', '==', false)
    );
    const oldSnap = await getDocs(oldQ);
    oldSnap.docs.forEach(d => {
        getWritableBatch().delete(d.ref);
    });

    // Write new schedule
    schedule.forEach(day => {
        day.topicIds.forEach(topicId => {
            const ref = doc(collection(db, 'competitiveDailyTasks'));
            getWritableBatch().set(ref, {
                userId: uid,
                examSlug,
                topicId,
                scheduledDate: day.date,
                isCompleted: false,
                createdAt: serverTimestamp()
            });
        });
    });

    // Push the last batch if it has operations
    if (currentCount > 0) {
        allBatches.push(currentBatch);
    }

    // Commit all non-empty batches
    for (const batch of allBatches) {
        await batch.commit();
    }
}

export async function getTodayDailyTasks(uid, examSlug) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
        collection(db, 'competitiveDailyTasks'),
        where('userId', '==', uid),
        where('examSlug', '==', examSlug),
        where('scheduledDate', '==', today)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function markTaskComplete(taskDocId) {
    const ref = doc(db, 'competitiveDailyTasks', taskDocId);
    await updateDoc(ref, { isCompleted: true, completedAt: serverTimestamp() });
}

// ═══ STREAKS ═══
export async function getStreakData(uid) {
    const profile = await getCompetitiveProfile(uid);
    return {
        streakCount: profile?.streakCount || 0,
        longestStreak: profile?.longestStreak || 0,
        lastActiveDate: profile?.lastActiveDate || null,
        xpTotal: profile?.xpTotal || 0
    };
}

export async function updateStreak(uid, tasksCompleted) {
    const today = new Date().toISOString().split('T')[0];
    const logRef = doc(db, 'competitiveStreakLogs', `${uid}_${today}`);
    await setDoc(logRef, { userId: uid, logDate: today, tasksCompleted }, { merge: true });

    const profile = await getCompetitiveProfile(uid);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (profile?.lastActiveDate === yesterdayStr) {
        newStreak = (profile.streakCount || 0) + 1;
    } else if (profile?.lastActiveDate === today) {
        newStreak = profile.streakCount || 1;
    }

    const longest = Math.max(newStreak, profile?.longestStreak || 0);
    await saveCompetitiveProfile(uid, {
        streakCount: newStreak,
        longestStreak: longest,
        lastActiveDate: today
    });
    return newStreak;
}

export async function addXP(uid, amount) {
    const profile = await getCompetitiveProfile(uid);
    const newXP = (profile?.xpTotal || 0) + amount;
    await saveCompetitiveProfile(uid, { xpTotal: newXP });
    return newXP;
}

// ═══ ONBOARDING CHECK ═══
export async function hasCompletedOnboarding(uid) {
    const profile = await getCompetitiveProfile(uid);
    return profile?.onboardingComplete === true;
}

export async function completeOnboarding(uid) {
    await saveCompetitiveProfile(uid, { onboardingComplete: true });
}
