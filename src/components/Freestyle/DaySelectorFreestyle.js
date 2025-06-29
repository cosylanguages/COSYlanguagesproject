import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';

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
  
  const labelStyle = { marginRight: '10px', fontWeight: 'bold', color: 'var(--text-color-dark)' }; // Assuming dark text on light bg for controls
  const selectStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '100px', marginRight: '10px' };
  const radioContainerStyle = { marginBottom: '10px', display: 'flex', gap: '15px', justifyContent: 'center' };
  const radioLabelStyle = { marginRight: '5px', color: 'var(--text-color-dark)'};

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <div style={{ marginBottom: '15px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-color-dark)' }}>
        {t('titles.chooseYourDay', '📅 Choose Your Day(s):')}
      </div>
      
      <div style={radioContainerStyle}>
        <label style={radioLabelStyle}>
          <input type="radio" name="dayMode" value="single" checked={mode === 'single'} onChange={() => handleModeChange('single')} />
          {t('daySelector.singleDay', 'Single Day')}
        </label>
        <label style={radioLabelStyle}>
          <input type="radio" name="dayMode" value="range" checked={mode === 'range'} onChange={() => handleModeChange('range')} />
          {t('daySelector.dayRange', 'Day Range')}
        </label>
      </div>

      {mode === 'single' && (
        <div style={{ textAlign: 'center' }}>
          <select
            id="freestyle-day-select"
            value={singleDay}
            onChange={handleSingleDayChange}
            aria-label="Choose your day for freestyle mode"
            style={selectStyle}
          >
            <option value="">{t('daySelector.selectDay', 'Select Day')}</option>
            {daysOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {thematicName && (
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555', fontStyle: 'italic' }}>
              {thematicName}
            </div>
          )}
        </div>
      )}

      {mode === 'range' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <div>
            <label htmlFor="freestyle-day-from" style={{...labelStyle, display:'block', marginBottom:'5px'}}>{t('daySelector.from', 'From:')}</label>
            <select id="freestyle-day-from" value={dayFrom} onChange={handleDayFromChange} style={selectStyle}>
              <option value="">{t('daySelector.selectStartDay', 'Start')}</option>
              {daysOptions.map((day) => (
                <option key={`from-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="freestyle-day-to" style={{...labelStyle, display:'block', marginBottom:'5px'}}>{t('daySelector.to', 'To:')}</label>
            <select id="freestyle-day-to" value={dayTo} onChange={handleDayToChange} style={selectStyle}>
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
