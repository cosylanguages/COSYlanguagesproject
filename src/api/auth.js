// A simple PIN for static mode.
const STATIC_TEACHER_PIN = "1234";

/**
 * Logs in a teacher user with a PIN.
 * @param {string} pin - The teacher's PIN.
 * @returns {Promise<object>} A promise that resolves to the auth data, or rejects with an error if the PIN is incorrect.
 */
export async function loginTeacher(pin) {
    console.log('Attempting static login with PIN:', pin);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pin === STATIC_TEACHER_PIN) {
                console.log('Static login successful.');
                resolve({
                    token: 'static-mock-token',
                    userId: 'static-teacher-01',
                    role: 'teacher',
                    username: 'Mock Teacher'
                });
            } else {
                console.warn('Static login failed: Incorrect PIN.');
                reject(new Error('Incorrect PIN. Please try again.'));
            }
        }, 500);
    });
}

/**
 * Logs out a user.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object>} A promise that resolves to a logout confirmation.
 */
export async function logoutUser(token) {
    console.log('Static logout. Token (unused):', token);
    return Promise.resolve({ message: 'Logged out successfully (static).' });
}
