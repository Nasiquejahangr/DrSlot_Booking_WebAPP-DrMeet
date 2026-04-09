package org.healthcare.healthcare_backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Getter
@Setter
@ToString(exclude = "slots")
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "doctors")
public class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role")
    private String role = "DOCTOR";

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

    @Column(name = "approval_status")
    private String approvalStatus = "PENDING";

    @Column(length = 1000)
    private String about;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;
    private String certificate;

    @Column(columnDefinition = "TEXT")
    private String slots; // store JSON as string (for backward compatibility)

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<SlotEntity> slotList; // New database-driven slots

    @PrePersist
    protected void onCreate() {
        if (role == null || role.isBlank()) {
            role = "DOCTOR";
        }
        if (approvalStatus == null || approvalStatus.isBlank()) {
            approvalStatus = "PENDING";
        }
    }
}

