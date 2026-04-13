const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const exts = ['.jsx', '.js', '.css', '.html'];
const files = walk('C:\\Users\\Shubham\\Desktop\\scripts\\.vscode\\Aurem\\src').filter(f => exts.some(e => f.endsWith(e)));

let count = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let newContent = content
        .replace(/AUREM/g, 'AURIC')
        .replace(/aurem/g, 'auric')
        .replace(/Aurem/g, 'Auric');
        
    if (content !== newContent) {
        fs.writeFileSync(f, newContent, 'utf8');
        console.log('Updated: ' + f);
        count++;
    }
});

console.log('Total files updated: ' + count);
