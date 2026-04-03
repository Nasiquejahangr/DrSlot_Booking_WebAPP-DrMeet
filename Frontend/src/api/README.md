# API Structure Documentation

## Overview

The application uses a centralized API structure that separates concerns into user and doctor APIs. All API calls are managed through dedicated modules, making the codebase maintainable and scalable.

## Folder Structure

```
src/api/
├── config.js           # Base configuration and endpoints
├── index.js            # Central export point for all APIs
├── userApi/
│   └── index.js        # User/Patient API functions
└── doctorApi/
    └── index.js        # Doctor API functions
```

## Files Overview

### 1. **config.js**

Central configuration file containing:

- `API_BASE_URL`: Base URL for all API calls
- `ENDPOINTS`: Object with all API endpoint constants
- `getFullUrl()`: Helper function to construct full URLs

**Usage:**

```javascript
import { getFullUrl, ENDPOINTS } from '../api/config.js';
```

### 2. **userApi/index.js**

Contains all user/patient-related API functions:

- `userLogin(email, password)` - Patient login
- `userRegister(userData)` - Patient registration
- `getUserProfile(email)` - Get patient profile by email
- `getAllUsers()` - Get all patients

**Usage:**

```javascript
import { userApi } from '../api/index.js';

// Login
await userApi.userLogin(email, password);

// Register
await userApi.userRegister(userData);

// Get profile
await userApi.getUserProfile(email);

// Get all users
await userApi.getAllUsers();
```

### 3. **doctorApi/index.js**

Contains all doctor-related API functions:

- `doctorLogin(email, password)` - Doctor login
- `doctorRegister(doctorData)` - Doctor registration
- `getDoctorProfile(email)` - Get doctor profile by email
- `getAllDoctors()` - Get all doctors

**Usage:**

```javascript
import { doctorApi } from '../api/index.js';

// Login
await doctorApi.doctorLogin(email, password);

// Register
await doctorApi.doctorRegister(doctorData);

// Get profile
await doctorApi.getDoctorProfile(email);

// Get all doctors
await doctorApi.getAllDoctors();
```

### 4. **index.js**

Central export file that re-exports all APIs:

```javascript
export * as userApi from './userApi/index.js';
export * as doctorApi from './doctorApi/index.js';
export { API_BASE_URL, ENDPOINTS, getFullUrl } from './config.js';
```

## How to Add New APIs

### 1. **For User/Patient APIs:**

Add new functions to `src/api/userApi/index.js`:

```javascript
export const updateUserProfile = async (email, userData) => {
  const response = await fetch(
    `${getFullUrl(ENDPOINTS.PATIENT_UPDATE)}/${email}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await response.json();
};
```

Then add the endpoint to `config.js`:

```javascript
PATIENT_UPDATE: "/patients/update",
```

### 2. **For Doctor APIs:**

Add new functions to `src/api/doctorApi/index.js`:

```javascript
export const updateDoctorProfile = async (email, doctorData) => {
  const response = await fetch(
    `${getFullUrl(ENDPOINTS.DOCTOR_UPDATE)}/${email}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await response.json();
};
```

Then add the endpoint to `config.js`:

```javascript
DOCTOR_UPDATE: "/doctors/update",
```

## Usage Examples

### Login Component

```javascript
import { doctorApi, userApi } from '../api/index';

async function handleLogin(email, password) {
  try {
    const data = await doctorApi.doctorLogin(email, password);
    // Handle doctor login
  } catch (error) {
    // Try user login
    const userData = await userApi.userLogin(email, password);
    // Handle user login
  }
}
```

### Profile Component

```javascript
import { userApi } from '../api/index';

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const profile = await userApi.getUserProfile(email);
      setUserData(profile);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  fetchProfile();
}, [email]);
```

### Search Component

```javascript
import { doctorApi } from '../api/index';

useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const doctors = await doctorApi.getAllDoctors();
      setDoctors(doctors);
    } catch (error) {
      console.error('Failed to load doctors', error);
    }
  };

  fetchDoctors();
}, []);
```

## Benefits

1. **Centralized API Management**: All API calls are in one place
2. **Easy Configuration**: Change the base URL in one file
3. **Consistent Error Handling**: All APIs handle errors the same way
4. **Scalability**: Easy to add new APIs without modifying existing code
5. **Type Safety**: Can be easily adapted for TypeScript
6. **Maintainability**: Clear separation of concerns
7. **Reusability**: Import and use APIs anywhere in the application

## Migration Notes

The following files have been updated to use the new API structure:

- `src/pages/auth/User/Login.jsx`
- `src/pages/auth/User/Register.jsx`
- `src/pages/auth/Doctor/DoctorRegistration.jsx`
- `src/pages/users/Profile.jsx`
- `src/pages/users/SearchDoct.jsx`
- `src/pages/users/Landing.jsx`
- `src/pages/Doctor/Dashboard.jsx`

All hardcoded API URLs have been replaced with the new API functions.
