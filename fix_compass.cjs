const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CollegeCompass.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

// Find and log the broken region
console.log('Total lines:', lines.length);

// STEP 1: Fix lines 1119-1125 (the mangled menu branch opening)
// Find the exact broken block
let menuStartIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("{viewMode === 'menu' ? (")) {
        menuStartIdx = i;
        break;
    }
}
console.log('Menu ternary found at line:', menuStartIdx + 1);

// Find where the intact content div starts (the flex-1 overflow-y-auto div after the broken block)
let contentDivIdx = -1;
for (let i = menuStartIdx + 1; i < menuStartIdx + 15; i++) {
    if (lines[i].trimStart().startsWith('<div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">') ||
        lines[i].trimStart().startsWith('<div className="flex-1 overflow-y-auto px-6 pt-24 pb-8 custom-scrollbar">')) {
        contentDivIdx = i;
        break;
    }
}
console.log('Content div found at line:', contentDivIdx + 1);

// Replace lines from menuStartIdx to contentDivIdx (inclusive) with the correct JSX
const fixedMenuOpening = [
    '            {viewMode === \'menu\' ? (',
    '                <>',
    '                    <div className="fixed top-0 left-0 w-full p-5 flex items-center z-50 bg-gradient-to-b from-theme-bg via-theme-bg/80 to-transparent pointer-events-none">',
    '                        <button',
    '                            onClick={onExit}',
    '                            className="pointer-events-auto px-5 py-2.5 rounded-2xl bg-theme-surface/80 backdrop-blur-xl border border-theme-primary/30 text-xs font-black uppercase tracking-widest text-theme-primary hover:bg-theme-primary hover:text-theme-bg transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(201,165,90,0.15)] hover:scale-105"',
    '                        >',
    '                            <ChevronLeft className="w-4 h-4" /> Back to Nexus',
    '                        </button>',
    '                    </div>',
    '                    <div className="flex-1 overflow-y-auto px-6 pt-24 pb-8 custom-scrollbar">',
];

lines.splice(menuStartIdx, contentDivIdx - menuStartIdx + 1, ...fixedMenuOpening);

// STEP 2: Find and close the fragment before `) : (` for the active_tool branch
// After splicing, recalculate. The menu branch ends at the `) : (` line.
let elseIdx = -1;
for (let i = menuStartIdx + fixedMenuOpening.length; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === ') : (') {
        elseIdx = i;
        break;
    }
}
console.log(') : ( found at line:', elseIdx + 1);

// The line BEFORE `) : (` should be `</div>` closing the flex-1 div.
// We need to add `</>` after that closing div and before `) : (`
// Check what's above it:
console.log('Line before ) : (:', lines[elseIdx - 1].trim());

// Insert the fragment close
lines.splice(elseIdx, 0, '                </>');
console.log('Fragment close inserted.');

// STEP 3: Also add the back button in the active_tool branch  
// Find the active_tool branch's "Return to App Grid" button area and add the onExit back button
// The active_tool branch already has a "Return to App Grid" button, so we leave it.
// But we need to add a proper Back to Nexus button at the top of the active_tool view too.
let returnBtnIdx = -1;
for (let i = elseIdx + 1; i < lines.length; i++) {
    if (lines[i].includes('Return to App Grid')) {
        returnBtnIdx = i;
        break;
    }
}
if (returnBtnIdx > -1) {
    // Find the button's parent div start (the max-w-5xl mx-auto mb-6 div)
    let parentStart = returnBtnIdx;
    for (let i = returnBtnIdx; i >= elseIdx; i--) {
        if (lines[i].includes('max-w-5xl mx-auto mb-6')) {
            parentStart = i;
            break;
        }
    }
    // Find the closing of that div
    let parentEnd = returnBtnIdx;
    for (let i = returnBtnIdx; i < returnBtnIdx + 5; i++) {
        if (lines[i].trim() === '</div>') {
            parentEnd = i;
            break;
        }
    }
    
    // Replace the "Return to App Grid" section with two buttons
    const newNavSection = [
        '                    <div className="max-w-5xl mx-auto mb-6 flex items-center gap-3">',
        '                        <button onClick={onExit} className="px-5 py-2.5 rounded-xl border border-theme-primary/30 bg-theme-surface hover:bg-theme-primary/10 text-[10px] font-black uppercase tracking-widest text-theme-primary hover:text-theme-primary transition-all duration-300 flex items-center gap-2 group w-fit">',
        '                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />',
        '                            Exit Compass',
        '                        </button>',
        '                        <button onClick={() => setViewMode(\'menu\')} className="px-5 py-2.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-bg text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all duration-300 flex items-center gap-2 group w-fit">',
        '                            <Map className="w-4 h-4" />',
        '                            Tool Grid',
        '                        </button>',
        '                    </div>',
    ];
    lines.splice(parentStart, parentEnd - parentStart + 1, ...newNavSection);
    console.log('Active tool nav updated.');
}

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content);
console.log('CollegeCompass.jsx fixed successfully!');
