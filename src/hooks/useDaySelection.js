import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useFreestyle } from '../contexts/FreestyleContext';

export const useDaySelection = (language) => {
  const { setSelectedDays } = useFreestyle();
  const [internalSingleDay, setInternalSingleDay] = useState('');
  const [internalDayFrom, setInternalDayFrom] = useState('');
  const [internalDayTo, setInternalDayTo] = useState('');
  const [thematicName, setThematicName] = useState('');
  const [selectionMode, setSelectionMode] = useState('single'); // 'single' or 'range'
  const { getTranslationsForLang } = useI18n();

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

  return {
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
  };
};
