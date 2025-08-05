const fs = require('fs');
const path = require('path');

function createLiftEntry(word) {
    return `
    <entry id="${word.toLowerCase().replace(/ /g, '_')}">
        <lexical-unit>
            <form lang="en">
                <text>${word}</text>
            </form>
        </lexical-unit>
    </entry>
    `;
}

function createLiftFile(language, words) {
    const entries = words.map(createLiftEntry).join('');
    return `<?xml version="1.0" encoding="UTF-8"?>
<lift version="0.13" producer="CoSy Dictionary Converter">
    <header>
        <dictionary>
            <entry id="dummy_entry"/>
        </dictionary>
    </header>
    ${entries}
</lift>
`;
}

async function convertAll() {
    const wordsDir = path.join(__dirname, '../public/data/vocabulary/words');
    const outputDir = path.join(__dirname, '../output/lift');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(wordsDir);

    for (const file of files) {
        if (path.extname(file) === '.json') {
            const lang = path.basename(file, '.json');
            const content = fs.readFileSync(path.join(wordsDir, file), 'utf-8');
            const data = JSON.parse(content);
            const words = Object.values(data).flat();
            const liftXml = createLiftFile(lang, words);
            fs.writeFileSync(path.join(outputDir, `${lang}.lift`), liftXml);
            console.log(`Converted ${lang}.json to ${lang}.lift`);
        }
    }
}

convertAll();
