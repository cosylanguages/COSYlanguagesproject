import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Select from 'react-select';
import { useI18n } from '../../i18n/I18nContext';

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>Sign Up</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loadingAuth}
                        autoFocus
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loadingAuth}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="language">Primary Language:</label>
                    <Select
                        id="language"
                        value={language}
                        onChange={setLanguage}
                        options={languageOptions}
                        isDisabled={loadingAuth}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="level">Proficiency Level:</label>
                    <Select
                        id="level"
                        value={level}
                        onChange={setLevel}
                        options={levelOptions}
                        isDisabled={loadingAuth}
                    />
                </div>
                {authError && <p style={{ color: 'red' }}>{authError}</p>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loadingAuth}
                >
                    {loadingAuth ? 'Signing up...' : 'Sign Up'}
                </Button>
                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            loginAsGuest();
                            navigate('/');
                        }}
                    >
                        Continue as Guest
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
