package org.healthcare.healthcare_backend.Entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Table(name = "patient")
public class PatientEntity {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role")
    private String role = "PATIENT";

    @Column(name = "patient_name")
    private String fullname;

    @Column(unique = true)
    private String email;
    private String password;
    private String phoneNumber;

    @PrePersist
    protected void onCreate() {
        if (role == null || role.isBlank()) {
            role = "PATIENT";
        }
    }
}
