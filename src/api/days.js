import apiClient from './apiClient';

export async function fetchDays() {
    const res = await apiClient.get('/days');
    return res.data;
}

export async function addDay(dayData) {
    const res = await apiClient.post('/days', dayData);
    return res.data;
}

export async function updateDay(dayId, dayData) {
    const res = await apiClient.put(`/days/${dayId}`, dayData);
    return res.data;
}

export async function deleteDay(dayId) {
    const res = await apiClient.delete(`/days/${dayId}`);
    return res.data;
}
