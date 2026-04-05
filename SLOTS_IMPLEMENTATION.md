# Doctor Info & Slots Implementation Guide

## Overview

This guide explains how the doctor info forwarding and default slots storage system works in the DrMeet application.

---

## Part 1: Frontend - Doctor Info Forwarding

### 1.1 Navigation with Doctor State (DoctorCard.jsx)

**Changed from:**

```jsx
onClick={() => navigate(`/doctor/${props.email}`)}
```

**Changed to:**

```jsx
onClick={() => navigate(`/doctor/${props.id}`, { state: { doctor: props } })}
```

**What this does:**

- Uses doctor ID instead of email in the URL
- Passes entire doctor object via React Router state
- Allows ViewSlot to access doctor info immediately without database lookup

### 1.2 ViewSlot Component Update (ViewSlot.jsx)

**Key changes:**

```jsx
import { useParams, useLocation } from "react-router-dom";

// Get doctor from navigation state (preferred) or fallback to localStorage
const location = useLocation();
const doctorFromState = location.state?.doctor;
const selectedDoctor =
  doctorFromState || doctorsarr.find((doc) => doc.id === Number(id));
```

**Benefits:**

- Instant access to doctor info on the slots selection page
- No need to fetch doctor data again
- Smooth user experience

---

## Part 2: Backend - 20 Default Slots Storage

### 2.1 Database Schema

#### SlotEntity.java

New entity to store slots in the database with the following fields:

- `id`: Primary key
- `doctor`: ManyToOne relationship with DoctorEntity
- `slotDate`: Date of the slot (YYYY-MM-DD format)
- `slotTime`: Time slot (e.g., "09:00 AM")
- `isBooked`: Boolean flag (true if booked, false if available)
- `bookedByUserId`: ID of the patient who booked it
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

#### DoctorEntity.java Update

Added one-to-many relationship:

```java
@OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
@JsonManagedReference
private List<SlotEntity> slotList;
```

### 2.2 Default Slots

20 time slots are created automatically when a doctor registers:

```
09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM,
12:00 PM, 12:30 PM, 02:00 PM, 02:30 PM, 03:00 PM, 03:30 PM,
04:00 PM, 04:30 PM, 05:00 PM, 05:30 PM, 06:00 PM, 06:30 PM,
07:00 PM, 07:30 PM
```

---

## Part 3: Backend Services & APIs

### 3.1 SlotService.java

Core service containing slot management logic:

**Key Methods:**

1. **createDefaultSlots(doctorId, startDate)**
   - Creates 20 default slots for a doctor on a specific date
   - Called automatically when doctor registers

2. **getAvailableSlots(doctorId, date)**
   - Returns only unbooked slots for a date

3. **bookSlot(doctorId, date, time, userId)**
   - Books a slot for a patient
   - Updates isBooked and bookedByUserId

4. **cancelSlot(slotId)**
   - Cancels a booked slot
   - Marks as available again

5. **getAvailableSlotsInRange(doctorId, startDate, endDate)**
   - Returns available slots between two dates

6. **getPatientAppointments(userId)**
   - Returns all appointments booked by a patient

### 3.2 SlotRepository.java

JPA repository with custom queries:

**Key Methods:**

- `findByDoctorIdAndSlotDate()` - Get all slots for a date
- `findByDoctorIdAndSlotDateAndIsBookedFalse()` - Get available slots
- `findByDoctorIdAndSlotDateAndSlotTime()` - Get specific slot
- `findAvailableSlotsByDoctorAndDateRange()` - Get available slots in range
- `findByBookedByUserIdAndIsBookedTrue()` - Get patient's bookings

### 3.3 SlotController.java

REST API endpoints:

| Endpoint                           | Method | Description                                   |
| ---------------------------------- | ------ | --------------------------------------------- |
| `/api/slots/available/{doctorId}`  | GET    | Get available slots for a date                |
| `/api/slots/{doctorId}`            | GET    | Get all slots (booked + available) for a date |
| `/api/slots/range/{doctorId}`      | GET    | Get slots in date range                       |
| `/api/slots/book`                  | POST   | Book a slot                                   |
| `/api/slots/cancel/{slotId}`       | PUT    | Cancel a booked slot                          |
| `/api/slots/initialize/{doctorId}` | POST   | Initialize slots for a new date               |
| `/api/slots/patient/{userId}`      | GET    | Get patient's appointments                    |

