import React from 'react';
import CompetitiveHubRouter from './CompetitiveHub/index';

const ExamHub = ({ onExit }) => (
    <div className="relative w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden relative">
            <CompetitiveHubRouter onExitHub={onExit} />
        </div>
    </div>
);

export default ExamHub;

