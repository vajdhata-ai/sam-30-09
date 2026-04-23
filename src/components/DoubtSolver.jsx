import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, AuremLogo, AuraEmoji, User, Bot, Loader2, Send, BookOpen, Clock, BrainCircuit, Image, X, Upload, Crown, RefreshCw, ThumbsUp, ThumbsDown, PenTool } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { useLearnLoop } from '../contexts/LearnLoopContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { GROQ_API_URL } from '../utils/api';

const DoubtSolver = ({ retryableFetch }) => {
    const { isDark } = useTheme();
    const { isPro, triggerUpgradeModal, canUseFeature, incrementUsage } = useSubscription();
    const { getDifficultyLevel } = usePerformance();
    const { startLoop } = useLearnLoop();
    const { currentUser } = useAuth();
    const { activeChatId, chats, startNewChat, addMessageToChat, getGlobalContextStr } = useChatHistory();
    const { globalInstructions, understandingLevel } = useUserPreferences();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const [typedGreeting, setTypedGreeting] = useState('');
    const [showChatUI, setShowChatUI] = useState(false);
    const [feedbackState, setFeedbackState] = useState({}); // { msgIndex: 'up' | 'down' }
    const [refineInput, setRefineInput] = useState('');
    const [refiningMsgIdx, setRefiningMsgIdx] = useState(null);

    // Determine Aura's mood from message content
    const getAuraMood = (content) => {
        if (!content) return 'thinking';
        const lower = content.toLowerCase();
        if (lower.includes('sorry') || lower.includes('unfortunately') || lower.includes('error') || lower.includes('can\'t') || lower.includes('mistake')) return 'empathetic';
        if (lower.includes('great') || lower.includes('excellent') || lower.includes('perfect') || lower.includes('awesome') || lower.includes('!')) return 'excited';
        if (lower.includes('think') || lower.includes('consider') || lower.includes('let\'s') || lower.includes('step') || lower.includes('?')) return 'thinking';
        return 'happy';
    };

    // Sync local messages with global history
    useEffect(() => {
        const activeChat = chats.find(c => c.id === activeChatId);
        if (activeChat && activeChat.feature === 'doubt-solver') {
            setMessages(activeChat.messages || []);
        } else if (!activeChatId || (activeChat && activeChat.feature !== 'doubt-solver')) {
            setMessages([]);
        }
    }, [activeChatId, chats]);

    useEffect(() => {
        const name = currentUser?.displayName?.split(' ')[0] || 'Student';
        const fullText = `Hi, ${name}.`;
        let i = 0;
        // Scroll container to top on open so greeting is visible
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
        let intervalId;
        const timer = setTimeout(() => {
            intervalId = setInterval(() => {
                i++;
                setTypedGreeting(fullText.slice(0, i));
                if (i >= fullText.length) {
                    clearInterval(intervalId);
                    setTimeout(() => setShowChatUI(true), 600);
                }
            }, 60);
        }, 400);
        return () => {
            clearTimeout(timer);
            if (intervalId) clearInterval(intervalId);
        };
    }, [currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressed);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!isPro) {
            triggerUpgradeModal('vision');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        try {
            const compressed = await compressImage(file, 1024, 0.8);
            setImagePreview(compressed);
            setSelectedImage(compressed.split(',')[1]);
        } catch (err) {
            console.error('Image compression error:', err);
            alert('Failed to process image. Please try a smaller image.');
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userQuestion = input.trim();
        const imageToSend = selectedImage;
        const imagePreviewToSend = imagePreview;

        setInput('');
        clearImage();

        const newMessage = {
            role: 'user',
            content: userQuestion || (imageToSend ? '[Image Uploaded]' : ''),
            image: imagePreviewToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const currentActiveChat = chats.find(c => c.id === activeChatId);
        let chatId = activeChatId;

        // Optimistic UI update
        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        if (!chatId || (currentActiveChat && currentActiveChat.feature !== 'doubt-solver')) {
            const title = userQuestion ? userQuestion.substring(0, 30) + '...' : 'Neural Query';
            chatId = startNewChat('doubt-solver', [newMessage], title);
        } else {
            addMessageToChat(chatId, newMessage);
        }

        const globalContext = getGlobalContextStr();

        const effectiveLevel = understandingLevel === 'auto' ? getDifficultyLevel() : understandingLevel;

        let systemPrompt = `You are AUREM — an elite AI study companion and cognitive augmentation system.

        CORE IDENTITY:
        - Tone: Elite. Intelligent. Calm. Structured.
        - Transform questions into mastered understanding.
        - Pure cognitive clarity. No fluff. No filler.

        OUTPUT FORMAT:
        1. **Structure**: For academic/complex questions, use Markdown with clear headers (## Summary, ## Explanation, etc).
        2. **Conversational**: IF the user is just saying 'hi', 'hello', or greeting you, DO NOT use the strict academic Structure. Just reply in a brief, friendly, human-like but elite conversational manner.
        3. **Direct Answer**: Be concise and logical. No meta-commentary.
        4. **Logical Consistency**: Ensure your explanation flows logically. Never contradict yourself.
        5. **Vision**: If an image is provided, analyze it thoroughly and precisely.

        BEHAVIOR RULES:
        - Never hallucinate facts. If unsure, say so.
        - Use elegant formatting with readable hierarchy for complex subjects.
        - No emojis unless the user uses them.
        - No motivational talk. No insecurity validation.
        - If the user shows uncertainty: Guide with Socratic questioning, don't just give the answer.
        - Adapt depth dynamically — simplify for beginners, deepen for advanced queries.
        
        CURRENT USER PERFORMANCE LEVEL: ${effectiveLevel.toUpperCase()}
        -> IF EASY/BEGINNER: Explain concepts very simply, use relatable analogies, break down steps completely.
        -> IF INTERMEDIATE: Balance theory with practical steps, assume some base knowledge.
        -> IF HARD/ADVANCED: Be extremely concise, highly technical, and focus on profound insights and advanced applications.
        -> IF EXPERT: Give only the highest-level principles, mathematical/theoretical proofs, and assume mastery of prerequisites.
        
        USER REFINEMENT INSTRUCTION: ${messages.find(m => m.role === 'user' && m.isRefinement)?.content || "None"}
        
        ${globalContext}
        
        ${globalInstructions ? `\nGLOBAL CUSTOM INSTRUCTIONS (PRIORITIZE THESE):\n${globalInstructions}` : ''}`;

        try {
            let payload;

            if (imageToSend) {
                payload = {
                    model: "gemini-1.5-flash",
                    messages: [{
                        role: "user",
                        content: [
                            { type: "text", text: `${systemPrompt}\n\nUSER QUESTION: ${userQuestion || "Analyze this image."}` },
                            { type: "image_url", image_url: { url: imagePreviewToSend } }
                        ]
                    }],
                    temperature: 0.5,
                    max_tokens: 2048
                };
            } else {
                const conversationHistory = messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));
                payload = {
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...conversationHistory,
                        { role: 'user', content: userQuestion }
                    ]
                };
            }

            const result = await retryableFetch(GROQ_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (result.error) {
                const detailedMsg = result.details
                    ? `${result.error}: ${result.message} (${result.details})`
                    : (result.message ? `${result.error}: ${result.message}` : JSON.stringify(result.error));
                throw new Error(detailedMsg);
            }

            const responseText = result.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

            const assistantMsg = {
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                canEradicate: true,
                topicContext: userQuestion
            };

            setMessages(prev => {
                // To avoid duplication since we sync with context, we skip adding if it's already going to come via context?
                // Actually the context sync effect will overwrite it, which is fine. But for instant UI, we can do optimistic:
                return [...prev, assistantMsg];
            });

            addMessageToChat(chatId, assistantMsg);

        } catch (err) {
            console.error(err);
            const errorMessage = err.message || (typeof err === 'string' ? err : JSON.stringify(err));
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${errorMessage}`,
                isError: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEradicateDoubt = (topic) => {
        const cleanTopic = topic ? topic.substring(0, 50) : "Complex Topic";
        startLoop(cleanTopic);
    };

    const handleFeedback = (idx, type) => {
        setFeedbackState(prev => ({ ...prev, [idx]: type }));
    };

    const submitRefinement = (idx) => {
        if (!refineInput.trim()) return;
        const msg = `Refine your previous response: ${refineInput}`;
        setRefineInput('');
        setRefiningMsgIdx(null);
        
        const newMessage = {
            role: 'user',
            content: msg,
            isRefinement: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        // Trigger handleSendMessage logic for refinement
        // We'll simulate submitting this specific input:
        setInput(msg);
        setTimeout(() => {
            const formEvent = new Event('submit', { cancelable: true });
            handleSendMessage({ preventDefault: () => {} });
        }, 50);
    };


    const renderLine = (line, idx) => {
        if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-base font-display font-bold mt-4 mb-2 text-theme-primary">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
            return <h3 key={idx} className={`text-sm font-display font-bold mt-3 mb-1 text-theme-secondary`}>{line.replace('### ', '')}</h3>;
        }
        if (line.includes('**')) {
            const parts = line.split(/\*\*(.+?)\*\*/g);
            return (
                <p key={idx} className="my-1.5 text-[14px] leading-snug">
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-theme-secondary">{p}</strong> : p)}
                </p>
            );
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return (
                <div key={idx} className="flex gap-2.5 my-1 ml-1 text-[14px] leading-snug">
                    <span className="text-theme-primary mt-0.5">•</span>
                    <span>{line.trim().replace(/^[-•]\s*/, '')}</span>
                </div>
            );
        }
        if (line.trim()) {
            return <p key={idx} className="my-1.5 text-[14px] leading-snug">{line}</p>;
        }
        return <div key={idx} className="h-1.5" />;
    };

    return (
        <div className={`flex-1 flex flex-col relative min-h-0 overflow-hidden transition-colors duration-300 bg-theme-bg`}>

            {/* ═══ Header ═══ */}
            <div className={`px-6 py-5 flex items-center justify-between z-30 glass-3d-elevated border-b rounded-b-3xl mx-4 mt-4 bg-theme-surface/80 backdrop-blur-2xl border-theme-border/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
                <div className="flex items-center gap-4 group cursor-default">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br from-theme-primary to-theme-secondary shadow-xl shadow-theme-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <BrainCircuit className="w-6 h-6 text-theme-bg" />
                    </div>
                    <div>
                        <h2 className={`text-lg font-black tracking-tightest bg-gradient-to-r from-theme-secondary via-theme-primary to-theme-secondary bg-clip-text text-transparent uppercase`}>
                            Neural Query
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse shadow-[0_0_8px_var(--theme-primary)]" />
                            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Auremous AI Core v3.0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Chat Area ═══ */}
            <div ref={containerRef} className={`flex-1 overflow-y-auto px-4 sm:px-6 custom-scrollbar-thin z-10 ${messages.length === 0 ? 'flex flex-col py-0' : 'py-6'}`}>
                {messages.length === 0 && (
                    <div className="max-w-3xl mx-auto flex-1 w-full flex flex-col items-center justify-center space-y-12 relative spotlight">
                        {/* Ambient orbs behind hero */}
                        <div className="hero-orb" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(var(--theme-primary), 0.08) 0%, transparent 70%)', top: '20%', left: '10%', animationDuration: '14s' }} />
                        <div className="hero-orb" style={{ width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(var(--theme-secondary), 0.06) 0%, transparent 70%)', bottom: '10%', right: '10%', animationDuration: '18s', animationDelay: '-6s' }} />

                        {/* Welcome Header */}
                        <div className="text-center space-y-6 relative z-10">
                            {/* Gold AUREM Logo */}
                            <div className={`transition-all duration-1000 transform ${typedGreeting.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} flex flex-col items-center gap-4`}>
                                <AuremLogo className="w-16 h-16 drop-shadow-[0_0_25px_rgba(201,165,90,0.6)]" />
                                <h1 className="font-serif italic font-light text-5xl tracking-widest text-[#c9a55a] drop-shadow-[0_0_25px_rgba(201,165,90,0.4)] select-none">
                                    Auremous
                                </h1>
                            </div>

                            {/* Typing Greeting */}
                            <h2 className="text-3xl md:text-4xl font-black tracking-tightest text-theme-text h-10 flex items-center justify-center gap-1">
                                {typedGreeting}
                                {!showChatUI && <span className="w-0.5 h-8 bg-theme-primary animate-pulse" />}
                            </h2>

                            {/* Subtitle */}
                            <div className={`transition-all duration-1000 ${showChatUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <p className="text-theme-muted max-w-lg mx-auto leading-relaxed text-sm" style={{ opacity: 0.85 }}>
                                    I understand concepts deeply and guide you step-by-step. I never give full answers until you understand the "why".
                                </p>
                            </div>
                        </div>


                        {/* What to help with prompt */}
                        <div className={`text-center transition-all duration-1000 relative z-10 ${showChatUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                            <p className="text-theme-primary text-base font-semibold tracking-wide">
                                What can I help you with today?
                            </p>
                            <p className="text-theme-muted text-xs mt-2 opacity-60">
                                Type a question, paste a problem, or upload an image below.
                            </p>
                        </div>
                    </div>
                )}

                {messages.length > 0 && messages.map((msg, i) => (
                    <div key={i} className={`flex w-full animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}>
                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                            {/* Sender badge */}
                            <div className="flex items-center mb-1.5 px-1 gap-2">
                                {msg.role === 'assistant' && (
                                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                                        <AuraEmoji className="w-5 h-5" mood={getAuraMood(msg.content)} />
                                    </div>
                                )}
                                <span className={`text-[10px] font-bold uppercase tracking-wider
                                    ${msg.role === 'user' ? 'text-theme-muted' : 'text-theme-primary'}
                                `}>
                                    {msg.role === 'user' ? 'You' : 'Auremous'}
                                </span>
                                <span className="text-[10px] text-theme-muted opacity-50">{msg.timestamp}</span>
                            </div>

                            {/* Message Bubble */}
                            <div className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-500
                                 ${msg.role === 'user'
                                    ? 'bg-theme-surface border border-theme-primary/30 text-theme-primary rounded-tr-none msg-bubble-user'
                                    : msg.isError
                                        ? `bg-red-500/10 border border-red-500/30 text-red-500 rounded-tl-none`
                                        : `border border-theme-border rounded-tl-none msg-bubble-ai holo-shimmer`
                                }
                             `}>
                                {msg.isSyllabusVerified && (
                                    <div className="mb-2.5 inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                        <BookOpen className="w-3 h-3 mr-1.5" /> Context Verified
                                    </div>
                                )}

                                {msg.image && (
                                    <div className="mb-3 rounded-xl overflow-hidden shadow-md">
                                        <img src={msg.image} alt="Uploaded" className="w-full h-auto max-h-52 object-cover" />
                                    </div>
                                )}

                                <div className={`${msg.role === 'user' ? 'text-theme-primary' : 'text-theme-text'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap text-[15px] leading-snug font-medium">{msg.content}</div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            {msg.content.split('\n').map((line, idx) => renderLine(line, idx))}
                                        </div>
                                    )}
                                </div>

                                {/* NLP Feedback Tools */}
                                {msg.role === 'assistant' && !msg.isError && (
                                    <div className="mt-4 pt-3 border-t border-theme-border flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleFeedback(i, 'up')}
                                                className={`p-1.5 rounded-lg transition-colors duration-200 ${feedbackState[i] === 'up' ? 'bg-emerald-500/20 text-emerald-500' : 'text-theme-muted hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleFeedback(i, 'down')}
                                                className={`p-1.5 rounded-lg transition-colors duration-200 ${feedbackState[i] === 'down' ? 'bg-rose-500/20 text-rose-500' : 'text-theme-muted hover:text-rose-500 hover:bg-rose-500/10'}`}
                                            >
                                                <ThumbsDown className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setRefiningMsgIdx(refiningMsgIdx === i ? null : i)}
                                                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-theme-muted hover:text-theme-primary transition-colors border border-transparent hover:border-theme-primary/30 rounded-lg"
                                            >
                                                <PenTool className="w-3 h-3" /> Refine Behavior
                                            </button>
                                        </div>
                                        
                                        {refiningMsgIdx === i && (
                                            <div className="flex items-center gap-2 animate-fade-in-up mt-1">
                                                <input 
                                                    type="text" 
                                                    value={refineInput}
                                                    onChange={(e) => setRefineInput(e.target.value)}
                                                    placeholder="E.g., Be more concise, use simpler analogies..." 
                                                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-theme-bg border border-theme-border text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-theme-primary/50"
                                                />
                                                <button 
                                                    onClick={() => submitRefinement(i)}
                                                    className="p-2 bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-theme-bg rounded-lg border border-theme-primary/30 transition-colors"
                                                >
                                                    <Send className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex justify-start animate-fade-in pl-1">
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                                <AuraEmoji className="w-5 h-5" mood="thinking" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary">Auremous</span>
                        </div>
                    </div>
                )}
                {isLoading && (
                    <div className="flex justify-start pl-1">
                        <div className={`px-5 py-4 rounded-2xl rounded-tl-md flex items-center gap-2.5 msg-bubble-ai border border-theme-border`}>
                            <div className="typing-dot-premium" />
                            <div className="typing-dot-premium" />
                            <div className="typing-dot-premium" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ═══ Input Area ═══ */}
            <div className={`p-4 z-20 backdrop-blur-xl border-t bg-theme-bg/80 border-theme-border/50 transition-all duration-1000 ${showChatUI || messages.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="max-w-3xl mx-auto space-y-2">
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="flex items-center gap-3 animate-slide-up">
                            <div className="relative group">
                                <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border-2 border-theme-primary/50 shadow-md" />
                                <button
                                    onClick={clearImage}
                                    className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>
                            <span className="text-xs text-theme-primary font-semibold">Image attached</span>
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                        {/* Image Upload */}
                        <div className="relative flex-shrink-0">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`p-3 rounded-2xl border transition-all duration-200 relative border-theme-border bg-theme-surface hover:bg-theme-surface text-theme-muted hover:text-theme-primary`}
                                title={isPro ? "Upload Image" : "Upload Image (Pro)"}
                            >
                                <Image className="w-5 h-5" />
                                {!isPro && (
                                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 shadow-sm">
                                        <Crown className="w-2 h-2 text-white" />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Text Input */}
                        <div className="flex-1 relative input-premium rounded-2xl">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={selectedImage ? "Ask about this image..." : "Ask Auremous anything..."}
                                className={`w-full py-3.5 pl-5 pr-12 rounded-2xl text-[14px] font-medium outline-none transition-all duration-200 bg-theme-surface/80 backdrop-blur-xl text-theme-text placeholder:text-theme-muted border border-theme-border/50 focus:border-theme-primary/40`}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-theme-primary to-theme-secondary hover:brightness-110 disabled:opacity-30 text-theme-bg rounded-xl shadow-md transition-all active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                <p className={`text-center mt-3 text-[10px] uppercase tracking-widest text-theme-muted/50`}>
                    Made with ❤️ by Praneet Priyansh for students
                </p>
            </div>
        </div>
    );
};

export default DoubtSolver;
