import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { fetchDays, addDay, updateDay, deleteDay } from '../../api/days';
import './DayManager.css'; 

const DayManager = ({ onDaySelect, selectedDayId }) => {
    const { authToken } = useAuth();
    const { t, language: currentUILanguage, allTranslations } = useI18n();
    const [days, setDays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newDayTitle, setNewDayTitle] = useState('');

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

    useEffect(() => {
        loadDays();
    }, [loadDays]);

    const handleAddDay = async (e) => {
        e.preventDefault();
        if (!newDayTitle.trim() || !authToken) return;

        const titleData = {
            [currentUILanguage]: newDayTitle.trim(),
            'COSYenglish': newDayTitle.trim() 
        };
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

    const handleRenameDay = async (dayId, currentTitleObj) => {
        if (!authToken) return;
        const currentTitleInUILang = currentTitleObj?.[currentUILanguage] || currentTitleObj?.COSYenglish || '';
        const newTitlePrompt = prompt(t('enterNewTitleForDay', { currentTitle: currentTitleInUILang }) || `Enter new title for "${currentTitleInUILang}":`, currentTitleInUILang);

        if (newTitlePrompt && newTitlePrompt.trim() !== "") {
            const updatedTitle = { ...currentTitleObj };
            updatedTitle[currentUILanguage] = newTitlePrompt.trim();
            // Ensure COSYenglish is also updated if it was the one displayed or if UI lang is COSYenglish
            if (currentUILanguage === 'COSYenglish' || !updatedTitle.COSYenglish || updatedTitle.COSYenglish === currentTitleInUILang) {
                updatedTitle.COSYenglish = newTitlePrompt.trim();
            }
            // Propagate to other languages if they were same as old default/UI lang title
             Object.keys(allTranslations || {}).forEach(langKey => {
                if (!updatedTitle[langKey] || updatedTitle[langKey] === currentTitleInUILang) {
                     updatedTitle[langKey] = newTitlePrompt.trim();
                }
            });


            setIsLoading(true);
            try {
                await updateDay(authToken, dayId, { title: updatedTitle });
                loadDays();
            } catch (err) {
                setError(err.message || t('errorRenamingDay') || 'Failed to rename day.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteDay = async (dayId, dayTitleObj) => {
        if (!authToken) return;
        const dayTitleForConfirm = dayTitleObj?.[currentUILanguage] || dayTitleObj?.COSYenglish || `Day ID ${dayId}`;
        if (window.confirm(t('confirmDeleteDay', { dayTitle: dayTitleForConfirm }) || `Are you sure you want to delete "${dayTitleForConfirm}"? This will also delete all its lesson sections and content.`)) {
            setIsLoading(true);
            try {
                await deleteDay(authToken, dayId);
                if (selectedDayId === dayId) {
                    onDaySelect(null); // Clear selection if the active day is deleted
                }
                loadDays();
            } catch (err) {
                setError(err.message || t('errorDeletingDay') || 'Failed to delete day.');
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    if (!authToken) {
        return <p>{t('notAuthenticated') || 'Not authenticated.'}</p>;
    }
    
    return (
        <div className="day-manager">
            <h3>{t('manageStudyDays') || 'Manage Study Days'}</h3>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleAddDay} className="add-day-form">
                <input
                    type="text"
                    value={newDayTitle}
                    onChange={(e) => setNewDayTitle(e.target.value)}
                    placeholder={t('newDayTitlePlaceholder') || "New day title..."}
                    disabled={isLoading}
                    aria-label={t('newDayTitleAria') || "Enter title for new day"}
                />
                <button type="submit" disabled={isLoading || !newDayTitle.trim()}>
                    {isLoading && newDayTitle ? (t('addingDay') || 'Adding...') : (t('addDayBtn') || 'Add Day')}
                </button>
            </form>

            {isLoading && days.length === 0 && <p>{t('loadingDays') || 'Loading days...'}</p>}
            
            {!isLoading && days.length === 0 && !error && (
                <p>{t('noDaysCreatedYet') || 'No study days created yet. Add one above!'}</p>
            )}

            {days.length > 0 && (
                <ul className="day-list">
                    {days.map(day => (
                        <li 
                            key={day.id} 
                            className={`day-list-item ${selectedDayId === day.id ? 'selected' : ''}`}
                            onClick={(e) => {
                                // Prevent click on day item if a button inside was clicked
                                if (e.target.closest('.day-actions button')) return;
                                onDaySelect(day.id);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    if (e.target.closest('.day-actions button')) return;
                                    onDaySelect(day.id);
                                }
                            }}
                            tabIndex={0} // Make li focusable
                            role="button"
                            aria-pressed={selectedDayId === day.id}
                            aria-label={t('selectDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish || `Day ID ${day.id}` }) || `Select day: ${day.title?.[currentUILanguage] || day.title?.COSYenglish || `Day ID ${day.id}`}`}
                        >
                            <span className="day-title">
                                {day.title?.[currentUILanguage] || day.title?.COSYenglish || day.title || `Day ID: ${day.id}`}
                            </span>
                            <div className="day-actions">
                                <button 
                                    className="btn-small btn-rename" 
                                    onClick={(e) => { e.stopPropagation(); handleRenameDay(day.id, day.title); }}
                                    title={t('renameDayTooltip') || "Rename day"}
                                    aria-label={t('renameDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish }) || `Rename ${day.title?.[currentUILanguage] || day.title?.COSYenglish}`}
                                    disabled={isLoading}
                                >✏️</button>
                                <button 
                                    className="btn-small btn-delete" 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteDay(day.id, day.title); }}
                                    title={t('deleteDayTooltip') || "Delete day"}
                                    aria-label={t('deleteDayAria', { dayTitle: day.title?.[currentUILanguage] || day.title?.COSYenglish }) || `Delete ${day.title?.[currentUILanguage] || day.title?.COSYenglish}`}
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

export default DayManager;
