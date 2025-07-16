const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data/vocabulary/dictionary');
const languages = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory());
const cefrLevels = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

console.log('Checking for presence of CEFR level files...');

languages.forEach(lang => {
    console.log(`\n--- Language: ${lang} ---`);
    const langDir = path.join(dataDir, lang);
    const files = fs.readdirSync(langDir);

    cefrLevels.forEach(level => {
        const hasLevelFile = files.some(file => file.startsWith(level) && (file.endsWith('.js') || file.endsWith('.json')));
        if (hasLevelFile) {
            console.log(`  ✅ ${level}: Found`);
        } else {
            console.log(`  ❌ ${level}: Missing`);
        }
    });

    const hasVerbsFile = files.some(file => file === 'verbs.js');
    if (hasVerbsFile) {
        console.log('  ✅ verbs.js: Found');
    } else {
        console.log('  ❌ verbs.js: Missing');
    }
});
