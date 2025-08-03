import React, { useState, useEffect } from 'react';
import './HeroShowcase.css';

const roadmaps = [
  "armenian.json",
  "bashkir.json",
  "breton.json",
  "english.json",
  "french.json",
  "georgian.json",
  "german.json",
  "greek.json",
  "italian.json",
  "portuguese.json",
  "russian.json",
  "spanish.json",
  "tatar.json"
];

const fetchRandomContent = async () => {
    const randomRoadmapFile = roadmaps[Math.floor(Math.random() * roadmaps.length)];
    const roadmapRes = await fetch(`${process.env.PUBLIC_URL}/data/roadmaps/${randomRoadmapFile}`);
    const roadmapData = await roadmapRes.json();

    const contentType = Math.random() < 0.5 ? 'roadmap' : 'tip';

    if (contentType === 'roadmap') {
        return {
            type: 'Roadmap',
            title: roadmapData.language_name,
            text: roadmapData.levels[0].level_name,
        };
    } else {
        const tips = [
            ...(roadmapData.levels[0].learning_strategies_suggestions || []),
            ...(roadmapData.levels[0].pronunciation_focus_topics || []),
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        return {
            type: 'Tip of the Day',
            title: `Tip for ${roadmapData.language_name}`,
            text: randomTip,
        };
    }
};

const HeroShowcase = () => {
    const [featuredContent, setFeaturedContent] = useState([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const fetchInitialContent = async () => {
            try {
                const contentPromises = Array(3).fill().map(fetchRandomContent);
                const initialContent = await Promise.all(contentPromises);
                setFeaturedContent(initialContent);
            } catch (error) {
                console.error("Failed to fetch featured content:", error);
            }
        };

        fetchInitialContent();
    }, []);

    useEffect(() => {
        if (featuredContent.length > 0) {
            const interval = setInterval(() => {
                setIsFading(true);
                setTimeout(() => {
                    setCurrentItemIndex((prevIndex) => (prevIndex + 1) % featuredContent.length);
                    setIsFading(false);
                }, 500); // fade out duration
            }, 5000); // 5 seconds per item

            return () => clearInterval(interval);
        }
    }, [featuredContent]);

    if (featuredContent.length === 0) {
        return null;
    }

    const currentContent = featuredContent[currentItemIndex];

    return (
        <div className="hero-showcase">
            <div className={`hero-showcase-card ${isFading ? 'fade-out' : 'fade-in'}`}>
                <h3>Featured {currentContent.type}</h3>
                <h4>{currentContent.title}</h4>
                <p>{currentContent.text}</p>
            </div>
        </div>
    );
};

export default HeroShowcase;
