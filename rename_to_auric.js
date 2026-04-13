const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let filesToUpdate = ['index.html'];
walkDir('src', function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        filesToUpdate.push(filePath);
    }
});

let changed = 0;
filesToUpdate.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        let newContent = content.replace(/Aurem/g, 'Auric')
                                .replace(/aurem/g, 'auric')
                                .replace(/AUREM/g, 'AURIC');
        if (newContent !== content) {
            fs.writeFileSync(f, newContent, 'utf8');
            changed++;
        }
    }
});

console.log(`Done renaming! Modified ${changed} files.`);
