import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Mic, Play, Pause, SkipBack, SkipForward, Radio, Volume2,
    FileText, Upload, Loader2, Check, Copy, X, ChevronRight,
    Layers, Sparkles, MessageSquare, Bot, User, FilePlus, Crown
} from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import * as pdfjsLib from 'pdfjs-dist';
import { PODCAST_API_URL, TTS_API_URL, useRetryableFetch } from '../utils/api';
import { auth } from '../firebase';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs';

// Duration slots in minutes
const DURATION_SLOTS = [
    { value: 7, label: '7 min', desc: 'Quick Recap', icon: '⚡' },
    { value: 15, label: '15 min', desc: 'Standard', icon: '🎯' },
    { value: 30, label: '30 min', desc: 'Deep Dive', icon: '🔬' },
    { value: 45, label: '45 min', desc: 'Masterclass', icon: '🧠' }
];

const PodcastGenerator = () => {
    const { isDark } = useTheme();
    const { retryableFetch } = useRetryableFetch();
    const { canUseFeature, incrementUsage, triggerUpgradeModal, isPro, getRemainingUses } = useSubscription();

    // --- State ---
    const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'syllabus'
    const [selectedDuration, setSelectedDuration] = useState(7);

    // Upload Mode State
    const [documentContent, setDocumentContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [topics, setTopics] = useState('');
    const [pdfImages, setPdfImages] = useState([]);

    // Syllabus Mode State
    const [syllabus, setSyllabus] = useState({
        subject: '',
        topic: '',
        level: 'University'
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [podcastScript, setPodcastScript] = useState([]); // [{speaker, text}]

    // Audio playback state (Sarvam TTS)
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [isPlaybackFinished, setIsPlaybackFinished] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [ttsProgress, setTtsProgress] = useState('');
    const [volume, setVolume] = useState(1.0);

    const fileInputRef = useRef(null);
    const audioRef = useRef(null);
    const isPlayingRef = useRef(false);
    const transcriptRef = useRef(null);
    const audioCache = useRef({}); // Cache TTS audio to avoid re-requests

    // Keep ref in sync
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Auto-scroll transcript to current line
    useEffect(() => {
        if (currentLineIndex >= 0 && transcriptRef.current) {
            const activeEl = transcriptRef.current.querySelector(`[data-line-idx="${currentLineIndex}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentLineIndex]);

    // --- File Handling ---
    const convertPdfToImages = async (arrayBuffer, maxPages = 5) => {
        try {
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const images = [];
            const pagesToRender = Math.min(pdf.numPages, maxPages);
            for (let i = 1; i <= pagesToRender; i++) {
                const page = await pdf.getPage(i);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
                images.push({ pageNum: i, data: base64, mimeType: 'image/jpeg' });
            }
            return images;
        } catch (err) {
            console.error("PDF to image conversion error:", err);
            return [];
        }
    };

    const extractPdfTextPreview = async (arrayBuffer) => {
        try {
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            let totalChars = 0;
            const pagesToRead = Math.min(pdf.numPages, 10);
            for (let i = 1; i <= pagesToRead; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
                totalChars += pageText.replace(/\s/g, '').length;
            }
            return { text: fullText.trim(), charCount: totalChars, totalPages: pdf.numPages };
        } catch (err) {
            console.error("PDF extraction error:", err);
            return { text: '', charCount: 0, totalPages: 0 };
        }
    };

    const processFile = async (file) => {
        if (!file) return;
        setIsPdfLoading(true);
        setPdfImages([]);
        try {
            let content = '';
            let pdfPageImages = [];
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const arrayBufferForText = arrayBuffer.slice(0);
                const arrayBufferForImages = arrayBuffer.slice(0);
                const { text, charCount, totalPages } = await extractPdfTextPreview(arrayBufferForText);
                const avgCharsPerPage = charCount / Math.max(totalPages, 1);
                const isLikelyHandwritten = avgCharsPerPage < 100;
                if (isLikelyHandwritten) {
                    pdfPageImages = await convertPdfToImages(arrayBufferForImages, 5);
                    content = `[Handwritten PDF - ${pdfPageImages.length} pages ready for vision analysis]`;
                } else {
                    content = text || '';
                }
            } else {
                content = await file.text();
            }
            setFileName(file.name);
            setDocumentContent(content);
            setPdfImages(pdfPageImages);
            setPodcastScript([]);
            setCurrentLineIndex(-1);
            setIsPlaybackFinished(false);
            audioCache.current = {};
        } catch (error) {
            console.error('File processing error:', error);
            alert('Failed to process file');
        } finally {
            setIsPdfLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // --- Podcast Generation ---
    const handleGeneratePodcast = async () => {
        if (activeMode === 'upload' && !documentContent) return alert("Please upload a document first.");
        if (activeMode === 'syllabus' && (!syllabus.topic || !syllabus.subject)) return alert("Please enter both a subject and a topic.");

        if (!canUseFeature('podcast')) {
            triggerUpgradeModal('podcast');
            return;
        }

        setIsGenerating(true);
        setPodcastScript([]);
        audioCache.current = {};

        try {
            const imageUrls = pdfImages.length > 0
                ? pdfImages.map(img => `data:${img.mimeType};base64,${img.data}`)
                : null;

            const response = await retryableFetch(PODCAST_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: activeMode,
                    provider: 'groq',
                    tier: isPro ? 'pro' : 'basic',
                    duration: selectedDuration,
                    content: activeMode === 'upload' ? documentContent.slice(0, 8000) : null,
                    topics: activeMode === 'upload' ? topics : null,
                    syllabus: activeMode === 'syllabus' ? syllabus : null,
                    images: imageUrls
                })
            });

            if (response.script) {
                setPodcastScript(response.script);
                setCurrentLineIndex(-1);
                setIsPlaybackFinished(false);
                incrementUsage('podcast');
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (error) {
            const msg = error.message || "Unknown error";
            alert(`Failed to generate podcast: ${msg}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Sarvam TTS Audio Playback ---
    const getAuthHeaders = async () => {
        const headers = { 'Content-Type': 'application/json' };
        if (auth.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken();
                headers['Authorization'] = `Bearer ${token}`;
            } catch (e) { /* ignore */ }
        }
        return headers;
    };

    const fetchTTSAudio = async (text, speaker) => {
        const cacheKey = `${speaker}_${text.substring(0, 50)}`;
        if (audioCache.current[cacheKey]) {
            return audioCache.current[cacheKey];
        }

        const headers = await getAuthHeaders();
        const response = await fetch(TTS_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                text: text,
                speaker: speaker.toLowerCase()
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `TTS Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Convert base64 to audio blob URL
        let audioUrl;
        if (data.isMultiChunk && Array.isArray(data.audioBase64)) {
            // Multiple chunks — concatenate by playing sequentially
            // For simplicity, use the first chunk (handles 95% of cases)
            audioUrl = `data:audio/wav;base64,${data.audioBase64[0]}`;
        } else {
            audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        }

        audioCache.current[cacheKey] = audioUrl;
        return audioUrl;
    };

    const playLine = useCallback(async (index) => {
        if (index >= podcastScript.length) {
            setIsPlaybackFinished(true);
            setIsPlaying(false);
            setIsLoadingAudio(false);
            setTtsProgress('');
            return;
        }

        if (!isPlayingRef.current) return;

        setCurrentLineIndex(index);
        setIsLoadingAudio(true);
        
        const line = podcastScript[index];
        setTtsProgress(`Generating voice for ${line.speaker}...`);

        try {
            const audioUrl = await fetchTTSAudio(line.text, line.speaker);
            
            if (!isPlayingRef.current) return; // User may have paused while loading

            setIsLoadingAudio(false);
            setTtsProgress('');

            // Stop previous audio before starting new one
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.onended = null;
                audioRef.current.onerror = null;
            }

            // Create and play audio
            const audio = new Audio(audioUrl);
            audio.volume = volume;
            audioRef.current = audio;

            audio.onended = () => {
                if (isPlayingRef.current) {
                    playLine(index + 1);
                }
            };

            audio.onerror = (e) => {
                console.error('[TTS] Audio playback error:', e);
                setIsLoadingAudio(false);
                // Try next line on error
                if (isPlayingRef.current) {
                    setTimeout(() => playLine(index + 1), 500);
                }
            };

            await audio.play();
        } catch (error) {
            console.error('[TTS] Fetch error:', error);
            setIsLoadingAudio(false);
            setTtsProgress('');
            // Skip to next line on failure
            if (isPlayingRef.current) {
                setTimeout(() => playLine(index + 1), 500);
            }
        }
    }, [podcastScript, volume]);

    const togglePlayback = () => {
        if (isPlaying) {
            // PAUSE
            setIsPlaying(false);
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        } else {
            // PLAY
            setIsPlaying(true);
            setIsPlaybackFinished(false);

            if (audioRef.current && audioRef.current.paused && audioRef.current.currentTime > 0) {
                audioRef.current.play();
            } else {
                playLine(currentLineIndex === -1 ? 0 : currentLineIndex);
            }
        }
    };

    const stopPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
        setCurrentLineIndex(-1);
        setIsLoadingAudio(false);
        setTtsProgress('');
    };

    const skipToLine = (idx) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setCurrentLineIndex(idx);
        if (isPlaying) {
            playLine(idx);
        }
    };

    // Progress percentage
    const progress = podcastScript.length > 0 ? ((currentLineIndex + 1) / podcastScript.length) * 100 : 0;

    return (
        <div className={`h-full bg-theme-bg text-theme-text font-sans transition-colors duration-300 overflow-y-auto custom-scrollbar`}>

            {/* Header */}
            <div className={`px-6 py-5 flex items-center justify-between z-30 glass-3d-elevated border-b rounded-b-3xl mx-4 mt-4
                bg-theme-surface border-theme-border shadow-md
            `}>
                <div className="flex items-center gap-4 group cursor-default">
                    <div className={`p-3 rounded-2xl bg-theme-bg shadow-xl shadow-[var(--theme-primary)]/20 border border-theme-border group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                        <Radio className="w-6 h-6 text-theme-primary animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-black bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent uppercase tracking-tightest">
                                Audio Studio
                            </h1>
                            <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-[10px] font-black uppercase tracking-widest border border-theme-primary/20 shadow-[0_0_10px_var(--theme-primary)]">Sarvam AI</span>
                        </div>
                        <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.3em] mt-0.5">Neural Voice Podcast Engine</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">

                {/* Left Sidebar: Controls & Input */}
                <div className="lg:col-span-4 space-y-6 animate-enter opacity-0 delay-100 fill-mode-forwards" style={{ animationFillMode: 'forwards' }}>

                    {/* Mode Selection Tabs */}
                    <div className="flex gap-2 p-1 rounded-2xl bg-theme-surface border border-theme-border backdrop-blur-sm">
                        <button
                            onClick={() => setActiveMode('upload')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300
                            ${activeMode === 'upload'
                                    ? 'bg-theme-primary text-theme-bg shadow-[0_0_15px_var(--theme-primary)] scale-[1.02]'
                                    : 'text-theme-muted hover:bg-theme-bg'}
                        `}
                        >
                            <Upload className="w-4 h-4" /> Personal
                        </button>
                        <button
                            onClick={() => setActiveMode('syllabus')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300
                            ${activeMode === 'syllabus'
                                    ? 'bg-theme-primary text-theme-bg shadow-[0_0_15px_var(--theme-primary)] scale-[1.02]'
                                    : 'text-theme-muted hover:bg-theme-bg'}
                        `}
                        >
                            <Sparkles className="w-4 h-4" /> Syllabus
                        </button>
                    </div>

                    {/* Duration Selection */}
                    <div className={`p-4 rounded-3xl border bg-theme-surface border-theme-border`}>
                        <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Mic className="w-4 h-4" /> Podcast Duration
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {DURATION_SLOTS.map(slot => (
                                <button
                                    key={slot.value}
                                    onClick={() => setSelectedDuration(slot.value)}
                                    className={`p-3 rounded-xl text-center transition-all duration-300 border group
                                        ${selectedDuration === slot.value
                                            ? 'bg-theme-primary/10 border-theme-primary text-theme-primary shadow-[0_0_12px_var(--theme-primary)] scale-[1.03]'
                                            : 'border-theme-border hover:border-theme-primary/40 text-theme-muted hover:text-theme-text'}
                                    `}
                                >
                                    <span className="text-lg block mb-0.5">{slot.icon}</span>
                                    <span className="text-sm font-black block">{slot.label}</span>
                                    <span className="text-[9px] uppercase tracking-wider opacity-70">{slot.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tier Info */}
                    <div className={`p-4 rounded-3xl border flex items-center justify-between bg-theme-surface border-theme-border`}>
                        <div className="flex items-center gap-2">
                            {isPro ? (
                                <>
                                    <Crown className="w-4 h-4 text-theme-primary" />
                                    <span className="text-[10px] font-black text-theme-primary uppercase tracking-widest">PRO • All durations</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">BASIC</span>
                                    <span className="text-[10px] text-theme-primary font-bold">({getRemainingUses('podcast')} left today)</span>
                                </>
                            )}
                        </div>
                    </div>

                    {activeMode === 'upload' ? (
                        <>
                            {/* Upload Section */}
                            <div className={`p-6 rounded-3xl border bg-theme-surface border-theme-border shadow-sm`}>
                                <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Source Document
                                </h3>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={e => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); }}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300
                                    ${isDragging ? 'border-theme-primary bg-theme-primary/10' : 'border-theme-border bg-theme-bg hover:border-theme-primary'}
                                `}
                                >
                                    <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" onChange={e => processFile(e.target.files?.[0])} className="hidden" />
                                    {fileName ? (
                                        <div>
                                            <FilePlus className="w-8 h-8 mx-auto mb-2 text-theme-primary" />
                                            <p className="text-sm font-bold truncate px-2 text-theme-text">{fileName}</p>
                                            <p className="text-[10px] text-theme-muted mt-1">Click to change</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className={`w-8 h-8 mx-auto mb-2 ${isPdfLoading ? 'text-theme-primary animate-bounce' : 'text-theme-muted'}`} />
                                            <p className="text-sm font-bold text-theme-muted">{isPdfLoading ? 'Reading...' : 'Drop PDF or Text'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Topics Section */}
                            <div className={`p-6 rounded-3xl border bg-theme-surface border-theme-border shadow-sm`}>
                                <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Focal Points
                                </h3>
                                <textarea
                                    value={topics}
                                    onChange={e => setTopics(e.target.value)}
                                    placeholder="e.g., Focus on the methodology, or make it more humorous..."
                                    className={`w-full h-24 p-4 text-xs rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all
                                    bg-theme-bg text-theme-text placeholder-theme-muted border border-theme-border
                                `}
                                />
                            </div>
                        </>
                    ) : (
                        <div className={`p-6 rounded-3xl border space-y-4 bg-theme-surface border-theme-border shadow-sm`}>
                            <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Syllabus Details
                            </h3>

                            <div>
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] mb-2 block">Subject</label>
                                <input
                                    type="text"
                                    value={syllabus.subject}
                                    onChange={e => setSyllabus({ ...syllabus, subject: e.target.value })}
                                    placeholder="e.g., Biology, Economics..."
                                    className={`w-full p-4 rounded-xl text-xs focus:ring-2 focus:ring-theme-primary outline-none transition-all
                                    bg-theme-bg text-theme-text border border-theme-border
                                `}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] mb-2 block">Topic Name</label>
                                <input
                                    type="text"
                                    value={syllabus.topic}
                                    onChange={e => setSyllabus({ ...syllabus, topic: e.target.value })}
                                    placeholder="e.g., Mitochondrial DNA, Inflation..."
                                    className={`w-full p-4 rounded-xl text-xs focus:ring-2 focus:ring-theme-primary outline-none transition-all
                                    bg-theme-bg text-theme-text border border-theme-border
                                `}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] mb-2 block">Education Level</label>
                                <select
                                    value={syllabus.level}
                                    onChange={e => setSyllabus({ ...syllabus, level: e.target.value })}
                                    className={`w-full p-4 rounded-xl text-xs focus:ring-2 focus:ring-theme-primary outline-none transition-all appearance-none
                                    bg-theme-bg text-theme-text border border-theme-border
                                `}
                                >
                                    <option>High School</option>
                                    <option>University</option>
                                    <option>Post Graduate</option>
                                    <option>Expert/Professional</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGeneratePodcast}
                        disabled={isGenerating || (activeMode === 'upload' ? !documentContent : (!syllabus.topic || !syllabus.subject))}
                        className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 group
                        ${isGenerating || (activeMode === 'upload' ? !documentContent : (!syllabus.topic || !syllabus.subject))
                                ? 'bg-theme-surface border border-theme-border text-theme-muted cursor-not-allowed opacity-50'
                                : 'bg-theme-primary text-theme-bg shadow-[0_0_20px_var(--theme-primary)] hover:scale-[1.02] opacity-90 hover:opacity-100'}
                    `}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Scripting {selectedDuration}-min Podcast...
                            </>
                        ) : (
                            <>
                                <Mic className="w-5 h-5 group-hover:animate-bounce" />
                                Generate {selectedDuration}-min Podcast
                            </>
                        )}
                    </button>

                </div>

                {/* Right: Studio Player & Transcript */}
                <div className="lg:col-span-8 animate-enter opacity-0 delay-200 fill-mode-forwards" style={{ animationFillMode: 'forwards' }}>

                    {/* Player UI */}
                    <div className={`p-10 rounded-[56px] glass-3d-elevated relative overflow-hidden transition-all duration-700
                    bg-theme-surface border border-theme-border shadow-2xl
                `}>
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-theme-primary to-transparent animate-pulse opacity-50" />

                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-6">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all duration-500
                                ${isPlaying
                                        ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg animate-pulse shadow-[0_0_15px_var(--theme-primary)]'
                                        : 'bg-theme-bg text-theme-muted border border-theme-border'}
                            `}>
                                    {isPlaying ? (isLoadingAudio ? 'Loading Voice...' : 'Transmitting') : (isPlaybackFinished ? 'Complete' : 'Standby')}
                                </div>
                                <div className="text-[10px] font-black text-theme-muted uppercase tracking-[0.3em]">
                                    {podcastScript.length > 0 ? `${podcastScript.length} Segments • ${selectedDuration} min` : 'Empty Buffer'}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isLoadingAudio && <Loader2 className="w-5 h-5 text-theme-primary animate-spin" />}
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <span className={`w-3 h-3 rounded-full transition-all duration-300 ${isPlaying ? 'bg-theme-secondary shadow-[0_0_15px_var(--theme-secondary)] scale-110' : 'bg-theme-bg border border-theme-border'}`}></span>
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest group-hover:text-theme-primary transition-colors">SARVAM AI</span>
                                </div>
                            </div>
                        </div>

                        {/* TTS Progress Text */}
                        {ttsProgress && (
                            <div className="text-center mb-4">
                                <span className="text-[11px] font-bold text-theme-primary animate-pulse">{ttsProgress}</span>
                            </div>
                        )}

                        {/* Script / Transcript — Unified Conversation View */}
                        <div ref={transcriptRef} className={`h-[400px] mb-8 transition-opacity duration-500 overflow-y-auto custom-scrollbar ${isGenerating ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            {podcastScript.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-12">
                                    <div className={`p-6 rounded-full mb-6 bg-theme-bg border border-theme-border`}>
                                        <Mic className="w-12 h-12 text-theme-muted" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-theme-text">Ready for Recording</h4>
                                    <p className="text-sm text-theme-muted">Choose a duration, upload a resource or enter a topic, and generate your AI-hosted deep dive podcast.</p>
                                    <div className="mt-6 flex items-center gap-4 text-[10px] text-theme-muted uppercase tracking-wider font-bold">
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-primary/60"></span> Questioner</span>
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-secondary/60"></span> Explainer</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 p-2">
                                    {podcastScript.map((line, idx) => {
                                        const isQuestioner = line.speaker === 'Questioner';
                                        const isActive = currentLineIndex === idx;
                                        
                                        return (
                                            <div
                                                key={idx}
                                                data-line-idx={idx}
                                                onClick={() => skipToLine(idx)}
                                                className={`flex gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-400
                                                    ${isActive
                                                        ? `border ${isQuestioner ? 'border-theme-primary/50 bg-theme-primary/5 shadow-[0_0_15px_var(--theme-primary)]' : 'border-theme-secondary/50 bg-theme-secondary/5 shadow-[0_0_15px_var(--theme-secondary)]'}`
                                                        : `border border-transparent hover:bg-theme-bg/50 ${idx < currentLineIndex ? 'opacity-50' : 'opacity-80 hover:opacity-100'}`
                                                    }
                                                `}
                                            >
                                                {/* Speaker Avatar */}
                                                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-theme-bg shadow-lg transition-all duration-300
                                                    ${isQuestioner
                                                        ? `bg-theme-primary ${isActive ? 'shadow-[0_0_12px_var(--theme-primary)] scale-110' : 'opacity-80'}`
                                                        : `bg-theme-secondary ${isActive ? 'shadow-[0_0_12px_var(--theme-secondary)] scale-110' : 'opacity-80'}`
                                                    }
                                                `}>
                                                    {isQuestioner ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isQuestioner ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                                                            {line.speaker}
                                                        </span>
                                                        {isActive && isPlaying && (
                                                            <span className="flex gap-0.5">
                                                                {[0,1,2].map(i => (
                                                                    <span key={i} className={`w-1 rounded-full ${isQuestioner ? 'bg-theme-primary' : 'bg-theme-secondary'}`}
                                                                        style={{ height: `${6 + Math.random() * 8}px`, animation: `wave 0.8s ease-in-out infinite ${i * 0.15}s` }}
                                                                    />
                                                                ))}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs leading-relaxed ${isActive ? 'text-theme-text font-medium' : 'text-theme-muted'}`}>
                                                        {line.text}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {podcastScript.length > 0 && (
                            <div className="mb-6 px-2">
                                <div className="relative h-1.5 w-full bg-theme-border rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-theme-muted mt-1.5 px-0.5">
                                    <span>{currentLineIndex + 1} / {podcastScript.length}</span>
                                    <span>{selectedDuration} min</span>
                                </div>
                            </div>
                        )}

                        {/* Controls Bar */}
                        <div className={`p-6 rounded-3xl border flex items-center justify-between bg-theme-bg border-theme-border shadow-inner`}>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={stopPlayback}
                                    className="p-3 rounded-full hover:bg-theme-surface border border-transparent hover:border-theme-border text-theme-muted hover:text-theme-text transition-colors"
                                    title="Reset"
                                >
                                    <SkipBack className="w-5 h-5 fill-current" />
                                </button>

                                <button
                                    onClick={togglePlayback}
                                    disabled={podcastScript.length === 0}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
                                    ${podcastScript.length === 0
                                            ? 'bg-theme-surface border border-theme-border text-theme-muted'
                                            : 'bg-theme-primary text-theme-bg hover:scale-110 active:scale-95 shadow-[0_0_20px_var(--theme-primary)]'}
                                `}
                                >
                                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                                </button>
                            </div>

                            {/* Waveform Visualization */}
                            <div className="hidden md:flex flex-1 mx-12 items-center gap-[3px] h-8">
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-[3px] rounded-full transition-all duration-300 ${isPlaying && !isLoadingAudio ? 'bg-theme-primary/60' : 'bg-theme-border'}`}
                                        style={{
                                            height: isPlaying && !isLoadingAudio ? `${Math.random() * 100}%` : '4px',
                                            animation: isPlaying && !isLoadingAudio ? `wave 1s ease-in-out infinite ${i * 0.05}s` : 'none'
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-theme-muted" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={e => {
                                        const v = parseFloat(e.target.value);
                                        setVolume(v);
                                        if (audioRef.current) audioRef.current.volume = v;
                                    }}
                                    className="w-20 h-1 accent-theme-primary"
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes wave {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#374151' : '#E5E7EB'};
                    border-radius: 10px;
                }
            `}</style>
        </div >
    );
};

export default PodcastGenerator;
