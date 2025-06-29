// Defines API functions related to fetching plan data (STATIC VERSION).

/**
 * Fetches the user's plan data from a local mock JSON file.
 * @param {string} token - The authentication token (unused in static version).
 * @returns {Promise<object>} A promise that resolves to the plan data.
 * @throws {Error} If fetching or parsing the mock data fails.
 */
export async function fetchPlan(token) {
    // The token is no longer used to fetch, but kept for compatibility with PlanContext
    console.log('Fetching static plan data. Token (unused):', token); 
    try {
        // In a React app created with Create React App, files in `public`
        // are served at the root. So, `public/data/mockPlanData.json`
        // can be fetched from `/data/mockPlanData.json`.
        // For gh-pages, if `homepage` is `https://user.github.io/repo/`, 
        // then `%PUBLIC_URL%` becomes `/repo/`.
        // So the path should be `${process.env.PUBLIC_URL}/data/mockPlanData.json`
        const response = await fetch(`${process.env.PUBLIC_URL}/data/mockPlanData.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch static plan data. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching static plan data:', error);
        // Fallback to a very basic plan structure in case of error,
        // or rethrow the error if preferred.
        // This ensures the app doesn't completely break if the JSON is missing/malformed.
        // throw error; // Option to rethrow
        return {
            days: [{id: 'error_day', title: 'Error Loading Plan', sections: []}],
            studySets: [{id: 'error_set', name: 'Error Loading Sets', itemCount: 0}]
        };
    }
}

// Future API functions related to plans can be added here if they also use static data.
// For example:
// export async function updatePlanSection(sectionId, sectionData) { ... }
