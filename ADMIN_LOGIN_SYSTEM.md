# Admin Login System Documentation

## Overview

Complete admin authentication system for the Healthcare appointment platform. Admins can register via Postman (no UI for registration) and then login to access the doctor approval dashboard.

## Architecture

### Backend Components

#### 1. AdminEntity (`Entity/AdminEntity.java`)

```java
@Entity
@Table(name = "admin")
public class AdminEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;

    @Column(unique = true)
    private String email;
    private String password;  // BCrypt encrypted
}
```

#### 2. AdminRepo (`Repository/AdminRepo.java`)

- `findByEmail(String email)` - Fetch admin by email for login validation

#### 3. AdminService (`Services/AdminService.java`)

**Methods:**

- `registerAdmin(fullname, email, password)` - Register new admin
  - Validates email uniqueness
  - Encrypts password with BCryptPasswordEncoder
  - Returns AdminEntity
  - Throws `RuntimeException` if email already exists

- `loginAdmin(email, password)` - Authenticate admin
  - Finds admin by email
  - Validates password match using BCryptPasswordEncoder
  - Returns AdminEntity on success
  - Throws `RuntimeException` for invalid credentials

- `getAdminByEmail(email)` - Fetch admin profile

#### 4. AdminController (`Controller/AdminController.java`)

**Endpoints:**

| Method | Endpoint                  | Body                          | Response                          | Status  |
| ------ | ------------------------- | ----------------------------- | --------------------------------- | ------- |
| POST   | `/api/admin/register`     | `{fullname, email, password}` | `{message, id, email, fullname}`  | 200/400 |
| POST   | `/api/admin/login`        | `{email, password}`           | `{message, id, email, fullname}`  | 200/401 |
| GET    | `/api/admin/all`          | -                             | `DoctorEntity[]`                  | 200     |
| GET    | `/api/admin/pending`      | -                             | `DoctorEntity[]` (status=PENDING) | 200     |
| PUT    | `/api/admin/{id}/approve` | -                             | `{message, doctor}`               | 200/400 |
| PUT    | `/api/admin/{id}/reject`  | -                             | `{message, doctor}`               | 200/400 |

### Frontend Components

#### 1. AdminLogin Page (`pages/Admin/AdminLogin.jsx`)

Premium login interface with:

- Email and password input fields
- Form validation (required fields, valid email format)
- Loading state indicator
- Error handling with toast notifications
- Styled gradient header with shield icon
- Info box explaining admin registration process

**Features:**

- Input sanitization
- Loading state UI
- Error toast notifications
- Auto-redirect to `/admin` on successful login
- Session storage of admin credentials

#### 2. AdminLogin API (`api/adminApi/index.js`)

**Functions:**

- `adminLogin(email, password)` → POST `/api/admin/login`
- `adminRegister(adminData)` → POST `/api/admin/register` (for Postman)
- `getAllDoctorsForAdmin()` → GET `/api/admin/all`
- `getPendingDoctors()` → GET `/api/admin/pending`
- `approveDoctor(doctorId)` → PUT `/api/admin/{id}/approve`
- `rejectDoctor(doctorId)` → PUT `/api/admin/{id}/reject`

#### 3. ProtectedAdminRoute (`components/ProtectedAdminRoute.jsx`)

Route wrapper component that:

- Checks for `adminId` and `adminEmail` in sessionStorage
- Redirects to `/admin-login` if not authenticated
- Renders child component if authenticated

#### 4. Updated DoctorApprovals (`pages/Admin/DoctorApprovals.jsx`)

Enhanced with:

- Admin logout button in header
- Display of logged-in admin email
- Logout handler that clears sessionStorage
- Logout confirmation toast

#### 5. App.jsx Router Updates

Added routes:

- `/admin-login` - AdminLogin component (unprotected)
- `/admin` - DoctorApprovals wrapped in ProtectedAdminRoute

## User Flow

### Admin Registration (via Postman)

```bash
POST http://localhost:8080/api/admin/register
Content-Type: application/json

{
  "fullname": "Admin Name",
  "email": "admin@healthcare.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Admin registered successfully",
  "id": 1,
  "email": "admin@healthcare.com",
  "fullname": "Admin Name"
}
```

### Admin Login

1. Navigate to `http://localhost:5173/admin-login`
2. Enter admin email and password
3. Click "Login" button
4. On success:
   - Admin credentials stored in sessionStorage
   - Redirected to `/admin` dashboard
   - Admin email displayed in header

### Admin Dashboard

- View all registered doctors (pending, approved, rejected)
- Filter doctors by approval status
- View full doctor profile details
- Approve or reject doctor registrations
- Logout and return to login page

