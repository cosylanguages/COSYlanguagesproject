import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { useAuth } from '../../../AuthContext';
import { fetchStudySets } from '../../../api/studySets'; // Assuming this API function exists or will be created
import './StudySetList.css'; // To be created

const STUDENT_PERSONAL_SETS_STORAGE_KEY = 'cosyStudySets_student_personal_cards';
const SORT_PREFERENCE_KEY = 'cosyStudySetSortPreference_student';

const StudySetList = ({ onSelectSetToStudy, onSelectSetToReviewAll }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { authToken, currentUser } = useAuth();

    const [teacherSets, setTeacherSets] = useState([]);
    const [studentSets, setStudentSets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortPreference, setSortPreference] = useState(localStorage.getItem(SORT_PREFERENCE_KEY) || 'name_asc');

    useEffect(() => {
        const loadSets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch teacher sets if user is authenticated (could be student or teacher viewing)
                if (authToken) {
                    // Assuming fetchStudySets can optionally take a language filter,
                    // or fetches all and we filter client-side. For now, let's assume it fetches relevant sets.
                    // The old mock service filtered by languageCode on the backend.
                    // The new backend's GET /api/studysets gets all for the user.
                    // We might need to adjust API or filter here if language specific sets are desired.
                    const setsFromServer = await fetchStudySets(authToken, currentUILanguage); // Pass current UI language
                    setTeacherSets(setsFromServer.map(s => ({ ...s, source: 'teacher' })));
                } else {
                    setTeacherSets([]); // No auth, no teacher sets
                }

                // Load student sets from localStorage
                const studentStoredData = localStorage.getItem(STUDENT_PERSONAL_SETS_STORAGE_KEY);
                if (studentStoredData) {
                    const personalCards = JSON.parse(studentStoredData);
                    if (personalCards.length > 0) {
                        setStudentSets([{ 
                            id: 'student_personal_cards', 
                            name: t('myPersonalFlashcardsSetTitle') || 'My Personal Flashcards', 
                            items: personalCards, 
                            itemCount: personalCards.length,
                            languageCode: currentUILanguage, // Assume personal sets are for current UI lang
                            source: 'student'
                        }]);
                    } else {
                        setStudentSets([]);
                    }
                } else {
                    setStudentSets([]);
                }

            } catch (err) {
                console.error("Error loading study sets:", err);
                setError(err.message || t('errorLoadingStudySets') || 'Failed to load study sets.');
                setTeacherSets([]);
                setStudentSets([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadSets();
    }, [authToken, currentUILanguage, t]); // Reload if auth or language changes

    const handleSortChange = (e) => {
        const newSortPref = e.target.value;
        setSortPreference(newSortPref);
        localStorage.setItem(SORT_PREFERENCE_KEY, newSortPref);
    };

    const filteredAndSortedSets = useMemo(() => {
        let combinedSets = [...teacherSets, ...studentSets];
        
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            combinedSets = combinedSets.filter(set => 
                (set.name && set.name.toLowerCase().includes(lowerSearchTerm)) ||
                (set.id && set.id.toLowerCase().includes(lowerSearchTerm)) ||
                (set.description && set.description.toLowerCase().includes(lowerSearchTerm)) ||
                (set.items && set.items.some(item => 
                    (item.term1 && item.term1.toLowerCase().includes(lowerSearchTerm)) ||
                    (item.term2 && item.term2.toLowerCase().includes(lowerSearchTerm))
                ))
            );
        }

        // Sorting logic
        const [sortKey, sortOrder] = sortPreference.split('_');
        combinedSets.sort((a, b) => {
            let valA, valB;
            if (sortKey === 'name') {
                valA = (a.name || a.id || '').toLowerCase();
                valB = (b.name || b.id || '').toLowerCase();
            } else if (sortKey === 'items') {
                valA = a.itemCount !== undefined ? a.itemCount : (a.items?.length || 0);
                valB = b.itemCount !== undefined ? b.itemCount : (b.items?.length || 0);
            } else { // Default to name sort
                valA = (a.name || a.id || '').toLowerCase();
                valB = (b.name || b.id || '').toLowerCase();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return combinedSets;
    }, [teacherSets, studentSets, searchTerm, sortPreference]);


    if (isLoading) {
        return <p>{t('loadingStudySets') || 'Loading study sets...'}</p>;
    }
    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="study-set-list-container">
            <h3>{t('availableStudySetsTitle') || 'Available Study Sets'}</h3>
            <div className="study-set-controls">
                <input 
                    type="text" 
                    placeholder={t('searchStudySetsPlaceholder') || 'Search sets...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select value={sortPreference} onChange={handleSortChange} className="sort-select">
                    <option value="name_asc">{t('sortByNameAsc') || 'Name (A-Z)'}</option>
                    <option value="name_desc">{t('sortByNameDesc') || 'Name (Z-A)'}</option>
                    <option value="items_asc">{t('sortByItemsAsc') || 'Items (Fewest First)'}</option>
                    <option value="items_desc">{t('sortByItemsDesc') || 'Items (Most First)'}</option>
                </select>
            </div>

            {filteredAndSortedSets.length === 0 ? (
                <p>{t('noStudySetsAvailable') || 'No study sets available currently.'}</p>
            ) : (
                <ul className="study-set-ul">
                    {filteredAndSortedSets.map(set => (
                        <li key={set.id} className={`study-set-item-li ${set.source === 'student' ? 'student-set' : 'teacher-set'}`}>
                            <div className="set-info">
                                <span className="set-name">{set.name || `Set ${set.id}`}</span>
                                <span className="set-item-count">
                                    ({set.itemCount !== undefined ? set.itemCount : (set.items?.length || 0)} {t('itemsCountSuffix') || 'items'})
                                </span>
                                {set.languageCode && <span className="set-language">({set.languageCode.replace('COSY', '')})</span>}
                                {set.source === 'student' && <span className="set-source-badge student">{t('mySetBadge') || 'My Set'}</span>}
                            </div>
                            <div className="set-actions">
                                <button 
                                    onClick={() => onSelectSetToStudy(set)} 
                                    className="btn btn-primary btn-sm"
                                    disabled={(set.itemCount !== undefined ? set.itemCount : (set.items?.length || 0)) === 0}
                                >
                                    {t('studySetBtn') || 'Study'}
                                </button>
                                <button 
                                    onClick={() => onSelectSetToReviewAll(set)} 
                                    className="btn btn-secondary btn-sm"
                                    disabled={(set.itemCount !== undefined ? set.itemCount : (set.items?.length || 0)) === 0}
                                >
                                    {t('reviewAllBtn') || 'Review All'}
                                </button>
                                {/* Add Edit/Delete for student sets later if needed */}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudySetList;
