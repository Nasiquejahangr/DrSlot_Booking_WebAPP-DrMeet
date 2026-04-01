package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.healthcare.healthcare_backend.Entity.LoginRequest;
import org.healthcare.healthcare_backend.Services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public DoctorEntity login(@RequestBody LoginRequest request) {
        return doctorService.loginDoctor(request.getEmail(), request.getPassword());
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
}
