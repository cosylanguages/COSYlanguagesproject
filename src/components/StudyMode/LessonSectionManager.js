import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { 
    fetchLessonSections, 
    addLessonSection, 
    updateLessonSection,
    deleteLessonSection
} from '../../api/lessonSections';
import './LessonSectionManager.css';

const LessonSectionManager = ({ dayId, onSectionSelect, selectedSectionId }) => {
    const { authToken } = useAuth();
    const { t, language: currentUILanguage, allTranslations } = useI18n();
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const loadLessonSections = useCallback(async () => {
        if (!authToken || !dayId) {
            setSections([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const fetchedSections = await fetchLessonSections(authToken, dayId);
            setSections(fetchedSections || []);
        } catch (err) {
            setError(err.message || t('errorFetchingSections') || 'Failed to fetch lesson sections.');
            setSections([]);
        } finally {
            setIsLoading(false);
        }
    }, [authToken, dayId, t]);

    useEffect(() => {
        loadLessonSections();
    }, [loadLessonSections]);

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionTitle.trim() || !authToken || !dayId) return;

        const titleData = {
            [currentUILanguage]: newSectionTitle.trim(),
            'COSYenglish': newSectionTitle.trim()
        };
        Object.keys(allTranslations || {}).forEach(langKey => {
            if (!titleData[langKey]) {
                titleData[langKey] = newSectionTitle.trim();
            }
        });

        setIsLoading(true);
        try {
            await addLessonSection(authToken, dayId, { title: titleData, exerciseBlocks: [] });
            setNewSectionTitle('');
            loadLessonSections(); 
        } catch (err) {
            setError(err.message || t('errorAddingSection') || 'Failed to add lesson section.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRenameSection = async (sectionId, currentTitleObj) => {
        if (!authToken || !dayId) return;
        const currentTitleInUILang = currentTitleObj?.[currentUILanguage] || currentTitleObj?.COSYenglish || '';
        const newTitlePrompt = prompt(t('enterNewTitleForSection', { currentTitle: currentTitleInUILang }) || `Enter new title for section "${currentTitleInUILang}":`, currentTitleInUILang);

        if (newTitlePrompt && newTitlePrompt.trim() !== "") {
            const updatedTitle = { ...currentTitleObj };
            updatedTitle[currentUILanguage] = newTitlePrompt.trim();
            if (currentUILanguage === 'COSYenglish' || !updatedTitle.COSYenglish || updatedTitle.COSYenglish === currentTitleInUILang) {
                updatedTitle.COSYenglish = newTitlePrompt.trim();
            }
            Object.keys(allTranslations || {}).forEach(langKey => {
                if (!updatedTitle[langKey] || updatedTitle[langKey] === currentTitleInUILang) {
                     updatedTitle[langKey] = newTitlePrompt.trim();
                }
            });

            // Keep existing exerciseBlocks
            const sectionToUpdate = sections.find(sec => sec.id === sectionId);
            const exerciseBlocks = sectionToUpdate ? sectionToUpdate.exerciseBlocks : [];

            setIsLoading(true);
            try {
                await updateLessonSection(authToken, sectionId, { title: updatedTitle, exerciseBlocks });
                loadLessonSections();
            } catch (err) {
                setError(err.message || t('errorRenamingSection') || 'Failed to rename section.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteSection = async (sectionId, sectionTitleObj) => {
        if (!authToken || !dayId) return;
        const sectionTitleForConfirm = sectionTitleObj?.[currentUILanguage] || sectionTitleObj?.COSYenglish || `Section ID ${sectionId}`;
        if (window.confirm(t('confirmDeleteSection', { sectionTitle: sectionTitleForConfirm }) || `Are you sure you want to delete section "${sectionTitleForConfirm}" and all its content?`)) {
            setIsLoading(true);
            try {
                await deleteLessonSection(authToken, sectionId);
                if (selectedSectionId === sectionId) {
                    onSectionSelect(null); // Clear selection if active
                }
                loadLessonSections();
            } catch (err) {
                setError(err.message || t('errorDeletingSection') || 'Failed to delete section.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!dayId) {
        return <div className="lesson-section-manager"><p>{t('selectDayToViewSections') || 'Select a day to view its lesson sections.'}</p></div>;
    }
    if (!authToken) {
        return <div className="lesson-section-manager"><p>{t('notAuthenticated') || 'Not authenticated.'}</p></div>;
    }
    
    return (
        <div className="lesson-section-manager">
            <h4>{t('lessonSectionsTitle') || 'Lesson Sections'}</h4>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleAddSection} className="add-section-form">
                <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder={t('newSectionTitlePlaceholder') || "New section title..."}
                    disabled={isLoading}
                    aria-label={t('newSectionTitleAria') || "Enter title for new lesson section"}
                />
                <button type="submit" disabled={isLoading || !newSectionTitle.trim()}>
                    {isLoading && newSectionTitle ? (t('addingSection') || 'Adding...') : (t('addSectionBtn') || 'Add Section')}
                </button>
            </form>

            {isLoading && sections.length === 0 && <p>{t('loadingSections') || 'Loading sections...'}</p>}
            
            {!isLoading && sections.length === 0 && !error && (
                <p>{t('noSectionsYet') || 'No lesson sections created for this day yet. Add one above!'}</p>
            )}

            {sections.length > 0 && (
                <ul className="section-list">
                    {sections.map(section => (
                        <li 
                            key={section.id} 
                            className={`section-list-item ${selectedSectionId === section.id ? 'selected' : ''}`}
                            onClick={(e) => {
                                if (e.target.closest('.section-actions button')) return;
                                onSectionSelect(section.id);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                     if (e.target.closest('.section-actions button')) return;
                                    onSectionSelect(section.id);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-pressed={selectedSectionId === section.id}
                            aria-label={t('selectSectionAria', { sectionTitle: section.title?.[currentUILanguage] || section.title?.COSYenglish || `Section ID ${section.id}`}) || `Select section: ${section.title?.[currentUILanguage] || section.title?.COSYenglish || `Section ID ${section.id}`}`}
                        >
                            <span className="section-title">
                                {section.title?.[currentUILanguage] || section.title?.COSYenglish || section.title || `Section ID: ${section.id}`}
                            </span>
                             <div className="section-actions">
                                <button 
                                    className="btn-small btn-rename" 
                                    onClick={(e) => { e.stopPropagation(); handleRenameSection(section.id, section.title); }}
                                    title={t('renameSectionTooltip') || "Rename section"}
                                    aria-label={t('renameSectionAria', { sectionTitle: section.title?.[currentUILanguage] || section.title?.COSYenglish }) || `Rename ${section.title?.[currentUILanguage] || section.title?.COSYenglish}`}
                                    disabled={isLoading}
                                >✏️</button>
                                <button 
                                    className="btn-small btn-delete" 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id, section.title); }}
                                    title={t('deleteSectionTooltip') || "Delete section"}
                                    aria-label={t('deleteSectionAria', { sectionTitle: section.title?.[currentUILanguage] || section.title?.COSYenglish }) || `Delete ${section.title?.[currentUILanguage] || section.title?.COSYenglish}`}
                                    disabled={isLoading}
                                >🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LessonSectionManager;
