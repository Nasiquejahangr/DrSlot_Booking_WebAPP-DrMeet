import { API_BASE_URL, ENDPOINTS, getFullUrl } from '../config.js';

/**
 * User/Patient Login API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response data
 */
export const userLogin = async (email, password) => {
  const response = await fetch(getFullUrl(ENDPOINTS.PATIENT_LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to login';
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
      // ignore JSON parse error and keep fallback message
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * User/Patient Registration API
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response data
 */
export const userRegister = async (userData) => {
  const response = await fetch(getFullUrl(ENDPOINTS.PATIENT_REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  return await response.json();
};

/**
 * Get User/Patient Profile by Email
 * @param {string} email - User email
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (email) => {
  const response = await fetch(`${getFullUrl(ENDPOINTS.PATIENT_GET)}/${email}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
};

/**
 * Get All Users/Patients
 * @returns {Promise<Array>} - Array of user profiles
 */
export const getAllUsers = async () => {
  const response = await fetch(getFullUrl(ENDPOINTS.PATIENT_ALL));

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
};
