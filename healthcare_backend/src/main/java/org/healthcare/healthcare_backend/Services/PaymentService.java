package org.healthcare.healthcare_backend.Services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.healthcare.healthcare_backend.Entity.PaymentOrderEntity;
import org.healthcare.healthcare_backend.Repository.PaymentOrderRepo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {


    @Value("${razorpay.key_id}")
    private String KeyId;

    @Value("${razorpay.key_secret}")
    private String KeySecret;


    @Autowired
    private PaymentOrderRepo paymentOrderRepo;

    @Autowired
    private SlotService slotService;


    @Autowired
    EmailService emailService;

  public Map<String, Object> createOrder(PaymentOrderEntity orderDetails) throws RazorpayException

   {
       //for Razorpay implementation we need this  and our backend is fronted for Razorpay
       RazorpayClient client = new RazorpayClient(getKeyId(), getKeySecret());


       //for giving data to restAPI of Razor pay

       // this is the formate of Razor pay this is request
       JSONObject orderRequest = new JSONObject();
       orderRequest.put("amount", orderDetails.getAmount()*100); // Razorpay works with paise
       orderRequest.put("currency", "INR");
       orderRequest.put("receipt", "txn"+ UUID.randomUUID());


       //Semding This order to Razorpay after hitting razor pay they will give id
       Order razorpayOrder= client.orders.create(orderRequest);
       System.out.println(razorpayOrder.toString());

       //rozar pay giving data in jsn formate
       orderDetails.setOrderId(razorpayOrder.get("id"));

       orderDetails.setStatus("CREATED");
       orderDetails.setCreatedAt(LocalDateTime.now());
         orderDetails.setUpdatedAt(LocalDateTime.now());

       //pushing detial into db
         PaymentOrderEntity savedOrder = paymentOrderRepo.save(orderDetails);

         Map<String, Object> response = new HashMap<>();
         response.put("orderId", savedOrder.getOrderId());
         response.put("amount", Math.round(savedOrder.getAmount() * 100));
         response.put("currency", "INR");
         response.put("key", getKeyId());
         response.put("name", savedOrder.getName());
         response.put("email", savedOrder.getEmail());
         response.put("phoneNumber", savedOrder.getPhoneNumber());
         response.put("doctorId", savedOrder.getDoctorId());
         response.put("doctorName", savedOrder.getDoctorName());
         response.put("appointmentDate", savedOrder.getAppointmentDate());
         response.put("appointmentTime", savedOrder.getAppointmentTime());
         response.put("status", savedOrder.getStatus());

         return response;
   }

      public Map<String, Object> verifyPaymentAndBook(String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        PaymentOrderEntity order = paymentOrderRepo.findByOrderId(razorpayOrderId);

        if (order == null) {
          throw new RuntimeException("Order not found");
        }

        if (!isValidSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
          order.setStatus("FAILED");
          order.setUpdatedAt(LocalDateTime.now());
          paymentOrderRepo.save(order);
          throw new RuntimeException("Invalid payment signature");
        }

        order.setPaymentId(razorpayPaymentId);
        order.setRazorpaySignature(razorpaySignature);
        order.setStatus("SUCCESS");
        order.setUpdatedAt(LocalDateTime.now());
        paymentOrderRepo.save(order);

        LocalDate appointmentDate = order.getAppointmentDate();
        if (appointmentDate != null && order.getDoctorId() != null && order.getUserId() != null && order.getAppointmentTime() != null) {
          slotService.bookSlot(order.getDoctorId(), appointmentDate, order.getAppointmentTime(), order.getUserId());
        }

        emailService.sendEmail(order.getEmail(),order.getName(),order.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("orderId", order.getOrderId());
        response.put("paymentId", order.getPaymentId());
        response.put("doctorId", order.getDoctorId());
        response.put("userId", order.getUserId());
        response.put("appointmentDate", order.getAppointmentDate());
        response.put("appointmentTime", order.getAppointmentTime());
        return response;
    }

      public String getKeyId() {
        return KeyId == null ? "" : KeyId.trim();
      }

      private String getKeySecret() {
        return KeySecret == null ? "" : KeySecret.trim();
      }

      private boolean isValidSignature(String orderId, String paymentId, String signature) {
        try {
          String payload = orderId + "|" + paymentId;
          Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
          SecretKeySpec secretKey = new SecretKeySpec(getKeySecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
          sha256_HMAC.init(secretKey);
          byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));

          StringBuilder generatedSignature = new StringBuilder();
          for (byte b : hash) {
            generatedSignature.append(String.format("%02x", b));
          }

          return generatedSignature.toString().equals(signature);
        } catch (Exception e) {
          return false;
        }
      }
}
