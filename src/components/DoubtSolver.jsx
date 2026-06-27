import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, AuremLogo, AuraEmoji, User, Bot, Loader2, Send, BookOpen, Clock, BrainCircuit, X, Crown, RefreshCw, ThumbsUp, ThumbsDown, PenTool, Activity, FileText } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { useLearnLoop } from '../contexts/LearnLoopContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { callAI as callGroq } from '../utils/apiRouter';
import { nccSyllabusData } from '../data/nccSyllabusData';

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
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);

    const [typedGreeting, setTypedGreeting] = useState('');
    const [showChatUI, setShowChatUI] = useState(false);
    const [feedbackState, setFeedbackState] = useState({});

    const getAuraMood = (content) => {
        if (!content) return 'thinking';
        const lower = content.toLowerCase();
        if (lower.includes('sorry') || lower.includes('unfortunately') || lower.includes('error')) return 'empathetic';
        if (lower.includes('great') || lower.includes('excellent') || lower.includes('perfect')) return 'excited';
        if (lower.includes('think') || lower.includes('consider') || lower.includes('let\'s') || lower.includes('?')) return 'thinking';
        return 'happy';
    };

    useEffect(() => {
        const activeChat = chats.find(c => c.id === activeChatId);
        if (activeChat && activeChat.feature === 'doubt-solver') {
            setMessages(activeChat.messages || []);
        } else if (!activeChatId || (activeChat && activeChat.feature !== 'doubt-solver')) {
            setMessages([]);
        }
    }, [activeChatId, chats]);

    useEffect(() => {
        const name = currentUser?.displayName?.split(' ')[0] || 'Cadet';
        const fullText = `Hi, ${name}.`;
        let i = 0;
        if (containerRef.current) containerRef.current.scrollTop = 0;
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if ((!input.trim() && !image) || isLoading) return;

        const userQuestion = input.trim() || 'Analyze this image.';
        const imageToSend = image;
        setInput('');
        setImage(null);

        const newMessage = {
            role: 'user',
            content: userQuestion,
            image: imageToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const currentActiveChat = chats.find(c => c.id === activeChatId);
        let chatId = activeChatId;

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        if (!chatId || (currentActiveChat && currentActiveChat.feature !== 'doubt-solver')) {
            const title = userQuestion ? userQuestion.substring(0, 30) + '...' : 'Neural Query';
            chatId = startNewChat('doubt-solver', [newMessage], title);
        } else {
            addMessageToChat(chatId, newMessage);
        }

        const globalContext = getGlobalContextStr();
        const effectiveLevel = understandingLevel || getDifficultyLevel(null) || 'intermediate';
        
        // Extract RAG context from the NCC Syllabus
        const ragContext = `
        === OFFICIAL NCC SYLLABUS RAG DATABASE ===
        The following is the official, verified NCC Syllabus Data. You MUST use this data to answer any question related to NCC.
        
        COMMON SUBJECTS:
        ${nccSyllabusData.common.map(c => `Chapter: ${c.chapterName} (${c.topicName})\nNotes: ${c.notes}`).join('\n')}
        
        ARMY WING:
        ${nccSyllabusData.army.map(c => `Chapter: ${c.chapterName} (${c.topicName})\nNotes: ${c.notes}`).join('\n')}
        
        NAVY WING:
        ${nccSyllabusData.navy.map(c => `Chapter: ${c.chapterName} (${c.topicName})\nNotes: ${c.notes}`).join('\n')}
        
        AIR FORCE WING:
        ${nccSyllabusData.airforce.map(c => `Chapter: ${c.chapterName} (${c.topicName})\nNotes: ${c.notes}`).join('\n')}
        ==========================================
        `;

        const systemPrompt = `You are "Neural Query", an advanced AI assistant built into the Samvada NCC Cadet Portal.
        Your primary role is to help cadets master their NCC syllabus, understand military concepts, and solve doubts.
        
        ${ragContext}
        
        RULES & IDENTITY:
        - Tone: Elite. Intelligent. Calm. Structured.
        - You are training a cadet who needs strict discipline, deep understanding, and military precision.
        - Every response must feel written personally for this specific student. Never give vague or copy-paste answers.
        - Pure cognitive clarity. No fluff. No filler.

        OUTPUT FORMAT:
        1. **Structure**: For academic/complex questions, use Markdown with clear headers (## Summary, ## Explanation, etc).
        2. **Conversational**: IF the user is just saying 'hi', 'hello', or greeting you, DO NOT use the strict academic Structure. Just reply in a brief, friendly, human-like but elite conversational manner.
        3. **Direct Answer**: Be concise and logical. No meta-commentary.
        4. **Logical Consistency**: Ensure your explanation flows logically. Never contradict yourself.
        5. **Vision**: If an image is provided, analyze it thoroughly and precisely.
        
        CURRENT USER PERFORMANCE LEVEL: ${effectiveLevel.toUpperCase()}
        -> IF EASY/BEGINNER: Explain concepts very simply, use relatable analogies, break down steps completely.
        -> IF INTERMEDIATE: Balance theory with practical steps, assume some base knowledge.
        -> IF HARD/ADVANCED: Be extremely concise, highly technical, and focus on profound insights and advanced applications.
        -> IF EXPERT: Give only the highest-level principles, mathematical/theoretical proofs, and assume mastery of prerequisites.
        
        -> IF EXPERT: Give only the highest-level principles, mathematical/theoretical proofs, and assume mastery of prerequisites.
        
        ${globalContext}
        
        ${globalInstructions ? `\nGLOBAL CUSTOM INSTRUCTIONS (PRIORITIZE THESE):\n${globalInstructions}` : ''}`;

        try {
            let apiMessages;

            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            
            apiMessages = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory,
                { 
                    role: 'user', 
                    content: imageToSend 
                        ? [{ type: 'text', text: userQuestion }, { type: 'image_url', image_url: { url: imageToSend } }] 
                        : userQuestion 
                }
            ];

            const result = await callGroq(apiMessages, null, !!imageToSend);

            if (result.error) {
                throw new Error(result.error);
            }

            const responseText = result.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

            const assistantMsg = {
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => [...prev, assistantMsg]);
            addMessageToChat(chatId, assistantMsg);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${err.message}`,
                isError: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = (idx, type) => {
        setFeedbackState(prev => ({ ...prev, [idx]: type }));
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
            <div className={`shrink-0 sticky top-0 px-6 py-5 flex items-center justify-between z-40 bg-theme-bg/90 backdrop-blur-2xl border-b border-theme-border/30`}>
                <div className="flex items-center gap-4 group cursor-default">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br from-theme-primary to-theme-secondary shadow-xl shadow-theme-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <BrainCircuit className="w-6 h-6 text-theme-bg" />
                    </div>
                    <div>
                        <h2 className={`text-lg font-light tracking-widest text-theme-primary drop-shadow-[0_0_15px_rgba(var(--theme-primary),0.3)]`}>
                            Neural Query
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse shadow-[0_0_8px_var(--theme-primary)]" />
                            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Document RAG Intelligence</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Chat Area ═══ */}
            <div ref={containerRef} className={`flex-1 overflow-y-auto px-4 sm:px-6 custom-scrollbar-thin z-10 ${messages.length === 0 ? 'flex flex-col py-0' : 'py-6'}`}>
                {messages.length === 0 && (
                    <div className="max-w-3xl mx-auto flex-1 w-full flex flex-col items-center justify-center space-y-12 relative spotlight">
                        <div className="text-center space-y-6 relative z-10">
                            <div className={`transition-all duration-1000 transform ${typedGreeting.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} flex flex-col items-center gap-4`}>
                                <BrainCircuit className="w-16 h-16 text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.6)]" />
                                <h1 className="font-serif italic font-light text-5xl tracking-widest text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.4)] select-none">
                                    Samvada
                                </h1>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-serif italic font-light tracking-wide text-theme-text h-10 flex items-center justify-center gap-1">
                                {typedGreeting}
                                {!showChatUI && <span className="w-0.5 h-8 bg-theme-primary animate-pulse" />}
                            </h2>

                            <div className={`transition-all duration-1000 ${showChatUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <p className="text-theme-muted max-w-lg mx-auto leading-relaxed text-sm" style={{ opacity: 0.85 }}>
                                    I am integrated with the centralized NCC RAG system. I have deep knowledge of the syllabus, handbooks, and standard operating procedures. Ask me anything.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {messages.length > 0 && messages.map((msg, i) => (
                    <div key={i} className={`flex w-full animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}>
                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center mb-1.5 px-1 gap-2">
                                {msg.role === 'assistant' && (
                                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                                        <AuraEmoji className="w-5 h-5" mood={getAuraMood(msg.content)} />
                                    </div>
                                )}
                                <span className={`text-[10px] font-bold uppercase tracking-wider
                                    ${msg.role === 'user' ? 'text-theme-muted' : 'text-theme-primary'}
                                `}>
                                    {msg.role === 'user' ? 'You' : 'Samvada'}
                                </span>
                            </div>

                            <div className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-500
                                 ${msg.role === 'user'
                                    ? 'bg-theme-surface border border-theme-primary/30 text-theme-primary rounded-tr-none msg-bubble-user'
                                    : msg.isError
                                        ? `bg-red-500/10 border border-red-500/30 text-red-500 rounded-tl-none`
                                        : `border border-theme-border rounded-tl-none msg-bubble-ai holo-shimmer`
                                }
                             `}>


                                <div className={`${msg.role === 'user' ? 'text-theme-primary' : 'text-theme-text'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap text-[15px] leading-snug font-medium">
                                            {msg.image && (
                                                <img src={msg.image} alt="User Upload" className="max-w-full h-auto rounded-xl mb-3 border border-theme-primary/20" />
                                            )}
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            {msg.content.split('\n').map((line, idx) => renderLine(line, idx))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start pl-1 pt-4">
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
                    


                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2.5">
                        {image && (
                            <div className="relative inline-block self-start mb-2">
                                <img src={image} alt="Preview" className="h-20 w-auto rounded-lg border border-theme-primary/30" />
                                <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 p-1 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-2.5 w-full">
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="shrink-0 p-3.5 rounded-2xl bg-theme-surface border border-theme-border/50 text-theme-muted hover:text-theme-primary transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </button>
                            
                            {/* Text Input */}
                            <div className="flex-1 relative input-premium rounded-2xl">
                                <input
                                    type="text"
                                    value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className={`w-full py-3.5 pl-5 pr-12 rounded-2xl text-[14px] font-medium outline-none transition-all duration-200 bg-theme-surface/80 backdrop-blur-xl text-theme-text placeholder:text-theme-muted border border-theme-border/50 focus:border-theme-primary/40`}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-theme-primary to-theme-secondary hover:brightness-110 disabled:opacity-30 text-theme-bg rounded-xl shadow-md transition-all active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoubtSolver;
