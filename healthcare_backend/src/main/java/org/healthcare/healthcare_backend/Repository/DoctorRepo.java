package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepo  extends JpaRepository<DoctorEntity, Long> {


    DoctorEntity findByEmail(String email);

    List<DoctorEntity> findByApprovalStatus(String approvalStatus);

}
