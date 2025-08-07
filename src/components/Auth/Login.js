import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../Common/Button';
import Label from '../Common/Label';
import TransliterableText from '../Common/TransliterableText';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginAsGuest, loadingAuth, authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/study');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text="Login" /></h2>
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
                {authError && <p className="error-message"><TransliterableText text={authError} /></p>}
                <Button
                    type="submit"
                    disabled={loadingAuth}
                >
                    {loadingAuth ? 'Logging in...' : 'Login'}
                </Button>
                <div className="signup-link">
                    <Link to="/signup"><TransliterableText text="Need an account? Sign Up" /></Link>
                </div>
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

export default Login;
