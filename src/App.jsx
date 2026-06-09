import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import { LearnLoopProvider, useLearnLoop } from './contexts/LearnLoopContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import { PodcastProvider, usePodcast } from './contexts/PodcastContext';
import { ChatHistoryProvider, useChatHistory } from './contexts/ChatHistoryContext';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import DoubtSolver from './components/DoubtSolver';
import DocumentStudy from './components/DocumentStudy';
import PodcastGenerator from './components/PodcastGenerator';
import YoutubeAnalyzer from './components/YoutubeAnalyzer';
import QuizAssessment from './components/QuizAssessment';

import Login from './components/Login';
import Signup from './components/Signup';
import Settings from './components/Settings';
import { Bot, GraduationCap, FileText, Menu, LogIn, FilePlus, Mic, Sparkles, ClipboardList, Settings as SettingsIcon, RefreshCw, Video, Eye, Trophy, Swords, Youtube, Play, Pause, X, Radio, Search, Home } from './components/Icons';
import { useRetryableFetch } from './utils/api';
import SamplePaperGenerator from './components/SamplePaperGenerator';
import LoopManager from './components/LearnLoop/LoopManager';
import LandingPageV2 from './components/LandingPageV2';
import NeuralArena from './components/NeuralArena';
import VideoGenerator from './components/VideoGenerator';
import ErrorBoundary from './components/ErrorBoundary';
import OnboardingGuide from './components/OnboardingGuide';
import UniversalSearch from './components/UniversalSearch';
import ThemeEffects from './components/ThemeEffects';
import { AssistantProvider } from './contexts/AssistantContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import RoleSelection from './components/RoleSelection';
import CadetHandbook from './components/CadetHandbook';
import ExamPrepHub from './components/ExamPrepHub';
import GrievancePortal from './components/GrievancePortal';
import COLayout from './components/COLayout';
import CadetDashboard from './components/CadetDashboard';
import Quartermaster from './components/Quartermaster';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const dotRef = React.useRef(null);
    const circleRef = React.useRef(null);

    useEffect(() => {
        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;
        let requestRef;
        let hasMoved = false;

        const animate = () => {
            const lerpFactor = 0.15;
            circleX += (mouseX - circleX) * lerpFactor;
            circleY += (mouseY - circleY) * lerpFactor;
            
            if (dotRef.current) {
                dotRef.current.style.left = `${mouseX}px`;
                dotRef.current.style.top = `${mouseY}px`;
            }
            if (circleRef.current) {
                circleRef.current.style.left = `${circleX}px`;
                circleRef.current.style.top = `${circleY}px`;
            }
            requestRef = requestAnimationFrame(animate);
        };

        requestRef = requestAnimationFrame(animate);

        const moveCursor = (e) => {
            if (!hasMoved) {
                hasMoved = true;
                setIsVisible(true);
                // Snap immediately on first move to prevent flying from top-left
                circleX = e.clientX;
                circleY = e.clientY;
            }
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        const handleMouseOver = (e) => {
            if (e.target.closest('button, a, input, select, textarea, [role="button"], .interactive')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(requestRef);
        };
    }, []);

    return (
        <div style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <div ref={dotRef} className="cursor-dot" style={{ opacity: isHovering ? 0 : 1 }} />
            <div ref={circleRef} className="cursor-circle" style={{ transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`, borderColor: isHovering ? 'var(--theme-secondary)' : 'var(--theme-primary)' }} />
        </div>
    );
};

const AppContent = () => {
    const { isDark } = useTheme();
    const { currentUser, logout, userRole, isRoleSet } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { retryableFetch } = useRetryableFetch();
    const { activeLoop } = useLearnLoop();
    const { setActiveChatId } = useChatHistory();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const podcast = usePodcast();

    // ═══ FLOW STATE ═══
    // Phase: 'splash' → 'landing'/'login'/'app' → ...
    const [phase, setPhase] = useState('splash');
    const [currentView, setCurrentView] = useState('cadet-dashboard');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [hasVisited, setHasVisited] = useState(() => localStorage.getItem('hasVisited') === 'true');

    // Initial splash completes
    const handleSplashComplete = () => {
        if (currentUser) {
            if (isRoleSet === true) {
                setPhase('app');
            } else if (isRoleSet === false) {
                setPhase('role-select');
            }
            // If isRoleSet === null (still loading), stay on splash — the useEffect below will handle it
            if (isRoleSet === null) return;
            if (localStorage.getItem('showOnboarding') === 'true') {
                setShowOnboarding(true);
            }
        } else {
            // Force landing page for now to ensure user sees the new overhaul
            setPhase('landing');
        }
    };

    // Landing page "Get Started" clicked
    const handleGetStarted = () => {
        localStorage.setItem('hasVisited', 'true');
        setHasVisited(true);
        setPhase('splash-to-login');
    };

    // Second splash completes (after landing)
    const handleSecondSplashComplete = () => {
        setPhase('login');
    };

    // After successful auth, currentUser changes
    useEffect(() => {
        if (currentUser && isRoleSet !== null) {
            // If we're logged in but don't have a role, we MUST go to role-select
            if (isRoleSet === false && phase !== 'splash') {
                if (phase !== 'role-select') {
                    setPhase('role-select');
                }
            } else if (isRoleSet === true && (phase === 'login' || phase === 'signup' || phase === 'role-select' || phase === 'splash')) {
                setPhase('app');
                // Don't override currentView if we just selected a role
                if (phase !== 'role-select') {
                    setCurrentView('cadet-dashboard');
                }
                if (localStorage.getItem('showOnboarding') === 'true') {
                    setShowOnboarding(true);
                }
            }
        }
    }, [currentUser, phase, isRoleSet]);

    // Handle sign out or account deletion
    useEffect(() => {
        if (!currentUser && phase === 'app') {
            setPhase('login');
            setCurrentView('cadet-dashboard');
        }
    }, [currentUser, phase]);

    useEffect(() => {
        if (activeLoop && activeLoop.isActive) {
            setCurrentView('learn-loop');
        }
    }, [activeLoop]);

    const handleLogout = async () => {
        await logout();
        setPhase('login');
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        localStorage.removeItem('showOnboarding');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'settings': return <Settings />;
            case 'learn-loop': return <LoopManager />;
            case 'doubt-solver': return <DoubtSolver retryableFetch={retryableFetch} />;
            case 'document-study': return <DocumentStudy retryableFetch={retryableFetch} onNavigate={setCurrentView} />;
            case 'podcast-generator': return <PodcastGenerator retryableFetch={retryableFetch} />;
            case 'quiz-assessment': return <QuizAssessment retryableFetch={retryableFetch} onNavigate={setCurrentView} />;
            case 'sample-paper': return <SamplePaperGenerator retryableFetch={retryableFetch} />;
            case 'neural-arena': return <NeuralArena onExit={() => setCurrentView('document-study')} setIsCollapsed={setIsCollapsed} />;
            case 'video-generator': return <VideoGenerator />;
            case 'cadet-handbook': return <CadetHandbook />;
            case 'cadet-dashboard': return <CadetDashboard onNavigate={setCurrentView} />;
            case 'exam-prep': return <ExamPrepHub onNavigate={setCurrentView} />;
            case 'grievance-portal': return <GrievancePortal />;
            case 'quartermaster': return <Quartermaster />;
            default: return <CadetDashboard onNavigate={setCurrentView} />;
        }
    };

    const getHeaderTitle = () => {
        const titles = {
            'settings': 'Settings',
            'learn-loop': 'Mastery Lifecycle',
            'doubt-solver': 'Neural Query',
            'document-study': 'Samvada Lens',
            'podcast-generator': 'Audio Studio',
            'quiz-assessment': 'Adaptive Testing',
            'sample-paper': 'Dynamic Paper Gen',
            'neural-arena': 'Cognitive Colosseum',
            'video-generator': 'Video Studio',
            'cadet-handbook': 'Cadet Handbook',
            'cadet-dashboard': 'Dashboard',
            'exam-prep': 'Command Center',
            'grievance-portal': 'Samvada Shield',
            'quartermaster': 'Quartermaster Store'
        };
        return titles[currentView] || 'Samvada';
    };

    const getHeaderIcon = () => {
        const iconMap = {
            'settings': <SettingsIcon className="w-5 h-5 mr-2 text-theme-muted" />,
            'learn-loop': <RefreshCw className="w-5 h-5 mr-2 text-gold" />,
            'doubt-solver': <Bot className="w-5 h-5 mr-2 text-gold" />,
            'document-study': <Eye className="w-5 h-5 mr-2 text-gold" />,
            'podcast-generator': <Mic className="w-5 h-5 mr-2 text-gold" />,
            'quiz-assessment': <ClipboardList className="w-5 h-5 mr-2 text-gold" />,
            'sample-paper': <FileText className="w-5 h-5 mr-2 text-gold-light" />,
            'neural-arena': <Swords className="w-5 h-5 mr-2 text-gold" />,
            'video-generator': <Video className="w-5 h-5 mr-2 text-gold" />,
            'cadet-handbook': <FileText className="w-5 h-5 mr-2 text-gold" />,
            'cadet-dashboard': <Home className="w-5 h-5 mr-2 text-gold" />,
            'exam-prep': <Trophy className="w-5 h-5 mr-2 text-gold" />,
            'grievance-portal': <Sparkles className="w-5 h-5 mr-2 text-gold" />,
            'quartermaster': <FilePlus className="w-5 h-5 mr-2 text-gold" />,
        };
        return iconMap[currentView] || <Sparkles className="w-5 h-5 mr-2 text-gold" />;
    };

    // ═══ RENDER PHASES ═══
    const renderPhase = () => {
        // Initial splash
        if (phase === 'splash') {
            return <SplashScreen onComplete={handleSplashComplete} />;
        }

        // Landing page (new users)
        if (phase === 'landing') {
            return <LandingPageV2 onGetStarted={handleGetStarted} />;
        }

        // Second splash (after landing → before login)
        if (phase === 'splash-to-login') {
            return <SplashScreen onComplete={handleSecondSplashComplete} />;
        }

        // Login
        if (phase === 'login') {
            return <Login onSwitchToSignup={() => setPhase('signup')} />;
        }

        // Signup
        if (phase === 'signup') {
            return <Signup onSwitchToLogin={() => setPhase('login')} />;
        }

        // Role Selection
        if (phase === 'role-select') {
            return <RoleSelection onComplete={() => setPhase('app')} />;
        }

        // ═══ MAIN APP ═══
        if (userRole === 'co') {
            return <COLayout />;
        }

        return (
            <div className="flex w-full h-[100dvh] font-sans overflow-hidden bg-theme-bg text-theme-text transition-colors duration-500 relative">
                <ThemeEffects />


                {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
                <UniversalSearch onNavigate={setCurrentView} />

                <Sidebar
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    user={currentUser}
                    onLogin={() => setPhase('login')}
                    onLogout={handleLogout}
                />

                <div className={`
                    flex-1 flex flex-col h-full relative z-10 transition-all duration-500
                    md:my-[2vh] md:mr-[2vh] md:rounded-[32px] overflow-hidden bg-theme-surface/70 backdrop-blur-xl border border-theme-border/8 shadow-depth-xl
                `}>
                    <ChatHistorySidebar
                        isOpen={isHistoryOpen}
                        onClose={() => setIsHistoryOpen(false)}
                        onSelectChat={(feature, id) => {
                            setCurrentView(feature);
                            setActiveChatId(id);
                            setIsHistoryOpen(false);
                        }}
                    />
                    {/* Mobile Header */}
                    <header className="md:hidden p-4 pt-8 flex items-center z-30 sticky top-0 bg-theme-bg/95 backdrop-blur-xl border-b border-theme-border shadow-sm">
                        <button onClick={() => setIsSidebarOpen(true)} className="mr-3 text-theme-muted hover:text-theme-primary transition-colors cursor-none flex-shrink-0">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="font-serif italic font-light flex items-center text-theme-text flex-1 min-w-0 overflow-hidden">
                            <div className="flex-shrink-0">{getHeaderIcon()}</div>
                            <span className="truncate">{getHeaderTitle()}</span>
                        </h1>
                        <button onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))} className="ml-2 text-theme-primary opacity-80 hover:opacity-100 transition-colors flex-shrink-0">
                            <Search className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsHistoryOpen(true)} className="ml-2 text-theme-primary opacity-80 hover:opacity-100 transition-colors flex-shrink-0">
                            <ClipboardList className="w-5 h-5" />
                        </button>
                    </header>

                    <main className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
                        <div key={currentView} className="flex-1 flex flex-col animate-page-enter relative min-h-0">
                            {renderContent()}
                        </div>
                    </main>
                </div>

                {/* ═══ Floating Podcast Mini-Player ═══ */}
                {podcast.hasPodcast && currentView !== 'podcast-generator' && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-lg animate-slide-up">
                        <div className="bg-theme-surface/95 backdrop-blur-2xl border border-theme-border rounded-2xl shadow-2xl shadow-black/30 px-4 py-3 flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${podcast.isPlaying ? 'bg-theme-primary/20' : 'bg-theme-bg'}`}>
                                <Radio className={`w-4 h-4 ${podcast.isPlaying ? 'text-theme-primary animate-pulse' : 'text-theme-muted'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-theme-text truncate">{podcast.topicName || 'Podcast'}</p>
                                <p className="text-[10px] text-theme-muted truncate">
                                    {podcast.isLoadingAudio ? (podcast.ttsProgress || 'Loading voice...') : 
                                     podcast.isPlaying ? `Playing ${podcast.currentLineIndex + 1}/${podcast.podcastScript.length}` :
                                     podcast.isFinished ? 'Finished' : 'Paused'}
                                </p>
                            </div>
                            <button
                                onClick={() => podcast.togglePlay()}
                                className={`p-2.5 rounded-xl transition-all duration-200 ${podcast.isPlaying ? 'bg-theme-primary text-theme-bg' : 'bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20'}`}
                            >
                                {podcast.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setCurrentView('podcast-generator')}
                                className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-bg transition-colors text-[10px] font-bold uppercase"
                            >
                                Open
                            </button>
                            <button
                                onClick={() => podcast.closePodcast()}
                                className="p-2 rounded-xl text-theme-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <CustomCursor />
            {renderPhase()}
        </>
    );
};

const AuthGate = () => {
    const { currentUser, loading } = useAuth();
    if (loading) return <SplashScreen />;
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SubscriptionProvider>
                    <PerformanceProvider>
                        <LearnLoopProvider>
                            <PodcastProvider>
                                <ChatHistoryProvider>
                                    <AssistantProvider>
                                        <UserPreferencesProvider>
                                            <AuthGate />
                                        </UserPreferencesProvider>
                                    </AssistantProvider>
                                </ChatHistoryProvider>
                            </PodcastProvider>
                        </LearnLoopProvider>
                    </PerformanceProvider>
                </SubscriptionProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
