import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './DaySelectorFreestyle.css'; 

const DaySelectorFreestyle = ({ 
    currentDays, // from FreestyleModePage (reflects confirmed or temp days)
    onDaysChange, // wrapper from FreestyleModePage to update temp days
    language,
    // New props from menu logic system
    activePath,
    onMenuSelect,
    isMenuItemVisible,
    allMenuItemsConfig 
}) => {
  // Internal state for managing the input values before confirmation
  const [internalSingleDay, setInternalSingleDay] = useState('');
  const [internalDayFrom, setInternalDayFrom] = useState('');
  const [internalDayTo, setInternalDayTo] = useState('');
  const [thematicName, setThematicName] = useState('');

  const { t, getTranslationsForLang } = useI18n();
  const MAX_DAYS = 30; 
  const daysOptions = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  // Determine visibility of input sections based on activePath
  const showSingleDayInputSection = isMenuItemVisible(activePath, 'day_single_input', allMenuItemsConfig);
  const showDayRangeInputSection = isMenuItemVisible(activePath, 'day_range_input', allMenuItemsConfig);
  
  // Show mode choice buttons if day_selection_stage is active but no specific input mode is.
  const showModeChoiceButtons = activePath.length > 0 && activePath[activePath.length - 1] === 'day_selection_stage';


  // Sync internal state if currentDays prop changes (e.g., due to external reset or initial load)
  useEffect(() => {
    if (currentDays && currentDays.length > 0) {
      if (showSingleDayInputSection && currentDays.length === 1) {
        setInternalSingleDay(String(currentDays[0]));
      } else if (showDayRangeInputSection && currentDays.length > 0) { // Can be more than 1 for range
        setInternalDayFrom(String(currentDays[0]));
        setInternalDayTo(String(currentDays[currentDays.length - 1]));
      }
    } else {
      setInternalSingleDay('');
      setInternalDayFrom('');
      setInternalDayTo('');
    }
  }, [currentDays, showSingleDayInputSection, showDayRangeInputSection]);
  
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
      onDaysChange(daysToConfirm); // Ensure parent has the final confirmed days
      onMenuSelect('day_confirm_action', { days: daysToConfirm });
    } else {
      // Maybe show a small validation message if trying to confirm empty/invalid days
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
        <span role="img" aria-label="calendar">📅</span>
        {t('titles.chooseYourDay', 'Choose Your Day(s)')}
      </div>

      {showModeChoiceButtons && (
        <div className="mode-choice-buttons">
          <button onClick={() => onMenuSelect('day_single_input')} className="btn btn-outline">
            {t('daySelector.selectSingleDayMode', 'Select Single Day')}
          </button>
          <button onClick={() => onMenuSelect('day_range_input')} className="btn btn-outline">
            {t('daySelector.selectDayRangeMode', 'Select Day Range')}
          </button>
        </div>
      )}

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

      {/* Confirm Button - visible when either input mode is active */}
      {(showSingleDayInputSection || showDayRangeInputSection) && (
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            onClick={handleConfirmDays} 
            disabled={isConfirmButtonDisabled()}
            className="btn btn-primary"
          >
            {t('buttons.confirmDays', 'Confirm Days & Show Exercises')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DaySelectorFreestyle;
