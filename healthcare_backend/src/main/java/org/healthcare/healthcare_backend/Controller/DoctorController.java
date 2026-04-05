package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.healthcare.healthcare_backend.Entity.LoginRequest;
import org.healthcare.healthcare_backend.Services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class DoctorController {

    @Autowired
    private DoctorService doctorService;


    //for Register
    @PostMapping("/register")
    public DoctorEntity registerDoctor(@RequestBody DoctorEntity doctor) {
        return doctorService.registerDoctor(doctor);
    }

    //for login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            DoctorEntity doctor = doctorService.loginDoctor(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }



//for Showing data in doctor dashboard or fetching doctor data by email
    @GetMapping("/get/{email}")
    public DoctorEntity getDoctor(@PathVariable String email) {
        
        return doctorService.getDoctorByEmail(email);
    }

    //for getting all doctors for search and home page
    @GetMapping("/all")
    public java.util.List<DoctorEntity> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // update doctor profile image
    @PutMapping("/profile-image")
    public ResponseEntity<?> updateDoctorProfileImage(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String profileImage = request.get("profileImage");

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email is required"));
            }

            if (profileImage == null || profileImage.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Profile image is required"));
            }

            DoctorEntity updatedDoctor = doctorService.updateDoctorProfileImage(email, profileImage);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}
