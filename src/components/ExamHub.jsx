import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Trophy } from './Icons';

const ExamHub = ({ onExit }) => {
    const { isDark } = useTheme();
    
    return (
        <div className={`flex flex-col items-center justify-center h-[100dvh] w-full ${isDark ? 'bg-midnight-950 text-white' : 'bg-warm-50 text-slate-900'} p-6 relative`}>
            {onExit && (
                <button 
                    onClick={onExit} 
                    className="absolute top-6 left-6 md:top-10 md:left-10 px-6 py-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-black uppercase tracking-widest text-xs transition-all border border-indigo-500/20 glass-3d glow-border"
                >
                    ← Exit Hub
                </button>
            )}
            
            <div className={`flex flex-col items-center space-y-6 max-w-md text-center p-12 rounded-[40px] border glass-3d glow-border transition-all duration-500 shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white/90 border-warm-200/50'}`}>
                <div className="p-6 bg-indigo-500/10 rounded-3xl animate-pulse">
                    <Trophy className="w-16 h-16 text-indigo-500" />
                </div>
                
                <h1 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                    Competitive Hub
                </h1>
                
                <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase tracking-widest text-[10px]">
                    Under Development
                </div>
                
                <p className="text-theme-muted font-medium text-sm leading-relaxed mt-4">
                    The core competitive logic is currently undergoing maintenance and significant architectural upgrades. Stay tuned for a high-performance experience.
                </p>
            </div>
        </div>
    );
};

export default ExamHub;
