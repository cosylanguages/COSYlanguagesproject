// Import necessary libraries, hooks, and components.
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { fetchDays, addDay, updateDay, deleteDay } from '../../api/api';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import './DayManager.css';

/**
 * A component for managing study days in the teacher's dashboard.
 * It allows teachers to add, rename, delete, and select study days.
 * @param {object} props - The component's props.
 * @param {function} props.onDaySelect - A callback function to handle the selection of a day.
 * @param {string} props.selectedDayId - The ID of the currently selected day.
 * @returns {JSX.Element} The DayManager component.
 */
const DayManager = ({ onDaySelect, selectedDayId }) => {
    const { authToken } = useAuth();
    const { t, language: currentUILanguage, allTranslations } = useI18n();
    // State for managing the list of days, loading status, errors, and the new day title.
    const [days, setDays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newDayTitle, setNewDayTitle] = useState('');
    const [editingDayId, setEditingDayId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [dayToDelete, setDayToDelete] = useState(null);

    /**
     * Loads the list of study days from the API.
     */
    const loadDays = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        setError(null);
        try {
            const fetchedDays = await fetchDays(authToken);
            setDays(fetchedDays || []);
        } catch (err) {
            setError(err.message || t('errorFetchingDays') || 'Failed to fetch days.');
            setDays([]);
        } finally {
            setIsLoading(false);
        }
    }, [authToken, t]);

    // Load the days when the component mounts or the authToken changes.
    useEffect(() => {
        loadDays();
    }, [loadDays]);

    /**
     * Handles the addition of a new day.
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleAddDay = async (e) => {
        e.preventDefault();
        if (!newDayTitle.trim() || !authToken) return;

        // Create a title object with the new title in the current UI language and English.
        const titleData = {
            [currentUILanguage]: newDayTitle.trim(),
            'COSYenglish': newDayTitle.trim()
        };
        // Add the new title for all other languages.
        Object.keys(allTranslations || {}).forEach(langKey => {
            if (!titleData[langKey]) {
                titleData[langKey] = newDayTitle.trim();
            }
        });

        setIsLoading(true);
        try {
            await addDay(authToken, { title: titleData });
            setNewDayTitle('');
            loadDays();
        } catch (err) {
            setError(err.message || t('errorAddingDay') || 'Failed to add day.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles the renaming of a day.
     * @param {string} dayId - The ID of the day to rename.
     * @param {object} currentTitleObj - The current title object of the day.
     */
    const handleStartRename = (day) => {
        setEditingDayId(day.id);
        setEditingTitle(day.title?.[currentUILanguage] || day.title?.COSYenglish || '');
    };

    const handleCancelRename = () => {
        setEditingDayId(null);
        setEditingTitle('');
    };

    const handleSaveRename = async (dayId, currentTitleObj) => {
        if (!authToken || !editingTitle.trim()) {
            handleCancelRename();
            return;
        }

        const updatedTitle = { ...currentTitleObj };
        const oldTitle = currentTitleObj?.[currentUILanguage] || currentTitleObj?.COSYenglish || '';
        updatedTitle[currentUILanguage] = editingTitle.trim();

        // Update other languages that had the same old title
        Object.keys(allTranslations || {}).forEach(langKey => {
            if (!updatedTitle[langKey] || updatedTitle[langKey] === oldTitle) {
                 updatedTitle[langKey] = editingTitle.trim();
            }
        });
        if (currentUILanguage === 'COSYenglish' || !updatedTitle.COSYenglish || updatedTitle.COSYenglish === oldTitle) {
            updatedTitle.COSYenglish = editingTitle.trim();
        }

        setIsLoading(true);
        try {
            await updateDay(authToken, dayId, { title: updatedTitle });
            loadDays();
        } catch (err) {
            setError(err.message || t('errorRenamingDay') || 'Failed to rename day.');
        } finally {
            setIsLoading(false);
            handleCancelRename();
        }
    };

    const handleOpenDeleteConfirm = (day) => {
        setDayToDelete(day);
        setIsConfirmModalOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setIsConfirmModalOpen(false);
        setDayToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!authToken || !dayToDelete) return;

        setIsLoading(true);
        try {
            await deleteDay(authToken, dayToDelete.id);
            if (selectedDayId === dayToDelete.id) {
                onDaySelect(null);
            }
            loadDays();
        } catch (err) {
            setError(err.message || t('errorDeletingDay') || 'Failed to delete day.');
        } finally {
            setIsLoading(false);
            handleCloseDeleteConfirm();
        }
    };

    // If the user is not authenticated, display a message.
    if (!authToken) {
        return <p>{t('notAuthenticated') || 'Not authenticated.'}</p>;
    }

    // Render the main DayManager component.
    return (
        <div className="day-manager">
            <h3>{t('manageStudyDays') || 'Manage Study Days'}</h3>
            {error && <p className="error-message">{error}</p>}

            {/* A form for adding a new day. */}
            <form onSubmit={handleAddDay} className="add-day-form">
                <input
                    type="text"
                    value={newDayTitle}
                    onChange={(e) => setNewDayTitle(e.target.value)}
                    placeholder={t('newDayTitlePlaceholder') || "New day title..."}
                    disabled={isLoading}
                    aria-label={t('newDayTitleAria') || "Enter title for new day"}
                />
                <Button
                    type="submit"
                    disabled={isLoading || !newDayTitle.trim()}
                >
                    {isLoading && newDayTitle ? (t('addingDay') || 'Adding...') : (t('addDayBtn') || 'Add Day')}
                </Button>
            </form>

            {/* Display loading or no days messages. */}
            {isLoading && days.length === 0 && <p>{t('loadingDays') || 'Loading days...'}</p>}
            {!isLoading && days.length === 0 && !error && (
                <p>{t('noDaysCreatedYet') || 'No study days created yet. Add one above!'}</p>
            )}

            {/* The list of study days. */}
            {days.length > 0 && (
                <ul className="day-list">
                    {days.map(day => (
                        <li
                            key={day.id}
                            className={`day-list-item ${selectedDayId === day.id ? 'selected' : ''}`}
                            onClick={(e) => {
                                if (e.target.closest('.day-actions button, .day-actions Button')) return;
                                onDaySelect(day.id);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    if (e.target.closest('.day-actions button, .day-actions Button')) return;
                                    onDaySelect(day.id);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-pressed={selectedDayId === day.id}
                            aria-label={t('selectDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish || `Day ID ${day.id}` }) || `Select day: ${day.title?.[currentUILanguage] || day.title?.COSYenglish || `Day ID: ${day.id}`}`}
                        >
                            {editingDayId === day.id ? (
                                <div className="inline-edit-form" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveRename(day.id, day.title);
                                            if (e.key === 'Escape') handleCancelRename();
                                        }}
                                    />
                                    <Button className="button--success button--sm" onClick={() => handleSaveRename(day.id, day.title)}>✓</Button>
                                    <Button className="button--danger button--sm" onClick={handleCancelRename}>×</Button>
                                </div>
                            ) : (
                                <>
                                    <span className="day-title">
                                        {day.title?.[currentUILanguage] || day.title?.COSYenglish || day.title || `Day ID: ${day.id}`}
                                    </span>
                                    <div className="day-actions">
                                        <Button
                                            className="button--secondary button--sm"
                                            onClick={(e) => { e.stopPropagation(); handleStartRename(day); }}
                                            title={t('renameDayTooltip') || "Rename day"}
                                            aria-label={t('renameDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish }) || `Rename ${day.title?.[currentUILanguage] || day.title?.COSYenglish}`}
                                            disabled={isLoading}
                                        >✏️</Button>
                                        <Button
                                            className="button--danger button--sm"
                                            onClick={(e) => { e.stopPropagation(); handleOpenDeleteConfirm(day); }}
                                            title={t('deleteDayTooltip') || "Delete day"}
                                            aria-label={t('deleteDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish }) || `Delete ${day.title?.[currentUILanguage] || day.title?.COSYenglish}`}
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
                        {t('confirmDeleteDay', { dayTitle: dayToDelete?.title?.[currentUILanguage] || dayToDelete?.title?.COSYenglish || '' })}
                    </p>
                    <div className="modal-actions">
                        <Button onClick={handleCloseDeleteConfirm} className="button--secondary">
                            {t('cancelBtn', 'Cancel')}
                        </Button>
                        <Button onClick={handleConfirmDelete} className="button--danger" disabled={isLoading}>
                            {isLoading ? t('deletingBtn', 'Deleting...') : t('deleteBtn', 'Delete')}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DayManager;
