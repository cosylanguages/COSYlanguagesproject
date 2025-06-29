import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureAudioBlock.css';

const ConfigureAudioBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    
    const [title, setTitle] = useState({});
    const [audioUrl, setAudioUrl] = useState('');
    const [audioFileName, setAudioFileName] = useState('');
    // const [audioFile, setAudioFile] = useState(null); // Actual file object
    const [ttsText, setTtsText] = useState({});
    const [transcript, setTranscript] = useState({});
    const [transcriptVisible, setTranscriptVisible] = useState(true);
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setAudioUrl(existingBlockData.audioUrl || '');
            setAudioFileName(existingBlockData.audioFileName || '');
            setTtsText(existingBlockData.ttsText || {});
            setTranscript(existingBlockData.transcript || {});
            setTranscriptVisible(existingBlockData.transcriptVisible !== undefined ? existingBlockData.transcriptVisible : true);
        } else {
            // Defaults for a new block
            setTitle({});
            setAudioUrl('');
            setAudioFileName('');
            setTtsText({});
            setTranscript({});
            setTranscriptVisible(true);
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
            // setAudioFile(file);
            setAudioFileName(file.name);
            // Clear other sources if a file is selected, or define precedence
            setAudioUrl('');
            setTtsText(prev => ({ ...prev, [selectedLang]: '' })); 
        }
    };
    
    const handleTtsTextChange = (lang, value) => {
        handleMultilingualChange(setTtsText, lang, value);
        if (value) { // If TTS text is entered, clear file/URL
            setAudioUrl('');
            setAudioFileName('');
            // setAudioFile(null);
        }
    };

    const handleAudioUrlChange = (value) => {
        setAudioUrl(value);
        if (value) { // If URL is entered, clear file/TTS
            setAudioFileName('');
            // setAudioFile(null);
            setTtsText(prev => ({ ...prev, [selectedLang]: '' }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!audioUrl && !audioFileName && !Object.values(ttsText).some(text => text.trim() !== '')) {
            alert(t('audioSourceRequiredError') || 'Please provide an audio URL, upload a file, or enter text for TTS.');
            return;
        }
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'media/audio',
            title,
            audioUrl,
            audioFileName,
            ttsText,
            // generatedTtsUrl: '', // This would be set by a backend TTS service
            transcript,
            transcriptVisible,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-audio-block">
            <h3>{t('configureAudioBlockTitle') || 'Configure Audio Block'}</h3>

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
                <label htmlFor="audio-block-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="audio-block-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>
            
            <fieldset>
                <legend>{t('audioSourceLegend') || 'Audio Source (Choose One)'}</legend>
                <div className="form-group">
                    <label htmlFor="audio-url">{t('audioUrlLabel') || 'Audio URL (direct link to audio file)'}:</label>
                    <input
                        id="audio-url"
                        type="url"
                        value={audioUrl}
                        onChange={(e) => handleAudioUrlChange(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audio-upload">{t('orUploadAudioLabel') || 'Or Upload Audio File'}:</label>
                    <input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                    />
                    {audioFileName && <p className="file-name-display">{t('selectedFileLabel') || 'Selected file:'} {audioFileName}</p>}
                     <p className="upload-note"><em>({t('audioUploadNote') || 'Note: Audio file upload requires backend setup. This demo stores filename only.'})</em></p>
                </div>

                <div className="form-group">
                    <label htmlFor="audio-tts-text">
                        {t('orGenerateAudioTtsLabel', { lang: selectedLang }) || `Or Generate Audio from Text (TTS - ${selectedLang})`}:
                    </label>
                    <textarea
                        id="audio-tts-text"
                        value={ttsText[selectedLang] || ''}
                        onChange={(e) => handleTtsTextChange(selectedLang, e.target.value)}
                        placeholder={t('enterTtsTextPlaceholder') || "Enter text to be converted to speech..."}
                        rows="3"
                    />
                    <p className="upload-note"><em>({t('ttsGenerationNote') || 'Note: TTS generation requires integration with a Text-to-Speech service.'})</em></p>
                </div>
            </fieldset>

            <fieldset style={{marginTop: '20px'}}>
                <legend>{t('transcriptOptionalLegend') || 'Transcript (Optional)'}</legend>
                <div className="form-group">
                    <label htmlFor="audio-transcript">
                        {t('transcriptTextLabel', { lang: selectedLang }) || `Transcript Text (${selectedLang})`}:
                    </label>
                    <textarea
                        id="audio-transcript"
                        value={transcript[selectedLang] || ''}
                        onChange={(e) => handleMultilingualChange(setTranscript, selectedLang, e.target.value)}
                        placeholder={t('enterTranscriptPlaceholder') || "Enter transcript manually..."}
                        rows="4"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="audio-transcript-visible" style={{ display: 'inline-block', marginRight: '10px' }}>
                        {t('transcriptVisibleToStudentLabel') || 'Transcript visible to student by default:'}
                    </label>
                    <input
                        id="audio-transcript-visible"
                        type="checkbox"
                        checked={transcriptVisible}
                        onChange={(e) => setTranscriptVisible(e.target.checked)}
                        style={{verticalAlign: 'middle', width: 'auto', height: 'auto'}}
                    />
                </div>
            </fieldset>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureAudioBlock;
