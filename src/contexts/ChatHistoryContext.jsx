import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatHistoryContext = createContext();

export const useChatHistory = () => useContext(ChatHistoryContext);

export const ChatHistoryProvider = ({ children }) => {
    // Structure: [{ id: string, feature: string, title: string, messages: [], updatedAt: number }]
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isHistoryEnabled, setIsHistoryEnabledState] = useState(() => {
        try {
             const saved = localStorage.getItem('aurem_history_enabled');
             return saved !== null ? JSON.parse(saved) : true;
        } catch (err) {
             return true;
        }
    });

    const setHistoryEnabled = (enabled) => {
        setIsHistoryEnabledState(enabled);
        localStorage.setItem('aurem_history_enabled', JSON.stringify(enabled));
        if (!enabled) {
            clearHistory();
        }
    };

    // Load from local storage
    useEffect(() => {
        try {
            const savedChats = localStorage.getItem('aurem_global_chats');
            if (savedChats) {
                setChats(JSON.parse(savedChats));
            }
        } catch (err) {
            console.error('Failed to load chats from local storage', err);
        }
    }, []);

    // Save to local storage whenever chats change
    useEffect(() => {
        if (!isHistoryEnabled) return;
        try {
            localStorage.setItem('aurem_global_chats', JSON.stringify(chats));
        } catch (err) {
            console.error('Failed to save chats to local storage', err);
        }
    }, [chats, isHistoryEnabled]);

    const startNewChat = (feature, initialMessages = [], title = 'New Conversation') => {
        const id = Date.now().toString();
        const newChat = {
            id,
            feature,
            title,
            messages: initialMessages,
            updatedAt: Date.now()
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(id);
        return id;
    };

    const addMessageToChat = (chatId, message) => {
        setChats(prev => prev.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, message],
                    updatedAt: Date.now()
                };
            }
            return chat;
        }).sort((a, b) => b.updatedAt - a.updatedAt));
    };

    const updateChatTitle = (chatId, title) => {
        setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title } : chat));
    };

    const deleteChat = (chatId) => {
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    const getActiveChat = () => {
        return chats.find(c => c.id === activeChatId) || null;
    };

    const clearHistory = () => {
        setChats([]);
        setActiveChatId(null);
        localStorage.removeItem('aurem_global_chats');
    };

    // Generate a context string representing recent discussions across all features.
    // This allows the AI to "remember" concepts from previous chats.
    const getGlobalContextStr = () => {
        // Grab the most recent 3-5 discussions to avoid context window explosion
        const recentChats = chats.slice(0, 3).filter(c => c.id !== activeChatId && c.messages.length > 0);

        if (recentChats.length === 0) return '';

        const contextLines = [];
        contextLines.push('--- RECENT STUDENT CONTEXT FROM PAST SESSIONS (USE FOR REFERENCE IF RELEVANT) ---');

        recentChats.forEach(chat => {
            contextLines.push(`[Topic: ${chat.title} | Feature: ${chat.feature}]`);
            // Summarize by grabbing only user prompts to get a sense of what the student is studying
            const userPrompts = chat.messages
                .filter(m => m.role === 'user')
                .map(m => `- ${m.content || m.text || 'Image Upload'}`)
                .slice(-3); // at most 3 recent queries from that chat

            if (userPrompts.length > 0) {
                contextLines.push(userPrompts.join('\n'));
            }
            contextLines.push('');
        });

        contextLines.push('--- END PAST CONTEXT ---');
        return contextLines.join('\n');
    };

    return (
        <ChatHistoryContext.Provider value={{
            chats,
            activeChatId,
            setActiveChatId,
            startNewChat,
            addMessageToChat,
            updateChatTitle,
            deleteChat,
            clearHistory,
            getActiveChat,
            getGlobalContextStr,
            isHistoryEnabled,
            setHistoryEnabled
        }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};
