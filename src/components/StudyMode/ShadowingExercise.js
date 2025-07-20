import React, { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getPronunciationFeedback } from '../../utils/ai/pronunciationFeedback';
import './ShadowingExercise.css';

const ShadowingExercise = ({ audioSrc, transcript }) => {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {
        transcript: userTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const audio = new Audio(audioSrc);

    const handleListen = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            setFeedback([]);
            SpeechRecognition.startListening({ continuous: true });
            audio.play();
        }
    };

    const getFeedback = useCallback(async () => {
        setIsLoading(true);
        const aiFeedback = await getPronunciationFeedback(userTranscript);
        setFeedback(aiFeedback);
        setIsLoading(false);
    }, [userTranscript]);

    useEffect(() => {
        if (!listening && userTranscript) {
            getFeedback();
        }
    }, [listening, userTranscript, getFeedback]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="shadowing-exercise">
            <h2>Shadowing Exercise</h2>
            <p>
                <strong>Original Transcript:</strong> {transcript}
            </p>
            <p>
                <strong>Your Pronunciation:</strong>
                {feedback.map((item, index) => (
                    <span key={index} className={item.isCorrect ? 'correct' : 'incorrect'}>
                        {item.word}{' '}
                    </span>
                ))}
            </p>
            <p><strong>Your Transcript:</strong> {userTranscript}</p>
            <button onClick={handleListen} disabled={isLoading}>
                {listening ? 'Stop' : 'Start'}
            </button>
            {isLoading && <p>Getting feedback...</p>}
        </div>
    );
};

export default ShadowingExercise;
