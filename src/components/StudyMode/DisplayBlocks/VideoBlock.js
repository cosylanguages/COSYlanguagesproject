import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './VideoBlock.css';

// Helper to get YouTube video ID from URL
const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to get Vimeo video ID from URL
const getVimeoId = (url) => {
    const regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[3] : null;
};


const VideoBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, caption, videoUrl, videoFileName } = blockData;

    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    const renderVideo = () => {
        if (videoUrl) {
            const youtubeId = getYouTubeId(videoUrl);
            if (youtubeId) {
                return (
                    <div className="video-embed-container youtube-embed">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={getLocalizedText(title) || 'YouTube video player'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }

            const vimeoId = getVimeoId(videoUrl);
            if (vimeoId) {
                return (
                    <div className="video-embed-container vimeo-embed">
                        <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}`}
                            title={getLocalizedText(title) || 'Vimeo video player'}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }

            // Check for direct video file extensions
            if (/\.(mp4|webm|ogg)$/i.test(videoUrl)) {
                return (
                    <div className="video-direct-container">
                        <video controls src={videoUrl} title={getLocalizedText(title) || 'Video player'}>
                            {t('videoTagNotSupported') || 'Your browser does not support the video tag.'}
                        </video>
                    </div>
                );
            }
            // Fallback for other URLs - might be a page with a video, or unsupported direct link
             return (
                <p>
                    {t('unsupportedVideoUrlLabel') || 'Video link provided. Direct playback for this type of URL might not be supported in this view.'} <a href={videoUrl} target="_blank" rel="noopener noreferrer">{t('openVideoLink') || 'Open link'}</a>
                </p>
            );

        } else if (videoFileName) {
            return (
                <div className="video-upload-placeholder">
                    <p><strong>{getLocalizedText(title) || videoFileName}</strong></p>
                    <p><em>({t('videoFileUploadedPlaceholder') || `Video file "${videoFileName}" is part of this lesson. Playback of uploaded files requires backend integration.`})</em></p>
                </div>
            );
        }
        return <p>{t('noVideoSourceProvided') || 'No video source provided.'}</p>;
    };

    return (
        <div className="video-block">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {renderVideo()}
            {caption && getLocalizedText(caption) && <p className="caption">{getLocalizedText(caption)}</p>}
        </div>
    );
};

export default VideoBlock;
