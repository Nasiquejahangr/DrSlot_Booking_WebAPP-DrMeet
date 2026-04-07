# DrMeet Doctor Appointment System

Last Updated: 06 April 2026

---

## 1) Executive Summary

DrMeet is a full-stack doctor appointment platform with two primary roles:

- Patient
- Doctor

The codebase contains:

- Frontend: React + Vite
- Backend: Spring Boot + MySQL

Current implementation is a **hybrid architecture**:

- Authentication and profile data are fetched from backend APIs.
- Appointment booking and slot management in UI currently rely heavily on browser `localStorage` utilities.
- Backend also has a complete slot module (`/api/slots/...`) that is not fully wired into current frontend booking pages.

---

## 2) Repository Map (Actual)

```text
drmeet-doctor-appointment-system/
├── API_REFACTORING_SUMMARY.md
├── Documentation.md
├── README.md
├── SLOTS_IMPLEMENTATION.md
├── Frontend/
│   ├── docs/
│   │   └── slot-management-and-appointments.md
│   ├── src/
│   │   ├── api/
│   │   │   ├── config.js
│   │   │   ├── index.js
│   │   │   ├── doctorApi/index.js
│   │   │   └── userApi/index.js
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── Doctor/
│   │   │   └── users/
│   │   ├── Payment/Payment.jsx
│   │   ├── util/Localstorage.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── HealthCare_Backend/
	 ├── pom.xml
	 ├── src/main/java/org/healthcare/healthcare_backend/
	 │   ├── Config/
	 │   ├── Controller/
	 │   ├── Entity/
	 │   ├── Repository/
	 │   └── Services/
	 └── src/main/resources/application.properties
```

---

## 3) Tech Stack

### Frontend

- React (v17/18/19 compatible range)
- React Router DOM
- Vite
- React Toastify
- Framer Motion
- Tailwind CSS + custom CSS
- MUI (installed)

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL
- Maven
- Razorpay Java SDK (dependency present)

---

## 4) Backend Architecture (Layered)

Pattern used:

`Controller -> Service -> Repository -> DB`

### 4.1 Controllers

- `DoctorController`
  - Register doctor
  - Login doctor
  - Get doctor by email
  - Get all doctors
  - Update doctor profile image

- `PatientController`
  - Register patient
  - Login patient
  - Get patient by email

- `SlotController`
  - Get available slots by doctor/date
  - Get all slots by doctor/date
  - Get available slots in date range
  - Book slot
  - Cancel slot
  - Initialize slots for date
  - Get patient appointments (from slots)

- `PaymentController`
  - Class exists, route mapping exists
  - Create-order endpoint currently commented / incomplete

### 4.2 Services

- `DoctorService`
  - Email duplicate check
  - BCrypt password hashing
  - Enforces role as `DOCTOR`
  - On successful register: creates 20 default slots for current date

- `PatientService`
  - Email duplicate check
  - BCrypt password hashing
  - Login verification with BCrypt

- `SlotService`
  - Default slot creation (20 fixed slots)
  - Slot read, booking, cancellation
  - Date-range query support
  - Patient appointment lookup by `bookedByUserId`

- `PaymentService`
  - Skeleton present, not implemented

### 4.3 Repositories

- `DoctorRepo`: `findByEmail`
- `PatientRepo`: `findByEmail`
- `SlotRepository`: multiple slot/date/booked queries + JPQL date-range queries
- `PaymentOrderRepo`: `findByOrderId`

---

## 5) Data Model (JPA Entities)

### 5.1 `DoctorEntity`

Key fields:

- `id`, `role`, `fullName`, `email`, `phone`, `password`
- `specialization`, `qualification`, `workingExperience`
- `clinicLocation`, `hospitalName`, `medicalLicenseNumber`
- `fee`, `about`, `profileImage`, `certificate`
- `slots` (`TEXT` JSON string; backward compatibility)
- `slotList` (`@OneToMany` mapped to `SlotEntity`)

### 5.2 `PatientEntity`

Key fields:

- `id`, `role`, `fullname`, `email`, `password`, `phoneNumber`

### 5.3 `SlotEntity`

Key fields:

- `id`
- `doctor` (`@ManyToOne`)
- `slotDate`, `slotTime`
- `isBooked`, `bookedByUserId`
- `createdAt`, `updatedAt`

DB uniqueness:

- Unique constraint on `(doctor_id, slot_date, slot_time)`

### 5.4 `PaymentOrderEntity`

