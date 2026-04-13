import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExams, getTopicProgress } from '../../utils/competitiveHubService';
import { COMPETITIVE_EXAMS, SYLLABI, getAllTopics } from '../../data/competitiveHubData';

const ProgressHub = ({ examSlug, onStudyTopic, onBack }) => {
    const { currentUser } = useAuth();
    const [userExams, setUserExams] = useState([]);
    const [activeSlug, setActiveSlug] = useState(examSlug || '');
    const [progress, setProgress] = useState({});
    const [drilldown, setDrilldown] = useState({ subject: null, chapter: null });
    const [loading, setLoading] = useState(true);

    const uid = currentUser?.uid;

    useEffect(() => {
        if (uid) loadExams();
    }, [uid]);

    useEffect(() => {
        if (uid && activeSlug) loadProgress();
    }, [uid, activeSlug]);

    const loadExams = async () => {
        const exams = await getUserExams(uid);
        setUserExams(exams);
        if (!activeSlug && exams.length > 0) setActiveSlug(exams[0].examSlug);
        setLoading(false);
    };

    const loadProgress = async () => {
        const p = await getTopicProgress(uid, activeSlug);
        setProgress(p);
    };

    const syllabus = SYLLABI[activeSlug];
    const allTopics = getAllTopics(activeSlug);
    const completedIds = Object.keys(progress).filter(k => progress[k].status === 'done');
    const totalPercent = allTopics.length > 0 ? Math.round((completedIds.length / allTopics.length) * 100) : 0;

    const getStatusIcon = (topicId) => {
        const p = progress[topicId];
        if (!p) return { icon: '○', color: 'text-slate-400', label: 'Not Started' };
        if (p.status === 'done') return { icon: '✅', color: 'text-emerald-500', label: 'Complete' };
        if (p.status === 'focus_zone') return { icon: '⚡', color: 'text-amber-500', label: 'Focus Zone' };
        return { icon: '🔄', color: 'text-indigo-500', label: 'In Progress' };
    };

    const getSubjectStats = (subj) => {
        let total = 0, done = 0;
        subj.chapters.forEach(ch => {
            ch.topics.forEach(t => {
                total++;
                if (progress[t.id]?.status === 'done') done++;
            });
        });
        return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar relative bg-theme-bg">
            {/* Ambient Background */}
            <div className="aurora-bg opacity-30 pointer-events-none fixed inset-0">
                <div className="blob" />
            </div>

            <div className="max-w-[1400px] mx-auto p-4 md:p-8 xl:px-12 space-y-8 relative z-10 pb-24">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            {onBack && (
                                <button onClick={onBack} className="w-10 h-10 rounded-full glass-input flex items-center justify-center text-theme-muted hover:text-indigo-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all group">
                                    <span className="group-hover:-translate-x-1 transition-transform font-bold">←</span>
                                </button>
                            )}
                            <h2 className="text-3xl md:text-4xl font-black text-theme-text flex items-center gap-3 drop-shadow-sm">
                                <span className="text-4xl md:text-5xl animate-bounce-slow drop-shadow-md">📈</span> Progress Hub
                            </h2>
                        </div>
                        <p className="text-sm md:text-base font-bold text-theme-muted uppercase tracking-widest pl-14">Track your mastery</p>
                    </div>

                    {/* Exam Selector */}
                    {userExams.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {userExams.map(ue => {
                                const info = COMPETITIVE_EXAMS.find(e => e.slug === ue.examSlug);
                                return (
                                    <button key={ue.examSlug} 
                                        onClick={() => { setActiveSlug(ue.examSlug); setDrilldown({ subject: null, chapter: null }); }}
                                        className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-sm ${
                                            activeSlug === ue.examSlug ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30 ring-4 ring-pink-500/20' : 'glass-input text-theme-muted hover:text-theme-text hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:scale-105'
                                        }`}>
                                        <span className="text-base mr-2">{info?.flag}</span> {info?.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column (4 cols): Overall Progress Overview */}
                    <div className="lg:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                        <div className="beach-card p-8 md:p-10 text-center relative overflow-hidden group hover:shadow-xl transition-all border-t-0 border-l-0 glow-border">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 flex flex-col items-center">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-theme-muted mb-8">Overall Completion</h3>
                                <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-[12px] mb-6 shadow-xl relative" 
                                     style={{ borderColor: totalPercent > 70 ? '#10B981' : totalPercent > 40 ? '#F59E0B' : '#EF4444' }}>
                                    <div className="absolute inset-0 rounded-full border-4 border-white/20 dark:border-slate-800/50 pointer-events-none" />
                                    <span className="text-5xl font-black text-theme-text drop-shadow-sm">{totalPercent}%</span>
                                </div>
                                <p className="text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full glass-input shadow-sm">
                                    <span className="text-pink-500">{completedIds.length}</span> / {allTopics.length} Topics Mastered
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="beach-card p-6 text-center border-emerald-500/30 shadow-md shadow-emerald-500/10 hover:-translate-y-1 transition-transform">
                                <p className="text-3xl mb-2 drop-shadow-md">✅</p>
                                <p className="text-3xl font-black text-theme-text">{completedIds.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-2">Done</p>
                            </div>
                            <div className="beach-card p-6 text-center border-amber-500/30 shadow-md shadow-amber-500/10 hover:-translate-y-1 transition-transform">
                                <p className="text-3xl mb-2 drop-shadow-md">⚡</p>
                                <p className="text-3xl font-black text-theme-text">
                                    {Object.keys(progress).filter(k => progress[k].status === 'focus_zone').length}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mt-2">Focus Zone</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (8 cols): Interactive Drilldown */}
                    <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <div className="beach-card p-6 md:p-8 xl:p-10 min-h-[500px] relative overflow-hidden flex flex-col">
                            {/* Breadcrumbs Navigation */}
                            <div className="flex items-center gap-2 mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-2xl w-fit backdrop-blur-sm">
                                <button 
                                    onClick={() => setDrilldown({ subject: null, chapter: null })}
                                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${!drilldown.subject ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-theme-muted hover:text-theme-text hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                                >
                                    All Subjects
                                </button>
                                {drilldown.subject && (
                                    <>
                                        <span className="text-theme-muted font-black opacity-50">/</span>
                                        <button 
                                            onClick={() => setDrilldown({ ...drilldown, chapter: null })}
                                            className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all max-w-[150px] truncate ${drilldown.subject && !drilldown.chapter ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-theme-muted hover:text-theme-text hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                                        >
                                            {drilldown.subject.name}
                                        </button>
                                    </>
                                )}
                                {drilldown.chapter && (
                                    <>
                                        <span className="text-theme-muted font-black opacity-50">/</span>
                                        <div className="px-4 py-2 rounded-xl text-xs font-black tracking-widest text-pink-500 uppercase bg-white dark:bg-slate-700 shadow-sm max-w-[150px] truncate">
                                            {drilldown.chapter.name}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Dynamic Content Area */}
                            <div className="flex-1">
                                {!drilldown.subject && syllabus ? (
                                    /* Root: Subject View */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                        {syllabus.subjects.map((subj, i) => {
                                            const s = getSubjectStats(subj);
                                            return (
                                                <button key={subj.name} 
                                                    onClick={() => setDrilldown({ subject: subj, chapter: null })}
                                                    className="p-6 rounded-[2rem] glass-input text-left hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all group relative overflow-hidden will-change-transform"
                                                    style={{ animationDelay: `${i * 50}ms` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative z-10">
                                                        <div className="flex items-start justify-between mb-8">
                                                            <span className="font-black text-xl text-theme-text group-hover:text-pink-500 transition-colors">{subj.name}</span>
                                                            <span className="px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg text-xs font-black font-mono text-theme-muted">
                                                                {s.done} / {s.total}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden shadow-inner">
                                                            <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{
                                                                width: `${s.percent}%`,
                                                                backgroundColor: s.percent > 70 ? '#10B981' : s.percent > 40 ? '#F59E0B' : '#EF4444'
                                                            }}>
                                                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : drilldown.subject && !drilldown.chapter ? (
                                    /* Drilldown Level 1: Chapter View */
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <h3 className="text-2xl font-black text-theme-text mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">{drilldown.subject.name} Chapters</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {drilldown.subject.chapters.map(ch => {
                                                let done = 0, total = ch.topics.length;
                                                ch.topics.forEach(t => { if (progress[t.id]?.status === 'done') done++; });
                                                const hasFocus = ch.topics.some(t => progress[t.id]?.status === 'focus_zone');
                                                const isDone = done === total && total > 0;
                                                return (
                                                    <button key={ch.name} 
                                                        onClick={() => setDrilldown({ ...drilldown, chapter: ch })}
                                                        className={`w-full p-5 rounded-2xl border text-left transition-all group flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 ${
                                                            hasFocus ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 hover:shadow-amber-500/10' : 
                                                            isDone ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-900/10 hover:border-emerald-400' :
                                                            'border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40 hover:border-pink-400'
                                                        }`}>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">{isDone ? '✅' : hasFocus ? '⚡' : done > 0 ? '🔄' : '○'}</span>
                                                            <span className={`font-black text-lg ${isDone ? 'text-theme-text' : 'text-theme-text'}`}>{ch.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="hidden sm:block w-32 h-2 rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden shadow-inner">
                                                                 <div className={`h-full rounded-full transition-all duration-700 ease-out relative ${isDone ? 'bg-emerald-500' : hasFocus ? 'bg-amber-500' : 'bg-gradient-to-r from-pink-500 to-orange-500'}`} style={{ width: `${(done/total)*100}%` }}>
                                                                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                                                                 </div>
                                                            </div>
                                                            <span className="text-xs font-black font-mono bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50">{done}/{total}</span>
                                                            <span className="text-pink-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all -ml-2 font-black">→</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : drilldown.chapter ? (
                                    /* Drilldown Level 2: Topic View */
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <h3 className="text-2xl font-black text-theme-text mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                            {drilldown.chapter.name}
                                            <span className="text-xs font-bold text-theme-muted uppercase tracking-widest px-3 py-1 glass-input rounded-full">{drilldown.chapter.topics.length} Topics</span>
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {drilldown.chapter.topics.map(topic => {
                                                const status = getStatusIcon(topic.id);
                                                const isFocus = progress[topic.id]?.status === 'focus_zone';
                                                const isDone = progress[topic.id]?.status === 'done';
                                                
                                                return (
                                                    <div key={topic.id} className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 group relative overflow-hidden ${
                                                        isFocus ? 'border-amber-400 bg-amber-50/80 dark:bg-amber-900/20 shadow-amber-500/5' : 
                                                        isDone ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-900/10' :
                                                        'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:border-pink-300'
                                                    }`}>
                                                        {isFocus && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />}
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
                                                            isDone ? 'bg-emerald-100 border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-700/50 text-emerald-600 dark:text-emerald-400' :
                                                            isFocus ? 'bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:border-amber-700/50 text-amber-600 dark:text-amber-400' :
                                                            'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                                        }`}>
                                                            <span className={`text-xl drop-shadow-sm`}>{status.icon}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0 pr-4 relative z-10">
                                                            <p className={`font-black text-base md:text-lg lg:text-xl truncate transition-colors ${isDone ? 'text-emerald-700 dark:text-emerald-400' : group-hover ? 'text-pink-600 dark:text-pink-400' : 'text-theme-text'}`}>{topic.name}</p>
                                                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 ${isDone ? 'text-emerald-600/70 dark:text-emerald-400/70' : isFocus ? 'text-amber-600 dark:text-amber-400' : 'text-theme-muted'}`}>{status.label}</p>
                                                        </div>
                                                        <button onClick={() => onStudyTopic(topic.id, activeSlug)}
                                                            className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all shadow-sm flex-shrink-0 ${
                                                                isDone ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600' : 
                                                                isFocus ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20 hover:-translate-y-0.5' :
                                                                'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 shadow-pink-500/20 hover:-translate-y-0.5'
                                                            }`}>
                                                            {isDone ? 'Review' : 'Study Now'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressHub;
