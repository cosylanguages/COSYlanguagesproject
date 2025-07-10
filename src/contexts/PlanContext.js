import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchRoadmapFromGitHub } from '../api/roadmapService';

export const PlanContext = createContext();

export function usePlan() {
    return useContext(PlanContext);
}

// Helper to map COSY language identifiers to roadmap file name keys
// This can be expanded or made more robust
const getRoadmapFileKey = (languageIdentifier) => {
  if (!languageIdentifier) return 'english'; // Default
  return languageIdentifier.replace('COSY', '').toLowerCase();
};

export function PlanProvider({ children }) {
    const [plan, setPlan] = useState({ days: [], studySets: [], roadmapDetails: null });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // fetchPlanData now accepts languageIdentifier
    // The 'token' argument is kept for potential future use (e.g., private repos) but not used for public fetching.
    const fetchPlanData = useCallback(async (languageIdentifier, token) => {
        if (!languageIdentifier) {
            console.warn("fetchPlanData called without languageIdentifier. Using default or doing nothing.");
            // Optionally set an error or a default state
            setPlan({ days: [], studySets: [], roadmapDetails: null });
            setError("No language selected for roadmap.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const fileKey = getRoadmapFileKey(languageIdentifier);
            const roadmapFileName = `${fileKey}_roadmap.json`;

            console.log(`PlanContext: Fetching roadmap for ${languageIdentifier} (file: ${roadmapFileName})`);
            const roadmapData = await fetchRoadmapFromGitHub(roadmapFileName);

            setPlan({
                days: [],
                studySets: [],
                roadmapDetails: roadmapData
            });

        } catch (err) {
            console.error(`Error fetching roadmap data in PlanContext for ${languageIdentifier}:`, err);
            setError(err.message || `Failed to fetch roadmap for ${languageIdentifier}`);
            setPlan({ days: [], studySets: [], roadmapDetails: null });
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array: fetchRoadmapFromGitHub and getRoadmapFileKey are stable.

    return (
        <PlanContext.Provider value={{ plan, fetchPlan: fetchPlanData, loading, error }}>
            {children}
        </PlanContext.Provider>
    );
}
