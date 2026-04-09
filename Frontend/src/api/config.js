// API Base Configuration
// Use same-origin path to avoid mixed-content issues in HTTPS contexts.
export const API_BASE_URL = '/api';

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

  // Slot/Appointments Endpoints
  SLOT_BOOK: '/slots/book',
  SLOT_BY_DOCTOR_DATE: '/slots',
  SLOT_INITIALIZE: '/slots/initialize',
  SLOT_PATIENT_APPOINTMENTS: '/slots/patient',
  SLOT_DOCTOR_APPOINTMENTS: '/slots/doctor',

  // Payment Endpoints
  PAYMENT_CREATE_ORDER: '/payment/create-order',
  PAYMENT_VERIFY: '/payment/verify-payment',
  PAYMENT_KEY: '/payment/key',
};

// Helper function to construct full URL
export const getFullUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
