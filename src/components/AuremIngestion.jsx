import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, AlertCircle, Image as ImageIcon, Search, Shield, ChevronRight, ChevronLeft, Eye, Sparkles, FileText, X } from './Icons';
import { nccSyllabusData } from '../data/nccSyllabusData';
import { convertToBase64, convertPdfToImages, generateContextFromText, generateContextFromImages } from '../utils/auremLensService';
import { useAuth } from '../contexts/AuthContext';

// ═══════════════════════════════════════════════════════
//  MINI SPLASH — shown briefly when entering Samvada Lens
// ═══════════════════════════════════════════════════════
const LensSplash = ({ onComplete }) => {
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
    }, []); // Removed onComplete to prevent timer resets on parent re-renders

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
                        <Eye className="w-12 h-12 text-theme-primary" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full animate-ping shadow-lg shadow-theme-primary/50" />
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-theme-primary rounded-full shadow-lg shadow-theme-primary/50" />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-serif italic font-light tracking-widest text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.4)] select-none">
                        Samvada Lens
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-theme-primary mt-2">
                        Initializing Cognitive Engine
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

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════
const AuremIngestion = ({ onIntelligenceGenerated, onExit, autoSelectTopic }) => {
    const { userProfile } = useAuth();
    const userWing = userProfile?.wing || 'army';
    
    const [showSplash, setShowSplash] = useState(!autoSelectTopic); // Skip splash when auto-selecting
    const [activeInput, setActiveInput] = useState('syllabus'); // 'syllabus', 'upload'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    
    // Syllabus State
    const availableChapters = [
        ...(nccSyllabusData.common || []),
        ...(nccSyllabusData[userWing] || [])
    ].sort((a, b) => a.chapterNumber - b.chapterNumber);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-select topic from "Let's Fix This" flow
    const autoSelectTriggered = useRef(false);
    useEffect(() => {
        if (autoSelectTopic && !autoSelectTriggered.current && availableChapters.length > 0) {
            autoSelectTriggered.current = true;
            const topicLower = autoSelectTopic.toLowerCase();
            const matchedChapter = availableChapters.find(c => 
                c.chapterName.toLowerCase() === topicLower ||
                c.chapterName.toLowerCase().includes(topicLower) ||
                topicLower.includes(c.chapterName.toLowerCase())
            );
            if (matchedChapter) {
                handleSyllabusSelect(matchedChapter);
            }
        }
    }, [autoSelectTopic, availableChapters]);

    // Upload State
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const filteredChapters = availableChapters.filter(c => 
        c.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.topicName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const simulateProgress = () => {
        setLoadingProgress(0);
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) { clearInterval(interval); return 90; }
                return prev + Math.random() * 15;
            });
        }, 600);
        return () => clearInterval(interval);
    };

    const handleSyllabusSelect = async (chapter) => {
        setIsLoading(true);
        setError(null);
        setLoadingMessage('Restructuring curriculum for cognitive mastery...');
        const cleanup = simulateProgress();
        
        try {
            const content = `Chapter: ${chapter.chapterName}\nTopic: ${chapter.topicName}\n\nSummary:\n${chapter.summary}\n\nDetailed Notes:\n${chapter.notes}`;
            const masteryContext = await generateContextFromText(content);
            setLoadingProgress(100);
            setTimeout(() => onIntelligenceGenerated(masteryContext), 300);
        } catch (err) {
            console.error(err);
            setError("Failed to process syllabus chapter. Please try again.");
        } finally {
            cleanup();
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const processFile = (selectedFile) => {
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
                setError("Please upload a valid PDF, JPG, PNG, or WEBP file.");
                return;
            }
            if (selectedFile.size > 15 * 1024 * 1024) {
                setError("Max file size is 15MB.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleUploadProcess = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);
        setLoadingMessage('Scanning document structure...');
        const cleanup = simulateProgress();

        try {
            let images = [];
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                images = await convertPdfToImages(arrayBuffer);
                setLoadingMessage(`Extracted ${images.length} page(s). Analyzing content...`);
            } else {
                const base64Img = await convertToBase64(file);
                images = [base64Img];
            }
            
            setLoadingMessage('Extracting deep semantic intelligence...');
            const masteryContext = await generateContextFromImages(images);
            setLoadingProgress(100);
            setTimeout(() => onIntelligenceGenerated(masteryContext), 300);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to analyze document. Please try a clearer file.");
        } finally {
            cleanup();
            setIsLoading(false);
        }
    };

    // ═══ SPLASH ═══
    if (showSplash) {
        return <LensSplash onComplete={() => setShowSplash(false)} />;
    }

    // ═══ LOADING STATE ═══
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-theme-bg relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-theme-primary/5 blur-[120px] animate-pulse" />
                    <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-theme-secondary/5 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Spinner */}
                    <div className="relative w-32 h-32 mb-8">
                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(var(--theme-border))" strokeWidth="3" opacity="0.2" />
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(var(--theme-primary))" strokeWidth="3" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 54}`}
                                strokeDashoffset={`${2 * Math.PI * 54 * (1 - loadingProgress / 100)}`}
                                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Eye className="w-8 h-8 text-theme-primary animate-pulse" />
                            <span className="text-lg font-black text-theme-primary mt-1">{Math.round(loadingProgress)}%</span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-theme-text tracking-widest uppercase text-center">Processing Intelligence</h2>
                    <p className="text-theme-primary font-bold animate-pulse mt-3 text-center">{loadingMessage}</p>
                    <p className="text-theme-muted mt-4 text-sm max-w-md text-center leading-relaxed">
                        Samvada Lens is parsing, distilling, and constructing an adaptive mastery loop tailored to your cognitive profile.
                    </p>
                </div>
            </div>
        );
    }

    // ═══ MAIN VIEW ═══
    return (
        <div className="flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar relative">
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-theme-primary/[0.03] blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-theme-secondary/[0.03] blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">

                {/* ═══ STICKY HEADER ═══ */}
                <header className="shrink-0 sticky top-0 z-40 bg-theme-bg/90 backdrop-blur-2xl border-b border-theme-border/30">
                    <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-5">
                        <div className="flex items-center justify-between">
                            {/* Left: Exit + Title */}
                            <div className="flex items-center gap-4">
                                {onExit && (
                                    <button 
                                        onClick={onExit}
                                        className="p-3 rounded-2xl bg-theme-surface/80 border border-theme-border/50 hover:border-theme-primary/50 text-theme-muted hover:text-theme-primary transition-all duration-300 shadow-sm hover:shadow-theme-primary/10"
                                        title="Exit to Dashboard"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <div className="flex items-center gap-3.5">
                                    <div className="relative">
                                        <div className="p-3 bg-gradient-to-br from-theme-primary/15 to-theme-primary/5 rounded-xl border border-theme-primary/20">
                                            <Eye className="w-6 h-6 text-theme-primary" />
                                        </div>
                                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-theme-primary rounded-full animate-pulse shadow-sm shadow-theme-primary/40" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-theme-text leading-none">
                                            Samvada Lens
                                        </h1>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-theme-muted mt-0.5">
                                            Cognitive Intelligence Engine
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Tab Switcher */}
                            <div className="hidden md:flex gap-1.5 p-1.5 bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 rounded-2xl shadow-sm">
                                {[
                                    { id: 'syllabus', label: 'NCC Syllabus', icon: Shield },
                                    { id: 'upload', label: 'Doc Scanner', icon: ImageIcon }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveInput(tab.id); setError(null); }}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 transition-all duration-300 ${
                                            activeInput === tab.id 
                                            ? 'bg-theme-primary text-theme-bg shadow-lg shadow-theme-primary/25' 
                                            : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg/80'
                                        }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" /> 
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Tab Switcher */}
                        <div className="flex md:hidden gap-1.5 p-1.5 bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 rounded-2xl shadow-sm mt-4">
                            {[
                                { id: 'syllabus', label: 'NCC Syllabus', icon: Shield },
                                { id: 'upload', label: 'Doc Scanner', icon: ImageIcon }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveInput(tab.id); setError(null); }}
                                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all duration-300 ${
                                        activeInput === tab.id 
                                        ? 'bg-theme-primary text-theme-bg shadow-lg shadow-theme-primary/25' 
                                        : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg/80'
                                    }`}
                                >
                                    <tab.icon className="w-3.5 h-3.5" /> 
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ═══ CONTENT AREA ═══ */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-8 space-y-6">
                        
                        {/* ═══ ERROR ═══ */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-fade-in">
                                <div className="p-2 bg-red-500/20 rounded-xl shrink-0">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                </div>
                                <p className="text-red-400 font-bold text-sm flex-1">{error}</p>
                                <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        )}

                        {/* SYLLABUS TAB */}
                        {activeInput === 'syllabus' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Search */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <div className="relative">
                                        <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-theme-primary transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="Search chapters, topics, keywords..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-12 py-4 bg-theme-surface/80 backdrop-blur-xl border border-theme-border/50 rounded-2xl text-theme-text font-bold focus:border-theme-primary/50 focus:outline-none focus:bg-theme-surface transition-all placeholder:text-theme-muted/60 shadow-sm text-sm"
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-theme-bg rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4 text-theme-muted" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Results count */}
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted px-1">
                                    {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''} available
                                </p>

                                {/* Chapter Grid — symmetric 2-col on tablet, 3-col on desktop */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                    {filteredChapters.map((chapter, index) => (
                                        <button 
                                            key={chapter.id}
                                            onClick={() => handleSyllabusSelect(chapter)}
                                            className="group relative text-left p-6 rounded-[20px] bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 hover:border-theme-primary/40 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-theme-primary/5 overflow-hidden flex flex-col justify-between min-h-[180px]"
                                            style={{ animationDelay: `${index * 40}ms` }}
                                        >
                                            {/* Hover glow */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]" />
                                            
                                            <div className="relative z-10 flex flex-col h-full">
                                                {/* Top: Badge + Title */}
                                                <div>
                                                    {/* Chapter number badge */}
                                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-theme-primary/10 border border-theme-primary/15 mb-4">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-primary">
                                                            Ch {chapter.chapterNumber}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-sm font-black uppercase tracking-wide text-theme-text mb-1.5 line-clamp-2 leading-snug group-hover:text-theme-primary transition-colors">
                                                        {chapter.chapterName}
                                                    </h3>
                                                    <p className="text-xs font-medium text-theme-muted line-clamp-1 leading-relaxed">
                                                        {chapter.topicName}
                                                    </p>
                                                </div>

                                                {/* Bottom: Tags + Arrow */}
                                                <div className="flex items-center justify-between mt-auto pt-5">
                                                    <div className="flex items-center gap-1.5 text-theme-muted/60">
                                                        <FileText className="w-3 h-3" />
                                                        <span className="text-[8px] font-bold uppercase tracking-widest">Notes · Flashcards · Quiz</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-theme-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {filteredChapters.length === 0 && (
                                    <div className="text-center py-20">
                                        <Search className="w-12 h-12 text-theme-muted/30 mx-auto mb-4" />
                                        <p className="text-theme-muted font-bold">No chapters match "{searchQuery}"</p>
                                        <p className="text-theme-muted/60 text-sm mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* UPLOAD TAB */}
                        {activeInput === 'upload' && (
                            <div className="max-w-2xl mx-auto animate-fade-in">
                                <div className="relative p-8 md:p-10 rounded-[28px] bg-theme-surface/60 backdrop-blur-xl border border-theme-border/40 shadow-2xl overflow-hidden">
                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-theme-primary/[0.06] to-transparent rounded-bl-[80px]" />

                                    <div className="relative z-10">
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-primary/10 border border-theme-primary/15 mb-4">
                                                <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-primary">AI-Powered Analysis</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-theme-text uppercase tracking-wider mb-2">Scan Documents & Notes</h2>
                                            <p className="text-sm text-theme-muted leading-relaxed max-w-md mx-auto">
                                                Upload PDFs or photos of handwritten notes. Samvada Lens will extract, structure, and transform them into a complete study system.
                                            </p>
                                        </div>
                                        
                                        {/* Drop Zone */}
                                        <div 
                                            onClick={() => !isLoading && fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            className={`relative border-2 border-dashed rounded-[20px] p-10 md:p-14 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                                                isDragging
                                                    ? 'border-theme-primary bg-theme-primary/10 scale-[1.02]'
                                                    : file 
                                                        ? 'border-theme-primary/40 bg-theme-primary/5' 
                                                        : 'border-theme-border/50 hover:border-theme-primary/30 hover:bg-theme-bg/50'
                                            }`}
                                        >
                                            {file ? (
                                                <div className="text-center space-y-4">
                                                    <div className="relative inline-block">
                                                        <div className="p-5 bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 rounded-2xl border border-theme-primary/20">
                                                            {file.type === 'application/pdf' 
                                                                ? <FileText className="w-10 h-10 text-theme-primary" /> 
                                                                : <ImageIcon className="w-10 h-10 text-theme-primary" />
                                                            }
                                                        </div>
                                                        <div className="absolute -top-2 -right-2 p-1 bg-emerald-500 rounded-full">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-theme-text text-lg truncate max-w-[280px]">{file.name}</p>
                                                        <p className="text-sm text-theme-muted font-medium mt-1">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type === 'application/pdf' ? 'PDF Document' : 'Image'}
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Click to change file</p>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-5">
                                                    <div className="w-20 h-20 rounded-2xl bg-theme-bg/80 border border-theme-border/50 flex items-center justify-center mx-auto">
                                                        <Upload className="w-9 h-9 text-theme-muted" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-theme-text text-lg">
                                                            {isDragging ? 'Drop your file here' : 'Click or drag to upload'}
                                                        </p>
                                                        <p className="text-sm text-theme-muted mt-2 font-medium">
                                                            Supports <span className="text-theme-text/80">PDF, JPG, PNG, WEBP</span> · Max 15MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" />
                                        </div>

                                        {/* Action Buttons */}
                                        {file && (
                                            <div className="mt-6 flex gap-3">
                                                <button 
                                                    onClick={() => setFile(null)} 
                                                    className="px-5 py-4 rounded-2xl border border-theme-border/50 font-bold text-theme-muted hover:bg-theme-bg hover:border-theme-border transition-all w-1/3 text-sm"
                                                >
                                                    Clear
                                                </button>
                                                <button 
                                                    onClick={handleUploadProcess} 
                                                    className="group relative px-6 py-4 rounded-2xl bg-theme-primary text-theme-bg font-black uppercase tracking-wider w-2/3 shadow-lg shadow-theme-primary/20 hover:shadow-theme-primary/30 transition-all overflow-hidden text-sm"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        <Eye className="w-4 h-4" />
                                                        Begin Ingestion
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Feature tags */}
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                                    {['Handwriting Recognition', 'PDF Parsing', 'Multi-page Support', 'Auto-flashcard Generation'].map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-theme-surface/60 border border-theme-border/30 text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuremIngestion;
