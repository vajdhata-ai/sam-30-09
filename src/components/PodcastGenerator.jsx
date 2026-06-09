import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Mic, Play, Pause, SkipBack, SkipForward, Radio, Volume2,
    FileText, Upload, Loader2, Check, Copy, X, ChevronRight,
    Layers, Sparkles, MessageSquare, Bot, User, FilePlus, Crown, Lock
} from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { usePodcast } from '../contexts/PodcastContext';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useRetryableFetch } from '../utils/api';
import { callAI as callGroq } from '../utils/apiRouter';
import RagService from '../utils/ragService';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Voice configs for podcast speakers
const SPEAKER_VOICES = {
    host: { speaker: 'meera', pace: 1.0, temperature: 0.5 },
    expert: { speaker: 'anand', pace: 1.0, temperature: 0.5 },
    default: { speaker: 'meera', pace: 1.0, temperature: 0.5 }
};

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
    const { globalInstructions } = useUserPreferences();
    const podcast = usePodcast();

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
        level: 'University',
        studentClass: '' // for high school
    });

    const [isGenerating, setIsGenerating] = useState(false);

    // Use PodcastContext for persistent playback state
    const podcastScript = podcast.podcastScript;
    const isPlaying = podcast.isPlaying;
    const currentLineIndex = podcast.currentLineIndex;
    const isPlaybackFinished = podcast.isFinished;
    const isLoadingAudio = podcast.isLoadingAudio;
    const ttsProgress = podcast.ttsProgress;

    const [volume, setVolume] = useState(1.0);

    const fileInputRef = useRef(null);
    const transcriptRef = useRef(null);

    // Auto-scroll transcript to current line
    useEffect(() => {
        if (podcast.currentLineIndex >= 0 && transcriptRef.current) {
            const activeEl = transcriptRef.current.querySelector(`[data-line-idx="${podcast.currentLineIndex}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [podcast.currentLineIndex]);

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
            podcast.resetPodcast();
        } catch (error) {
            console.error('File processing error:', error);
            alert('Failed to process file');
        } finally {
            setIsPdfLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // --- Podcast Generation ---
    // Word count formula: 150 words per minute of natural speech
    const getWordCount = (duration) => duration * 150;
    const getMinSegments = (duration) => {
        if (duration <= 7) return 14;
        if (duration <= 15) return 28;
        if (duration <= 30) return 55;
        return 70;
    };

    const handleGeneratePodcast = async () => {
        if (activeMode === 'upload' && !documentContent) return alert("Please upload a document first.");
        if (activeMode === 'syllabus' && (!syllabus.topic || !syllabus.subject)) return alert("Please enter both a subject and a topic.");

        if (!canUseFeature('podcast')) {
            triggerUpgradeModal('podcast');
            return;
        }

        setIsGenerating(true);

        try {
            const targetWords = getWordCount(selectedDuration);
            const minSegments = getMinSegments(selectedDuration);

            const systemPrompt = `You are an expert educational podcast scriptwriter.
Create an engaging, 2-person podcast script that is EXACTLY ${selectedDuration} minutes long when read aloud.

Speakers:
1. "Host": A curious, enthusiastic host named Ria (female voice) who asks insightful questions, responds with genuine interest, and guides the conversation naturally.
2. "Expert": An expert named Kabir (male voice) who gives clear, deep, thorough, and intuitive explanations. Uses analogies, real-world examples, and builds complexity gradually.

CRITICAL REQUIREMENTS:
- Total word count MUST be approximately ${targetWords} words (150 words = 1 minute of speech).
- MINIMUM ${minSegments} dialogue segments (alternating speakers).
- Each segment should be 40-120 words — long enough to say something meaningful, short enough for natural conversation.
- The Expert's responses should be substantive and educational, NOT one-liners.
- The Host should ask follow-up questions, express curiosity, and sometimes summarize what was said.
- Include a proper introduction and conclusion where they refer to each other by name (Ria and Kabir).
- Make it feel like a REAL podcast conversation, not a Q&A list.

Return the script EXACTLY as a JSON array of objects. No markdown, no backticks, just raw JSON:
[
  {"speaker": "Host", "text": "Welcome to the podcast! Today we are diving deep into..."},
  {"speaker": "Expert", "text": "That's right Ria, and it's a fascinating topic because..."}
]

${globalInstructions ? `\nGLOBAL CUSTOM INSTRUCTIONS FOR EXPERT (PRIORITIZE THESE):\n${globalInstructions}` : ''}`;

            let userPrompt = "";
            if (activeMode === 'upload') {
                userPrompt = `Target duration: ${selectedDuration} minutes (approximately ${targetWords} words total, minimum ${minSegments} segments).
Focal points: ${topics || 'Cover the key concepts thoroughly'}
Source Material:
${documentContent.slice(0, 12000)}`;
            } else {
                userPrompt = `Target duration: ${selectedDuration} minutes (approximately ${targetWords} words total, minimum ${minSegments} segments).
Create a comprehensive podcast explaining this syllabus topic in great depth:
Subject: ${syllabus.subject}
Topic: ${syllabus.topic}
Level: ${syllabus.level}${syllabus.level === 'High School' && syllabus.studentClass ? ` (Class/Grade: ${syllabus.studentClass})` : ''}

Cover: key concepts, real-world applications, common misconceptions, exam-relevant details, and intuitive explanations tailored specifically to a ${syllabus.level}${syllabus.level === 'High School' && syllabus.studentClass ? ` ${syllabus.studentClass}` : ''} student's understanding level.`;
            }

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];
            const response = await callGroq(messages, null, false, { max_tokens: 8192 });

            const text = response.choices?.[0]?.message?.content || "";
            const scriptData = RagService.extractJson(text);

            if (scriptData && scriptData.length > 0) {
                // Load into PodcastContext for persistent playback
                const topicLabel = activeMode === 'upload' ? (fileName || 'Uploaded Document') : `${syllabus.subject}: ${syllabus.topic}`;
                podcast.loadPodcast(scriptData, topicLabel);
                incrementUsage('podcast');
            } else {
                throw new Error("Invalid response format from AI");
            }
        } catch (error) {
            const msg = error.message || "Unknown error";
            alert(`Failed to generate podcast: ${msg}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Playback is fully managed by PodcastContext — just delegate
    const togglePlayback = () => podcast.togglePlay();
    const stopPlayback = () => podcast.stopPodcast();
    const skipToLine = (idx) => podcast.jumpToLine(idx);

    // Progress percentage
    const progress = podcastScript.length > 0 ? ((currentLineIndex + 1) / podcastScript.length) * 100 : 0;

    // Estimated total words in generated script
    const totalWords = podcastScript.reduce((sum, line) => sum + (line.text?.split(/\s+/).length || 0), 0);
    const estMinutes = Math.round(totalWords / 150);

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

                    {/* Locked Syllabus Section */}
                    <div className={`p-6 rounded-3xl border space-y-4 bg-theme-surface border-theme-border shadow-sm`}>
                        <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> NCC Curriculum (Locked)
                        </h3>
                        <p className="text-xs text-theme-muted mb-4">
                            Official syllabus integration is pending. Chapters will be unlocked once the curated NCC syllabus is deployed.
                        </p>
                        
                        <div className="space-y-3">
                            {['Drill & Commands', 'Weapon Training', 'National Integration', 'Disaster Management', 'Social Service'].map((chapter, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-theme-bg border border-theme-border opacity-70 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-theme-surface flex items-center justify-center text-theme-muted font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-semibold text-theme-text">{chapter}</span>
                                    </div>
                                    <span className="text-theme-muted"><Lock className="w-4 h-4" /></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        disabled={true}
                        className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 group bg-theme-surface border border-theme-border text-theme-muted cursor-not-allowed opacity-50`}
                    >
                        <Lock className="w-5 h-5" />
                        Awaiting Curriculum
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
                                    {podcastScript.length > 0 ? `${podcastScript.length} Segments • ~${totalWords} words • ~${estMinutes || selectedDuration} min` : 'Empty Buffer'}
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
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-primary/60"></span> Host</span>
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-secondary/60"></span> Expert</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 p-2">
                                    {podcastScript.map((line, idx) => {
                                        const isActive = currentLineIndex === idx;
                                        const isHost = ['host', 'questioner'].includes(line.speaker?.toLowerCase());
                                        return (
                                            <div
                                                key={idx}
                                                data-line-idx={idx}
                                                className={`flex gap-4 p-4 rounded-2xl transition-all duration-500 cursor-pointer group
                                                    ${isActive ? 'bg-theme-bg shadow-sm scale-[1.02] -translate-y-1' : 'hover:bg-theme-bg/50'}
                                                `}
                                                onClick={() => skipToLine(idx)}
                                            >
                                                {/* Speaker Avatar */}
                                                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-theme-bg shadow-lg transition-all duration-300
                                                    ${isHost
                                                        ? `bg-theme-primary ${isActive ? 'shadow-[0_0_12px_var(--theme-primary)] scale-110' : 'opacity-80'}`
                                                        : `bg-theme-secondary ${isActive ? 'shadow-[0_0_12px_var(--theme-secondary)] scale-110' : 'opacity-80'}`
                                                    }
                                                `}>
                                                    {isHost ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isHost ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                                                            {isHost ? 'Ria (Host)' : 'Kabir (Expert)'}
                                                        </span>
                                                        {isActive && isPlaying && (
                                                            <span className="flex gap-0.5">
                                                                {[0, 1, 2].map(i => (
                                                                    <span key={i} className={`w-1 rounded-full ${isHost ? 'bg-theme-primary' : 'bg-theme-secondary'}`}
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
