import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchRoadmapFromGitHub } from '../api/roadmapService';

/**
 * The plan context.
 */
export const PlanContext = createContext();

/**
 * A custom hook for accessing the plan context.
 * @returns {object} The plan context.
 */
export function usePlan() {
    return useContext(PlanContext);
}

/**
 * A helper function to map a COSY language identifier to a roadmap file name key.
 * @param {string} languageIdentifier - The language identifier.
 * @returns {string} The roadmap file name key.
 */
const getRoadmapFileKey = (languageIdentifier) => {
  if (!languageIdentifier) return 'english';
  return languageIdentifier.replace('COSY', '').toLowerCase();
};

/**
 * A provider for the plan context.
 * It manages the study plan data, including the roadmap details.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The PlanProvider component.
 */
export function PlanProvider({ children }) {
    const [plan, setPlan] = useState({ days: [], studySets: [], roadmapDetails: null });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * Fetches the plan data for a given language.
     * @param {string} languageIdentifier - The language identifier.
     * @param {string} token - The user's authentication token.
     */
    const fetchPlanData = useCallback(async (languageIdentifier, token) => {
        if (!languageIdentifier) {
            console.warn("fetchPlanData called without languageIdentifier. Using default or doing nothing.");
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
    }, []);

    return (
        <PlanContext.Provider value={{ plan, fetchPlan: fetchPlanData, loading, error }}>
            {children}
        </PlanContext.Provider>
    );
}
