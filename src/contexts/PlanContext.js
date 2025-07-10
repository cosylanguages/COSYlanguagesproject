import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchPlan as apiFetchPlan } from '../api/plan'; // Corrected import path

export const PlanContext = createContext();

export function usePlan() {
    return useContext(PlanContext);
}

export function PlanProvider({ children }) {
    const [plan, setPlan] = useState({ days: [], studySets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Renamed to avoid confusion if App.js still uses 'fetchPlan' prop name from an old state
    const fetchPlanData = useCallback(async (token) => {
        if (!token) {
            setPlan({ days: [], studySets: [] }); // Reset plan if no token
            setError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetchPlan(token); // Use the imported API function
            setPlan(data);
        } catch (err) {
            console.error("Error fetching plan in PlanContext:", err);
            setError(err.message || 'Failed to fetch plan');
            setPlan({ days: [], studySets: [] }); // Reset plan on error
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <PlanContext.Provider value={{ plan, fetchPlan: fetchPlanData, loading, error }}>
            {children}
        </PlanContext.Provider>
    );
}