Key fields:

- `name`, `email`, `phoneNumber`, `amount`
- `orderId`, `paymentId`, `status`, `createdAt`

---

## 6) Backend API Contract (Current)

### 6.1 Doctor APIs

- `POST /api/doctors/register`
- `POST /api/doctors/login`
- `GET /api/doctors/get/{email}`
- `GET /api/doctors/all`
- `PUT /api/doctors/profile-image`

### 6.2 Patient APIs

- `POST /api/patients/register`
- `POST /api/patients/login`
- `GET /api/patients/get/{email}`

### 6.3 Slot APIs

- `GET /api/slots/available/{doctorId}?date=YYYY-MM-DD`
- `GET /api/slots/{doctorId}?date=YYYY-MM-DD`
- `GET /api/slots/range/{doctorId}?startDate=...&endDate=...`
- `POST /api/slots/book?doctorId=...&date=...&time=...&userId=...`
- `PUT /api/slots/cancel/{slotId}`
- `POST /api/slots/initialize/{doctorId}?date=YYYY-MM-DD`
- `GET /api/slots/patient/{userId}`

### 6.4 Payment APIs

- Base route class: `/api/payment`
- Order creation endpoint not yet active

---

## 7) Frontend Architecture and Routing

### 7.1 App Shell

`App.jsx` handles:

- Route map
- Page transition animations
- Toast container
- Conditional layout (`Nav`, `Logoandprofile`)

### 7.2 Route Summary

User routes:

- `/` -> Landing
- `/search` -> Search doctors
- `/doctor/:id` -> View slots + book
- `/appointment` -> User appointments
- `/profile` -> User profile

Auth routes:

- `/login`
- `/register`
- `/DoctorRegister`

Doctor routes:

- `/Dashboard`
- `/DoctorProfile`
- `/ManageSlot`
- `/DoctorAppointments`

Other:

- `/payment`

### 7.3 Frontend API Layer

Under `src/api`:

- `config.js` has base URL and endpoint constants.
- `doctorApi` and `userApi` expose fetch wrappers with basic error handling.
- `index.js` re-exports modules for clean import style.

---

## 8) Current Data Strategy (Important)

The frontend uses **two data sources simultaneously**:

1. Backend APIs (for login, register, doctor list, profile)
2. Browser localStorage (for slots and appointments in active UI pages)

`src/util/Localstorage.js` provides:

- `DEFAULT_SLOTS` (20 slots)
- `getDoctorSlots()`
- `saveDoctorSlots()`
- `saveAppointment()`
- `getUserAppointments()`
- `getDoctorAppointments()`

Meaning: booking flows may work in local browser state even when backend slots exist.

---

## 9) End-to-End Flow Documentation

## 9.1 Patient Registration Flow

1. User opens `/register`.
2. Chooses `user` role.
3. Frontend validates password confirm + 10-digit phone.
4. Frontend calls `userApi.userRegister()`.
5. Backend `PatientController.registerPatient()` -> `PatientService.registerPatient()`.
6. Email uniqueness check + BCrypt hash + DB save.
7. User is redirected to `/login`.

## 9.2 Doctor Registration Flow

1. User opens `/DoctorRegister`.
2. Fills professional profile and uploads certificate metadata.
3. Frontend sends payload using `doctorApi.doctorRegister()`.
4. Backend `DoctorService.registerDoctor()`:
   - Duplicate email check
   - BCrypt password hash
   - Role enforced to `DOCTOR`
   - Doctor save
   - Auto-create 20 default slots for `LocalDate.now()` through `SlotService`
5. Redirect to login.

## 9.3 Unified Login Flow

1. User submits `/login` form.
2. Frontend first tries patient login API; if role mismatch/failure, tries doctor login API.
3. On success, frontend sets session markers (`token`, `userType`, email keys, ids).
4. Route decision:
   - Patient -> `/`
   - Doctor -> `/Dashboard`

Note: Current `token` is a local marker (`"loggedIn"`), not JWT.

## 9.4 Patient Search and Booking Flow (Current UI Path)

1. User visits `/search`.
2. Frontend fetches all doctors from backend (`/api/doctors/all`).
3. User opens doctor card -> `/doctor/:id` with doctor data in router state.
4. User picks date via `DateSelector` (next 7 days).
5. `TimeSelector` reads slots via `getDoctorSlots(doctorId, date)` from localStorage utility.
6. On booking:
   - Slot is marked booked in localStorage via `saveDoctorSlots()`.
   - Appointment entry is created via `saveAppointment()`.
