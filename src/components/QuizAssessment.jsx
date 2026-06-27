import React, { useState, useEffect } from 'react';
import { Brain, Trophy, ChevronRight, ChevronLeft, Lock, Check, CheckCircle, Shield, FileText, AlertCircle, RefreshCw, Eye, Sparkles, X, Target, Loader2 } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { getQuestionsForChapter, getQuestionsForWing } from '../data/nccQuestionBank';
import { nccSyllabusData } from '../data/nccSyllabusData';
import { callAI as callGroq } from '../utils/apiRouter';

const TrialsSplash = ({ onComplete }) => {
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
            {/* Ambient glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-theme-primary/[0.06] blur-[150px] animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] rounded-full bg-theme-secondary/[0.04] blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Logo pulse */}
                <div className="relative">
                    <div className="p-5 bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 rounded-3xl border border-theme-primary/20 shadow-2xl shadow-theme-primary/20">
                        <Target className="w-12 h-12 text-theme-primary" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full animate-ping shadow-lg shadow-theme-primary/50" />
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full shadow-lg shadow-theme-primary/50" />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-serif italic font-light tracking-widest text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.4)] select-none">
                        Precision Testing
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-theme-primary mt-2">
                        Initializing Assessment Protocol
                    </p>
                </div>

                {/* Progress bar */}
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

const QuizAssessment = ({ onNavigate, assessmentContext, setAssessmentContext }) => {
    const { isDark } = useTheme();
    const { userProfile } = useAuth();
    const { addRecord } = usePerformance();
    
    const userWing = userProfile?.wing || 'army';
    
    const availableChapters = [
        ...(nccSyllabusData.common || []),
        ...(nccSyllabusData[userWing] || [])
    ].sort((a, b) => a.chapterNumber - b.chapterNumber);

    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState('setup'); // setup, chapter-options, bank, custom-paper-setup, taking, result
    const [activeChapter, setActiveChapter] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [assessmentStats, setAssessmentStats] = useState(null);
    const [isProgressionTest, setIsProgressionTest] = useState(false);
    const [progressionLevel, setProgressionLevel] = useState(null);
    const [progressionTopic, setProgressionTopic] = useState(null);
    const [quizConfig, setQuizConfig] = useState({
        numQuestions: 15,
        difficulty: 'Medium',
        pattern: 'MCQs Only'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingMock, setIsGeneratingMock] = useState(false);

    // Auto-start if assessmentContext was passed from Samvada Lens
    useEffect(() => {
        if (assessmentContext) {
            setIsProgressionTest(true);
            setProgressionLevel(assessmentContext.level);
            setProgressionTopic(assessmentContext.topic);

            // Map level to difficulty
            const difficultyMap = { beginner: 'Easy', intermediate: 'Medium', advanced: 'Hard' };
            const difficulty = difficultyMap[assessmentContext.level] || 'Medium';

            // Find the matching chapter or create a virtual one
            const matchingChapter = availableChapters.find(
                ch => ch.chapterName?.toLowerCase() === assessmentContext.topic?.toLowerCase()
            );

            if (matchingChapter) {
                setActiveChapter(matchingChapter);
                let questions = getQuestionsForChapter(matchingChapter.id);
                if (questions && questions.length > 0) {
                    let pool = [...questions].sort(() => 0.5 - Math.random()).slice(0, 15);
                    setQuizData({ questions: pool });
                    setAnswers({});
                    setStep('taking');
                } else {
                    setStep('setup');
                }
            } else {
                setActiveChapter({ id: 'lens-progression', chapterName: assessmentContext.topic || 'Samvada Lens Assessment' });
                const allQuestions = getQuestionsForWing(userWing, 15);
                if (allQuestions && allQuestions.length > 0) {
                    setQuizData({ questions: allQuestions });
                    setAnswers({});
                    setStep('taking');
                } else {
                    setStep('setup');
                }
            }

            setQuizConfig(prev => ({ ...prev, difficulty }));
            // Clear the context so it doesn't re-trigger
            if (setAssessmentContext) setAssessmentContext(null);
        }
    }, [assessmentContext, availableChapters, userWing, setAssessmentContext]);

    const handleSelectChapter = (chapter) => {
        setActiveChapter(chapter);
        setStep('chapter-options');
    };

    const handleModeSelect = (mode) => {
        if (mode === 'bank') {
            const questions = getQuestionsForChapter(activeChapter.id);
            if (questions && questions.length > 0) {
                setQuizData({ questions });
                setAnswers({});
                setStep('bank');
            } else {
                alert("No questions available for this chapter yet.");
            }
        } else if (mode === 'quiz') {
            setStep('custom-paper-setup');
        }
    };

    const startCustomQuiz = async () => {
        setIsGenerating(true);
        try {
            const numToGenerate = quizConfig.numQuestions === 'All' ? 15 : quizConfig.numQuestions;
            const prompt = `You are an expert military examiner for the National Cadet Corps (NCC). Generate a custom quiz for the chapter "${activeChapter.chapterName}".
            Parameters:
            - Difficulty: ${quizConfig.difficulty}
            - Question Count: ${numToGenerate}
            
            Return ONLY a valid JSON array of question objects matching this exact schema (NO markdown formatting, just raw JSON):
            [{
                "id": "unique-string-id",
                "type": "mcq",
                "question": "The question text",
                "options": ["A", "B", "C", "D"],
                "answer": "The exact string from options that is correct",
                "explanation": "Brief explanation of why it is correct",
                "marks": 1
            }]`;

            const result = await callGroq([{ role: 'user', content: prompt }], null, true);
            let questions = [];
            
            try {
                let textResult = result;
                if (typeof textResult === 'object' && textResult !== null) {
                    textResult = textResult.choices?.[0]?.message?.content || JSON.stringify(textResult);
                }
                
                if (typeof textResult === 'string') {
                    // Extract json from markdown if wrapped
                    const jsonMatch = textResult.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) {
                        textResult = jsonMatch[1];
                    } else {
                        const arrayMatch = textResult.match(/\[\s*\{[\s\S]*\}\s*\]/);
                        if (arrayMatch) textResult = arrayMatch[0];
                    }
                    questions = JSON.parse(textResult);
                } else {
                    questions = textResult;
                }
            } catch (e) {
                console.error("Failed to parse questions JSON:", e, result);
                questions = getQuestionsForChapter(activeChapter.id).slice(0, numToGenerate);
            }

            if (!Array.isArray(questions) || questions.length === 0) {
                questions = getQuestionsForChapter(activeChapter.id).slice(0, numToGenerate);
            }

            setQuizData({ questions });
            setAnswers({});
            setStep('taking');
        } catch (error) {
            console.error("Error generating custom quiz:", error);
            alert("Failed to generate custom paper. Falling back to local question bank.");
            const fallback = getQuestionsForChapter(activeChapter.id).slice(0, quizConfig.numQuestions === 'All' ? 15 : quizConfig.numQuestions);
            setQuizData({ questions: fallback });
            setAnswers({});
            setStep('taking');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTakeMockTest = () => {
        setIsGeneratingMock(true);
        setTimeout(() => {
            const questions = getQuestionsForWing(userWing, 35); // 35 questions for a full mock
            
            if (questions && questions.length > 0) {
                setActiveChapter({ id: 'mock', chapterName: `${userWing.toUpperCase()} Wing Full Mock Test` });
                setQuizData({ questions });
                setAnswers({});
                setStep('taking');
            } else {
                alert("Insufficient questions for a full mock test.");
            }
            setIsGeneratingMock(false);
        }, 3000); // 3 second animation to show loading state
    };

    const submitQuiz = () => {
        let totalMarks = 0;
        let earnedMarks = 0;
        const finalResults = [];

        quizData.questions.forEach((q) => {
            const studentAns = answers[q.id] || "Not Attempted";
            totalMarks += (q.marks || 1);

            const isCorrect = studentAns === (q.answer || q.correct_answer);
            if (isCorrect) earnedMarks += (q.marks || 1);
            
            finalResults.push({ ...q, student_answer: studentAns, is_correct: isCorrect });
        });

        const finalPercentage = Math.round((earnedMarks / totalMarks) * 100);

        addRecord('quiz-assessment', finalPercentage);

        let levelUnlocked = null;
        if (isProgressionTest && progressionTopic && finalPercentage > 60) {
            const savedUnlocksRaw = localStorage.getItem(`unlockedLevels_${progressionTopic}`);
            const savedUnlocks = savedUnlocksRaw ? JSON.parse(savedUnlocksRaw) : ['beginner'];
            
            if (progressionLevel === 'beginner' && !savedUnlocks.includes('intermediate')) {
                savedUnlocks.push('intermediate');
                levelUnlocked = 'intermediate';
            } else if (progressionLevel === 'intermediate' && !savedUnlocks.includes('advanced')) {
                savedUnlocks.push('advanced');
                levelUnlocked = 'advanced';
            } else if (progressionLevel === 'advanced') {
                levelUnlocked = 'mastery';
            }
            localStorage.setItem(`unlockedLevels_${progressionTopic}`, JSON.stringify(savedUnlocks));
        }

        setAssessmentStats({
            score: finalPercentage,
            correct: finalResults.filter(r => r.is_correct).length,
            total: finalResults.length,
            detailedAnswers: finalResults,
            levelUnlocked
        });
        
        setStep('result');
    };

    const handleRetake = () => {
        setQuizData(null);
        setAnswers({});
        setAssessmentStats(null);
        setActiveChapter(null);
        setStep('setup');
    };

    if (showSplash) {
        return <TrialsSplash onComplete={() => setShowSplash(false)} />;
    }

    return (
        <div className={`flex flex-col h-full bg-theme-bg text-theme-text overflow-hidden transition-colors duration-500`}>
            
            {/* ═══ STICKY HEADER ═══ */}
            <header className="shrink-0 sticky top-0 z-40 bg-theme-bg/90 backdrop-blur-2xl border-b border-theme-border/30">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        {/* Title & Icon */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 border border-theme-primary/20 flex items-center justify-center shadow-lg shadow-theme-primary/10">
                                <Target className="w-5 h-5 text-theme-primary" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black uppercase tracking-widest text-theme-text leading-none">
                                    Precision Testing
                                </h1>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-theme-primary/80">
                                        Assessment Protocol Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Exit Button */}
                        {step === 'setup' ? (
                            <button 
                                onClick={() => typeof onNavigate === 'function' ? onNavigate('cadet-dashboard') : null}
                                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 hover:border-rose-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-theme-muted group-hover:text-rose-500 transition-colors">
                                    Exit
                                </span>
                                <X className="w-4 h-4 text-theme-muted group-hover:text-rose-500 transition-colors" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => setStep('setup')}
                                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 hover:border-theme-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.15)]"
                            >
                                <ChevronLeft className="w-4 h-4 text-theme-muted group-hover:text-theme-primary transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-theme-muted group-hover:text-theme-primary transition-colors">
                                    Back to Setup
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ═══ MAIN SCROLLABLE CONTENT ═══ */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    
                    {step === 'setup' && (
                        <div className="animate-fade-in space-y-12 pb-24">
                            
                            {/* Compact Mock Test CTA */}
                            <button 
                                onClick={handleTakeMockTest}
                                disabled={isGeneratingMock}
                                className={`relative group w-full p-6 md:p-8 rounded-[32px] overflow-hidden text-left cursor-pointer transition-all duration-500 bg-theme-primary/10 border border-theme-primary/20 hover:border-theme-primary/50 hover:bg-theme-primary/20 ${isGeneratingMock ? 'opacity-80 scale-95' : 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(var(--theme-primary),0.15)]'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                
                                <div className="relative z-10 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-theme-bg border border-theme-primary/30 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            {isGeneratingMock ? (
                                                <Loader2 className="w-6 h-6 text-theme-primary animate-spin" />
                                            ) : (
                                                <Trophy className="w-6 h-6 text-theme-primary" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-theme-text mb-1">
                                                {isGeneratingMock ? 'Initializing Protocol...' : 'Full Mock Test'}
                                            </h2>
                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-theme-primary/80 flex items-center gap-2">
                                                <Shield className="w-3 h-3" />
                                                Comprehensive Directorate Assessment
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 hidden md:flex">
                                        <div className="w-10 h-10 rounded-full bg-theme-bg/50 border border-theme-primary/20 flex items-center justify-center group-hover:bg-theme-primary group-hover:border-theme-primary transition-colors duration-500">
                                            {isGeneratingMock ? (
                                                <div className="w-4 h-4 border-2 border-theme-primary border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-theme-primary group-hover:text-theme-bg transition-colors duration-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* Chapter Grid */}
                            <div className="pt-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-theme-primary" />
                                        Chapter-wise Assessments
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-theme-border/40 mx-4 hidden sm:block" />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                    {availableChapters.map((chapter, idx) => {
                                        const isCompleted = idx % 3 === 0; // Mock completion
                                        return (
                                            <div 
                                                key={chapter.id} 
                                                onClick={() => handleSelectChapter(chapter)}
                                                className="group flex flex-col justify-between min-h-[180px] p-6 rounded-3xl bg-theme-surface/40 backdrop-blur-sm border border-theme-border/40 hover:border-theme-primary/60 hover:bg-theme-surface/80 transition-all duration-500 cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                                
                                                {isCompleted && (
                                                    <div className="absolute top-4 right-4 w-8 h-8 bg-theme-primary/10 rounded-full flex items-center justify-center border border-theme-primary/20">
                                                        <CheckCircle className="w-4 h-4 text-theme-primary" />
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-4 mb-4 relative z-10">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border transition-all duration-500 ${isCompleted ? 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary group-hover:bg-theme-primary group-hover:text-theme-bg shadow-[0_0_15px_rgba(var(--theme-primary),0.2)]' : 'bg-theme-surface border-theme-border/60 text-theme-muted group-hover:border-theme-primary/40 group-hover:text-theme-primary group-hover:shadow-[0_0_15px_rgba(var(--theme-primary),0.1)]'}`}>
                                                        {chapter.chapterNumber}
                                                    </div>
                                                    <div className="flex flex-col pr-8">
                                                        <span className={`text-base font-black uppercase tracking-wider leading-tight ${isCompleted ? 'text-theme-text' : 'text-theme-text/80'} group-hover:text-theme-text transition-colors line-clamp-2`}>
                                                            {chapter.chapterName}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mt-1.5 line-clamp-1">
                                                            {chapter.topicName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-end justify-between relative z-10">
                                                    <span className="text-[10px] font-black text-theme-primary/80 uppercase tracking-widest bg-theme-primary/5 px-3 py-1.5 rounded-lg border border-theme-primary/10">
                                                        {getQuestionsForChapter(chapter.id).length} Questions
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full bg-theme-bg border border-theme-border/50 flex items-center justify-center group-hover:bg-theme-primary group-hover:border-theme-primary group-hover:shadow-[0_0_15px_rgba(var(--theme-primary),0.3)] transition-all duration-500">
                                                        <ChevronRight className={`w-4 h-4 transition-colors ${isCompleted ? 'text-theme-primary' : 'text-theme-muted'} group-hover:text-theme-bg group-hover:translate-x-0.5`} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'chapter-options' && activeChapter && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in p-4 md:p-8">
                            <div className="max-w-4xl w-full">
                                <div className="text-center mb-16 relative">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 text-theme-primary mb-8 shadow-[0_0_40px_rgba(var(--theme-primary),0.2)] border border-theme-primary/30">
                                        <Target className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-theme-text mb-4 leading-tight">
                                        {activeChapter.chapterName}
                                    </h2>
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-theme-primary/80 flex items-center justify-center gap-3">
                                        <Shield className="w-4 h-4" />
                                        Select Operating Mode
                                        <Shield className="w-4 h-4" />
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Question Bank Option */}
                                    <button 
                                        onClick={() => handleModeSelect('bank')}
                                        className="group p-10 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 hover:border-theme-primary/60 hover:bg-theme-surface/80 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="w-24 h-24 rounded-[32px] bg-theme-bg border border-theme-border/60 text-theme-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 z-10 shadow-lg group-hover:border-theme-primary/40 group-hover:bg-theme-primary/10 group-hover:shadow-[0_0_30px_rgba(var(--theme-primary),0.2)]">
                                            <FileText className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-widest text-theme-text mb-4 z-10">Question Bank</h3>
                                        <p className="text-sm text-theme-muted leading-relaxed z-10 font-medium max-w-xs">
                                            Study all questions and their correct answers without timer or scoring. Perfect for deep revision.
                                        </p>
                                    </button>

                                    {/* Custom Paper Option */}
                                    <button 
                                        onClick={() => handleModeSelect('quiz')}
                                        className="group p-10 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 hover:border-theme-primary/60 hover:bg-theme-surface/80 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="w-24 h-24 rounded-[32px] bg-theme-bg border border-theme-border/60 text-theme-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 z-10 shadow-lg group-hover:border-theme-primary/40 group-hover:bg-theme-primary/10 group-hover:shadow-[0_0_30px_rgba(var(--theme-primary),0.2)]">
                                            <Trophy className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-widest text-theme-text mb-4 z-10">Custom Paper</h3>
                                        <p className="text-sm text-theme-muted leading-relaxed z-10 font-medium max-w-xs">
                                            Configure a custom mock test. Select difficulty, pattern, and question count to evaluate readiness.
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'custom-paper-setup' && activeChapter && (
                        <div className="flex flex-col items-center min-h-[60vh] animate-fade-in p-4 md:p-8">
                            <div className="max-w-5xl w-full pt-8 pb-24">
                                <div className="text-center mb-16">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-theme-primary/10 text-theme-primary mb-6 shadow-[0_0_30px_rgba(var(--theme-primary),0.2)] border border-theme-primary/30">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-theme-text mb-4 leading-tight">
                                        Test Configuration
                                    </h2>
                                    <p className="text-sm font-bold uppercase tracking-widest text-theme-muted/80 max-w-xl mx-auto">
                                        Setting parameters for <span className="text-theme-primary">{activeChapter.chapterName}</span>
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                    
                                    {/* Number of Questions */}
                                    <div className="p-8 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 shadow-xl flex flex-col relative overflow-hidden group hover:border-theme-primary/30 transition-all duration-500">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-8 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center">
                                                <FileText className="w-3 h-3 text-theme-primary" />
                                            </div>
                                            Question Count
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {[5, 10, 15, 20].map(num => (
                                                <button 
                                                    key={num}
                                                    onClick={() => setQuizConfig({...quizConfig, numQuestions: num})}
                                                    className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 ${quizConfig.numQuestions === num ? 'bg-theme-primary text-theme-bg shadow-[0_0_20px_rgba(var(--theme-primary),0.4)] scale-105 border border-theme-primary' : 'bg-theme-bg border border-theme-border/60 text-theme-text hover:border-theme-primary/50 hover:bg-theme-surface'}`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                            <button 
                                                onClick={() => setQuizConfig({...quizConfig, numQuestions: 'All'})}
                                                className={`w-full mt-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${quizConfig.numQuestions === 'All' ? 'bg-theme-primary text-theme-bg shadow-[0_0_20px_rgba(var(--theme-primary),0.4)] scale-[1.02] border border-theme-primary' : 'bg-theme-bg border border-theme-border/60 text-theme-text hover:border-theme-primary/50 hover:bg-theme-surface'}`}
                                            >
                                                <Target className="w-4 h-4" /> All Available
                                            </button>
                                        </div>
                                    </div>

                                    {/* Difficulty Level */}
                                    <div className="p-8 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 shadow-xl flex flex-col relative overflow-hidden group hover:border-theme-primary/30 transition-all duration-500">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-8 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center">
                                                <Trophy className="w-3 h-3 text-theme-primary" />
                                            </div>
                                            Difficulty Level
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { id: 'Easy', desc: 'Basics & Theory' },
                                                { id: 'Medium', desc: '50/50 Mix' },
                                                { id: 'Hard', desc: 'HOTS & Logic' }
                                            ].map(level => (
                                                <button 
                                                    key={level.id}
                                                    onClick={() => setQuizConfig({...quizConfig, difficulty: level.id})}
                                                    className={`w-full px-6 py-4 rounded-2xl font-black flex items-center justify-between transition-all duration-300 ${quizConfig.difficulty === level.id ? 'bg-theme-primary text-theme-bg shadow-[0_0_20px_rgba(var(--theme-primary),0.4)] scale-[1.02] border border-theme-primary' : 'bg-theme-bg border border-theme-border/60 text-theme-text hover:border-theme-primary/50 hover:bg-theme-surface'}`}
                                                >
                                                    <span className="uppercase tracking-widest">{level.id}</span>
                                                    <span className={`text-[9px] uppercase tracking-widest ${quizConfig.difficulty === level.id ? 'text-theme-bg/70' : 'text-theme-muted'}`}>{level.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Question Pattern */}
                                    <div className="p-8 rounded-[40px] bg-theme-surface/40 backdrop-blur-md border border-theme-border/40 shadow-xl flex flex-col relative overflow-hidden group hover:border-theme-primary/30 transition-all duration-500">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-8 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center">
                                                <Shield className="w-3 h-3 text-theme-primary" />
                                            </div>
                                            Pattern Matrix
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { id: 'MCQs Only', icon: CheckCircle },
                                                { id: 'Theory Only', icon: FileText },
                                                { id: 'Mixed Pattern', icon: RefreshCw }
                                            ].map(pattern => {
                                                const Icon = pattern.icon;
                                                return (
                                                    <button 
                                                        key={pattern.id}
                                                        onClick={() => setQuizConfig({...quizConfig, pattern: pattern.id})}
                                                        className={`w-full px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4 transition-all duration-300 ${quizConfig.pattern === pattern.id ? 'bg-theme-primary text-theme-bg shadow-[0_0_20px_rgba(var(--theme-primary),0.4)] scale-[1.02] border border-theme-primary' : 'bg-theme-bg border border-theme-border/60 text-theme-text hover:border-theme-primary/50 hover:bg-theme-surface'}`}
                                                    >
                                                        <Icon className={`w-4 h-4 ${quizConfig.pattern === pattern.id ? 'text-theme-bg' : 'text-theme-primary'}`} />
                                                        <span>{pattern.id}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className="mt-16 flex justify-center">
                                    <button 
                                        onClick={startCustomQuiz}
                                        disabled={isGenerating}
                                        className={`group relative inline-flex items-center gap-4 px-12 py-5 bg-theme-primary text-theme-bg font-black uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(var(--theme-primary),0.4)] ${isGenerating ? 'opacity-80 cursor-not-allowed scale-95' : 'hover:scale-105'}`}
                                    >
                                        {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
                                        {isGenerating && <Loader2 className="w-5 h-5 animate-spin relative z-10" />}
                                        <span className="relative z-10">{isGenerating ? 'Generating...' : 'Initialize Test'}</span> 
                                        {!isGenerating && <ChevronRight className="w-5 h-5 relative z-10" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'bank' && quizData && (
                        <div className="max-w-4xl mx-auto w-full animate-fade-in space-y-8 pb-24">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl md:text-2xl font-black text-theme-text uppercase tracking-widest">
                                    {activeChapter.chapterName}
                                </h3>
                                <div className="px-4 py-2 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-[10px] font-black uppercase tracking-widest text-theme-primary">
                                    {quizData.questions.length} Questions
                                </div>
                            </div>

                            <div className="space-y-6">
                                {quizData.questions.map((q, i) => (
                                    <div key={q.id} className="p-6 md:p-8 rounded-[32px] bg-theme-surface/60 backdrop-blur-md border border-theme-border/50 shadow-lg relative overflow-hidden group">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-theme-primary/50 to-transparent opacity-50" />
                                        
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-2xl bg-theme-bg border border-theme-border/60 text-theme-primary flex items-center justify-center font-black text-lg shadow-inner">
                                                    {i + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <p className="text-lg md:text-xl font-bold text-theme-text leading-relaxed">
                                                    {q.question}
                                                </p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {q.options.map((opt, idx) => {
                                                        const isCorrect = opt === q.correct_answer;
                                                        return (
                                                            <div 
                                                                key={idx} 
                                                                className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${
                                                                    isCorrect 
                                                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                                                        : 'bg-theme-bg/60 border-theme-border/40 opacity-70'
                                                                }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                                                                    isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-theme-muted/40'
                                                                }`}>
                                                                    {isCorrect && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                                <span className={`font-bold text-sm ${isCorrect ? 'text-emerald-500' : 'text-theme-text/70'}`}>
                                                                    {opt}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                {q.explanation && (
                                                    <div className="mt-6 p-5 rounded-2xl bg-theme-primary/5 border border-theme-primary/20 flex gap-4 items-start">
                                                        <Sparkles className="w-5 h-5 text-theme-primary shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-black text-theme-primary uppercase tracking-[0.2em] text-[9px] block mb-1">Concept Insight</span>
                                                            <p className="text-sm text-theme-text/90 font-medium leading-relaxed">{q.explanation}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'taking' && quizData && (
                        <div className="max-w-4xl mx-auto w-full animate-fade-in space-y-8 pb-24">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-theme-text uppercase tracking-widest">
                                        {activeChapter.chapterName}
                                    </h3>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-theme-primary mt-1">
                                        Live Assessment • {quizData.questions.length} Items
                                    </p>
                                </div>
                                <button 
                                    onClick={submitQuiz} 
                                    className="px-8 py-3.5 bg-theme-primary text-theme-bg rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all text-xs shadow-[0_0_20px_rgba(var(--theme-primary),0.3)] border border-theme-primary"
                                >
                                    Submit Protocol
                                </button>
                            </div>

                            <div className="space-y-6">
                                {quizData.questions.map((q, i) => (
                                    <div key={q.id} className="p-6 md:p-8 rounded-[32px] bg-theme-surface/60 backdrop-blur-md border border-theme-border/50 shadow-lg relative overflow-hidden group hover:border-theme-primary/40 transition-colors duration-500">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-theme-bg border border-theme-border/60 text-theme-primary flex items-center justify-center font-black text-lg shadow-inner">
                                                    {i + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <p className="text-lg md:text-xl font-bold text-theme-text leading-relaxed">
                                                    {q.question}
                                                </p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {q.options.map((opt, idx) => {
                                                        const isSelected = answers[q.id] === opt;
                                                        return (
                                                            <label 
                                                                key={idx} 
                                                                className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                                                    isSelected 
                                                                        ? 'bg-theme-primary/10 border-theme-primary shadow-[0_0_15px_rgba(var(--theme-primary),0.15)] scale-[1.02]' 
                                                                        : 'bg-theme-bg/60 border-theme-border/40 hover:bg-theme-surface hover:border-theme-border'
                                                                }`}
                                                            >
                                                                <input 
                                                                    type="radio" 
                                                                    name={`q-${q.id}`} 
                                                                    value={opt} 
                                                                    checked={isSelected} 
                                                                    onChange={() => setAnswers({ ...answers, [q.id]: opt })} 
                                                                    className="hidden" 
                                                                />
                                                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                                    isSelected ? 'border-theme-primary bg-theme-primary' : 'border-theme-muted/50'
                                                                }`}>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-theme-bg" />}
                                                                </div>
                                                                <span className={`font-bold text-sm ${isSelected ? 'text-theme-primary' : 'text-theme-text/80'}`}>
                                                                    {opt}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-center pt-8 border-t border-theme-border/30">
                                <button 
                                    onClick={submitQuiz} 
                                    className="group relative inline-flex items-center gap-4 px-12 py-5 bg-theme-primary text-theme-bg font-black uppercase tracking-[0.2em] rounded-full overflow-hidden hover:scale-105 transition-all shadow-[0_0_40px_rgba(var(--theme-primary),0.4)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <span className="relative z-10">Complete Assessment</span> 
                                    <Check className="w-5 h-5 relative z-10" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'result' && assessmentStats && (
                        <div className="max-w-4xl mx-auto w-full animate-fade-in space-y-8 pb-24 mt-4">
                            
                            <div className="text-center space-y-2 mb-10">
                                <h2 className="text-3xl font-black uppercase tracking-widest text-theme-text">Assessment Complete</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-theme-muted">Performance Diagnostics Generated</p>
                            </div>

                            {/* Score Dashboard */}
                            <div className={`p-10 rounded-[40px] bg-theme-surface/60 backdrop-blur-md border border-theme-border/50 shadow-2xl relative overflow-hidden`}>
                                <div className={`absolute top-0 inset-x-0 h-1.5 ${assessmentStats.score >= 75 ? 'bg-emerald-500' : assessmentStats.score >= 50 ? 'bg-theme-primary' : 'bg-rose-500'}`} />
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {/* Main Score */}
                                    <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-theme-border/50 pb-10 md:pb-0 relative">
                                        <div className={`w-36 h-36 rounded-full flex items-center justify-center text-5xl font-black shadow-2xl mb-6 relative z-10
                                            ${assessmentStats.score >= 75 ? 'bg-emerald-500 text-white shadow-emerald-500/30 border border-emerald-400' : 
                                              assessmentStats.score >= 50 ? 'bg-theme-primary text-theme-bg shadow-theme-primary/30 border border-theme-primary' : 
                                              'bg-rose-500 text-white shadow-rose-500/30 border border-rose-400'}`}
                                        >
                                            {assessmentStats.score}%
                                        </div>
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none
                                            ${assessmentStats.score >= 75 ? 'bg-emerald-500' : assessmentStats.score >= 50 ? 'bg-theme-primary' : 'bg-rose-500'}`} />
                                        
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-theme-muted mb-1">Classification</span>
                                            <p className={`text-sm font-black uppercase tracking-widest 
                                                ${assessmentStats.score >= 80 ? 'text-emerald-500' : 
                                                  assessmentStats.score >= 65 ? 'text-theme-primary' : 
                                                  assessmentStats.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                {assessmentStats.score >= 80 ? 'Alpha Grade (A)' : 
                                                 assessmentStats.score >= 65 ? 'Bravo Grade (B)' : 
                                                 assessmentStats.score >= 50 ? 'Charlie Grade (C)' : 'Fail'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                        <div className="p-6 rounded-[24px] bg-theme-bg/80 border border-theme-border/60 text-center flex flex-col items-center justify-center">
                                            <p className="text-4xl font-black text-emerald-500 mb-2">{assessmentStats.correct}</p>
                                            <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em]">Correct Hits</p>
                                        </div>
                                        <div className="p-6 rounded-[24px] bg-theme-bg/80 border border-theme-border/60 text-center flex flex-col items-center justify-center">
                                            <p className="text-4xl font-black text-rose-500 mb-2">{assessmentStats.total - assessmentStats.correct}</p>
                                            <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em]">Incorrect</p>
                                        </div>
                                        <div className="p-6 rounded-[24px] bg-theme-bg/80 border border-theme-border/60 text-center flex flex-col items-center justify-center">
                                            <p className="text-4xl font-black text-theme-primary mb-2">{assessmentStats.total}</p>
                                            <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em]">Total Objectives</p>
                                        </div>
                                        <button 
                                            onClick={handleRetake}
                                            className="h-full flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-theme-primary/10 border border-theme-primary/30 text-theme-primary hover:bg-theme-primary hover:text-theme-bg transition-colors group"
                                        >
                                            <RefreshCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Relaunch</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Progression Unlock Banner */}
                            {isProgressionTest && assessmentStats.levelUnlocked && (
                                <div className="p-10 rounded-[40px] bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 text-center shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                                    
                                    <div className="inline-flex p-5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 mb-6 relative z-10">
                                        <Trophy className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-widest text-emerald-400 mb-3 relative z-10">
                                        {assessmentStats.levelUnlocked === 'mastery' ? 'Full Mastery Achieved' : `Level ${assessmentStats.levelUnlocked === 'intermediate' ? '2' : '3'} Unlocked`}
                                    </h3>
                                    <p className="text-emerald-500/80 text-sm font-medium mb-8 max-w-lg mx-auto leading-relaxed relative z-10">
                                        {assessmentStats.levelUnlocked === 'mastery' 
                                            ? 'You have conquered all intelligence levels for this sector. Outstanding operational readiness, Cadet.'
                                            : 'Performance metrics exceed threshold. Next intelligence tier is now accessible in Samvada Lens.'}
                                    </p>
                                    <button
                                        onClick={() => typeof onNavigate === 'function' ? onNavigate('document-study') : null}
                                        className="relative z-10 px-10 py-4 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 border border-emerald-400"
                                    >
                                        Return to Samvada Lens
                                    </button>
                                </div>
                            )}

                            {/* Fail to progress banner */}
                            {isProgressionTest && !assessmentStats.levelUnlocked && (
                                <div className="p-10 rounded-[40px] bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 text-center shadow-xl shadow-amber-500/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                                    
                                    <div className="inline-flex p-5 bg-amber-500/20 rounded-2xl border border-amber-500/30 mb-6 relative z-10">
                                        <AlertCircle className="w-10 h-10 text-amber-400" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-widest text-amber-400 mb-3 relative z-10">
                                        Threshold Not Met
                                    </h3>
                                    <p className="text-amber-500/80 text-sm font-medium mb-8 max-w-lg mx-auto leading-relaxed relative z-10">
                                        Operational readiness requires &gt;60% accuracy for clearance. Return to intelligence files and re-attempt when prepared.
                                    </p>
                                    <button
                                        onClick={() => typeof onNavigate === 'function' ? onNavigate('document-study') : null}
                                        className="relative z-10 px-10 py-4 bg-amber-500 text-theme-bg rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-lg shadow-amber-500/30 border border-amber-400"
                                    >
                                        Return to Study Material
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default QuizAssessment;
