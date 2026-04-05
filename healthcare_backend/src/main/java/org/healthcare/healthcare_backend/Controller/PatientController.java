package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.LoginRequest;
import org.healthcare.healthcare_backend.Entity.PatientEntity;
import org.healthcare.healthcare_backend.Services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin("*")
public class PatientController {

    @Autowired
    private PatientService patientService;


    @PostMapping("/register")
    public PatientEntity registerPatient(@RequestBody PatientEntity patient) {
        System.out.println(patient);
        return patientService.registerPatient(patient);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginPatient(@RequestBody LoginRequest request) {
        try {
            PatientEntity patient = patientService.loginPatient(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(patient);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/get/{email}")
    public PatientEntity getPatient(@PathVariable String email) {
        return patientService.getPatientByEmail(email);
    }

}
