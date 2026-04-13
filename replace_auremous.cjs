const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'public'];
const targetFiles = ['package.json', 'index.html', 'package-lock.json', 'tailwind.config.ts', 'tailwind.config.js'];

// Directories to ignore
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.vscode', '.gemini'];

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    try {
        const stats = fs.statSync(filePath);
        if (stats.size > 5 * 1024 * 1024) return; // Skip files > 5MB

        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/\bAurem\b/g, 'Auremous')
            .replace(/\baurem\b/g, 'auremous');
            
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}: ${e.message}`);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (ignoreDirs.includes(file)) continue;

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.match(/\.(js|jsx|ts|tsx|html|css|json|md)$/)) {
            replaceInFile(fullPath);
        }
    }
}

console.log('Starting text replacement...');

// Process specific top level files
for (const file of targetFiles) {
    replaceInFile(path.join(__dirname, file));
}

// Process directories
for (const dir of targetDirs) {
    walkDir(path.join(__dirname, dir));
}

console.log('Replacement complete.');
