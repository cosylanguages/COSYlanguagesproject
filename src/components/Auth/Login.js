import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Label from '../Common/Label';
import TransliterableText from '../Common/TransliterableText';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, loadingAuth, authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;
        if (isLogin) {
            success = await login(username, password);
        } else {
            success = await signup(username, password);
        }
        if (success) {
            navigate('/study');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><TransliterableText text={isLogin ? 'Login' : 'Sign Up'} /></h2>
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
                    {loadingAuth ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
                </Button>
                <Button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    disabled={loadingAuth}
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </Button>
            </form>
        </div>
    );
};

export default Login;
