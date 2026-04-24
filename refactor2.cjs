const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/components/CollegeCompass.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// CAREER LOGIC REPLACEMENT
const careerLogicStart = content.indexOf('    // ─── CAREER AI ───\n    const handleCareerSubmit = async (e) => {');
const collegeFinderStart = content.indexOf('    // ─── COLLEGE FINDER (ENHANCED) ───\n    const handleCollegeSubmit = async (e) => {');

if (careerLogicStart !== -1 && collegeFinderStart !== -1) {
    const newCareerLogic = `    // ─── CAREER AI ───
    const handleCareerSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setCareerResult(null);
        // Save to shared profile
        updateProfile({
            hobbies: careerForm.hobbies,
            passions: careerForm.passion,
            field: careerForm.field,
            aspirations: careerForm.aspirations,
        });
        try {
            const profileBlock = buildProfileBlock();
            const systemPrompt = \`You are an elite Career Architect and Dream Job Finder.
Analyze the student profile and synthesize a highly dynamic, future-proof career roadmap. Do not stick to generic careers.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "personality_type": "The Maverick (or similar archetype)",
  "alignment_score": 95,
  "core_values": ["value1", "value2"],
  "career_matches": [
    { "title": "Career Title", "match_score": 95, "why": "Why it fits", "salary": "$100k-$150k", "growth": "High" }
  ],
  "action_plan": [
    { "timeframe": "Months 1-3", "steps": ["Step 1", "Step 2"] }
  ],
  "hidden_gems": ["Emerging Field 1", "Unconventional Role 2"]
}\`;

            const userQuery = \`--- STUDENT PROFILE (ACTIVE FORM) ---
Hobbies & Interests: \${careerForm.hobbies}
Deep Passions: \${careerForm.passion}
Current Field of Study: \${careerForm.field}
Future Aspirations: \${careerForm.aspirations}
Budget Constraints: \${careerForm.budget || 'Not specified'}
Preferred Country: \${careerForm.country || 'Open to any'}
--- END ACTIVE FORM ---
\${profileBlock}\`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.7, true);
            const parsedData = JSON.parse(rawJsonStr);
            setCareerResult(parsedData);
            updateProfile({ careerGoals: JSON.stringify(parsedData.career_matches) });
            incrementUsage('college-compass');
        } catch (err) { 
            setCareerResult({ error: "Failed to generate career roadmap. " + err.message }); 
        } finally { 
            setIsLoading(false); 
        }
    };

`;
    content = content.substring(0, careerLogicStart) + newCareerLogic + content.substring(collegeFinderStart);
}

// CAREER UI REPLACEMENT
const careerUIStart = content.indexOf('{careerResult && (\n                                    <div className={`glass-panel p-6 rounded-3xl');
const careerUIEnd = content.indexOf('                                {careerResult && (\n                                    <div className={`glass-panel p-6 rounded-3xl') + 
    content.substring(content.indexOf('{careerResult && (\n                                    <div className={`glass-panel p-6 rounded-3xl')).indexOf('</div>\n                                )}');

if (careerUIStart !== -1) {
    const careerUIFullString = content.substring(content.indexOf('{careerResult && ('), content.indexOf('</div>\n                                )}', content.indexOf('{careerResult && (')) + 41);

    const newCareerUI = `{careerResult && !careerResult.error && (
                                    <div className={\`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up\`}>
                                        <div className={\`flex items-center gap-3 mb-6 pb-4 border-b border-theme-border\`}>
                                            <Sparkles className={\`w-6 h-6 text-theme-primary\`} />
                                            <h3 className="text-xl font-bold text-theme-text">Your Personalized Career Roadmap</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Archetype</span>
                                                <h4 className="text-lg font-black text-indigo-300">{careerResult.personality_type}</h4>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Profile Alignment</span>
                                                <h4 className="text-2xl font-black text-emerald-400">{careerResult.alignment_score}%</h4>
                                                <div className="w-full bg-theme-bg h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: \`\${careerResult.alignment_score}%\` }}></div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Core Values</span>
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {careerResult.core_values?.map((v, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4"/> Top Career Matches</h4>
                                        <div className="space-y-4 mb-8">
                                            {careerResult.career_matches?.map((match, idx) => (
                                                <div key={idx} className="p-5 rounded-2xl bg-theme-bg border border-theme-border relative overflow-hidden group hover:border-theme-primary/50 transition-all">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-theme-primary to-theme-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="text-lg font-bold text-theme-text">{match.title}</h5>
                                                        <span className="px-3 py-1 bg-theme-surface rounded-lg text-xs font-black text-theme-primary border border-theme-primary/30">
                                                            {match.match_score}% Match
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-theme-muted mb-4">{match.why}</p>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center"><Activity className="w-3 h-3 text-green-400"/></div>
                                                            <span className="text-[11px] font-bold text-theme-text">{match.salary}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center"><Activity className="w-3 h-3 text-blue-400"/></div>
                                                            <span className="text-[11px] font-bold text-theme-text">{match.growth} Growth</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> 12-Month Action Plan</h4>
                                                <div className="space-y-3">
                                                    {careerResult.action_plan?.map((plan, idx) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center text-[10px] font-black text-theme-primary">
                                                                {plan.timeframe.split(' ')[1] || (idx + 1)}
                                                            </div>
                                                            <div className="pt-1">
                                                                <span className="text-xs font-bold text-theme-text block mb-1">{plan.timeframe}</span>
                                                                <ul className="space-y-1">
                                                                    {plan.steps?.map((s, i) => (
                                                                        <li key={i} className="text-[11px] text-theme-muted flex gap-1.5"><ChevronRight className="w-3 h-3 text-theme-primary flex-shrink-0 mt-0.5"/> {s}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Hidden Gems</h4>
                                                <div className="space-y-2">
                                                    {careerResult.hidden_gems?.map((gem, idx) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text flex items-center gap-2">
                                                            <Sparkles className="w-3 h-3 text-amber-500"/>
                                                            {gem}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <button onClick={() => setActiveTab('college')} className="py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                College Needed → Hunt <ChevronRight className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setActiveTab('chat')} className="py-3 bg-theme-surface border border-theme-border text-theme-text rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                No College → Counselor <MessageSquare className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => { setCareerResult(null); setCareerForm({ hobbies: '', passion: '', field: '', aspirations: '', budget: '', country: '' }); }} className="py-3 bg-theme-bg border border-theme-border text-theme-muted rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:text-theme-text transition-all">
                                                I'm Done — Exit ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {careerResult?.error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                                        {careerResult.error}
                                    </div>
                                )}`;
    content = content.replace(careerUIFullString, newCareerUI);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated Career Logic and UI.');
