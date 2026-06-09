import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ShieldAlert, Cpu, Brain, Zap, MessageSquare, Loader2, Gauge } from './Icons';
import { Mic, MicOff, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { TTS_API_URL } from '../utils/api';
import { callAI as callGroq } from '../utils/apiRouter';
import { auth } from '../firebase';

const SocraticRoom = ({ topic, documentContent, isDark, MarkdownRenderer }) => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [logicStrength, setLogicStrength] = useState(50);
    const [debateSummary, setDebateSummary] = useState(null);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isTutorSpeaking, setIsTutorSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioRef = useRef(null);
    const messagesRef = useRef(messages);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        return () => {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
    }, []);

    const speakText = async (text) => {
        if (!voiceEnabled) return;
        setIsTutorSpeaking(true);
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (auth.currentUser) {
                headers['Authorization'] = `Bearer ${await auth.currentUser.getIdToken()}`;
            }
            const res = await fetch(TTS_API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({ text, speaker: 'explainer' })
            });
            if (res.ok) {
                const data = await res.json();
                const b64 = Array.isArray(data.audioBase64) ? data.audioBase64[0] : data.audioBase64;
                const src = `data:audio/wav;base64,${b64}`;
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(src);
                audioRef.current = audio;
                audio.onended = () => setIsTutorSpeaking(false);
                audio.onerror = () => setIsTutorSpeaking(false);
                await audio.play();
            } else {
                setIsTutorSpeaking(false);
            }
        } catch (e) {
            console.error(e);
            setIsTutorSpeaking(false);
        }
    };

    const SOCRATIC_SYSTEM_PROMPT = `
        You are the "Socratic Voice Tutor". Your goal is to solve the student's doubts logically, step-by-step, and test their understanding of the topic: "${topic}".
        
        RULES OF ENGAGEMENT:
        1. If the student has a doubt, solve it clearly and concisely, like a tutor speaking to a student.
        2. After solving or explaining, ALWAYS ask a short follow-up question to ensure they understood.
        3. Do not use overly complex or confusing language. Speak logically but simply.
        4. Your VERY FIRST MESSAGE must act dynamically as the opposition—greet the student and immediately ask a probing, thought-provoking question about the core topic to test them. Do NOT ask if they have doubts; MAKE them think.

        DOCUMENT CONTEXT:
        ${documentContent.substring(0, 10000)}

        Return your response in a casual conversation format, but wrapped in a JSON. KEEP YOUR RESPONSE UNDER 3 SENTENCES (MANDATORY). Short debate bursts!
        { "message": "Your text here (use markdown)", "logic_score_delta": -15 to +15, "is_convinced": false }
    `;

    useEffect(() => {
        startDebate();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startDebate = async () => {
        setIsThinking(true);
        try {
            const prompt = "Initialize the Socratic Voice Tutor. Greet the student and immediately ask a thought-provoking, deep conceptual question about the core topic to test their knowledge.";
            const msgs = [
                { role: 'system', content: SOCRATIC_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];
            const res = await callGroq(msgs, null, false, { max_tokens: 120 });
            const content = res.choices?.[0]?.message?.content || "";
            let messageText = content;
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    messageText = data.message;
                }
            } catch (e) { }
            setMessages([{ role: 'model', text: messageText }]);
            if (messageText) speakText(messageText);
        } catch (e) {
            console.error(e);
            setMessages([{ role: 'model', text: "Are you ready? Let us begin." }]);
            speakText("Are you ready? Let us begin.");
        }
        setIsThinking(false);
    };

    // Voice Recognition Setup
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.onstart = () => setIsVoiceActive(true);
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };
            recognitionRef.current.onerror = () => setIsVoiceActive(false);
            recognitionRef.current.onend = () => setIsVoiceActive(false);
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        if (isVoiceActive) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleSend = async (textOverride) => {
        const msg = (textOverride || input).trim();
        if (!msg || isThinking) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setIsThinking(true);

        try {
            const history = messagesRef.current.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
            const prompt = `
                HISTORY:\n${history}\n\nSTUDENT RESPONSE:\n${msg}\n\n
                Analyze the response. Check for logical fallacies or shallow explanations. 
                Construct your rebuttal or next probing question.
                Update the logic score delta based on if they defended their point well.
            `;
            const msgs = [
                { role: 'system', content: SOCRATIC_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];
            const res = await callGroq(msgs, null, false, { max_tokens: 120 });
            const content = res.choices?.[0]?.message?.content || "";
            let messageText = content;
            let delta = 0;
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    messageText = data.message;
                    delta = data.logic_score_delta || 0;
                    if (data.is_convinced) {
                        setDebateSummary("Mastery Confirmed. You have convinced the Tutor.");
                    }
                }
            } catch (e) { }
            setLogicStrength(prev => Math.max(0, Math.min(100, prev + delta)));
            setMessages(prev => [...prev, { role: 'model', text: messageText }]);
            if (messageText) speakText(messageText);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'model', text: "Let us reconsider that approach." }]);
            speakText("Let us reconsider that approach.");
        }
        setIsThinking(false);
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    // Determine orb state
    const orbState = isThinking ? 'thinking' : isTutorSpeaking ? 'speaking' : isVoiceActive ? 'listening' : 'idle';

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[500px] gap-4 animate-in fade-in duration-500">
            {/* ═══ Header Bar ═══ */}
            <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/[0.06] bg-[#0c0a06]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                            isTutorSpeaking ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'bg-gold/10 border-gold/20'
                        }`}>
                            <Brain className={`w-5 h-5 ${isTutorSpeaking ? 'text-emerald-400' : 'text-gold'}`} />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0c0a06] ${
                            isTutorSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-gold'
                        }`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-cream/90">Socratic Tutor</h3>
                        <p className="text-[10px] text-cream/30 font-medium tracking-wider">Analytical · Deep Voice</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Voice toggle */}
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`p-2 rounded-lg border transition-all duration-300 cursor-none ${
                            voiceEnabled 
                                ? 'border-gold/20 bg-gold/5 text-gold hover:bg-gold/15' 
                                : 'border-white/5 bg-white/[0.02] text-cream/30 hover:text-cream/50'
                        }`}
                        title={voiceEnabled ? 'Mute tutor voice' : 'Enable tutor voice'}
                    >
                        {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>

                    {/* Mastery gauge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold/10 bg-gold/[0.03]">
                        <Gauge className="w-3.5 h-3.5 text-gold/60" />
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gold/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        logicStrength > 70 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                                        : logicStrength > 40 ? 'bg-gold shadow-[0_0_8px_rgba(201,165,90,0.5)]' 
                                        : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)] animate-pulse'
                                    }`}
                                    style={{ width: `${logicStrength}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-gold/80 tabular-nums">{logicStrength}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Main Content Area ═══ */}
            <div className="flex-1 flex flex-col rounded-3xl border border-white/[0.04] bg-[#0a0806]/60 backdrop-blur-2xl overflow-hidden relative shadow-[0_16px_64px_rgba(0,0,0,0.6)]">
                
                {/* Ambient background effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gold/[0.015] blur-[120px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-emerald-500/[0.01] blur-[100px] rounded-full" />
                </div>

                {/* ═══ Chat Messages ═══ */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 custom-scrollbar relative z-10">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}>
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                    {msg.role === 'model' && <Brain className="w-2.5 h-2.5 text-gold/50" />}
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cream/25">
                                        {msg.role === 'user' ? 'You' : 'Tutor'}
                                    </span>
                                </div>
                                <div className={`px-4 py-3 text-[13px] leading-relaxed transition-all duration-500 ${
                                    msg.role === 'user'
                                        ? 'bg-gold/[0.08] text-cream/90 rounded-2xl rounded-tr-sm border border-gold/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
                                        : 'bg-white/[0.03] text-cream/70 rounded-2xl rounded-tl-sm border border-white/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.2)]'
                                }`}>
                                    <MarkdownRenderer text={msg.text} isDark={isDark} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="px-5 py-3 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                                <span className="text-[9px] font-bold uppercase text-cream/20 tracking-[0.2em]">Analyzing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* ═══ Voice Orb + Controls (Apple-style) ═══ */}
                <div className="relative border-t border-white/[0.04] bg-gradient-to-t from-[#0c0906]/90 to-transparent">
                    {/* Voice Orb Area */}
                    <div className="flex flex-col items-center py-6 relative">
                        {/* Animated Orb */}
                        <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                            {/* Outer glow ring */}
                            <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
                                orbState === 'speaking' 
                                    ? 'bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.25)] scale-125 animate-pulse' 
                                    : orbState === 'listening' 
                                        ? 'bg-gold/10 shadow-[0_0_60px_rgba(201,165,90,0.3)] scale-110 animate-[pulse_0.6s_infinite]' 
                                        : orbState === 'thinking'
                                            ? 'bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.2)] scale-105 animate-[spin_3s_linear_infinite]'
                                            : 'bg-transparent scale-100'
                            }`} style={{ borderRadius: orbState === 'speaking' || orbState === 'listening' ? '38% 62% 55% 45% / 60% 38% 62% 40%' : '50%' }} />

                            {/* Inner orb gradient */}
                            <div className={`absolute rounded-full transition-all duration-500 ${
                                orbState === 'speaking' 
                                    ? 'inset-3 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-teal-500/15' 
                                    : orbState === 'listening' 
                                        ? 'inset-3 bg-gradient-to-br from-gold/20 via-amber-600/10 to-yellow-500/15' 
                                        : orbState === 'thinking'
                                            ? 'inset-4 bg-gradient-to-br from-blue-500/15 via-indigo-600/10 to-purple-500/10'
                                            : 'inset-6 bg-gradient-to-br from-gold/5 via-transparent to-gold/5'
                            }`} style={{ borderRadius: orbState !== 'idle' ? '42% 58% 50% 50% / 55% 42% 58% 45%' : '50%' }} />

                            {/* Mic button */}
                            <button
                                onClick={() => {
                                    if (isTutorSpeaking) {
                                        if (audioRef.current) audioRef.current.pause();
                                        setIsTutorSpeaking(false);
                                    } else {
                                        toggleVoice();
                                    }
                                }}
                                disabled={isThinking || !!debateSummary}
                                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl cursor-none disabled:opacity-30
                                    ${orbState === 'listening' 
                                        ? 'bg-gold text-[#0e0b07] scale-110 shadow-[0_0_30px_rgba(201,165,90,0.5)]' 
                                        : orbState === 'speaking' 
                                            ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                                            : 'bg-[#1a1610] text-gold/70 border border-gold/15 hover:bg-gold/10 hover:text-gold hover:border-gold/30 hover:scale-105'
                                    }`}
                            >
                                {orbState === 'listening' ? <Mic className="w-6 h-6" /> 
                                    : orbState === 'speaking' ? <Volume2 className="w-6 h-6 animate-pulse" /> 
                                    : <Mic className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Voice State Label */}
                        <div className="flex items-center gap-2">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md transition-colors duration-500 ${
                                orbState === 'speaking' ? 'text-emerald-400/70 bg-emerald-500/5'
                                : orbState === 'listening' ? 'text-gold/70 bg-gold/5'
                                : orbState === 'thinking' ? 'text-blue-400/70 bg-blue-500/5'
                                : 'text-cream/20 bg-white/[0.02]'
                            }`}>
                                {orbState === 'thinking' ? 'Tutor Thinking...' 
                                    : orbState === 'speaking' ? 'Speaking · Tap to Stop' 
                                    : orbState === 'listening' ? 'Listening...' 
                                    : 'Tap to Speak'}
                            </p>
                        </div>
                    </div>

                    {/* ═══ Text Input Bar ═══ */}
                    <div className="px-4 pb-4">
                        <form onSubmit={handleTextSubmit} className="relative">
                            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/[0.06] bg-[#0e0b07]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] focus-within:border-gold/20 transition-colors duration-300">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your response..."
                                    disabled={isThinking || !!debateSummary}
                                    className="flex-1 py-2.5 pl-4 pr-2 bg-transparent text-[13px] font-light outline-none text-cream/80 placeholder:text-cream/15 disabled:opacity-30"
                                />
                                <button
                                    type="submit"
                                    disabled={isThinking || !input.trim() || !!debateSummary}
                                    className="p-2.5 bg-gold/10 text-gold hover:bg-gold hover:text-[#0e0b07] disabled:opacity-20 border border-gold/15 rounded-xl transition-all duration-300 flex items-center justify-center cursor-none disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ═══ Mastery Confirmed Overlay ═══ */}
                {debateSummary && (
                    <div className="absolute inset-0 bg-[#0a0806]/90 backdrop-blur-lg flex items-center justify-center p-8 z-20 animate-in fade-in zoom-in-95 duration-700">
                        <div className="bg-[#12100a] border border-gold/15 p-12 rounded-3xl text-center space-y-6 shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_60px_rgba(201,165,90,0.1)] max-w-md">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Brain className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-serif italic text-cream tracking-wide">Logic Verified</h2>
                            <p className="text-cream/40 text-sm leading-relaxed">{debateSummary}</p>
                            <button
                                onClick={() => setDebateSummary(null)}
                                className="px-10 py-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white font-bold tracking-[0.1em] uppercase text-xs rounded-xl transition-all duration-300 cursor-none"
                            >
                                Continue Mastery
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocraticRoom;
