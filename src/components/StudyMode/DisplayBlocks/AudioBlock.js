import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import Button from '../../Common/Button';
import './AudioBlock.css';

const AudioBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, audioUrl, audioFileName, ttsText, generatedTtsUrl, transcript, transcriptVisible: initialTranscriptVisible } = blockData;

    const [showTranscript, setShowTranscript] = useState(initialTranscriptVisible !== undefined ? initialTranscriptVisible : false);

    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        if (typeof multilingualObject === 'string') return multilingualObject; // Should not happen with new structure
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };
    
    const localizedTitle = getLocalizedText(title);
    const localizedTtsText = getLocalizedText(ttsText);
    const localizedTranscript = getLocalizedText(transcript);

    const renderAudioPlayer = () => {
        const sourceUrl = generatedTtsUrl || audioUrl; // Prioritize generated TTS URL if available

        if (sourceUrl) {
            return (
                <audio controls src={sourceUrl} style={{ width: '100%', marginBottom: '10px' }}>
                    {t('audioTagNotSupported') || 'Your browser does not support the audio element.'}
                </audio>
            );
        }
        if (audioFileName) {
            return (
                <div className="audio-upload-placeholder">
                    <p><strong>{localizedTitle || audioFileName}</strong></p>
                    <p><em>({t('audioFileUploadedPlaceholder') || `Audio file "${audioFileName}" is part of this lesson. Playback requires backend integration.`})</em></p>
                </div>
            );
        }
        if (localizedTtsText) {
             return (
                <div className="audio-tts-placeholder">
                    <p><strong>{localizedTitle || (t('ttsAudioTitlePlaceholder') || 'Audio from Text')}</strong></p>
                    <p><em>({t('ttsPendingPlaybackNote') || 'Text-to-Speech audio to be generated from the following text:'})</em></p>
                    <blockquote className="tts-text-quote">{localizedTtsText}</blockquote>
                </div>
            );
        }
        return <p>{t('noAudioSourceProvided') || 'No audio source provided for this block.'}</p>;
    };

    return (
        <div className="audio-block">
            {localizedTitle && <h4>{localizedTitle}</h4>}
            {renderAudioPlayer()}
            
            {localizedTranscript && (
                <div className="transcript-section">
                    <Button
                        onClick={() => setShowTranscript(!showTranscript)} 
                        className="button--secondary"
                        aria-expanded={showTranscript}
                    >
                        {showTranscript ? (t('hideTranscriptBtn') || 'Hide Transcript') : (t('showTranscriptBtn') || 'Show Transcript')}
                    </Button>
                    {showTranscript && (
                        <div className="transcript-content">
                            <pre>{localizedTranscript}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioBlock;
