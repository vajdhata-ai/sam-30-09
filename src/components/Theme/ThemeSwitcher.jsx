import React from 'react';
import { useUniverseStore } from '../../store/universeStore';
import { Sparkles, Shield, Wand2 } from 'lucide-react'; // Fallback icons, make sure they are available or adjust

export default function ThemeSwitcher() {
  const { activeUniverse, setActiveUniverse } = useUniverseStore();

  const themes = [
    { id: 'premium', label: 'Premium Gold', icon: Sparkles },
    { id: 'hp', label: 'Hogwarts', icon: Wand2 },
    { id: 'avengers', label: 'Avengers Initiative', icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-theme-surface/50 backdrop-blur-md rounded-2xl border border-theme-border">
      <h3 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-2">Universe Selection</h3>
      <div className="flex gap-3">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = activeUniverse === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveUniverse(theme.id)}
              className={`
                flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-theme-primary/20 border-theme-primary text-theme-primary shadow-glow' 
                  : 'bg-theme-bg border-transparent text-theme-muted hover:bg-theme-surface hover:text-theme-text'}
                border
              `}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
