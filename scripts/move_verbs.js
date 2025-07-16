const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data/vocabulary/dictionary');
const languages = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory());

languages.forEach(lang => {
    const langDir = path.join(dataDir, lang);
    const verbs = [];
    const files = fs.readdirSync(langDir);

    files.forEach(file => {
        if (file.endsWith('.js') && file !== 'verbs.js') {
            const filePath = path.join(langDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // This is a simplified way to extract the vocabulary data.
            // It assumes the file format is `export const vocabulary = { ... };`
            const match = content.match(/export const vocabulary = (\{[\s\S]*?\});/);
            if (match) {
                try {
                    const vocabulary = JSON.parse(match[1]);
                    Object.keys(vocabulary).forEach(theme => {
                        if (Array.isArray(vocabulary[theme])) {
                            vocabulary[theme] = vocabulary[theme].filter(item => {
                                if (item.partOfSpeech === 'verb' || item.partOfSpeech === 'v' || item.partOfSpeech === 'v phr' || item.partOfSpeech === 'phr v') {
                                    verbs.push(item);
                                    return false;
                                }
                                return true;
                            });
                        }
                    });

                    const newContent = `export const vocabulary = ${JSON.stringify(vocabulary, null, 2)};`;
                    fs.writeFileSync(filePath, newContent, 'utf8');
                } catch (e) {
                    console.error(`Error parsing ${filePath}: ${e.message}`);
                }
            }
        }
    });

    if (verbs.length > 0) {
        const verbsFilePath = path.join(langDir, 'verbs.js');
        let existingVerbs = [];
        if (fs.existsSync(verbsFilePath)) {
            const content = fs.readFileSync(verbsFilePath, 'utf8');
            const match = content.match(/export const vocabulary = (\{[\s\S]*\});/);
            if (match) {
                try {
                    const parsed = JSON.parse(match[1]);
                    existingVerbs = parsed.Verbs || [];
                } catch (e) {
                    console.error(`Error parsing existing verbs file ${verbsFilePath}: ${e.message}`);
                }
            }
        }
        const allVerbs = { Verbs: [...existingVerbs, ...verbs] };
        const newContent = `export const vocabulary = ${JSON.stringify(allVerbs, null, 2)};`;
        fs.writeFileSync(verbsFilePath, newContent, 'utf8');
    }
});

console.log('Verbs moved successfully!');
