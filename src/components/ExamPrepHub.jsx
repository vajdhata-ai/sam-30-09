import React from 'react';
import { usePerformance } from '../contexts/PerformanceContext';
import { Trophy, TrendingUp, BarChart, Crosshair, Star, AlertTriangle, ChevronRight, Lock } from './Icons';

const ExamPrepHub = ({ onNavigate }) => {
    const { getPerformanceData, getLevelInfo } = usePerformance();
    const performance = getPerformanceData();
    const levelInfo = getLevelInfo();

    // Mock data for graphs and rankings
    const ranking = 142;
    const totalCadets = 2500;
    const percentile = 94;
    const streak = 12;

    const weakAreas = [
        { topic: 'Weapon Training: Point of Aim', score: 45 },
        { topic: 'Disaster Management: First Aid', score: 52 },
        { topic: 'Drill: Turnings', score: 60 }
    ];

    const syllabusProgress = [
        { chapter: '1. Drill & Commands', progress: 85 },
        { chapter: '2. Weapon Training', progress: 40 },
        { chapter: '3. National Integration', progress: 100 },
        { chapter: '4. Disaster Management', progress: 20 },
        { chapter: '5. Social Service', progress: 0 },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto w-full space-y-6">
                
                {/* Header section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-theme-text flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-theme-primary" /> Command Center
                        </h1>
                        <p className="text-theme-muted mt-1">Your personal NCC exam preparation and analytics hub.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-theme-surface p-3 rounded-2xl border border-theme-border">
                        <div className="text-right">
                            <p className="text-xs text-theme-muted uppercase tracking-wider font-bold">Current Rank</p>
                            <p className="text-xl font-black text-theme-primary">{levelInfo.rankTitle}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(201,165,90,0.4)]">
                            {levelInfo.level}
                        </div>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><Star className="w-5 h-5" /></div>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Top {100 - percentile}%</span>
                        </div>
                        <p className="text-xs text-theme-muted uppercase tracking-widest font-bold mb-1">Battalion Rank</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-theme-text">#{ranking}</span>
                            <span className="text-sm text-theme-muted">/ {totalCadets}</span>
                        </div>
                    </div>

                    <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-theme-primary/10 text-theme-primary rounded-xl"><Crosshair className="w-5 h-5" /></div>
                        </div>
                        <p className="text-xs text-theme-muted uppercase tracking-widest font-bold mb-1">Accuracy</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-theme-text">{Math.round(performance.accuracy * 100) || 0}%</span>
                        </div>
                    </div>

                    <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
                        </div>
                        <p className="text-xs text-theme-muted uppercase tracking-widest font-bold mb-1">Study Streak</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-theme-text">{streak}</span>
                            <span className="text-sm text-theme-muted">Days</span>
                        </div>
                    </div>

                    <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-theme-secondary/10 text-theme-secondary rounded-xl"><BarChart className="w-5 h-5" /></div>
                        </div>
                        <p className="text-xs text-theme-muted uppercase tracking-widest font-bold mb-1">Quizzes Taken</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-theme-text">{performance.quizzesTaken || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Growth & Weak Areas */}
                    <div className="col-span-2 space-y-6">
                        
                        {/* Growth Chart (Mocked with pure CSS/SVG) */}
                        <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm">
                            <h3 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-theme-primary" /> Performance Trend
                            </h3>
                            <div className="h-48 relative w-full flex items-end gap-2">
                                {/* Simulated bars */}
                                {[40, 45, 42, 55, 60, 58, 70, 75, 82, 80, 85, 90].map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end group h-full relative">
                                        <div 
                                            className="w-full bg-theme-primary/20 hover:bg-theme-primary/40 rounded-t-sm transition-all duration-300 relative overflow-hidden"
                                            style={{ height: `${val}%` }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-theme-primary"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-theme-bg border border-theme-border text-theme-text text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            Score: {val}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-theme-muted mt-2 border-t border-theme-border/50 pt-2">
                                <span>12 weeks ago</span>
                                <span>Today</span>
                            </div>
                        </div>

                        {/* Weak Areas */}
                        <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm">
                            <h3 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" /> Focus Areas
                            </h3>
                            <div className="space-y-4">
                                {weakAreas.map((area, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-theme-bg border border-theme-border">
                                        <div className="w-12 h-12 rounded-full border-4 border-red-500/20 flex items-center justify-center relative">
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-theme-surface" />
                                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-red-500" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * area.score) / 100} />
                                            </svg>
                                            <span className="text-xs font-bold text-theme-text">{area.score}%</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-theme-text text-sm">{area.topic}</h4>
                                            <p className="text-xs text-theme-muted mt-0.5">Needs immediate attention</p>
                                        </div>
                                        <button 
                                            onClick={() => onNavigate('quiz-assessment')}
                                            className="p-2 bg-theme-primary/10 text-theme-primary rounded-xl hover:bg-theme-primary hover:text-theme-bg transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Syllabus Progress */}
                    <div className="space-y-6">
                        <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-black text-theme-muted uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-theme-secondary" /> Syllabus Progress
                                </h3>
                                <span className="text-xs bg-theme-secondary/10 text-theme-secondary px-2 py-1 rounded font-bold">Locked</span>
                            </div>
                            
                            <p className="text-xs text-theme-muted mb-6">
                                Tracking will fully unlock once the official NCC syllabus is integrated.
                            </p>

                            <div className="space-y-5">
                                {syllabusProgress.map((item, i) => (
                                    <div key={i} className="opacity-70">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-bold text-theme-text">{item.chapter}</span>
                                            <span className="text-theme-primary">{item.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-theme-bg rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-theme-secondary to-theme-primary rounded-full relative"
                                                style={{ width: `${item.progress}%` }}
                                            >
                                                {item.progress < 100 && (
                                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-50"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onNavigate('quiz-assessment')}
                                className="w-full mt-8 py-3 bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 border border-theme-primary/30 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Trophy className="w-4 h-4" /> Start Assessment
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamPrepHub;
