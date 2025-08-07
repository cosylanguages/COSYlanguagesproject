import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Label from '../Common/Label';
import TransliterableText from '../Common/TransliterableText';
import Select from 'react-select';
import { useI18n } from '../../i18n/I18nContext';
import './Login.css'; // Reusing login styles for now

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [language, setLanguage] = useState(null);
    const [level, setLevel] = useState(null);
    const { signup, loginAsGuest, loadingAuth, authError } = useAuth();
    const navigate = useNavigate();
    const { allTranslations } = useI18n();

    const languageOptions = Object.keys(allTranslations)
        .map(langKey => ({ value: langKey, label: allTranslations[langKey]?.cosyName || langKey }))
        .filter(opt => opt.value !== 'null');

    const levelOptions = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(username, password, { language: language?.value, level: level?.value });
        if (success) {
            navigate('/study');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text="Sign Up" /></h2>
                <div className="form-group">
                    <Label htmlFor="username"><TransliterableText text="Username:" /></Label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loadingAuth}
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <Label htmlFor="password"><TransliterableText text="Password:" /></Label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loadingAuth}
                    />
                </div>
                <div className="form-group">
                    <Label htmlFor="language"><TransliterableText text="Primary Language:" /></Label>
                    <Select
                        id="language"
                        value={language}
                        onChange={setLanguage}
                        options={languageOptions}
                        isDisabled={loadingAuth}
                    />
                </div>
                <div className="form-group">
                    <Label htmlFor="level"><TransliterableText text="Proficiency Level:" /></Label>
                    <Select
                        id="level"
                        value={level}
                        onChange={setLevel}
                        options={levelOptions}
                        isDisabled={loadingAuth}
                    />
                </div>
                {authError && <p className="error-message"><TransliterableText text={authError} /></p>}
                <Button
                    type="submit"
                    disabled={loadingAuth}
                >
                    {loadingAuth ? 'Signing up...' : 'Sign Up'}
                </Button>
                <div className="guest-login">
                    <Button
                        type="button"
                        onClick={() => {
                            loginAsGuest();
                            navigate('/');
                        }}
                    >
                        <TransliterableText text="Continue as Guest" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
