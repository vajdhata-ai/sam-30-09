import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTopicById } from '../../data/competitiveHubData';
import { updateTopicProgress, addXP, updateStreak } from '../../utils/competitiveHubService';
import RocketLoader from './components/RocketLoader';

const CompetitiveLearningSession = ({ topicId, examSlug, onBack, onTopicComplete, onStartPodcast }) => {
    const { currentUser } = useAuth();
    const [topic, setTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('reading'); // 'reading', 'podcast', 'video', 'quiz'
    
    // Quiz state
    const [quizStarted, setQuizStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    
    // Media generation state
    const [mediaDuration, setMediaDuration] = useState('15'); // '15', '30', '45', '60', '90'
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const t = getTopicById(examSlug, topicId);
        setTopic(t);
    }, [topicId, examSlug]);

    const handleGenerateMedia = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000); // Mock generation time
    };

    const handleCompleteTopic = async (passed) => {
        if (!passed) return;
        try {
            await updateTopicProgress(currentUser.uid, topicId, examSlug, {
                status: 'done',
                auremLevel: 1
            });
            await addXP(currentUser.uid, 50); // XP for chapter clear
            await updateStreak(currentUser.uid, 1);
            if (onTopicComplete) onTopicComplete();
        } catch (err) {
            console.error('Error completing topic:', err);
        }
    };

    const devBypass = () => {
        setScore(100);
        setQuizDone(true);
        handleCompleteTopic(true);
    };

    if (!topic) {
        return <RocketLoader mode="landing" title="Loading Topic..." />;
    }

    return (
        <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-slate-900/40 to-slate-950 pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex-shrink-0 p-4 md:px-8 md:py-6 border-b border-white/10 relative z-10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-slate-300">
                        ←
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white">{topic.name}</h2>
                        <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">{topic.subjectName}</p>
                    </div>
                </div>
                
                {/* Dev Bypass */}
                {(currentUser?.email === 'shubham@example.com' || currentUser?.email?.includes('shubham')) && (
                    <button onClick={devBypass} className="px-3 py-1 rounded bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/30 hover:bg-red-500/30 transition-colors">
                        Dev Bypass
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex-shrink-0 flex items-center gap-2 p-4 md:px-8 border-b border-white/5 relative z-10 overflow-x-auto no-scrollbar">
                {[
                    { id: 'reading', label: '📖 Read Concepts', color: 'from-blue-500 to-cyan-500' },
                    { id: 'podcast', label: '🎧 AI Podcast', color: 'from-violet-500 to-fuchsia-500' },
                    { id: 'video', label: '🎬 AI Video', color: 'from-orange-500 to-amber-500' },
                    { id: 'quiz', label: '📝 Final Quiz', color: 'from-emerald-500 to-teal-500' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                            activeTab === tab.id
                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    
                    {/* READING TAB (Auremous Lens Style) */}
                    {activeTab === 'reading' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="beach-card p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/80">
                                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🧠</span> Core Concepts
                                </h3>
                                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white">
                                    <p>Welcome to the in-depth learning module for {topic.name}. Here, Auremous Lens will break down the fundamental principles.</p>
                                    <p><em>(In a full implementation, AI would stream rich markdown content here based on the topic and user's level. We are displaying a highly polished placeholder structure.)</em></p>
                                    
                                    <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
                                        <h4 className="text-indigo-400 font-bold uppercase text-sm tracking-widest mb-2">Key Formula / Theorem</h4>
                                        <p className="text-xl text-white font-mono">E = mc²</p>
                                    </div>

                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="text-pink-500 mt-1">✦</span>
                                            <span>Understand the foundational theory and its applications in previous exam questions.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-pink-500 mt-1">✦</span>
                                            <span>Review common pitfalls and misconceptions often tested in {examSlug.toUpperCase()}.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button onClick={() => setActiveTab('quiz')} className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black tracking-widest uppercase transition-colors">
                                I'm Ready for the Quiz →
                            </button>
                        </div>
                    )}

                    {/* PODCAST TAB */}
                    {activeTab === 'podcast' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto text-center space-y-8">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1 animate-pulse-slow shadow-2xl shadow-violet-500/20">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-5xl">🎧</span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">Generate Smart Podcast</h3>
                                <p className="text-slate-400">Two AI hosts will discuss {topic.name}, focusing on exam-relevant concepts and tips.</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 inline-block w-full text-left">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Duration</label>
                                <div className="flex flex-wrap gap-3">
                                    {['15', '30', '45', '60', '90'].map(min => (
                                        <button
                                            key={min}
                                            onClick={() => setMediaDuration(min)}
                                            className={`flex-1 py-3 rounded-xl font-black transition-all ${
                                                mediaDuration === min ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {min}m
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => onStartPodcast(topic.name, examSlug)}
                                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-fuchsia-500/20"
                                >
                                    Generate & Listen Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIDEO TAB */}
                    {activeTab === 'video' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto text-center space-y-8">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-500 p-1 shadow-2xl shadow-orange-500/20">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-5xl">🎬</span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">Generate Video Lecture</h3>
                                <p className="text-slate-400">AI will generate a comprehensive video lesson with visual aids and whiteboard explanations for {topic.name}.</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 inline-block w-full text-left">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Duration</label>
                                <div className="flex flex-wrap gap-3">
                                    {['15', '30', '45', '60', '90'].map(min => (
                                        <button
                                            key={min}
                                            onClick={() => setMediaDuration(min)}
                                            className={`flex-1 py-3 rounded-xl font-black transition-all ${
                                                mediaDuration === min ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {min}m
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={handleGenerateMedia}
                                    disabled={isGenerating}
                                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:scale-100 flex justify-center"
                                >
                                    {isGenerating ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Generate Video'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* QUIZ TAB */}
                    {activeTab === 'quiz' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                            {!quizStarted && !quizDone ? (
                                <div className="text-center space-y-6 py-12">
                                    <div className="text-6xl mb-4 p-6 bg-emerald-500/10 rounded-full inline-block text-emerald-400">📝</div>
                                    <h3 className="text-3xl font-black text-white">Chapter Clearance</h3>
                                    <p className="text-slate-400">You must score at least 60% on this quiz to mark {topic.name} as complete and unlock full mastery.</p>
                                    <button 
                                        onClick={() => setQuizStarted(true)}
                                        className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ) : quizStarted && !quizDone ? (
                                <div className="beach-card p-8 rounded-3xl border border-white/10 bg-slate-900/80">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                                        <span>Question 1 of 5</span>
                                        <span className="text-emerald-400">00:45 Remaining</span>
                                    </div>
                                    
                                    <h4 className="text-xl text-white font-medium mb-8 leading-relaxed">
                                        What is the primary application of this concept as tested in recent {examSlug.toUpperCase()} papers?
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {['Application A', 'Application B', 'Application C', 'Application D'].map((opt, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => {
                                                    // Mock instant completion for demo
                                                    const won = Math.random() > 0.4; // 60% chance to pass randomly
                                                    setScore(won ? 80 : 40);
                                                    setQuizDone(true);
                                                    if(won) handleCompleteTopic(true);
                                                }}
                                                className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-left text-slate-300 transition-all group"
                                            >
                                                <span className="inline-block w-8 font-mono text-emerald-500/50 group-hover:text-emerald-400">{String.fromCharCode(65+i)}.</span> {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 py-12">
                                    <div className={`text-6xl mb-4 p-8 rounded-full inline-block ${score >= 60 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {score >= 60 ? '🏆' : '💔'}
                                    </div>
                                    <h3 className="text-3xl font-black text-white">{score >= 60 ? 'Chapter Cleared!' : 'Keep Trying'}</h3>
                                    <p className="text-slate-400">You scored <strong className={`text-xl ${score >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{score}%</strong>.</p>
                                    
                                    <div className="pt-4">
                                        {score >= 60 ? (
                                            <button onClick={onBack} className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1">
                                                Return to Syllabus
                                            </button>
                                        ) : (
                                            <button onClick={() => { setQuizStarted(false); setQuizDone(false); }} className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest transition-all">
                                                Retry Quiz
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompetitiveLearningSession;
