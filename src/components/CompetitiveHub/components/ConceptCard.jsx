import React, { useState, useEffect } from 'react';
import { formatGeminiPayload, retryableFetch, GEMINI_API_URL } from '../../../../utils/api';

/**
 * Premium concept card renderer — static content, formatted sections with glassmorphism.
 */
const ConceptCard = ({ card, topicName, onMarkUnderstood }) => {
    const [aiCard, setAiCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (card) {
            setAiCard(card);
            return;
        }
        
        if (!topicName || isLoading || aiCard) return;

        const generateCard = async () => {
            setIsLoading(true);
            try {
                const systemPrompt = `You are an expert tutor. Create a highly structured JSON Concept Card for the topic: "${topicName}". 
Respond ONLY with raw JSON without backticks or markdown formatting.
Schema required:
{
  "coreIdea": "string (1-2 sentences)",
  "keyConcepts": ["array of 3-4 strings"],
  "formulas": ["array of strings or null"],
  "commonMistakes": ["array of 2 strings or null"],
  "examPattern": "string (1 sentence)"
}`;
                const payload = formatGeminiPayload(`Generate Concept Card JSON for: ${topicName}`, systemPrompt);
                const response = await retryableFetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.choices && response.choices.length > 0) {
                    let text = response.choices[0].message.content.trim();
                    if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '');
                    text = text.replace(/\`\`\`/g, '');
                    const generated = JSON.parse(text);
                    setAiCard(generated);
                }
            } catch (err) {
                console.error("AI Concept Card Gen Error:", err);
            }
            setIsLoading(false);
        };

        generateCard();
    }, [card, topicName]);

    if (!aiCard) {
        return (
            <div className="beach-card p-10 rounded-[2rem] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <p className="text-6xl mb-6 drop-shadow-xl inline-block" style={{animation: isLoading ? "pulse 1s infinite" : "none"}}>📚</p>
                    <h3 className="text-2xl font-black text-theme-text mb-2">
                        {isLoading ? 'Synthesizing...' : 'Generating Concept'}
                    </h3>
                    <p className="text-theme-muted font-bold">
                        {isLoading ? 'Crafting the concept card for you...' : 'Concept card is currently unavailable.'}
                    </p>
                </div>
            </div>
        );
    }

    // Now render using aiCard instead of card
    const renderCard = aiCard;

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Core Idea — Hero Card */}
            <div className="beach-card p-6 md:p-8 rounded-[2rem] border-orange-500/20 relative overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-lg shadow-inner">💡</div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Core Idea</h3>
                    </div>
                    <p className="text-theme-text text-lg leading-relaxed font-bold">{renderCard.coreIdea}</p>
                </div>
            </div>

            {/* Key Concepts */}
            <div className="beach-card p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500 text-lg shadow-inner">🔑</div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-theme-muted">Key Concepts</h3>
                </div>
                <ul className="space-y-3">
                    {renderCard.keyConcepts && renderCard.keyConcepts.map((concept, i) => (
                        <li key={i} className="flex items-start gap-3 text-theme-text group/item">
                            <span className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-black text-orange-500 flex-shrink-0 mt-0.5 shadow-inner">{i + 1}</span>
                            <span className="font-medium leading-relaxed">{concept}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Formulas */}
            {renderCard.formulas && renderCard.formulas.length > 0 && (
                <div className="beach-card p-6 md:p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 text-lg shadow-inner">📐</div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-500">Formulas</h3>
                    </div>
                    <div className="space-y-3">
                        {renderCard.formulas.map((f, i) => (
                            <div key={i} className="font-mono text-sm text-theme-text bg-white/80 dark:bg-slate-900/60 px-5 py-3.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-sm hover:border-purple-500/30 transition-colors">
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Common Mistakes */}
            {renderCard.commonMistakes && renderCard.commonMistakes.length > 0 && (
                <div className="beach-card p-6 md:p-8 rounded-[2rem] border-amber-500/20 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-lg shadow-inner">⚠️</div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Common Mistakes</h3>
                        </div>
                        <ul className="space-y-3">
                            {renderCard.commonMistakes.map((m, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0 animate-pulse" />
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Exam Pattern */}
            {renderCard.examPattern && (
                <div className="beach-card p-6 md:p-8 rounded-[2rem] border-emerald-500/20 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-lg shadow-inner">🎯</div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Exam Pattern</h3>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 font-bold leading-relaxed">{renderCard.examPattern}</p>
                </div>
            )}

            {/* Mark as Understood CTA */}
            {onMarkUnderstood && (
                <button
                    onClick={onMarkUnderstood}
                    className="w-full relative overflow-hidden py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-pink-500/20 hover:shadow-orange-500/40 active:scale-[0.98] hover:-translate-y-0.5 group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-lg">✓</span> Mark as Understood
                    </span>
                </button>
            )}
        </div>
    );
};

export default ConceptCard;
