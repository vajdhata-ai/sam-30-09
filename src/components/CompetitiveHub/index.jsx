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
import RocketLoader from './components/RocketLoader';

/**
 * Main Competitive Hub router.
 * Flow for NEW users:   launch → onboarding → landing → home
 * Flow for RETURNING:   launch → home (skip landing, they've seen it)
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
            // We NO LONGER setHubView('home') early. Everyone gets to see the Rocket Launch showcase.
            // When the rocket animation calls onComplete -> handleLaunchComplete, it will read onboardedRef and route correctly.
        } catch (err) {
            console.error('Onboarding check error:', err);
            onboardedRef.current = true;
            // Still force rocket launch even on error, it'll just safely route to home later
        }
    };

    // After rocket launch → new users go to onboarding
    const handleLaunchComplete = () => {
        console.log('[Hub] Launch complete. Onboarded:', onboardedRef.current);
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
        // Reuse CompetitiveLearning for legacy task study or we can keep StudySession if needed, 
        // but replacing with CompetitiveLearning is better
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

    // ── HOME ──
    return (
        <CompetitiveHome
            onStartStudy={handleStartStudy}
            onOpenLearning={handleOpenLearning}
            onOpenSolver={handleOpenSolver}
            onOpenMockTest={handleOpenMockTest}
            onViewProgress={handleViewProgress}
            onSetupNewExam={() => {
                onboardedRef.current = false; // Reset to ensure we go through onboarding step
                setHubView('launch');
            }}
            onExitHub={onExitHub}
        />
    );
};

export default CompetitiveHubRouter;