## Data Flow

### Login Success Flow

```
User Input (email, password)
    ↓
Frontend Validation
    ↓
POST /api/admin/login
    ↓
Backend: AdminService.loginAdmin()
    ↓
Password Verification (BCrypt)
    ↓
Return Admin Object {id, email, fullname}
    ↓
Store in sessionStorage
    ↓
Redirect to /admin
```

### Admin Dashboard Flow

```
/admin route accessed
    ↓
ProtectedAdminRoute checks auth
    ↓
If not authenticated → Redirect to /admin-login
    ↓
If authenticated → Render DoctorApprovals
    ↓
Load all doctors via getAllDoctorsForAdmin()
    ↓
Display with filtering, approve/reject buttons
```

## Session Management

**SessionStorage Keys:**

- `admin` - Full admin object JSON
- `adminId` - Admin ID for quick checks
- `adminEmail` - Admin email for display

**Logout Process:**

1. Clear all sessionStorage keys
2. Show success toast
3. Redirect to `/admin-login`

## Security Considerations

1. **Password Encryption:** All passwords encrypted with BCryptPasswordEncoder
2. **Email Uniqueness:** Database constraint prevents duplicate admin emails
3. **Session-based Auth:** Admin credentials stored only in sessionStorage (not persistent)
4. **Protected Routes:** `/admin` route requires valid sessionStorage auth
5. **Input Validation:** Both frontend and backend validate email format and required fields

## Error Handling

**Frontend:**

- Toast notifications for all errors
- Loading states to prevent duplicate submissions
- Form validation before API calls

**Backend:**

- Descriptive error messages for login failures
- 401 status for authentication errors
- 400 status for validation errors
- 500 status for server errors (wrapped in ResponseEntity)

## Postman Examples

### Register Admin

```
POST http://localhost:8080/api/admin/register
Headers:
  Content-Type: application/json

Body:
{
  "fullname": "John Doe",
  "email": "john@admin.com",
  "password": "Admin@123"
}
```

### Login Admin

```
POST http://localhost:8080/api/admin/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "john@admin.com",
  "password": "Admin@123"
}
```

### Get All Doctors

```
GET http://localhost:8080/api/admin/all
```

### Approve Doctor

```
PUT http://localhost:8080/api/admin/1/approve
```

### Reject Doctor

```
PUT http://localhost:8080/api/admin/1/reject
```

## Testing Checklist

- [ ] Register admin via Postman successfully
- [ ] Login with correct credentials redirects to `/admin`
- [ ] Login with incorrect password shows error
- [ ] Login with non-existent email shows error
- [ ] Admin dashboard loads and displays doctors
- [ ] Can filter doctors by status (ALL, PENDING, APPROVED, REJECTED)
- [ ] Can approve pending doctor
- [ ] Can reject pending doctor
- [ ] Logout button clears session and redirects to login
- [ ] Accessing `/admin` without auth redirects to `/admin-login`
- [ ] Doctor approval affects doctor login access (blocked if not APPROVED)
- [ ] Doctor approval affects public search (shows only APPROVED)

## Files Modified/Created

**Backend:**

- ✅ `Entity/AdminEntity.java` - Admin data model
- ✅ `Repository/AdminRepo.java` - Database queries
- ✅ `Services/AdminService.java` - Business logic
- ✅ `Controller/AdminController.java` - REST endpoints

**Frontend:**

- ✅ `pages/Admin/AdminLogin.jsx` - Login UI
- ✅ `api/adminApi/index.js` - API functions
- ✅ `components/ProtectedAdminRoute.jsx` - Route protection
- ✅ `pages/Admin/DoctorApprovals.jsx` - Updated with logout
- ✅ `App.jsx` - Added routes and imports

## Integration with Existing Systems

### Doctor Approval Workflow

1. Doctor registers → Status set to PENDING
2. Admin logs in and views doctor in PENDING tab
3. Admin approves/rejects doctor
4. Doctor status updated in database
5. Doctor login blocked if PENDING/REJECTED
6. Public search shows only APPROVED doctors
7. Doctor can see status in registration completion message

### Session Management

- User login → sessionStorage (patient/doctor)
- Admin login → sessionStorage (admin)
- Each system checks their own sessionStorage keys
- Logout clears appropriate keys

## Future Enhancements

- Admin role-based access control (multiple admin roles)
- Email notifications to doctors on approval/rejection
- Admin activity logging and audit trail
- Two-factor authentication for admin accounts
- Dashboard statistics and analytics
- Doctor profile rejection reasons
- Bulk operations (approve/reject multiple doctors)
