import React, { useState } from 'react';
import { Video, Play, Clock, Download, Crown, Lock, Sparkles, Film, Zap, Check, ChevronRight, Monitor, Smartphone, AuraBot } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { formatGeminiPayload, retryableFetch, GEMINI_API_URL } from '../utils/api';

const DURATIONS = [
    { id: '30s', label: '30 seconds', desc: 'Quick explainer' },
    { id: '1m', label: '1 minute', desc: 'Short overview' },
    { id: '2m', label: '2 minutes', desc: 'Detailed breakdown' },
    { id: '5m', label: '5 minutes', desc: 'Deep dive' },
];

const TIERS = {
    free: { name: 'Free', videosPerWeek: 3, resolution: 'SD (480p)', downloadable: false, color: 'from-theme-muted to-theme-muted/80' },
    go: { name: 'Go', videosPerWeek: 5, resolution: 'HD (1080p)', downloadable: false, color: 'from-theme-secondary to-theme-primary' },
    pro: { name: 'Pro', videosPerWeek: 'Unlimited', resolution: 'HD (1080p)', downloadable: true, color: 'from-theme-primary to-theme-secondary' },
};
const AuraApologyScreen = () => {
    const [showContent, setShowContent] = useState(false);
    const [showBubble, setShowBubble] = useState(false);

    React.useEffect(() => {
        const t1 = setTimeout(() => setShowContent(true), 300);
        const t2 = setTimeout(() => setShowBubble(true), 900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a2e 40%, #120828 70%, #050510 100%)' }}>

            {/* Animated stars background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-white"
                         style={{
                             width: `${0.5 + Math.random() * 2}px`,
                             height: `${0.5 + Math.random() * 2}px`,
                             top: `${Math.random() * 100}%`,
                             left: `${Math.random() * 100}%`,
                             opacity: 0.1 + Math.random() * 0.5,
                             animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
                             animationDelay: `${Math.random() * 3}s`,
                         }} />
                ))}
                {/* Nebula glows */}
                <div className="absolute w-[600px] h-[600px] rounded-full bg-pink-500/[0.08] blur-[150px] -top-40 -right-40" />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/[0.08] blur-[150px] -bottom-40 -left-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Orbital rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03]"
                     style={{ animation: 'auraOrbitSpin 80s linear infinite' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-dashed border-pink-500/[0.06]"
                     style={{ animation: 'auraOrbitSpin 120s linear infinite reverse' }} />
            </div>

            {/* Main content */}
            <div className={`relative z-10 flex flex-col items-center text-center max-w-lg px-6 transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Aura Avatar */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-3xl scale-150 animate-pulse" />
                    <div className="relative flex items-center justify-center"
                         style={{ animation: 'auraFloat 3s ease-in-out infinite' }}>
                        <AuraBot className="w-36 h-44 md:w-44 md:h-56" speaking={false} />
                    </div>
                </div>

                {/* Aura Name Tag */}
                <p className="text-pink-400/80 text-xs font-black uppercase tracking-[0.4em] mb-3"
                   style={{ textShadow: '0 0 20px rgba(236,72,153,0.4)' }}>
                    AURA • AI COMPANION
                </p>

                {/* Speech Bubble */}
                <div className={`relative transition-all duration-700 ease-out ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                    <div className="relative px-8 py-8 rounded-[2rem] bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-pink-500/[0.05] to-transparent pointer-events-none" />
                        <h2 className="relative text-white text-2xl md:text-3xl font-black tracking-tight mb-4 leading-tight">
                            Under Development
                        </h2>
                        <p className="relative text-white/60 text-base md:text-lg font-medium leading-relaxed">
                            I'm sorry, Voyager. The <span className="text-pink-400 font-bold">Video Studio</span> is
                            currently undergoing visual training. Your synthesis tools will be fully active starting
                        </p>
                        <p className="relative mt-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-orange-400 to-amber-400 text-2xl font-black uppercase tracking-[0.15em]">
                            Late May 2026
                        </p>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-white/[0.04] border-l border-t border-white/10" />
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes auraOrbitSpin { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
                @keyframes auraFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
        </div>
    );
};

const VideoGenerator = () => {
    const { isDark } = useTheme();
    const { isPro, canUseFeature, triggerUpgradeModal } = useSubscription();
    const [selectedDuration, setSelectedDuration] = useState('1m');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [scriptResult, setScriptResult] = useState('');

    const generateVideoMock = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            const systemContent = `You are an expert video script writer for educational content. Write a structured video script for a ${selectedDuration} video explaining "${topic}". Include visual cues in brackets [like this] and narration block. Keep it highly engaging.`;
            const payload = formatGeminiPayload(`Generate a highly engaging video script about ${topic}`, systemContent);
            const response = await retryableFetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.choices && response.choices.length > 0) {
                setScriptResult(response.choices[0].message.content);
            } else {
                setScriptResult("Failed to synthesize video script. Please try another topic.");
            }
        } catch (error) {
            setScriptResult(`AI Synthesis failed: ${error.message}`);
        }
        setIsGenerating(false);
    };

    const userTier = isPro ? 'pro' : 'free'; // Simplified — expand when Go tier exists
    const currentTier = TIERS[userTier];

    return (
        <div className={`h-full overflow-y-auto custom-scrollbar p-6 bg-theme-bg text-theme-text relative`}>
            {/* Coming Soon Overlay */}
            <AuraApologyScreen />

            <div className="max-w-4xl mx-auto space-y-8 opacity-30 pointer-events-none blur-md select-none">

                {/* Header */}
                <div className="text-center pt-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${isDark ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20' : 'bg-theme-primary/5 text-theme-primary border border-theme-primary/10'}`}>
                        <Film className="w-4 h-4" /> Visual Studio
                    </div>
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary bg-clip-text text-transparent">
                        Visual Synthesis
                    </h1>
                    <p className="text-theme-muted text-lg max-w-xl mx-auto">
                        Transform your notes, topics, and concepts into beautiful AI-generated educational videos.
                    </p>
                </div>

                {/* Generator Interface */}
                <div className={`relative rounded-3xl border overflow-hidden bg-theme-surface border-theme-border/20`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 via-theme-secondary/5 to-theme-primary/5"></div>
                    
                    {scriptResult ? (
                        <div className="relative p-10">
                            <div className="flex justify-between items-center mb-6 border-b border-theme-border/20 pb-4">
                                <h2 className="text-2xl font-black text-theme-text flex items-center gap-2">
                                    <Video className="w-6 h-6 text-theme-primary" /> Generated Video Script
                                </h2>
                                <button 
                                    onClick={() => setScriptResult('')}
                                    className="px-4 py-2 text-sm text-theme-primary border border-theme-primary/20 hover:bg-theme-primary/10 rounded-xl transition-colors"
                                >
                                    Create New
                                </button>
                            </div>
                            <div className="bg-theme-bg/50 backdrop-blur-sm border border-theme-border/30 rounded-2xl p-6 custom-scrollbar overflow-y-auto max-h-[500px]">
                                <pre className="whitespace-pre-wrap font-sans text-theme-text text-sm leading-relaxed">
                                    {scriptResult}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="relative p-10 text-center">
                            <h2 className="text-2xl font-black mb-3 text-theme-text">Create Educational Video</h2>
                            <p className="text-theme-muted max-w-md mx-auto mb-8">
                                Enter a topic and we'll generate a comprehensive video script complete with visual cues and narration.
                            </p>

                            {/* Topic Input */}
                            <div className={`max-w-lg mx-auto rounded-2xl border p-6 mb-8 bg-theme-bg border-theme-border/50`}>
                                <label className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3 block text-left">What do you want a video about?</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Newton's Third Law of Motion"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm mb-4 outline-none transition-all focus:ring-2 focus:ring-theme-primary/50 bg-theme-surface border-theme-border/30 text-theme-text placeholder-theme-muted/50`}
                                />

                                {/* Duration Selector */}
                                <label className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3 block text-left">Video Length</label>
                                <div className="grid grid-cols-4 gap-2 mb-5">
                                    {DURATIONS.map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => setSelectedDuration(d.id)}
                                            className={`py-2.5 px-3 rounded-xl text-center transition-all border text-xs font-semibold ${selectedDuration === d.id
                                                ? 'border-theme-primary bg-theme-primary/10 text-theme-primary ring-1 ring-theme-primary/30'
                                                : `border-theme-border/20 text-theme-muted hover:border-theme-primary/50`
                                                }`}
                                        >
                                            <div className="font-bold">{d.label}</div>
                                            <div className="text-[10px] opacity-60 mt-0.5">{d.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={generateVideoMock}
                                    disabled={!topic || isGenerating}
                                    className={`w-full py-3.5 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${(!topic || isGenerating) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 shadow-lg shadow-theme-primary/20'}`}
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-theme-bg border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isGenerating ? 'Synthesizing Video Script...' : 'Generate Video Script'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tier Comparison */}
                <div>
                    <h3 className="text-lg font-bold text-center mb-6">Plan Comparison</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(TIERS).map(([key, tier]) => (
                            <div
                                key={key}
                                className={`rounded-2xl border p-5 text-center transition-all ${key === userTier ? 'ring-2 ring-theme-primary scale-[1.02]' : ''
                                    } bg-theme-surface border-theme-border/30`}
                            >
                                <div className={`text-xs font-bold uppercase tracking-wider mb-3 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                                    {tier.name}
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-theme-muted">Videos/week</span>
                                        <span className="font-bold">{tier.videosPerWeek}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-theme-muted">Resolution</span>
                                        <span className="font-bold text-xs">{tier.resolution}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-theme-muted">Download</span>
                                        {tier.downloadable ? (
                                            <Check className="w-4 h-4 text-theme-primary" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-theme-muted" />
                                        )}
                                    </div>
                                </div>
                                {key === userTier && (
                                    <div className="mt-3 text-[10px] font-bold text-theme-primary uppercase">Current Plan</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className={`rounded-3xl border p-8 bg-theme-surface border-theme-border/20`}>
                    <h3 className="text-lg font-black mb-6 text-center text-theme-primary uppercase tracking-widest">What to Expect</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: '🎨', title: 'Visual Explanations', desc: 'AI-animated diagrams and concepts' },
                            { icon: '🗣️', title: 'AI Narration', desc: 'Natural voice explaining topics' },
                            { icon: '📐', title: 'Subject Support', desc: 'Physics, Math, Chemistry & more' },
                            { icon: '⚡', title: 'Instant Generation', desc: 'Videos ready in minutes' },
                        ].map((feature, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h4 className="font-bold text-sm mb-1 text-theme-secondary">{feature.title}</h4>
                                <p className="text-[11px] text-theme-muted">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upgrade CTA for non-Pro users */}
                {!isPro && (
                    <div className={`rounded-3xl border p-6 text-center bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 border-theme-primary/20`}>
                        <Crown className="w-8 h-8 text-theme-primary mx-auto mb-3" />
                        <h3 className="font-black text-lg mb-2 text-theme-primary">Unlock HD Videos & Downloads</h3>
                        <p className="text-theme-muted text-sm mb-4">Upgrade to Pro for unlimited HD video generation with downloads.</p>
                        <button
                            onClick={() => triggerUpgradeModal('video-generator')}
                            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-theme-primary/20"
                        >
                            Upgrade to Pro →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGenerator;
