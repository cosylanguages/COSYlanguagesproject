import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './DaySelectorFreestyle.css';

const DaySelectorFreestyle = ({
    currentDays, // reflects confirmed or temporary day selections (managed by parent island)
    onDaysChange, // wrapper to update temporary day selections in parent island
    language,
    onConfirm
}) => {
  // Internal state for managing the input values before confirmation
  const [internalSingleDay, setInternalSingleDay] = useState('');
  const [internalDayFrom, setInternalDayFrom] = useState('');
  const [internalDayTo, setInternalDayTo] = useState('');
  const [thematicName, setThematicName] = useState('');
  const [selectionMode, setSelectionMode] = useState('single'); // 'single' or 'range'

  const { t, getTranslationsForLang } = useI18n();
  const MAX_DAYS = 30;
  const daysOptions = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  // Determine visibility of input sections based on selectionMode
  const showSingleDayInputSection = selectionMode === 'single';
  const showDayRangeInputSection = selectionMode === 'range';

  useEffect(() => {
    if (showSingleDayInputSection) {
      if (currentDays && currentDays.length === 1) {
        setInternalSingleDay(String(currentDays[0]));
      } else {
        setInternalSingleDay('');
      }
    } else {
      setInternalSingleDay('');
    }

    if (showDayRangeInputSection) {
      if (currentDays && currentDays.length > 0) {
        setInternalDayFrom(String(currentDays[0]));
        setInternalDayTo(String(currentDays[currentDays.length - 1]));
      } else {
        setInternalDayFrom('');
        setInternalDayTo('');
      }
    } else {
      setInternalDayFrom('');
      setInternalDayTo('');
    }
  }, [currentDays, selectionMode, showDayRangeInputSection, showSingleDayInputSection]);

  useEffect(() => {
    if (showSingleDayInputSection && internalSingleDay && language) {
      const langTranslations = getTranslationsForLang(language, 'dayNames');
      setThematicName(langTranslations[internalSingleDay] || '');
    } else {
      setThematicName('');
    }
  }, [internalSingleDay, language, showSingleDayInputSection, getTranslationsForLang]);

  const handleInternalSingleDayChange = (e) => {
    const dayValue = e.target.value;
    setInternalSingleDay(dayValue);
    if (dayValue) {
      onDaysChange([parseInt(dayValue, 10)]); // Update temp state in parent
    } else {
      onDaysChange([]);
    }
  };

  const handleInternalDayFromChange = (e) => {
    const fromValue = e.target.value;
    setInternalDayFrom(fromValue);
    if (fromValue && internalDayTo) {
      const from = parseInt(fromValue, 10);
      const to = parseInt(internalDayTo, 10);
      if (from <= to) {
        onDaysChange(Array.from({ length: to - from + 1 }, (_, i) => from + i));
      } else {
        onDaysChange([]);
      }
    } else if (!fromValue && !internalDayTo) {
        onDaysChange([]);
    } else if (!fromValue && internalDayTo) {
        onDaysChange([]); // Or handle as incomplete
    }
  };

  const handleInternalDayToChange = (e) => {
    const toValue = e.target.value;
    setInternalDayTo(toValue);
    if (internalDayFrom && toValue) {
      const from = parseInt(internalDayFrom, 10);
      const to = parseInt(toValue, 10);
      if (from <= to) {
        onDaysChange(Array.from({ length: to - from + 1 }, (_, i) => from + i));
      } else {
        onDaysChange([]);
      }
    } else if (!toValue && !internalDayFrom) {
        onDaysChange([]);
    } else if (!toValue && internalDayFrom) {
        onDaysChange([]); // Or handle as incomplete
    }
  };

  const handleConfirmDays = () => {
    let daysToConfirm = [];
    if (showSingleDayInputSection && internalSingleDay) {
      daysToConfirm = [parseInt(internalSingleDay, 10)];
    } else if (showDayRangeInputSection && internalDayFrom && internalDayTo) {
      const from = parseInt(internalDayFrom, 10);
      const to = parseInt(internalDayTo, 10);
      if (from <= to) {
        daysToConfirm = Array.from({ length: to - from + 1 }, (_, i) => from + i);
      }
    }

    if (daysToConfirm.length > 0) {
      onConfirm(daysToConfirm);
    } else {
      console.warn("DaySelectorFreestyle: Attempted to confirm with no valid days selected.");
    }
  };

  const isConfirmButtonDisabled = () => {
    if (showSingleDayInputSection) {
      return !internalSingleDay;
    }
    if (showDayRangeInputSection) {
      if (!internalDayFrom || !internalDayTo) return true;
      const from = parseInt(internalDayFrom, 10);
      const to = parseInt(internalDayTo, 10);
      return from > to; // Disabled if range is invalid
    }
    return true; // Disabled if neither section is shown
  };

  return (
    <div className="day-selector-card">
      <div className="day-selector-title">
        <span role="img" aria-label="calendar">🗓️</span>
        {t('titles.chooseYourDay', 'Choose Your Day(s)')}
      </div>

      <div className="mode-choice-buttons">
        <label>
          <input
            type="radio"
            name="selectionMode"
            value="single"
            checked={selectionMode === 'single'}
            onChange={() => setSelectionMode('single')}
          />
          {t('daySelector.selectSingleDayMode', 'Select Single Day')}
        </label>
        <label>
          <input
            type="radio"
            name="selectionMode"
            value="range"
            checked={selectionMode === 'range'}
            onChange={() => setSelectionMode('range')}
          />
          {t('daySelector.selectDayRangeMode', 'Select Day Range')}
        </label>
      </div>

      {showSingleDayInputSection && (
        <div className="day-select-dropdown-container">
          <select
            id="freestyle-day-select"
            value={internalSingleDay}
            onChange={handleInternalSingleDayChange}
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

      {showDayRangeInputSection && (
        <div className="day-range-container">
          <div className="day-range-group">
            <label htmlFor="freestyle-day-from">{t('daySelector.from', 'From:')}</label>
            <select id="freestyle-day-from" value={internalDayFrom} onChange={handleInternalDayFromChange} className="day-select-dropdown">
              <option value="">{t('daySelector.selectStartDay', 'Start')}</option>
              {daysOptions.map((day) => (
                <option key={`from-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="day-range-group">
            <label htmlFor="freestyle-day-to">{t('daySelector.to', 'To:')}</label>
            <select id="freestyle-day-to" value={internalDayTo} onChange={handleInternalDayToChange} className="day-select-dropdown">
              <option value="">{t('daySelector.selectEndDay', 'End')}</option>
              {daysOptions.map((day) => (
                <option key={`to-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button
          onClick={handleConfirmDays}
          disabled={isConfirmButtonDisabled()}
          className="btn btn-primary"
        >
          {t('buttons.confirmDays', 'Confirm Days & Show Exercises')}
        </button>
      </div>
    </div>
  );
};

export default DaySelectorFreestyle;
