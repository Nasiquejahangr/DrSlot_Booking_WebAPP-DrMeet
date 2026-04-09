package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.PaymentOrderEntity;
import org.healthcare.healthcare_backend.Services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
     private PaymentService paymentService;


    //creating order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderEntity order) {

               try
               {
                   Map<String, Object> serviceOrder = paymentService.createOrder(order);
                     return ResponseEntity.ok(serviceOrder);
               }
               catch (Exception e)
               {
                   return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body(Map.of("error", "Failed to create order: " + e.getMessage()));
               }

    }

    //verify payment and update order status
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String paymentId = payload.get("razorpay_payment_id");
            String orderId = payload.get("razorpay_order_id");
            String signature = payload.get("razorpay_signature");

            Map<String, Object> result = paymentService.verifyPaymentAndBook(paymentId, orderId, signature);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Payment verification failed: " + e.getMessage()));
        }
    }

    @GetMapping("/key")
    public ResponseEntity<?> getPublicKey() {
        return ResponseEntity.ok(Map.of("key", paymentService.getKeyId()));
    }


}
