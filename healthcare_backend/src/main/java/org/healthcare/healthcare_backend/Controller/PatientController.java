package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.PatientEntity;
import org.healthcare.healthcare_backend.Services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public PatientEntity loginPatient(@RequestBody PatientEntity request) {

        return patientService.loginPatient(request.getEmail(), request.getPassword());
    }

    @GetMapping("/get/{email}")
    public PatientEntity getPatient(@PathVariable String email) {
        return patientService.getPatientByEmail(email);
    }
}
