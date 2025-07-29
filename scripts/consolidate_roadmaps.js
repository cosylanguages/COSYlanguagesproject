const fs = require('fs').promises;
const path = require('path');

const rootDir = path.join(__dirname, '..');
const roadmapsDir = path.join(rootDir, 'public/data/roadmaps');

async function consolidateRoadmaps() {
  try {
    const languages = await fs.readdir(roadmapsDir);

    for (const language of languages) {
      const languageDir = path.join(roadmapsDir, language);
      try {
        const stats = await fs.stat(languageDir);

        if (stats.isDirectory()) {
          const roadmapFile = path.join(rootDir, `${language}_roadmap.json`);
          let roadmap;
          try {
            const roadmapData = await fs.readFile(roadmapFile, 'utf8');
            roadmap = JSON.parse(roadmapData);
            await fs.unlink(roadmapFile);
          } catch (error) {
            console.error(`Could not read or parse ${roadmapFile}`, error);
            continue;
          }

          for (let i = 0; i < roadmap.levels.length; i++) {
            const level = roadmap.levels[i];
            const levelFile = path.join(languageDir, `${level.level_code}.json`);
            try {
              const levelData = await fs.readFile(levelFile, 'utf8');
              const levelJson = JSON.parse(levelData);
              roadmap.levels[i] = { ...level, ...levelJson };
              await fs.unlink(levelFile);
            } catch (error) {
              console.error(`Could not read or parse ${levelFile}`, error);
            }
          }

          const newRoadmapFile = path.join(roadmapsDir, `${language}.json`);
          await fs.writeFile(newRoadmapFile, JSON.stringify(roadmap, null, 2));
          console.log(`Consolidated roadmap for ${language} created at ${newRoadmapFile}`);
          await fs.rm(languageDir, { recursive: true });
        }
      } catch (error) {
        // ignore if it's a file
      }
    }
  } catch (error) {
    console.error('Error consolidating roadmaps:', error);
  }
}

consolidateRoadmaps();
