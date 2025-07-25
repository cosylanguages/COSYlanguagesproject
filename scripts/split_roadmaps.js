const fs = require('fs');
const path = require('path');

const roadmapsDir = path.join(__dirname, '../');
const outputDir = path.join(__dirname, '../public/data/roadmaps');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const roadmapFiles = fs.readdirSync(roadmapsDir).filter(file => file.endsWith('_roadmap.json'));

roadmapFiles.forEach(file => {
  const roadmapPath = path.join(roadmapsDir, file);
  const roadmap = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
  const language = file.split('_')[0];

  const languageDir = path.join(outputDir, language);
  if (!fs.existsSync(languageDir)) {
    fs.mkdirSync(languageDir);
  }

  roadmap.levels.forEach(level => {
    const levelPath = path.join(languageDir, `${level.level_code}.json`);
    fs.writeFileSync(levelPath, JSON.stringify(level, null, 2), 'utf8');
  });

  console.log(`Split ${file} into ${roadmap.levels.length} level files.`);
});
