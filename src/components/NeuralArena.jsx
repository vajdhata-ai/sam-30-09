import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Activity, Video, Target, Calendar, Swords, Sparkles, BrainCircuit, Loader2, Gauge, Cpu, X, ChevronLeft } from '../components/Icons';
import { useTheme } from '../contexts/ThemeContext';
import BrainLink from './BrainLink';
import { callAI as callGroq } from '../utils/apiRouter';

const ArenaSplash = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 45);

        const fadeTimer = setTimeout(() => setOpacity(0), 4500);
        const completeTimer = setTimeout(() => {
            if (typeof onComplete === 'function') onComplete();
        }, 5500);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-theme-bg transition-opacity duration-500"
            style={{ opacity }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-theme-primary/[0.06] blur-[150px] animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] rounded-full bg-theme-secondary/[0.04] blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="p-5 bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 rounded-3xl border border-theme-primary/20 shadow-2xl shadow-theme-primary/20">
                        <Swords className="w-12 h-12 text-theme-primary" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full animate-ping shadow-lg shadow-theme-primary/50" />
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full shadow-lg shadow-theme-primary/50" />
                </div>

                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-serif italic font-light tracking-widest text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.4)] select-none">
                        Cognitive Colosseum
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-theme-primary mt-2">
                        Initializing Combat Protocol
                    </p>
                </div>

                <div className="w-48 h-1 bg-theme-border/30 rounded-full overflow-hidden mt-2">
                    <div 
                        className="h-full bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const NeuralArena = ({ onNavigate, setIsCollapsed }) => {
    const { isDark } = useTheme();

    const [showSplash, setShowSplash] = useState(true);
    const [currentView, setCurrentView] = useState('lobby'); // lobby | battle
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Normal');
    const [quizData, setQuizData] = useState(null);
    const [battleState, setBattleState] = useState('idle'); // idle | loading | active

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('aurem_stats');
        return saved ? JSON.parse(saved) : { xp: 0, level: 1, battles: 0, wins: 0 };
    });

    const getRank = (lvl) => {
        if (lvl <= 5) return { name: 'Novice', color: 'text-slate-400', bg: 'bg-slate-400/10' };
        if (lvl <= 15) return { name: 'Scholar', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
        if (lvl <= 30) return { name: 'Strategist', color: 'text-indigo-400', bg: 'bg-indigo-400/10' };
        if (lvl <= 50) return { name: 'Master', color: 'text-amber-400', bg: 'bg-amber-400/10' };
        return { name: 'Grandmaster', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    };

    const rank = getRank(stats.level);
    const nextLevelXP = Math.pow(stats.level, 2) * 100;
    const progress = (stats.xp / nextLevelXP) * 100;

    const startBattle = async (e) => {
        if (e) e.preventDefault();
        if (!topic.trim()) return;

        setBattleState('loading');
        try {
            const prompt = `Generate 10 ELITE CBSE COMPETENCY MCQs on the topic: "${topic}".
            Focus on Assertion-Reasoning and Case-Based questions.
            Respond ONLY with a valid JSON object: { "questions": [{ "question": "...", "options": ["...", "...", "...", "..."], "answer": "Exact correct text", "explanation": "..." }] }`;

            const messages = [
                { role: 'system', content: 'You are a master competitive exam architect.' },
                { role: 'user', content: prompt }
            ];
            const res = await callGroq(messages, null);

            const content = res.choices?.[0]?.message?.content || "";
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                setQuizData(data.questions);
                setBattleState('active');
                if (setIsCollapsed) setIsCollapsed(true);
            }
        } catch (e) {
            console.error(e);
            alert("Battle link failed. Try again.");
            setBattleState('idle');
        }
    };

    const handleBattleComplete = (results) => {
        const difficultyMultiplier = { 'Normal': 1, 'Heroic': 1.5, 'Godly': 2.5 }[difficulty];
        const earnedXP = Math.round(results.score * 0.1 * difficultyMultiplier);

        setStats(prev => {
            let newXP = prev.xp + earnedXP;
            let newLevel = prev.level;
            let reqXP = Math.pow(newLevel, 2) * 100;

            while (newXP >= reqXP) {
                newXP -= reqXP;
                newLevel++;
                reqXP = Math.pow(newLevel, 2) * 100;
            }

            const newStats = {
                ...prev,
                xp: newXP,
                level: newLevel,
                battles: prev.battles + 1,
                wins: prev.wins + (results.isWinner ? 1 : 0)
            };
            localStorage.setItem('aurem_stats', JSON.stringify(newStats));
            return newStats;
        });
    };

    if (showSplash) {
        return <ArenaSplash onComplete={() => setShowSplash(false)} />;
    }

    if (battleState === 'active') {
        return (
            <div className="flex flex-col h-full bg-theme-bg overflow-hidden transition-colors duration-500">
                <header className="shrink-0 sticky top-0 z-40 bg-theme-bg/90 backdrop-blur-2xl border-b border-theme-border/30">
                    <div className="max-w-7xl mx-auto px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 border border-theme-primary/20 flex items-center justify-center shadow-lg shadow-theme-primary/10">
                                    <Swords className="w-5 h-5 text-theme-primary animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-light tracking-widest text-theme-primary drop-shadow-[0_0_15px_rgba(var(--theme-primary),0.3)] leading-none">
                                        Cognitive Colosseum
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-theme-primary/80">
                                            Combat Protocol Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setBattleState('idle')}
                                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 hover:border-theme-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.15)]"
                            >
                                <ChevronLeft className="w-4 h-4 text-theme-muted group-hover:text-theme-primary transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-theme-muted group-hover:text-theme-primary transition-colors">
                                    Abort Combat
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <BrainLink
                            quizData={quizData}
                            topic={topic}
                            difficulty={difficulty}
                            onComplete={handleBattleComplete}
                            onExit={() => setBattleState('idle')}
                            isDark={isDark}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-theme-bg overflow-hidden transition-colors duration-500">
            <header className="shrink-0 sticky top-0 z-40 bg-theme-bg/90 backdrop-blur-2xl border-b border-theme-border/30">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 border border-theme-primary/20 flex items-center justify-center shadow-lg shadow-theme-primary/10">
                                <Swords className="w-5 h-5 text-theme-primary" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-light tracking-widest text-theme-primary drop-shadow-[0_0_15px_rgba(var(--theme-primary),0.3)] leading-none">
                                    Cognitive Colosseum
                                </h1>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-theme-primary/80">
                                        Lobby Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => typeof onNavigate === 'function' ? onNavigate('cadet-dashboard') : null}
                            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 hover:border-rose-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-theme-muted group-hover:text-rose-500 transition-colors">
                                Exit
                            </span>
                            <X className="w-4 h-4 text-theme-muted group-hover:text-rose-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="animate-fade-in space-y-12 pb-24">


                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
                            
                            <div className="flex flex-col p-8 md:p-10 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 hover:border-theme-primary/40 transition-all duration-500 relative overflow-hidden shadow-lg group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-theme-primary to-theme-secondary opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="space-y-8 relative z-10 w-full">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-widest text-theme-primary flex items-center gap-3">
                                            <BrainCircuit className="w-6 h-6" /> Synchronization
                                        </h2>
                                    </div>

                                    <form onSubmit={startBattle} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted ml-2">Neural Focus Area</label>
                                            <div className="relative group/input">
                                                <input
                                                    type="text"
                                                    value={topic}
                                                    onChange={e => setTopic(e.target.value)}
                                                    placeholder="e.g. Thermodynamics, Molecular Biology..."
                                                    className="w-full py-5 pl-6 pr-12 rounded-[24px] text-lg font-bold outline-none transition-all duration-300 bg-theme-bg/60 text-theme-text border border-theme-border/60 focus:border-theme-primary focus:bg-theme-surface shadow-inner"
                                                />
                                                <Target className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-primary/50 group-hover/input:text-theme-primary transition-colors" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted ml-2">Processing Intensity</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {['Normal', 'Heroic', 'Godly'].map(level => (
                                                    <button
                                                        type="button"
                                                        key={level}
                                                        onClick={() => setDifficulty(level)}
                                                        className={`py-4 px-2 rounded-[20px] border transition-all duration-300 flex flex-col items-center gap-2
                                                            ${difficulty === level
                                                                ? 'border-theme-primary bg-theme-primary text-theme-bg shadow-[0_0_20px_rgba(var(--theme-primary),0.3)] scale-[1.02]'
                                                                : 'border-theme-border/60 bg-theme-bg/60 text-theme-muted hover:border-theme-primary/50 hover:bg-theme-surface'}
                                                        `}
                                                    >
                                                        <Gauge className={`w-5 h-5 ${difficulty === level ? 'text-theme-bg' : 'text-theme-primary/70'}`} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">{level}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            disabled={battleState === 'loading' || !topic.trim()}
                                            className={`w-full py-5 mt-4 rounded-full font-black tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn uppercase
                                                ${battleState === 'loading'
                                                    ? 'bg-theme-surface border border-theme-border text-theme-muted cursor-not-allowed'
                                                    : 'bg-theme-primary text-theme-bg hover:scale-105 shadow-[0_0_30px_rgba(var(--theme-primary),0.3)]'
                                                }`}
                                        >
                                            {battleState === 'loading' ? (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-primary/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                                                    <Loader2 className="w-5 h-5 animate-spin text-theme-primary" />
                                                    <span className="text-theme-primary">Synchronizing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                                    <BrainCircuit className="w-5 h-5 group-hover/btn:rotate-12 transition-transform relative z-10" />
                                                    <span className="relative z-10">Link Neural Node</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="flex flex-col p-8 md:p-10 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 hover:border-theme-primary/40 transition-all duration-500 relative overflow-hidden shadow-lg group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-theme-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-theme-primary/20 transition-colors duration-700"></div>

                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className="flex items-center justify-between w-full mb-8">
                                        <h2 className="text-xl font-black uppercase tracking-widest text-theme-text flex items-center gap-3">
                                            <Trophy className="w-5 h-5 text-theme-primary" /> Profile
                                        </h2>
                                        <Cpu className="w-5 h-5 text-theme-primary/40 animate-spin-slow" />
                                    </div>

                                    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-theme-primary/20 blur-[20px] rounded-full animate-pulse pointer-events-none"></div>
                                        <div className="relative w-28 h-28 rounded-full bg-theme-surface border-2 border-theme-primary flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(var(--theme-primary),0.3)]">
                                            <div className="w-full h-full rounded-full border border-theme-primary/30 flex flex-col items-center justify-center bg-theme-bg">
                                                <span className="text-3xl font-black text-theme-text leading-none">{stats.level}</span>
                                                <span className="text-[8px] font-black uppercase text-theme-primary tracking-[0.2em] mt-1">Level</span>
                                            </div>
                                            <div className="absolute -bottom-3 px-4 py-1.5 rounded-full bg-theme-primary text-theme-bg text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(var(--theme-primary),0.4)] whitespace-nowrap">
                                                Rank: {rank.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-[9px] font-black uppercase text-theme-muted tracking-[0.2em]">XP Progress</span>
                                                <span className="text-[9px] font-black text-theme-primary tabular-nums tracking-widest">{stats.xp} / {nextLevelXP}</span>
                                            </div>
                                            <div className="h-2 w-full bg-theme-bg rounded-full overflow-hidden p-0.5 border border-theme-border/60">
                                                <div
                                                    className="h-full bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--theme-primary),0.5)]"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="p-4 rounded-[20px] bg-theme-bg/60 border border-theme-border/60 text-center hover:bg-theme-surface transition-colors duration-300">
                                                <span className="text-[9px] font-black uppercase text-theme-muted tracking-[0.2em] block mb-1">Engagements</span>
                                                <span className="text-2xl font-black text-theme-text">{stats.battles}</span>
                                            </div>
                                            <div className="p-4 rounded-[20px] bg-theme-bg/60 border border-theme-border/60 text-center hover:bg-theme-surface transition-colors duration-300">
                                                <span className="text-[9px] font-black uppercase text-theme-muted tracking-[0.2em] block mb-1">Win Rate</span>
                                                <span className="text-2xl font-black text-emerald-400">
                                                    {stats.battles === 0 ? '0%' : `${Math.round((stats.wins / stats.battles) * 100)}%`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default NeuralArena;
