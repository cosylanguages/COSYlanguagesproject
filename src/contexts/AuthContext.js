import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, signup as apiSignup, getUserProfile } from '../api/api';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));
    const [isGuest, setIsGuest] = useState(sessionStorage.getItem('isGuest') === 'true');
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const item = sessionStorage.getItem('currentUser');
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error("Error parsing currentUser from sessionStorage:", error);
            sessionStorage.removeItem('currentUser');
            return null;
        }
    });
    const [authError, setAuthError] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {
        if (authToken) {
            sessionStorage.setItem('authToken', authToken);
            setIsGuest(false);
            sessionStorage.setItem('isGuest', 'false');
        } else {
            sessionStorage.removeItem('authToken');
        }
    }, [authToken]);

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        sessionStorage.setItem('isGuest', isGuest);
    }, [isGuest]);

    const loginAsGuest = useCallback(() => {
        setIsGuest(true);
        setCurrentUser({ username: 'Guest', role: 'guest' });
    }, []);

    const login = useCallback(async (username, password) => {
        setLoadingAuth(true);
        setAuthError(null);
        try {
            const data = await apiLogin(username, password);
            setAuthToken(data.token);
            const userProfile = await getUserProfile(data.token, data.userId);
            setCurrentUser(userProfile);
            return true;
        } catch (err) {
            console.error("Error during login:", err);
            setAuthError(err.response.data.message || 'Failed to login');
            setAuthToken(null);
            setCurrentUser(null);
            return false;
        } finally {
            setLoadingAuth(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoadingAuth(true);
        setAuthError(null);
        if (authToken) {
            try {
                await apiLogout();
            } catch (err) {
                console.error("Error during API logout:", err);
                setAuthError(err.response.data.message || 'Failed to logout from server, logged out locally.');
            }
        }
        setAuthToken(null);
        setCurrentUser(null);
        setIsGuest(false);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isGuest');
        setLoadingAuth(false);
    }, [authToken]);

    const signup = useCallback(async (username, password) => {
        setLoadingAuth(true);
        setAuthError(null);
        try {
            const data = await apiSignup(username, password);
            setAuthToken(data.token);
            const userProfile = await getUserProfile(data.token, data.userId);
            setCurrentUser(userProfile);
            return true;
        } catch (err) {
            console.error("Error during signup:", err);
            setAuthError(err.response.data.message || 'Failed to signup');
            setAuthToken(null);
            setCurrentUser(null);
            return false;
        } finally {
            setLoadingAuth(false);
        }
    }, []);

    const refreshCurrentUser = useCallback((newUserData) => {
        setCurrentUser(prevUser => ({ ...prevUser, ...newUserData }));
    }, []);

    const value = {
        authToken,
        currentUser,
        isAuthenticated: (!!authToken && !!currentUser) || isGuest,
        isGuest,
        authError,
        loadingAuth,
        login,
        logout,
        signup,
        loginAsGuest,
        refreshCurrentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
