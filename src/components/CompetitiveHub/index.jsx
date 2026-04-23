import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasCompletedOnboarding } from '../../utils/competitiveHubService';
import CompetitiveOnboarding from './CompetitiveOnboarding';
import CompetitiveHome from './CompetitiveHome';
import CompetitiveLearning from './CompetitiveLearning';
import QuestionSolver from './QuestionSolver';
import MockTestArena from './MockTestArena';
import ProgressHub from './ProgressHub';
import CompetitivePodcast from './CompetitivePodcast';
import Leaderboard from './Leaderboard';
import RocketLoader from './components/RocketLoader';
import PremiumGuard from '../PremiumGuard';

// ⚠️  UNDER DEVELOPMENT FLAG — set to false when the hub is ready for production
const HUB_UNDER_DEVELOPMENT = false;

/**
 * Main Competitive Hub router.
 * Flow for NEW users:   launch → onboarding → landing → home
 * Flow for RETURNING:   launch → home (skip landing, they've seen it)
 * 
 * When HUB_UNDER_DEVELOPMENT is true, the flow is:
 *   launch → aura_apology (blocks all access, offers return to dashboard)
 */
const CompetitiveHubRouter = ({ onExitHub }) => {
    const { currentUser } = useAuth();
    const [hubView, setHubView] = useState('launch'); // New users go straight to launch — no syncing screen
    const [studyContext, setStudyContext] = useState({ topicId: null, examSlug: null });
    const [learningExamSlug, setLearningExamSlug] = useState(null);
    const [solverExamSlug, setSolverExamSlug] = useState(null);
    const [mockTestExamSlug, setMockTestExamSlug] = useState(null);
    const [podcastContext, setPodcastContext] = useState({ topicName: '', examSlug: '' });
    const [progressExamSlug, setProgressExamSlug] = useState(null);

    // Store in a ref so the setTimeout callback in RocketLoader always reads the latest value
    const onboardedRef = useRef(false);

    useEffect(() => {
        if (!currentUser) return;
        checkOnboarding();
    }, [currentUser]);

    const checkOnboarding = async () => {
        if (!currentUser) { onboardedRef.current = false; setHubView('launch'); return; }
        try {
            const result = await hasCompletedOnboarding(currentUser.uid);
            
            // Even if the profile says onboarded, if they have no exams, route them back to initial selection
            const { getUserExams } = await import('../../utils/competitiveHubService');
            const exams = await getUserExams(currentUser.uid);
            
            onboardedRef.current = result && exams.length > 0;
            console.log('[Hub] Onboarding check:', onboardedRef.current, '- Launching rocket sequence for everyone!');
        } catch (err) {
            console.error('Onboarding check error:', err);
            onboardedRef.current = true;
        }
    };

    // After rocket launch → gate check
    const handleLaunchComplete = () => {
        console.log('[Hub] Launch complete. Onboarded:', onboardedRef.current);
        
        // ⚠️ DEVELOPMENT GATE — block all access when hub is under development
        if (HUB_UNDER_DEVELOPMENT) {
            setHubView('aura_apology');
            return;
        }

        setHubView(onboardedRef.current ? 'home' : 'onboarding');
    };

    // After completing onboarding → play landing animation
    const handleOnboardingComplete = () => setHubView('landing');

    // After landing → show dashboard
    const handleLandingComplete = () => setHubView('home');

    const handleStartStudy = (topicId, examSlug) => {
        setStudyContext({ topicId, examSlug });
        setHubView('study');
    };

    const handleOpenLearning = (examSlug) => {
        setLearningExamSlug(examSlug);
        setHubView('learning');
    };

    const handleOpenSolver = (examSlug) => {
        setSolverExamSlug(examSlug);
        setHubView('solver');
    };

    const handleOpenMockTest = (examSlug) => {
        setMockTestExamSlug(examSlug);
        setHubView('mock_test');
    };

    const handleViewProgress = (examSlug) => {
        setProgressExamSlug(examSlug);
        setHubView('progress');
    };

    const handleOpenLeaderboard = () => {
        setHubView('leaderboard');
    };

    const handleBackToHome = () => setHubView('home');

    // ── CHECKING STATE — Mission Control HUD ──
    if (hubView === 'checking') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #050510, #0a0a2a, #050510)' }}>
                {/* Subtle stars */}
                <div className="absolute inset-0 z-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full"
                             style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.1 + Math.random() * 0.4 }} />
                    ))}
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                        <span className="block w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                        <span className="absolute inset-0 block w-16 h-16 rounded-full border-2 border-purple-500/10 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_12px_rgba(129,140,248,0.6)]" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-indigo-400/60 text-[9px] font-black uppercase tracking-[0.4em]">Mission Control</p>
                        <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">Verifying Hub Access...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── LAUNCH ──
    if (hubView === 'launch') {
        return <RocketLoader mode="launch" title="Competitive Hub" onExit={onExitHub} onComplete={handleLaunchComplete} />;
    }

    // ── AURA APOLOGY (Under Development Gate) ──
    if (hubView === 'aura_apology') {
        return <AuraApologyScreen onExit={onExitHub} />;
    }

    // ── ONBOARDING ──
    if (hubView === 'onboarding') {
        return (
            <CompetitiveOnboarding 
                onComplete={handleOnboardingComplete}
                onCancel={onboardedRef.current ? handleBackToHome : onExitHub}
                isNewSession={onboardedRef.current}
            />
        );
    }

    // ── LANDING ──
    if (hubView === 'landing') {
        return <RocketLoader mode="landing" title="Arriving at Hub" onComplete={handleLandingComplete} />;
    }

    // ── STUDY (Legacy / Direct from Tasks) ──
    if (hubView === 'study') {
        const handleStartPodcast = (topicName, examSlug) => {
            setPodcastContext({ topicName, examSlug });
            setHubView('podcast');
        };
        return (
            <CompetitiveLearning 
                initialTopicId={studyContext.topicId} 
                examSlug={studyContext.examSlug}
                onBack={handleBackToHome} 
                onStartPodcast={handleStartPodcast} 
            />
        );
    }

    // ── LEARNING ZONE ──
    if (hubView === 'learning') {
        return <CompetitiveLearning examSlug={learningExamSlug} onBack={handleBackToHome} onStartPodcast={(tn, es) => {
            setPodcastContext({ topicName: tn, examSlug: es });
            setHubView('podcast');
        }} />;
    }

    // ── QUESTION SOLVER ──
    if (hubView === 'solver') {
        return <QuestionSolver examSlug={solverExamSlug} onBack={handleBackToHome} />;
    }

    // ── MOCK TEST ARENA ──
    if (hubView === 'mock_test') {
        return <MockTestArena examSlug={mockTestExamSlug} onBack={handleBackToHome} />;
    }

    // ── PROGRESS ──
    if (hubView === 'progress') {
        return <ProgressHub examSlug={progressExamSlug} onStudyTopic={handleStartStudy} onBack={handleBackToHome} />;
    }

    // ── PODCAST ──
    if (hubView === 'podcast') {
        return <CompetitivePodcast topicName={podcastContext.topicName} examSlug={podcastContext.examSlug} onBack={handleBackToHome} />;
    }

    // ── LEADERBOARD ──
    if (hubView === 'leaderboard') {
        return <Leaderboard onBack={handleBackToHome} />;
    }

    // ── HOME ──
    return (
        <PremiumGuard featureName="Competitive Hub">
            <CompetitiveHome
                onStartStudy={handleStartStudy}
                onOpenLearning={handleOpenLearning}
                onOpenSolver={handleOpenSolver}
                onOpenMockTest={handleOpenMockTest}
                onOpenLeaderboard={handleOpenLeaderboard}
                onViewProgress={handleViewProgress}
                onSetupNewExam={() => {
                    onboardedRef.current = false; // Reset to ensure we go through onboarding step
                    setHubView('launch');
                }}
                onExitHub={onExitHub}
            />
        </PremiumGuard>
    );
};

