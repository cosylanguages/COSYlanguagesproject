import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SortColumnsBlock.css'; // To be created

// Helper function to shuffle an array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const SortColumnsBlock = ({ blockData, onAnswer }) => {
    const { t, language } = useI18n();
    const { title, columns = [] } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('sortIntoColumnsDefaultTitle') || 'Sort into Columns';

    // Prepare all items for the pool, remembering their correct column
    const allItemsForPool = useMemo(() => {
        let items = [];
        columns.forEach((col, colIndex) => {
            col.items.forEach(item => {
                items.push({
                    id: item.id,
                    text: item.texts?.[language] || item.texts?.['COSYenglish'] || `Item ${item.id}`,
                    correctColumnId: col.id,
                });
            });
        });
        return shuffleArray(items);
    }, [columns, language]);

    const [itemPool, setItemPool] = useState(allItemsForPool);
    // State for items placed in columns: { columnId: [item, item, ...], ... }
    const [placedItems, setPlacedItems] = useState(() => {
        const initial = {};
        columns.forEach(col => initial[col.id] = []);
        return initial;
    });
    const [draggedItem, setDraggedItem] = useState(null); // { id, text, correctColumnId, fromPool: boolean, fromColumnId: string|null }
    const [showResults, setShowResults] = useState(false);

    useEffect(() => { // Reset state if blockData changes
        const newAllItems = [];
        columns.forEach((col, colIndex) => {
            col.items.forEach(item => {
                newAllItems.push({
                    id: item.id,
                    text: item.texts?.[language] || item.texts?.['COSYenglish'] || `Item ${item.id}`,
                    correctColumnId: col.id,
                });
            });
        });
        setItemPool(shuffleArray(newAllItems));
        const initialPlaced = {};
        columns.forEach(col => initialPlaced[col.id] = []);
        setPlacedItems(initialPlaced);
        setShowResults(false);
        setDraggedItem(null);
    }, [blockData, language, columns]);


    const handleDragStart = (item, fromPool, fromColumnId = null) => {
        setDraggedItem({ ...item, fromPool, fromColumnId });
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDropOnColumn = (targetColumnId) => {
        if (!draggedItem) return;

        // Move item from pool to column
        if (draggedItem.fromPool) {
            setItemPool(prevPool => prevPool.filter(item => item.id !== draggedItem.id));
            setPlacedItems(prevPlaced => ({
                ...prevPlaced,
                [targetColumnId]: [...prevPlaced[targetColumnId], { id: draggedItem.id, text: draggedItem.text, correctColumnId: draggedItem.correctColumnId }]
            }));
        } 
        // Move item from one column to another
        else if (draggedItem.fromColumnId && draggedItem.fromColumnId !== targetColumnId) {
            setPlacedItems(prevPlaced => {
                const newPlaced = { ...prevPlaced };
                newPlaced[draggedItem.fromColumnId] = newPlaced[draggedItem.fromColumnId].filter(item => item.id !== draggedItem.id);
                newPlaced[targetColumnId] = [...newPlaced[targetColumnId], { id: draggedItem.id, text: draggedItem.text, correctColumnId: draggedItem.correctColumnId }];
                return newPlaced;
            });
        }
        setDraggedItem(null);
    };
    
    const handleDropOnPool = () => {
        if (!draggedItem || draggedItem.fromPool) return; // Only handle if item came from a column

        setPlacedItems(prevPlaced => ({
            ...prevPlaced,
            [draggedItem.fromColumnId]: prevPlaced[draggedItem.fromColumnId].filter(item => item.id !== draggedItem.id)
        }));
        setItemPool(prevPool => [...prevPool, { id: draggedItem.id, text: draggedItem.text, correctColumnId: draggedItem.correctColumnId }]);
        setDraggedItem(null);
    };


    const checkAllAnswers = () => {
        setShowResults(true);
        if (onAnswer) {
            let correctCount = 0;
            let totalItems = 0;
            const answerDetails = [];

            columns.forEach(col => {
                placedItems[col.id].forEach(item => {
                    totalItems++;
                    const isCorrect = item.correctColumnId === col.id;
                    if (isCorrect) correctCount++;
                    answerDetails.push({itemId: item.id, placedIn: col.id, correctColumn: item.correctColumnId, isCorrect});
                });
            });
            // Items left in pool are considered incorrect for their original column
            itemPool.forEach(item => {
                totalItems++;
                answerDetails.push({itemId: item.id, placedIn: 'pool', correctColumn: item.correctColumnId, isCorrect: false});
            });

            onAnswer({
                blockId: blockData.id,
                score: correctCount,
                total: totalItems || allItemsForPool.length, // Ensure total is not zero
                answers: answerDetails
            });
        }
    };
    
    const tryAgain = () => {
        // Effect hook handles resetting based on blockData change, or manually reset here
        const newAllItems = [];
        columns.forEach((col) => {
            col.items.forEach(item => {
                newAllItems.push({
                    id: item.id,
                    text: item.texts?.[language] || item.texts?.['COSYenglish'] || `Item ${item.id}`,
                    correctColumnId: col.id,
                });
            });
        });
        setItemPool(shuffleArray(newAllItems));
        const initialPlaced = {};
        columns.forEach(col => initialPlaced[col.id] = []);
        setPlacedItems(initialPlaced);
        setShowResults(false);
        setDraggedItem(null);
    };

    if (!columns || columns.length < 2) {
        return <div className="sort-columns-block"><p>{t('notEnoughColumnsConfigured') || 'This block is not configured correctly (needs at least 2 columns).'}</p></div>;
    }

    return (
        <div className="sort-columns-block">
            <h4>{blockTitle}</h4>
            <p>{t('sortColumnsInstructions') || 'Drag the items from the pool into the correct columns.'}</p>

            <div 
                className="item-pool" 
                onDragOver={handleDragOver} 
                onDrop={handleDropOnPool}
                aria-label={t('itemPoolAriaLabel') || "Available items to sort"}
            >
                <h5>{t('itemPoolTitle') || 'Item Pool'}</h5>
                {itemPool.map(item => (
                    <div
                        key={item.id}
                        className="draggable-item pool-item"
                        draggable={!showResults}
                        onDragStart={() => handleDragStart(item, true)}
                        aria-grabbed={draggedItem?.id === item.id}
                        tabIndex={showResults ? -1 : 0}
                    >
                        {item.text}
                    </div>
                ))}
                {itemPool.length === 0 && <p className="empty-pool-message">{t('poolEmptyAllItemsPlaced') || 'All items placed!'}</p>}
            </div>

            <div className="columns-area">
                {columns.map(col => (
                    <div
                        key={col.id}
                        className="sortable-column"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDropOnColumn(col.id)}
                        aria-label={t('columnAriaLabel', { title: col.titles?.[language] || col.titles?.['COSYenglish'] || `Column ${col.id}`}) || `Column: ${col.titles?.[language] || col.titles?.['COSYenglish'] || col.id }`}
                    >
                        <h5>{col.titles?.[language] || col.titles?.['COSYenglish'] || `Column ${col.id}`}</h5>
                        <div className="column-items-container">
                            {placedItems[col.id]?.map(item => (
                                <div
                                    key={item.id}
                                    className={`draggable-item placed-item ${showResults ? (item.correctColumnId === col.id ? 'correct' : 'incorrect') : ''}`}
                                    draggable={!showResults}
                                    onDragStart={() => handleDragStart(item, false, col.id)}
                                    aria-grabbed={draggedItem?.id === item.id}
                                    tabIndex={showResults ? -1 : 0}
                                >
                                    {item.text}
                                    {showResults && (item.correctColumnId === col.id ? ' ✅' : ' ❌')}
                                </div>
                            ))}
                            {placedItems[col.id]?.length === 0 && <div className="empty-column-placeholder">{t('dropItemsHere') || 'Drop items here'}</div>}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="sc-block-actions">
                {!showResults ? (
                    <button onClick={checkAllAnswers} className="btn btn-primary" disabled={itemPool.length > 0 && columns.some(col => placedItems[col.id]?.length === 0)}>
                        {t('checkAnswersBtn') || 'Check Answers'}
                    </button>
                ) : (
                    <button onClick={tryAgain} className="btn btn-secondary">{t('tryAgainBtn') || 'Try Again'}</button>
                )}
            </div>

            {showResults && (
                <div className="sc-results-summary">
                    <h5>{t('resultsSummaryTitle') || 'Results Summary:'}</h5>
                    {/* Can add a more detailed summary if needed */}
                    <p>
                        {t('scoreLabel') || 'Score'}: {columns.reduce((acc, col) => acc + placedItems[col.id].filter(item => item.correctColumnId === col.id).length, 0)} / {allItemsForPool.length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SortColumnsBlock;
