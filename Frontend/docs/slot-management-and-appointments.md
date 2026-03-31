# Doctor Slot Management & Appointment Booking — Feature Documentation

## Overview

This document covers the full implementation of the Doctor Slot Management and Appointment Booking feature. It explains what was built, how each file works, the localStorage data schema, and how all the pieces connect.

---

## Files Changed / Created

| File | Type | Purpose |
|---|---|---|
| `src/util/Localstorage.js` | New | Central utility for all slot and appointment data |
| `src/components/TimeSelector.jsx` | Updated | Reads real slots from localStorage via props |
| `src/pages/Doctor/MagangeSlot.jsx` | Updated | Full CRUD slot management for doctors |
| `src/pages/users/ViewSlot.jsx` | Updated | Slot selection and appointment booking for users |
| `src/pages/Doctor/DoctorAppointments.jsx` | New | Doctor view of all booked appointments |
| `src/pages/users/Appointment.jsx` | Updated | User view of their booked appointments |

---

## localStorage Schema

### `doctors` key
Existing array of doctor objects. The `slots` field is added by this feature.

```json
[
  {
    "id": 1,
    "fullName": "Dr. Example",
    "slots": {
      "2025-07-20": [
        { "time": "09:00 AM", "isBooked": false },
        { "time": "10:00 AM", "isBooked": true }
      ]
    }
  }
]
```

- `slots` is a plain object keyed by `YYYY-MM-DD` date strings
- Each value is an array of `{ time: string, isBooked: boolean }`
- `DEFAULT_SLOTS` are never written automatically — they are returned in-memory only when no stored slots exist for a date

### `appointments` key
New array added by this feature. Each entry is created when a user books a slot.

```json
[
  {
    "id": 1721234567890,
    "userId": 1001,
    "doctorId": 1,
    "doctorName": "Dr. Example",
    "specialization": "Cardiologist",
    "qualification": "MBBS, MD",
    "date": "2025-07-20",
    "time": "09:00 AM",
    "fee": 500,
    "profileImage": "https://...",
    "clinicLocation": "MG Road, Bangalore",
    "status": "confirmed"
  }
]
```

---

## `src/util/Localstorage.js`

Central utility module. All components import from here — no component accesses `localStorage` directly for slot or appointment data.

### `DEFAULT_SLOTS`
An array of 20 pre-defined time slots from 09:00 AM to 07:30 PM, all with `isBooked: false`. Returned in-memory when no slots are stored for a date.

### `getDoctorSlots(doctorId, date)`
- Reads `doctors` from localStorage
- Finds the doctor by `id`
- Returns `doctor.slots[date]` if it exists
- Returns `DEFAULT_SLOTS` if no slots are stored for that date

### `saveDoctorSlots(doctorId, date, slots)`
- Reads `doctors` from localStorage
- Finds the doctor by `id`
- Sets `doctor.slots[date] = slots`
- Writes the updated array back to localStorage

### `saveAppointment(appointment)`
- Reads `appointments` from localStorage
- Pushes a new appointment object with `id: Date.now()` and `status: "confirmed"`
- Writes back to localStorage

### `getUserAppointments(userId)`
- Returns all appointments where `appointment.userId === userId`

### `getDoctorAppointments(doctorId)`
- Returns all appointments where `appointment.doctorId === doctorId`

---

## `src/components/TimeSelector.jsx`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `doctorId` | number | yes | Which doctor's slots to load |
| `selectedDate` | string | yes | Date in `YYYY-MM-DD` format |
| `onSlotSelect` | function | yes | Called with `time` string when user clicks an available slot |

### Behaviour
- Returns `null` if `doctorId` or `selectedDate` is missing
- Calls `getDoctorSlots(doctorId, selectedDate)` on mount and when props change
- Listens for `visibilitychange` (same-tab navigation) and `storage` events (cross-tab) to re-read slots automatically when the doctor updates them
- Booked slots render as disabled with grey styling
- Available slots render as clickable; selected slot highlighted in blue
- Clicking an available slot calls `onSlotSelect(slot.time)`

---

## `src/pages/Doctor/MagangeSlot.jsx`

Doctor-facing page for full CRUD slot management.

### State

| State | Purpose |
|---|---|
| `selectedDate` | Currently selected date |
| `slots` | Slots loaded for the selected date |
| `newTime` | Input value for the add form |
| `editingIndex` | Index of the slot being edited, or `null` |
| `editTime` | Input value for the inline edit form |
| `error` | Validation or error message shown in UI |
| `success` | Success feedback message shown in UI |

