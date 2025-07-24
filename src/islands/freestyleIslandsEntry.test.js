import React from 'react';
import { render, screen, fireEvent } from '../../testUtils';
import '@testing-library/jest-dom';
import { LanguageIslandWrapper, DaySelectorIslandWrapper } from './freestyleIslandsEntry';
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

jest.mock('../i18n/I18nContext');

describe('LanguageIslandApp (via LanguageIslandWrapper)', () => {
  beforeEach(() => {
    useI18n.mockReturnValue({
      language: 'en',
      changeLanguage: jest.fn(),
      t: jest.fn((key, fallback) => fallback || key),
      getTranslationsForLang: jest.fn(() => ({})),
    });
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
});

const mockDaySelectorFreestyleInner = jest.fn();

jest.mock('../components/Freestyle/DaySelectorFreestyle', () => {
  return function MockedDaySelectorFreestyle(props) {
    mockDaySelectorFreestyleInner(props);
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

describe('DaySelectorIslandApp (via DaySelectorIslandWrapper)', () => {
  beforeEach(() => {
    useI18n.mockReturnValue({
      language: 'COSYenglish',
      t: jest.fn((key, fallback) => fallback || key),
    });
    mockDaySelectorFreestyleInner.mockClear();
    jest.spyOn(window, 'dispatchEvent').mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders DaySelectorFreestyle with initial props', () => {
    render(<DaySelectorIslandWrapper language="COSYenglish" />);
    expect(screen.getByTestId('day-selector-freestyle-mock')).toBeInTheDocument();
    expect(mockDaySelectorFreestyleInner).toHaveBeenCalledTimes(1);
    const initialProps = mockDaySelectorFreestyleInner.mock.calls[0][0];
    expect(initialProps.language).toBe('COSYenglish');
    expect(initialProps.currentDays).toEqual([]);
    expect(initialProps.activePath).toEqual(['day_selection_stage']);
  });
});
