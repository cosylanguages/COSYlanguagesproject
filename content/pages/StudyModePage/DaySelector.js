import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import HelpModal from '../../components/Common/HelpModal';

const DaySelector = ({ role, days, selectedDayId, onDaySelect, isLoading, error }) => {
    const { t, currentLangKey } = useI18n();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const daySelectLabel = <TransliterableText text={t('studyModePage.selectDayLabel', 'Select Day:')} />;

    const renderSelector = () => {
        if (role === 'student') {
            if (days.length > 0) {
                return (
                    <select
                        id="smp-student-day-select"
                        value={selectedDayId || ""}
                        onChange={(e) => onDaySelect(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
                        {days.map(day => (
                            <option key={day.dayNumber} value={String(day.dayNumber)}>
                                {`Day ${day.dayNumber}: ${day.lessonName}`}
                            </option>
                        ))}
                    </select>
                );
            } else if (!isLoading && !error) {
                return <p>{t('studyModePage.noSyllabusDays', 'No syllabus days found for this language.')}</p>;
            }
        } else if (role === 'teacher') {
            if (days.length > 0) {
                return (
                    <select
                        id="smp-teacher-day-select"
                        value={selectedDayId || ""}
                        onChange={(e) => onDaySelect(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
                        {days.map(day => (
                            <option key={day.id} value={day.id}>
                                {day.title?.[currentLangKey] || day.title?.COSYenglish || `Day ID: ${day.id}`}
                            </option>
                        ))}
                    </select>
                );
            } else if (!isLoading && !error) {
                return <p>{t('studyModePage.noTeacherDays', 'No days configured by teacher yet.')}</p>;
            }
        }
        return null;
    };

    return (
        <div className="study-menu-section">
            <label htmlFor={role === 'student' ? "smp-student-day-select" : "smp-teacher-day-select"}>{daySelectLabel}</label>
            {renderSelector()}
            <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                title="daySelector.help.title"
                content="daySelector.help.content"
            />
        </div>
    );
};

export default DaySelector;
