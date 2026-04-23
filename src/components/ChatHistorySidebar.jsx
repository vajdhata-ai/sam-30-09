import React from 'react';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { MessageSquare, Trash2, X, GraduationCap, Bot } from './Icons';

const ChatHistorySidebar = ({ isOpen, onClose, onSelectChat }) => {
    const { chats, deleteChat, activeChatId, clearHistory } = useChatHistory();

    const getIcon = (feature) => {
        if (feature === 'college-compass') return <GraduationCap className="w-4 h-4" />;
        return <Bot className="w-4 h-4" />;
    };

    const getFeatureName = (feature) => {
        if (feature === 'college-compass') return 'Counselor';
        if (feature === 'doubt-solver') return 'Neural Query';
        return feature;
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 right-0 h-full w-[300px] sm:w-[350px] glass-ultra border-l border-theme-border/30 z-[70] shadow-depth-xl transition-transform duration-500
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                flex flex-col sidebar-edge-light
            `}>
                <div className="p-5 border-b border-theme-border flex justify-between items-center bg-theme-bg/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-theme-primary" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-theme-text">Global History</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-theme-bg rounded-full text-theme-muted hover:text-theme-text transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar-thin">
                    {chats.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-theme-muted space-y-3 opacity-50">
                            <MessageSquare className="w-10 h-10" />
                            <p className="text-xs font-bold uppercase tracking-widest text-center">No past<br />conversations yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chats.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`
                                        group p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden holo-shimmer
                                        ${activeChatId === chat.id ? 'bg-theme-primary/10 border-theme-primary/40 shadow-lg shadow-theme-primary/20 nav-active-glow' : 'bg-theme-bg/30 border-theme-border/40 hover:border-theme-primary/30 hover:bg-theme-surface/50 hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.05)]'}
                                    `}
                                    onClick={() => onSelectChat(chat.feature, chat.id)}
                                >
                                    {/* Active indicator handled by nav-active-glow CSS */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className={`p-1.5 rounded-md ${activeChatId === chat.id ? 'bg-theme-primary text-theme-bg' : 'bg-theme-bg text-theme-primary border border-theme-primary/30'}`}>
                                                    {getIcon(chat.feature)}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-theme-muted">{getFeatureName(chat.feature)}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-theme-text truncate group-hover:text-theme-primary transition-colors">{chat.title || 'Conversation'}</h4>
                                            <p className="text-xs text-theme-muted truncate mt-1">
                                                {chat.messages.length > 0 ? (chat.messages[chat.messages.length - 1].text || chat.messages[chat.messages.length - 1].content || 'Image Upload') : 'Empty'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between h-full">
                                            <span className="text-[9px] font-bold text-theme-muted uppercase mb-2">
                                                {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                                                className="p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-400/20 rounded-md transition-all translate-y-2 group-hover:translate-y-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {chats.length > 0 && (
                    <div className="p-4 border-t border-theme-border bg-theme-surface">
                        <button
                            onClick={clearHistory}
                            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Clear All History
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatHistorySidebar;
