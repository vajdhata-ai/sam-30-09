import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Check, Activity, Bot, GraduationCap, Eye, Mic, Video, ClipboardList, FileText, Trophy, Sparkles, Rocket } from 'lucide-react';

const AuraBot = ({ speaking = false }) => (
    <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 h-56 md:w-56 md:h-72 drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.3))' }}>
        <defs>
            <linearGradient id="auraBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="auraScreen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <radialGradient id="auraGlow">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="100" cy="130" r="110" fill="url(#auraGlow)" />

        {/* Antenna */}
        <path d="M100 18 L100 42" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="12" r="9" fill="#fbbf24">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="12" r="14" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Head */}
        <rect x="45" y="40" width="110" height="85" rx="22" fill="url(#auraBody)" />
        <rect x="45" y="40" width="110" height="85" rx="22" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />

        {/* Screen */}
        <rect x="56" y="50" width="88" height="55" rx="12" fill="url(#auraScreen)" />

        {/* Happy Eyes */}
        <path d="M 76 72 Q 82 60 88 72" stroke="#4ade80" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 76 72 Q 82 60 88 72;M 76 70 Q 82 68 88 70;M 76 72 Q 82 60 88 72" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M 112 72 Q 118 60 124 72" stroke="#4ade80" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 112 72 Q 118 60 124 72;M 112 70 Q 118 68 124 70;M 112 72 Q 118 60 124 72" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Blush */}
        <circle cx="68" cy="88" r="6" fill="#ec4899" fillOpacity="0.5" />
        <circle cx="132" cy="88" r="6" fill="#ec4899" fillOpacity="0.5" />

        {/* Mouth - animated */}
        <path d="M 88 87 Q 100 100 112 87" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" fill="none">
            {speaking && <animate attributeName="d" values="M 88 87 Q 100 100 112 87;M 88 90 Q 100 92 112 90;M 88 87 Q 100 100 112 87" dur="0.5s" repeatCount="indefinite" />}
        </path>

        {/* Neck */}
        <rect x="85" y="125" width="30" height="14" rx="4" fill="#5b21b6" />

        {/* Body */}
        <rect x="35" y="139" width="130" height="90" rx="28" fill="url(#auraBody)" />
        <rect x="35" y="139" width="130" height="90" rx="28" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />

        {/* Core circle */}
        <circle cx="100" cy="180" r="28" fill="#312e81" stroke="#4ade80" strokeWidth="1.5" opacity="0.8" />
        <path d="M90 180 L110 180 M100 170 L100 190" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />

        {/* Arms */}
        <path d="M 35 165 Q 5 175 15 205" stroke="url(#auraBody)" strokeWidth="16" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M 35 165 Q 5 175 15 205;M 35 165 Q 0 155 10 195;M 35 165 Q 5 175 15 205" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M 165 165 Q 195 175 185 205" stroke="url(#auraBody)" strokeWidth="16" strokeLinecap="round" fill="none" />

        {/* Wave hand */}
        <circle cx="15" cy="205" r="10" fill="#a78bfa">
            <animate attributeName="cy" values="205;195;205" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Wheels */}
        <rect x="62" y="229" width="22" height="14" rx="6" fill="#1e1b4b" />
        <rect x="116" y="229" width="22" height="14" rx="6" fill="#1e1b4b" />
    </svg>
);

