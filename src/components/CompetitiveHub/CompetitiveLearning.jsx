import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SYLLABI, getAllTopics } from '../../data/competitiveHubData';
import { getTopicProgress } from '../../utils/competitiveHubService';
import RocketLoader from './components/RocketLoader';
import CompetitiveLearningSession from './CompetitiveLearningSession'; // the actual study UI

const CompetitiveLearning = ({ examSlug, initialTopicId, onBack, onStartPodcast }) => {
    const { currentUser } = useAuth();
    const [syllabus, setSyllabus] = useState(null);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || null);

    useEffect(() => {
        loadData();
    }, [examSlug, currentUser]);

    const loadData = async () => {
        setLoading(true);
        const examSyllabus = SYLLABI[examSlug];
        setSyllabus(examSyllabus);
        
        if (currentUser && examSlug) {
            try {
                const prog = await getTopicProgress(currentUser.uid, examSlug);
                setProgress(prog || {});
            } catch (error) {
                console.error("Failed to load topic progress", error);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <RocketLoader mode="landing" title="Loading Syllabus" />;
    }

    if (!syllabus) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-4xl mb-4">⚠️</p>
                <h2 className="text-xl font-bold text-white mb-2">Syllabus Not Found</h2>
                <button onClick={onBack} className="text-pink-500 hover:text-pink-400 font-bold uppercase tracking-widest text-xs">← Back to Hub</button>
            </div>
        );
    }

    // If a topic is selected, render the actual learning session for that topic
    if (selectedTopicId) {
        return (
            <CompetitiveLearningSession 
                topicId={selectedTopicId} 
                examSlug={examSlug} 
                onBack={() => setSelectedTopicId(null)}
                onTopicComplete={() => {
                    loadData(); // refresh progress
                    setSelectedTopicId(null);
                }}
                onStartPodcast={onStartPodcast}
            />
        );
    }

    // Otherwise, render the Syllabus view
    const allTopics = getAllTopics(examSlug);
    const completedCount = allTopics.filter(t => progress[t.id]?.status === 'done').length;
    const completionPercent = Math.round((completedCount / allTopics.length) * 100) || 0;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar relative bg-slate-950">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900/50 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 pb-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
                    <div>
                        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Hub
                        </button>
                        <h1 className="text-3xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
                            📖 Knowledge Archives
                        </h1>
                        <p className="text-slate-400 font-medium mt-2 max-w-xl">
                            Master every concept for <strong className="text-slate-300">{(syllabus.examSlug || examSlug).toUpperCase()}</strong>. Each chapter is a region to conquer.
                        </p>
                    </div>
                    
                    {/* Overall Progress */}
                    <div className="beach-card p-4 rounded-2xl border-white/5 flex items-center gap-6 min-w-[240px]">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="40" className="stroke-pink-500" strokeWidth="8" fill="none" 
                                    strokeDasharray={`${(completionPercent / 100) * 251.2} 251.2`} 
                                    strokeLinecap="round" 
                                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                />
                            </svg>
                            <span className="absolute text-sm font-black text-white">{completionPercent}%</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Syllabus</p>
                            <p className="text-xl font-black text-white">{completedCount} <span className="text-sm text-slate-500">/ {allTopics.length}</span></p>
                        </div>
                    </div>
                </div>

                {/* Syllabus List */}
                <div className="space-y-12">
                    {syllabus.subjects.sort((a,b)=>a.order-b.order).map(subject => (
                        <div key={subject.name} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">{subject.name}</h2>
                                <div className="h-px bg-gradient-to-r from-indigo-500/50 to-transparent flex-1" />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {subject.chapters.sort((a,b)=>a.order-b.order).map(chapter => {
                                    const cTopics = chapter.topics;
                                    const cDone = cTopics.filter(t => progress[t.id]?.status === 'done').length;
                                    const isChapDone = cDone === cTopics.length;
                                    
                                    return (
                                        <div key={chapter.name} className={`flex flex-col p-5 md:p-6 rounded-3xl border transition-all duration-300 ${
                                            isChapDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/50 border-white/5 hover:border-pink-500/30'
                                        }`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Mini chapter progress ring */}
                                                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                            <circle cx="18" cy="18" r="14" className="stroke-slate-800" strokeWidth="3" fill="none" />
                                                            <circle cx="18" cy="18" r="14" className={isChapDone ? 'stroke-emerald-500' : 'stroke-pink-500'} strokeWidth="3" fill="none" 
                                                                strokeDasharray={`${(cDone / cTopics.length) * 88} 88`} 
                                                                strokeLinecap="round" 
                                                                style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                                                            />
                                                        </svg>
                                                        <span className="absolute text-[9px] font-black text-white">{cDone}/{cTopics.length}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-black text-lg ${isChapDone ? 'text-emerald-400' : 'text-slate-200'}`}>{chapter.name}</h3>
                                                        <p className="text-xs font-bold text-slate-500 mt-0.5">{cTopics.length} Topics • ~{chapter.estimatedHours}h • <span className="text-amber-400">+{cTopics.length * 20} XP</span></p>
                                                    </div>
                                                </div>
                                                {isChapDone && <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">Conquered</span>}
                                            </div>

                                            <div className="space-y-2 mt-auto">
                                                {cTopics.sort((a,b)=>a.order-b.order).map(topic => {
                                                    const tStatus = progress[topic.id]?.status; // 'done', 'focus_zone', undefined
                                                    const isDone = tStatus === 'done';
                                                    const isFocus = tStatus === 'focus_zone';
                                                    
                                                    return (
                                                        <button 
                                                            key={topic.id}
                                                            onClick={() => setSelectedTopicId(topic.id)}
                                                            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left group ${
                                                                isDone ? 'bg-emerald-500/10 hover:bg-emerald-500/15' :
                                                                isFocus ? 'bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15' :
                                                                'bg-slate-800/50 hover:bg-pink-500/10'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3 truncate pr-4">
                                                                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black ${
                                                                    isDone ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    isFocus ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-slate-700 text-slate-400'
                                                                }`}>
                                                                    {isDone ? '✓' : isFocus ? '⚡' : '▶'}
                                                                </span>
                                                                <span className={`font-bold text-sm truncate ${
                                                                    isDone ? 'text-emerald-400' : isFocus ? 'text-amber-400' : 'text-slate-300 group-hover:text-pink-400'
                                                                }`}>{topic.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                {topic.priority === 'high' && !isDone && (
                                                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/20">High Wt.</span>
                                                                )}
                                                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                                    isDone ? 'text-emerald-500' : 'text-slate-600'
                                                                }`}>{isDone ? '+20 XP ✅' : '+20 XP'}</span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompetitiveLearning;
