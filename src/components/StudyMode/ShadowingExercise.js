import React, { useState, useEffect, useCallback } from 'react';
import { getPronunciationFeedback } from '../../utils/ai/pronunciationFeedback';
import './ShadowingExercise.css';

const ShadowingExercise = ({ audioSrc, transcript }) => {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);

    const audio = new Audio(audioSrc);

    const handleListen = () => {
        if (isListening) {
            window.annyang.abort();
        } else {
            setUserTranscript('');
            setFeedback([]);
            window.annyang.start({ autoRestart: false, continuous: false });
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
        if (window.annyang) {
            const commands = {
                '*transcript': (transcript) => {
                    setUserTranscript(transcript);
                }
            };
            window.annyang.addCommands(commands);

            window.annyang.addCallback('start', () => {
                setIsListening(true);
            });

            window.annyang.addCallback('end', () => {
                setIsListening(false);
            });

            window.annyang.addCallback('result', () => {
                getFeedback();
            });
        }
    }, [getFeedback]);

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
                {isListening ? 'Stop' : 'Start'}
            </button>
            {isLoading && <p>Getting feedback...</p>}
        </div>
    );
};

export default ShadowingExercise;