/* ═══════════════════════════════════════════════════════
   AURA APOLOGY SCREEN
   Shown when HUB_UNDER_DEVELOPMENT = true.
   Beautiful full-screen overlay with Aura floating in,
   apologising that the hub is under development.
   ═══════════════════════════════════════════════════════ */
const AuraApologyScreen = ({ onExit }) => {
    const [showContent, setShowContent] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShowContent(true), 300);
        const t2 = setTimeout(() => setShowBubble(true), 900);
        const t3 = setTimeout(() => setShowButton(true), 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a2e 40%, #120828 70%, #050510 100%)' }}>

            {/* Animated stars background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-white"
                         style={{
                             width: `${0.5 + Math.random() * 2}px`,
                             height: `${0.5 + Math.random() * 2}px`,
                             top: `${Math.random() * 100}%`,
                             left: `${Math.random() * 100}%`,
                             opacity: 0.1 + Math.random() * 0.5,
                             animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
                             animationDelay: `${Math.random() * 3}s`,
                         }} />
                ))}
                {/* Nebula glows */}
                <div className="absolute w-[600px] h-[600px] rounded-full bg-pink-500/[0.08] blur-[150px] -top-40 -right-40" />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/[0.08] blur-[150px] -bottom-40 -left-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Orbital rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03]"
                     style={{ animation: 'auraOrbitSpin 80s linear infinite' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-dashed border-pink-500/[0.06]"
                     style={{ animation: 'auraOrbitSpin 120s linear infinite reverse' }} />
            </div>

            {/* Main content */}
            <div className={`relative z-10 flex flex-col items-center text-center max-w-lg px-6 transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Aura Avatar */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-3xl scale-150 animate-pulse" />
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 border-2 border-pink-500/50 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.3)]"
                         style={{ animation: 'auraFloat 3s ease-in-out infinite' }}>
                        <span className="text-5xl" style={{ filter: 'drop-shadow(0 0 12px rgba(236,72,153,0.6))' }}>✨</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-pink-400/60 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-violet-400/60 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                {/* Aura Name Tag */}
                <p className="text-pink-400/80 text-xs font-black uppercase tracking-[0.4em] mb-3"
                   style={{ textShadow: '0 0 20px rgba(236,72,153,0.4)' }}>
                    AURA • AI COMPANION
                </p>

                {/* Speech Bubble */}
                <div className={`relative transition-all duration-700 ease-out ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                    <div className="relative px-8 py-8 rounded-[2rem] bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-pink-500/[0.05] to-transparent pointer-events-none" />
                        <h2 className="relative text-white text-2xl md:text-3xl font-black tracking-tight mb-4 leading-tight">
                            Under Development
                        </h2>
                        <p className="relative text-white/60 text-base md:text-lg font-medium leading-relaxed">
                            I'm sorry, Voyager. The <span className="text-pink-400 font-bold">Competitive Hub</span> is
                            currently being built with care. Your exam campaigns will be fully active starting
                        </p>
                        <p className="relative mt-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-orange-400 to-amber-400 text-2xl font-black uppercase tracking-[0.15em]">
                            Late May 2026
                        </p>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-white/[0.04] border-l border-t border-white/10" />
                </div>

                {/* Return Button */}
                <div className={`mt-10 transition-all duration-700 ease-out ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <button
                        onClick={onExit}
                        className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <span>←</span>
                            Return to Dashboard
                        </span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                    </button>
                    <p className="mt-6 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                        Auremous Competitive Hub • Coming Soon
                    </p>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes auraOrbitSpin { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
                @keyframes auraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
        </div>
    );
};

export default CompetitiveHubRouter;
