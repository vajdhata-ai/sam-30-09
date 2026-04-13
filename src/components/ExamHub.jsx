import React from 'react';
import CompetitiveHubRouter from './CompetitiveHub/index';

const ExamHub = ({ onExit }) => (
    <div className="relative w-full h-full flex flex-col">
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 px-4 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center z-[100] shrink-0 backdrop-blur-md">
            <span className="mr-2">⚠️</span>
            Under Development - Core Logic May Not Work (Rough Version)
        </div>
        <div className="flex-1 overflow-hidden relative">
            <CompetitiveHubRouter onExitHub={onExit} />
        </div>
    </div>
);

export default ExamHub;
