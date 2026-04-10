package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<AdminEntity, Long> {

    AdminEntity findByEmail(String email);
}
