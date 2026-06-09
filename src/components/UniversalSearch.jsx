import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, Bot, FileText, ArrowRight, BrainCircuit, Activity } from './Icons';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useLearnLoop } from '../contexts/LearnLoopContext';

const UniversalSearch = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { chats, switchChat } = useChatHistory();
    const { masteryHistory } = useLearnLoop();
    const inputRef = useRef(null);

    // Keyboard shortcut to open Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        const handleOpenEvent = () => setIsOpen(true);
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('open-universal-search', handleOpenEvent);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-universal-search', handleOpenEvent);
        };
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        } else {
            setQuery(''); // Reset query on close
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Search Logic
    const searchResults = () => {
        if (!query.trim()) return [];
        
        const q = query.toLowerCase();
        let results = [];

        // Global Features
        const features = [
            { id: 'doubt-solver', title: 'Neural Query', icon: <Bot className="w-5 h-5 text-gold" /> },
            { id: 'document-study', title: 'Auremous Lens', icon: <FileText className="w-5 h-5 text-gold" /> },
            { id: 'quiz-assessment', title: 'Adaptive Testing', icon: <Activity className="w-5 h-5 text-gold" /> },
            { id: 'learn-loop', title: 'Mastery Lifecycle', icon: <BrainCircuit className="w-5 h-5 text-gold" /> }
        ];

        features.forEach(f => {
            if (f.title.toLowerCase().includes(q)) {
                results.push({
                    id: f.id,
                    type: 'feature',
                    title: f.title,
                    subtitle: 'Ecosystem Tool',
                    icon: f.icon
                });
            }
        });

        // Search Chats
        chats.forEach(chat => {
            if (chat.title && chat.title.toLowerCase().includes(q)) {
                results.push({
                    id: chat.id,
                    type: 'chat',
                    title: chat.title,
                    subtitle: `Chat • ${chat.feature || 'Neural Query'}`,
                    icon: <Bot className="w-5 h-5 text-violet-400" />
                });
            } else {
                // Deep search in messages
                const match = chat.messages?.find(m => m.text?.toLowerCase().includes(q));
                if (match) {
                    results.push({
                        id: chat.id,
                        type: 'chat',
                        title: chat.title || 'Untitled Chat',
                        subtitle: `Message match: "${match.text.substring(0, 40)}..."`,
                        icon: <FileText className="w-5 h-5 text-blue-400" />
                    });
                }
            }
        });

        // Dedup
        return results.slice(0, 6);
    };

    const results = searchResults();

    const handleSelect = (result) => {
        if (result.type === 'chat') {
            switchChat(result.id);
            if (onNavigate) {
                const chat = chats.find(c => c.id === result.id);
                if (chat && chat.feature) onNavigate(chat.feature);
            }
        } else if (result.type === 'feature') {
            if (onNavigate) onNavigate(result.id);
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-[#0c0906]/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="relative z-10 w-full max-w-2xl bg-[#14100c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-down">
                
                {/* Search Header */}
                <div className="flex items-center px-4 py-4 border-b border-white/5 bg-[#1a1510]">
                    <Search className="w-6 h-6 text-theme-primary opacity-70" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search chats, concepts, or tools..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-lg px-4 placeholder-white/30"
                    />
                    <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                        <Command className="w-3 h-3" /> <span className="hidden md:inline">/ CTRL +</span> K
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {!query.trim() ? (
                        <div className="py-12 text-center flex flex-col items-center">
                            <BrainCircuit className="w-12 h-12 text-theme-primary/20 mb-4" />
                            <p className="text-white/40 text-sm font-medium">Type anything to search across your cognitive ecosystem.</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((result, idx) => (
                                <button
                                    key={`${result.id}-${idx}`}
                                    onClick={() => handleSelect(result)}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-theme-primary/10 transition-colors text-left group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-theme-primary/20 transition-colors">
                                        {result.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold text-sm">{result.title}</h4>
                                        <p className="text-white/40 text-xs mt-0.5">{result.subtitle}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-theme-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center flex flex-col items-center">
                            <Activity className="w-12 h-12 text-rose-500/20 mb-4" />
                            <p className="text-white/40 text-sm font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="px-4 py-3 bg-[#0a0805] border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <div className="flex items-center gap-4">
                        <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-white/10 mr-1">↑↓</kbd> to navigate</span>
                        <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-white/10 mr-1">↵</kbd> to select</span>
                    </div>
                    <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-white/10 mr-1">ESC</kbd> to close</span>
                </div>
            </div>

            <style>{`
                .animate-fade-in-down { animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
        </div>
    );
};

export default UniversalSearch;
