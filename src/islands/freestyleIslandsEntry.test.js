import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
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
    render(<BrowserRouter><I18nProvider><LanguageIslandWrapper /></I18nProvider></BrowserRouter>);
    expect(screen.getByText('🌎 Choose Your Language:')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toHaveValue('en');
    expect(screen.getByTestId('toggle-latinization')).toBeInTheDocument();
  });

  test('handles language change, calls changeLanguage context function, and dispatches event', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    render(<BrowserRouter><I18nProvider><LanguageIslandWrapper /></I18nProvider></BrowserRouter>);
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
    render(<BrowserRouter><I18nProvider><LanguageIslandWrapper /></I18nProvider></BrowserRouter>);
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

    render(<BrowserRouter><I18nProvider><LanguageIslandWrapper /></I18nProvider></BrowserRouter>);
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

// --- Tests for DaySelectorIslandApp ---

const mockDaySelectorFreestyleInner = jest.fn(); // This will be our tracker for assertions

jest.mock('../components/Freestyle/DaySelectorFreestyle', () => {
  // This is the factory that returns the mock component.
  console.log('JEST_MOCK_DEBUG: Defining mock for DaySelectorFreestyle');
  return function MockedDaySelectorFreestyle(props) {
    // This function is the actual mock component that gets rendered.
    mockDaySelectorFreestyleInner(props); // It calls our tracker function.
    return (
      <div data-testid="day-selector-freestyle-mock">
        <button data-testid="dsf-single-mode" onClick={() => props.onMenuSelect('day_single_input')}>Single</button>
        <button data-testid="dsf-range-mode" onClick={() => props.onMenuSelect('day_range_input')}>Range</button>
        <input data-testid="dsf-days-input" onChange={(e) => props.onDaysChange(e.target.value.split(',').map(Number))} />
        <button data-testid="dsf-confirm" onClick={() => props.onMenuSelect('day_confirm_action', { days: props.currentDays })}>Confirm</button>
        <span data-testid="dsf-active-path">{props.activePath.join('/')}</span>
        <span data-testid="dsf-current-days">{props.currentDays.join(',')}</span>
      </div>
    );
  };
});

import { DaySelectorIslandWrapper } from './freestyleIslandsEntry'; // This import should now get the mocked version

describe('DaySelectorIslandApp (via DaySelectorIslandWrapper)', () => {
  beforeEach(() => {
    // Reset and reconfigure mocks for each test
    // mockChangeLanguageFn is defined globally and cleared in LanguageIslandApp tests' beforeEach
    // mockTFn is defined globally and cleared in LanguageIslandApp tests' beforeEach
    // Ensure useI18n is set up for these tests too
    useI18n.mockImplementation(() => ({
      language: 'COSYenglish',
      changeLanguage: mockChangeLanguageFn, // Can reuse the global one if cleared properly
      t: mockTFn, // Can reuse the global one if cleared properly
      getTranslationsForLang: jest.fn((lang, namespace) => ({})),
    }));

    mockDaySelectorFreestyleInner.mockClear(); // Clear the tracker for DaySelectorFreestyle mock
    jest.spyOn(window, 'dispatchEvent').mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders DaySelectorFreestyle with initial props', () => {
    render(<BrowserRouter><I18nProvider><DaySelectorIslandWrapper language="COSYenglish" /></I18nProvider></BrowserRouter>);

    expect(screen.getByTestId('day-selector-freestyle-mock')).toBeInTheDocument();
    expect(mockDaySelectorFreestyleInner).toHaveBeenCalledTimes(1); // Use the inner tracker

    const initialProps = mockDaySelectorFreestyleInner.mock.calls[0][0]; // Use the inner tracker
    expect(initialProps.language).toBe('COSYenglish');
    expect(initialProps.currentDays).toEqual([]);
    expect(initialProps.activePath).toEqual(['day_selection_stage']); // Initial mode is 'choice'
    // Check if essential handlers are passed
    expect(typeof initialProps.onDaysChange).toBe('function');
    expect(typeof initialProps.onMenuSelect).toBe('function');
    expect(typeof initialProps.isMenuItemVisible).toBe('function');
    expect(initialProps.allMenuItemsConfig).toBeDefined();
  });

  test('switches to single day input mode', () => {
    render(<BrowserRouter><I18nProvider><DaySelectorIslandWrapper language="COSYenglish" /></I18nProvider></BrowserRouter>);
    fireEvent.click(screen.getByTestId('dsf-single-mode'));

    // mockDaySelectorFreestyleInner is called again on re-render
    expect(mockDaySelectorFreestyleInner).toHaveBeenCalledTimes(2);
    const newProps = mockDaySelectorFreestyleInner.mock.calls[1][0];
    expect(newProps.activePath).toEqual(['day_selection_stage', 'day_single_input']);
    expect(newProps.currentDays).toEqual([]); // Days should reset on mode change
  });

  test('switches to range day input mode', () => {
    render(<BrowserRouter><I18nProvider><DaySelectorIslandWrapper language="COSYenglish" /></I18nProvider></BrowserRouter>);
    fireEvent.click(screen.getByTestId('dsf-range-mode'));

    expect(mockDaySelectorFreestyleInner).toHaveBeenCalledTimes(2); // Use the inner tracker
    const newProps = mockDaySelectorFreestyleInner.mock.calls[1][0]; // Use the inner tracker
    expect(newProps.activePath).toEqual(['day_selection_stage', 'day_range_input']);
    expect(newProps.currentDays).toEqual([]);
  });

  test('updates currentDays on onDaysChange callback', () => {
    render(<BrowserRouter><I18nProvider><DaySelectorIslandWrapper language="COSYenglish" /></I18nProvider></BrowserRouter>);
    // First, switch to a mode, e.g., single day, to ensure DaySelectorFreestyle is interactive
    fireEvent.click(screen.getByTestId('dsf-single-mode'));

    // Simulate DaySelectorFreestyle calling onDaysChange
    // The mock input calls props.onDaysChange(e.target.value.split(',').map(Number))
    fireEvent.change(screen.getByTestId('dsf-days-input'), { target: { value: '5,6' } });

    expect(mockDaySelectorFreestyleInner).toHaveBeenCalledTimes(3); // Initial, mode switch, days change
    const newProps = mockDaySelectorFreestyleInner.mock.calls[2][0]; // Use the inner tracker
    expect(newProps.currentDays).toEqual([5, 6]);
  });

  test('dispatches dayIslandConfirm event on confirm action', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    render(<BrowserRouter><I18nProvider><DaySelectorIslandWrapper language="COSYenglish" /></I18nProvider></BrowserRouter>);

    // Set some days first
    fireEvent.click(screen.getByTestId('dsf-single-mode')); // Switch to single mode
    fireEvent.change(screen.getByTestId('dsf-days-input'), { target: { value: '10' } }); // Set day

    // Now confirm
    // The mock confirm button calls props.onMenuSelect('day_confirm_action', { days: props.currentDays })
    // props.currentDays should be [10] at this point
    fireEvent.click(screen.getByTestId('dsf-confirm'));

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    const dispatchedEvent = dispatchEventSpy.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe('dayIslandConfirm');
    expect(dispatchedEvent.detail).toEqual({ confirmedDays: [10] });
  });
});
