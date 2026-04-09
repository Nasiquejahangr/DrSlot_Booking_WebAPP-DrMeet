package org.healthcare.healthcare_backend.Services;

import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.healthcare.healthcare_backend.Repository.DoctorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class DoctorService {


    @Autowired
    private DoctorRepo doctorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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

        //  2.2 New doctors must be approved by admin before login/search visibility
        doctor.setApprovalStatus("PENDING");

        //  3. Default slots
        if (doctor.getSlots() == null) {
            doctor.setSlots("{}");
        }

        //  4. Save to DB
        return doctorRepository.save(doctor);
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

        if (doctor.getApprovalStatus() == null || "PENDING".equalsIgnoreCase(doctor.getApprovalStatus())) {
            throw new RuntimeException("Your doctor profile is pending admin approval");
        }

        if ("REJECTED".equalsIgnoreCase(doctor.getApprovalStatus())) {
            throw new RuntimeException("Your doctor profile has been rejected by admin");
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
        return doctorRepository.findAll()
                .stream()
                .filter(doctor -> doctor.getApprovalStatus() == null || "APPROVED".equalsIgnoreCase(doctor.getApprovalStatus()))
                .collect(Collectors.toList());
    }

    public java.util.List<DoctorEntity> getAllDoctorsForAdmin() {
        return doctorRepository.findAll();
    }

    public java.util.List<DoctorEntity> getPendingDoctors() {
        return doctorRepository.findByApprovalStatus("PENDING");
    }

    public DoctorEntity approveDoctor(Long doctorId) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setApprovalStatus("APPROVED");
        return doctorRepository.save(doctor);
    }

    public DoctorEntity rejectDoctor(Long doctorId) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setApprovalStatus("REJECTED");
        return doctorRepository.save(doctor);
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

