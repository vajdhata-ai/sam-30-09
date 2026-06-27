import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, Target, Shield, Clock, User, Cpu, ChevronRight, Check, X, Star, Gauge, Swords, BrainCircuit, Activity } from './Icons';

const BrainLink = ({ quizData, topic, difficulty, onExit, onComplete, isDark }) => {
    const [gameState, setGameState] = useState('playing'); // playing | results
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [spectreScore, setSpectreScore] = useState(0);
    const [userAnswerStatus, setUserAnswerStatus] = useState(null); // 'correct' | 'wrong' | null
    const [spectreAnswerStatus, setSpectreAnswerStatus] = useState(null);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [combatLog, setCombatLog] = useState(["Protocol Linked. Waiting for signal..."]);

    const logEndRef = useRef(null);
    const maxScore = quizData.length * 150;

    const timerRef = useRef(null);
    const spectreThoughtRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [combatLog]);

    const addToLog = (msg) => {
        setCombatLog(prev => [...prev.slice(-4), msg]);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            startTimer();
            simulateSpectre();
        }
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(spectreThoughtRef.current);
        };
    }, [gameState, currentQuestionIndex]);

    const startTimer = () => {
        setTimeLeft(15);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(null); // Time out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const simulateSpectre = () => {
        const spectreConfig = {
            'Normal': { chance: 0.7, delay: 5000 },
            'Heroic': { chance: 0.85, delay: 3500 },
            'Godly': { chance: 0.98, delay: 1500 }
        };
        const config = spectreConfig[difficulty];

        const randomDelay = config.delay + (Math.random() * 2000);

        clearTimeout(spectreThoughtRef.current);
        spectreThoughtRef.current = setTimeout(() => {
            const isCorrect = Math.random() < config.chance;
            setSpectreAnswerStatus(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) {
                setSpectreScore(prev => prev + 100);
                addToLog("Spectre-7 processed query correctly. Threat level rising.");
            } else {
                addToLog("Spectre-7 encountered a logic fault!");
            }
        }, randomDelay);
    };

    const handleAnswer = (option) => {
        if (userAnswerStatus || gameState !== 'playing') return;

        clearInterval(timerRef.current);
        const q = quizData[currentQuestionIndex];
        const isCorrect = (option === q.answer || option === q.correct_option);

        setUserAnswerStatus(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            const timeBonus = timeLeft * 10;
            const comboBonus = combo * 20;
            const points = 100 + timeBonus + comboBonus;
            setUserScore(prev => prev + points);
            setCombo(prev => prev + 1);
            addToLog(`Direct Hit! Scored ${points} units.`);
            if (combo + 1 > 3) addToLog(`COMBO x${combo + 1} ACTIVE!`);
        } else {
            setCombo(0);
            addToLog("Neural desync detected. Sequence broken.");
        }

        setTimeout(() => {
            if (currentQuestionIndex < quizData.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setUserAnswerStatus(null);
                setSpectreAnswerStatus(null);
            } else {
                setGameState('results');
            }
        }, 1500);
    };

    useEffect(() => {
        if (gameState === 'results' && onComplete) {
            onComplete({
                score: userScore,
                spectreScore: spectreScore,
                isWinner: userScore > spectreScore
            });
        }
    }, [gameState]);

    if (gameState === 'playing') {
        const q = quizData[currentQuestionIndex];
        const userHPPercent = Math.min((userScore / maxScore) * 100, 100);
        const spectreHPPercent = Math.min((spectreScore / maxScore) * 100, 100);

        return (
            <div className={`h-full flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto w-full ${userAnswerStatus === 'wrong' ? 'animate-shake' : ''} pb-12`}>

                {/* HUD: Fighting Game Style Top Bar */}
                <div className={`flex items-center justify-between gap-6 w-full p-6 md:p-8 rounded-[40px] border relative transition-all duration-500 shrink-0 bg-theme-surface/60 backdrop-blur-md border-theme-border/50 shadow-xl overflow-hidden
                `}>
                    <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/5 to-transparent pointer-events-none" />
                    
                    {/* User Health Bar */}
                    <div className="flex-1 space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-theme-primary">
                            <span className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" /> Challenger</span>
                            <span className="text-xl">{userScore}</span>
                        </div>
                        <div className={`h-4 md:h-5 w-full rounded-full overflow-hidden border relative bg-theme-bg/60 border-theme-border/60 p-1`}>
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-theme-primary to-theme-secondary transition-all duration-700 shadow-[0_0_15px_rgba(var(--theme-primary),0.5)]"
                                style={{ width: `${userHPPercent}%` }}
                            ></div>
                        </div>
                        {combo > 1 && (
                            <div className="absolute -bottom-8 left-0 text-[10px] font-black uppercase tracking-widest text-theme-secondary animate-bounce">
                                {combo}x COMBO
                            </div>
                        )}
                    </div>

                    {/* VS / Timer */}
                    <div className="flex flex-col items-center justify-center shrink-0 px-6 relative z-10">
                        <div className="w-20 h-20 rounded-full border-4 border-theme-surface bg-theme-bg shadow-[0_0_30px_rgba(var(--theme-primary),0.2)] flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="36" fill="none" stroke="rgba(var(--theme-border), 0.5)" strokeWidth="4" />
                                <circle 
                                    cx="50%" 
                                    cy="50%" 
                                    r="36" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    strokeDasharray="226"
                                    strokeDashoffset={226 - (226 * timeLeft) / 15}
                                    className={`transition-all duration-1000 ${timeLeft <= 5 ? 'text-rose-500' : 'text-theme-primary'}`}
                                />
                            </svg>
                            <div className={`text-3xl font-black tabular-nums transition-colors duration-300 drop-shadow-md leading-none z-10
                                ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-theme-text'}
                            `}>
                                {timeLeft}
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted mt-3">VS</span>
                    </div>

                    {/* Spectre Health Bar */}
                    <div className="flex-1 space-y-3 relative z-10 text-right">
                        <div className="flex justify-between items-center text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-rose-500">
                            <span className="text-xl">{spectreScore}</span>
                            <span className="flex items-center gap-2">Spectre-7 <Cpu className="w-5 h-5" /></span>
                        </div>
                        <div className={`h-4 md:h-5 w-full rounded-full overflow-hidden border relative rotate-180 bg-theme-bg/60 border-theme-border/60 p-1`}>
                            <div
                                className="h-full rounded-full bg-gradient-to-l from-rose-600 to-rose-400 transition-all duration-700 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                                style={{ width: `${spectreHPPercent}%` }}
                            ></div>
                        </div>
                        {spectreAnswerStatus === 'correct' && (
                            <div className="absolute -bottom-8 right-0 text-[10px] font-black uppercase tracking-widest text-rose-500 animate-pulse">
                                Threat Incoming
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Battle Core: The Interactive Query Engine */}
                <div className={`flex-1 rounded-[40px] border relative group/core overflow-hidden flex flex-col p-6 md:p-10 min-h-0 bg-theme-surface/40 backdrop-blur-md border-theme-border/40 shadow-2xl
                `}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-theme-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Combat Log Overlay */}
                    <div className="absolute top-6 left-8 z-20 w-48 md:w-72 max-h-32 overflow-hidden pointer-events-none opacity-80">
                        <div className="flex flex-col gap-2">
                            {combatLog.map((log, i) => (
                                <div key={i} className="text-[10px] font-bold text-theme-primary uppercase tracking-[0.1em] bg-theme-bg/80 px-3 py-1.5 rounded-lg backdrop-blur-md border-l-4 border-theme-primary animate-in fade-in slide-in-from-left-4 shadow-lg">
                                    {log}
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>

                    {/* Progress Bar Top */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-theme-border/50">
                        <div
                            className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-theme-primary to-theme-secondary shadow-[0_0_10px_rgba(var(--theme-primary),0.5)]"
                            style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Question Section */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10 w-full mb-8 mt-12 md:mt-16">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-theme-bg/60 border border-theme-border/60">
                            <Activity className="w-4 h-4 text-theme-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-primary">
                                Sequence {currentQuestionIndex + 1} of {quizData.length}
                            </span>
                        </div>
                        <div className="relative py-4">
                            <h2 className={`text-xl md:text-3xl font-black leading-snug tracking-tight min-h-[3em] flex items-center justify-center relative z-10 text-theme-text drop-shadow-sm`}>
                                {q.question}
                            </h2>
                        </div>
                    </div>

                    {/* Response Matrix: Options UI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto relative z-10 flex-1 content-center">
                        {q.options?.map((opt, i) => {
                            const isCorrectVal = opt === q.answer || opt === q.correct_option;
                            let btnStyle = "border-theme-border/60 bg-theme-bg/60 hover:border-theme-primary hover:bg-theme-primary hover:text-theme-bg shadow-sm text-theme-text";

                            if (userAnswerStatus) {
                                if (isCorrectVal) {
                                    btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]";
                                } else if (userAnswerStatus === 'wrong' && opt === q.answer) {
                                    btnStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-500/80";
                                } else if (userAnswerStatus === 'wrong') {
                                    btnStyle = "border-rose-500/40 bg-rose-500/10 text-rose-500/80 opacity-60 scale-[0.98]";
                                } else {
                                    btnStyle = "opacity-40 grayscale border-theme-border/30";
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    disabled={!!userAnswerStatus}
                                    onClick={() => handleAnswer(opt)}
                                    className={`group/opt p-5 md:p-6 rounded-3xl border-2 text-left transition-all duration-300 flex items-center justify-between overflow-hidden relative
                                        ${btnStyle}
                                    `}
                                >
                                    {!userAnswerStatus && (
                                        <div className="absolute inset-0 bg-theme-primary/5 translate-y-full group-hover/opt:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                    )}
                                    
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 shadow-inner
                                            ${userAnswerStatus ? 'bg-black/10 text-theme-text border border-transparent' : 'bg-theme-surface border border-theme-border text-theme-primary group-hover/opt:bg-theme-bg group-hover/opt:text-theme-primary group-hover/opt:border-theme-bg'}
                                        `}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className={`text-sm md:text-base font-bold leading-tight tracking-tight ${!userAnswerStatus ? 'group-hover/opt:text-theme-bg' : ''}`}>{opt}</span>
                                    </div>
                                    {userAnswerStatus && isCorrectVal && (
                                        <Check className="w-6 h-6 text-emerald-500 animate-in zoom-in duration-300 shrink-0 relative z-10" />
                                    )}
                                    {userAnswerStatus === 'wrong' && !isCorrectVal && (
                                        <X className="w-6 h-6 text-rose-500 animate-in zoom-in duration-300 shrink-0 relative z-10" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'results') {
        const isWinner = userScore > spectreScore;
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
                
                <div className={`w-full p-12 md:p-16 rounded-[48px] border text-center space-y-10 relative overflow-hidden bg-theme-surface/60 backdrop-blur-xl shadow-2xl
                    ${isWinner ? 'border-emerald-500/30' : 'border-rose-500/30'}
                `}>
                    <div className={`absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none
                        ${isWinner ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
                    `} />

                    <div className="relative z-10">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className={`absolute inset-0 rounded-full blur-[15px] opacity-40 animate-pulse
                                ${isWinner ? 'bg-emerald-500' : 'bg-rose-500'}
                            `} />
                            <div className={`relative w-full h-full rounded-2xl flex items-center justify-center shadow-lg border
                                ${isWinner ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'}
                            `}>
                                {isWinner ? <Trophy className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                            </div>
                        </div>
                        
                        <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-widest leading-none mb-3
                            ${isWinner ? 'text-emerald-500' : 'text-rose-500'}
                        `}>
                            {isWinner ? 'Victory Unlocked' : 'Circuit Breach'}
                        </h2>
                        <p className="text-theme-text/80 font-bold text-xs tracking-[0.2em] uppercase">Simulation Complete</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto relative z-10">
                        <div className="bg-theme-bg/60 backdrop-blur-md p-6 rounded-2xl border border-theme-border/40 hover:bg-theme-bg/80 transition-colors">
                            <span className="text-[9px] font-black uppercase text-theme-primary tracking-[0.2em] block mb-2">Battle Rating</span>
                            <span className="text-2xl font-black text-theme-text">{userScore.toLocaleString()}</span>
                        </div>
                        <div className="bg-theme-bg/60 backdrop-blur-md p-6 rounded-2xl border border-theme-border/40 hover:bg-theme-bg/80 transition-colors">
                            <span className="text-[9px] font-black uppercase text-theme-secondary tracking-[0.2em] block mb-2">XP Gain</span>
                            <span className="text-2xl font-black text-theme-text">+{Math.round(userScore * 0.1 * ({ 'Normal': 1, 'Heroic': 1.5, 'Godly': 2.5 }[difficulty]))}</span>
                        </div>
                        <div className="bg-theme-bg/60 backdrop-blur-md p-6 rounded-2xl border border-theme-border/40 lg:block sm:hidden hover:bg-theme-bg/80 transition-colors">
                            <span className="text-[9px] font-black uppercase text-rose-500 tracking-[0.2em] block mb-2">Spectre-7 Score</span>
                            <span className="text-2xl font-black text-theme-text opacity-70">{spectreScore.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="relative z-10 pt-4">
                        <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-full border border-theme-border/50 font-black text-xs uppercase tracking-[0.2em] shadow-lg
                            ${isWinner ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}
                        `}>
                            <Target className="w-4 h-4" />
                            {isWinner ? 'Dominance Protocol Executed' : 'Strategic Assessment Required'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                    <button
                        onClick={onExit}
                        className="flex-1 py-5 rounded-full bg-theme-primary font-black uppercase tracking-[0.2em] text-sm text-theme-bg shadow-[0_0_30px_rgba(var(--theme-primary),0.3)] hover:scale-105 transition-all"
                    >
                        Exit Protocol
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default BrainLink;
