import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SYLLABI, COMPETITIVE_EXAMS, getAllTopics } from '../../data/competitiveHubData';
import { getTopicProgress } from '../../utils/competitiveHubService';
import RocketLoader from './components/RocketLoader';

const MockTestArena = ({ examSlug, onBack }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({});
    
    // Exam Setup State
    const [testStarted, setTestStarted] = useState(false);
    const [examVariant, setExamVariant] = useState(null); // 'mains', 'advanced', 'standard' etc based on exam
    const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard', 'auto'
    const [isAutoLocked, setIsAutoLocked] = useState(false);

    // Active Test State
    const [timeRemaining, setTimeRemaining] = useState(3 * 60 * 60); // 3 hours in seconds
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        loadProgress();
    }, [examSlug, currentUser]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (testStarted && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            // Auto submit
            setTestStarted(false);
        }
        return () => clearInterval(interval);
    }, [testStarted, timeRemaining]);

    const loadProgress = async () => {
        setLoading(true);
        if (currentUser && examSlug) {
            try {
                const prog = await getTopicProgress(currentUser.uid, examSlug);
                setProgress(prog || {});
                
                // Calculate completion
                const allTopics = getAllTopics(examSlug);
                const completedCount = allTopics.filter(t => prog[t.id]?.status === 'done').length;
                
                // If 100% complete, lock to AUTO difficulty
                if (allTopics.length > 0 && completedCount === allTopics.length) {
                    setIsAutoLocked(true);
                    setDifficulty('auto');
                }
            } catch (err) {
                console.error("Failed to load progress:", err);
            }
        }
        setLoading(false);
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <RocketLoader mode="landing" title="Preparing Arena..." />;

    const syllabus = SYLLABI[examSlug];
    const examInfo = COMPETITIVE_EXAMS.find(e => e.slug === examSlug);

    // ── ACTIVE TEST UI ──
    if (testStarted) {
        return (
            <div className="h-full flex flex-col bg-white select-none">
                {/* TCS iON / Exam Style Header */}
                <div className="flex-shrink-0 bg-slate-100 border-b border-slate-300 p-2 md:p-4 flex items-center justify-between shadow-sm z-20">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block w-12 h-12 bg-slate-300 rounded overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.displayName || 'Student'}&backgroundColor=cbd5e1`} alt="Profile" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm md:text-base">{examInfo?.name} - {examVariant?.toUpperCase() || 'MOCK'}</h2>
                            <p className="text-xs text-slate-500 font-medium">Candidate: {currentUser?.displayName || 'Guest'}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Left</div>
                        <div className={`text-2xl font-mono font-black border-2 px-4 py-1 rounded bg-white ${timeRemaining < 300 ? 'text-red-600 border-red-500 animate-pulse' : 'text-slate-800 border-slate-300'}`}>
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Left: Question Area */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Subjects/Sections Tabs */}
                        <div className="flex border-b border-slate-300 bg-slate-50 overflow-x-auto">
                            {syllabus?.subjects.map((sub, idx) => (
                                <button
                                    key={sub.name}
                                    onClick={() => setActiveSection(idx)}
                                    className={`px-6 py-3 text-sm font-bold tracking-wide uppercase whitespace-nowrap border-r border-slate-300 transition-colors ${
                                        activeSection === idx 
                                        ? 'bg-blue-600 text-white border-b-4 border-b-blue-800' 
                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>

                        {/* Q Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                    <h3 className="text-xl font-bold text-slate-800">Question 1</h3>
                                    <div className="flex gap-4 text-sm font-medium">
                                        <span className="text-green-600">+4 Marks</span>
                                        <span className="text-red-600">-1 Mark</span>
                                    </div>
                                </div>
                                
                                <p className="text-lg text-slate-800 leading-relaxed mb-8">
                                    This is a simulated exam environment designed to replicate the UI of actual competitive exams (like TCS iON). Read the question carefully and select the best option below.
                                </p>

                                <div className="space-y-4">
                                    {['Option Alpha', 'Option Beta', 'Option Gamma', 'Option Delta'].map((opt, i) => (
                                        <button key={i} className="w-full flex items-center gap-4 p-4 border border-slate-300 rounded hover:bg-blue-50 transition-colors group text-left">
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-400 group-hover:border-blue-500 flex-shrink-0 flex items-center justify-center">
                                                {/* radio inner */}
                                            </div>
                                            <span className="text-slate-700 font-medium">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="bg-slate-100 border-t border-slate-300 p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded shadow-sm hover:bg-slate-50">Mark for Review</button>
                                <button className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded shadow-sm hover:bg-slate-50">Clear Response</button>
                            </div>
                            <button className="px-8 py-2 bg-blue-600 text-white font-bold rounded shadow-md hover:bg-blue-700">Save & Next</button>
                        </div>
                    </div>

                    {/* Right: Question Palette (Desktop only mostly) */}
                    <div className="hidden lg:flex w-80 bg-slate-50 border-l border-slate-300 flex-col">
                        <div className="p-4 border-b border-slate-300">
                            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-4">Question Palette</h4>
                            <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-600">
                                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-slate-200 border border-slate-300" /> Not Visited</div>
                                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-t-[50%] bg-red-500 text-white flex items-center justify-center" /> Not Answered</div>
                                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-b-[50%] bg-green-500 text-white flex items-center justify-center" /> Answered</div>
                                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center" /> Marked </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 border-b border-slate-300">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">{syllabus?.subjects[activeSection]?.name} Questions</h5>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({length: 30}).map((_, i) => (
                                    <button key={i} className="w-10 h-10 border border-slate-300 bg-slate-200 rounded font-medium text-slate-700 hover:bg-slate-300">
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4">
                            <button 
                                onClick={() => setTestStarted(false)}
                                className="w-full py-3 bg-red-500 hover:bg-red-600 outline-none border-none text-white font-bold rounded shadow-md uppercase tracking-wide transition-colors"
                            >
                                Submit Exam
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── SETUP UI ──
    const isJEE = examSlug === 'jee';
    const examVariants = isJEE 
        ? [{id: 'mains', label: 'JEE Mains', desc: 'Standard 3h pattern, Single correct & numerical.'}, {id: 'advanced', label: 'JEE Advanced', desc: 'Complex patterns, multi-correct, integer type.'}]
        : [{id: 'standard', label: 'Standard Pattern', desc: `Standard ${examInfo?.name} format.`}];

    return (
        <div className="h-full flex flex-col bg-slate-950 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
            
            <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col min-h-full">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10 flex items-center gap-2 self-start">
                    ← Back to Hub
                </button>

                <div className="text-center mb-16">
                    <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                        <span className="text-4xl px-2">🎯</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 tracking-tight">
                        Simulation Chamber
                    </h1>
                    <p className="text-slate-400 font-medium text-lg mt-4 max-w-2xl mx-auto">
                        High-fidelity exam simulations. Configure your mission parameters or let Auremous AI auto-calibrate the difficulty based on your combat data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 flex-1">
                    
                    {/* Left Col: Configurations */}
                    <div className="space-y-10">
                        {/* Variant Selector */}
                        <div>
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-blue-400">01.</span> Select Exam Pattern
                            </h3>
                            <div className="space-y-4">
                                {examVariants.map(variant => (
                                    <button 
                                        key={variant.id}
                                        onClick={() => setExamVariant(variant.id)}
                                        className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 ${
                                            examVariant === variant.id 
                                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)] scale-[1.02]' 
                                            : 'bg-slate-900 border-white/5 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-bold text-white">{variant.label}</h4>
                                            {examVariant === variant.id && <span className="text-blue-400 text-xl">✓</span>}
                                        </div>
                                        <p className="text-sm text-slate-400">{variant.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Selector */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <span className="text-blue-400">02.</span> AI Difficulty
                                </h3>
                                {isAutoLocked && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                        100% Syllabus Locked
                                    </span>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    {id: 'easy', label: 'Recruit', icon: '🌱'},
                                    {id: 'medium', label: 'Standard', icon: '⚔️'},
                                    {id: 'hard', label: 'Elite', icon: '🔥'},
                                    {id: 'auto', label: 'AI Commander', icon: '✨'}
                                ].map(lvl => (
                                    <button
                                        key={lvl.id}
                                        onClick={() => !isAutoLocked && setDifficulty(lvl.id)}
                                        disabled={isAutoLocked && lvl.id !== 'auto'}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs transition-all duration-300 border ${
                                            difficulty === lvl.id
                                            ? lvl.id === 'auto' 
                                                ? 'bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white border-transparent shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105'
                                                : 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                                        } ${isAutoLocked && lvl.id !== 'auto' ? 'opacity-30 cursor-not-allowed hidden md:flex' : ''}`}
                                    >
                                        <span className="text-lg">{lvl.icon}</span>
                                        {lvl.label}
                                    </button>
                                ))}
                            </div>
                            {isAutoLocked && (
                                <p className="text-emerald-400/80 text-xs font-medium mt-4 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                                    100% syllabus mastered! Difficulty is now fully managed by Auremous AI to maximize your score.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Review & Start */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden h-fit sticky top-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                        
                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
                            <span className="text-3xl">⏱️</span>
                        </div>
                        
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Mission Briefing</h2>
                        <p className="text-slate-400 mb-10 max-w-sm">
                            Ensure you have a stable connection and 3 uninterrupted hours. The chamber will simulate the real exam interface.
                        </p>

                        <div className="w-full bg-slate-950 rounded-2xl p-6 mb-10 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Duration</span>
                                <span className="text-white font-mono font-bold text-lg">03:00:00</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Variant</span>
                                <span className="text-blue-400 font-bold uppercase tracking-wider">{examVariant || 'Not Selected'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Difficulty</span>
                                <span className={`font-bold uppercase tracking-wider ${difficulty === 'auto' ? 'text-fuchsia-400' : 'text-slate-300'}`}>
                                    {difficulty === 'easy' ? 'Recruit' : difficulty === 'medium' ? 'Standard' : difficulty === 'hard' ? 'Elite' : 'AI Commander'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">XP Reward</span>
                                <span className="text-amber-400 font-black uppercase tracking-wider">+200 XP</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setTestStarted(true)}
                            disabled={!examVariant}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-3"
                        >
                            <span>Launch Simulation</span> <span className="text-xl">🚀</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MockTestArena;
