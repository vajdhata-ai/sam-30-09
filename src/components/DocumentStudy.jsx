import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronRight, Target, Zap, ChevronLeft, Check, FileText, Eye, Sparkles, BrainCircuit, Bot } from './Icons';
import MarkdownDisplay from './MarkdownDisplay';
import AuremIngestion from './AuremIngestion';
import LensChat from './LensChat';
import MindMapViewer from './MindMapViewer';

const DocumentStudy = ({ onNavigate, assessmentContext, setAssessmentContext }) => {
    const { userProfile } = useAuth();
    const { isDark } = useTheme();

    const [masteryContext, setMasteryContext] = useState(null);
    const [activeLevel, setActiveLevel] = useState('beginner'); // beginner, intermediate, advanced
    const [unlockedLevels, setUnlockedLevels] = useState(['beginner']);
    const [isChatOpen, setIsChatOpen] = useState(window.innerWidth > 768);

    // Load unlocks when context is set
    useEffect(() => {
        if (masteryContext?.topic) {
            const savedUnlocks = localStorage.getItem(`unlockedLevels_${masteryContext.topic}`);
            if (savedUnlocks) {
                setUnlockedLevels(JSON.parse(savedUnlocks));
            } else {
                setUnlockedLevels(['beginner']);
                setActiveLevel('beginner');
            }
        }
    }, [masteryContext]);

    const handleStartAssessment = () => {
        if (setAssessmentContext && masteryContext) {
            setAssessmentContext({
                topic: masteryContext.topic,
                level: activeLevel,
                contextData: masteryContext
            });
        }
        onNavigate('quiz-assessment');
    };

    // Premium Flashcard Component
    const Flashcard = ({ card, index }) => {
        const [isFlipped, setIsFlipped] = useState(false);
        return (
            <div 
                className="relative h-72 w-full cursor-pointer group [perspective:2000px]" 
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className={`relative w-full h-full transition-transform duration-700 ease-out transform-gpu ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                    
                    {/* Front: Question */}
                    <div className="absolute inset-0 p-8 rounded-[32px] border border-theme-border/50 flex flex-col justify-center items-center text-center bg-theme-surface/80 backdrop-blur-xl group-hover:border-theme-primary/50 group-hover:shadow-[0_0_40px_rgba(var(--theme-primary-rgb),0.1)] transition-all duration-300" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-theme-primary/[0.05] to-transparent rounded-tr-[32px] rounded-bl-full" />
                        
                        <span className="absolute top-5 left-5 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                            Question
                        </span>
                        
                        <h4 className="font-serif text-2xl font-bold text-theme-text leading-snug px-4">{card.question}</h4>
                        
                        <div className="absolute bottom-6 flex items-center gap-2 text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Zap className="w-4 h-4 text-theme-primary animate-pulse" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Click to Reveal Intelligence</span>
                        </div>
                    </div>

                    {/* Back: Answer */}
                    <div className="absolute inset-0 p-8 rounded-[32px] border border-theme-primary/40 flex flex-col justify-center items-center text-center bg-gradient-to-br from-theme-surface to-theme-bg shadow-2xl shadow-theme-primary/10" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <span className="absolute top-5 left-5 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Answer
                        </span>
                        
                        <div className="overflow-y-auto custom-scrollbar w-full px-2 max-h-[80%] flex items-center justify-center">
                            <p className="text-lg font-medium text-theme-text leading-relaxed">{card.answer}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Ingestion View
    if (!masteryContext) {
        return <AuremIngestion onIntelligenceGenerated={setMasteryContext} onExit={() => onNavigate('cadet-dashboard')} autoSelectTopic={assessmentContext?.topic} />;
    }

    // Active Mastery Dashboard
    return (
        <div className="flex h-full bg-theme-bg relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-[20%] w-[600px] h-[600px] bg-theme-primary/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-theme-secondary/[0.02] rounded-full blur-[100px]" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                {/* Header */}
                <header className="shrink-0 border-b border-theme-border/50 bg-theme-surface/60 backdrop-blur-2xl px-6 py-5 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setMasteryContext(null)}
                                className="p-3 rounded-2xl bg-theme-bg border border-theme-border hover:border-theme-primary/50 text-theme-muted hover:text-theme-primary transition-all duration-300 shadow-sm hover:shadow-theme-primary/20"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.15em] text-theme-text flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-theme-primary" /> Samvada Lens
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-theme-primary mt-1 line-clamp-1">
                                    {masteryContext.topic || 'Ingested Context'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                            {!isChatOpen && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="px-4 py-2 bg-theme-primary/10 text-theme-primary border border-theme-primary/30 rounded-xl flex items-center gap-2 hover:bg-theme-primary hover:text-theme-bg transition-colors whitespace-nowrap shadow-sm shadow-theme-primary/10"
                                >
                                    <Bot className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">AI Tutor</span>
                                </button>
                            )}
                            <div className="bg-theme-bg/80 backdrop-blur-md p-1.5 rounded-2xl border border-theme-border/50 flex shadow-inner">
                                {[
                                    { id: 'beginner', label: 'L1: Base' }, 
                                    { id: 'intermediate', label: 'L2: Application' }, 
                                    { id: 'advanced', label: 'L3: Synthesis' }
                                ].map(tab => {
                                    const isLocked = !unlockedLevels.includes(tab.id);
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => !isLocked && setActiveLevel(tab.id)}
                                            className={`relative px-5 py-2.5 rounded-[12px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden ${
                                                activeLevel === tab.id 
                                                ? 'bg-theme-primary text-theme-bg shadow-lg shadow-theme-primary/30 transform scale-100' 
                                                : isLocked 
                                                    ? 'text-theme-muted/30 cursor-not-allowed'
                                                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface'
                                            }`}
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isLocked && <div className="w-1.5 h-1.5 rounded-full bg-theme-muted/30" />}
                                                {tab.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 scroll-smooth">
                    <div className="max-w-4xl mx-auto w-full pb-32">
                        
                        {/* ═══ LEVEL 1 ═══ */}
                        {activeLevel === 'beginner' && (
                            <div className="animate-fade-in space-y-10">
                                {/* Core Summary Card */}
                                <div className="relative bg-theme-surface/80 backdrop-blur-xl border border-theme-border/50 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-theme-primary/[0.05] to-transparent rounded-bl-full" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-border/50">
                                            <div className="p-4 bg-theme-primary/10 rounded-2xl border border-theme-primary/20">
                                                <Target className="w-8 h-8 text-theme-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-theme-text uppercase tracking-widest">Level 1: Foundation</h2>
                                                <p className="text-xs font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">Core Intelligence Extraction</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative">
                                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-theme-primary to-theme-primary/10 rounded-full" />
                                            <p className="text-xl md:text-2xl font-serif leading-relaxed text-theme-text/90 italic pl-6 py-2">
                                                "{typeof masteryContext.summary === 'string' ? masteryContext.summary : JSON.stringify(masteryContext.summary)}"
                                            </p>
                                        </div>

                                        <div className="mt-10 pt-10 border-t border-theme-border/50">
                                            <div className="prose prose-invert prose-theme max-w-none">
                                                <MarkdownDisplay text={masteryContext.notes_basic || "Notes compiling..."} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mind Map */}
                                <div className="p-8 md:p-10 bg-theme-surface/80 backdrop-blur-xl border border-theme-border/50 rounded-[32px] shadow-xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <BrainCircuit className="w-7 h-7 text-theme-primary" />
                                        <h3 className="text-2xl font-black text-theme-text uppercase tracking-widest">Spatial Memory Matrix</h3>
                                    </div>
                                    {masteryContext.mindmap ? (
                                        <div className="h-[500px] rounded-[24px] overflow-hidden bg-theme-bg border border-theme-border/40 shadow-inner">
                                            <MindMapViewer data={masteryContext.mindmap} />
                                        </div>
                                    ) : (
                                        <div className="h-64 rounded-[24px] bg-theme-bg/50 border border-theme-border/30 flex items-center justify-center flex-col gap-4">
                                            <Sparkles className="w-8 h-8 text-theme-primary animate-pulse" />
                                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-theme-muted">Constructing neural map...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Progression Gateway */}
                                <div className="p-10 bg-gradient-to-b from-theme-primary/[0.02] to-theme-primary/10 border border-theme-primary/20 rounded-[32px] text-center shadow-2xl shadow-theme-primary/5">
                                    <div className="inline-flex p-4 bg-theme-bg rounded-full border border-theme-primary/30 mb-6 shadow-lg shadow-theme-primary/20">
                                        <Target className="w-8 h-8 text-theme-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-theme-text uppercase tracking-widest mb-3">Initialize Proficiency Test</h3>
                                    <p className="text-theme-muted mb-8 max-w-md mx-auto text-sm leading-relaxed">Prove your foundational understanding in the adaptive MCQ matrix to unlock Level 2 Application.</p>
                                    <button 
                                        onClick={handleStartAssessment}
                                        className="px-10 py-5 bg-theme-primary text-theme-bg rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-theme-primary/30 hover:shadow-theme-primary/50 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Start L1 Assessment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ═══ LEVEL 2 ═══ */}
                        {activeLevel === 'intermediate' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="bg-theme-surface/80 backdrop-blur-xl border border-theme-border/50 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-secondary/[0.03] rounded-full blur-[80px]" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-theme-border/50">
                                            <div className="p-4 bg-theme-secondary/10 rounded-2xl border border-theme-secondary/20">
                                                <FileText className="w-8 h-8 text-theme-secondary" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-theme-text uppercase tracking-widest">Level 2: Application</h2>
                                                <p className="text-xs font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">Analytical & Practical Scenarios</p>
                                            </div>
                                        </div>
                                        <div className="prose prose-invert prose-theme max-w-none">
                                            <MarkdownDisplay text={masteryContext.notes_intermediate || "Notes compiling..."} />
                                        </div>
                                    </div>
                                </div>

                                {/* Flashcards Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-8 px-2">
                                        <Zap className="w-7 h-7 text-theme-primary" />
                                        <h2 className="text-2xl font-black text-theme-text uppercase tracking-widest">Active Recall Engine</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Array.isArray(masteryContext.flashcards) && masteryContext.flashcards.slice(0, 10).map((card, idx) => (
                                            <Flashcard key={idx} card={card} index={idx} />
                                        ))}
                                    </div>
                                </div>

                                {/* Progression Gateway */}
                                <div className="p-10 bg-gradient-to-b from-theme-secondary/[0.02] to-theme-secondary/10 border border-theme-secondary/20 rounded-[32px] text-center shadow-2xl shadow-theme-secondary/5">
                                    <div className="inline-flex p-4 bg-theme-bg rounded-full border border-theme-secondary/30 mb-6 shadow-lg shadow-theme-secondary/20">
                                        <Zap className="w-8 h-8 text-theme-secondary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-theme-text uppercase tracking-widest mb-3">Application Protocol</h3>
                                    <p className="text-theme-muted mb-8 max-w-md mx-auto text-sm leading-relaxed">Engage in assertion-reasoning scenarios to prove your capability to apply this intelligence in the field.</p>
                                    <button 
                                        onClick={handleStartAssessment}
                                        className="px-10 py-5 bg-theme-secondary text-theme-bg rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-theme-secondary/30 hover:shadow-theme-secondary/50 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Start L2 Assessment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ═══ LEVEL 3 ═══ */}
                        {activeLevel === 'advanced' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="bg-theme-surface/80 backdrop-blur-xl border border-theme-border/50 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/[0.02] via-transparent to-theme-secondary/[0.02]" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-theme-border/50">
                                            <div className="p-4 bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 rounded-2xl border border-theme-primary/30">
                                                <Sparkles className="w-8 h-8 text-theme-text drop-shadow-[0_0_10px_rgba(var(--theme-primary-rgb),0.5)]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-theme-text uppercase tracking-widest">Level 3: Synthesis</h2>
                                                <p className="text-xs font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">Elite Cognitive Mastery</p>
                                            </div>
                                        </div>
                                        <div className="prose prose-invert prose-theme max-w-none">
                                            <MarkdownDisplay text={masteryContext.notes_advanced || "Notes compiling..."} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Final Gateway */}
                                <div className="mt-16 p-12 md:p-16 bg-gradient-to-br from-theme-surface to-theme-bg border border-theme-border/50 rounded-[40px] text-center relative overflow-hidden group shadow-2xl">
                                    {/* Animated background effects */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/[0.05] via-theme-secondary/[0.05] to-theme-primary/[0.05] opacity-50 bg-[length:200%_100%] animate-gradient-shift" />
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-110 transform-gpu">
                                        <Sparkles className="w-64 h-64 text-theme-primary" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="inline-flex p-5 bg-theme-bg rounded-3xl border border-theme-border mb-8 shadow-xl">
                                            <Sparkles className="w-10 h-10 text-theme-text" />
                                        </div>
                                        <h3 className="text-4xl font-black text-theme-text mb-4 uppercase tracking-widest">Mastery Complete?</h3>
                                        <p className="text-theme-muted mb-10 max-w-lg mx-auto text-base leading-relaxed">
                                            You have traversed the entire cognitive loop. Prove your final synthesis to construct the Definitive Masterpiece and lock this knowledge into long-term memory.
                                        </p>
                                        <button 
                                            onClick={handleStartAssessment}
                                            className="group/btn relative px-10 py-5 bg-theme-text text-theme-bg rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex items-center justify-center gap-4 mx-auto overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                            <span className="relative z-10">Final Gateway Assessment</span>
                                            <ChevronRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Side Chat - Samvada Lens AI */}
            <div className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden bg-theme-surface border-l border-theme-border/30 shadow-2xl relative
                ${isChatOpen ? 'w-[85vw] md:w-[450px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'}
                ${window.innerWidth <= 768 ? 'absolute right-0 top-0 bottom-0 z-50' : ''}
            `}>
                <div className="w-[85vw] md:w-[450px] h-full relative">
                    <LensChat documentContext={masteryContext} onClose={() => setIsChatOpen(false)} />
                </div>
            </div>
            
            {/* Mobile Backdrop overlay */}
            {isChatOpen && window.innerWidth <= 768 && (
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default DocumentStudy;
