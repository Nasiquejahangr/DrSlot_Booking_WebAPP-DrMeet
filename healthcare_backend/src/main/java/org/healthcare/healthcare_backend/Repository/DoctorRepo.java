package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepo  extends JpaRepository<DoctorEntity, Long> {


    DoctorEntity findByEmail(String email);

}
