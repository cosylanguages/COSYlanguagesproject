import apiClient from './apiClient';

export async function fetchLessonSections(dayId) {
    if (!dayId) {
        console.warn("fetchLessonSections: dayId is required.");
        return [];
    }
    const res = await apiClient.get(`/days/${dayId}/sections`);
    return res.data;
}

export async function addLessonSection(dayId, sectionData) {
    if (!dayId) {
        throw new Error("addLessonSection: dayId is required.");
    }
    const res = await apiClient.post(`/days/${dayId}/sections`, sectionData);
    return res.data;
}

export async function updateLessonSection(sectionId, sectionData) {
    const res = await apiClient.put(`/sections/${sectionId}`, sectionData);
    return res.data;
}

export async function deleteLessonSection(sectionId) {
    const res = await apiClient.delete(`/sections/${sectionId}`);
    return res.data;
}

export async function getLessonSectionDetails(sectionId) {
    if (!sectionId) {
        console.warn("getLessonSectionDetails: sectionId is required.");
        throw new Error("Section ID is required.");
    }
    const res = await apiClient.get(`/sections/${sectionId}`);
    return res.data;
}
