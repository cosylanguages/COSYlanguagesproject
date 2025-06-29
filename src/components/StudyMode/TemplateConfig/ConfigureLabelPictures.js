import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureLabelPictures.css';

const ConfigureLabelPictures = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [mainImage, setMainImage] = useState(existingBlockData?.mainImage || '');
    const [imagePreview, setImagePreview] = useState(existingBlockData?.mainImage || '');
    const [hotspots, setHotspots] = useState(existingBlockData?.labels || []); // labels in old data, now hotspots
    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [editingHotspot, setEditingHotspot] = useState(null); // { index, x, y, texts: {'COSYenglish': 'Label 1'} }

    const imageRef = useRef(null);

    useEffect(() => {
        if (existingBlockData) {
            setMainImage(existingBlockData.mainImage || '');
            setImagePreview(existingBlockData.mainImage || '');
            setHotspots(existingBlockData.labels || []);
            setBlockTitle(existingBlockData.title || {});
        }
    }, [existingBlockData]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (event) => {
        setMainImage(event.target.value);
        setImagePreview(event.target.value);
    };

    const handleImageClick = (event) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        
        const newHotspotBase = { x, y, texts: {} };
        availableLanguages.forEach(lang => {
            newHotspotBase.texts[lang] = '';
        });
        
        setEditingHotspot({ index: hotspots.length, ...newHotspotBase });
    };

    const handleSaveHotspot = () => {
        if (!editingHotspot) return;
        const newHotspots = [...hotspots];
        if (editingHotspot.index === hotspots.length) { // New hotspot
            newHotspots.push({id: `hs_${Date.now()}`, ...editingHotspot });
        } else { // Editing existing
            newHotspots[editingHotspot.index] = {...newHotspots[editingHotspot.index], ...editingHotspot};
        }
        setHotspots(newHotspots);
        setEditingHotspot(null);
    };
    
    const handleEditHotspotLabel = (index) => {
        const hotspotToEdit = hotspots[index];
        setEditingHotspot({ index, ...hotspotToEdit });
    };

    const handleDeleteHotspot = (index) => {
        if (window.confirm(t('confirmDeleteHotspot') || 'Are you sure you want to delete this hotspot?')) {
            setHotspots(hotspots.filter((_, i) => i !== index));
        }
    };
    
    const handleHotspotTextChange = (lang, value) => {
        if (editingHotspot) {
            setEditingHotspot(prev => ({
                ...prev,
                texts: {
                    ...prev.texts,
                    [lang]: value
                }
            }));
        }
    };

    const handleTitleChange = (lang, value) => {
        setBlockTitle(prev => ({
            ...prev,
            [lang]: value
        }));
    };

    const handleSaveConfiguration = () => {
        if (!mainImage) {
            alert(t('alertMainImageRequired') || 'Please upload or link to a main image.');
            return;
        }
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block (at least in ${currentUILanguage} or English).`);
            return;
        }
        // Ensure all available languages have at least a fallback title
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Label the Pictures';
            }
        });


        onSave({
            id: existingBlockData?.id || `lp_${Date.now()}`,
            type: 'interactive/label-pictures',
            title: titleToSave,
            mainImage: mainImage,
            labels: hotspots, // Save hotspots as 'labels' to match old data structure if needed, or rename to 'hotspots'
        });
    };

    return (
        <div className="configure-label-pictures">
            <h4>{t('configureLabelPicturesTitle') || 'Configure Label the Pictures'}</h4>
            
            <div className="form-group">
                <label htmlFor="block-title-lp">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-lp"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'Enter block title'}
                />
            </div>

            <div className="form-group">
                <label htmlFor="lp-image-url">{t('mainImageUrlLabel') || 'Main Image URL'}:</label>
                <input type="url" id="lp-image-url" value={mainImage} onChange={handleImageUrlChange} placeholder="https://example.com/image.png" />
            </div>
            <div className="form-group">
                <label htmlFor="lp-image-upload">{t('orUploadMainImageLabel') || 'Or Upload Main Image'}:</label>
                <input type="file" id="lp-image-upload" accept="image/*" onChange={handleImageUpload} />
            </div>

            {imagePreview && (
                <div className="image-preview-container-lp" onClick={handleImageClick} style={{ cursor: 'crosshair' }}>
                    <img ref={imageRef} src={imagePreview} alt={t('imagePreviewAlt') || "Image Preview"} style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }} />
                    {hotspots.map((spot, index) => (
                        <div
                            key={spot.id || index}
                            className="hotspot-marker-config"
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            title={spot.texts?.[currentUILanguage] || spot.texts?.COSYenglish || `Hotspot ${index + 1}`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}
            {!imagePreview && <p>{t('clickToAddHotspotsPlaceholder') || 'Upload or link an image to add hotspots.'}</p>}


            {editingHotspot && (
                <div className="hotspot-editor-modal">
                    <h5>{editingHotspot.index === hotspots.length ? (t('addHotspotLabel') || 'Add Hotspot Label') : (t('editHotspotLabel') || 'Edit Hotspot Label')}</h5>
                    <p>X: {editingHotspot.x.toFixed(1)}%, Y: {editingHotspot.y.toFixed(1)}%</p>
                    {availableLanguages.map(lang => (
                        <div key={lang} className="form-group">
                            <label htmlFor={`hotspot-label-${lang}`}>{t('labelForLang', { langName: lang.replace('COSY', '') }) || `Label (${lang.replace('COSY', '')})`}:</label>
                            <input
                                type="text"
                                id={`hotspot-label-${lang}`}
                                value={editingHotspot.texts[lang] || ''}
                                onChange={(e) => handleHotspotTextChange(lang, e.target.value)}
                            />
                        </div>
                    ))}
                    <button onClick={handleSaveHotspot} className="btn btn-primary">{t('saveHotspotBtn') || 'Save Hotspot'}</button>
                    <button onClick={() => setEditingHotspot(null)} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
                </div>
            )}

            <h5>{t('currentHotspotsListTitle') || 'Current Hotspots'}:</h5>
            <ul className="hotspots-list">
                {hotspots.map((spot, index) => (
                    <li key={spot.id || index}>
                        <span>{index + 1}. {spot.texts?.[currentUILanguage] || spot.texts?.COSYenglish || (t('unlabeledHotspot') || 'Unlabeled')} (X: {spot.x.toFixed(1)}%, Y: {spot.y.toFixed(1)}%)</span>
                        <div>
                            <button onClick={() => handleEditHotspotLabel(index)} className="btn btn-sm btn-secondary">{t('editBtn') || 'Edit'}</button>
                            <button onClick={() => handleDeleteHotspot(index)} className="btn btn-sm btn-danger">{t('deleteBtn') || 'Delete'}</button>
                        </div>
                    </li>
                ))}
            </ul>
            {hotspots.length === 0 && <p>{t('noHotspotsYet') || 'No hotspots added yet. Click on the image to add one.'}</p>}
            
            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureLabelPictures;
