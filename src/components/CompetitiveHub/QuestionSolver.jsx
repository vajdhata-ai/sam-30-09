import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SYLLABI, getAllTopics, COMPETITIVE_EXAMS } from '../../data/competitiveHubData';
import { QUESTION_BANK, getQuestionsByDifficulty, getTopicStats } from '../../data/questionBank';
import RocketLoader from './components/RocketLoader';

// ═══════════════════════════════════════
//  EXAMS WITH REAL QUESTION CONTENT
// ═══════════════════════════════════════
const EXAMS_WITH_QUESTIONS = new Set(['jee-mains', 'nda']);

// Maps practice level to difficulty filter
const LEVEL_TO_DIFFICULTY = {
    level1: 'easy',
    level2: 'medium',
    level3: 'hard',
    pyq: 'pyq',
};

// XP rewards per difficulty
const DIFFICULTY_XP = { easy: 10, medium: 20, hard: 30, pyq: 25 };

const QuestionSolver = ({ examSlug, onBack }) => {
    const { currentUser } = useAuth();
    const [syllabus, setSyllabus] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [practiceLevel, setPracticeLevel] = useState(null); // 'level1', 'level2', 'level3', 'pyq'
    
    // Active session state
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (examSlug && SYLLABI[examSlug]) {
            setSyllabus(SYLLABI[examSlug]);
        }
    }, [examSlug]);

    // Reset session state when changing level
    useEffect(() => {
        setActiveQuestionIndex(0);
        setAnswers({});
        setShowExplanation(false);
    }, [practiceLevel, selectedTopic]);

    if (!syllabus) return <RocketLoader mode="landing" title="Loading Question Bank Solver" />;

    // ══════════════════════════════════════════
    //  COMING SOON — Premium Card for exams
    //  without question content
    // ══════════════════════════════════════════
    if (!EXAMS_WITH_QUESTIONS.has(examSlug)) {
        const examInfo = COMPETITIVE_EXAMS.find(e => e.slug === examSlug);
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden">
                {/* Animated background particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-indigo-500/10 animate-pulse"
                            style={{
                                width: `${Math.random() * 6 + 2}px`,
                                height: `${Math.random() * 6 + 2}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${Math.random() * 3 + 2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Glowing orb behind card */}
                <div className="absolute w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

                {/* Premium Coming Soon Card */}
                <div className="relative z-10 max-w-md w-full">
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 text-center">
                        {/* Animated Lock Icon */}
                        <div className="relative mx-auto w-24 h-24 mb-8">
                            <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 animate-pulse" />
                            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <span className="text-5xl">🔒</span>
                            </div>
                            {/* Subtle ring animation */}
                            <div className="absolute -inset-3 rounded-[2rem] border border-indigo-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                        </div>

                        {/* Exam Info */}
                        <div className="mb-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                Coming Soon
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white mt-4 mb-3">
                            {examInfo?.name || examSlug.toUpperCase()} Questions
                        </h2>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8">
                            We're crafting <span className="text-indigo-400 font-bold">thousands of expert-curated questions</span> for {examInfo?.name || examSlug.toUpperCase()}. 
                            Difficulty-graded, topic-mapped, and packed with detailed solutions. Stay tuned.
                        </p>

                        {/* Stats preview */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { label: 'Topics', value: '—', icon: '📚' },
                                { label: 'Questions', value: '—', icon: '❓' },
                                { label: 'PYQs', value: '—', icon: '🏛️' },
                            ].map(s => (
                                <div key={s.label} className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                    <span className="text-lg">{s.icon}</span>
                                    <p className="text-white font-black text-lg mt-1">{s.value}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={onBack} 
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20"
                        >
                            ← Return to Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── ACTIVE PRACTICE SESSION ──
    if (selectedTopic && practiceLevel) {
        const difficultyKey = LEVEL_TO_DIFFICULTY[practiceLevel] || 'easy';
        const sessionQuestions = getQuestionsByDifficulty(selectedTopic.id, difficultyKey);

        if (sessionQuestions.length === 0) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center">
                    <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 max-w-md">
                        <p className="text-4xl mb-4">{practiceLevel === 'pyq' ? '🏛️' : '🚧'}</p>
                        <h2 className="text-xl font-bold text-white mb-2">
                            {practiceLevel === 'pyq' ? 'PYQ Vault — Loading...' : 'Questions Coming Soon'}
                        </h2>
                        <p className="text-slate-400 mb-6">
                            {practiceLevel === 'pyq' 
                                ? `Previous Year Questions for "${selectedTopic.name}" are being curated from actual NDA exam papers. Stay tuned for the full collection.`
                                : `${difficultyKey.charAt(0).toUpperCase() + difficultyKey.slice(1)}-level questions for "${selectedTopic.name}" are being prepared. Try another difficulty tier.`
                            }
                        </p>
                        <button onClick={() => setPracticeLevel(null)} className="px-6 py-2 rounded-full border border-indigo-500/50 text-indigo-400 font-bold uppercase tracking-widest text-xs hover:bg-indigo-500/10 transition-colors">
                            ← Back to Topic
                        </button>
                    </div>
                </div>
            );
        }

        const currentQ = sessionQuestions[activeQuestionIndex];
        const hasAnswered = answers[activeQuestionIndex] !== undefined;
        const isCorrect = hasAnswered && answers[activeQuestionIndex] === currentQ.correctAnswer;
        const isComplete = Object.keys(answers).length === sessionQuestions.length;
        const xpPerQ = DIFFICULTY_XP[difficultyKey] || 10;

        return (
            <div className="h-full flex flex-col bg-slate-950">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-white/10 flex items-center justify-between bg-slate-900">
                    <button onClick={() => setPracticeLevel(null)} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> End Session
                    </button>
                    <div className="text-center">
                        <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">{selectedTopic.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 justify-center">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                                difficultyKey === 'easy' ? 'bg-emerald-500' : 
                                difficultyKey === 'medium' ? 'bg-amber-500' : 
                                difficultyKey === 'pyq' ? 'bg-indigo-500' : 'bg-red-500'
                            }`} />
                            <p className="text-white text-sm font-bold capitalize">
                                {practiceLevel === 'pyq' ? 'PYQ Vault' : practiceLevel.replace('level', 'Tier ')}
                                <span className="text-slate-500 ml-2">({sessionQuestions.length} Qs)</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-xs font-black text-slate-500 tracking-widest">
                        {activeQuestionIndex + 1} / {sessionQuestions.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-800 w-full flex-shrink-0">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${((activeQuestionIndex) / sessionQuestions.length) * 100}%` }}
                    />
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        {isComplete ? (
                            <div className="text-center py-12 animate-in zoom-in duration-500">
                                <p className="text-6xl mb-6">🏆</p>
                                <h2 className="text-3xl font-black text-white mb-2">Victory!</h2>
                                <p className="text-indigo-400 font-bold text-lg mb-3">
                                    Score: {Object.values(answers).filter((a, i) => a === sessionQuestions[i].correctAnswer).length} / {sessionQuestions.length}
                                </p>
                                <p className="text-amber-400 font-black text-sm mb-8 uppercase tracking-widest">
                                    +{Object.values(answers).filter((a, i) => a === sessionQuestions[i].correctAnswer).length * xpPerQ} XP Earned
                                </p>
                                <button onClick={() => setPracticeLevel(null)} className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                                    Return to Battle Select
                                </button>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Question Text */}
                                <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-white/5 mb-6 shadow-lg shadow-black/50">
                                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                                        <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">
                                            Q{activeQuestionIndex + 1}
                                        </span>
                                        {/* Difficulty badge */}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                            difficultyKey === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            difficultyKey === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            difficultyKey === 'pyq' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {currentQ.isPYQ ? `PYQ ${currentQ.year || ''}` : difficultyKey}
                                        </span>
                                        {currentQ.tags && currentQ.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-white text-lg md:text-xl font-medium leading-relaxed">
                                        {currentQ.text}
                                    </h3>
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    {currentQ.options.map((opt, i) => {
                                        const isSelected = answers[activeQuestionIndex] === String.fromCharCode(65 + i);
                                        const isCorrectAns = String.fromCharCode(65 + i) === currentQ.correctAnswer;
                                        
                                        let btnClass = "w-full p-4 md:p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ";
                                        if (hasAnswered) {
                                            if (isCorrectAns) btnClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                                            else if (isSelected) btnClass += "bg-red-500/10 border-red-500/50 text-red-100";
                                            else btnClass += "bg-slate-900 border-white/5 text-slate-500 opacity-50";
                                        } else {
                                            btnClass += "bg-slate-900 border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-300 cursor-pointer hover:-translate-y-0.5";
                                        }

                                        return (
                                            <button 
                                                key={i}
                                                disabled={hasAnswered}
                                                onClick={() => {
                                                    setAnswers(prev => ({ ...prev, [activeQuestionIndex]: String.fromCharCode(65 + i) }));
                                                    setShowExplanation(true);
                                                }}
                                                className={btnClass}
                                            >
                                                <span className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-black ${
                                                    hasAnswered && isCorrectAns ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                                                    hasAnswered && isSelected ? 'border-red-500 bg-red-500/20 text-red-400' :
                                                    'border-slate-600 bg-slate-800 text-slate-400'
                                                }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                <span className="mt-1 font-medium leading-relaxed">{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation & Next */}
                                {hasAnswered && (
                                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className={`p-6 rounded-2xl border mb-6 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`text-2xl ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>{isCorrect ? '🎉' : '💡'}</span>
                                                <h4 className={`font-black uppercase tracking-widest text-sm ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isCorrect ? `Correct! +${xpPerQ} XP` : 'Incorrect'}
                                                </h4>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{currentQ.explanation}</p>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                setShowExplanation(false);
                                                setActiveQuestionIndex(prev => prev + 1);
                                            }}
                                            className="w-full py-4 rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10"
                                        >
                                            {activeQuestionIndex === sessionQuestions.length - 1 ? 'Finish Session' : 'Next Question →'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── TOPIC & LEVEL SELECTION ──
    if (selectedTopic && !practiceLevel) {
        const stats = getTopicStats(selectedTopic.id);
        
        return (
            <div className="h-full flex flex-col bg-slate-950 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="max-w-4xl mx-auto w-full relative z-10">
                    <button onClick={() => setSelectedTopic(null)} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                        ← Back to Topics
                    </button>

                    <div className="mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-white shrink-0 mb-4">{selectedTopic.name}</h2>
                        <p className="text-slate-400 font-medium text-lg max-w-2xl">
                            Choose your challenge tier. Progress through each to maximize XP and build mastery.
                        </p>
                        {/* Topic question stats */}
                        {stats.total > 0 && (
                            <div className="flex items-center gap-4 mt-4 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                                    📊 {stats.total} Total Questions
                                </span>
                                {stats.pyq > 0 && (
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                        🏛️ {stats.pyq} PYQs
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Level 1 — Easy */}
                        <button onClick={() => setPracticeLevel('level1')} className="group text-left p-6 md:p-8 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all shadow-xl shadow-black/20 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stats.easy > 0 && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">{stats.easy} Qs</span>}
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">+{stats.easy * 10} XP</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Tier 1: Grunt</h3>
                            <p className="text-slate-400 text-sm font-medium mb-4">Fundamental concept questions. Build your foundation before advancing.</p>
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                Enter Battle <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        {/* Level 2 — Medium */}
                        <button onClick={() => setPracticeLevel('level2')} className="group text-left p-6 md:p-8 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all shadow-xl shadow-black/20 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
                                <div className="w-32 h-32 bg-amber-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                                    <span className="text-2xl">🔥</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stats.medium > 0 && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">{stats.medium} Qs</span>}
                                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-widest border border-amber-500/20">+{stats.medium * 20} XP</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 relative z-10">Tier 2: Warrior</h3>
                            <p className="text-slate-400 text-sm font-medium mb-4 relative z-10">Intermediate difficulty matching {examSlug.toUpperCase()} exam level.</p>
                            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 relative z-10">
                                Enter Battle <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        {/* Level 3 — Hard */}
                        <button onClick={() => setPracticeLevel('level3')} className="group text-left p-6 md:p-8 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/80 transition-all shadow-xl shadow-black/20 hover:-translate-y-1 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6 z-10 relative">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                    <span className="text-2xl">🌋</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stats.hard > 0 && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">{stats.hard} Qs</span>}
                                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-500/20">+{stats.hard * 30} XP</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 z-10 relative">Tier 3: Boss</h3>
                            <p className="text-slate-400 text-sm font-medium mb-4 z-10 relative">Multi-concept, highly challenging. For those ready to dominate {examSlug.toUpperCase()} Advanced.</p>
                            <span className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 z-10 relative">
                                Enter Battle <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        {/* PYQ Vault */}
                        <button onClick={() => setPracticeLevel('pyq')} className="group text-left p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-violet-900 border border-indigo-500/30 hover:border-indigo-400/80 transition-all shadow-2xl shadow-indigo-500/20 hover:-translate-y-1 hover:shadow-indigo-500/40">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all backdrop-blur-sm shadow-inner">
                                    <span className="text-2xl">🏛️</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stats.pyq > 0 && <span className="px-2 py-0.5 rounded bg-white/10 text-indigo-200 text-[10px] font-bold">{stats.pyq} PYQs</span>}
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/40 text-indigo-100 text-[10px] font-black uppercase tracking-widest border border-indigo-400/50 shadow-sm">
                                        Premium Vault
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">PYQ Vault</h3>
                            <p className="text-indigo-200/80 text-sm font-medium mb-4">
                                {stats.pyq > 0 
                                    ? `${stats.pyq} actual past year questions from real ${examSlug.toUpperCase()} exams. Solve what matters most.`
                                    : `Previous Year Questions for this topic are being curated from official ${examSlug.toUpperCase()} papers.`
                                }
                            </p>
                            <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                Enter the Vault <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── MAIN DIRECTORY ──
    const allTopics = getAllTopics(examSlug);
    const filteredSyllabus = searchQuery.trim().length > 0 
        ? syllabus.subjects.map(subj => ({
            ...subj,
            chapters: subj.chapters.map(chap => ({
                ...chap,
                topics: chap.topics.filter(t => 
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chap.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            })).filter(chap => chap.topics.length > 0)
        })).filter(subj => subj.chapters.length > 0)
        : syllabus.subjects;
    
    return (
        <div className="h-full flex flex-col bg-slate-950 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-slate-900/50 to-slate-950 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto w-full relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            ← Back to Hub
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 tracking-tight">
                            ⚔️ Battle Arena
                        </h1>
                        <p className="text-slate-400 font-medium text-lg max-w-xl mt-4">
                            Choose a topic to battle through tier-wise challenges or raid the PYQ Vault for legendary rewards.
                        </p>
                    </div>
                    
                    {/* Working Search */}
                    <div className="w-full md:w-72">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search topic or chapter..." 
                                className="w-full bg-slate-900 border border-slate-700/50 text-white text-sm rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-12 pb-24">
                    {filteredSyllabus.sort((a,b)=>a.order-b.order).map(subject => (
                        <div key={subject.name} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">{subject.name}</h2>
                                <div className="h-px bg-gradient-to-r from-indigo-500/30 to-transparent flex-1" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subject.chapters.sort((a,b)=>a.order-b.order).flatMap(chapter => 
                                    chapter.topics.sort((a,b)=>a.order-b.order).map(topic => {
                                        const topicStats = getTopicStats(topic.id);
                                        return (
                                            <button 
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic)}
                                                className="text-left p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all group hover:-translate-y-1 shadow-lg shadow-black/20"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded truncate max-w-[70%] border border-indigo-500/20">
                                                        {chapter.name}
                                                    </div>
                                                    {topic.priority === 'high' && <span className="text-amber-400 text-lg group-hover:animate-bounce">⭐</span>}
                                                </div>
                                                <h3 className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors leading-tight mb-2 line-clamp-2">
                                                    {topic.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-4 flex-wrap">
                                                    {topicStats.total > 0 ? (
                                                        <>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {topicStats.easy} Easy
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {topicStats.medium} Med
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {topicStats.hard} Hard
                                                            </span>
                                                            {topicStats.pyq > 0 && (
                                                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                    🏛️ {topicStats.pyq} PYQ
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionSolver;