7. User sees appointment under `/appointment` from localStorage read.

## 9.5 Doctor Operational Flow

1. Doctor logs in and lands on `/Dashboard`.
2. Dashboard fetches profile from backend by doctor email.
3. Dashboard stats read appointment counts from localStorage (`getDoctorAppointments`).
4. `/ManageSlot` allows date-wise slot CRUD in localStorage.
5. `/DoctorAppointments` displays bookings from localStorage.

## 9.6 Backend Slot Flow (Implemented Server-Side)

Independent of current UI localStorage path, backend supports full slot lifecycle:

1. Default slots initialized at doctor registration.
2. Frontend (if wired) can query available slots by date.
3. Booking endpoint marks slot as booked and stores `bookedByUserId`.
4. Cancellation endpoint releases slot.
5. Range queries and patient appointment lookup are available.

---

## 10) Security & Session Observations

- Password hashing: implemented with BCrypt.
- API authorization: currently permissive (`permitAll` for all requests).
- Frontend protected routes depend on local/session storage marker token.
- No JWT issuance/verification in active flow.

---

## 11) Configuration and Run Guide

## 11.1 Backend

Prerequisites:

- Java 21+
- Maven
- MySQL

Config file:

- `HealthCare_Backend/src/main/resources/application.properties`

Run:

1. Create database `healthcare_database`.
2. Update DB credentials.
3. Start backend:
   - `cd HealthCare_Backend`
   - `./mvnw spring-boot:run`

Server default:

- `http://localhost:8080`

## 11.2 Frontend

Prerequisites:

- Node.js 18+
- npm

Run:

1. `cd Frontend`
2. `npm install`
3. `npm run dev`

Client default:

- `http://localhost:5173`

---

## 12) Gap Analysis (What Is Working vs What Is Partial)

### Working Well

- Registration + login for both roles
- Doctor listing and profile fetch from backend
- Doctor profile image update to backend
- Backend slot module complete for major operations
- Frontend API abstraction for doctor/patient modules

### Partial / Inconsistent Areas

1. **Slot/appointment source mismatch**
   - UI booking pages use localStorage while backend slot APIs exist.

2. **Patient all endpoint mismatch**
   - Frontend `PATIENT_ALL` exists in config, backend endpoint not implemented.

3. **Payment route mismatch / incomplete backend**
   - Frontend default points to `/api/payments/create-order` (plural).
   - Backend base controller is `/api/payment` and method is not implemented.

4. **Session model is placeholder based**
   - No JWT token lifecycle.

5. **Doctor appointments page data labeling**
   - Cards in doctor appointments currently show doctor naming fields where patient identity would be expected.

---

## 13) Recommended Unification Plan

Priority 1 (core consistency):

1. Move booking flow from localStorage to backend slot APIs in:
   - `ViewSlot.jsx`
   - `TimeSelector.jsx`
   - `Appointment.jsx`
   - `DoctorAppointments.jsx`
   - `MagangeSlot.jsx` (optional if doctor should manage DB slots)

Priority 2 (auth hardening):

2. Replace marker token with JWT login response + guarded endpoints.

Priority 3 (payment completion):

3. Implement Razorpay create-order endpoint and align route naming.

Priority 4 (cleanup):

4. Remove legacy localStorage fallback once backend integration is complete.

---

## 14) Developer Notes and Conventions

- Current project has mixed naming styles (`MagangeSlot.jsx` typo retained in route).
- Existing docs include historical states; treat this file as the latest architecture snapshot.
- Keep `Controller -> Service -> Repository` pattern for new backend additions.
- Keep frontend API wrappers as single source for endpoint usage.

---

## 15) Quick Flow Diagram

```text
[Patient/Doctor UI]
		|
		| login/register/profile/search
		v
[Frontend API Layer (src/api)] ---> [Spring Controllers] ---> [Services] ---> [Repositories] ---> [MySQL]
		|
		| slot booking in current UI path
		v
[localStorage util]  (current temporary booking source)
```

Target state:

```text
All appointment + slot reads/writes -> Backend slot/payment/auth APIs -> MySQL
```

---

## 16) Conclusion

Project has strong foundation:

- role-based multi-user product flow,
- clear backend layering,
- reusable frontend API structure,
- implemented slot entity/service architecture.

Main next step is **full backend-driven slot + appointment integration** so both doctor and patient experiences are consistent across devices and sessions.
