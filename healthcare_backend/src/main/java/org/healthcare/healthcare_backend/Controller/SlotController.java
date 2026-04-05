package org.healthcare.healthcare_backend.Controller;

import org.healthcare.healthcare_backend.Entity.SlotEntity;
import org.healthcare.healthcare_backend.Services.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    @Autowired
    private SlotService slotService;

    /**
     * Get all available slots for a doctor on a specific date
     */
    @GetMapping("/available/{doctorId}")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam String date) {
        try {
            LocalDate slotDate = LocalDate.parse(date);
            List<SlotEntity> slots = slotService.getAvailableSlots(doctorId, slotDate);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch available slots: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all slots (booked and available) for a doctor on a specific date
     */
    @GetMapping("/{doctorId}")
    public ResponseEntity<?> getSlotsByDate(
            @PathVariable Long doctorId,
            @RequestParam String date) {
        try {
            LocalDate slotDate = LocalDate.parse(date);
            List<SlotEntity> slots = slotService.getSlotsByDate(doctorId, slotDate);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch slots: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get available slots for a doctor within a date range
     */
    @GetMapping("/range/{doctorId}")
    public ResponseEntity<?> getAvailableSlotsInRange(
            @PathVariable Long doctorId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            List<SlotEntity> slots = slotService.getAvailableSlotsInRange(doctorId, start, end);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch slots in range: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Book a slot for a patient
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookSlot(
            @RequestParam Long doctorId,
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam Long userId) {
        try {
            LocalDate slotDate = LocalDate.parse(date);
            SlotEntity bookedSlot = slotService.bookSlot(doctorId, slotDate, time, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Slot booked successfully");
            response.put("slot", bookedSlot);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to book slot: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Cancel a booked slot
     */
    @PutMapping("/cancel/{slotId}")
    public ResponseEntity<?> cancelSlot(@PathVariable Long slotId) {
        try {
            SlotEntity cancelledSlot = slotService.cancelSlot(slotId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Slot cancelled successfully");
            response.put("slot", cancelledSlot);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel slot: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Initialize slots for a new date
     */
    @PostMapping("/initialize/{doctorId}")
    public ResponseEntity<?> initializeSlotsForDate(
            @PathVariable Long doctorId,
            @RequestParam String date) {
        try {
            LocalDate newDate = LocalDate.parse(date);
            List<SlotEntity> slots = slotService.initializeSlotsForDate(doctorId, newDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Slots initialized for date: " + date);
            response.put("slots", slots);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to initialize slots: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all appointments booked by a patient
     */
    @GetMapping("/patient/{userId}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long userId) {
        try {
            List<SlotEntity> appointments = slotService.getPatientAppointments(userId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch patient appointments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
