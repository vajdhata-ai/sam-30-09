import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExams, getTodayDailyTasks, markTaskComplete, getStreakData, updateStreak, addXP, getTopicProgress, updateTopicProgress } from '../../utils/competitiveHubService';
import { getGreeting, getStudyStats, rebalanceTimetable } from '../../utils/timetableEngine';
import { COMPETITIVE_EXAMS, getAllTopics, getTopicById } from '../../data/competitiveHubData';
import { saveDailyTasks } from '../../utils/competitiveHubService';
import ProgressRing from './components/ProgressRing';
import UpgradeModal from './components/UpgradeModal';
import RocketLoader from './components/RocketLoader';

const CompetitiveHome = ({ onStartStudy, onViewProgress, onExitHub, onSetupNewExam, onOpenSolver, onOpenMockTest, onOpenLearning, onOpenLeaderboard }) => {
    const { currentUser } = useAuth();
    const [userExams, setUserExams] = useState([]);
    const [activeExam, setActiveExam] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [topicProgress, setTopicProgress] = useState({});
    const [streak, setStreak] = useState({ streakCount: 0, xpTotal: 0 });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [dataError, setDataError] = useState(false);
    const [showApology, setShowApology] = useState(false);

    const uid = currentUser?.uid;
    const greeting = getGreeting(currentUser?.displayName || 'Student');

    useEffect(() => {
        if (uid) loadData();
    }, [uid]);

    useEffect(() => {
        // Show Aura apology shortly after the dashboard mounts
        const timer = setTimeout(() => setShowApology(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const loadData = async (retryCount = 0) => {
        setLoading(true);
        setDataError(false);
        try {
            // getUserExams already returns localStorage cache instantly if available
            // No artificial timeout — let Firestore respond naturally
            const exams = await getUserExams(uid);
            setUserExams(exams);
            const firstExam = exams[0];
            if (firstExam) {
                setActiveExam(firstExam);
                try { await loadExamData(firstExam); } catch (e) { console.warn('loadExamData failed:', e.message); }
            }
            try {
                const streakData = await getStreakData(uid);
                setStreak(streakData);
            } catch (e) { console.warn('Streak load failed:', e.message); }
        } catch (err) {
            console.error('Load error:', err);
            // Auto-retry once after 2 seconds before showing error
            if (retryCount < 1) {
                console.log('Auto-retrying loadData...');
                await new Promise(r => setTimeout(r, 2000));
                return loadData(retryCount + 1);
            }
            setDataError(true);
        } finally {
            setLoading(false);
        }
    };

    const loadExamData = async (exam) => {
        const [tasks, progress] = await Promise.all([
            getTodayDailyTasks(uid, exam.examSlug).catch(() => []),
            getTopicProgress(uid, exam.examSlug).catch(() => ({})),
        ]);
        setTodayTasks(tasks);
        setTopicProgress(progress);
        const allTopics = getAllTopics(exam.examSlug);
        const completedIds = Object.keys(progress).filter(k => progress[k].status === 'done');
        const studyStats = getStudyStats(allTopics, completedIds, exam.examDate);
        setStats(studyStats);
    };

    const switchExam = async (exam) => {
        setActiveExam(exam);
        await loadExamData(exam);
    };

    const handleCompleteTask = async (task) => {
        try {
            await markTaskComplete(task.id);
            await updateTopicProgress(uid, task.topicId, activeExam.examSlug, { status: 'done', auremLevel: 1 });
            await addXP(uid, 20);
            await updateStreak(uid, 1);

            const allTopics = getAllTopics(activeExam.examSlug);
            const progress = await getTopicProgress(uid, activeExam.examSlug);
            const completedIds = Object.keys(progress).filter(k => progress[k].status === 'done');
            const schedule = rebalanceTimetable(allTopics, completedIds, activeExam.examDate, activeExam.dailyHours);
            await saveDailyTasks(uid, activeExam.examSlug, schedule);

            await loadExamData(activeExam);
            const streakData = await getStreakData(uid);
            setStreak(streakData);
        } catch (err) {
            console.error('Complete task error:', err);
        }
    };

    const allDone = todayTasks.length > 0 && todayTasks.every(t => t.isCompleted);
    const examInfo = activeExam ? COMPETITIVE_EXAMS.find(e => e.slug === activeExam.examSlug) : null;

    const focusZone = Object.entries(topicProgress).find(([_, p]) => p.status === 'focus_zone');
    const focusTopic = focusZone ? getTopicById(activeExam?.examSlug, focusZone[0]) : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 gap-4">
                <div className="relative">
                    <span className="block w-12 h-12 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                    <span className="absolute inset-0 w-12 h-12 rounded-full border-4 border-violet-500/10 border-b-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">Loading Dashboard...</p>
            </div>
        );
    }

    // ═══ NO EXAMS — show setup prompt (immersive orbital view) ═══
    if (userExams.length === 0 && !dataError) {
        return (
            <div className="h-full relative overflow-hidden bg-[#050510] flex flex-col items-center justify-center">
                {/* Immersive Space Background */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[120px] -top-60 -right-60 animate-pulse" />
                    <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[100px] -bottom-40 -left-40 animate-pulse" style={{ animationDelay: '2s' }} />
                    {/* Tiny stars */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle" 
                             style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
                    ))}
                </div>

                <div className="relative z-10 p-8 max-w-xl mx-auto flex flex-col items-center gap-10 text-center animate-in fade-in zoom-in-95 duration-1000">
                    {onExitHub && (
                        <button onClick={onExitHub} className="absolute -top-32 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white/5 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
                            <span>←</span> Exit to Mission Control
                        </button>
                    )}
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-1000" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 border-2 border-pink-500/30 flex items-center justify-center shadow-2xl shadow-pink-500/10 ring-8 ring-pink-500/5">
                            <span className="text-6xl md:text-7xl animate-bounce-slow drop-shadow-2xl">🛰️</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Connection Established</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md">No Active Missions</h2>
                        <p className="text-white/40 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
                            Your dashboard is currently offline. Launch your first exam campaign to activate your AI-powered study plan and start earning XP, Voyager.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <button 
                            onClick={onSetupNewExam} 
                            className="group relative overflow-hidden px-10 py-6 rounded-3xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12" />
                            <span className="relative z-10">Initiate Launch Sequence →</span>
                        </button>
                        
                        <button onClick={loadData} className="text-white/20 hover:text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] transition-all mt-4 hover:tracking-[0.4em]">
                            ↻ Reconnect to Data Stream
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ═══ DATA ERROR — server unreachable, but exams may exist ═══
    if (dataError) {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 pointer-events-none" />
                <div className="relative z-10 p-6 md:p-10 max-w-lg mx-auto flex flex-col items-center justify-center min-h-full gap-6 text-center">
                    {onExitHub && (
                        <button onClick={onExitHub} className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-all hover:gap-3">
                            <span>←</span> Exit to Auremous
                        </button>
                    )}
                    <p className="text-5xl">📡</p>
                    <h2 className="text-2xl font-black text-white">Connection Lost</h2>
                    <p className="text-white/40 text-sm font-medium max-w-sm">
                        We couldn't reach the server. Your progress is safe — try reconnecting.
                    </p>
                    <button onClick={loadData} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                        ↻ Reconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar relative">
            {/* Beach Mesh Background */}
            <div className="beach-mesh" style={{position: 'fixed'}}>
                <div className="beach-orb beach-orb-1" />
                <div className="beach-orb beach-orb-2" />
                <div className="beach-orb beach-orb-3" />
            </div>

            <div className="max-w-[1400px] mx-auto p-4 md:p-8 xl:px-12 space-y-8 lg:space-y-10 relative z-10 pb-24">
                {/* Header */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-700 mb-2">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        {/* Exit Button */}
                        {onExitHub && (
                            <button
                                onClick={onExitHub}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-input text-theme-muted hover:text-theme-text font-bold text-xs uppercase tracking-widest transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/80 active:scale-95 group shadow-sm"
                            >
                                <span className="text-sm group-hover:-translate-x-0.5 transition-transform">←</span> Exit to Auremous
                            </button>
                        )}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-theme-text flex items-center gap-3 drop-shadow-sm">
                            <span className="text-4xl md:text-5xl animate-bounce-slow drop-shadow-md">{greeting.emoji}</span> {greeting.text}
                        </h1>
                        <div className="flex items-center gap-3 ml-auto">
                            <button 
                                onClick={() => setShowUpgrade(true)}
                                className="hidden md:flex px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all items-center gap-2"
                            >
                                ⭐ Pro
                            </button>
                        </div>
                    </div>
                    {/* Exam Switcher */}
                    {userExams.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            {userExams.map(exam => {
                                const info = COMPETITIVE_EXAMS.find(e => e.slug === exam.examSlug);
                                return (
                                    <button
                                        key={exam.id}
                                        onClick={() => switchExam(exam)}
                                        className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-sm ${
                                            activeExam?.id === exam.id
                                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30 scale-105 ring-4 ring-pink-400/20'
                                                : 'glass-input text-theme-muted hover:text-theme-text hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:scale-105'
                                        }`}
                                    >
                                        <span className="text-sm mr-1">{info?.flag}</span> {info?.name}
                                    </button>
                                );
                            })}
                            <button
                                onClick={onSetupNewExam}
                                className="px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase border border-pink-500/30 text-pink-500 hover:bg-pink-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                ➕ Add Exam
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* Left Column (8 cols): Progress & Tasks */}
                    <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
                        {/* Exam Status Card */}
                        {stats && examInfo && (
                            <div className="beach-card p-6 md:p-10 animate-in fade-in zoom-in-95 duration-700 delay-100 relative overflow-hidden group hover:shadow-2xl transition-all">
                                <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-10 relative z-10">
                                    <div className="flex-shrink-0 drop-shadow-2xl">
                                        <ProgressRing percent={stats.percent} size={150} color="#6366F1" strokeWidth={12} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left pt-2">
                                        <h2 className="text-2xl font-black text-theme-text mb-2 tracking-widest uppercase bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">{examInfo.name} Campaign</h2>
                                        <p className="text-6xl lg:text-7xl font-black text-theme-text mb-4 mt-2 tracking-tighter drop-shadow-sm">
                                            {stats.daysRemaining}<span className="text-lg font-bold text-theme-muted ml-3 tracking-widest uppercase">days left</span>
                                        </p>
                                        <p className={`text-sm font-bold px-5 py-2.5 inline-flex items-center gap-2 rounded-full shadow-sm backdrop-blur-md uppercase tracking-wider ${
                                            stats.status === 'on_track' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                            stats.status === 'tight' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                            stats.status === 'behind' ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                                        }`}>
                                            {stats.status === 'on_track' && <><span>✅</span> On track — crushing it, Voyager!</>}
                                            {stats.status === 'tight' && <><span>⚠️</span> Tight schedule — stay focused</>}
                                            {stats.status === 'behind' && <><span>🚨</span> Falling behind — increase daily hours</>}
                                            {stats.status === 'exam_passed' && <><span>📋</span> Campaign date has passed</>}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 md:gap-6 mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10">
                                    <div className="text-center p-5 rounded-[2rem] bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-600/30 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:rotate-2 transition-all duration-300 backdrop-blur-md cursor-default">
                                        <p className="text-3xl md:text-5xl font-black text-theme-text drop-shadow-sm">{stats.done}</p>
                                        <p className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase mt-3">✅ Conquered</p>
                                    </div>
                                    <div className="text-center p-5 rounded-[2rem] bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-600/30 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:-rotate-2 transition-all duration-300 backdrop-blur-md cursor-default">
                                        <p className="text-3xl md:text-5xl font-black text-theme-text drop-shadow-sm">{stats.remaining}</p>
                                        <p className="text-[10px] md:text-xs text-amber-600 dark:text-amber-400 font-extrabold tracking-widest uppercase mt-3">⏳ Remaining</p>
                                    </div>
                                    <div className="text-center p-5 rounded-[2rem] bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-600/30 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 backdrop-blur-md cursor-default">
                                        <p className="text-3xl md:text-5xl font-black text-theme-text drop-shadow-sm">{stats.total}</p>
                                        <p className="text-[10px] md:text-xs text-indigo-600 dark:text-indigo-400 font-extrabold tracking-widest uppercase mt-3">🎯 Total</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Syllabus Tracker Card */}
                        {stats && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 beach-card p-6 md:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-end mb-4 pr-2">
                                            <div>
                                                <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-theme-text flex items-center gap-3">
                                                    <span className="text-2xl drop-shadow-sm">🗺️</span> Syllabus Journey
                                                </h3>
                                                <p className="text-xs font-bold text-theme-muted uppercase tracking-widest mt-1">Track your macro progress</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-sm">{stats.percent}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-4 rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden shadow-inner mb-4">
                                            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 relative transition-all duration-1000 ease-out" style={{ width: `${stats.percent}%` }}>
                                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-theme-muted uppercase tracking-widest">
                                            <strong className="text-theme-text">{stats.done}</strong> completed <span className="mx-2 opacity-30">•</span> <strong className="text-theme-text">{stats.remaining}</strong> remaining topics
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onViewProgress(activeExam.examSlug)}
                                        className="w-full md:w-auto px-6 py-4 rounded-2xl glass-input text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest text-xs shadow-sm hover:shadow-md hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all flex-shrink-0 relative overflow-hidden group-hover:shadow-purple-500/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">Explore <span className="text-base">→</span></span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ⚔️ DAILY QUEST BOARD — AuDHD friendly: clear hierarchy, XP rewards, highlighted current objective */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 beach-card p-6 md:p-10 relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8 pl-1">
                                    <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-theme-text flex items-center gap-3">
                                        <span className="text-2xl drop-shadow-sm">⚔️</span> Daily Quests
                                    </h3>
                                    <div className="px-5 py-2 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-black uppercase tracking-widest shadow-inner border border-pink-500/10 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                        {todayTasks.filter(t => t.isCompleted).length} / {todayTasks.length} Complete
                                    </div>
                                </div>
                                
                                {todayTasks.length === 0 ? (
                                    <div className="p-12 text-center rounded-[2rem] border-dashed border-2 border-slate-300/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/20 backdrop-blur-sm">
                                        <p className="text-6xl mb-6 drop-shadow-xl">🏕️</p>
                                        <p className="text-theme-text font-black text-2xl mb-2">Rest Day, Voyager.</p>
                                        <p className="text-theme-muted font-medium text-lg">Your quest board is clear. Recharge for tomorrow's adventure.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 lg:space-y-5">
                                        {todayTasks.map((task, i) => {
                                            const topic = getTopicById(activeExam.examSlug, task.topicId);
                                            const isCurrentObjective = !task.isCompleted && todayTasks.findIndex(t => !t.isCompleted) === i;
                                            return (
                                                <div key={task.id} className={`flex items-center gap-4 md:gap-5 p-5 md:p-6 rounded-[2rem] border-[3px] backdrop-blur-md transition-all duration-300 group ${
                                                    task.isCompleted
                                                        ? 'border-emerald-500/20 bg-emerald-500/5 shadow-sm opacity-60 hover:opacity-100'
                                                        : isCurrentObjective
                                                            ? 'border-pink-500 bg-pink-500/5 dark:bg-pink-500/10 shadow-xl shadow-pink-500/20 transform hover:-translate-y-1 hover:scale-[1.02]'
                                                            : 'border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 hover:border-pink-500/50 transform hover:-translate-y-1 hover:scale-[1.01] shadow-sm hover:shadow-lg'
                                                }`}>
                                                    <button
                                                        onClick={() => !task.isCompleted && handleCompleteTask(task)}
                                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-inner group-hover:shadow-md ${
                                                            task.isCompleted
                                                                ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-110 rotate-12'
                                                                : isCurrentObjective
                                                                    ? 'bg-gradient-to-br from-pink-400 to-orange-400 text-white shadow-pink-500/40 hover:scale-110 hover:rotate-6'
                                                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-600 hover:bg-pink-100 dark:hover:bg-pink-900/40 hover:text-pink-500'
                                                        }`}
                                                    >
                                                        {task.isCompleted ? <span className="text-2xl font-black">✓</span> : isCurrentObjective ? <span className="text-2xl font-black animate-pulse">!</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl font-black">✓</span>}
                                                    </button>
                                                    <div className="flex-1 min-w-0 pr-4 pl-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {isCurrentObjective && <span className="px-2 py-0.5 rounded-md bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Current</span>}
                                                            <p className={`font-black text-lg md:text-xl truncate transition-colors ${task.isCompleted ? 'line-through text-theme-muted opacity-60' : 'text-theme-text'}`}>
                                                                {topic?.name || 'Quest'}
                                                            </p>
                                                        </div>
                                                        <p className={`text-xs md:text-sm font-bold tracking-widest uppercase transition-colors ${task.isCompleted ? 'text-theme-muted opacity-50' : 'text-theme-muted'}`}>
                                                            {topic?.subjectName} <span className="mx-2 opacity-50">•</span> ~45 min
                                                        </p>
                                                    </div>
                                                    {/* XP Reward Badge */}
                                                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase flex-shrink-0 flex items-center gap-1.5 transform transition-transform group-hover:scale-110 group-hover:-rotate-3 shadow-sm ${
                                                        task.isCompleted 
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50'
                                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-700/50 shadow-amber-500/10'
                                                    }`}>
                                                        <span className="text-sm">{task.isCompleted ? '✅' : '⭐'}</span> {task.isCompleted ? 'Claimed' : '+20 XP'}
                                                    </div>
                                                    {!task.isCompleted && (
                                                        <button
                                                            onClick={() => onStartStudy(task.topicId, activeExam.examSlug)}
                                                            className={`rounded-2xl text-white text-xs md:text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap hidden sm:block ${
                                                                isCurrentObjective
                                                                    ? 'px-7 py-4 bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 shadow-pink-500/40 scale-105 hover:scale-110'
                                                                    : 'px-6 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 border-[3px] border-slate-900/10 dark:border-slate-800'
                                                            }`}
                                                        >
                                                            {isCurrentObjective ? 'Play Quest 🎮' : 'Study'}
                                                        </button>
                                                    )}
                                                    {!task.isCompleted && (
                                                        <button
                                                            onClick={() => onStartStudy(task.topicId, activeExam.examSlug)}
                                                            className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center font-black transition-all shadow-lg active:scale-95 sm:hidden ${
                                                                isCurrentObjective ? 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-500/40 scale-105' : 'bg-slate-800 shadow-slate-500/20 border-b-4 border-slate-900 dark:border-slate-950/50'
                                                            }`}
                                                        >
                                                            🎮
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {allDone && todayTasks.length > 0 && (
                                    <div className="mt-8 p-8 md:p-10 rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center animate-in zoom-in duration-500 shadow-xl shadow-emerald-500/10">
                                        <p className="text-6xl mb-4 drop-shadow-xl">🏆</p>
                                        <p className="font-black text-3xl text-emerald-600 dark:text-emerald-400 tracking-wide mb-2">All Quests Complete!</p>
                                        <p className="text-emerald-600/80 dark:text-emerald-400/80 font-bold text-lg mb-4">You earned <strong>{todayTasks.length * 20} XP</strong> today. Legendary performance.</p>
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
                                            <span>🔥</span> Streak Extended
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (4 cols): RPG Voyager Profile + Portals */}
                    <div className="lg:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                        
                        {/* 🎮 VOYAGER PROFILE CARD — RPG Character Sheet */}
                        <div className="beach-card p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-default">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-pink-500/20 transition-all duration-700" />
                            <div className="relative z-10">
                                {/* Level & Rank */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/40 border-4 border-indigo-200/30 transform -rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                            <span className="text-white font-black text-2xl drop-shadow-md">{Math.floor((streak.xpTotal || 0) / 100) + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-xl text-theme-text drop-shadow-sm tracking-wide">Level {Math.floor((streak.xpTotal || 0) / 100) + 1}</p>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/80 dark:text-indigo-400 drop-shadow-sm mt-0.5">{
                                                (streak.xpTotal || 0) < 100 ? 'Novice Voyager' :
                                                (streak.xpTotal || 0) < 300 ? 'Apprentice' :
                                                (streak.xpTotal || 0) < 600 ? 'Scholar' :
                                                (streak.xpTotal || 0) < 1000 ? 'Expert' :
                                                (streak.xpTotal || 0) < 2000 ? 'Master' : 'Grandmaster'
                                            }</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm leading-none">{streak.xpTotal || 0}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted mt-1">Total XP</p>
                                    </div>
                                </div>

                                {/* XP Progress to Next Level */}
                                <div className="mb-6 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-[2rem] border border-white/50 dark:border-white/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-theme-muted mb-3 pr-1 pl-1">
                                        <span className="flex items-center gap-1.5"><span className="text-xs">⭐</span> XP to Level Up</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 tracking-[0.2em]">{(streak.xpTotal || 0) % 100} / 100</span>
                                    </div>
                                    <div className="w-full h-5 rounded-full bg-slate-200/80 dark:bg-slate-900/80 overflow-hidden shadow-inner p-1 border border-slate-300/30 dark:border-black/50">
                                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 relative transition-all duration-1000 ease-out shadow-sm" style={{ width: `${(streak.xpTotal || 0) % 100}%` }}>
                                            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Streak & Stats Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-[2rem] bg-orange-500/10 border-2 border-orange-500/20 text-center transform hover:-translate-y-1 transition-transform cursor-default hover:shadow-lg hover:shadow-orange-500/10">
                                        <p className="text-4xl mb-2 drop-shadow-md animate-pulse">🔥</p>
                                        <p className="text-3xl font-black text-theme-text">{streak.streakCount}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mt-1">Day Streak</p>
                                    </div>
                                    <div className="p-4 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/20 text-center transform hover:-translate-y-1 transition-transform cursor-default hover:shadow-lg hover:shadow-emerald-500/10">
                                        <p className="text-4xl mb-2 drop-shadow-md">🏅</p>
                                        <p className="text-3xl font-black text-theme-text">{todayTasks.filter(t => t.isCompleted).length}/{todayTasks.length}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mt-1">Quests Done</p>
                                    </div>
                                </div>

                                {/* Focus Zone */}
                                {focusTopic && (
                                    <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xl">⚡</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Weak Spot</p>
                                            <p className="text-sm font-black text-theme-text truncate">{focusTopic.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 🗺️ ADVENTURE PORTALS — color-coded, predictable layout */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted pl-1 flex items-center gap-2">
                                <span className="text-sm">🗺️</span> Adventure Portals
                            </p>
                            
                            {/* Learning Zone — Pink */}
                            <button
                                onClick={() => {
                                    if (onOpenLearning) onOpenLearning(activeExam.examSlug);
                                    else {
                                        if (allDone) onViewProgress(activeExam.examSlug);
                                        else {
                                            const firstIncomplete = todayTasks.find(t => !t.isCompleted);
                                            if (firstIncomplete) onStartStudy(firstIncomplete.topicId, activeExam.examSlug);
                                        }
                                    }
                                }}
                                className="w-full relative overflow-hidden py-6 px-6 rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_8px_30px_rgb(236,72,153,0.3)] group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(236,72,153,0.5)] transition-all duration-300 text-left border-[3px] border-pink-400/50"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="font-extrabold text-2xl tracking-wide drop-shadow-md">📖 Learning Zone</p>
                                        <p className="text-pink-100 font-bold text-[10px] uppercase tracking-widest mt-1">Concepts • Video • Podcast</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                                        <span className="text-white font-black text-xl group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </button>

                            {/* Question Solver — Indigo */}
                            <button
                                onClick={() => onOpenSolver?.(activeExam.examSlug)}
                                className="w-full relative overflow-hidden py-6 px-6 rounded-[2rem] bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(99,102,241,0.5)] transition-all duration-300 text-left border-[3px] border-indigo-400/50 mt-2"
                            >
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="font-extrabold text-2xl tracking-wide drop-shadow-md">⚔️ Question Solver</p>
                                        <p className="text-indigo-100 font-bold text-[10px] uppercase tracking-widest mt-1">Level-wise Practice • PYQs</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                                        <span className="text-white font-black text-xl group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </button>

                            {/* Mock Test Arena — Dark/Emerald */}
                            <button
                                onClick={() => onOpenMockTest?.(activeExam.examSlug)}
                                className="w-full relative overflow-hidden py-6 px-6 rounded-[2rem] bg-slate-900 dark:bg-slate-950 text-white shadow-xl group hover:-translate-y-1 hover:shadow-emerald-500/20 transition-all duration-300 text-left border border-slate-700/50 hover:border-emerald-500/50 mt-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="font-extrabold text-2xl tracking-wide text-slate-100 group-hover:text-emerald-400 transition-colors drop-shadow-md">🎯 Mock Test Arena</p>
                                        <p className="text-slate-400 group-hover:text-emerald-400/80 font-bold text-[10px] uppercase tracking-widest mt-1 transition-colors">Simulated Exams • Analytics</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-700 group-hover:border-emerald-500/50 flex items-center justify-center transition-colors">
                                        <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all font-black text-xl">→</span>
                                    </div>
                                </div>
                            </button>

                            {/* Leaderboard — Amber */}
                            <button
                                onClick={() => onOpenLeaderboard?.()}
                                className="w-full relative overflow-hidden py-6 px-6 rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_8px_30px_rgb(245,158,11,0.3)] group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(245,158,11,0.5)] transition-all duration-300 text-left border-[3px] border-amber-400/50 mt-2"
                            >
                                <div className="absolute top-0 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="font-extrabold text-2xl tracking-wide drop-shadow-md">🏆 Leaderboard</p>
                                        <p className="text-amber-100 font-bold text-[10px] uppercase tracking-widest mt-1">Global Ranks • Hall of Fame</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                                        <span className="text-white font-black text-xl group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <UpgradeModal 
                isOpen={showUpgrade} 
                onClose={() => setShowUpgrade(false)} 
            />

            {/* Aura Floating Apology */}
            <div className={`fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${showApology ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`relative flex flex-col items-center max-w-lg w-full transition-all duration-700 transform ${showApology ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
                    <div className="flex items-center justify-center p-6 rounded-full bg-pink-500/10 border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.4)] mb-6 animate-bounce-slow">
                        <span className="text-6xl drop-shadow-2xl">✨</span>
                    </div>
                    <div className="relative px-8 py-10 rounded-[2.5rem] bg-theme-surface/95 backdrop-blur-3xl border border-pink-500/50 shadow-[0_10px_50px_rgba(236,72,153,0.3)] text-center w-full">
                        <p className="font-serif italic font-light text-pink-400 text-xl mb-4">Aura</p>
                        <h2 className="text-3xl font-black text-white mb-6">Under Development</h2>
                        <p className="text-theme-text font-medium text-lg leading-relaxed tracking-wide px-4">
                            I'm sorry Voyager, but the Competitive Hub is currently under development. Your selected campaigns will be fully active starting <span className="text-pink-500 font-black uppercase tracking-widest block mt-2 text-xl">late May</span>.
                        </p>
                        {onExitHub && (
                            <button onClick={onExitHub} className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20">
                                Return to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitiveHome;
