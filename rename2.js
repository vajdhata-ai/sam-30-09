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

const files = walk('C:\\Users\\Shubham\\Desktop\\scripts\\.vscode\\Aurem\\src')
    .filter(f => f.match(/\.(jsx|js|css|html|md)$/));

let count = 0;
files.forEach(f => {
    let original = fs.readFileSync(f, 'utf8');
    let modified = original
        .split('AUREM').join('AURIC')
        .split('aurem').join('auric')
        .split('Aurem').join('Auric');
        
    if (original !== modified) {
        fs.writeFileSync(f, modified, 'utf8');
        count++;
        console.log('Fixed:', f);
    }
});
console.log('Replaced in ' + count + ' files.');
