import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FileText } from './Icons';

const SamplePaperGenerator = () => {
    const { isDark } = useTheme();
    
    return (
        <div className={`flex flex-col items-center justify-center h-full w-full ${isDark ? 'bg-midnight-950 text-white' : 'bg-warm-50 text-slate-900'} p-6 relative`}>
            <div className={`flex flex-col items-center space-y-6 max-w-md text-center p-12 rounded-[40px] border glass-3d glow-border transition-all duration-500 shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white/90 border-warm-200/50'}`}>
                <div className="p-6 bg-indigo-500/10 rounded-3xl animate-pulse">
                    <FileText className="w-16 h-16 text-indigo-500" />
                </div>
                
                <h1 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                    Sample Paper Gen
                </h1>
                
                <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase tracking-widest text-[10px]">
                    Under Development
                </div>
                
                <p className="text-theme-muted font-medium text-sm leading-relaxed mt-4">
                    The Synthetic Examiner module is currently being redesigned for enhanced accuracy and generation quality. Generation logic is temporarily offline.
                </p>
            </div>
        </div>
    );
};

export default SamplePaperGenerator;
