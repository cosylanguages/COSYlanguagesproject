import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureMatchPictures.css'; // We'll create this CSS file next

const ConfigureMatchPictures = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    
    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [pairs, setPairs] = useState(existingBlockData?.pairs || [{ id: `mp_${Date.now()}`, image: '', texts: {}, imagePreview: '' }]);

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            setPairs(existingBlockData.pairs || [{ id: `mp_${Date.now()}`, image: '', texts: {}, imagePreview: '' }]);
        }
    }, [existingBlockData]);

    const handleTitleChange = (lang, value) => {
        setBlockTitle(prev => ({ ...prev, [lang]: value }));
    };

    const handlePairChange = (index, field, value, lang = null) => {
        const newPairs = [...pairs];
        if (field === 'texts') {
            if (!newPairs[index].texts) newPairs[index].texts = {};
            newPairs[index].texts[lang] = value;
        } else {
            newPairs[index][field] = value;
        }
        setPairs(newPairs);
    };
    
    const handlePairImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPairs = [...pairs];
                newPairs[index].image = reader.result; // Store as base64 data URL
                newPairs[index].imagePreview = reader.result;
                // Optionally, clear URL if file is uploaded
                // newPairs[index].imageUrl = ''; 
                setPairs(newPairs);
            };
            reader.readAsDataURL(file);
        }
    };

    const addPair = () => {
        const newPairBase = { id: `mp_${Date.now()}`, image: '', texts: {}, imagePreview: '' };
        availableLanguages.forEach(lang => {
            newPairBase.texts[lang] = '';
        });
        setPairs([...pairs, newPairBase]);
    };

    const removePair = (index) => {
        if (pairs.length <= 1 && window.confirm(t('confirmRemoveLastPairMatchPictures') || 'This is the last pair. Removing it will result in an empty block. Are you sure?')) {
             setPairs(pairs.filter((_, i) => i !== index));
        } else if (pairs.length > 1) {
            setPairs(pairs.filter((_, i) => i !== index));
        }
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block (at least in ${currentUILanguage} or English).`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Match the Pictures';
            }
        });

        const validPairs = pairs.filter(p => p.image && Object.values(p.texts).some(text => text.trim() !== ''));
        if (validPairs.length === 0) {
            alert(t('alertMinOnePairMatchPictures') || 'Please configure at least one valid pair with an image and a label.');
            return;
        }
        
        // Ensure all languages have text for each pair, falling back if necessary
        const processedPairs = validPairs.map(p => {
            const newTexts = { ...p.texts };
            availableLanguages.forEach(lang => {
                if (!newTexts[lang] || newTexts[lang].trim() === '') {
                    newTexts[lang] = newTexts[currentUILanguage]?.trim() || newTexts.COSYenglish?.trim() || 'Label';
                }
            });
            return { ...p, texts: newTexts };
        });


        onSave({
            id: existingBlockData?.id || `mtp_${Date.now()}`,
            type: 'interactive/match-pictures',
            title: titleToSave,
            pairs: processedPairs,
        });
    };

    return (
        <div className="configure-match-pictures">
            <h4>{t('configureMatchPicturesTitle') || 'Configure Match the Pictures'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-mtp">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-mtp"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'Enter block title'}
                />
            </div>

            {pairs.map((pair, index) => (
                <div key={pair.id || index} className="match-picture-pair-config">
                    <h5>{t('pairNumberLabel', { number: index + 1}) || `Pair ${index + 1}`}</h5>
                    <div className="form-group">
                        <label htmlFor={`mp-image-url-${index}`}>{t('imageUrlLabel') || 'Image URL'}:</label>
                        <input
                            type="url"
                            id={`mp-image-url-${index}`}
                            value={pair.image && !pair.image.startsWith('data:') ? pair.image : ''}
                            onChange={(e) => {
                                handlePairChange(index, 'image', e.target.value);
                                handlePairChange(index, 'imagePreview', e.target.value);
                            }}
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`mp-image-upload-${index}`}>{t('orUploadImageLabel') || 'Or Upload Image'}:</label>
                        <input
                            type="file"
                            id={`mp-image-upload-${index}`}
                            accept="image/*"
                            onChange={(e) => handlePairImageUpload(index, e)}
                        />
                    </div>
                    {pair.imagePreview && (
                        <img src={pair.imagePreview} alt={t('imagePreviewAlt') || "Preview"} className="pair-image-preview" />
                    )}

                    {availableLanguages.map(lang => (
                         <div className="form-group" key={lang}>
                            <label htmlFor={`mp-text-${index}-${lang}`}>{t('textLabelForLang', { langName: lang.replace('COSY','') }) || `Text (${lang.replace('COSY','')})`}:</label>
                            <input
                                type="text"
                                id={`mp-text-${index}-${lang}`}
                                value={pair.texts[lang] || ''}
                                onChange={(e) => handlePairChange(index, 'texts', e.target.value, lang)}
                                placeholder={t('enterMatchingTextPlaceholder') || "Enter matching text"}
                            />
                        </div>
                    ))}
                    <button onClick={() => removePair(index)} className="btn btn-danger btn-sm remove-pair-btn">
                        {t('removePairBtn') || 'Remove Pair'}
                    </button>
                </div>
            ))}

            <button onClick={addPair} className="btn btn-secondary add-pair-btn">
                {t('addPairBtn') || 'Add Another Pair'}
            </button>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureMatchPictures;
