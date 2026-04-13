import React, { useState, useRef, useEffect } from 'react';
import { COMPETITIVE_EXAMS, SYLLABI } from '../../data/competitiveHubData';
import { saveCompetitiveProfile, saveUserExam, completeOnboarding } from '../../utils/competitiveHubService';
import { generateTimetable } from '../../utils/timetableEngine';
import { getAllTopics } from '../../data/competitiveHubData';
import { saveDailyTasks } from '../../utils/competitiveHubService';
import { useAuth } from '../../contexts/AuthContext';

const STEPS = ['exam', 'date', 'hours', 'level', 'start'];

const stepMeta = [
    { emoji: '🎯', title: 'Are you ready, Voyager?', subtitle: 'Select the exams you want to dominate.' },
    { emoji: '⏳', title: 'Set Your Target', subtitle: 'When is the big day?' },
    { emoji: '🧠', title: 'Where do we start?', subtitle: 'Be honest. We need to know your baseline.' },
    { emoji: '⚡', title: 'Set Your Pace', subtitle: 'How many hours can you commit daily?' },
    { emoji: '🚀', title: 'Ready to Launch', subtitle: 'Your personalised battle plan is ready.' },
    { emoji: '🎉', title: 'Mission Accomplished', subtitle: 'Your AI battle plan is deployed and ready in the Hub.' },
];

