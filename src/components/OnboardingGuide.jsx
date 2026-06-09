import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Check, Activity, Bot, GraduationCap, Eye, Mic, Video, ClipboardList, FileText, Trophy, Sparkles, Swords, BrainCircuit, Target, Clock, AlertTriangle } from './Icons';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useAuth } from '../contexts/AuthContext';

const AuraBot = ({ speaking = false }) => (
    <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 h-56 md:w-56 md:h-72 drop-shadow-[0_0_40px_rgba(201,165,90,0.4)]" style={{ filter: 'drop-shadow(0 0 30px rgba(201,165,90,0.3))' }}>
        <defs>
            <linearGradient id="auraBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a55a" />
                <stop offset="100%" stopColor="#b48c3f" />
            </linearGradient>
            <linearGradient id="auraScreen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0c0906" />
                <stop offset="100%" stopColor="#0a0805" />
            </linearGradient>
            <radialGradient id="auraGlow">
                <stop offset="0%" stopColor="#c9a55a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c9a55a" stopOpacity="0" />
            </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="100" cy="130" r="110" fill="url(#auraGlow)" />

        {/* Antenna */}
        <path d="M100 18 L100 42" stroke="#c9a55a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="12" r="9" fill="#fcd34d">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Head */}
        <rect x="45" y="40" width="110" height="85" rx="22" fill="url(#auraBody)" />
        <rect x="45" y="40" width="110" height="85" rx="22" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />

        {/* Screen */}
        <rect x="56" y="50" width="88" height="55" rx="12" fill="url(#auraScreen)" />

        {/* Happy Eyes */}
        <path d="M 76 72 Q 82 60 88 72" stroke="#c9a55a" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 76 72 Q 82 60 88 72;M 76 70 Q 82 68 88 70;M 76 72 Q 82 60 88 72" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M 112 72 Q 118 60 124 72" stroke="#c9a55a" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 112 72 Q 118 60 124 72;M 112 70 Q 118 68 124 70;M 112 72 Q 118 60 124 72" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Mouth */}
        <path d="M 88 87 Q 100 100 112 87" stroke="#c9a55a" strokeWidth="4" strokeLinecap="round" fill="none">
            {speaking && <animate attributeName="d" values="M 88 87 Q 100 100 112 87;M 88 90 Q 100 92 112 90;M 88 87 Q 100 100 112 87" dur="0.5s" repeatCount="indefinite" />}
        </path>

        {/* Neck */}
        <rect x="85" y="125" width="30" height="14" rx="4" fill="#8c6c29" />

        {/* Body */}
        <rect x="35" y="139" width="130" height="90" rx="28" fill="url(#auraBody)" />
        <rect x="35" y="139" width="130" height="90" rx="28" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />

        {/* Core circle */}
        <circle cx="100" cy="180" r="28" fill="#0c0906" stroke="#c9a55a" strokeWidth="1.5" opacity="0.8" />
        <path d="M90 180 L110 180 M100 170 L100 190" stroke="#c9a55a" strokeWidth="4" strokeLinecap="round" />

        {/* Arms */}
        <path d="M 35 165 Q 5 175 15 205" stroke="url(#auraBody)" strokeWidth="16" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 35 165 Q 5 175 15 205;M 35 165 Q 0 155 10 195;M 35 165 Q 5 175 15 205" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M 165 165 Q 195 175 185 205" stroke="url(#auraBody)" strokeWidth="16" strokeLinecap="round" fill="none" />
    </svg>
);