const steps = [
    {
        title: "Hey there, I'm Aura! 👋",
        content: "Welcome to Auremous — your AI-powered, all-in-one study companion! I'm going to give you a quick tour of everything you can do here. Trust me, it's going to be epic.",
        icon: <Sparkles className="w-7 h-7 text-amber-400" />,
        bg: "from-violet-600/20 via-indigo-600/10 to-transparent",
        accent: "bg-violet-500"
    },
    {
        title: "Doubt Solver 🧠",
        content: "Got a tricky question? Just type it, paste an image, or throw in a math equation — I'll give you a clear, step-by-step breakdown. No question is too weird!",
        icon: <Bot className="w-7 h-7 text-violet-400" />,
        bg: "from-indigo-600/20 via-blue-600/10 to-transparent",
        accent: "bg-indigo-500"
    },
    {
        title: "Auremous Lens 👁️",
        content: "Upload your PDFs, notes, or textbook pages. I'll read through everything, summarize key concepts, generate flashcards, and create study materials — in seconds flat.",
        icon: <Eye className="w-7 h-7 text-cyan-400" />,
        bg: "from-blue-600/20 via-cyan-600/10 to-transparent",
        accent: "bg-cyan-500"
    },
    {
        title: "College Compass 🧭",
        content: "Planning for college? Predict your rank, find matching universities, compare colleges head-to-head, get scholarship matches, and craft killer admission essays — all in one place.",
        icon: <GraduationCap className="w-7 h-7 text-emerald-400" />,
        bg: "from-cyan-600/20 via-teal-600/10 to-transparent",
        accent: "bg-teal-500"
    },
    {
        title: "Podcast & Video Studio 🎙️",
        content: "Turn boring notes into realistic AI podcasts or educational videos. Listen to your study material on the go, or watch engaging breakdowns of complex topics.",
        icon: <Mic className="w-7 h-7 text-rose-400" />,
        bg: "from-rose-600/20 via-pink-600/10 to-transparent",
        accent: "bg-rose-500"
    },
    {
        title: "Quiz & Paper Generator 📝",
        content: "Test yourself with AI-generated quizzes, track your performance, and create custom sample papers for any exam — CBSE, JEE, NEET, you name it.",
        icon: <ClipboardList className="w-7 h-7 text-orange-400" />,
        bg: "from-orange-600/20 via-amber-600/10 to-transparent",
        accent: "bg-orange-500"
    },
    {
        title: "Competitive Hub 🚀",
        content: "Preparing for JEE, NEET, or UPSC? Get an AI-powered timetable, daily tasks, streak tracking, and focused practice on your weak areas. Let's dominate those exams.",
        icon: <Trophy className="w-7 h-7 text-yellow-400" />,
        bg: "from-yellow-600/20 via-orange-600/10 to-transparent",
        accent: "bg-yellow-500"
    },
    {
        title: "You're All Set! 🎉",
        content: "That's everything! Explore at your own pace, ask me anything, and remember — every feature is designed to make studying feel less like a grind and more like a superpower.",
        icon: <Rocket className="w-7 h-7 text-emerald-400" />,
        bg: "from-emerald-600/20 via-green-600/10 to-transparent",
        accent: "bg-emerald-500"
    }
];

const OnboardingGuide = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const nextStep = () => {
        setDirection(1);
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(() => onComplete(), 400);
    };

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 scale-95'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleComplete} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-4 md:mx-auto">
                {/* Aura Bot */}
                <div className="mb-2 md:mb-4" style={{ animation: 'auraFloat 4s ease-in-out infinite' }}>
                    <AuraBot speaking={true} />
                </div>

                {/* Speech Card */}
                <div className={`w-full rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-white/10 transition-all duration-500`}>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/5">
                        <div className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500 transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%` }} />
                    </div>

                    <div className={`bg-gradient-to-br ${step.bg} bg-slate-950/95 backdrop-blur-xl p-8 md:p-10`}>
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className={`p-3 rounded-2xl ${step.accent}/20 border border-white/10`}>
                                {step.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{step.title}</h2>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                                    Step {currentStep + 1} of {steps.length}
                                </p>
                            </div>
                        </div>

                        {/* Body */}
                        <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium mb-8" key={currentStep} style={{ animation: 'auraSlideIn 0.4s ease-out' }}>
                            {step.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            {/* Dots */}
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setDirection(i > currentStep ? 1 : -1); setCurrentStep(i); }}
                                        className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer hover:opacity-80 ${i === currentStep ? 'w-8 bg-gradient-to-r from-violet-400 to-pink-400' : i < currentStep ? 'w-2.5 bg-white/30' : 'w-2.5 bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                {currentStep > 0 && (
                                    <button onClick={prevStep} className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-90">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-xl shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {currentStep === steps.length - 1 ? (
                                        <>Let's Go! <Check className="w-4 h-4" /></>
                                    ) : (
                                        <>Next <ChevronRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skip */}
                <button onClick={handleComplete} className="mt-6 text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 hover:gap-3">
                    <X className="w-3 h-3" /> Skip Tour
                </button>
            </div>

            <style>{`
                @keyframes auraFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes auraSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default OnboardingGuide;
