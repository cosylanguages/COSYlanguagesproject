// Import necessary libraries, hooks, and components.
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import {
    fetchLessonSections,
    addLessonSection,
    updateLessonSection,
    deleteLessonSection
} from '../../api/api';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './LessonSectionManager.css';

/**
 * A component for managing lesson sections within a day in the teacher's dashboard.
 * It allows teachers to add, rename, delete, and select lesson sections.
 * @param {object} props - The component's props.
 * @param {string} props.dayId - The ID of the day to which the sections belong.
 * @param {function} props.onSectionSelect - A callback function to handle the selection of a section.
 * @param {string} props.selectedSectionId - The ID of the currently selected section.
 * @returns {JSX.Element} The LessonSectionManager component.
 */
const LessonSectionManager = ({ dayId, onSectionSelect, selectedSectionId }) => {
    const { authToken } = useAuth();
    const { t, language: currentUILanguage, allTranslations } = useI18n();
    // State for managing the list of sections, loading status, errors, and the new section title.
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    /**
     * Loads the list of lesson sections for the current day from the API.
     */
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

    // Load the lesson sections when the component mounts or the dayId changes.
    useEffect(() => {
        loadLessonSections();
    }, [loadLessonSections]);

    /**
     * Handles the addition of a new lesson section.
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionTitle.trim() || !authToken || !dayId) return;

        // Create a title object with the new title in the current UI language and English.
        const titleData = {
            [currentUILanguage]: newSectionTitle.trim(),
            'COSYenglish': newSectionTitle.trim()
        };
        // Add the new title for all other languages.
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

    /**
     * Handles the renaming of a lesson section.
     * @param {string} sectionId - The ID of the section to rename.
     * @param {object} currentTitleObj - The current title object of the section.
     */
    const handleStartRename = (section) => {
        setEditingSectionId(section.id);
        setEditingTitle(section.title?.[currentUILanguage] || section.title?.COSYenglish || '');
    };

    const handleCancelRename = () => {
        setEditingSectionId(null);
        setEditingTitle('');
    };

    const handleSaveRename = async (sectionId, currentTitleObj) => {
        if (!authToken || !dayId || !editingTitle.trim()) {
            handleCancelRename();
            return;
        }

        const updatedTitle = { ...currentTitleObj };
        const oldTitle = currentTitleObj?.[currentUILanguage] || currentTitleObj?.COSYenglish || '';
        updatedTitle[currentUILanguage] = editingTitle.trim();

        Object.keys(allTranslations || {}).forEach(langKey => {
            if (!updatedTitle[langKey] || updatedTitle[langKey] === oldTitle) {
                 updatedTitle[langKey] = editingTitle.trim();
            }
        });
        if (currentUILanguage === 'COSYenglish' || !updatedTitle.COSYenglish || updatedTitle.COSYenglish === oldTitle) {
            updatedTitle.COSYenglish = editingTitle.trim();
        }

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
            handleCancelRename();
        }
    };

    const handleOpenDeleteConfirm = (section) => {
        setSectionToDelete(section);
        setIsConfirmModalOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!authToken || !dayId || !sectionToDelete) return;

        setIsLoading(true);
        try {
            await deleteLessonSection(authToken, sectionToDelete.id);
            if (selectedSectionId === sectionToDelete.id) {
                onSectionSelect(null);
            }
            loadLessonSections();
        } catch (err) {
            setError(err.message || t('errorDeletingSection') || 'Failed to delete section.');
        } finally {
            setIsLoading(false);
            handleCloseDeleteConfirm();
        }
    };

    // If no day is selected, display a message.
    if (!dayId) {
        return <div className="lesson-section-manager"><p>{t('selectDayToViewSections') || 'Select a day to view its lesson sections.'}</p></div>;
    }
    // If the user is not authenticated, display a message.
    if (!authToken) {
        return <div className="lesson-section-manager"><p>{t('notAuthenticated') || 'Not authenticated.'}</p></div>;
    }

    // Render the main LessonSectionManager component.
    return (
        <div className="lesson-section-manager">
            <h4>{t('lessonSectionsTitle') || 'Lesson Sections'}</h4>
            {error && <p className="error-message">{error}</p>}

            {/* A form for adding a new lesson section. */}
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

            {/* Display loading or no sections messages. */}
            {isLoading && sections.length === 0 && <p>{t('loadingSections') || 'Loading sections...'}</p>}
            {!isLoading && sections.length === 0 && !error && (
                <p>{t('noSectionsYet') || 'No lesson sections created for this day yet. Add one above!'}</p>
            )}

            {/* The list of lesson sections. */}
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
                            {editingSectionId === section.id ? (
                                <div className="inline-edit-form" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveRename(section.id, section.title);
                                            if (e.key === 'Escape') handleCancelRename();
                                        }}
                                    />
                                    <Button size="small" variant="success" onClick={() => handleSaveRename(section.id, section.title)}>✓</Button>
                                    <Button size="small" variant="danger" onClick={handleCancelRename}>×</Button>
                                </div>
                            ) : (
                                <>
                                    <span className="section-title">
                                        {section.title?.[currentUILanguage] || section.title?.COSYenglish || section.title || `Section ID: ${section.id}`}
                                    </span>
                                    <div className="section-actions">
                                        <Button
                                            size="small"
                                            className="btn-rename"
                                            onClick={(e) => { e.stopPropagation(); handleStartRename(section); }}
                                            title={t('renameSectionTooltip') || "Rename section"}
                                            aria-label={t('renameSectionAria', { sectionTitle: section.title?.[currentUILanguage] || section.title?.COSYenglish }) || `Rename ${section.title?.[currentUILanguage] || section.title?.COSYenglish}`}
                                            disabled={isLoading}
                                        >✏️</Button>
                                        <Button
                                            size="small"
                                            className="btn-delete"
                                            onClick={(e) => { e.stopPropagation(); handleOpenDeleteConfirm(section); }}
                                            title={t('deleteSectionTooltip') || "Delete section"}
                                            aria-label={t('deleteSectionAria', { sectionTitle: section.title?.[currentUILanguage] || section.title?.COSYenglish }) || `Delete ${section.title?.[currentUILanguage] || section.title?.COSYenglish}`}
                                            disabled={isLoading}
                                        >🗑️</Button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {isConfirmModalOpen && (
                <Modal isOpen={isConfirmModalOpen} onClose={handleCloseDeleteConfirm}>
                    <h3>{t('confirmDeleteTitle', 'Confirm Deletion')}</h3>
                    <p>
                        {t('confirmDeleteSection', { sectionTitle: sectionToDelete?.title?.[currentUILanguage] || sectionToDelete?.title?.COSYenglish || '' })}
                    </p>
                    <div className="modal-actions">
                        <Button onClick={handleCloseDeleteConfirm} variant="secondary">
                            {t('cancelBtn', 'Cancel')}
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="danger" disabled={isLoading}>
                            {isLoading ? t('deletingBtn', 'Deleting...') : t('deleteBtn', 'Delete')}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LessonSectionManager;