const PREP_OPTIONS = [
    { id: 'army', title: 'NCC Army Wing', icon: <Target className="w-5 h-5 text-green-500" /> },
    { id: 'navy', title: 'NCC Naval Wing', icon: <Activity className="w-5 h-5 text-blue-500" /> },
    { id: 'airforce', title: 'NCC Air Wing', icon: <Target className="w-5 h-5 text-cyan-500" /> },
    { id: 'cert_a', title: 'Certificate A Exam', icon: <GraduationCap className="w-5 h-5 text-theme-primary" /> },
    { id: 'cert_b', title: 'Certificate B Exam', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
    { id: 'cert_c', title: 'Certificate C Exam', icon: <Trophy className="w-5 h-5 text-orange-500" /> }
];

const LEVEL_OPTIONS = [
    { id: 'beginner', title: 'Absolute Beginner', desc: 'I am just starting out and need foundational clarity.' },
    { id: 'intermediate', title: 'Intermediate', desc: 'I know the basics, but struggle with complex problems.' },
    { id: 'advanced', title: 'Advanced', desc: 'I am aiming for top ranks. I need high-level rigor.' }
];

const CHALLENGE_OPTIONS = [
    { id: 'concepts', title: 'Conceptual Clarity', desc: 'I memorize things but forget them. I need deep understanding.' },
    { id: 'time', title: 'Time Management', desc: 'I can solve problems, but I take too long.' },
    { id: 'anxiety', title: 'Test Anxiety', desc: 'I blank out during actual exams despite preparing well.' },
    { id: 'resources', title: 'Lack of Resources', desc: 'I don\'t have access to good coaching or curated materials.' }
];

const OnboardingGuide = ({ onComplete }) => {
    const { setGlobalInstructions, setUnderstandingLevel } = useUserPreferences();
    const { currentUser } = useAuth();
    
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    
    const [answers, setAnswers] = useState({
        prep: '',
        level: '',
        challenge: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
        setTimeout(() => handleNext(), 300); // Auto-advance
    };

    const handleNext = () => {
        if (step < 5) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const generateDashboard = () => {
        setStep(5);
        
        // Formulate strict persona instructions
        const prepStr = PREP_OPTIONS.find(o => o.id === answers.prep)?.title || 'General Studies';
        const challengeStr = CHALLENGE_OPTIONS.find(o => o.id === answers.challenge)?.title || 'Learning Optimization';
        
        const strictInstructions = `CADET PROFILE OVERRIDE:
The cadet is currently preparing for: ${prepStr}.
Their current self-assessed level is: ${answers.level}.
Their biggest training roadblock is: ${challengeStr}.

CRITICAL BEHAVIORAL DIRECTIVE:
You are an elite NCC Instructor and Mentor. You must act as their absolute lifeline for NCC syllabus, discipline, and training. Every single response you give across all features (Neural Query, Quizzes) MUST be hyper-personalized to address their specific preparation (${prepStr}) and counter their biggest challenge (${challengeStr}). Enforce military discipline, leadership qualities, and strict adherence to the NCC curriculum. Never give generic advice. Be their world-class mentor.`;

        // Save to contexts
        setGlobalInstructions(strictInstructions);
        setUnderstandingLevel(answers.level || 'auto');

        setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onComplete(), 400);
        }, 3000);
    };

    useEffect(() => {
        if (step === 5 && isVisible) {
            generateDashboard();
        }
    }, [step]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-[#0c0906]/95 backdrop-blur-2xl" />

            <div className="relative z-10 w-full max-w-2xl mx-4 flex flex-col items-center">
                
                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="text-center space-y-8 animate-fade-in-up">
                        <AuraBot speaking={true} />
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tightest">
                            You bring the <span className="text-theme-primary">intent.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-theme-muted font-light">
                            We bring <span className="text-white font-medium">everything else.</span>
                        </p>
                        <button 
                            onClick={handleNext}
                            className="mt-8 px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-[#0c0906] rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(201,165,90,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Begin Journey <ChevronRight className="w-5 h-5 inline-block ml-2" />
                        </button>
                    </div>
                )}

                {/* Step 2: What are you preparing for? */}
                {step === 2 && (
                    <div className="w-full animate-fade-in-right">
                        <button onClick={handleBack} className="text-theme-muted hover:text-white mb-6 flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors"><ChevronLeft className="w-4 h-4"/> Back</button>
                        <h2 className="text-3xl font-black text-white mb-2">What are you preparing for?</h2>
                        <p className="text-theme-muted mb-8">We will tailor your entire experience to this curriculum.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {PREP_OPTIONS.map(opt => (
                                <button 
                                    key={opt.id}
                                    onClick={() => handleSelect('prep', opt.id)}
                                    className="p-5 rounded-2xl border border-white/[0.08] bg-[#0e0b07] hover:bg-theme-primary/10 hover:border-theme-primary/40 text-left flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] shadow-depth"
                                >
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">{opt.icon}</div>
                                    <span className="text-white font-bold tracking-wide">{opt.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Current Level */}
                {step === 3 && (
                    <div className="w-full animate-fade-in-right">
                        <button onClick={handleBack} className="text-theme-muted hover:text-white mb-6 flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors"><ChevronLeft className="w-4 h-4"/> Back</button>
                        <h2 className="text-3xl font-black text-white mb-2">What is your current level?</h2>
                        <p className="text-theme-muted mb-8">Be honest. We adjust our AI's difficulty based on this.</p>
                        
                        <div className="flex flex-col gap-4">
                            {LEVEL_OPTIONS.map(opt => (
                                <button 
                                    key={opt.id}
                                    onClick={() => handleSelect('level', opt.id)}
                                    className="p-5 rounded-2xl border border-white/[0.08] bg-[#0e0b07] hover:bg-theme-primary/10 hover:border-theme-primary/40 text-left transition-all duration-300 hover:scale-[1.02] shadow-depth"
                                >
                                    <h3 className="text-lg font-black text-white mb-1">{opt.title}</h3>
                                    <p className="text-sm text-theme-muted">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Biggest Challenge */}
                {step === 4 && (
                    <div className="w-full animate-fade-in-right">
                        <button onClick={handleBack} className="text-theme-muted hover:text-white mb-6 flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors"><ChevronLeft className="w-4 h-4"/> Back</button>
                        <h2 className="text-3xl font-black text-white mb-2">What is your biggest roadblock?</h2>
                        <p className="text-theme-muted mb-8">We will build your remediation strategy around this weakness.</p>
                        
                        <div className="flex flex-col gap-4">
                            {CHALLENGE_OPTIONS.map(opt => (
                                <button 
                                    key={opt.id}
                                    onClick={() => handleSelect('challenge', opt.id)}
                                    className="p-5 rounded-2xl border border-white/[0.08] bg-[#0e0b07] hover:bg-theme-primary/10 hover:border-theme-primary/40 text-left transition-all duration-300 hover:scale-[1.02] shadow-depth"
                                >
                                    <h3 className="text-lg font-black text-white mb-1">{opt.title}</h3>
                                    <p className="text-sm text-theme-muted">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Generating Dashboard */}
                {step === 5 && (
                    <div className="text-center space-y-8 animate-fade-in-up">
                        <div className="relative">
                            <div className="absolute inset-0 bg-theme-primary/20 blur-[100px] rounded-full" />
                            <BrainCircuit className="w-24 h-24 text-theme-primary mx-auto relative z-10 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Generating your ecosystem...</h2>
                        <p className="text-theme-primary font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-theme-primary animate-ping" />
                            Personalizing Neural Weights
                            <span className="w-2 h-2 rounded-full bg-theme-primary animate-ping" />
                        </p>
                    </div>
                )}
            </div>
            
            {/* Ambient Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/10 blur-[120px] rounded-full mix-blend-screen float-slow" />
                 <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-theme-secondary/10 blur-[100px] rounded-full mix-blend-screen float-slow" style={{ animationDelay: '2s' }} />
            </div>

            <style>{`
                .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in-right { animation: fadeInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default OnboardingGuide;
