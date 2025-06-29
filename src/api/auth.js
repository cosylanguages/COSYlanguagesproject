// Defines API functions related to authentication.

const BASE_URL = 'http://localhost:3001/api'; // Matches the one in plan.js

/**
 * Logs in a teacher user with a PIN.
 * @param {string} pin - The teacher's PIN.
 * @returns {Promise<object>} A promise that resolves to the auth data (token, userId, role).
 * @throws {Error} If the network response is not ok or login fails.
 */
export async function loginTeacher(pin) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
    });

    const data = await res.json(); // Attempt to parse JSON regardless of res.ok for error messages

    if (!res.ok) {
        throw new Error(data.message || `Login failed. Status: ${res.status}`);
    }
    return data; // Expected: { token, userId, role }
}

/**
 * Logs out a user.
 * @param {string} token - The authentication token of the user.
 * @returns {Promise<object>} A promise that resolves to the logout confirmation.
 * @throws {Error} If the network response is not ok.
 */
export async function logoutUser(token) {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || `Logout failed. Status: ${res.status}`);
    }
    return data;
}
