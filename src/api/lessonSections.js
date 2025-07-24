const BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches all lesson sections for a given day.
 * @param {string} token - The user's authentication token.
 * @param {string} dayId - The ID of the day.
 * @returns {Promise<Array>} A promise that resolves to an array of lesson section objects.
 */
export async function fetchLessonSections(token, dayId) {
    if (!dayId) {
        console.warn("fetchLessonSections: dayId is required.");
        return [];
    }
    const res = await fetch(`${BASE_URL}/days/${dayId}/sections`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Failed to fetch lesson sections for day ${dayId}` }));
        throw new Error(errorData.message || `Failed to fetch lesson sections. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Adds a new lesson section to a day.
 * @param {string} token - The user's authentication token.
 * @param {string} dayId - The ID of the day.
 * @param {object} sectionData - The data for the new section.
 * @returns {Promise<object>} A promise that resolves to the newly created lesson section object.
 */
export async function addLessonSection(token, dayId, sectionData) {
    if (!dayId) {
        throw new Error("addLessonSection: dayId is required.");
    }
    const res = await fetch(`${BASE_URL}/days/${dayId}/sections`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to add lesson section' }));
        throw new Error(errorData.message || `Failed to add lesson section. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Updates a lesson section.
 * @param {string} token - The user's authentication token.
 * @param {string} sectionId - The ID of the lesson section to update.
 * @param {object} sectionData - The updated data for the lesson section.
 * @returns {Promise<object>} A promise that resolves to the updated lesson section object.
 */
export async function updateLessonSection(token, sectionId, sectionData) {
    const res = await fetch(`${BASE_URL}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update lesson section' }));
        throw new Error(errorData.message || `Failed to update lesson section. Status: ${res.status}`);
    }
    return await res.json();
}

/**
 * Deletes a lesson section.
 * @param {string} token - The user's authentication token.
 * @param {string} sectionId - The ID of the lesson section to delete.
 * @returns {Promise<void>} A promise that resolves when the section is deleted.
 */
export async function deleteLessonSection(token, sectionId) {
    const res = await fetch(`${BASE_URL}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok && res.status !== 204) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to delete lesson section' }));
        throw new Error(errorData.message || `Failed to delete lesson section. Status: ${res.status}`);
    }
    if (res.status !== 204) {
        return await res.json().catch(()=> null);
    }
}

/**
 * Fetches the details of a single lesson section.
 * @param {string} token - The user's authentication token.
 * @param {string} sectionId - The ID of the lesson section.
 * @returns {Promise<object>} A promise that resolves to the lesson section object.
 */
export async function getLessonSectionDetails(token, sectionId) {
    if (!sectionId) {
        console.warn("getLessonSectionDetails: sectionId is required.");
        throw new Error("Section ID is required.");
    }
    const res = await fetch(`${BASE_URL}/sections/${sectionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Failed to fetch lesson section ${sectionId}` }));
        throw new Error(errorData.message || `Failed to fetch lesson section. Status: ${res.status}`);
    }
    return await res.json();
}
