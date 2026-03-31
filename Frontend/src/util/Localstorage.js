/**
 * Default time slots returned when no slots are stored for a given date.
 * These are never written to localStorage automatically.
 */
export const DEFAULT_SLOTS = [
  { time: "09:00 AM", isBooked: false },
  { time: "09:30 AM", isBooked: false },
  { time: "10:00 AM", isBooked: false },
  { time: "10:30 AM", isBooked: false },
  { time: "11:00 AM", isBooked: false },
  { time: "11:30 AM", isBooked: false },
  { time: "12:00 PM", isBooked: false },
  { time: "12:30 PM", isBooked: false },
  { time: "02:00 PM", isBooked: false },
  { time: "02:30 PM", isBooked: false },
  { time: "03:00 PM", isBooked: false },
  { time: "03:30 PM", isBooked: false },
  { time: "04:00 PM", isBooked: false },
  { time: "04:30 PM", isBooked: false },
  { time: "05:00 PM", isBooked: false },
  { time: "05:30 PM", isBooked: false },
  { time: "06:00 PM", isBooked: false },
  { time: "06:30 PM", isBooked: false },
  { time: "07:00 PM", isBooked: false },
  { time: "07:30 PM", isBooked: false },
];

/**
 * Read slots for a doctor on a given date.
 * Returns DEFAULT_SLOTS if no slots are stored for that date.
 * @param {number} doctorId
 * @param {string} date - YYYY-MM-DD
 * @returns {Array<{time: string, isBooked: boolean}>}
 */
export function getDoctorSlots(doctorId, date) {
  const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor || !doctor.slots || !doctor.slots[date]) {
    return DEFAULT_SLOTS;
  }
  return doctor.slots[date];
}

/**
 * Persist a slots array for a doctor on a given date.
 * @param {number} doctorId
 * @param {string} date - YYYY-MM-DD
 * @param {Array<{time: string, isBooked: boolean}>} slots
 */
export function saveDoctorSlots(doctorId, date, slots) {
  const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return;
  if (!doctor.slots) {
    doctor.slots = {};
  }
  doctor.slots[date] = slots;
  localStorage.setItem("doctors", JSON.stringify(doctors));
}

/**
 * Save a new appointment record when a user books a slot.
 * @param {{ userId: number, doctorId: number, doctorName: string, specialization: string,
 *           qualification: string, date: string, time: string, fee: number,
 *           profileImage: string, clinicLocation: string }} appointment
 */
export function saveAppointment(appointment) {
  const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  appointments.push({ ...appointment, id: Date.now(), status: "confirmed" });
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

/**
 * Get all appointments for a specific user.
 * @param {number} userId
 * @returns {Array}
 */
export function getUserAppointments(userId) {
  const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  return appointments.filter((a) => a.userId === userId);
}

/**
 * Get all appointments for a specific doctor.
 * @param {number} doctorId
 * @returns {Array}
 */
export function getDoctorAppointments(doctorId) {
  const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  return appointments.filter((a) => a.doctorId === doctorId);
}
