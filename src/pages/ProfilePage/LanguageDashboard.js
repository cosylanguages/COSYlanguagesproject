import React, { useState } from 'react';
import Select from 'react-select';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../../components/Common/Button';
import Label from '../../components/Common/Label';
import TransliterableText from '../../components/Common/TransliterableText';
import { useAuth } from '../../contexts/AuthContext';

const LanguageDashboard = () => {
    const { currentUser, refreshCurrentUser } = useAuth();
    const { allTranslations } = useI18n();
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const languageOptions = Object.keys(allTranslations)
        .map(langKey => ({ value: langKey, label: allTranslations[langKey]?.cosyName || langKey }))
        .filter(opt => opt.value !== 'null');

    const handleAddLanguage = () => {
        if (selectedLanguage && !currentUser.languages?.includes(selectedLanguage.value)) {
            const newLanguages = [...(currentUser.languages || []), selectedLanguage.value];
            refreshCurrentUser({ languages: newLanguages });
            setSelectedLanguage(null);
        }
    };

    const handleRemoveLanguage = (lang) => {
        const newLanguages = currentUser.languages?.filter(l => l !== lang);
        refreshCurrentUser({ languages: newLanguages });
    };

    return (
        <div className="language-dashboard">
            <h3><TransliterableText text="Manage Your Languages" /></h3>
            <div className="add-language">
                <Label htmlFor="add-language-select"><TransliterableText text="Add a new language:" /></Label>
                <Select
                    id="add-language-select"
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    options={languageOptions}
                />
                <Button onClick={handleAddLanguage}><TransliterableText text="Add Language" /></Button>
            </div>
            <div className="language-list">
                <h4><TransliterableText text="Your Languages:" /></h4>
                <ul>
                    {currentUser.languages?.map(lang => (
                        <li key={lang}>
                            <TransliterableText text={allTranslations[lang]?.cosyName || lang} />
                            <Button onClick={() => handleRemoveLanguage(lang)}><TransliterableText text="Remove" /></Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LanguageDashboard;
