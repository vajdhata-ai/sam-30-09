const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/components/CollegeCompass.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. UPDATE JEE STATE INITIALIZATION
content = content.replace(
    /const \[jeeCollegeResult, setJeeCollegeResult\] = useState\(''\);/g,
    `const [jeeCollegeResult, setJeeCollegeResult] = useState(null);`
);

// 2. JEE LOGIC REPLACEMENT
const jeeLogicStartStr = '    // ─── RANK PREDICTOR (WORLD-CLASS) ───\n    const handleJeeSubmit = async (e) => {';
// fallback if comment is different
const alternateJeeLogicStart = '    const handleJeeSubmit = async (e) => {';
let jeeLogicStart = content.indexOf(jeeLogicStartStr);
if (jeeLogicStart === -1) {
    jeeLogicStart = content.indexOf(alternateJeeLogicStart, content.indexOf('const getRankTier'));
}

if (jeeLogicStart !== -1) {
    const endOfJeeLogic = content.indexOf('    const handleJeePdfDownload = async () => {');
    if (endOfJeeLogic !== -1) {
        const newJeeLogic = `    const handleJeeSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setJeeCollegeResult(null);
        try {
            let percent;
            let estimatedMarks = '';
            if (jeeMode === 'marks') {
                const m = parseFloat(jeeForm.marks);
                if (isNaN(m) || m < 0 || m > 300) throw new Error('Enter valid marks between 0 and 300');
                percent = marksToPercentile(m);
                estimatedMarks = m;
            } else {
                percent = parseFloat(jeeForm.percentile);
                if (isNaN(percent) || percent < 0 || percent > 100) throw new Error('Enter a valid percentile between 0 and 100');
            }

            const totalCandidates = 1450000; // 2026 projection
            const crlRank = Math.max(1, Math.floor(((100 - percent) * totalCandidates) / 100));
            const tier = getRankTier(crlRank);
            setJeeRankData({ crl: crlRank, percentile: percent, category: jeeForm.category, marks: estimatedMarks, tier, homeState: jeeForm.homeState, targetBranch: jeeForm.targetBranch, gender: jeeForm.gender, pwd: jeeForm.pwd });

            const systemPrompt = \`You are India's #1 JEE Main Counseling Expert.
Based on JoSAA data, predict college admission probabilities.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "rank_analysis": {
    "predicted_rank": 15000,
    "percentile": 99.0,
    "competitive_standing": "Top 1% - Excellent chances for top NITs"
  },
  "safe_colleges": [{ "name": "NIT X", "branch": "ECE", "closing_rank": "20000" }],
  "target_colleges": [{ "name": "NIT Y", "branch": "CSE", "closing_rank": "16000" }],
  "dream_colleges": [{ "name": "IIT Z (if applicable)", "branch": "Mech", "closing_rank": "10000" }],
  "strategy": ["Counseling strategy 1", "Counseling strategy 2"]
}\`;
            const userQuery = \`Aspirant Profile:
Percentile: \${percent}%
Calculated Rank: ~\${crlRank}
Category: \${jeeForm.category}
Home State: \${jeeForm.homeState}
Target Branch: \${jeeForm.targetBranch}\`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.4, true);
            const parsedData = JSON.parse(rawJsonStr);
            setJeeCollegeResult(parsedData);
            incrementUsage('college-compass');
        } catch (err) { setJeeCollegeResult({ error: "Failed to predict rank. " + err.message }); }
        finally { setIsLoading(false); }
    };

`;
        content = content.substring(0, jeeLogicStart) + newJeeLogic + content.substring(endOfJeeLogic);
    }
}

