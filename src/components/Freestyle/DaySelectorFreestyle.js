import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useFreestyle } from '../../contexts/FreestyleContext';
import './DaySelectorFreestyle.css';

const DaySelectorFreestyle = ({ language }) => {
  const { setSelectedDays } = useFreestyle();
  const [internalSingleDay, setInternalSingleDay] = useState('');
  const [internalDayFrom, setInternalDayFrom] = useState('');
  const [internalDayTo, setInternalDayTo] = useState('');
  const [thematicName, setThematicName] = useState('');
  const [selectionMode, setSelectionMode] = useState('single'); // 'single' or 'range'

  const { t, getTranslationsForLang } = useI18n();
  const MAX_DAYS = 30;
  const daysOptions = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  const showSingleDayInputSection = selectionMode === 'single';
  const showDayRangeInputSection = selectionMode === 'range';

  useEffect(() => {
    if (showSingleDayInputSection && internalSingleDay && language) {
      const langTranslations = getTranslationsForLang(language, 'dayNames');
      setThematicName(langTranslations[internalSingleDay] || '');
    } else {
      setThematicName('');
    }
  }, [internalSingleDay, language, showSingleDayInputSection, getTranslationsForLang]);

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
      setSelectedDays(daysToConfirm);
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
      return from > to;
    }
    return true;
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
            onChange={(e) => setInternalSingleDay(e.target.value)}
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
            <select id="freestyle-day-from" value={internalDayFrom} onChange={(e) => setInternalDayFrom(e.target.value)} className="day-select-dropdown">
              <option value="">{t('daySelector.selectStartDay', 'Start')}</option>
              {daysOptions.map((day) => (
                <option key={`from-${day}`} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="day-range-group">
            <label htmlFor="freestyle-day-to">{t('daySelector.to', 'To:')}</label>
            <select id="freestyle-day-to" value={internalDayTo} onChange={(e) => setInternalDayTo(e.target.value)} className="day-select-dropdown">
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
