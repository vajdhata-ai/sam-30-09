import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, X } from './Icons';
import { callAI } from '../utils/apiRouter';
import { useChatHistory } from '../contexts/ChatHistoryContext';

const LensChat = ({ documentContext, onClose }) => {
    const { activeChatId, chats, startNewChat, addMessageToChat } = useChatHistory();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'I am your Samvada Study Mentor. How can I help you understand this material?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const activeChat = chats.find(c => c.id === activeChatId);
        if (activeChat && activeChat.feature === 'lens-chat') {
            setMessages(activeChat.messages || []);
        } else {
            setMessages([
                { role: 'assistant', content: 'I am your Samvada Study Mentor. How can I help you understand this material?' }
            ]);
        }
    }, [activeChatId, chats]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderLine = (line, idx) => {
        if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-base font-serif italic font-bold mt-4 mb-2 text-theme-primary">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-sm font-serif italic font-bold mt-3 mb-1 text-theme-secondary">{line.replace('### ', '')}</h3>;
        }
        if (line.includes('**')) {
            const parts = line.split(/\*\*(.+?)\*\*/g);
            return (
                <p key={idx} className="my-1.5 text-sm leading-snug">
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-theme-secondary">{p}</strong> : p)}
                </p>
            );
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return (
                <div key={idx} className="flex gap-2.5 my-1 ml-1 text-sm leading-snug">
                    <span className="text-theme-primary mt-0.5">•</span>
                    <span>{line.trim().replace(/^[-•]\s*/, '')}</span>
                </div>
            );
        }
        if (line.trim()) {
            return <p key={idx} className="my-1.5 text-sm leading-snug">{line}</p>;
        }
        return <div key={idx} className="h-1.5" />;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const currentActiveChat = chats.find(c => c.id === activeChatId);
        let chatId = activeChatId;

        if (!chatId || (currentActiveChat && currentActiveChat.feature !== 'lens-chat')) {
            const title = input.substring(0, 30) + '...';
            chatId = startNewChat('lens-chat', [messages[0], userMsg], title);
        } else {
            addMessageToChat(chatId, userMsg);
        }

        try {
            const systemPrompt = `You are the Samvada Study Mentor, an elite AI tutor. 
You are currently helping the user study the topic: "${documentContext?.topic || 'General Topic'}".

Here is the highly specific context you MUST base your answers on:
Summary: ${documentContext?.summary || 'N/A'}
Notes: ${documentContext?.notes_basic || ''}

RULES:
- Answer ONLY based on the provided context. If the user asks something outside the context, politely guide them back.
- Provide step-by-step reasoning, analogies, and strictly academic tone.
- Do not make up facts.`;

            const aiMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                userMsg
            ];

            const result = await callAI(aiMessages, null, false);
            const responseText = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
            
            const aiMsg = { role: 'assistant', content: responseText };
            setMessages(prev => [...prev, aiMsg]);
            addMessageToChat(chatId, aiMsg);
        } catch (error) {
            console.error("LensChat error:", error);
            const errorMsg = { role: 'assistant', content: "An error occurred while connecting to the neural network." };
            setMessages(prev => [...prev, errorMsg]);
            addMessageToChat(chatId, errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-theme-surface/80 backdrop-blur-xl w-full shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-theme-border/50 bg-theme-surface/90 backdrop-blur-xl sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-theme-primary/10 rounded-xl border border-theme-primary/15">
                        <Sparkles className="w-4 h-4 text-theme-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black uppercase tracking-widest text-theme-text text-sm">Study Mentor</h3>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-theme-primary">Samvada Lens AI</p>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-xl text-theme-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Close AI Tutor"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-theme-primary text-theme-bg' : 'bg-theme-bg border border-theme-border/50 text-theme-primary'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-theme-primary text-theme-bg rounded-tr-md' : 'bg-theme-bg/80 border border-theme-border/30 text-theme-text rounded-tl-md'}`}>
                            {msg.content.split('\n').map((line, i) => renderLine(line, i))}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-theme-bg border border-theme-border/50 text-theme-primary flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-theme-bg/80 border border-theme-border/30 rounded-tl-md flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-theme-primary animate-spin" />
                            <span className="text-xs text-theme-muted uppercase tracking-widest font-bold">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-theme-surface/90 border-t border-theme-border/50">
                <div className="flex items-center gap-2 bg-theme-bg/80 rounded-xl border border-theme-border/40 p-1.5 focus-within:border-theme-primary/40 transition-colors">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for clarification..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-theme-text focus:outline-none placeholder:text-theme-muted/50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-lg bg-theme-primary text-theme-bg disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-theme-primary/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LensChat;
