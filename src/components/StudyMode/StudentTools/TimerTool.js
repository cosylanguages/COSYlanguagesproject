import React, { useState, useEffect, useRef } from 'react'; // Removed useCallback
import { useI18n } from '../../../i18n/I18nContext';
import './TimerTool.css'; // To be created

const TimerTool = ({ isOpen, onClose }) => {
    const { t } = useI18n();
    const [time, setTime] = useState(0); // in seconds
    const [isActive, setIsActive] = useState(false);
    const [isCountdown, setIsCountdown] = useState(false);
    const [initialCountdownTime, setInitialCountdownTime] = useState(15 * 60); // Default 15 minutes in seconds
    const [countdownInputMinutes, setCountdownInputMinutes] = useState('15');

    const intervalRef = useRef(null);
    // const alarmSoundRef = useRef(null); // For optional sound

    // useEffect(() => {
    //     // Preload sound
    //     alarmSoundRef.current = new Audio('/assets/sounds/success.mp3'); // Path to your sound file
    // }, []);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (isCountdown) {
                        if (prevTime <= 1) {
                            clearInterval(intervalRef.current);
                            setIsActive(false);
                            // alarmSoundRef.current?.play().catch(e => console.warn("Timer alarm play failed:", e));
                            alert(t('timerTimesUpMsg') || "Time's up!");
                            return 0; // Or initialCountdownTime if you want it to reset to that
                        }
                        return prevTime - 1;
                    } else {
                        return prevTime + 1;
                    }
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, isCountdown, t]); // Removed initialCountdownTime from deps to avoid reset on input change while running

    const handleStartPause = () => {
        if (isCountdown && !isActive && time === 0) { // Starting a new countdown
            const newInitialTime = parseInt(countdownInputMinutes, 10) * 60;
            if (isNaN(newInitialTime) || newInitialTime <=0) {
                alert(t('timerInvalidMinutes') || "Please enter a valid number of minutes.");
                return;
            }
            setInitialCountdownTime(newInitialTime);
            setTime(newInitialTime);
        }
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(isCountdown ? initialCountdownTime : 0);
    };

    const handleModeToggle = () => {
        setIsActive(false); // Stop timer when switching mode
        const newIsCountdown = !isCountdown;
        setIsCountdown(newIsCountdown);
        setTime(newIsCountdown ? initialCountdownTime : 0);
    };
    
    const handleCountdownInputChange = (e) => {
        const minutes = e.target.value;
        setCountdownInputMinutes(minutes);
        if (!isActive) { // Only update initial time if timer is not running
            const newInitialTime = parseInt(minutes, 10) * 60;
            if (!isNaN(newInitialTime) && newInitialTime > 0) {
                setInitialCountdownTime(newInitialTime);
                if (isCountdown) {
                    setTime(newInitialTime);
                }
            } else if (minutes === '') { // Allow clearing input
                 setInitialCountdownTime(0);
                 if (isCountdown) setTime(0);
            }
        }
    };


    if (!isOpen) return null;

    return (
        <div className="timer-tool-overlay" onClick={onClose}>
            <div className="timer-tool-panel" onClick={(e) => e.stopPropagation()}>
                <div className="timer-tool-header">
                    <h4>{t('timerToolTitle') || 'Study Timer'}</h4>
                    <button onClick={onClose} className="btn-icon close-timer-btn" aria-label={t('closeTimerBtnAria') || 'Close Timer'}>
                        &times;
                    </button>
                </div>
                
                <div className="timer-display">{formatTime(time)}</div>

                <div className="timer-mode-select">
                    <button 
                        onClick={handleModeToggle} 
                        className={`btn btn-sm ${!isCountdown ? 'active' : 'btn-outline-secondary'}`}
                        disabled={isActive}
                    >
                        {t('timerStopwatchMode') || 'Stopwatch'}
                    </button>
                    <button 
                        onClick={handleModeToggle} 
                        className={`btn btn-sm ${isCountdown ? 'active' : 'btn-outline-secondary'}`}
                        disabled={isActive}
                    >
                        {t('timerCountdownMode') || 'Countdown'}
                    </button>
                </div>

                {isCountdown && (
                    <div className="countdown-setup">
                        <input 
                            type="number"
                            value={countdownInputMinutes}
                            onChange={handleCountdownInputChange}
                            placeholder={t('timerMinutesPlaceholder') || 'Minutes'}
                            disabled={isActive}
                            min="1"
                        />
                        <span>{t('timerMinutesLabel') || 'min'}</span>
                    </div>
                )}

                <div className="timer-controls">
                    <button onClick={handleStartPause} className={`btn ${isActive ? 'btn-warning' : 'btn-success'}`}>
                        {isActive ? (t('timerPauseBtn') || 'Pause') : (t('timerStartBtn') || 'Start')}
                    </button>
                    <button onClick={handleReset} className="btn btn-danger" disabled={isActive && time === 0}>
                        {t('timerResetBtn') || 'Reset'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimerTool;
