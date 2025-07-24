const BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches all days for the authenticated user.
 * @param {string} token - The user's authentication token.
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
 * Adds a new day.
 * @param {string} token - The user's authentication token.
 * @param {object} dayData - The data for the new day.
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
 * Updates a day.
 * @param {string} token - The user's authentication token.
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
 * Deletes a day.
 * @param {string} token - The user's authentication token.
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
        if (res.status === 204) {
            return;
        }
        const errorData = await res.json().catch(() => ({ message: 'Failed to delete day' }));
        throw new Error(errorData.message || `Failed to delete day. Status: ${res.status}`);
    }
    if (res.status !== 204) {
        return await res.json().catch(()=> null);
    }
}
