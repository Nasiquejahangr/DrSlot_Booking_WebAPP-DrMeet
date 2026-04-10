import { API_BASE_URL } from '../config.js';

/**
 * Admin Login API
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} - Response with admin info and id
 */
export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
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
 * Admin Registration API (for Postman use)
 * @param {Object} adminData - Admin registration data
 * @returns {Promise<Object>} - Response data
 */
export const adminRegister = async (adminData) => {
  const response = await fetch(`${API_BASE_URL}/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to register';
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
 * Get all doctors (for admin)
 */
export const getAllDoctorsForAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }

  return await response.json();
};

/**
 * Get pending doctors
 */
export const getPendingDoctors = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/pending`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pending doctors');
  }

  return await response.json();
};

/**
 * Approve a doctor
 */
export const approveDoctor = async (doctorId) => {
  const response = await fetch(`${API_BASE_URL}/admin/${doctorId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to approve doctor';
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
 * Reject a doctor
 */
export const rejectDoctor = async (doctorId) => {
  const response = await fetch(`${API_BASE_URL}/admin/${doctorId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to reject doctor';
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
