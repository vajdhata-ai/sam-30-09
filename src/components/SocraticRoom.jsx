import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ShieldAlert, Cpu, Brain, Zap, MessageSquare, Loader2, Gauge } from './Icons';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { TTS_API_URL } from '../utils/api';
import { callAI as callGroq } from '../utils/apiRouter';
import { auth } from '../firebase';

const SocraticRoom = ({ topic, documentContent, isDark, MarkdownRenderer }) => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [logicStrength, setLogicStrength] = useState(50);
    const [debateSummary, setDebateSummary] = useState(null);
    const [isVoiceActive, setIsVoiceActive] = useState(false); // User speaking
    const [isTutorSpeaking, setIsTutorSpeaking] = useState(false); // AI Speaking
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioRef = useRef(null);
    const messagesRef = useRef(messages); // To fix stale closure in voice handler

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Stop audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
    }, []);

    const speakText = async (text) => {
        setIsTutorSpeaking(true);
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (auth.currentUser) {
                headers['Authorization'] = `Bearer ${await auth.currentUser.getIdToken()}`;
            }
            const res = await fetch(TTS_API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({ text, speaker: 'explainer' }) // Use default male explainer
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
        // Initial query
        startDebate();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startDebate = async () => {
        setIsThinking(true);
        try {
            const prompt = "Initialize the Socratic Voice Tutor. Greet the student and immediately ask a thought-provoking, deep conceptual question about the core topic to test their knowledge.";
            const messages = [
                { role: 'system', content: SOCRATIC_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];
            const res = await callGroq(messages, null, false, { max_tokens: 120 });

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
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsVoiceActive(true);
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleVoiceSend(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsVoiceActive(false);
            };

            recognitionRef.current.onend = () => {
                setIsVoiceActive(false);
            };
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

    const handleVoiceSend = async (transcriptText) => {
        if (!transcriptText.trim() || isThinking) return;

        setMessages(prev => [...prev, { role: 'user', text: transcriptText }]);
        setIsThinking(true);

        try {
            const history = messagesRef.current.map(m => `${m.role === 'user' ? 'Student' : 'Grandmaster'}: ${m.text}`).join('\n');
            const prompt = `
                HISTORY:
                ${history}
                
                STUDENT RESPONSE:
                ${transcriptText}
                
                Analyze the response. Check for logical fallacies or shallow explanations. 
                Construct your rebuttal or next probing question.
                Update the logic score delta based on if they defended their point well.
            `;

            const messages = [
                { role: 'system', content: SOCRATIC_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];
            const res = await callGroq(messages, null, false, { max_tokens: 120 });

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
                        setDebateSummary("Mastery Confirmed. You have convinced the Grandmaster.");
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

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[500px] max-h-[800px] gap-4 md:gap-6 animate-in fade-in zoom-in duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 p-6 rounded-3xl border border-gold/10 bg-[#141009] flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <button
                            onClick={toggleVoice}
                            disabled={isThinking || !!debateSummary}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-none ${isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' : 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold hover:text-[#0e0b07] hover:scale-105'}`}
                        >
                            {isVoiceActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </button>
                        <div>
                            <h3 className="font-bold text-lg uppercase tracking-[0.15em] text-gold flex items-center gap-2">
                                Socratic Tutor
                                {isVoiceActive && (
                                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded-full animate-pulse">Listening...</span>
                                )}
                            </h3>
                            <p className="text-theme-muted text-xs font-medium">Clear your doubts or test your logic via Speech.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl border border-gold/15 bg-gold/5 relative overflow-hidden group transition-all duration-700">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Mastery Level</span>

                            <span className="text-lg font-bold text-gold">{logicStrength}%</span>
                        </div>
                        <div className="w-full h-2 bg-gold/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gold transition-all duration-1000 ${logicStrength < 30 ? 'animate-pulse' : ''}`}
                                style={{ width: `${logicStrength}%` }}
                            />
                        </div>
                    </div>
                    <Gauge className="absolute -right-4 -bottom-4 w-24 h-24 text-gold/10 group-hover:rotate-12 transition-transform duration-700" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 rounded-[32px] border border-gold/10 bg-[#0e0b07]/50 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
                    {/* Cinematic Scanner Effect */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gold/30 shadow-[0_0_20px_rgba(201,165,90,0.3)] animate-scanner opacity-20"></div>
                        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full animate-neural-pulse"></div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        {msg.role === 'model' && <Volume2 className="w-3 h-3 text-gold" />}
                                        <span className="text-[9px] font-black uppercase tracking-widest text-theme-muted">
                                            {msg.role === 'user' ? 'You' : 'Socratic Tutor'}
                                        </span>
                                    </div>
                                    <div className={`p-5 rounded-2xl text-sm leading-relaxed transition-all duration-500 ${msg.role === 'user'
                                        ? 'bg-gold/15 text-cream border border-gold/20 rounded-tr-none'
                                        : 'bg-[#1c1710] text-cream/80 rounded-tl-none border border-gold/10'
                                        } ${msg.role === 'model' && i === messages.length - 1 && isThinking ? 'opacity-50 blur-[1px]' : ''}`}>
                                        <MarkdownRenderer text={msg.text} isDark={isDark} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isThinking && (
                        <div className="flex justify-start relative z-10">
                            <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex items-center gap-3 border border-white/5`}>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">Detecting Fallacies...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-6 border-t border-gold/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Voice Interface Blob Container */}
                    <div className="relative w-full h-[120px] flex items-center justify-center -translate-y-4">
                        {/* Dynamic Blob behind the Mic */}
                        <div className={`absolute shadow-[0_0_60px_rgba(201,165,90,0.6)] rounded-full mix-blend-screen pointer-events-none transition-all duration-[300ms] ease-out
                            ${isTutorSpeaking 
                                ? 'w-48 h-48 bg-emerald-500/30 scale-110 animate-[spin_4s_linear_infinite,pulse_1.5s_infinite]' 
                                : isVoiceActive 
                                    ? 'w-40 h-40 bg-gold/30 scale-125 animate-[pulse_0.5s_infinite]' 
                                    : 'w-24 h-24 bg-transparent shadow-none'}`
                        } style={{ borderRadius: isTutorSpeaking || isVoiceActive ? '40% 60% 60% 40% / 60% 40% 60% 40%' : '50%' }}></div>
                    </div>

                    <div className="space-y-3 relative z-10 -mt-[100px]">
                        <div className="flex justify-center">
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
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-none z-10 
                                ${isVoiceActive ? 'bg-gold text-[#0e0b07] animate-pulse scale-110 shadow-gold' 
                                : isTutorSpeaking ? 'bg-emerald-500 text-white scale-100 animate-pulse' 
                                : 'bg-[#141009] text-gold border border-gold/30 hover:bg-gold hover:text-[#0e0b07] hover:scale-105'}`}
                            >
                                {isVoiceActive ? <Mic className="w-8 h-8" /> : isTutorSpeaking ? <Volume2 className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                            </button>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.15em] text-cream/40 px-4 py-1 rounded-full bg-black/50 backdrop-blur-md">
                            {isThinking ? 'Tutor is Thinking...' : isTutorSpeaking ? 'Tutor is Speaking (Tap to stop)' : isVoiceActive ? 'Listening...' : 'Tap Mic to Speak'}
                        </p>
                        {input && !isThinking && !isVoiceActive && !isTutorSpeaking && (
                            <p className="text-xs text-gold/70 max-w-md mx-auto truncate mt-2 bg-black/40 px-3 py-1 rounded-md">
                                Last heard: "{input}"
                            </p>
                        )}
                    </div>
                </div>

                {debateSummary && (
                    <div className="absolute inset-0 bg-[#0e0b07]/80 backdrop-blur-sm flex items-center justify-center p-8 z-20">
                        <div className="bg-[#141009] border border-gold/20 p-10 rounded-[32px] text-center space-y-6 shadow-2xl animate-in zoom-in duration-500">
                            <Brain className="w-16 h-16 text-emerald-400 mx-auto animate-pulse" />
                            <h2 className="text-3xl font-serif italic text-cream tracking-wide">Logic Verified</h2>
                            <p className="text-cream/50 max-w-sm">{debateSummary}</p>
                            <button
                                onClick={() => setDebateSummary(null)}
                                className="px-8 py-3 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all"
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
