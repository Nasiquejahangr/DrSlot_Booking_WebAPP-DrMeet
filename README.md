<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# DrMeet – Doctor Appointment System

DrMeet is a web-based doctor appointment system designed to simplify appointment scheduling between patients and doctors. Users can search doctors by locality and specialization, view available time slots, and book appointments only after payment confirmation.

The system focuses on real-world booking challenges such as slot conflicts, payment failure handling, mandatory profile completion, and state-based appointment management to ensure reliable booking behavior.

---

##  Features
- User registration and login with profile completion
- Search doctors by locality and specialization
- View real-time available appointment slots
- Payment-based appointment confirmation
- Slot conflict prevention using state-based booking
- Doctor dashboard to manage availability and slots
- View upcoming and past appointments

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript (Mobile-first Web App)
- **Backend:** Java, Spring Boot, REST APIs
- **Database:** MySQL
- **Authentication:** JWT
- **Tools:** GitHub, Postman

---

## 📌 Project Scope
This project was developed as a minor project with a focus on backend logic, system flow, and real-world booking scenarios rather than UI complexity.

---

## 📂 Project Structure
Backend follows a layered architecture:
- Controller
- Service
- Repository

---

## 📖 Future Improvements
- Admin approval for doctors
- Notifications (Email/SMS)
- Integration with real payment gateway

---

```bash
drmeet-frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── api/                    ← (Backend API calls)
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   ├── doctorApi.js
│   │   └── appointmentApi.js
│
│   ├── components/             ← (Reusable UI components)
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorCard.jsx
│   │   │   └── SlotButton.jsx
│   │   │
│   │   └── appointment/
│   │       └── AppointmentCard.jsx
│
│   ├── pages/                  ← (Screens / Routes)
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── Landing.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Slots.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── Appointments.jsx
│   │   │
│   │   └── doctor/
│   │       ├── DoctorDashboard.jsx
│   │       ├── ManageSlots.jsx
│   │       └── DoctorAppointments.jsx
│
│   ├── context/                ← (Auth & global state)
│   │   └── AuthContext.jsx
│
│   ├── hooks/                  ← (Custom hooks)
│   │   └── useAuth.js
│
│   ├── routes/                 ← (Protected routing)
│   │   ├── AppRoutes.jsx
│   │   └── PrivateRoute.jsx
│
│   ├── utils/                  ← (Helpers)
│   │   ├── constants.js
│   │   └── tokenHelper.js
│
│   ├── styles/
│   │   └── main.css
│
│   ├── App.jsx
│   └── index.js
│
└── package.json





drmeet-backend/
│
├── src/main/java/com/drmeet/
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── DoctorController.java
│   │   ├── AppointmentController.java
│
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── DoctorService.java
│   │   ├── AppointmentService.java
│
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── DoctorRepository.java
│   │   ├── AppointmentRepository.java
│
│   ├── model/
│   │   ├── User.java
│   │   ├── Doctor.java
│   │   ├── Slot.java
│   │   ├── Appointment.java
│
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── AppointmentRequest.java
│
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtFilter.java
│
│   └── DrMeetApplication.java
│
├── src/main/resources/
│   ├── application.properties
│
└── pom.xml

## 👤 Author
Nasique Jahangir
>>>>>>> d8f501ef3859588cfd447585bb660ac9e02abbce
# DrSlot_Booking_WebAPP-DrMeet
