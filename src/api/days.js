// API functions for managing Days

const BASE_URL = 'http://localhost:3001/api'; // Consistent with other API files

/**
 * Fetches all days for the authenticated user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array>} A promise that resolves to an array of day objects.
 */
export async function fetchDays(token) {
    const res = await fetch(`${BASE_URL}/days`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch days' }));
        throw new Error(errorData.message || `Failed to fetch days. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Adds a new day for the authenticated user.
 * @param {string} token - The authentication token.
 * @param {object} dayData - The data for the new day (e.g., { title: { COSYenglish: "New Day" } }).
 * @returns {Promise<object>} A promise that resolves to the newly created day object.
 */
export async function addDay(token, dayData) {
    const res = await fetch(`${BASE_URL}/days`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dayData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to add day' }));
        throw new Error(errorData.message || `Failed to add day. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Updates an existing day for the authenticated user.
 * @param {string} token - The authentication token.
 * @param {string} dayId - The ID of the day to update.
 * @param {object} dayData - The updated data for the day.
 * @returns {Promise<object>} A promise that resolves to the updated day object.
 */
export async function updateDay(token, dayId, dayData) {
    const res = await fetch(`${BASE_URL}/days/${dayId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dayData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update day' }));
        throw new Error(errorData.message || `Failed to update day. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Deletes a day for the authenticated user.
 * @param {string} token - The authentication token.
 * @param {string} dayId - The ID of the day to delete.
 * @returns {Promise<void>} A promise that resolves when the day is deleted.
 */
export async function deleteDay(token, dayId) {
    const res = await fetch(`${BASE_URL}/days/${dayId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        // DELETE might return 204 (No Content) on success, which is !res.ok if not handled.
        // However, the backend sends 404 if not found, and other errors for actual issues.
        // If res.status is 204, it's a success.
        if (res.status === 204) {
            return; // Successful deletion
        }
        const errorData = await res.json().catch(() => ({ message: 'Failed to delete day' }));
        throw new Error(errorData.message || `Failed to delete day. Status: ${res.status}`);
    }
    // For 204 No Content, res.json() would error, so we don't call it if res.ok or res.status === 204
    if (res.status !== 204) {
        return await res.json().catch(()=> null); // Catch if body is empty on other success codes
    }
}