const CompetitiveOnboarding = ({ onComplete, onCancel, isNewSession }) => {
    const { currentUser } = useAuth();
    const [step, setStep] = useState(0);
    const [selectedExams, setSelectedExams] = useState([]);
    const [examDates, setExamDates] = useState({});
    const [dailyHours, setDailyHours] = useState(2);
    const [currentLevel, setCurrentLevel] = useState('beginner');
    const [isLoading, setIsLoading] = useState(false);
    const [direction, setDirection] = useState(1);
    const [showAPModal, setShowAPModal] = useState(false);

    const activeExams = COMPETITIVE_EXAMS.filter(e => e.isActive && !e.isAP);
    const apExams = COMPETITIVE_EXAMS.filter(e => e.isActive && e.isAP);

    const toggleExam = (slug) => {
        if (slug === 'ap-group') {
            setShowAPModal(true);
            return;
        }
        setSelectedExams(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const getDaysMessage = (date) => {
        if (!date) return '';
        const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        if (days <= 0) return "That date has passed. Pick a future date.";
        if (days < 30) return `${days} days — every second counts. War mode.`;
        if (days < 90) return `${days} days — tight but doable. Let's crush it.`;
        if (days < 180) return `${days} days — solid runway. You've got this.`;
        return `${days} days — plenty of time. Start strong, stay relentless.`;
    };

    const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, STEPS.length - 1)); };
    const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

    const canProceed = () => {
        if (step === 0) return selectedExams.length > 0;
        if (step === 1) return selectedExams.every(slug => examDates[slug]);
        return true;
    };

    const [planError, setPlanError] = useState(null);

    const handleFinish = async () => {
        if (!currentUser) return;
        setIsLoading(true);
        setPlanError(null);

        try {
            const uid = currentUser.uid;

            // ── Step 1: Save profile (fire-and-forget if Firestore fails) ──
            console.log('[Onboarding] Step 1: Saving profile...');
            try {
                await Promise.race([
                    saveCompetitiveProfile(uid, {
                        name: currentUser.displayName || 'Student',
                        streakCount: 0, longestStreak: 0, xpTotal: 0,
                        lastActiveDate: new Date().toISOString().split('T')[0],
                    }),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
                ]);
                console.log('[Onboarding] Step 1 done.');
            } catch (e) {
                console.warn('[Onboarding] Profile save failed, continuing:', e.message);
            }

            // ── Step 2 & 3: Save exams + generate timetable ──
            for (const slug of selectedExams) {
                console.log(`[Onboarding] Step 2: Saving exam ${slug}...`);
                try {
                    await Promise.race([
                        saveUserExam(uid, { examSlug: slug, examDate: examDates[slug], dailyHours, currentLevel, isUnlocked: false }),
                        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
                    ]);
                } catch (e) {
                    console.warn(`[Onboarding] Exam save failed for ${slug}, continuing:`, e.message);
                }

                // Generate timetable locally (this never fails — pure computation)
                const topics = getAllTopics(slug);
                console.log(`[Onboarding] Step 3: ${topics.length} topics for ${slug}`);
                if (topics.length > 0) {
                    const schedule = generateTimetable(topics, [], examDates[slug], dailyHours);
                    // Save to localStorage as fallback (always works)
                    localStorage.setItem(`competitive_schedule_${uid}_${slug}`, JSON.stringify(schedule));
                    console.log(`[Onboarding] Saved ${schedule.length} days to localStorage.`);

                    // Try Firestore (non-blocking)
                    try {
                        await Promise.race([
                            saveDailyTasks(uid, slug, schedule),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
                        ]);
                    } catch (e) {
                        console.warn(`[Onboarding] saveDailyTasks failed for ${slug}, localStorage backup active.`);
                    }
                }
            }

            // ── Step 4: Mark onboarding complete ──
            console.log('[Onboarding] Step 4: Completing onboarding...');
            try {
                await Promise.race([
                    completeOnboarding(uid),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
                ]);
            } catch (e) {
                // Save locally so user isn't stuck
                const cacheKey = `competitive_profile_${uid}`;
                const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
                localStorage.setItem(cacheKey, JSON.stringify({ ...cached, onboardingComplete: true }));
                console.warn('[Onboarding] completeOnboarding failed, saved to localStorage.');
            }

            console.log('[Onboarding] All done!');
            setStep(5); // Success
        } catch (err) {
            console.error('Onboarding error:', err);
            setPlanError(err.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const hourOptions = [
        { value: 1.5, label: '1-2 hours', desc: 'Light but consistent', icon: '🕐' },
        { value: 3, label: '2-4 hours', desc: 'Solid daily commitment', icon: '🔥' },
        { value: 5, label: '4+ hours', desc: 'Full intensity mode', icon: '⚡' },
    ];

    const levelOptions = [
        { value: 'beginner', label: 'Just Starting', icon: '🌱', desc: 'Starting from scratch' },
        { value: 'intermediate', label: 'Covered Basics', icon: '📖', desc: "I've studied a few chapters" },
        { value: 'revision', label: 'Revision Mode', icon: '🎯', desc: 'Syllabus mostly covered' },
    ];

    const current = stepMeta[step];

    return (
        <div className="h-full flex flex-col lg:flex-row relative overflow-hidden bg-slate-950 selection:bg-pink-500/30">
            {/* Global Animated Space Background — Deep Space Orbital View (MAGICAL THEME) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#050510]" />
                
                {/* Orbital atmospheric glow - Original magical colors */}
                <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-indigo-500/10 via-purple-500/5 to-transparent z-0 blur-xl" />
                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-blue-500/5 to-transparent z-0 blur-xl" />
                
                {/* Distant Nebulas - Rotating slowly */}
                <div className="absolute w-[1200px] h-[1200px] rounded-full bg-blue-600/15 blur-[150px] -top-80 -right-80 animate-spin-slow" style={{ animationDuration: '60s' }} />
                <div className="absolute w-[1000px] h-[1000px] rounded-full bg-fuchsia-600/10 blur-[150px] -bottom-96 -left-32 animate-spin-slow" style={{ animationDuration: '90s', animationDirection: 'reverse' }} />
                
                {/* High-Tech HUD Elements (Boosted for Maximum Magic) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[3px] border-cyan-500/20 shadow-[0_0_100px_rgba(6,182,212,0.15)] opacity-100 z-0" style={{ animation: 'spin 90s linear infinite reverse' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-dashed border-pink-500/40 shadow-[0_0_50px_rgba(236,72,153,0.1)] opacity-80 z-0 animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 opacity-40 z-0" style={{ animation: 'spin 60s linear infinite' }} />
                
                {/* Laser Grid Tracking Lines */}
                <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent opacity-80" />
                <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-purple-400/40 to-transparent opacity-80" />
                <div className="absolute top-[40%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-400/40 to-transparent opacity-80" />
                
                {/* Central Targeting Crosshairs */}
                <div className="absolute top-1/2 left-[15%] w-24 h-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
                <div className="absolute top-1/2 right-[15%] w-24 h-[2px] bg-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.9)]" />
                
                {/* Stars/Dust - Fading in and out */}
                {Array.from({length: 100}).map((_, i) => (
                    <div 
                        key={`star-${i}`} 
                        className="absolute rounded-full bg-white transition-opacity duration-1000 animate-pulse"
                        style={{
                            width: `${0.5 + Math.random() * 2.5}px`,
                            height: `${0.5 + Math.random() * 2.5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: 0.1 + Math.random() * 0.8,
                            animationDuration: `${3 + Math.random() * 5}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            boxShadow: Math.random() > 0.7 ? `0 0 ${4 + Math.random() * 6}px rgba(255,255,255,0.9)` : 'none',
                        }}
                    />
                ))}
            </div>

            {/* Exit/Back Button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 px-4 py-2.5 rounded-full glass-input text-pink-100 font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 group shadow-sm z-50 border border-white/10 backdrop-blur-md"
                >
                    <span className="text-sm group-hover:-translate-x-0.5 transition-transform">←</span> {isNewSession ? 'Back to Hub' : 'Exit to Auremous'}
                </button>
            )}

            {/* ═══ Left Hero Panel (Desktop) — Transparent Glass ═══ */}
            <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-shrink-0 flex-col items-center justify-center relative z-10 text-white border-r border-white/5 bg-[#050510]/50 backdrop-blur-sm shadow-[inset_-10px_0_50px_rgba(236,72,153,0.05)]">
                {/* Vintage glowing bg elements from earlier iteration */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-1/3 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                    {/* Concentric rings */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full z-0 opacity-40 animate-spin-slow" />
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-white/5 rounded-full z-0 opacity-20" style={{ animation: 'spin 60s linear infinite reverse' }} />
                </div>
                
                <div className="relative z-10 text-center px-10 max-w-lg mt-12">
                    <div className="text-8xl mb-8 drop-shadow-2xl animate-bounce-slow">
                        {current.emoji}
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-4 drop-shadow-lg">
                        {current.title}
                    </h2>
                    <p className="text-white/70 text-lg font-bold tracking-wide">
                        {current.subtitle}
                    </p>
                    
                    {/* Step Indicators */}
                    <div className="flex items-center justify-center gap-3 mt-12">
                        {STEPS.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                    i === Math.min(step, 4) 
                                        ? 'w-12 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
                                        : i < step 
                                            ? 'w-5 bg-white/50' 
                                            : 'w-5 bg-white/15'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Branding */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                    <p className="text-pink-100/30 text-[10px] font-black uppercase tracking-[0.3em]">Auremous Competitive Hub</p>
                </div>
            </div>

            {/* ═══ Right Content Panel ═══ */}
            <div className="flex-1 min-w-0 w-full lg:w-[calc(100%-420px)] xl:w-[calc(100%-480px)] flex flex-col h-full relative z-10 overflow-x-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden px-6 pt-6 pb-4 relative z-10 w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{current.emoji}</span>
                        <div>
                            <h2 className="text-xl font-black text-theme-text">{current.title}</h2>
                            <p className="text-xs text-theme-muted font-bold">{current.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                i <= step ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]' : 'bg-slate-200 dark:bg-slate-800'
                            }`} />
                        ))}
                    </div>
                </div>

                {/* Scrollable Content Pane */}
                <div className="flex-1 min-w-0 w-full h-full relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
                    {/* The core wrapper for transitions. Removes flex-col from parents to prevent width blowout */}
                    <div className="min-h-full min-w-0 w-full flex flex-col items-center justify-center p-4 md:p-8">
                        
                        <div key={step} className={`animate-in fade-in min-w-0 w-full max-w-full mx-auto ${direction > 0 ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} duration-500`}>

                            {/* Step 1: Exam Selection — Holographic HUD View */}
                            {step === 0 && (
                                <div className="min-w-0 w-full flex flex-col justify-center">
                                    <div className="mb-6 text-center relative z-20 w-fit mx-auto px-6 py-4 rounded-3xl bg-black/20 backdrop-blur-md border border-white/5 shadow-2xl">
                                        <p className="text-cyan-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-2 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Scanning Opportunities</p>
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl px-2">Identify Your <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Objectives</span></h3>
                                        <p className="text-white/70 font-bold tracking-widest uppercase text-[10px] md:text-xs mt-4 mb-1">Select the campaigns you intend to master.</p>
                                    </div>
                                    
                                    {/* Hovering Belt - CSS Marquee Auto Scroll */}
                                    {/* Strict block with overflow-hidden limits width strictly to parent */}
                                    <div className="w-full min-w-0 max-w-full overflow-hidden mask-edges-horizontal pb-8 pt-4 relative z-20">
                                        <div className="flex w-max animate-scroll-belt pause-on-hover gap-6 px-6 items-center min-h-[300px]">
                                            {[...activeExams, ...activeExams].map((exam, i) => {
                                                const isSelected = selectedExams.includes(exam.slug) || (exam.slug === 'ap-group' && selectedExams.some(s => apExams.find(ap => ap.slug === s)));
                                                const activeCountForGroup = exam.slug === 'ap-group' ? selectedExams.filter(s => apExams.find(ap => ap.slug === s)).length : 0;
                                                
                                                return (
                                                    <button
                                                        key={exam.slug + '-' + i}
                                                        onClick={() => toggleExam(exam.slug)}
                                                        className={`flex-none w-[220px] h-[270px] relative p-6 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 ease-out group overflow-hidden flex flex-col items-center justify-center text-center ${
                                                            isSelected
                                                                ? 'border-pink-400/60 bg-pink-500/15 shadow-[0_0_60px_rgba(236,72,153,0.4)] scale-[1.05] ring-2 ring-pink-400/40 z-30'
                                                                : 'border-white/20 bg-white/[0.04] hover:border-white/50 hover:bg-white/[0.1] hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:z-20 shadow-xl'
                                                        }`}
                                                    >
                                                        {/* Holographic scanning line */}
                                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent h-[200%] -translate-y-full group-hover:animate-scan z-0 pointer-events-none" />
                                                        
                                                        <div className="relative z-10 flex flex-col items-center gap-4 w-full animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-700 ${
                                                                isSelected ? 'bg-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.3)] rotate-[15deg] scale-110' : 'bg-white/5 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10'
                                                            }`}>
                                                                {exam.flag}
                                                            </div>
                                                            <div className="w-full">
                                                                <span className={`font-black uppercase tracking-widest text-lg block transition-colors ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{exam.name}</span>
                                                                <span className="text-[9px] uppercase font-black text-white/40 block mt-2 tracking-[0.2em] leading-relaxed px-2">{exam.tagline}</span>
                                                                
                                                                {isSelected && exam.slug !== 'ap-group' && (
                                                                    <div className="mt-6 mx-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest animate-in zoom-in duration-300 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Selected
                                                                    </div>
                                                                )}
                                                                {exam.slug === 'ap-group' && activeCountForGroup > 0 && (
                                                                    <div className="mt-6 mx-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest animate-in zoom-in duration-300 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> {activeCountForGroup} Subject{activeCountForGroup > 1 ? 's' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-center pb-4">
                                        <p className="text-white/30 text-[9px] uppercase tracking-widest font-black animate-pulse bg-white/5 border border-white/10 px-5 py-2.5 rounded-full inline-block backdrop-blur-md">← Hover to Pause →</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Exam Date */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="hidden lg:block mb-8">
                                        <h3 className="text-3xl font-black text-theme-text mb-2">Lock In Your Dates</h3>
                                        <p className="text-theme-muted font-medium">We'll build your entire plan around these deadlines.</p>
                                    </div>
                                    <div className="space-y-5">
                                        {selectedExams.map(slug => {
                                            const exam = COMPETITIVE_EXAMS.find(e => e.slug === slug);
                                            return (
                                                <div key={slug} className="beach-card p-6 lg:p-10 hover:border-pink-300/30 transition-all duration-700 ease-in-out group animate-morph">
                                                    <label className="font-black text-theme-text flex items-center gap-3 text-xl mb-6">
                                                        <span className="text-3xl">{exam.flag}</span> {exam.name}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={examDates[slug] || ''}
                                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                        onChange={e => setExamDates(prev => ({ ...prev, [slug]: e.target.value }))}
                                                        className="w-full p-5 rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 text-theme-text focus:ring-4 focus:ring-pink-500/20 outline-none backdrop-blur-md transition-all font-black text-xl hover:bg-white/60 dark:hover:bg-slate-800/60"
                                                    />
                                                    {examDates[slug] && (
                                                        <p className="text-sm text-pink-500 mt-6 font-black animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-3 bg-pink-500/10 p-3 rounded-xl border border-pink-500/20">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                                                            {getDaysMessage(examDates[slug])}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Daily Hours */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="hidden lg:block mb-8">
                                        <h3 className="text-3xl font-black text-theme-text mb-2">Daily Commitment</h3>
                                        <p className="text-theme-muted font-medium">Be honest — we'll adapt your plan to this.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {hourOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setDailyHours(opt.value)}
                                                className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 flex items-center gap-5 group ${
                                                    dailyHours === opt.value
                                                        ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/10 scale-[1.02] ring-4 ring-indigo-500/10'
                                                        : 'border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400/50 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-lg hover:-translate-y-0.5'
                                                }`}
                                            >
                                                <span className="text-4xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                                <div>
                                                    <span className="font-black text-theme-text block text-xl">{opt.label}</span>
                                                    <span className="text-sm font-bold text-theme-muted">{opt.desc}</span>
                                                </div>
                                                {dailyHours === opt.value && (
                                                    <div className="ml-auto w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                                        <span className="text-white text-sm font-black">✓</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Current Level */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="hidden lg:block mb-8">
                                        <h3 className="text-3xl font-black text-theme-text mb-2">Your Starting Point</h3>
                                        <p className="text-theme-muted font-medium">This helps us personalise the difficulty curve.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {levelOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setCurrentLevel(opt.value)}
                                                className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 flex items-center gap-5 group ${
                                                    currentLevel === opt.value
                                                        ? 'border-pink-400/60 bg-gradient-to-r from-pink-500/10 to-orange-500/10 shadow-xl shadow-pink-500/10 scale-[1.02] ring-4 ring-pink-400/10'
                                                        : 'border-slate-200/60 dark:border-slate-700/60 hover:border-pink-300/40 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-lg hover:-translate-y-0.5'
                                                }`}
                                            >
                                                <span className="text-4xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                                                <div>
                                                    <span className="font-black text-theme-text block text-xl">{opt.label}</span>
                                                    <span className="text-sm font-bold text-theme-muted">{opt.desc}</span>
                                                </div>
                                                {currentLevel === opt.value && (
                                                    <div className="ml-auto w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
                                                        <span className="text-white text-sm font-black">✓</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Launch */}
                            {step === 4 && (
                                <div className="text-center py-8">
                                    <div className="relative p-10 lg:p-14">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl rounded-full animate-morph pointer-events-none" />
                                        <div className="relative z-10 transition-all duration-500">
                                            <div className="text-8xl mb-8 animate-bounce-slow drop-shadow-2xl">🚀</div>
                                            <h2 className="text-4xl lg:text-5xl font-black text-theme-text mb-4 tracking-tight">You're All Set!</h2>
                                            <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-6">
                                                <span className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-sm font-black uppercase tracking-widest">
                                                    {selectedExams.length} Exam{selectedExams.length > 1 ? 's' : ''}
                                                </span>
                                                <span className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-black uppercase tracking-widest">
                                                    {dailyHours} hrs/day
                                                </span>
                                            </div>
                                            <p className="text-theme-muted mb-10 font-bold text-lg max-w-sm mx-auto">Your personalised AI battle plan is ready to deploy.</p>
                                            
                                            {!isLoading && !planError ? (
                                                <button
                                                    onClick={handleFinish}
                                                    className="relative overflow-hidden w-full lg:w-auto px-14 py-6 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 text-white font-black text-lg tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-2xl shadow-pink-500/30 hover:scale-105 group"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12" />
                                                    <span className="relative z-10">Launch My Plan →</span>
                                                </button>
                                            ) : planError ? (
                                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                                    <div className="flex items-center justify-center gap-3 text-red-400 font-bold text-sm mb-2">
                                                        <span>⚠️</span>
                                                        <span>{planError}</span>
                                                    </div>
                                                    <button
                                                        onClick={handleFinish}
                                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                                                    >
                                                        Retry →
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Fire-and-forget — don't await Firestore
                                                            if (currentUser) {
                                                                completeOnboarding(currentUser.uid).catch(() => {});
                                                            }
                                                            onComplete();
                                                        }}
                                                        className="w-full py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/5"
                                                    >
                                                        Skip & Enter Hub Anyway →
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                                    <div className="flex items-center justify-center gap-4 text-pink-500 font-black tracking-widest uppercase mb-4">
                                                        <span className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                                                        <span>Generating Plan...</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-theme-muted uppercase tracking-[0.2em] mb-4">Please wait while we build your personalised schedule.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Success View */}
                            {step === 5 && (
                                <div className="text-center py-8">
                                    <div className="relative p-10 lg:p-14">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-full animate-morph pointer-events-none" />
                                        <div className="relative z-10 p-6 rounded-[3rem] bg-white/5 dark:bg-slate-900/10 backdrop-blur-sm border border-emerald-500/10">
                                            <div className="text-8xl mb-8 animate-bounce-slow drop-shadow-2xl">🎉</div>
                                            <h2 className="text-4xl lg:text-5xl font-black text-theme-text mb-4 tracking-tight">Mission Accomplished</h2>
                                            <p className="text-theme-muted mb-10 font-bold text-lg max-w-sm mx-auto">Your AI battle plan is deployed and ready in the Hub.</p>
                                            
                                            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                                <button
                                                    onClick={onComplete}
                                                    className="w-full relative overflow-hidden py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-2xl shadow-emerald-500/30 hover:scale-105 group"
                                                >
                                                    <span className="relative z-10">Enter Competitive Hub ✨</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => {
                                                        setSelectedExams([]);
                                                        setStep(0);
                                                    }}
                                                    className="w-full relative overflow-hidden py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-pink-300 dark:hover:border-pink-500/50 text-theme-text font-black text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 hover:shadow-lg group"
                                                >
                                                    <span className="relative z-10 text-theme-muted group-hover:text-pink-500 transition-colors">➕ Setup Another Exam</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Footer */}
                {step < 4 && (
                    <div className="px-6 lg:px-10 pb-6 lg:pb-8 pt-4 flex gap-4 relative z-10 bg-gradient-to-t from-theme-bg via-theme-bg/80 to-transparent max-w-xl w-full mx-auto">
                        {step > 0 && (
                            <button onClick={goBack} className="px-7 py-4 rounded-2xl glass-input text-theme-text font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={goNext}
                            disabled={!canProceed()}
                            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 text-white font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* ═══ AP Sub-Selection Modal/Overlay ═══ */}
                {showAPModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in zoom-in-95 duration-300">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAPModal(false)} />
                        
                        {/* Modal Content */}
                        <div className="relative z-10 w-full max-w-5xl bg-slate-950/80 border-2 border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-[0_0_100px_rgba(236,72,153,0.15)] overflow-hidden flex flex-col h-[85vh] lg:h-auto max-h-[900px]">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-pink-500/20 to-transparent blur-3xl rounded-full" />
                            
                            <div className="relative z-10 flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tight leading-tight">Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">AP Subjects</span></h3>
                                    <p className="text-white/50 font-bold tracking-wide mt-2">Select as many Advanced Placement subjects as you are taking.</p>
                                </div>
                                <button onClick={() => setShowAPModal(false)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all active:scale-95">
                                    ✕
                                </button>
                            </div>

                            {/* AP Grid */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {apExams.map(exam => (
                                        <button
                                            key={exam.slug}
                                            onClick={() => {
                                                setSelectedExams(prev => 
                                                    prev.includes(exam.slug) ? prev.filter(s => s !== exam.slug) : [...prev, exam.slug]
                                                );
                                            }}
                                            className={`p-6 rounded-[2rem] border text-left transition-all duration-300 flex items-center gap-5 group ${
                                                selectedExams.includes(exam.slug)
                                                    ? 'border-orange-500/50 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20 scale-[1.02]'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <div className="text-4xl group-hover:scale-110 transition-transform">{exam.flag}</div>
                                            <div className="flex-1">
                                                <span className={`font-black text-lg block ${selectedExams.includes(exam.slug) ? 'text-white' : 'text-white/80'}`}>{exam.name}</span>
                                            </div>
                                            {selectedExams.includes(exam.slug) && (
                                                <div className="w-6 h-6 rounded-full bg-orange-500 shadow-lg shadow-orange-500/40 flex items-center justify-center text-white text-xs font-black animate-in zoom-in duration-200">
                                                    ✓
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Done Button */}
                            <div className="flex justify-end pt-6 border-t border-white/10">
                                <button
                                    onClick={() => setShowAPModal(false)}
                                    className="px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-500/30"
                                >
                                    Confirm Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitiveOnboarding;
