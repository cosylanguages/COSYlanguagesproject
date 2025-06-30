import React, { useState } from 'react';
import { useAuth } from '../../AuthContext'; // Adjusted path
import { useNavigate } from 'react-router-dom';
import './Login.css'; // We'll create this for basic styling
import TransliterableText from '../Common/TransliterableText';

const Login = () => {
    const [pin, setPin] = useState('');
    const { login, loadingAuth, authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pin.trim()) {
            // setErrorState locally if preferred, or rely on authError from context
            alert('PIN cannot be empty.'); 
            return;
        }
        const success = await login(pin);
        if (success) {
            navigate('/'); // Redirect to home/dashboard after successful login
        }
        // authError from context will display API errors
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text="Teacher Login" /></h2>
                <div className="form-group">
                    <label htmlFor="pin"><TransliterableText text="PIN:" /></label>
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
                <button type="submit" className="login-button" disabled={loadingAuth}>
                    <TransliterableText text={loadingAuth ? 'Logging in...' : 'Login'} />
                </button>
            </form>
        </div>
    );
};

export default Login;
