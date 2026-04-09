package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.PaymentOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentOrderRepo extends JpaRepository<PaymentOrderEntity, Long> {

     PaymentOrderEntity findByOrderId(String orderId);
}
