package org.healthcare.healthcare_backend.Services;

import org.healthcare.healthcare_backend.Entity.SlotEntity;
import org.healthcare.healthcare_backend.Entity.DoctorEntity;
import org.healthcare.healthcare_backend.Repository.SlotRepository;
import org.healthcare.healthcare_backend.Repository.DoctorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private DoctorRepo doctorRepository;

    /**
     * Create 20 default slots for a doctor
     * Called when doctor registers
     */
    public List<SlotEntity> createDefaultSlots(Long doctorId, LocalDate startDate) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));

        List<SlotEntity> slots = new ArrayList<>();
        String[] timings = {
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
            "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", 
            "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", 
            "07:00 PM", "07:30 PM"
        };

        // Create 20 slots for today's date
        for (String time : timings) {
            SlotEntity slot = new SlotEntity();
            slot.setDoctor(doctor);
            slot.setSlotDate(startDate);
            slot.setSlotTime(time);
            slot.setIsBooked(false);
            slot.setCreatedAt(LocalDateTime.now());
            slot.setUpdatedAt(LocalDateTime.now());
            slots.add(slot);
        }

        return slotRepository.saveAll(slots);
    }

    /**
     * Get all available slots for a doctor on a specific date
     */
    public List<SlotEntity> getAvailableSlots(Long doctorId, LocalDate date) {
        return slotRepository.findByDoctorIdAndSlotDateAndIsBookedFalse(doctorId, date);
    }

    /**
     * Get all slots for a doctor on a specific date (both booked and available)
     */
    public List<SlotEntity> getSlotsByDate(Long doctorId, LocalDate date) {
        return slotRepository.findByDoctorIdAndSlotDate(doctorId, date);
    }

    /**
     * Book a specific slot for a patient
     */
    public SlotEntity bookSlot(Long doctorId, LocalDate date, String time, Long userId) {
        SlotEntity slot = slotRepository.findByDoctorIdAndSlotDateAndSlotTime(doctorId, date, time)
            .orElseGet(() -> {
                DoctorEntity doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));

                SlotEntity newSlot = new SlotEntity();
                newSlot.setDoctor(doctor);
                newSlot.setSlotDate(date);
                newSlot.setSlotTime(time);
                newSlot.setIsBooked(false);
                newSlot.setCreatedAt(LocalDateTime.now());
                newSlot.setUpdatedAt(LocalDateTime.now());
                return newSlot;
            });

        if (slot.getIsBooked()) {
            throw new RuntimeException("Slot is already booked");
        }

        slot.setIsBooked(true);
        slot.setBookedByUserId(userId);
        slot.setUpdatedAt(LocalDateTime.now());

        return slotRepository.save(slot);
    }

    /**
     * Cancel a booked slot
     */
    public SlotEntity cancelSlot(Long slotId) {
        SlotEntity slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setIsBooked(false);
        slot.setBookedByUserId(null);
        slot.setUpdatedAt(LocalDateTime.now());

        return slotRepository.save(slot);
    }

    /**
     * Get all available slots for a doctor within a date range
     */
    public List<SlotEntity> getAvailableSlotsInRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return slotRepository.findAvailableSlotsByDoctorAndDateRange(doctorId, startDate, endDate);
    }

    /**
     * Get all booked appointments for a patient
     */
    public List<SlotEntity> getPatientAppointments(Long userId) {
        return slotRepository.findBookedAppointmentsWithDoctorByUserId(userId);
    }

    /**
     * Get all booked appointments for a doctor
     */
    public List<SlotEntity> getDoctorAppointments(Long doctorId) {
        return slotRepository.findBookedAppointmentsByDoctorId(doctorId);
    }

    /**
     * Initialize slots for a new date (copy from a template date or create default)
     */
    public List<SlotEntity> initializeSlotsForDate(Long doctorId, LocalDate newDate) {
        // Check if slots already exist for this date
        List<SlotEntity> existingSlots = getSlotsByDate(doctorId, newDate);
        if (!existingSlots.isEmpty()) {
            return existingSlots;
        }

        // Create default slots for the new date
        return createDefaultSlots(doctorId, newDate);
    }
}
