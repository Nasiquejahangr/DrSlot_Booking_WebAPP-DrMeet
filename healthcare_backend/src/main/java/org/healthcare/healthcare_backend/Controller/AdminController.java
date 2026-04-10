package org.healthcare.healthcare_backend.Controller;

import org.healthcare.healthcare_backend.Entity.AdminEntity;
import org.healthcare.healthcare_backend.Services.AdminService;
import org.healthcare.healthcare_backend.Services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private DoctorService doctorService;

    /**
     * Admin Registration Endpoint
     * Creates a new admin account
     * @param body contains fullname, email, password
     */
    @PostMapping("/register")
    public ResponseEntity<?> adminRegistration(@RequestBody Map<String, String> body) {
        try {
            String fullname = body.get("fullname");
            String email = body.get("email");
            String password = body.get("password");

            if (fullname == null || fullname.isEmpty() || 
                email == null || email.isEmpty() || 
                password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            AdminEntity admin = adminService.registerAdmin(fullname, email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin registered successfully");
            response.put("id", admin.getId());
            response.put("email", admin.getEmail());
            response.put("fullname", admin.getFullname());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Admin Login Endpoint
     * Authenticates admin with email and password
     * @param body contains email, password
     */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            AdminEntity admin = adminService.loginAdmin(email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id", admin.getId());
            response.put("email", admin.getEmail());
            response.put("fullname", admin.getFullname());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Get all doctors (for admin approval page)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllDoctorsForAdmin() {
        try {
            return ResponseEntity.ok(doctorService.getAllDoctorsForAdmin());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Get all pending doctors
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingDoctors() {
        try {
            return ResponseEntity.ok(doctorService.getPendingDoctors());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Approve a doctor
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable Long id) {
        try {
            Object result = doctorService.approveDoctor(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doctor approved successfully");
            response.put("doctor", result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Reject a doctor
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable Long id) {
        try {
            Object result = doctorService.rejectDoctor(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doctor rejected successfully");
            response.put("doctor", result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