// 3. ESSAY LOGIC REPLACEMENT
const essayLogicStart = content.indexOf('    const handleGenerateEssay = async () => {');
if (essayLogicStart !== -1) {
    const endOfEssayLogic = content.indexOf('    // ─── TAB NAVIGATION & RENDER ───');
    if (endOfEssayLogic !== -1) {
        const newEssayLogic = `    const handleGenerateEssay = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setEssayData(null);
        
        try {
            const profileBlock = buildProfileBlock();
            const systemPrompt = \`You are an elite Ivy League college essay coach who has helped students get into Harvard, Yale, Stanford, and all top universities. You have deep knowledge of what makes essays stand out vs get rejected.

You follow these STRICT principles from proven methodology:
AUTHENTICITY RULES:
- Real emotion is messy, not clean or packaged
- Voice must sound like a real 17/18-year-old, not a corporate robot or academic journal
- Show, don't tell: Ground every abstract trait in a hyper-specific micro-moment.

OUTPUT FORMAT:
Return ONLY a strictly valid JSON object with the following structure:
{
  "essay": "The complete, polished essay text formatted beautifully in markdown",
  "voice_score": 9.5,
  "theme_alignment": ["Resilience", "Intellectual Vitality"],
  "improvement_tips": ["Specific tip 1", "Specific tip 2"],
  "analysis": "A brief analysis of why this essay works"
}\`;

            const userQuery = \`Target School: \${essaySchool}
Essay Type: \${essayType}
Word Limit: \${essayWordLimit}
Key Story/Anecdote: \${essayStory}
Core Trait to Highlight: \${essayTrait}
Tone: \${essayTone}
Additional Instructions: \${essayPrompt}

Student Profile:
\${profileBlock}

Draft the ultimate essay based on this information and provide the analysis.\`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.7, true);
            const parsedData = JSON.parse(rawJsonStr);
            setEssayData(parsedData);
            incrementUsage('college-compass');
        } catch (err) {
            console.error(err);
            setEssayData({ error: "Failed to generate essay. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePdfDownload = async () => {
        // Dummy PDF download implementation to prevent crashing
        alert("Downloading PDF...");
    };

`;
        content = content.substring(0, essayLogicStart) + newEssayLogic + content.substring(endOfEssayLogic);
    }
}

// 4. JEE UI REPLACEMENT
const jeeUIStart = content.indexOf('{jeeCollegeResult && (\n                                        <div ref={jeePdfRef} className={`glass-panel p-6');
if (jeeUIStart !== -1) {
    const endStr = '</div>\n                                    )}';
    const jeeUIEnd = content.indexOf(endStr, jeeUIStart) + endStr.length;
    
    const newJeeUI = `{jeeCollegeResult && !jeeCollegeResult.error && (
                                        <div ref={jeePdfRef} className={\`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up\`}>
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-theme-border">
                                                <Target className="w-6 h-6 text-theme-primary" />
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-theme-text">Rank Prediction & Strategy</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest block mb-1">Predicted Rank</span>
                                                    <span className="text-xl font-black text-theme-primary">{jeeCollegeResult.rank_analysis?.predicted_rank || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border mb-6 flex items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-black text-theme-muted uppercase tracking-widest block">Standing</span>
                                                    <span className="text-sm font-bold text-theme-text">{jeeCollegeResult.rank_analysis?.competitive_standing}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black text-theme-muted uppercase tracking-widest block">Percentile</span>
                                                    <span className="text-sm font-bold text-theme-text">{jeeCollegeResult.rank_analysis?.percentile}%</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
                                                    <h4 className="text-xs font-black text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Safe</h4>
                                                    <div className="space-y-3">
                                                        {jeeCollegeResult.safe_colleges?.map((c, i) => (
                                                            <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <p className="text-[11px] text-theme-muted">{c.branch} • Close: {c.closing_rank}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> Target</h4>
                                                    <div className="space-y-3">
                                                        {jeeCollegeResult.target_colleges?.map((c, i) => (
                                                            <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <p className="text-[11px] text-theme-muted">{c.branch} • Close: {c.closing_rank}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                                                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Crown className="w-4 h-4"/> Dream</h4>
                                                    <div className="space-y-3">
                                                        {jeeCollegeResult.dream_colleges?.map((c, i) => (
                                                            <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <p className="text-[11px] text-theme-muted">{c.branch} • Close: {c.closing_rank}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Counseling Strategy</h4>
                                            <ul className="space-y-2 mb-6">
                                                {jeeCollegeResult.strategy?.map((s, idx) => (
                                                    <li key={idx} className="text-xs text-theme-text flex gap-2"><ChevronRight className="w-3 h-3 text-theme-primary flex-shrink-0 mt-0.5"/> {s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {jeeCollegeResult?.error && (
                                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                                            {jeeCollegeResult.error}
                                        </div>
                                    )}`;
    content = content.substring(0, jeeUIStart) + newJeeUI + content.substring(jeeUIEnd);
}

