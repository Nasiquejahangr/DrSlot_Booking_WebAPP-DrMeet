package org.healthcare.healthcare_backend.Services;

import org.healthcare.healthcare_backend.Entity.PatientEntity;
import org.healthcare.healthcare_backend.Repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private PatientRepo  patientRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public PatientEntity registerPatient(PatientEntity patient) {

        if (patient == null) {
            throw new RuntimeException("Invalid request body");
        }

        String email = patient.getEmail() == null ? null : patient.getEmail().trim().toLowerCase();
        String password = patient.getPassword();
        String fullname = patient.getFullname() == null ? null : patient.getFullname().trim();

        if (fullname == null || fullname.isBlank()) {
            throw new RuntimeException("Full name is required");
        }

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        PatientEntity existingPatient = patientRepo.findByEmail(email);
        if(existingPatient != null){
            throw new RuntimeException("Patient already registered!");
        }

        patient.setFullname(fullname);
        patient.setEmail(email);
        patient.setRole("PATIENT");
        patient.setPassword(passwordEncoder.encode(password));

        return patientRepo.save(patient);
    }



    //login patients
    public PatientEntity loginPatient(String email, String password) {

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new RuntimeException("Email and password are required");
        }

        String normalizedEmail = email.trim().toLowerCase();

        PatientEntity patient = patientRepo.findByEmail(normalizedEmail);

        if(patient == null){
            throw new RuntimeException("Patient not found!");
        }
       if(!passwordEncoder.matches(password, patient.getPassword())){
           throw new RuntimeException("Wrong password!");
       }
       return patient;
    }

    // Get patient by email for profile display
    public PatientEntity getPatientByEmail(String email) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        PatientEntity patient = patientRepo.findByEmail(normalizedEmail);
        if(patient == null){
            throw new RuntimeException("Patient not found!");
        }
        return patient;
    }


   
}

