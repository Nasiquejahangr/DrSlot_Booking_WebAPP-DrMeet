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
