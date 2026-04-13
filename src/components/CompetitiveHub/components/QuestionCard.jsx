import React, { useState } from 'react';

/**
 * Premium question card with animated answer selection and cinematic feedback.
 */
const QuestionCard = ({ question, questionNumber, totalQuestions, onAnswer }) => {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const options = [
        { key: 'A', text: question.optionA },
        { key: 'B', text: question.optionB },
        { key: 'C', text: question.optionC },
        { key: 'D', text: question.optionD },
    ];

    const handleSelect = (key) => {
        if (showResult) return;
        setSelected(key);
        setShowResult(true);
        const isCorrect = key === question.correct;
        setTimeout(() => onAnswer(isCorrect, key), 2000);
    };

    const isCorrect = selected === question.correct;
    const getWhyWrong = () => {
        if (!selected || isCorrect) return null;
        const map = { A: question.whyWrongA, B: question.whyWrongB, C: question.whyWrongC, D: question.whyWrongD };
        return map[selected];
    };

    return (
        <div className="beach-card p-6 md:p-8 rounded-[2rem] animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
            {/* Decorative Gradient Orb */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black text-theme-muted uppercase tracking-[0.15em]">
                        Question {questionNumber} of {totalQuestions}
                    </span>
                    <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-inner ${
                        question.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        question.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>{question.difficulty}</span>
                </div>

                {/* Question Text */}
                <p className="text-xl md:text-2xl font-black text-theme-text mb-8 leading-snug tracking-tight">{question.questionText}</p>

                {/* Options Grid */}
                <div className="space-y-3 mb-6">
                    {options.map(opt => {
                        let cardStyle = 'w-full text-left p-5 rounded-[1.25rem] border-2 transition-all duration-300 flex items-start gap-4 group/opt';
                        
                        if (!showResult) {
                            cardStyle += ' cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-lg';
                            cardStyle += selected === opt.key
                                ? ' border-pink-500 bg-gradient-to-r from-pink-500/10 to-orange-500/10 shadow-lg shadow-pink-500/10 ring-4 ring-pink-500/10'
                                : ' border-slate-200/80 dark:border-slate-700/80 hover:border-pink-400/50 hover:bg-white/60 dark:hover:bg-slate-800/60';
                        } else {
                            if (opt.key === question.correct) {
                                cardStyle += ' border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-500/10';
                            } else if (opt.key === selected) {
                                cardStyle += ' border-red-500 bg-red-50/80 dark:bg-red-500/10 shadow-lg shadow-red-500/10';
                            } else {
                                cardStyle += ' border-slate-200/50 dark:border-slate-700/50 opacity-40';
                            }
                        }

                        return (
                            <button key={opt.key} onClick={() => handleSelect(opt.key)} className={cardStyle}>
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all shadow-sm ${
                                    showResult && opt.key === question.correct ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-110' :
                                    showResult && opt.key === selected ? 'bg-red-500 text-white shadow-red-500/30 scale-110' :
                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover/opt:bg-gradient-to-br group-hover/opt:from-pink-500/10 group-hover/opt:to-orange-500/10 group-hover/opt:text-pink-500'
                                }`}>{opt.key}</span>
                                <span className="text-theme-text font-bold pt-2 leading-relaxed">{opt.text}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {showResult && (
                    <div className={`p-5 rounded-[1.25rem] border animate-in fade-in zoom-in-95 duration-500 ${
                        isCorrect
                            ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                            : 'bg-red-50/80 dark:bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/5'
                    }`}>
                        <p className={`font-black text-base mb-2 flex items-center gap-2 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            <span className="text-xl">{isCorrect ? '✅' : '❌'}</span> {isCorrect ? 'Correct!' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-theme-text font-medium leading-relaxed opacity-90">{question.explanation}</p>
                        {!isCorrect && getWhyWrong() && (
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-3 font-bold italic border-t border-red-500/10 pt-3">
                                Why {selected} is wrong: {getWhyWrong()}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
