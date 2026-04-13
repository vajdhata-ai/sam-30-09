import React, { useEffect, useState } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import * as Icons from './Icons';

const CharacterAssistant = () => {
    const { character, message, isSpeaking } = useAssistant();
    const [renderMsg, setRenderMsg] = useState('');
    const [typingIdx, setTypingIdx] = useState(0);

    const IconData = Icons[character.icon] || Icons.Sparkles;

    // Typewriter effect
    useEffect(() => {
        if (!isSpeaking || !message) {
            setRenderMsg('');
            setTypingIdx(0);
            return;
        }

        const typingTimer = setInterval(() => {
            setTypingIdx((prev) => {
                if (prev < message.length) {
                    setRenderMsg((r) => r + message.charAt(prev));
                    return prev + 1;
                }
                clearInterval(typingTimer);
                return prev;
            });
        }, 30); // 30ms per character

        return () => clearInterval(typingTimer);
    }, [message, isSpeaking]);

    return (
        <div className="fixed bottom-6 right-8 z-[9000] flex items-end gap-3 pointer-events-none" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}>
            
            {/* The Speech Bubble (Slides in/out) */}
            <div className={`
                relative px-6 py-4 rounded-[20px] rounded-br-[4px]
                bg-theme-surface/70 backdrop-blur-3xl border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                transform ${isSpeaking ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}
            `} style={{ borderColor: character.color, boxShadow: `0px 4px 15px ${character.color}40`, maxWidth: '350px' }}>
                <p className="font-serif italic font-light text-theme-text/80 text-sm mb-1">
                    {character.name}
                </p>
                <p className="text-theme-text font-medium text-[15px] leading-relaxed tracking-wide">
                    {renderMsg}{renderMsg.length < (message?.length || 0) && <span className="animate-pulse">_</span>}
                </p>
            </div>

            {/* The Character Avatar (Persistent) */}
            <div className={`
                flex items-center justify-center p-3 rounded-2xl
                transition-all duration-500 transform
            `} style={{ 
                backgroundColor: `${character.color}15`, 
                border: `2px solid ${character.color}`,
                boxShadow: isSpeaking ? `0px 0px 30px ${character.color}` : `0px 0px 10px ${character.color}60`
            }}>
                <IconData className={`w-8 h-8 ${isSpeaking ? 'animate-pulse' : 'opacity-80'}`} style={{ color: character.color }} />
            </div>

        </div>
    );
};

export default CharacterAssistant;
