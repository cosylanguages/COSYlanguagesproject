import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './ShadowingExercise.css';

const ShadowingExercise = ({ audioSrc, transcript }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState([]);
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
            setIsListening(false);
        } else {
            resetTranscript();
            setFeedback([]);
            SpeechRecognition.startListening({ continuous: true });
            setIsListening(true);
            audio.play();
        }
    };

    const compareTranscripts = () => {
        const originalWords = transcript.split(' ');
        const userWords = userTranscript.split(' ');
        const newFeedback = [];

        originalWords.forEach((word, index) => {
            if (userWords[index] === word) {
                newFeedback.push({ word, isCorrect: true });
            } else {
                newFeedback.push({ word, isCorrect: false });
            }
        });
        setFeedback(newFeedback);
    };

    useEffect(() => {
        if (!listening && userTranscript) {
            compareTranscripts();
        }
    }, [listening, userTranscript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="shadowing-exercise">
            <h2>Shadowing Exercise</h2>
            <p>
                <strong>Original Transcript:</strong>
                {feedback.map((item, index) => (
                    <span key={index} className={item.isCorrect ? 'correct' : 'incorrect'}>
                        {item.word}{' '}
                    </span>
                ))}
            </p>
            <p><strong>Your Transcript:</strong> {userTranscript}</p>
            <button onClick={handleListen}>
                {listening ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};

export default ShadowingExercise;
