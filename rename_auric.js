const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Shubham\\Desktop\\scripts\\.vscode\\Aurem\\src';
const indexHtml = 'c:\\Users\\Shubham\\Desktop\\scripts\\.vscode\\Aurem\\index.html';

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
};

const renameInFile = (file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Auric')) {
        fs.writeFileSync(file, content.replace(/Auric/g, 'Aurem'), 'utf8');
        console.log('Updated', file);
    }
};

walk(srcDir).forEach(renameInFile);
renameInFile(indexHtml);
