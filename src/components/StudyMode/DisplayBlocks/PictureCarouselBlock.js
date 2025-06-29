import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './PictureCarouselBlock.css'; // To be created

const PictureCarouselBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!blockData || blockData.type !== 'vocabulary/images' || !blockData.items || blockData.items.length === 0) {
        return (
            <div className="picture-carousel-block exercise-block-display">
                <p>{t('errorIncorrectCarouselData') || 'Incorrect or empty data for Picture Carousel block.'}</p>
            </div>
        );
    }

    const { items, title: blockTitleObj } = blockData;

    let displayTitle = blockTitleObj?.[currentUILanguage] || blockTitleObj?.COSYenglish || t('pictureCarouselDefaultTitle') || 'Image Carousel';

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
    };

    const currentItem = items[currentIndex];
    const currentCaption = currentItem.text?.[currentUILanguage] || currentItem.text?.COSYenglish || '';

    return (
        <div className="picture-carousel-block exercise-block-display">
            {displayTitle && <h5 className="picture-carousel-block-title">{displayTitle}</h5>}
            
            <div className="carousel-viewport">
                <div 
                    className="carousel-track" 
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, index) => (
                        <div className="carousel-slide" key={item.id || index}>
                            <img src={item.src} alt={item.text?.[currentUILanguage] || item.text?.COSYenglish || `Carousel image ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-controls">
                <button onClick={goToPrevious} className="carousel-control-btn prev" aria-label={t('previousImageAria') || "Previous image"}>
                    &lt;
                </button>
                <div className="carousel-caption-area">
                    {currentCaption && <p className="carousel-caption" data-transliterable="true">{currentCaption}</p>}
                </div>
                <button onClick={goToNext} className="carousel-control-btn next" aria-label={t('nextImageAria') || "Next image"}>
                    &gt;
                </button>
            </div>
            
            <div className="carousel-dots">
                {items.map((_, index) => (
                    <span
                        key={index}
                        className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        role="button"
                        aria-label={t('goToImageAria', {num: index + 1}) || `Go to image ${index + 1}`}
                        tabIndex={0}
                        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setCurrentIndex(index);}}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default PictureCarouselBlock;
