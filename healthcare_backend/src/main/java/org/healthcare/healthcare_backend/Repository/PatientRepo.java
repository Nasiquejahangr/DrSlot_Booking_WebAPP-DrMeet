package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepo extends JpaRepository<PatientEntity, Long> {

    PatientEntity findByEmail(String email);
    
}
