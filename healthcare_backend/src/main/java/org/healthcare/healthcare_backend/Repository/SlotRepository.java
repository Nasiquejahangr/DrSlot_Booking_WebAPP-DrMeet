package org.healthcare.healthcare_backend.Repository;

import org.healthcare.healthcare_backend.Entity.SlotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<SlotEntity, Long> {

    /**
     * Find all slots for a doctor on a specific date
     */
    List<SlotEntity> findByDoctorIdAndSlotDate(Long doctorId, LocalDate slotDate);

    /**
     * Find all available (non-booked) slots for a doctor on a specific date
     */
    List<SlotEntity> findByDoctorIdAndSlotDateAndIsBookedFalse(Long doctorId, LocalDate slotDate);

    /**
     * Find a specific slot by doctor, date, and time
     */
    Optional<SlotEntity> findByDoctorIdAndSlotDateAndSlotTime(Long doctorId, LocalDate slotDate, String slotTime);

    /**
     * Find all slots for a doctor between two dates
     */
    @Query("SELECT s FROM SlotEntity s WHERE s.doctor.id = :doctorId AND s.slotDate BETWEEN :startDate AND :endDate ORDER BY s.slotDate, s.slotTime")
    List<SlotEntity> findSlotsByDoctorAndDateRange(@Param("doctorId") Long doctorId, 
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    /**
     * Find all available slots for a doctor between two dates
     */
    @Query("SELECT s FROM SlotEntity s WHERE s.doctor.id = :doctorId AND s.slotDate BETWEEN :startDate AND :endDate AND s.isBooked = false ORDER BY s.slotDate, s.slotTime")
    List<SlotEntity> findAvailableSlotsByDoctorAndDateRange(@Param("doctorId") Long doctorId,
                                                            @Param("startDate") LocalDate startDate,
                                                            @Param("endDate") LocalDate endDate);

    /**
     * Find all slots booked by a patient
     */
    List<SlotEntity> findByBookedByUserIdAndIsBookedTrue(Long userId);

    /**
     * Delete all slots for a doctor on a specific date
     */
    void deleteByDoctorIdAndSlotDate(Long doctorId, LocalDate slotDate);
}
