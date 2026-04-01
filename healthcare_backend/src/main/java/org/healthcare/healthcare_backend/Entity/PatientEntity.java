package org.healthcare.healthcare_backend.Entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
@Table(name = "patient")
public class PatientEntity {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String role = "PATIENT";

    @Column(name = "patient_name")
    private String fullname;

    @Column(unique = true)
    private String email;
    private String password;
    private String phoneNumber;
}
