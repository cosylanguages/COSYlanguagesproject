import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button'; // Import Button
import Label from '../Common/Label';   // Import Label
import TransliterableText from '../Common/TransliterableText';
import './Login.css';

const Login = () => {
    const [pin, setPin] = useState('');
    const { login, loadingAuth, authError } = useAuth();
    const { updateStreak, checkAndAwardAchievement } = useUserProfile();
    const navigate = useNavigate();

    useEffect(() => {
        checkAndAwardAchievement('firstLogin');
        updateStreak();
    }, [checkAndAwardAchievement, updateStreak]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.trim() === '1234') {
            const success = await login(pin);
            if (success) {
                navigate('/study');
            }
        } else {
            navigate('/freestyle');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text="Login" /></h2>
                <div className="form-group">
                    <Label htmlFor="pin"><TransliterableText text="PIN (optional):" /></Label>
                    <input
                        type="password"
                        id="pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        disabled={loadingAuth}
                        autoFocus
                    />
                </div>
                {authError && <p className="error-message"><TransliterableText text={authError} /></p>}
                <Button
                    type="submit"
                    className="login-button"
                    disabled={loadingAuth}
                    variant="primary" // Assuming login button should look like a primary action
                >
                    <TransliterableText text={loadingAuth ? 'Logging in...' : 'Login'} />
                </Button>
            </form>
        </div>
    );
};

export default Login;
