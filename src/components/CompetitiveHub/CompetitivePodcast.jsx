import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { callAI as callGroq } from '../../utils/apiRouter';
import { formatGroqPayload } from '../../utils/api';
import { auth } from '../../firebase';
import { usePodcast } from '../../contexts/PodcastContext';
import RagService from '../../utils/ragService';

/**
 * Competitive Hub Podcast — Premium full-screen audio player with Sarvam AI TTS.
 * Two speakers: Questioner (curious) & Explainer (teaches in-depth).
 */
const DURATION_OPTIONS = [
    { value: 7, label: '7 min', icon: '⚡' },
    { value: 15, label: '15 min', icon: '🎯' },
    { value: 30, label: '30 min', icon: '🔬' },
    { value: 45, label: '45 min', icon: '🧠' }
];

const CompetitivePodcast = ({ topicName, examSlug, onBack }) => {
    const { currentUser } = useAuth();

    
    // Global Podcast State
    const {
        podcastScript,
        topicName: activeTopicName,
        isPlaying,
        currentLineIndex,
        isLoadingAudio,
        isFinished,
        loadPodcast,
        togglePlay,
        jumpToLine
    } = usePodcast();

    const [selectedDuration, setSelectedDuration] = useState(15);
    const [generating, setGenerating] = useState(false);
    const [genProgress, setGenProgress] = useState('');

    const transcriptRef = React.useRef(null);

    // Auto-scroll
    React.useEffect(() => {
        if (currentLineIndex >= 0 && transcriptRef.current) {
            const el = transcriptRef.current.querySelector(`[data-idx="${currentLineIndex}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentLineIndex]);

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

    // --- Generate ---
    const handleGenerate = async () => {
        setGenerating(true);
        setGenProgress('Generating script...');

        try {
            const systemPrompt = `You are an expert educational podcast scriptwriter. 
Create an engaging, 2-person podcast script.
Speakers:
1. "Questioner": A curious, enthusiastic host asking great questions.
2. "Explainer": An expert teacher who gives clear, deep, and intuitive explanations.

Return the script EXACTLY as a JSON array of objects.
Format:
[
  {"speaker": "Questioner", "text": "Welcome to the podcast! Today we are talking about..."},
  {"speaker": "Explainer", "text": "That's right, and it's a fascinating topic because..."}
]
Do not wrap in markdown or backticks. Return raw JSON.`;

            const userPrompt = `Target duration: ${selectedDuration} minutes (generate ${selectedDuration * 15} words).
Create a comprehensive podcast explaining this competitive exam topic:
Subject/Exam: ${examSlug || 'General'}
Topic: ${topicName}
Make it highly engaging and suitable for a competitive exam student.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];
            const response = await callGroq(messages, null);

            const text = response.choices?.[0]?.message?.content || "";
            const scriptData = RagService.extractJson(text);
            
            if (scriptData && scriptData.length > 0) {
                // Pre-inform user
                setGenProgress('Rendering sarvam neural audio... (~3s)');
                
                // Mount to global context
                loadPodcast(scriptData, topicName);

                // Small UX delay to signify processing
                setTimeout(() => {
                    setGenerating(false);
                    setGenProgress('');
                }, 1000);
            } else {
                throw new Error('Failed to generate podcast script. AI returned invalid format.');
            }
        } catch (err) {
            console.error('[CompetitivePodcast] Generation error:', err);
            alert('Failed to generate podcast: ' + err.message);
            setGenerating(false);
            setGenProgress('');
        }
    };

    // If global topic doesn't match current prop, we show generation UI.
    const isViewingCurrentGlobal = podcastScript.length > 0 && activeTopicName === topicName;

    const progress = isViewingCurrentGlobal ? ((currentLineIndex + 1) / podcastScript.length) * 100 : 0;

    return (
        <div className="h-full flex flex-col bg-theme-bg relative overflow-hidden">
            {/* Immersive Audio Background */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between">
                <button onClick={onBack} className="w-12 h-12 rounded-full glass-input flex items-center justify-center text-theme-muted hover:text-indigo-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all group shadow-sm z-20">
                    <span className="group-hover:-translate-x-1 transition-transform font-bold text-xl">←</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner backdrop-blur-sm">
                        Sarvam Neural Voice
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 -mt-10 overflow-hidden">

                {!isViewingCurrentGlobal ? (
                    /* Pre-generation view */
                    <>
                        {/* Vinyl / Cover Art Container */}
                        <div className="relative mb-8 flex justify-center items-center w-full max-w-[260px] aspect-square">
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-2xl transition-opacity duration-1000 ${generating ? 'opacity-40 animate-pulse-slow' : 'opacity-10'}`} />
                            <div className={`w-full h-full relative rounded-full border-[8px] border-slate-900/5 dark:border-white/5 bg-slate-100 dark:bg-slate-800 shadow-2xl overflow-hidden transition-transform duration-1000 ease-out ${generating ? 'animate-[spin_10s_linear_infinite] scale-100' : 'scale-95'}`}>
                                <div className="absolute inset-0 rounded-full border-[30px] border-slate-900/10 dark:border-black/30" />
                                <div className="absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner flex items-center justify-center border-4 border-slate-900/20 dark:border-black/50">
                                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-900/20 shadow-inner z-10" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -rotate-45" />
                            </div>
                            {!generating && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <span className="text-5xl drop-shadow-xl">🎙️</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center max-w-lg mb-6 w-full">
                            <h2 className="text-2xl md:text-3xl font-black text-theme-text mb-2 tracking-tight">{topicName || 'Select a Topic'}</h2>
                            <p className="text-theme-muted font-bold text-xs uppercase tracking-widest">Questioner × Explainer Deep Dive</p>
                        </div>

                        {/* Duration Selector */}
                        <div className="flex gap-2 mb-6">
                            {DURATION_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedDuration(opt.value)}
                                    disabled={generating}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
                                        ${selectedDuration === opt.value
                                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                                            : 'border-slate-200 dark:border-slate-700 text-theme-muted hover:border-indigo-500/50'}
                                    `}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="w-full max-w-sm mt-2">
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group ${
                                    generating
                                        ? 'bg-slate-200 dark:bg-slate-800 text-theme-muted cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-pink-500/30 hover:scale-105 active:scale-95'
                                }`}
                            >
                                {generating ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="w-5 h-5 border-3 border-theme-muted/30 border-t-pink-500 rounded-full animate-spin" />
                                        {genProgress || 'Generating...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <span>🎧</span> Generate {selectedDuration}-min Lesson
                                    </span>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    /* Post-generation: Player + Transcript */
                    <div className="w-full max-w-2xl flex flex-col h-full">
                        
                        {/* Topic & Controls Header */}
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-theme-text mb-1">{topicName}</h2>
                            <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">
                                {isPlaying ? (isLoadingAudio ? '⏳ Loading voice...' : '🔊 Playing') : isFinished ? '✅ Complete' : '⏸ Paused'} 
                                {' • '}{currentLineIndex + 1}/{podcastScript.length} segments
                            </p>
                        </div>

                        {/* Transcript */}
                        <div ref={transcriptRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4 px-2 max-h-[50vh]">
                            {podcastScript.map((line, idx) => {
                                const isQ = line.speaker === 'Questioner';
                                const active = currentLineIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        data-idx={idx}
                                        className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                                            ${active
                                                ? `border ${isQ ? 'border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'border-purple-500/40 bg-purple-500/5 shadow-[0_0_12px_rgba(168,85,247,0.3)]'}`
                                                : `border border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${idx < currentLineIndex ? 'opacity-40' : 'opacity-75 hover:opacity-100'}`}
                                        `}
                                        onClick={() => {
                                            jumpToLine(idx);
                                        }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black
                                            ${isQ ? 'bg-indigo-500' : 'bg-purple-500'}
                                            ${active ? 'scale-110 shadow-lg' : 'opacity-70'}
                                        `}>
                                            {isQ ? 'Q' : 'E'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isQ ? 'text-indigo-500' : 'text-purple-500'}`}>
                                                {line.speaker}
                                            </span>
                                            <p className={`text-xs leading-relaxed mt-0.5 ${active ? 'text-theme-text font-medium' : 'text-theme-muted'}`}>
                                                {line.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4 px-2">
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={() => jumpToLine(0)}
                                className="text-2xl text-theme-muted hover:text-theme-text transition-colors w-12 h-12 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full active:scale-90"
                            >
                                ⏪
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white flex items-center justify-center shadow-xl shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 group relative"
                            >
                                <div className="absolute inset-0 rounded-full bg-pink-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                                <span className="text-3xl relative z-10">{isPlaying ? '⏸' : '▶️'}</span>
                            </button>

                            <button
                                onClick={() => jumpToLine(Math.min(currentLineIndex + 1, podcastScript.length - 1))}
                                className="text-2xl text-theme-muted hover:text-theme-text transition-colors w-12 h-12 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full active:scale-90"
                            >
                                ⏩
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.3); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default CompetitivePodcast;
