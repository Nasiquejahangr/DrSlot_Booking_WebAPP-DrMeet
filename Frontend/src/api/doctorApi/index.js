import { API_BASE_URL, ENDPOINTS, getFullUrl } from '../config.js';

/**
 * Doctor Login API
 * @param {string} email - Doctor email
 * @param {string} password - Doctor password
 * @returns {Promise<Object>} - Response data with doctor info
 */
export const doctorLogin = async (email, password) => {
  const response = await fetch(getFullUrl(ENDPOINTS.DOCTOR_LOGIN), {
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
 * Doctor Registration API
 * @param {Object} doctorData - Doctor registration data
 * @returns {Promise<Object>} - Response data
 */
export const doctorRegister = async (doctorData) => {
  const response = await fetch(getFullUrl(ENDPOINTS.DOCTOR_REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  return await response.json();
};

/**
 * Get Doctor Profile by Email
 * @param {string} email - Doctor email
 * @returns {Promise<Object>} - Doctor profile data
 */
export const getDoctorProfile = async (email) => {
  const response = await fetch(`${getFullUrl(ENDPOINTS.DOCTOR_GET)}/${email}`);

  if (!response.ok) {
    throw new Error('Failed to fetch doctor profile');
  }

  return await response.json();
};

/**
 * Get All Doctors
 * @returns {Promise<Array>} - Array of doctor profiles
 */
export const getAllDoctors = async () => {
  const response = await fetch(getFullUrl(ENDPOINTS.DOCTOR_ALL));

  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }

  return await response.json();
};

/**
 * Update Doctor Profile Image
 * @param {string} email - Doctor email
 * @param {string} profileImage - Base64 image string
 * @returns {Promise<Object>} - Updated doctor profile
 */
export const updateDoctorProfileImage = async (email, profileImage) => {
  const response = await fetch(`${API_BASE_URL}/doctors/profile-image`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, profileImage }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update profile image';
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
