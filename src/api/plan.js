// Defines API functions related to fetching plan data.

const BASE_URL = 'http://localhost:3001/api'; // Define the base URL for the API

/**
 * Fetches the user's plan data from the backend.
 * @param {string} token - The authentication token for the user.
 * @returns {Promise<object>} A promise that resolves to the plan data.
 * @throws {Error} If the network response is not ok.
 */
export async function fetchPlan(token) {
    const res = await fetch(`${BASE_URL}/plan`, { // Use BASE_URL
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Good practice to include Content-Type
        }
    });
    if (!res.ok) {
        // Attempt to parse error message from backend if available
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch plan and error response is not valid JSON' }));
        throw new Error(errorData.message || `Failed to fetch plan. Status: ${res.status}`);
    }
    return await res.json();
}

// Future API functions related to plans can be added here.
// For example:
// export async function updatePlanSection(token, sectionId, sectionData) { ... }
