import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button'; // Import Button
import Label from '../Common/Label';   // Import Label
import TransliterableText from '../Common/TransliterableText';
import './Login.css';

const Login = () => {
    const [pin, setPin] = useState('');
    const { login, loadingAuth, authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pin.trim()) {
            alert('PIN cannot be empty.');
            return;
        }
        const success = await login(pin);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text="Teacher Login" /></h2>
                <div className="form-group">
                    <Label htmlFor="pin"><TransliterableText text="PIN:" /></Label>
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
