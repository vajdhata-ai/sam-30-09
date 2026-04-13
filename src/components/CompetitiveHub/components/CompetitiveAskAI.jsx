import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Competitive Hub - Ask AI Tab
 * Scoped specifically to the current topic. Uses Socratic method.
 */
const CompetitiveAskAI = ({ topicName, examSlug }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Initial greeting based on topic
    useEffect(() => {
        setMessages([
            {
                role: 'assistant',
                content: `Hi ${currentUser?.displayName?.split(' ')[0] || 'there'}! I'm your dedicated tutor for **${topicName}**. What specific concept are you struggling with, or what would you like me to explain?`
            }
        ]);
    }, [topicName]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const systemPrompt = `You are an elite, world-class tutor (like Richard Feynman) preparing a student for the highly competitive ${examSlug.toUpperCase()} exam. 
            
CURRENT TOPIC Context: "${topicName}"

YOUR MISSION:
1. Explain concepts simply, using vivid real-world analogies. No jargon unless absolutely necessary (and if used, explain it instantly).
2. DO NOT just spoon-feed the answer. Use the Socratic method. Ask leading questions to help the student reach the conclusion themselves.
3. Keep responses highly focused on the competitive exam pattern. Point out common pitfalls or highly-tested angles for ${topicName}.
4. Be encouraging ("Great question!", "You're on the right track").
5. Format your response cleanly using markdown (bold for keywords, bullet points, etc.). Keep it extremely concise — they are studying, don't waste their time with walls of text. Make it punchy.`;

            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...newMessages.map(m => ({ role: m.role, content: m.content }))
            ];

            const token = await currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/ai/groq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    model: 'llama-3.3-70b-versatile'
                })
            });

            if (!res.ok) throw new Error('Failed to fetch AI response');
            
            const data = await res.json();
            const botReply = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Sorry, I lost connection to the Neural Engine. Focus on the Concept tab for now, and try again in a moment.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-theme-surface rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in duration-500">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-black mr-3 shadow-md shadow-indigo-500/20 flex-shrink-0">
                                AI
                            </div>
                        )}
                        <div>
                            {msg.role === 'assistant' && <div className="text-xs font-bold text-indigo-500 mb-1 uppercase tracking-widest">Auremous AI</div>}
                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-sm shadow-md shadow-indigo-500/20' : 'glass-input border-slate-200/50 dark:border-slate-700/50 text-theme-text rounded-bl-sm shadow-sm'}`}>
                                <p className="text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask anything about ${topicName}...`}
                    disabled={isLoading}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-theme-text focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors shrink-0 shadow-lg shadow-indigo-500/20"
                >
                    ↑
                </button>
            </form>
        </div>
    );
};

export default CompetitiveAskAI;
