import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTopicById } from '../../data/competitiveHubData';
import { getConceptCard } from '../../data/conceptCards';
import { getQuestions } from '../../data/questionBank';
import { updateTopicProgress, saveUserAnswer, addXP, updateStreak } from '../../utils/competitiveHubService';
import ConceptCard from './components/ConceptCard';
import QuestionCard from './components/QuestionCard';
import CompetitiveAskAI from './components/CompetitiveAskAI';
import QuickRecovery from './components/QuickRecovery';

const StudySession = ({ topicId, examSlug, onBack, onTopicComplete, onStartPodcast }) => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('concept');
    const [practiceState, setPracticeState] = useState({ current: 0, score: 0, done: false, answers: [] });

    const topic = getTopicById(examSlug, topicId);
    const conceptCard = getConceptCard(topicId);
    const questions = getQuestions(topicId);
    const uid = currentUser?.uid;

    const handleMarkUnderstood = async () => {
        if (!uid) return;
        await updateTopicProgress(uid, topicId, examSlug, { status: 'done', auremLevel: 2 });
        await addXP(uid, 20);
        await updateStreak(uid, 1);
        onTopicComplete?.();
    };

    const handleAnswer = async (isCorrect, selectedKey) => {
        const q = questions[practiceState.current];
        if (uid && q) {
            await saveUserAnswer(uid, {
                topicId, questionId: q.id, selectedAnswer: selectedKey,
                isCorrect, timeTakenSeconds: 0,
            });
        }

        const newScore = practiceState.score + (isCorrect ? 1 : 0);
        const newAnswers = [...practiceState.answers, { questionId: q.id, isCorrect, selected: selectedKey }];
        const next = practiceState.current + 1;

        if (next >= questions.length) {
            // Session complete
            const finalScore = newScore;
            const total = questions.length;
            const percent = (finalScore / total) * 100;

            if (uid) {
                await addXP(uid, 10); // Practice completed
                if (finalScore === total) await addXP(uid, 25); // Perfect score bonus

                if (percent < 60) {
                    await updateTopicProgress(uid, topicId, examSlug, { status: 'focus_zone' });
                } else if (percent >= 80) {
                    await updateTopicProgress(uid, topicId, examSlug, { status: 'done' });
                }
            }

            setPracticeState({ current: next, score: newScore, done: true, answers: newAnswers });
        } else {
            setPracticeState({ current: next, score: newScore, done: false, answers: newAnswers });
        }
    };

    const resetPractice = () => {
        setPracticeState({ current: 0, score: 0, done: false, answers: [] });
    };

    const tabs = [
        { id: 'concept', label: '📚 Concept' },
        { id: 'practice', label: '✏️ Practice' },
        { id: 'ask-ai', label: '🤖 Ask AI' },
    ];

    return (
        <div className="h-full flex flex-col bg-theme-bg relative overflow-hidden">
            {/* Beach Mesh Background */}
            <div className="beach-mesh" style={{position: 'fixed'}}>
                <div className="beach-orb beach-orb-1" />
                <div className="beach-orb beach-orb-2" />
                <div className="beach-orb beach-orb-3" />
            </div>

            <div className="flex flex-col xl:flex-row h-full relative z-10">
                {/* Sidebar Navigation */}
                <div className="xl:w-80 flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200/50 dark:border-slate-700/50 beach-card rounded-none flex flex-col xl:h-full z-20">
                    <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col items-start">
                        <button onClick={onBack} className="text-theme-muted hover:text-pink-500 transition-colors text-xs font-black uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Hub
                        </button>
                        <h2 className="text-xl md:text-2xl font-black text-theme-text mb-2 tracking-tight leading-tight">{topic?.name || 'Topic'}</h2>
                        <p className="text-[10px] md:text-xs font-bold text-indigo-500 uppercase tracking-widest">{topic?.subjectName} • {topic?.chapterName}</p>
                    </div>

                    <div className="p-3 md:p-4 flex flex-row xl:flex-col gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 md:px-5 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-black transition-all flex items-center justify-center xl:justify-start gap-3 whitespace-nowrap active:scale-[0.98] ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30 ring-4 ring-pink-400/20 xl:scale-[1.02] -translate-y-0.5'
                                        : 'text-theme-muted hover:text-theme-text hover:bg-white/60 dark:hover:bg-slate-800/60 glass-input'
                                }`}
                            >
                                <span className={`text-lg md:text-xl ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`}>{tab.label.split(' ')[0]}</span>
                                <span className="tracking-wide">{tab.label.split(' ').slice(1).join(' ')}</span>
                            </button>
                        ))}
                    </div>

                    {/* Podcast CTA */}
                    <div className="p-4 md:p-6 mt-auto hidden xl:block border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="beach-card p-4 rounded-2xl border-orange-500/30 bg-orange-50/50 dark:bg-orange-900/10 text-center">
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto mb-3">
                                🎧
                            </div>
                            <p className="text-xs font-bold text-theme-text mb-3">Learn on the go.</p>
                            <button 
                                onClick={() => onStartPodcast(topic?.name, examSlug)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-orange-500/20">
                                Listen Podcast
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="max-w-[1200px] mx-auto p-4 md:p-8 xl:p-12 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500">
                        
                        {/* Concept Tab */}
                        {activeTab === 'concept' && (
                            <div className="max-w-4xl mx-auto w-full">
                                <ConceptCard card={conceptCard} topicName={topic?.name} onMarkUnderstood={handleMarkUnderstood} />
                            </div>
                        )}

                        {/* Practice Tab */}
                        {activeTab === 'practice' && (
                            <div className="max-w-4xl mx-auto w-full">
                                {questions.length === 0 ? (
                                    <div className="text-center py-24 beach-card p-10 rounded-[2rem]">
                                        <p className="text-6xl mb-6">📝</p>
                                        <h3 className="text-2xl font-black text-theme-text mb-2">No Practice Questions</h3>
                                        <p className="text-theme-muted font-medium text-lg">We are still adding questions for this topic.</p>
                                    </div>
                                ) : practiceState.done ? (
                                    practiceState.score < questions.length * 0.6 ? (
                                        /* Focus Zone Quick Recovery */
                                        <div className="animate-in fade-in zoom-in-95 duration-500 beach-card p-6 md:p-10 rounded-[2rem] border-amber-500/30 shadow-xl shadow-amber-500/10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                            <div className="text-center mb-10 relative z-10">
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-6 relative">
                                                    <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-50" />
                                                    <p className="text-4xl">📖</p>
                                                </div>
                                                <h3 className="text-5xl font-black text-theme-text mb-2 tracking-tighter">
                                                    {practiceState.score} <span className="text-3xl text-theme-muted">/ {questions.length}</span>
                                                </h3>
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest text-xs mt-2 shadow-inner">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Focus Zone Activated
                                                </div>
                                            </div>
                                            <div className="relative z-10 max-w-2xl mx-auto">
                                                <QuickRecovery 
                                                    topicName={topic?.name} 
                                                    examSlug={examSlug} 
                                                    onRecovered={resetPractice} 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* Success Score Screen */
                                        <div className="text-center py-16 md:py-24 animate-in fade-in duration-500 beach-card p-10 rounded-[2rem] border-pink-500/30 shadow-xl shadow-pink-500/10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                            <div className="relative z-10">
                                                <p className="text-7xl mb-8 animate-bounce">
                                                    {practiceState.score === questions.length ? '🏆' : '💪'}
                                                </p>
                                                <h3 className="text-6xl font-black text-theme-text mb-4 tracking-tighter">
                                                    {practiceState.score} <span className="text-4xl text-theme-muted">/ {questions.length}</span>
                                                </h3>
                                                <p className={`text-xl font-black mb-10 px-6 py-3 inline-block rounded-full shadow-inner ${
                                                    practiceState.score === questions.length ? 'text-pink-500 bg-pink-500/10 border border-pink-500/30' : 'text-orange-500 bg-orange-500/10 border border-orange-500/30'
                                                }`}>
                                                    {practiceState.score === questions.length ? 'Flawless! +25 bonus XP 🎉' : 'Solid effort! Keep pushing.'}
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                                    <button onClick={resetPractice} className="flex-1 px-8 py-4 rounded-2xl glass-input text-theme-text font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm">
                                                        Retry Match
                                                    </button>
                                                    <button onClick={onBack} className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30 transition-all active:scale-95 text-white font-black uppercase tracking-wider">
                                                        Next Mission →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    /* Active Question */
                                    <div className="pb-10">
                                        <div className="mb-6 flex items-center justify-between pl-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-pink-500">Practice Match</p>
                                            <div className="flex gap-1.5">
                                                {Array.from({length: questions.length}).map((_, i) => (
                                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        i === practiceState.current ? 'w-8 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]' :
                                                        i < practiceState.current ? 'w-3 bg-pink-500/40' : 'w-3 bg-slate-200 dark:bg-slate-700'
                                                    }`} />
                                                ))}
                                            </div>
                                        </div>
                                        <QuestionCard
                                            key={practiceState.current}
                                            question={questions[practiceState.current]}
                                            questionNumber={practiceState.current + 1}
                                            totalQuestions={questions.length}
                                            onAnswer={handleAnswer}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ask AI Tab */}
                        {activeTab === 'ask-ai' && (
                            <div className="h-full w-full max-w-5xl mx-auto beach-card rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border-pink-500/20">
                                <div className="p-4 md:p-6 bg-pink-500/5 border-b border-pink-500/10 flex items-center gap-4 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-pink-500/30 relative z-10 flex-shrink-0">
                                        🤖
                                     </div>
                                     <div className="relative z-10">
                                        <h3 className="font-black text-lg text-theme-text leading-tight">Neural Tutor</h3>
                                        <p className="text-xs text-orange-500/80 font-bold uppercase tracking-wider mt-0.5">Socratic Engine Online</p>
                                     </div>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <CompetitiveAskAI topicName={topic?.name} examSlug={examSlug} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudySession;
