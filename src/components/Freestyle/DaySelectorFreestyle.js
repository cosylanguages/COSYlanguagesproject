import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './DaySelectorFreestyle.css'; // Import the new CSS file

const DaySelectorFreestyle = ({ currentDays, onDaysChange, language }) => {
  const [mode, setMode] = useState('single'); // 'single' or 'range'
  const [singleDay, setSingleDay] = useState('');
  const [dayFrom, setDayFrom] = useState('');
  const [dayTo, setDayTo] = useState('');
  const [thematicName, setThematicName] = useState('');

  const { t, getTranslationsForLang } = useI18n();
  const MAX_DAYS = 30; // Assuming max 30 days
  const daysOptions = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  // Initialize from currentDays prop
  useEffect(() => {
    if (currentDays && currentDays.length > 0) {
      if (currentDays.length === 1) {
        setMode('single');
        setSingleDay(String(currentDays[0]));
        setDayFrom('');
        setDayTo('');
      } else {
        setMode('range');
        setDayFrom(String(currentDays[0]));
        setDayTo(String(currentDays[currentDays.length - 1]));
        setSingleDay('');
      }
    } else {
      // Default to single day mode, no day selected
      setMode('single');
      setSingleDay('');
      setDayFrom('');
      setDayTo('');
    }
  }, [currentDays]);
  
  // Update thematic name when singleDay or language changes
  useEffect(() => {
    if (mode === 'single' && singleDay && language) {
      const langTranslations = getTranslationsForLang(language, 'dayNames');
      setThematicName(langTranslations[singleDay] || '');
    } else {
      setThematicName('');
    }
  }, [singleDay, language, mode, getTranslationsForLang]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Reset selections when mode changes to avoid inconsistent state
    setSingleDay('');
    setDayFrom('');
    setDayTo('');
    setThematicName('');
    onDaysChange([]); // Notify parent of cleared selection
  };

  const handleSingleDayChange = (e) => {
    const dayValue = e.target.value;
    setSingleDay(dayValue);
    if (dayValue) {
      onDaysChange([parseInt(dayValue, 10)]);
    } else {
      onDaysChange([]);
    }
  };

  const handleDayFromChange = (e) => {
    const fromValue = e.target.value;
    setDayFrom(fromValue);
    if (fromValue && dayTo) {
      const from = parseInt(fromValue, 10);
      const to = parseInt(dayTo, 10);
      if (from <= to) {
        onDaysChange(Array.from({ length: to - from + 1 }, (_, i) => from + i));
      } else {
        onDaysChange([]); // Invalid range
      }
    } else {
      onDaysChange([]);
    }
  };

  const handleDayToChange = (e) => {
    const toValue = e.target.value;
    setDayTo(toValue);
    if (dayFrom && toValue) {
      const from = parseInt(dayFrom, 10);
      const to = parseInt(toValue, 10);
      if (from <= to) {
        onDaysChange(Array.from({ length: to - from + 1 }, (_, i) => from + i));
      } else {
        onDaysChange([]); // Invalid range
      }
    } else {
      onDaysChange([]);
    }
  };
  
  return (
    <div className="day-selector-card">
      <div className="day-selector-title">
        <span role="img" aria-label="calendar">📅</span>
        {t('titles.chooseYourDay', 'Choose Your Day(s)')}
      </div>
      <div className="radio-group">
        <label className="radio-label">
          <input type="radio" name="dayMode" value="single" checked={mode === 'single'} onChange={() => handleModeChange('single')} />
          {t('daySelector.singleDay', 'Single Day')}
        </label>
        <label className="radio-label">
          <input type="radio" name="dayMode" value="range" checked={mode === 'range'} onChange={() => handleModeChange('range')} />
          {t('daySelector.dayRange', 'Day Range')}
        </label>
      </div>
      {mode === 'single' && (
        <div className="day-select-dropdown-container">
          <select
            id="freestyle-day-select"
            value={singleDay}
            onChange={handleSingleDayChange}
            aria-label="Choose your day for freestyle mode"
            className="day-select-dropdown"
          >
            <option value="">{t('daySelector.selectDay', 'Select Day')}</option>
            {daysOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {thematicName && (
            <div className="thematic-name-display">
              {thematicName}
            </div>
          )}
        </div>
      )}
      {mode === 'range' && (
        <div className="day-range-container">
          <div className="day-range-group">
            <label htmlFor="freestyle-day-from">{t('daySelector.from', 'From:')}</label>
            <select id="freestyle-day-from" value={dayFrom} onChange={handleDayFromChange} className="day-select-dropdown">
              <option value="">{t('daySelector.selectStartDay', 'Start')}</option>
              {daysOptions.map((day) => (
                <option key={`from-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="day-range-group">
            <label htmlFor="freestyle-day-to">{t('daySelector.to', 'To:')}</label>
            <select id="freestyle-day-to" value={dayTo} onChange={handleDayToChange} className="day-select-dropdown">
              <option value="">{t('daySelector.selectEndDay', 'End')}</option>
              {daysOptions.map((day) => (
                <option key={`to-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelectorFreestyle;
