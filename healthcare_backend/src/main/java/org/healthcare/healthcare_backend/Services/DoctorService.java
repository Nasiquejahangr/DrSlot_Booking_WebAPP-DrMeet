package org.healthcare.healthcare_backend.Services;

import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.healthcare.healthcare_backend.Repository.DoctorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class DoctorService {


    @Autowired
    private DoctorRepo doctorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private SlotService slotService;

    public DoctorEntity registerDoctor(DoctorEntity doctor) {


        //  1. Check duplicate email
        DoctorEntity existingDoctor = doctorRepository.findByEmail(doctor.getEmail());
        if (existingDoctor != null) {
            throw new RuntimeException("Doctor already registered!");
        }

        //  2. Encrypt password
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

        //  2.1 Always enforce doctor role
        doctor.setRole("DOCTOR");

        //  3. Default slots
        if (doctor.getSlots() == null) {
            doctor.setSlots("{}");
        }

        //  4. Save to DB
        DoctorEntity savedDoctor = doctorRepository.save(doctor);

        //  5. Create 20 default slots for today
        slotService.createDefaultSlots(savedDoctor.getId(), LocalDate.now());

        return savedDoctor;
    }

    //For Login
    public DoctorEntity loginDoctor(String email, String password) {

        DoctorEntity doctor = doctorRepository.findByEmail(email);

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        }

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new RuntimeException("Invalid password");
        }


        return doctor; // login success
    }

    //getting doctor by email for data representation
    public DoctorEntity getDoctorByEmail(String email) {

        DoctorEntity doctor = doctorRepository.findByEmail(email);

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        }
        return doctorRepository.findByEmail(email);
    }

    //getting all doctors for search and home page
    public java.util.List<DoctorEntity> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // update doctor profile image
    public DoctorEntity updateDoctorProfileImage(String email, String profileImage) {
        DoctorEntity doctor = doctorRepository.findByEmail(email);

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        }

        doctor.setProfileImage(profileImage);
        return doctorRepository.save(doctor);
    }

}

