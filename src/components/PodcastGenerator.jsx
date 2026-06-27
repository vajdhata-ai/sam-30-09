import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, Play, Pause, SkipBack, Radio, Volume2,
    Shield, Sparkles, User, Lock, Check
} from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePodcast } from '../contexts/PodcastContext';
import { nccSyllabusData } from '../data/nccSyllabusData';

const PodcastGenerator = () => {
    const { isDark } = useTheme();
    const { userProfile } = useAuth();
    const podcast = usePodcast();

    const userWing = userProfile?.wing || 'army';
    
    // Combine common subjects and wing-specific subjects
    const availableChapters = [
        ...(nccSyllabusData.common || []),
        ...(nccSyllabusData[userWing] || [])
    ].sort((a, b) => a.chapterNumber - b.chapterNumber);

    const [activeChapter, setActiveChapter] = useState(null);

    // Use PodcastContext for persistent playback state
    const podcastScript = podcast.podcastScript;
    const isPlaying = podcast.isPlaying;
    const currentLineIndex = podcast.currentLineIndex;
    const isPlaybackFinished = podcast.isFinished;
    const isLoadingAudio = podcast.isLoadingAudio;
    const ttsProgress = podcast.ttsProgress;

    const [volume, setVolume] = useState(1.0);
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

    const handleLoadPodcast = (chapter) => {
        setActiveChapter(chapter);
        if (chapter.podcastScript && chapter.podcastScript.length > 0) {
            podcast.loadPodcast(chapter.podcastScript, `${chapter.chapterName}`);
        } else {
            alert("No podcast script available for this chapter yet.");
        }
    };

    // Playback is fully managed by PodcastContext — just delegate
    const togglePlayback = () => podcast.togglePlay();
    const stopPlayback = () => podcast.stopPodcast();
    const skipToLine = (idx) => podcast.jumpToLine(idx);

    // Progress percentage
    const progress = podcastScript.length > 0 ? ((currentLineIndex + 1) / podcastScript.length) * 100 : 0;

    // Estimated total words in script
    const totalWords = podcastScript.reduce((sum, line) => sum + (line.text?.split(/\s+/).length || 0), 0);
    const estMinutes = Math.max(1, Math.round(totalWords / 150));

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
                            <h1 className="text-xl font-black uppercase tracking-widest text-theme-text">
                                Audio Studio
                            </h1>
                            <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-[10px] font-black uppercase tracking-widest border border-theme-primary/20">Curated By NCC</span>
                        </div>
                        <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.3em] mt-0.5">Pre-recorded Syllabus Podcasts</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">

                {/* Left Sidebar: Chapter Selection */}
                <div className="lg:col-span-4 space-y-6 animate-enter opacity-0 delay-100 fill-mode-forwards" style={{ animationFillMode: 'forwards' }}>
                    <div className={`p-6 rounded-3xl border space-y-4 bg-theme-surface border-theme-border shadow-sm`}>
                        <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Curriculum Episodes
                        </h3>
                        <p className="text-xs text-theme-muted mb-4 font-medium leading-relaxed">
                            Select an official chapter from your syllabus to listen to the curated discussion between our NCC experts.
                        </p>
                        
                        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {availableChapters.map((chapter) => {
                                const isSelected = activeChapter?.id === chapter.id;
                                const hasAudio = chapter.podcastScript && chapter.podcastScript.length > 0;
                                
                                return (
                                    <div 
                                        key={chapter.id} 
                                        onClick={() => hasAudio && handleLoadPodcast(chapter)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            isSelected 
                                                ? 'bg-theme-primary/10 border-theme-primary shadow-sm' 
                                                : hasAudio 
                                                    ? 'bg-theme-bg border-theme-border hover:border-theme-primary/50 cursor-pointer' 
                                                    : 'bg-theme-bg border-theme-border opacity-50 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                isSelected ? 'bg-theme-primary text-theme-bg' : 'bg-theme-surface text-theme-muted'
                                            }`}>
                                                {chapter.chapterNumber}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold truncate max-w-[160px] ${isSelected ? 'text-theme-primary' : 'text-theme-text'}`}>
                                                    {chapter.chapterName}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-theme-muted font-bold">
                                                    {chapter.wing === 'common' ? 'Common Subject' : `${userWing} Wing`}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-theme-primary" />}
                                        {!hasAudio && <Lock className="w-3 h-3 text-theme-muted" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
                                    {isPlaying ? (isLoadingAudio ? 'Loading Audio...' : 'Transmitting') : (isPlaybackFinished ? 'Complete' : 'Standby')}
                                </div>
                                <div className="text-[10px] font-black text-theme-muted uppercase tracking-[0.3em]">
                                    {podcastScript.length > 0 ? `${podcastScript.length} Segments • ~${estMinutes} min` : 'Select Episode'}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <span className={`w-3 h-3 rounded-full transition-all duration-300 ${isPlaying ? 'bg-theme-secondary shadow-[0_0_15px_var(--theme-secondary)] scale-110' : 'bg-theme-bg border border-theme-border'}`}></span>
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest group-hover:text-theme-primary transition-colors">SARVAM TTS</span>
                                </div>
                            </div>
                        </div>

                        {/* Transcript / Conversation View */}
                        <div ref={transcriptRef} className={`h-[400px] mb-8 transition-opacity duration-500 overflow-y-auto custom-scrollbar`}>
                            {podcastScript.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-12">
                                    <div className={`p-6 rounded-full mb-6 bg-theme-bg border border-theme-border`}>
                                        <Mic className="w-12 h-12 text-theme-muted" />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-widest mb-2 text-theme-text">Awaiting Selection</h4>
                                    <p className="text-sm font-bold text-theme-muted uppercase tracking-wider">Select a curriculum episode from the left panel to begin playback.</p>
                                    <div className="mt-8 flex items-center gap-4 text-[10px] text-theme-muted uppercase tracking-wider font-black">
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-primary"></span> Cadet Ria</span>
                                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-theme-secondary"></span> Instructor Kabir</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 p-2">
                                    {podcastScript.map((line, idx) => {
                                        const isActive = currentLineIndex === idx;
                                        const isHost = ['host', 'ria', 'cadet'].includes(line.speaker?.toLowerCase());
                                        return (
                                            <div
                                                key={idx}
                                                data-line-idx={idx}
                                                className={`flex gap-4 p-4 rounded-2xl transition-all duration-500 cursor-pointer group
                                                    ${isActive ? 'bg-theme-bg shadow-sm scale-[1.02] -translate-y-1 border border-theme-border/50' : 'hover:bg-theme-bg/50'}
                                                `}
                                                onClick={() => skipToLine(idx)}
                                            >
                                                {/* Speaker Avatar */}
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-theme-bg shadow-lg transition-all duration-300
                                                    ${isHost
                                                        ? `bg-theme-primary ${isActive ? 'shadow-[0_0_15px_var(--theme-primary)] scale-110' : 'opacity-80'}`
                                                        : `bg-theme-secondary ${isActive ? 'shadow-[0_0_15px_var(--theme-secondary)] scale-110' : 'opacity-80'}`
                                                    }
                                                `}>
                                                    {isHost ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                                </div>

                                                <div className="flex-1 min-w-0 mt-0.5">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isHost ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                                                            {isHost ? 'Cadet Ria' : 'Instructor Kabir'}
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
                                                    <p className={`text-[13px] leading-relaxed ${isActive ? 'text-theme-text font-semibold' : 'text-theme-muted font-medium'}`}>
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
                                    <span>~{estMinutes} min</span>
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
                                        setVolume(parseFloat(e.target.value));
                                        // Context handles internal volume for TTS
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
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#374151' : '#E5E7EB'};
                    border-radius: 10px;
                }
            `}</style>
        </div >
    );
};

export default PodcastGenerator;