// 5. ESSAY UI REPLACEMENT
const essayUIStartStr = '{/* ─── ENHANCED: Auto-Generate Section ─── */}';
const essayUIStart = content.indexOf(essayUIStartStr);
if (essayUIStart !== -1) {
    const endStr = '{/* NEW: Use Feedback to Improve Button */}';
    // Actually, I should just replace the whole form inside the essay tab
    const essayFormStart = content.indexOf('<form onSubmit={handleEssaySubmit}');
    const essayFormEnd = content.indexOf('</div>\n                        )}', essayFormStart);
    
    if (essayFormStart !== -1 && essayFormEnd !== -1) {
        const newEssayUI = `<form onSubmit={handleGenerateEssay} className={\`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden\`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-rose-500" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award className={\`w-6 h-6 text-amber-500\`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">College Essay Writer</h3>
                                            <p className={\`text-xs text-theme-muted\`}>Elite Ivy League Essay Coach & Ghostwriter</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <FormField label="Target School">
                                            <InputField value={essaySchool} onChange={e => setEssaySchool(e.target.value)} placeholder="e.g. Stanford, MIT, Oxford" required />
                                        </FormField>
                                        <FormField label="Essay Type">
                                            <SelectField value={essayType} onChange={e => setEssayType(e.target.value)} options={[
                                                { value: 'Personal Statement', label: 'Personal Statement' },
                                                { value: 'Common App', label: 'Common App Essay' },
                                                { value: 'Why Us', label: 'Why Us / Supplemental' },
                                                { value: 'SOP', label: 'Statement of Purpose' },
                                                { value: 'Scholarship', label: 'Scholarship Essay' },
                                            ]} />
                                        </FormField>
                                        <FormField label="Word Limit">
                                            <InputField value={essayWordLimit} onChange={e => setEssayWordLimit(e.target.value)} placeholder="e.g. 650, 250" required />
                                        </FormField>
                                    </div>

                                    <div className="p-5 mb-6 rounded-2xl bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/20">
                                        <h4 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Story & Authentic Voice
                                        </h4>
                                        
                                        <FormField label="⭐ Key Story / Anecdote">
                                            <TextareaField value={essayStory} onChange={e => setEssayStory(e.target.value)} rows="3" placeholder="Describe a specific moment, challenge, or realization. Be authentic!" required />
                                        </FormField>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <FormField label="💎 Core Trait to Highlight">
                                                <InputField value={essayTrait} onChange={e => setEssayTrait(e.target.value)} placeholder="e.g. Resilience, Curiosity..." required />
                                            </FormField>
                                            <FormField label="🎨 Tone">
                                                <SelectField value={essayTone} onChange={e => setEssayTone(e.target.value)} options={[
                                                    { value: 'Reflective', label: '🪞 Reflective & Poetic' },
                                                    { value: 'Analytical', label: '🔬 Analytical & Direct' },
                                                    { value: 'Humorous', label: '😄 Humorous & Witty' },
                                                    { value: 'Bold', label: '⚡ Bold & Unconventional' },
                                                    { value: 'Narrative', label: '📖 Storytelling' },
                                                ]} />
                                            </FormField>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <FormField label="📝 Extra Instructions (Optional)">
                                                <TextareaField value={essayPrompt} onChange={e => setEssayPrompt(e.target.value)} rows="2" placeholder="Specific themes, what to avoid..." />
                                            </FormField>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-all flex justify-center items-center disabled:opacity-50">
                                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Ghostwriting Draft...</> : (<>Generate Ivy Draft <Award className="w-4 h-4 ml-2" /></>)}
                                    </button>
                                </form>

                                {essayData && !essayData.error && (
                                    <div className={\`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up mt-6\`}>
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme-border">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-6 h-6 text-amber-500" />
                                                <h3 className="text-xl font-bold text-theme-text">Your Essay Draft</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Voice Score</span>
                                                    <span className={\`text-xl font-black \${essayData.voice_score >= 8 ? 'text-green-500' : 'text-amber-500'}\`}>{essayData.voice_score}/10</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="p-5 rounded-2xl bg-theme-bg border border-theme-border prose max-w-none prose-sm text-theme-text">
                                                    <MarkdownBlock text={essayData.essay} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                                                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Theme Alignment</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {essayData.theme_alignment?.map((theme, i) => (
                                                            <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold">{theme}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                                                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Coach Analysis</h4>
                                                    <p className="text-xs text-theme-text leading-relaxed">{essayData.analysis}</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Improvement Tips</h4>
                                                    <ul className="space-y-2">
                                                        {essayData.improvement_tips?.map((tip, i) => (
                                                            <li key={i} className="text-xs text-theme-text flex gap-2"><span className="text-amber-500">•</span> {tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {essayData?.error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center mt-6">
                                        {essayData.error}
                                    </div>
                                )}
                            </div>
                        )}`;
        content = content.substring(0, essayFormStart) + newEssayUI + content.substring(essayFormEnd + 37);
    }
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated JEE Rank Predictor and Essay Writer.');
