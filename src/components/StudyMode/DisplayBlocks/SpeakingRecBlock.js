import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextDisplay.css'; // Reusing for basic layout
import './SpeakingRecBlock.css';   // For specific recording UI styles

const SpeakingRecBlock = ({ blockData, onStudentRecordingComplete }) => { // onStudentRecordingComplete is a potential prop
    const { t, language } = useI18n();
    const { title, prompt = {} } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('speakingRecDefaultTitle') || 'Voice Recording';
    const speakingPrompt = prompt?.[language] || prompt?.COSYenglish || prompt?.default || '';

    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Attempt to get microphone permissions when component mounts or language changes
    // This is a very basic check and might be better handled globally or on user interaction
    useEffect(() => {
        // Placeholder for a function that might check/request permissions
        // checkAndRequestMicPermission(); 
    }, []);


    const startRecording = async () => {
        setError('');
        setAudioURL('');
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // Or 'audio/webm' etc.
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                if (onStudentRecordingComplete) {
                    onStudentRecordingComplete(blockData.id, audioBlob); // Pass blob for potential upload
                }
                // Clean up stream tracks
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError(t('microphoneAccessError') || 'Could not access microphone. Please check permissions.');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // The onstop event will handle setting the audioURL
        }
    };

    const handleRecordButtonClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="speaking-rec-block display-simple-block">
            <h4>{blockTitle}</h4>
            {speakingPrompt ? (
                <p className="speaking-prompt-display">{speakingPrompt}</p>
            ) : (
                <p>({t('noSpeakingPromptProvided') || 'No prompt provided for this task.'})</p>
            )}

            <div className="recording-controls">
                <button 
                    onClick={handleRecordButtonClick} 
                    className={`btn record-btn ${isRecording ? 'recording' : ''}`}
                    aria-pressed={isRecording}
                >
                    {isRecording ? (t('stopRecordingBtnText') || '⏹️ Stop Recording') : (t('startRecordingBtnText') || '🎤 Start Recording')}
                </button>
                {isRecording && <span className="recording-indicator">{t('recordingNowIndicator') || 'Recording...'}</span>}
            </div>

            {error && <p className="error-message recording-error">{error}</p>}

            {audioURL && !isRecording && (
                <div className="audio-playback-area">
                    <h5>{t('yourRecordingLabel') || 'Your Recording:'}</h5>
                    <audio src={audioURL} controls />
                    <button onClick={startRecording} className="btn btn-secondary record-again-btn"> 
                        {t('recordAgainBtnText') || '🎙️ Record Again'}
                    </button>
                </div>
            )}
            <p className="feature-notice"><em>{t('audioRecordingStorageNotice') || 'Note: Recordings are currently local to your browser session and not saved long-term.'}</em></p>
        </div>
    );
};

export default SpeakingRecBlock;
