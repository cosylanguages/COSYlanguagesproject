const BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches all study sets for the authenticated user.
 * @param {string} token - The user's authentication token.
 * @param {string} [languageCode] - An optional language code to filter the study sets by.
 * @returns {Promise<Array>} A promise that resolves to an array of study set objects.
 */
export async function fetchStudySets(token, languageCode = null) {
    let url = `${BASE_URL}/studysets`;
    if (languageCode) {
        url += `?languageCode=${languageCode}`;
    }

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch study sets' }));
        throw new Error(errorData.message || `Failed to fetch study sets. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Fetches a single study set by its ID.
 * @param {string} token - The user's authentication token.
 * @param {string} setId - The ID of the study set to fetch.
 * @returns {Promise<object>} A promise that resolves to the study set object.
 */
export async function fetchStudySetById(token, setId) {
    const res = await fetch(`${BASE_URL}/studysets/${setId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Failed to fetch study set ${setId}` }));
        throw new Error(errorData.message || `Failed to fetch study set ${setId}. Status: ${res.status}`);
    }
    return await res.json();
}


/**
 * Adds a new study set.
 * @param {string} token - The user's authentication token.
 * @param {object} setData - The data for the new study set.
 * @returns {Promise<object>} A promise that resolves to the newly created study set object.
 */
export async function addStudySet(token, setData) {
    const res = await fetch(`${BASE_URL}/studysets`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(setData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to add study set' }));
        throw new Error(errorData.message || `Failed to add study set. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Updates a study set.
 * @param {string} token - The user's authentication token.
 * @param {string} setId - The ID of the study set to update.
 * @param {object} setData - The updated data for the study set.
 * @returns {Promise<object>} A promise that resolves to the updated study set object.
 */
export async function updateStudySet(token, setId, setData) {
    const res = await fetch(`${BASE_URL}/studysets/${setId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(setData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Failed to update study set ${setId}` }));
        throw new Error(errorData.message || `Failed to update study set ${setId}. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Deletes a study set.
 * @param {string} token - The user's authentication token.
 * @param {string} setId - The ID of the study set to delete.
 * @returns {Promise<void>} A promise that resolves when the study set is deleted.
 */
export async function deleteStudySet(token, setId) {
    const res = await fetch(`${BASE_URL}/studysets/${setId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok && res.status !== 204) {
        const errorData = await res.json().catch(() => ({ message: `Failed to delete study set ${setId}` }));
        throw new Error(errorData.message || `Failed to delete study set ${setId}. Status: ${res.status}`);
    }
    if (res.status !== 204) {
        return await res.json().catch(()=> null);
    }
}
