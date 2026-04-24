const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/components/CollegeCompass.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// ─── COLLEGE AI LOGIC REPLACEMENT ───
const collegeLogicStart = content.indexOf('    // ─── COLLEGE FINDER (ENHANCED) ───\n    const handleCollegeSubmit = async (e) => {');
const scholarshipLogicStart = content.indexOf('    // ─── SCHOLARSHIP FINDER (NEW) ───'); // Actually, let's just replace up to Compare Colleges

if (collegeLogicStart !== -1) {
    const endOfCollegeLogic = content.indexOf('    // ─── SCHOLARSHIP FINDER (NEW) ───');
    if (endOfCollegeLogic !== -1) {
        const newCollegeLogic = `    // ─── SCHOLARSHIP & COLLEGE FINDER ───
    const handleCollegeSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setCollegeResult(null);
        // Save to shared profile
        updateProfile({
            gpa: collegeForm.gpa,
            testScores: collegeForm.testScores,
            major: collegeForm.major,
            extracurriculars: collegeForm.extracurriculars,
        });
        try {
            const profileBlock = buildProfileBlock();
            const systemPrompt = \`You are an elite University Admissions Counselor and Financial Aid Expert.
Analyze the student's academic and extracurricular profile to recommend colleges and scholarships.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "profile_strength": 85,
  "dream_colleges": [{ "name": "University A", "chance": "20%", "why": "..." }],
  "target_colleges": [{ "name": "University B", "chance": "50%", "why": "..." }],
  "safe_colleges": [{ "name": "University C", "chance": "90%", "why": "..." }],
  "scholarships": [
    { "name": "Scholarship X", "amount": "$10k", "deadline": "Oct 1", "eligibility": "High" }
  ],
  "roi_analysis": "A brief analysis of the financial ROI for these options.",
  "strategy": ["Actionable advice 1", "Actionable advice 2"]
}\`;

            const userQuery = \`--- STUDENT PROFILE (ACTIVE FORM) ---
GPA / Marks: \${collegeForm.gpa}
Test Scores: \${collegeForm.testScores}
Target Major: \${collegeForm.major}
Study Level: \${collegeForm.studyLevel}
Extracurriculars: \${collegeForm.extracurriculars}
Country Preference: \${collegeForm.country}
Location Preference: \${collegeForm.location}
Budget: \${collegeForm.budget}
--- END ACTIVE FORM ---
\${profileBlock}\`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.4, true);
            const parsedData = JSON.parse(rawJsonStr);
            setCollegeResult(parsedData);
            incrementUsage('college-compass');
        } catch (err) { 
            setCollegeResult({ error: "Failed to generate college list. " + err.message }); 
        } finally { 
            setIsLoading(false); 
        }
    };

`;
        content = content.substring(0, collegeLogicStart) + newCollegeLogic + content.substring(endOfCollegeLogic);
    }
}

// ─── COLLEGE UI REPLACEMENT ───
const collegeUIStartStr = '{collegeResult && (\n                                    <div className={`glass-panel p-6 rounded-3xl';
const collegeUIStart = content.indexOf(collegeUIStartStr);
if (collegeUIStart !== -1) {
    const endStr = '</div>\n                                )}';
    const collegeUIEnd = content.indexOf(endStr, collegeUIStart) + endStr.length;
    
    const newCollegeUI = `{collegeResult && !collegeResult.error && (
                                    <div className={\`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up\`}>
                                        <div className={\`flex items-center gap-3 mb-6 pb-4 border-b border-theme-border\`}>
                                            <GraduationCap className={\`w-6 h-6 text-theme-primary\`} />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-theme-text">Your College & Scholarship Strategy</h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest block mb-1">Profile Strength</span>
                                                <span className={\`text-xl font-black \${collegeResult.profile_strength >= 80 ? 'text-green-500' : 'text-amber-500'}\`}>{collegeResult.profile_strength}/100</span>
                                            </div>
                                        </div>

                                        {/* Colleges Matrix */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
                                                <h4 className="text-xs font-black text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Safe</h4>
                                                <div className="space-y-3">
                                                    {collegeResult.safe_colleges?.map((c, i) => (
                                                        <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <span className="text-[10px] font-black text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{c.chance}</span>
                                                            </div>
                                                            <p className="text-[11px] text-theme-muted">{c.why}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> Target</h4>
                                                <div className="space-y-3">
                                                    {collegeResult.target_colleges?.map((c, i) => (
                                                        <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{c.chance}</span>
                                                            </div>
                                                            <p className="text-[11px] text-theme-muted">{c.why}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Crown className="w-4 h-4"/> Dream</h4>
                                                <div className="space-y-3">
                                                    {collegeResult.dream_colleges?.map((c, i) => (
                                                        <div key={i} className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h5 className="text-sm font-bold text-theme-text">{c.name}</h5>
                                                                <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">{c.chance}</span>
                                                            </div>
                                                            <p className="text-[11px] text-theme-muted">{c.why}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-theme-primary"/> Scholarship Matches</h4>
                                                <div className="space-y-3">
                                                    {collegeResult.scholarships?.map((s, idx) => (
                                                        <div key={idx} className="p-4 rounded-xl bg-theme-bg border border-theme-border flex flex-col gap-2 relative overflow-hidden group">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-theme-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                                            <div className="flex justify-between">
                                                                <h5 className="text-sm font-bold text-theme-text">{s.name}</h5>
                                                                <span className="text-xs font-black text-green-400">{s.amount}</span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <span className="text-[10px] text-theme-muted flex items-center gap-1"><Calendar className="w-3 h-3"/> Deadline: {s.deadline}</span>
                                                                <span className="text-[10px] text-theme-muted flex items-center gap-1"><Check className="w-3 h-3"/> Fit: {s.eligibility}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500"/> ROI Analysis</h4>
                                                    <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border text-sm text-theme-text leading-relaxed">
                                                        {collegeResult.roi_analysis}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-amber-500"/> Strategic Advice</h4>
                                                    <ul className="space-y-2">
                                                        {collegeResult.strategy?.map((s, idx) => (
                                                            <li key={idx} className="text-xs text-theme-text flex gap-2"><ChevronRight className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5"/> {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {collegeResult?.error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                                        {collegeResult.error}
                                    </div>
                                )}`;
    content = content.substring(0, collegeUIStart) + newCollegeUI + content.substring(collegeUIEnd);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated College/Scholarship Logic and UI.');
