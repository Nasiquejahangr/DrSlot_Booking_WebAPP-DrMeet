# DrMeet — Doctor Appointment System

DrMeet is a full-stack healthcare appointment platform where patients can discover doctors, view profiles, and book consultations, while doctors can manage their profile, slots, and appointments.

This repository contains both:

- **Frontend** (React + Vite)
- **Backend** (Spring Boot + MySQL)

---

## Why this project matters

Healthcare booking often fails because of poor slot handling, unclear user flows, and weak role separation.

DrMeet focuses on:

- clean patient and doctor journeys,
- role-based routing and dashboards,
- reliable slot and appointment workflows,
- practical full-stack architecture recruiters can evaluate end-to-end.

---

## Core Features

### Patient Side

- Register and login
- Browse/search doctors
- View doctor profile and available slots
- Book appointments
- Manage personal profile

### Doctor Side

- Register and login
- Doctor dashboard with profile data
- Manage slots
- View appointments

### Platform/Technical

- Separate user and doctor API layers in frontend
- REST API backend with layered architecture (Controller → Service → Repository)
- MySQL persistence with JPA/Hibernate
- Cross-origin enabled for frontend/backend local development

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- React Toastify
- Framer Motion
- TailwindCSS + CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL
- Maven

---

## Repository Structure

```text
drmeet-doctor-appointment-system/
├── Frontend/            # React application
│   ├── src/
│   │   ├── api/         # API config + doctor/user API modules
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Auth, patient, doctor screens
│   │   └── util/        # Local storage/session helpers
│   └── package.json
└── HealthCare_Backend/  # Spring Boot application
    ├── src/main/java/.../
    │   ├── Controller/
    │   ├── Services/
    │   ├── Repository/
    │   └── Entity/
    ├── src/main/resources/application.properties
    └── pom.xml
```

---

## API Overview (current)

### Doctor APIs

- `POST /api/doctors/register`
- `POST /api/doctors/login`
- `GET /api/doctors/get/{email}`
- `GET /api/doctors/all`

### Patient APIs

- `POST /api/patients/register`
- `POST /api/patients/login`
- `GET /api/patients/get/{email}`

---

## Local Setup Guide

## 1) Backend Setup

### Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+

### Steps

1. Create database in MySQL:
   - `healthcare_database`
2. Open backend config:
   - `HealthCare_Backend/src/main/resources/application.properties`
3. Update DB username/password for your local machine.
4. Run backend:

```bash
cd HealthCare_Backend
./mvnw spring-boot:run
```

Backend will start at: `http://localhost:8080`

---

## 2) Frontend Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
cd Frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## How to run full project

1. Start MySQL
2. Start backend (`:8080`)
3. Start frontend (`:5173`)
4. Open browser and use app from frontend URL

---

## Architecture Notes

- Frontend uses separated API modules:
  - `src/api/userApi`
  - `src/api/doctorApi`
  - shared endpoint config in `src/api/config.js`
- Session/auth state is currently maintained through browser storage and route guards.
- Backend follows standard Spring layered pattern for maintainability.

---

## Current Status

This is an actively evolving project and includes key workflows for recruiter evaluation:

- full-stack integration,
- multi-role product thinking,
- practical API organization,
- readable code structure.

---

## Future Enhancements

- JWT token-based auth hardening
- Payment gateway integration
- Appointment status lifecycle improvements
- Notifications (Email/SMS/Push)
- Admin panel and analytics
- Dockerized deployment

---

## Recruiter Quick Review Checklist

If you are reviewing this project, check:

- Role-specific routing and UI logic
- Backend endpoint design
- API organization in frontend
- Data modeling and service separation
- End-to-end local setup and run quality

---

## Author

**Nasique Jahangir**

If you want, I can also add:

- deployment guide,
- Postman collection,
- API contract table (request/response examples),
- and a polished project demo section with screenshots/GIFs.
