import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme, THEMES } from './ThemeContext';

const AssistantContext = createContext(undefined);

const CHARACTER_DATA = {
    // Add default fallback for generic themes
    default: {
        name: 'Auremous Core',
        icon: 'Brain',
        voicePitch: 1.0,
        voiceRate: 1.0,
        color: 'var(--theme-primary)',
        lines: {
            hello: ["Auremous Core V3 initialized. How can I help?", "System online."],
            goodbye: ["Shutting down.", "Goodbye."],
            nav_doubt: ["Opening Neural Query module.", "Initializing doubt solver."],
            nav_arena: ["Entering Cognitive Colosseum.", "Preparing competitive modules."],
            nav_exam: ["Accessing exam prep.", "Loading study materials."],
            default_click: ["Processing.", "Done.", "Navigating."]
        }
    }
};

export const AssistantProvider = ({ children }) => {
    const { theme } = useTheme();
    const [message, setMessage] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const character = CHARACTER_DATA[theme] || CHARACTER_DATA.default;

    const speak = useCallback(() => {
        // AI companion removed, speak is now a silent no-op
    }, []);

    // When theme changes, trigger Hello!
    useEffect(() => {
    }, [theme]); // Run whenever theme swaps

    return (
        <AssistantContext.Provider value={{
            character,
            message,
            isSpeaking,
            speak
        }}>
            {children}
        </AssistantContext.Provider>
    );
};

export const useAssistant = () => {
    const context = useContext(AssistantContext);
    if (!context) throw new Error("useAssistant must be used within AssistantProvider");
    return context;
};
