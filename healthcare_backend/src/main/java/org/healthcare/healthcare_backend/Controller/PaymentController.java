package org.healthcare.healthcare_backend.Controller;


import org.healthcare.healthcare_backend.Entity.PaymentOrderEntity;
import org.healthcare.healthcare_backend.Services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
     private PaymentService paymentService;

//    @PostMapping("/create-order")
//    public ResponseEntity<String> createOrder(@RequestBody PaymentOrderEntity paymentOrderEntity) {
//
//return null;
//
//    }

}