### Handlers

**`loadSlots(date)`**
Calls `getDoctorSlots(currentDoctorId, date)` and sets `slots` state.

**`handleAdd()`**
1. Validates `selectedDate` and `newTime` are non-empty
2. Converts 24h time input to 12h display format (e.g. `14:00` → `02:00 PM`)
3. Checks for duplicate time in current slots
4. If no slots are stored yet for the date, uses `DEFAULT_SLOTS` as the base
5. Appends `{ time, isBooked: false }` and calls `saveDoctorSlots`

**`handleEditSave(index)`**
1. Guards against editing a booked slot
2. Validates new time is non-empty
3. Checks for duplicate time (excluding the slot being edited)
4. Updates the slot and calls `saveDoctorSlots`

**`handleDelete(index)`**
1. Guards against deleting a booked slot
2. Removes the slot from the array and calls `saveDoctorSlots`

### UI Flow
```
[Date Picker]
     ↓
[Slot List]
  ├── Available slot → [Edit] [Delete] buttons
  ├── Booked slot    → "Booked" badge (no actions)
  └── Editing slot   → inline [time input] [Save] [Cancel]
[Add New Slot]
  └── [time input] [Add Slot button]
[Error / Success message area]
```

---

## `src/pages/users/ViewSlot.jsx`

User-facing page for browsing a doctor's slots and booking an appointment.

### State

| State | Purpose |
|---|---|
| `selectedDate` | Date selected by the user |
| `selectedSlot` | Time string of the slot the user clicked |
| `bookingError` | Error message shown near the Book button |
| `bookingSuccess` | Success message shown after booking |
| `refreshKey` | Incremented to force TimeSelector to re-mount and re-read |

### Key Changes
- Passes `doctorId={Number(id)}`, `selectedDate`, and `onSlotSelect={setSelectedSlot}` to `<TimeSelector>`
- Uses `key={refreshKey}` on TimeSelector so it re-mounts after a booking or date change
- Listens for `visibilitychange` to bump `refreshKey` when the user navigates back to the page

### `handleBookAppointment()`
1. Guards: no slot selected → shows `bookingError`
2. Reads current slots via `getDoctorSlots`
3. Guards: slot already booked → shows `bookingError`
4. Marks slot `isBooked: true` and calls `saveDoctorSlots`
5. Calls `saveAppointment` with full appointment details
6. Resets `selectedSlot` and bumps `refreshKey`

---

## `src/pages/Doctor/DoctorAppointments.jsx`

New page accessible from the Doctor Dashboard → "Appointments" quick action (`/DoctorAppointments`).

- Reads all appointments for the logged-in doctor via `getDoctorAppointments(currentDoctorId)`
- Shows stats: Total, Upcoming, Past
- Tabs: Upcoming / Past / All
- Each card shows: date, time, location, fee, status badge

---

## `src/pages/users/Appointment.jsx`

Updated to read real data instead of hardcoded dummy appointments.

- Reads appointments via `getUserAppointments(currentUserId)`
- Filters by tab: Upcoming (date >= today, not cancelled/completed), Past, All
- Uses today's real date for filtering (not a hardcoded date)
- Card fields updated to use real field names: `doctorName`, `specialization`, `clinicLocation`, `profileImage`

---

## Data Flow Diagram

```
Doctor (ManageSlot page)
    │
    ├── getDoctorSlots()  ←──────────────────────┐
    └── saveDoctorSlots() ──────────────────────┐ │
                                                │ │
                                    localStorage["doctors"]
                                                │ │
    ┌── getDoctorSlots()  ←──────────────────────┘ │
    │                                              │
User (ViewSlot page)                               │
    │                                              │
    ├── TimeSelector reads slots ──────────────────┘
    └── saveAppointment() ──────────────────────────→ localStorage["appointments"]
                                                              │
                                              ┌───────────────┴───────────────┐
                                              │                               │
                                   getUserAppointments()         getDoctorAppointments()
                                              │                               │
                                   Appointment.jsx                DoctorAppointments.jsx
                                   (User side)                    (Doctor side)
```

---

## Real-Time Sync

Since both doctor and user pages run in the same browser using localStorage, two mechanisms keep the user-side slot display in sync after the doctor edits slots:

1. **`visibilitychange` event** — fires when the user switches back to the ViewSlot tab/page. Both `ViewSlot` (bumps `refreshKey`) and `TimeSelector` (re-reads slots) listen to this.
2. **`storage` event** — fires when localStorage changes in a different tab/window. `TimeSelector` listens to this for cross-tab sync.
