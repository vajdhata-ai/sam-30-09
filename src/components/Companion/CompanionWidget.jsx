import React, { useEffect, useState } from 'react';
import { useUniverseStore } from '../../store/universeStore';

// Pure CSS fallback so we don't crash on @rive-app/react-canvas import
export default function CompanionWidget() {
  const { activeCompanion, isSpeaking, speechAudioLevel } = useUniverseStore();
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    if (isSpeaking) {
      setBounce(speechAudioLevel / 4); // Simulate movement
    } else {
      setBounce(0);
    }
  }, [isSpeaking, speechAudioLevel]);

  if (!activeCompanion) return null;

  return (
    <div className="fixed bottom-6 right-6 w-32 h-32 pointer-events-none z-[9999] drop-shadow-2xl transition-all duration-300">
      <div 
        className={`w-full h-full rounded-full flex flex-col items-center justify-center p-4 border border-theme-border
        ${activeCompanion === 'hp' ? 'bg-gradient-to-tr from-amber-600 to-red-600' : 'bg-gradient-to-tr from-cyan-600 to-blue-800'}`}
        style={{ transform: `translateY(-${bounce}px)` }}
      >
        <span className="text-white font-bold opacity-80 text-center text-sm shadow-md">
           {activeCompanion.toUpperCase()} <br/>
           {isSpeaking ? '💬 (Speaking...)' : 'Idle'}
        </span>
      </div>
    </div>
  );
}
