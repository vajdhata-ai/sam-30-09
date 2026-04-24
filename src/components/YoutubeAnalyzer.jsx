import React, { useState } from 'react';
import { Youtube, Link, Sparkles, FileText, ClipboardList, Loader2, AlertTriangle, ArrowRight, CheckCircle, Eye, ChevronRight } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { callAI as callGroq } from '../utils/apiRouter';

const SUPADATA_API_KEY = "sd_88d05e37fc02eeeeb74f00977b663a8c";

const YoutubeAnalyzer = () => {
    const { isDark } = useTheme();
    const { canUseFeature, triggerUpgradeModal, incrementUsage } = useSubscription();
    
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    const handleAnalyze = async () => {
        if (!url.trim()) {
            setError('Please enter a YouTube URL.');
            return;
        }

        // Basic YouTube URL validation
        const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!ytRegex.test(url)) {
            setError('Please enter a valid YouTube URL.');
            return;
        }

        if (!canUseFeature('youtube-analyzer')) {
            triggerUpgradeModal('youtube-analyzer');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            // 1. Fetch Transcript from Supadata
            const transcriptRes = await fetch(`https://api.supadata.ai/v1/youtube/transcript?url=${encodeURIComponent(url)}&text=true`, {
                method: 'GET',
                headers: {
                    'x-api-key': SUPADATA_API_KEY
                }
            });

            if (!transcriptRes.ok) {
                const errData = await transcriptRes.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to fetch transcript. Ensure the video has captions available.');
            }

            const data = await transcriptRes.json();
            const transcriptText = data.content || data.text || data.transcript || JSON.stringify(data);

            if (!transcriptText || transcriptText.trim() === '') {
                throw new Error('No captions found for this video.');
            }

            // 2. Process with AI
            const systemPrompt = `You are an expert study assistant for Indian competitive exam students (JEE/NEET/CUET level).

Given this transcript, return a JSON object ONLY with the following structure. Do not include any other text or markdown wrappers.

{
  "summary": "Detailed high-level summary of the video's core concepts.",
  "notes": ["Detailed point 1", "Detailed point 2", "Detailed point 3"],
  "flashcards": [
    {"q": "Concept Question", "a": "Concise Answer"}
  ],
  "mcqs": [
    {
      "q": "Multiple choice question?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A) Option 1",
      "explanation": "Explanation of why this is the correct answer."
    }
  ]
}`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Transcript: ${transcriptText.substring(0, 30000)}` }
            ];

            const aiResult = await callGroq(messages, null, false, { temperature: 0.3 });
            const content = aiResult.choices[0].message.content;

            // Parse JSON
            let parsedJson = null;
            try {
                let jsonStr = content.trim();
                if (jsonStr.startsWith('```json')) {
                    jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                } else if (jsonStr.startsWith('```')) {
                    jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
                }
                
                // Find first { and last }
                const firstBrace = jsonStr.indexOf('{');
                const lastBrace = jsonStr.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                     jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
                }
                
                parsedJson = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Failed to parse AI output:", content);
                throw new Error("AI generated invalid data. Please try again.");
            }

            setResult(parsedJson);
            incrementUsage('youtube-analyzer');
        } catch (err) {
            console.error("Analyzer Error:", err);
            setError(err.message || 'An unexpected error occurred while processing the video.');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'notes', label: 'Detailed Notes', icon: ClipboardList },
        { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
        { id: 'mcqs', label: 'Quiz / MCQs', icon: CheckCircle }
    ];

    return (
        <div className={`h-full flex flex-col font-sans overflow-hidden bg-theme-bg text-theme-text transition-colors duration-500`}>
            {/* Header — Lens-consistent */}
            <div className="flex-shrink-0 p-6 md:p-8 pb-4 border-b border-theme-border/20 bg-theme-surface/30 backdrop-blur-md">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-2xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary shadow-[0_0_15px_rgb(var(--theme-primary)/0.15)]">
                            <Youtube className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif italic tracking-wide text-theme-text">
                                YouTube Analyzer
                            </h1>
                            <p className="text-xs text-theme-muted uppercase tracking-widest font-bold mt-1">Video to Study Material</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Input Section */}
                    <div className="bg-theme-surface/50 border border-theme-border/30 rounded-[24px] p-6 md:p-8 shadow-depth-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-muted">
                                    <Link className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube video URL here..."
                                    className="w-full pl-11 pr-4 py-4 bg-theme-bg border border-theme-border rounded-2xl text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary/50 focus:ring-2 focus:ring-theme-primary/20 transition-all duration-300"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !url.trim()}
                                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                                    isLoading || !url.trim()
                                    ? 'bg-theme-surface border border-theme-border text-theme-muted cursor-not-allowed opacity-50'
                                    : 'bg-theme-primary text-theme-bg hover:opacity-90 shadow-[0_0_20px_rgb(var(--theme-primary)/0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing
                                    </>
                                ) : (
                                    <>
                                        Analyze
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm font-medium animate-fade-in">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-theme-primary/20 border-t-theme-primary rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Eye className="w-8 h-8 text-theme-primary animate-pulse" />
                                </div>
                            </div>
                            <p className="mt-6 text-theme-text font-serif italic text-lg tracking-wide">Extracting Knowledge...</p>
                            <p className="text-sm text-theme-muted mt-2">Transcribing video and generating study materials</p>
                        </div>
                    )}

                    {/* Results Section */}
                    {result && !isLoading && (
                        <div className="animate-fade-in space-y-6">
                            {/* Tabs */}
                            <div className="flex overflow-x-auto custom-scrollbar gap-2 p-1.5 border border-theme-border/30 bg-theme-surface/50 rounded-2xl backdrop-blur-sm">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap flex-1 justify-center ${
                                                isActive 
                                                ? 'bg-theme-primary text-theme-bg shadow-lg shadow-[rgb(var(--theme-primary)/0.2)]' 
                                                : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg/50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-theme-surface/40 border border-theme-border/20 rounded-[24px] p-6 md:p-8 min-h-[400px]">
                                {activeTab === 'summary' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h2 className="text-xl font-serif italic text-theme-text flex items-center gap-2 mb-6">
                                            <FileText className="w-6 h-6 text-theme-primary" />
                                            Video Summary
                                        </h2>
                                        <p className="text-theme-text/90 leading-relaxed text-[15px]">
                                            {result.summary}
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h2 className="text-xl font-serif italic text-theme-text flex items-center gap-2 mb-6">
                                            <ClipboardList className="w-6 h-6 text-theme-primary" />
                                            Key Takeaways
                                        </h2>
                                        <ul className="space-y-4">
                                            {result.notes?.map((note, idx) => (
                                                <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-theme-bg border border-theme-border/30 hover:border-theme-primary/30 transition-colors duration-300">
                                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgb(var(--theme-primary)/0.15)]">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-theme-text text-[15px] leading-relaxed">{note}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'flashcards' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h2 className="text-xl font-serif italic text-theme-text flex items-center gap-2 mb-6">
                                            <Sparkles className="w-6 h-6 text-theme-primary" />
                                            Study Flashcards
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {result.flashcards?.map((card, idx) => (
                                                <div key={idx} className="group perspective-1000">
                                                    <div className="relative h-48 w-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180 rounded-2xl cursor-pointer">
                                                        {/* Front */}
                                                        <div className="absolute inset-0 backface-hidden bg-theme-bg border border-theme-border/30 rounded-[20px] p-6 flex flex-col justify-center items-center text-center shadow-depth hover:border-theme-primary/40 transition-colors">
                                                            <p className="text-[9px] font-black text-theme-primary uppercase tracking-[0.2em] mb-4">Question {idx + 1}</p>
                                                            <p className="font-serif italic text-theme-text">{card.q}</p>
                                                        </div>
                                                        {/* Back */}
                                                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 border border-theme-primary/20 rounded-[20px] p-6 flex flex-col justify-center items-center text-center rotate-y-180">
                                                            <p className="text-[9px] font-black text-theme-primary uppercase tracking-[0.2em] mb-4">Answer</p>
                                                            <p className="font-medium text-theme-text text-sm leading-relaxed">{card.a}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'mcqs' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <h2 className="text-xl font-serif italic text-theme-text flex items-center gap-2 mb-6">
                                            <CheckCircle className="w-6 h-6 text-theme-primary" />
                                            Practice Quiz
                                        </h2>
                                        <div className="space-y-8">
                                            {result.mcqs?.map((mcq, idx) => (
                                                <div key={idx} className="p-6 rounded-[24px] bg-theme-bg border border-theme-border/30 relative">
                                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-theme-primary text-theme-bg flex items-center justify-center font-black text-sm shadow-lg shadow-[rgb(var(--theme-primary)/0.3)]">
                                                        Q{idx + 1}
                                                    </div>
                                                    <p className="text-lg font-bold text-theme-text mt-2 mb-6 pl-4">{mcq.q}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                        {mcq.options?.map((opt, optIdx) => (
                                                            <div key={optIdx} className="p-4 rounded-xl border border-theme-border/50 bg-theme-surface/50 text-theme-text text-sm hover:border-theme-primary/50 transition-colors cursor-pointer">
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                                        <p className="font-bold text-emerald-500 mb-1 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" /> Correct Answer: {mcq.answer}
                                                        </p>
                                                        <p className="text-sm text-theme-muted mt-2">{mcq.explanation}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default YoutubeAnalyzer;
