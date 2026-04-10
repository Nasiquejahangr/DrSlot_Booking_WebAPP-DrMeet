# Admin Login System - Quick Start Guide

## Prerequisites

- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`
- MySQL database with `healthcare_database`
- Spring Boot application started

## Step 1: Restart Backend (Apply Schema)

The admin table should already exist, but restart to ensure all changes are applied:

```bash
cd HealthCare_Backend
mvn clean spring-boot:run
```

**Expected console output:**

```
Hibernate: create table admin (...)
```

## Step 2: Register First Admin (via Postman)

Open Postman and create a new request:

```
POST http://localhost:8080/api/admin/register
Content-Type: application/json

{
  "fullname": "System Admin",
  "email": "admin@healthcare.com",
  "password": "Admin@123"
}
```

**Expected response:**

```json
{
  "message": "Admin registered successfully",
  "id": 1,
  "email": "admin@healthcare.com",
  "fullname": "System Admin"
}
```

## Step 3: Access Admin Login Page

Open browser and navigate to:

```
http://localhost:5173/admin-login
```

## Step 4: Login with Admin Credentials

- Email: `admin@healthcare.com`
- Password: `Admin@123`
- Click "Login"

**Expected behavior:**

- Loading spinner shows briefly
- Toast notification: "Admin login successful!"
- Redirected to `/admin` dashboard
- Admin email displayed in top-right corner

## Step 5: Test Doctor Approval Workflow

1. **Register a test doctor:**
   - Navigate to `/DoctorRegister` (or register link)
   - Fill all fields and submit
   - Should see: "Your registration is under admin review"
   - Doctor status set to PENDING

2. **Go back to admin dashboard:**
   - Click on "PENDING" tab
   - Should see the newly registered doctor

3. **Approve the doctor:**
   - Click "Approve" button
   - Toast shows: "Doctor approved successfully"
   - Doctor moves to APPROVED tab

4. **Test doctor can now login:**
   - Navigate to doctor login
   - Use registered doctor email and password
   - Should login successfully

## API Endpoints Summary

| Action              | Method | URL                       | Authentication            |
| ------------------- | ------ | ------------------------- | ------------------------- |
| Register Admin      | POST   | `/api/admin/register`     | None (Postman)            |
| Admin Login         | POST   | `/api/admin/login`        | Email/Password            |
| Get All Doctors     | GET    | `/api/admin/all`          | None (called by frontend) |
| Get Pending Doctors | GET    | `/api/admin/pending`      | None (called by frontend) |
| Approve Doctor      | PUT    | `/api/admin/{id}/approve` | None (called by frontend) |
| Reject Doctor       | PUT    | `/api/admin/{id}/reject`  | None (called by frontend) |

## Troubleshooting

### "Admin not found" error

- Check email is exactly as registered in Postman
- Verify admin record exists in `admin` table in MySQL

### "Invalid email or password" error

- Double-check password exactly matches registration
- Check for spaces or typos

### Cannot access `/admin` page

- Verify you're logged in (check browser sessionStorage)
- Open browser DevTools → Application → Session Storage
- Should see keys: `adminId`, `adminEmail`, `admin`

### Redirects to `/admin-login` immediately

- Session expired or not stored
- Try logging in again
- Check browser console for any JavaScript errors

## Browser DevTools Debugging

**Check Admin Session Storage:**

1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Session Storage"
4. Select "http://localhost:5173"
5. Look for:
   - `adminId` - Should contain admin ID number
   - `adminEmail` - Should contain admin email
   - `admin` - Should contain JSON object with admin details

**Check API Calls:**

1. Open DevTools Network tab
2. Try admin login
3. Look for `POST /api/admin/login` request
4. Check Response tab for returned data

## Next Steps

1. ✅ Create additional admin accounts via Postman if needed
2. ✅ Monitor doctor registrations in admin dashboard
3. ✅ Approve/reject doctors as they register
4. ✅ Test complete workflow (register → pending → approve → login)
5. ✅ Monitor error logs in Spring Boot console

## Common Workflows

### Creating Multiple Admins

```bash
# Admin 1
POST /api/admin/register
{ "fullname": "John Doe", "email": "john@admin.com", "password": "Pass@123" }

# Admin 2
POST /api/admin/register
{ "fullname": "Jane Smith", "email": "jane@admin.com", "password": "Pass@456" }

# Each admin can login independently with their own credentials
```

### Testing Approval Workflow

```bash
# 1. Register doctor → Status = PENDING
# 2. Admin login
# 3. View PENDING doctors
# 4. Click Approve
# 5. Doctor status = APPROVED
# 6. Doctor can now login
# 7. Doctor appears in public search
```

### Batch Operations (via Postman)

```bash
# Get all pending doctors
GET http://localhost:8080/api/admin/pending

# Loop through results and approve each
PUT http://localhost:8080/api/admin/{doctorid}/approve
```

## Performance Notes

- Admin table indexed on email (unique constraint)
- No N+1 queries (all doctor data loaded in single query)
- SessionStorage used (no server-side sessions needed)
- Password validation via BCrypt (computationally secure but fast)

## Security Reminders

- ✅ Passwords encrypted in database
- ✅ No passwords logged in console
- ✅ Session stored only in browser sessionStorage
- ✅ Protected routes require auth check
- ⚠️ Consider adding HTTPS in production
- ⚠️ Consider adding 2FA for admin accounts
- ⚠️ Consider admin role permissions for future
