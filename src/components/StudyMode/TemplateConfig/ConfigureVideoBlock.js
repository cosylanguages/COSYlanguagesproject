import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureVideoBlock.css';

const ConfigureVideoBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [caption, setCaption] = useState({});
    const [videoUrl, setVideoUrl] = useState('');
    // const [videoFile, setVideoFile] = useState(null); // For file object
    const [videoFileName, setVideoFileName] = useState(''); // For storing name of uploaded file
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setCaption(existingBlockData.caption || {});
            setVideoUrl(existingBlockData.videoUrl || '');
            setVideoFileName(existingBlockData.videoFileName || '');
        } else {
            setTitle({});
            setCaption({});
            setVideoUrl('');
            setVideoFileName('');
        }
        if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            setSelectedLang(availableLanguages[0]);
        } else if (availableLanguages && availableLanguages.length > 0 && availableLanguages.includes(currentUILanguage)){
            setSelectedLang(currentUILanguage);
        }
    }, [existingBlockData, currentUILanguage, availableLanguages]);

    useEffect(() => {
        if (availableLanguages && availableLanguages.includes(currentUILanguage)) {
            setSelectedLang(currentUILanguage);
        } else if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            setSelectedLang(availableLanguages[0]);
        }
    }, [currentUILanguage, availableLanguages, selectedLang]);

    const handleMultilingualChange = (setter, lang, value) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // setVideoFile(file);
            setVideoFileName(file.name);
            // Note: Actual file upload needs backend handling.
            // For now, we're just storing the name. If URL is also provided, URL might take precedence.
            setVideoUrl(''); // Clear URL if a file is selected, or decide on precedence
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation: either URL or filename must be present
        if (!videoUrl && !videoFileName) {
            alert(t('videoSourceRequiredError') || 'Please provide a video URL or upload a video file.');
            return;
        }
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'media/video', 
            title,
            caption,
            videoUrl,
            videoFileName, // Store filename; actual upload handled by backend
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-video-block">
            <h3>{t('configureVideoBlockTitle') || 'Configure Video Block'}</h3>

            <div className="language-selector-tabs">
                {availableLanguages.map(langCode => (
                    <button
                        key={langCode}
                        type="button"
                        className={`lang-tab-btn ${selectedLang === langCode ? 'active' : ''}`}
                        onClick={() => setSelectedLang(langCode)}
                    >
                        {langCode}
                    </button>
                ))}
            </div>

            <div className="form-group">
                <label htmlFor="video-block-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="video-block-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="video-url">{t('videoUrlLabel') || 'Video URL (e.g., YouTube, Vimeo, direct link)'}:</label>
                <input
                    id="video-url"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => { setVideoUrl(e.target.value); setVideoFileName(''); /* setVideoFile(null); */ }}
                    placeholder="https://example.com/video.mp4"
                />
            </div>

            <div className="form-group">
                <label htmlFor="video-upload">{t('orUploadVideoLabel') || 'Or Upload Video File'}:</label>
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                />
                {videoFileName && <p className="file-name-display"> {t('selectedFileLabel') || 'Selected file:'} {videoFileName}</p>}
                <p className="upload-note"><em>({t('videoUploadNote') || 'Note: Video file upload requires backend setup. This demo stores filename only.'})</em></p>
            </div>


            <div className="form-group">
                <label htmlFor="video-block-caption">{t('blockCaptionLabelOptional') || 'Caption (Optional)'}:</label>
                <textarea
                    id="video-block-caption"
                    value={caption[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setCaption, selectedLang, e.target.value)}
                    placeholder={t('enterCaptionPlaceholder', { lang: selectedLang }) || `Enter caption in ${selectedLang}`}
                    rows="2"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureVideoBlock;
