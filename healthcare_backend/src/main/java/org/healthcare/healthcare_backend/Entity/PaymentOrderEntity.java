package org.healthcare.healthcare_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="payment_order")
public class PaymentOrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private double amount;

    private Long userId;

    private Long doctorId;

    private String doctorName;

    private LocalDate appointmentDate;

    private String appointmentTime;

    private String orderId; // come from Razorpay

    private String paymentId; //come from Razor pay

    private String razorpaySignature;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


}

