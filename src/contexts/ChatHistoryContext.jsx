import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ChatHistoryContext = createContext();

export const useChatHistory = () => useContext(ChatHistoryContext);

export const ChatHistoryProvider = ({ children }) => {
    const { currentUser } = useAuth();
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

    // Load from local storage and Firebase
    useEffect(() => {
        const loadChats = async () => {
            try {
                const savedChats = localStorage.getItem('aurem_global_chats');
                if (savedChats) {
                    setChats(JSON.parse(savedChats));
                }
                
                if (currentUser?.uid && isHistoryEnabled) {
                    const docRef = doc(db, 'userChats', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const cloudChats = docSnap.data().chats || [];
                        setChats(cloudChats);
                        localStorage.setItem('aurem_global_chats', JSON.stringify(cloudChats));
                    }
                }
            } catch (err) {
                console.error('Failed to load chats', err);
            }
        };
        loadChats();
    }, [currentUser, isHistoryEnabled]);

    // Save to local storage and Firebase whenever chats change
    useEffect(() => {
        if (!isHistoryEnabled) return;
        
        const saveChats = async () => {
            try {
                localStorage.setItem('aurem_global_chats', JSON.stringify(chats));
                if (currentUser?.uid && chats.length > 0) {
                    const docRef = doc(db, 'userChats', currentUser.uid);
                    await setDoc(docRef, { chats }, { merge: true });
                }
            } catch (err) {
                console.error('Failed to save chats', err);
            }
        };
        
        // Debounce saving to Firestore to avoid too many writes
        const timeoutId = setTimeout(saveChats, 1000);
        return () => clearTimeout(timeoutId);
    }, [chats, isHistoryEnabled, currentUser]);

    const startNewChat = (feature, initialMessages = [], title = 'New Conversation') => {
        const id = Date.now().toString();
        const newChat = {
            id,
            feature,
            title,
            messages: initialMessages,
            updatedAt: Date.now()
        };
        setChats(prev => {
            const updated = [newChat, ...prev];
            return updated.slice(0, 50); // Cap at 50 chats to prevent overflow
        });
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
        if (currentUser?.uid) {
            setDoc(doc(db, 'userChats', currentUser.uid), { chats: [] }, { merge: true }).catch(console.error);
        }
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
