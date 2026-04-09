import { API_BASE_URL, ENDPOINTS, getFullUrl } from '../config.js';

const extractErrorMessage = async (response, fallbackMessage) => {
  let errorMessage = fallbackMessage;
  try {
    const errorData = await response.json();
    errorMessage = errorData?.message || errorData?.error || errorMessage;
  } catch {
    // ignore JSON parse error and keep fallback message
  }
  return errorMessage;
};

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
 * Resolve a display name from a patient profile-like object.
 * @param {Object} profile - Profile payload or stored profile
 * @returns {string}
 */
export const getPatientDisplayName = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return '';
  }

  return profile.fullname || profile.fullName || profile.name || '';
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

/**
 * Get all slots (booked + available) for a doctor by date from DB.
 * @param {number} doctorId
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<Array<{id:number,time:string,isBooked:boolean,doctorId:number,date:string,bookedByUserId:number|null}>>}
 */
export const getDoctorSlotsFromDb = async (doctorId, date) => {
  const response = await fetch(
    `${getFullUrl(ENDPOINTS.SLOT_BY_DOCTOR_DATE)}/${doctorId}?date=${encodeURIComponent(date)}`
  );

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Failed to fetch slots'
    );
    throw new Error(errorMessage);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((slot) => ({
    id: slot.id,
    time: slot.slotTime || slot.time,
    isBooked: Boolean(slot.isBooked),
    doctorId: Number(slot.doctorId ?? doctorId),
    date: slot.slotDate || date,
    bookedByUserId: slot.bookedByUserId ?? null,
  }));
};

/**
 * Book appointment/slot in DB.
 * @param {{doctorId:number, date:string, time:string, userId:number}} payload
 * @returns {Promise<Object>}
 */
export const bookAppointmentInDb = async ({ doctorId, date, time, userId }) => {
  const params = new URLSearchParams({
    doctorId: String(doctorId),
    date,
    time,
    userId: String(userId),
  });

  const response = await fetch(
    `${getFullUrl(ENDPOINTS.SLOT_BOOK)}?${params.toString()}`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Failed to book appointment'
    );
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Get all appointments for a patient from DB.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getPatientAppointmentsFromDb = async (userId) => {
  const response = await fetch(
    `${getFullUrl(ENDPOINTS.SLOT_PATIENT_APPOINTMENTS)}/${userId}`
  );

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Failed to fetch appointments'
    );
    throw new Error(errorMessage);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    id: item.id,
    userId: Number(item.userId ?? item.bookedByUserId ?? userId),
    doctorId: Number(item.doctorId),
    doctorName: item.doctorName || 'Doctor',
    specialization: item.specialization || '',
    qualification: item.qualification || '',
    date: item.date || item.slotDate,
    time: item.time || item.slotTime,
    fee: Number(item.fee || 0),
    profileImage: item.profileImage || '',
    clinicLocation: item.clinicLocation || '',
    status: item.status || 'confirmed',
  }));
};

/**
 * Create Razorpay order on backend with patient + appointment details.
 * @param {{name:string,email:string,phoneNumber:string,amount:number,userId:number,doctorId:number,doctorName:string,appointmentDate:string,appointmentTime:string}} payload
 */
export const createPaymentOrder = async (payload) => {
  const response = await fetch(getFullUrl(ENDPOINTS.PAYMENT_CREATE_ORDER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Failed to create payment order'
    );
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Verify Razorpay payment signature and finalize booking.
 * @param {{razorpay_payment_id:string, razorpay_order_id:string, razorpay_signature:string}} payload
 */
export const verifyPaymentOrder = async (payload) => {
  const response = await fetch(getFullUrl(ENDPOINTS.PAYMENT_VERIFY), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Payment verification failed'
    );
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Fetch Razorpay public key from backend.
 */
export const getPaymentPublicKey = async () => {
  const response = await fetch(getFullUrl(ENDPOINTS.PAYMENT_KEY));

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(
      response,
      'Failed to fetch payment key'
    );
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return String(data?.key || '').trim();
};
