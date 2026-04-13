import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Competitive Hub - Quick Recovery (Focus Zone Tutor)
 * Triggers when a student scores < 60% on practice.
 */
const QuickRecovery = ({ topicName, examSlug, onRecovered }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phase, setPhase] = useState('diagnosing'); // diagnosing -> teaching -> verifying

    // Initial greeting based on focus zone trigger
    useEffect(() => {
        setMessages([
            {
                role: 'assistant',
                content: `Hi ${currentUser?.displayName?.split(' ')[0] || ''}, I noticed the practice questions on **${topicName}** were a bit tricky. Don't worry, this is what the Focus Zone is for.\n\nTo help me understand, what was the most confusing part about this topic when you were answering the questions?`
            }
        ]);
    }, [topicName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const systemPrompt = `You are a specialized "Quick Recovery" AI Tutor for ${examSlug.toUpperCase()}. 
The student has failed a practice test on the topic: "${topicName}" and is in the "Focus Zone".

Current Phase: ${phase}

YOUR GOALS:
1. DIAGNOSE: Figure out *why* they got it wrong (misunderstanding a formula? missing a core concept? calculation error?).
2. TEACH: Give a hyper-targeted, 2-sentence explanation fixing *only* that specific misunderstanding. Use a memorable analogy.
3. VERIFY: Ask one very simple, direct question to prove they understand the concept now.

RULES:
- Keep responses extremely short (max 4 sentences).
- If they answer your verification question correctly, say explicitly "\[RECOVERY_COMPLETE\] Great job! You've nailed it."
- Socratic method only. Do not give them the final answer to the verification question until they try.`;

            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...newMessages.map(m => ({ role: m.role, content: m.content }))
            ];

            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/ai/groq`, {
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

            if (!res.ok) throw new Error('AI fetch failed');
            
            const data = await res.json();
            const botReply = data.choices[0].message.content;

            if (botReply.includes('[RECOVERY_COMPLETE]')) {
                const cleanedReply = botReply.replace('[RECOVERY_COMPLETE]', '').trim();
                setMessages(prev => [...prev, { role: 'assistant', content: cleanedReply }]);
                setTimeout(() => onRecovered(), 3000); // Trigger recovery upstream
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
            }
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Neural Engine sync lost. Please try again soon.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-300 dark:border-amber-500/30 shadow-lg shadow-amber-500/10 overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-3 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
                <span className="text-xl">🚑</span>
                <div>
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Focus Zone Recovery</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-500 font-medium">Let's fix the gaps in {topicName}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-amber-500 text-white rounded-br-sm' 
                                : 'bg-white dark:bg-slate-800 text-theme-text rounded-bl-sm border border-amber-200 dark:border-amber-500/20'
                        }`}>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm border border-amber-200 dark:border-amber-500/20 flex items-center gap-1.5">
                            <span className="typing-dot !bg-amber-500"></span>
                            <span className="typing-dot !bg-amber-500"></span>
                            <span className="typing-dot !bg-amber-500"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white/50 dark:bg-slate-900/50 border-t border-amber-200 dark:border-amber-500/20 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer or confusion..."
                    disabled={isLoading}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-theme-text focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 disabled:opacity-50 transition-colors shrink-0 shadow-lg shadow-amber-500/20"
                >
                    ↑
                </button>
            </form>
        </div>
    );
};

export default QuickRecovery;
