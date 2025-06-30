import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import '../../pages/FreestyleModePage/FreestyleModePage.css';

const FreestyleInterfaceView = ({
  selectedLanguage,
  selectedDays,
  currentMainCategory,
  currentSubPractice,
  exerciseKey,
  onLanguageChange,
  onDaysChange,
  onCategorySelect,
  onSubPracticeSelect,
}) => {
  const { t, allTranslations, language: i18nLanguage } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Ajout du header et du sélecteur de langue inspirés de l'ancien HTML
  return (
    <div className="freestyle-mode-container">
      <div className="main-menu-box">
        <h1 className="freestyle-mode-header" data-transliterable>COSYlanguages - Freestyle Mode</h1>
        <div className="menu-section selector-container">
          <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">🌎 Choose Your Language:</label>
          <LanguageSelectorFreestyle
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
          <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
        </div>
        {/* Sélecteur de jours */}
        {selectedLanguage && (
          <div className="selector-container">
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange}
              language={selectedLanguage}
            />
          </div>
        )}
        {/* Navigation des catégories */}
        {selectedLanguage && selectedDays && selectedDays.length > 0 && (
          currentMainCategory ? (
            <>
              <div className="selector-container" style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => onCategorySelect(currentMainCategory)}
                  style={{
                    padding: '10px 15px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    width: '100%',
                    maxWidth: '380px'
                  }}
                >
                  {(allTranslations[i18nLanguage]?.mainCategory?.[currentMainCategory] ||
                    allTranslations.COSYenglish?.mainCategory?.[currentMainCategory] ||
                    currentMainCategory)}
                </button>
              </div>
              <div className="selector-container">
                <SubPracticeMenu
                  mainCategory={currentMainCategory}
                  activeSubPractice={currentSubPractice}
                  onSubPracticeSelect={onSubPracticeSelect}
                />
              </div>
            </>
          ) : (
            <div className="selector-container">
              <PracticeCategoryNav
                activeCategory={null}
                onCategorySelect={onCategorySelect}
              />
            </div>
          )
        )}
      </div>
      <div className="freestyle-mode-exercise-host">
        {selectedLanguage && selectedDays && selectedDays.length > 0 && currentMainCategory && currentSubPractice ? (
          <ExerciseHost
            subPracticeType={currentSubPractice}
            language={selectedLanguage}
            days={selectedDays.map(String)}
            exerciseKey={exerciseKey}
          />
        ) : (
          <p className="freestyle-mode-message">
            {!selectedLanguage ? t('selectLang', "Please select a language to begin.") :
             !(selectedDays && selectedDays.length > 0) ? t('selectDay', "Please select day(s).") :
             !currentMainCategory ? t('selectPractice', "Please select a practice category.") :
             currentMainCategory && !currentSubPractice ? t('selectSubPractice', "Please select a specific exercise.") :
             ""
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
