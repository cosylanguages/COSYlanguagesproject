// Import necessary libraries and components.
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useDaySelection } from '../../hooks/useDaySelection';
import { useFreestyle } from '../../contexts/FreestyleContext';
import './DaySelectorFreestyle.css';

/**
 * A component that allows the user to select a single day or a range of days for freestyle practice.
 * @param {object} props - The component's props.
 * @param {string} props.language - The currently selected language.
 * @returns {JSX.Element} The DaySelectorFreestyle component.
 */
const DaySelectorFreestyle = ({ language }) => {
  const { selectedDays } = useFreestyle();
  const {
    internalSingleDay,
    setInternalSingleDay,
    internalDayFrom,
    setInternalDayFrom,
    internalDayTo,
    setInternalDayTo,
    thematicName,
    selectionMode,
    setSelectionMode,
    handleConfirmDays,
    isConfirmButtonDisabled,
    showSingleDayInputSection,
    showDayRangeInputSection,
  } = useDaySelection(language);

  const { t } = useI18n();
  const MAX_DAYS = 30;
  const daysOptions = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  // Render the day selector component.
  return (
    <div className="day-selector-card">
      <div className="day-selector-title">
        <span role="img" aria-label="calendar">🗓️</span>
        {t('titles.chooseYourDay', 'Choose Your Day(s)')}
      </div>

      {/* Radio buttons for selecting the mode (single day or day range). */}
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

      {/* The input section for selecting a single day. */}
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
              <option key={day} value={day} className={selectedDays.includes(day) ? 'selected' : ''}>
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

      {/* The input section for selecting a day range. */}
      {showDayRangeInputSection && (
        <div className="day-range-container">
          <div className="day-range-group">
            <label htmlFor="freestyle-day-from">{t('daySelector.from', 'From:')}</label>
            <select id="freestyle-day-from" value={internalDayFrom} onChange={(e) => setInternalDayFrom(e.target.value)} className="day-select-dropdown">
              <option value="">{t('daySelector.selectStartDay', 'Start')}</option>
              {daysOptions.map((day) => (
                <option key={`from-${day}`} value={day} className={selectedDays.includes(day) ? 'selected' : ''}>{day}</option>
              ))}
            </select>
          </div>
          <div className="day-range-group">
            <label htmlFor="freestyle-day-to">{t('daySelector.to', 'To:')}</label>
            <select id="freestyle-day-to" value={internalDayTo} onChange={(e) => setInternalDayTo(e.target.value)} className="day-select-dropdown">
              <option value="">{t('daySelector.selectEndDay', 'End')}</option>
              {daysOptions.map((day) => (
                <option key={`to-${day}`} value={day} className={selectedDays.includes(day) ? 'selected' : ''}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* The confirm button. */}
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
