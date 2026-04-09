package org.healthcare.healthcare_backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender  mailSender;

    public void sendEmail(String toEmail,String name,double amount) {
        // Implement email sending logic using JavaMailSender
        // You can create a SimpleMailMessage and use mailSender.send() to send the email

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setFrom("healthcare@drmeet.com"); // always use proper email

        message.setSubject("✅ Payment Successful - Dr Meet");

        message.setText(
                "Dear " + name + ",\n\n" +

                        "🎉 Your payment has been successfully processed!\n\n" +

                        "📌 Details:\n" +
                        "• Payment Status: SUCCESS\n" +
                        "• Service: Doctor Appointment Booking\n\n" +

                        "🩺 Your appointment has been confirmed. " +
                        "You can check all details in your dashboard.\n\n" +

                        "🙏 Thank you for trusting Dr Meet for your healthcare needs.\n\n" +

                        "------------------------------\n" +
                        "Dr Meet - Smart Healthcare Platform\n" +
                        "💙 Stay Healthy, Stay Safe\n" +
                        "------------------------------"
        );

        mailSender.send(message);

    }
}
