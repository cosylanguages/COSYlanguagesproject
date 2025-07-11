import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { LanguageIslandWrapper } from './freestyleIslandsEntry';
import { useI18n } from '../i18n/I18nContext';

document.body.innerHTML = `
  <div id="language-selector-island-container"></div>
  <div id="day-selector-island-container" style="display: none;"></div>
  <div id="freestyle-controls-placeholder-text"></div>
  <div id="exercise-host-container"></div>
`;

jest.mock('../components/Freestyle/LanguageSelectorFreestyle', () => ({ selectedLanguage, onLanguageChange }) => (
  <select data-testid="language-selector" value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
  </select>
));

jest.mock('../components/Common/ToggleLatinizationButton', () => () => <button data-testid="toggle-latinization">Toggle Latin</button>);

let mockChangeLanguageFn;
let mockTFn;

jest.mock('../i18n/I18nContext', () => {
  const originalModule = jest.requireActual('../i18n/I18nContext');
  return {
    ...originalModule,
    useI18n: jest.fn(() => ({
      language: 'en',
      changeLanguage: mockChangeLanguageFn,
      t: mockTFn,
      getTranslationsForLang: jest.fn(),
    })),
  };
});


describe('LanguageIslandApp (via LanguageIslandWrapper)', () => {
  beforeEach(() => {
    mockChangeLanguageFn = jest.fn();
    mockTFn = jest.fn((key, optionsOrFallback) => {
      if (typeof optionsOrFallback === 'string') {
        return optionsOrFallback;
      }
      return key;
    });

    useI18n.mockImplementation(() => ({
      language: 'en',
      changeLanguage: mockChangeLanguageFn,
      t: mockTFn,
      getTranslationsForLang: jest.fn((lang, namespace) => ({})),
    }));

    jest.spyOn(window, 'dispatchEvent').mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders correctly with initial language', () => {
    render(<LanguageIslandWrapper />);
    expect(screen.getByText('🌎 Choose Your Language:')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toHaveValue('en');
    expect(screen.getByTestId('toggle-latinization')).toBeInTheDocument();
  });

  test('handles language change, calls changeLanguage context function, and dispatches event', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    render(<LanguageIslandWrapper />);
    const languageSelector = screen.getByTestId('language-selector');
    fireEvent.change(languageSelector, { target: { value: 'es' } });

    expect(mockChangeLanguageFn).toHaveBeenCalledWith('es');
    expect(mockChangeLanguageFn).toHaveBeenCalledTimes(1);

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    const dispatchedEvent = dispatchEventSpy.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe('languageIslandChange');
    expect(dispatchedEvent.detail).toEqual({ selectedLanguage: 'es' });
  });

  test('does not dispatch event or call changeLanguage if language is the same', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    render(<LanguageIslandWrapper />);
    const languageSelector = screen.getByTestId('language-selector');
    fireEvent.change(languageSelector, { target: { value: 'en' } });

    expect(mockChangeLanguageFn).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  test('toast message logic is invoked correctly on language change', () => {
    const specificTMockForToastTest = jest.fn((key, optionsOrFallback, namedArgs) => {
      if (key === 'language.fr') return 'French';
      // If the key is for the toast, check how it's called by the component
      if (key === 'freestyle.languageChangedToast') {
        // The component calls: t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName })
        // So, optionsOrFallback will be the string with languageName already interpolated.
        // namedArgs will be { languageName: "French" }
        return optionsOrFallback; // Return the already interpolated string for toast display check
      }
      return optionsOrFallback || key;
    });

    useI18n.mockImplementation(() => ({
      language: 'en',
      changeLanguage: mockChangeLanguageFn,
      t: specificTMockForToastTest,
      getTranslationsForLang: jest.fn((lang, namespace) => ({})),
    }));

    render(<LanguageIslandWrapper />);
    const languageSelector = screen.getByTestId('language-selector');
    fireEvent.change(languageSelector, { target: { value: 'fr' } });

    // 1. Check call to get language name
    expect(specificTMockForToastTest).toHaveBeenCalledWith('language.fr', 'fr');

    // 2. Check call for the toast message template
    // The component constructs the string `Language changed: French` and passes it as the second argument.
    expect(specificTMockForToastTest).toHaveBeenCalledWith(
      'freestyle.languageChangedToast',
      'Language changed: French', // This is what the component passes as the second argument
      { languageName: 'French' }
    );

    // 3. Check if the toast text (which is the result of the second t call) is in the document
    expect(screen.getByText("Language changed: French")).toBeInTheDocument();
  });
});
