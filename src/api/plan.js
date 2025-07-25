/**
 * Fetches the user's plan data from a local mock JSON file.
 * @param {string} token - The user's authentication token (unused in this static version).
 * @returns {Promise<object>} A promise that resolves to the plan data, or a fallback object if an error occurs.
 */
export async function fetchPlan(token) {
    console.log('Fetching static plan data. Token (unused):', token);
    try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/mockPlanData.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch static plan data. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching static plan data:', error);
        return {
            days: [{id: 'error_day', title: 'Error Loading Plan', sections: []}],
            studySets: [{id: 'error_set', name: 'Error Loading Sets', itemCount: 0}]
        };
    }
}
