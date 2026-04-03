// API Base Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
export const ENDPOINTS = {
  // Doctor Endpoints
  DOCTOR_LOGIN: '/doctors/login',
  DOCTOR_REGISTER: '/doctors/register',
  DOCTOR_GET: '/doctors/get',
  DOCTOR_ALL: '/doctors/all',

  // Patient/User Endpoints
  PATIENT_LOGIN: '/patients/login',
  PATIENT_REGISTER: '/patients/register',
  PATIENT_GET: '/patients/get',
  PATIENT_ALL: '/patients/all',
};

// Helper function to construct full URL
export const getFullUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
