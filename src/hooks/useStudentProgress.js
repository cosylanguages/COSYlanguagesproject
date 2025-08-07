import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getStudentProgress } from '../api/api';

export const useStudentProgress = () => {
    const { currentUser, authToken } = useAuth();
    const { language } = useI18n();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProgress = useCallback(async () => {
        if (!currentUser || !language || !authToken) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getStudentProgress(language, currentUser.id, authToken);
            setProgress(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser, language, authToken]);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    return { progress, loading, error };
};
