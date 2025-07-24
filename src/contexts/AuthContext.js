import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loginTeacher as apiLoginTeacher, logoutUser as apiLogoutUser } from '../api/auth';

/**
 * The authentication context.
 */
export const AuthContext = createContext();

/**
 * A custom hook for accessing the authentication context.
 * @returns {object} The authentication context.
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 * A provider for the authentication context.
 * It manages the authentication state and provides functions for logging in and out.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));
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

    // Effect to update session storage when the auth token or current user changes.
    useEffect(() => {
        if (authToken) {
            sessionStorage.setItem('authToken', authToken);
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

    /**
     * Logs in a user.
     * @param {string} pin - The user's PIN.
     * @returns {Promise<boolean>} A promise that resolves to true if the login is successful, and false otherwise.
     */
    const login = useCallback(async (pin) => {
        setLoadingAuth(true);
        setAuthError(null);
        try {
            const data = await apiLoginTeacher(pin);
            setAuthToken(data.token);
            setCurrentUser({ id: data.userId, role: data.role, username: data.username });
            return true;
        } catch (err) {
            console.error("Error during login:", err);
            setAuthError(err.message || 'Failed to login');
            setAuthToken(null);
            setCurrentUser(null);
            return false;
        } finally {
            setLoadingAuth(false);
        }
    }, []);

    /**
     * Logs out a user.
     */
    const logout = useCallback(async () => {
        setLoadingAuth(true);
        setAuthError(null);
        if (authToken) {
            try {
                await apiLogoutUser(authToken);
            } catch (err) {
                console.error("Error during API logout:", err);
                setAuthError(err.message || 'Failed to logout from server, logged out locally.');
            }
        }
        setAuthToken(null);
        setCurrentUser(null);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        setLoadingAuth(false);
    }, [authToken]);

    const value = {
        authToken,
        currentUser,
        isAuthenticated: !!authToken && !!currentUser,
        authError,
        loadingAuth,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
