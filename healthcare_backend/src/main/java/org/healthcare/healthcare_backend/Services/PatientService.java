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


        PatientEntity existingPatient = patientRepo.findByEmail(patient.getEmail());
        if(existingPatient != null){
            throw new RuntimeException("Patient already registered!");
        }
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepo.save(patient);
    }



    //login patients
    public PatientEntity loginPatient(String email, String password) {

        PatientEntity patient = patientRepo.findByEmail(email);

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
        PatientEntity patient = patientRepo.findByEmail(email);
        if(patient == null){
            throw new RuntimeException("Patient not found!");
        }
        return patient;
    }


}

