import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loginTeacher as apiLoginTeacher, logoutUser as apiLogoutUser } from './api/auth';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')));
    const [authError, setAuthError] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Effect to update sessionStorage when authToken or currentUser changes
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

    const login = useCallback(async (pin) => {
        setLoadingAuth(true);
        setAuthError(null);
        try {
            const data = await apiLoginTeacher(pin);
            setAuthToken(data.token);
            setCurrentUser({ id: data.userId, role: data.role, username: data.username }); // Assuming username might come from API
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

    const logout = useCallback(async () => {
        setLoadingAuth(true);
        setAuthError(null);
        if (authToken) {
            try {
                await apiLogoutUser(authToken);
            } catch (err) {
                // Log error but proceed with client-side logout anyway
                console.error("Error during API logout:", err);
                setAuthError(err.message || 'Failed to logout from server, logged out locally.');
            }
        }
        setAuthToken(null);
        setCurrentUser(null);
        sessionStorage.removeItem('authToken'); // Ensure removal
        sessionStorage.removeItem('currentUser');
        setLoadingAuth(false);
        // Optionally, redirect to login or home page via useNavigate if used here
    }, [authToken]);

    // Check token validity on initial load (optional, depends on backend token check endpoint)
    // For now, we rely on sessionStorage and assume token is valid if present.
    // A more robust solution would verify the token with the backend here.

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
