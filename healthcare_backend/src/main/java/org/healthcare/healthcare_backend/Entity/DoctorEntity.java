package org.healthcare.healthcare_backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "doctors")
public class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String Role = "DOCTOR";

    @Column(name = "doctor_name")
    private String fullName;


    @Column(unique = true)
    private String email;

    private String phone;
    private String password;
    private String specialization;
    private String qualification;

    private Integer workingExperience;

    private String clinicLocation;
    private String hospitalName;
    private String medicalLicenseNumber;

    private Double fee;

    @Column(length = 1000)
    private String about;

    private String profileImage;
    private String certificate;

    @Column(columnDefinition = "TEXT")
    private String slots; // store JSON as string

}