### 3.4 DoctorService.java Update

Modified to automatically create 20 default slots when a doctor registers:

```java
public DoctorEntity registerDoctor(DoctorEntity doctor) {
    // ... existing code ...
    DoctorEntity savedDoctor = doctorRepository.save(doctor);

    // Create 20 default slots for today
    slotService.createDefaultSlots(savedDoctor.getId(), LocalDate.now());

    return savedDoctor;
}
```

---

## Part 4: Usage Flow

### 4.1 Doctor Registration

1. Doctor completes registration form
2. Backend saves doctor and auto-creates 20 slots for today's date
3. Slots are stored in the `slots` table with `isBooked = false`

### 4.2 User Searching for Doctor

1. User searches doctors and sees doctor cards
2. Clicks "View Slots" button
3. DoctorCard passes doctor object via React Router state

### 4.3 User Selecting Date and Time

1. ViewSlot component receives doctor info from state
2. User selects date using DateSelector
3. Frontend calls backend API: `GET /api/slots/available/{doctorId}?date=YYYY-MM-DD`
4. Available slots for that date are displayed
5. User selects a time slot
6. Frontend calls: `POST /api/slots/book` with doctorId, date, time, userId
7. Backend books the slot and returns success

---

## Part 5: API Usage Examples

### Get Available Slots

```
GET /api/slots/available/1?date=2026-04-15
Response: List of SlotEntity objects with isBooked=false
```

### Book a Slot

```
POST /api/slots/book?doctorId=1&date=2026-04-15&time=09:00%20AM&userId=5
Response: {
    "message": "Slot booked successfully",
    "slot": { ... }
}
```

### Cancel a Slot

```
PUT /api/slots/cancel/123
Response: {
    "message": "Slot cancelled successfully",
    "slot": { ... }
}
```

### Initialize Slots for New Date

```
POST /api/slots/initialize/1?date=2026-04-20
Response: {
    "message": "Slots initialized for date: 2026-04-20",
    "slots": [ ... ]
}
```

---

## Part 6: Database Migration

Run this SQL to create the slots table:

```sql
CREATE TABLE slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    slot_date DATE NOT NULL,
    slot_time VARCHAR(20) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    booked_by_user_id BIGINT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_slot (doctor_id, slot_date, slot_time)
);
```

Or let JPA/Hibernate create it automatically with:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Part 7: Frontend Integration (Next Steps)

To fully integrate with frontend API calls, update:

1. **Localstorage.js**: Add functions to call backend slot APIs

   ```javascript
   export async function getAvailableSlotsFromBackend(doctorId, date) {
     return fetch(`/api/slots/available/${doctorId}?date=${date}`).then((res) =>
       res.json(),
     );
   }
   ```

2. **TimeSelector.jsx**: Use backend API instead of localStorage
3. **ViewSlot.jsx**: Call backend to book slots instead of localStorage

---

## Summary

✅ Doctor info is forwarded directly to ViewSlot page via React state  
✅ 20 default slots are created automatically when doctor registers  
✅ Slots are stored in the database with full management capabilities  
✅ REST APIs are available for all slot operations  
✅ Backward compatibility with localStorage-based slots maintained

---

## Files Modified/Created

**Frontend:**

- `src/components/DoctorCard.jsx` - Updated navigation
- `src/pages/users/ViewSlot.jsx` - Updated to receive doctor info from state

**Backend:**

- `Entity/SlotEntity.java` - NEW
- `Entity/DoctorEntity.java` - Updated with relationship
- `Repository/SlotRepository.java` - NEW
- `Services/SlotService.java` - NEW
- `Services/DoctorService.java` - Updated to create default slots
- `Controller/SlotController.java` - NEW
