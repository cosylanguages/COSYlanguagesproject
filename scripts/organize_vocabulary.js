const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data/vocabulary');
const dictionaryDir = path.join(dataDir, 'dictionary');
const oppositesDir = path.join(dataDir, 'opposites');
const wordsDir = path.join(dataDir, 'words');

const languages = require('../language_config');

languages.forEach(lang => {
    const langDictionaryDir = path.join(dictionaryDir, lang);

    // Move opposites
    const oppositesFilePath = path.join(oppositesDir, `${lang}.json`);
    if (fs.existsSync(oppositesFilePath)) {
        const opposites = JSON.parse(fs.readFileSync(oppositesFilePath, 'utf8'));
        if (opposites.length > 0) {
            const a0FilePath = path.join(langDictionaryDir, 'a0.js');
            let vocabulary = {};
            if (fs.existsSync(a0FilePath)) {
                const content = fs.readFileSync(a0FilePath, 'utf8');
const match = content.match(/export const \w+\s*=\s*(\{[\s\S]*\});/);
                if (match) {
                    try {
                        vocabulary = JSON.parse(match[1]);
                    } catch (e) {
                        console.error(`Error parsing ${a0FilePath}: ${e.message}`);
                    }
                }
            }
            if (!vocabulary.Opposites) {
                vocabulary.Opposites = [];
            }
            vocabulary.Opposites.push(...opposites);
            const newContent = `export const vocabulary = ${JSON.stringify(vocabulary, null, 2)};`;
            fs.writeFileSync(a0FilePath, newContent, 'utf8');
            fs.unlinkSync(oppositesFilePath);
        }
    }

    // Move words
    const wordsFilePath = path.join(wordsDir, `${lang}.json`);
    if (fs.existsSync(wordsFilePath)) {
        const words = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));
        if (words.length > 0) {
            const a0FilePath = path.join(langDictionaryDir, 'a0.js');
            let vocabulary = {};
            if (fs.existsSync(a0FilePath)) {
                const content = fs.readFileSync(a0FilePath, 'utf8');
                const match = content.match(/export const vocabulary = (\{[\s\S]*?\});/);
                if (match) {
                    vocabulary = JSON.parse(match[1]);
                }
            }
            if (!vocabulary.Words) {
                vocabulary.Words = [];
            }
            vocabulary.Words.push(...words);
            const newContent = `export const vocabulary = ${JSON.stringify(vocabulary, null, 2)};`;
            fs.writeFileSync(a0FilePath, newContent, 'utf8');
            fs.unlinkSync(wordsFilePath);
        }
    }
});

console.log('Vocabulary organized successfully!');
