import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../Common/Button';

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>Login</h2>
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
                {authError && <p style={{ color: 'red' }}>{authError}</p>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loadingAuth}
                >
                    {loadingAuth ? 'Logging in...' : 'Login'}
                </Button>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/signup">Need an account? Sign Up</Link>
                </div>
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

export default Login;
