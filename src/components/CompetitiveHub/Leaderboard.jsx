import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { Trophy, Users, Star, Crown, ChevronLeft } from '../Icons';
import { useAuth } from '../../contexts/AuthContext';

const Leaderboard = ({ onBack }) => {
    const { currentUser } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // Fetch top 20 users by XP
                const q = query(
                    collection(db, 'userPerformance'),
                    orderBy('xp', 'desc'),
                    limit(20)
                );
                const snapshot = await getDocs(q);
                
                const boardData = [];
                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    const uid = docSnap.id;
                    
                    // Fetch user details to get displayName
                    let displayName = 'Anonymous Voyager';
                    let photoURL = null;
                    try {
                        const userSnap = await getDoc(doc(db, 'users', uid));
                        if (userSnap.exists()) {
                            displayName = userSnap.data().displayName || displayName;
                            photoURL = userSnap.data().photoURL || null;
                        }
                    } catch (e) {
                        console.warn("Could not fetch user info for", uid);
                    }

                    const xp = data.xp || 0;
                    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
                    
                    let rankTitle = "Novice";
                    if (level >= 5) rankTitle = "Apprentice";
                    if (level >= 15) rankTitle = "Scholar";
                    if (level >= 30) rankTitle = "Master";
                    if (level >= 50) rankTitle = "Grandmaster";

                    boardData.push({
                        uid,
                        xp,
                        level,
                        rankTitle,
                        displayName,
                        photoURL
                    });
                }
                
                setLeaderboard(boardData);
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const currentUserRank = leaderboard.findIndex(u => u.uid === currentUser?.uid) + 1;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar relative bg-theme-bg">
            <div className="max-w-[1000px] mx-auto p-4 md:p-8 xl:px-12 space-y-8 relative z-10 pb-24">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full glass-input text-theme-muted hover:text-theme-text transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-theme-text flex items-center gap-3">
                            <span className="text-4xl drop-shadow-md">🏆</span> Hall of Fame
                        </h1>
                        <p className="text-sm font-bold text-theme-muted uppercase tracking-widest mt-1">
                            Top Voyagers by XP
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                        <p className="text-theme-muted text-xs font-bold uppercase tracking-widest">Loading Rankings...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Current User Stats */}
                        {currentUserRank > 0 && (
                            <div className="p-6 rounded-[2rem] bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30">
                                        #{currentUserRank}
                                    </div>
                                    <div>
                                        <p className="text-theme-text font-black text-lg">Your Ranking</p>
                                        <p className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Keep pushing, Voyager!</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                                        {leaderboard[currentUserRank - 1].xp} XP
                                    </p>
                                    <p className="text-theme-muted text-xs font-bold uppercase tracking-widest">Level {leaderboard[currentUserRank - 1].level}</p>
                                </div>
                            </div>
                        )}

                        {/* Leaderboard List */}
                        <div className="beach-card overflow-hidden">
                            {leaderboard.map((user, index) => (
                                <div 
                                    key={user.uid} 
                                    className={`flex items-center gap-4 p-5 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 transition-colors ${
                                        user.uid === currentUser?.uid ? 'bg-amber-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 ${
                                        index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/30' :
                                        index === 1 ? 'bg-slate-300 text-slate-800 shadow-md shadow-slate-300/30' :
                                        index === 2 ? 'bg-amber-700 text-amber-100 shadow-md shadow-amber-700/30' :
                                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                        {index < 3 ? <Crown className="w-5 h-5" /> : `#${index + 1}`}
                                    </div>

                                    <div className="flex-1 min-w-0 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 overflow-hidden shadow-inner border-2 border-white/20">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                                                    {user.displayName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-theme-text font-black text-lg truncate flex items-center gap-2">
                                                {user.displayName}
                                                {user.uid === currentUser?.uid && <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] uppercase tracking-widest">You</span>}
                                            </p>
                                            <p className="text-theme-muted text-xs font-bold uppercase tracking-widest truncate">
                                                Level {user.level} <span className="opacity-50 mx-1">•</span> {user.rankTitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-end gap-1.5">
                                            {user.xp} <Star className="w-4 h-4 text-amber-500" />
                                        </p>
                                        <p className="text-theme-muted text-[10px] uppercase tracking-widest font-bold">Total XP</p>
                                    </div>
                                </div>
                            ))}
                            {leaderboard.length === 0 && !loading && (
                                <div className="p-12 text-center text-theme-muted">
                                    <p className="text-4xl mb-4">🏜️</p>
                                    <p className="font-bold text-lg">No voyagers found.</p>
                                    <p className="text-sm">Be the first to start your journey!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
