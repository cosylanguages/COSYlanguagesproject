// Defines API functions related to authentication (STATIC VERSION).

const STATIC_TEACHER_PIN = "1234"; // A simple PIN for static mode

/**
 * Logs in a teacher user with a PIN by checking against a static PIN.
 * @param {string} pin - The teacher's PIN.
 * @returns {Promise<object>} A promise that resolves to the auth data (token, userId, role).
 * @throws {Error} If login fails (e.g., incorrect PIN).
 */
export async function loginTeacher(pin) {
    console.log('Attempting static login with PIN:', pin);
    return new Promise((resolve, reject) => {
        // Simulate async operation
        setTimeout(() => {
            if (pin === STATIC_TEACHER_PIN) {
                console.log('Static login successful.');
                resolve({
                    token: 'static-mock-token', // Dummy token
                    userId: 'static-teacher-01',
                    role: 'teacher',
                    username: 'Mock Teacher'
                });
            } else {
                console.warn('Static login failed: Incorrect PIN.');
                reject(new Error('Incorrect PIN. Please try again.'));
            }
        }, 500); // Simulate network delay
    });
}

/**
 * Logs out a user (client-side only in static version).
 * @param {string} token - The authentication token (unused in static version).
 * @returns {Promise<object>} A promise that resolves to a logout confirmation.
 */
export async function logoutUser(token) {
    // In a static version, logout is primarily a client-side state clearing operation.
    // No server call is made. Token is unused.
    console.log('Static logout. Token (unused):', token);
    return Promise.resolve({ message: 'Logged out successfully (static).' });
}
