import { useParams } from "react-router-dom";
import DateSelector from '../../components/DateSelector';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import Feedback from '../../components/Feedback';
import TimeSelector from "../../components/TimeSelector";
import { useState, useEffect } from "react";
import { getDoctorSlots, saveDoctorSlots, saveAppointment } from "../../util/Localstorage";

function ViewSlot() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    // Bump refreshKey when user navigates back to this page so TimeSelector re-reads localStorage
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                setRefreshKey((prev) => prev + 1);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    // Get doctor ID from URL
    const { id } = useParams();

    // Get all doctors from localStorage
    const doctorsarr = JSON.parse(localStorage.getItem("doctors")) || [];

    // Find selected doctor by ID
    const selectedDoctor = doctorsarr.find(
        (doc) => doc.id === Number(id)
    );

    // Safety check
    if (!selectedDoctor) {
        return (
            <div className="p-10 text-center text-red-500 text-xl">
                Doctor Not Found
            </div>
        );
    }

    // Handle date selection
    const handleDateSelect = (dateInfo) => {
        setSelectedDate(dateInfo.fullDate);
        setSelectedSlot(null);
        setBookingError("");
        setBookingSuccess("");
    };

    const handleBookAppointment = () => {
        setBookingError("");
        setBookingSuccess("");

        if (!selectedSlot) {
            setBookingError("Please select a time slot before booking.");
            return;
        }

        const currentSlots = getDoctorSlots(Number(id), selectedDate);
        const slotIndex = currentSlots.findIndex((s) => s.time === selectedSlot);

        if (slotIndex === -1) {
            setBookingError("Selected slot not found. Please try again.");
            return;
        }

        if (currentSlots[slotIndex].isBooked) {
            setBookingError("This slot has already been booked. Please select another.");
            return;
        }

        const updatedSlots = currentSlots.map((s) =>
            s.time === selectedSlot ? { ...s, isBooked: true } : s
        );

        saveDoctorSlots(Number(id), selectedDate, updatedSlots);

        // Save appointment record for the user
        const currentUserId = Number(sessionStorage.getItem("currentUserId") || localStorage.getItem("currentUserId"));
        saveAppointment({
            userId: currentUserId,
            doctorId: Number(id),
            doctorName: selectedDoctor.fullName,
            specialization: selectedDoctor.specialization,
            qualification: selectedDoctor.qualification,
            date: selectedDate,
            time: selectedSlot,
            fee: selectedDoctor.fee || 500,
            profileImage: selectedDoctor.profileImage,
            clinicLocation: selectedDoctor.clinicLocation,
        });

        setSelectedSlot(null);
        setBookingSuccess("Appointment booked successfully!");
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            {/* Doctor Profile Card */}
            <div className=" p-3 border border-round-2xl bg-white shadow-sm border-b border-gray-200">
                {/* Top Section with Image, Name and Rating */}

                <div className='mb-0 p-4 rounded-lg w-full h-70 shadow-md'>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                            {/* Profile Image */}
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                <img
                                    src={selectedDoctor.profileImage}
                                    alt={selectedDoctor.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Doctor Info */}
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 mb-2">
                                    {selectedDoctor.fullName}
                                </h1>
                                <p className="text-sm text-gray-700 mb-1">
                                    {selectedDoctor.specialization}
                                </p>
                                <p className="text-gray-600">
                                    {selectedDoctor.qualification} • {selectedDoctor.workingExperience} years exp.
                                </p>
                            </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="flex items-center gap-2 bg-green-50 px-2 py-2 rounded-lg">
                            <FaStar className="text-green-600 text-sm" />
                            <span className="text-sm font-bold text-gray-900">{selectedDoctor.rating}</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-gray-700">
                        <FaMapMarkerAlt className="mt-1 text-gray-500" />
                        <div>
                            <p className="font-semibold">{selectedDoctor.hospitalName}</p>
                            <p className="text-sm text-gray-600">{selectedDoctor.clinicLocation}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-3"></div>

                    {/* Consultation Fee and Reviews */}
                    <div className="text-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                            <p className="text-2xl font-extrabold text-[#1a79f7]">₹{selectedDoctor.fee || 500}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                {/* Date Selector Component */}
                <DateSelector onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            </div>
            <div className="border-t border-gray-200"></div>

            {/* Slot section - Only show when date is selected */}
            {selectedDate && (
                <>
                    <div className="p-4">
                        <TimeSelector
                            key={refreshKey}
                            doctorId={Number(id)}
                            selectedDate={selectedDate}
                            onSlotSelect={setSelectedSlot}
                        />
                    </div>
                </>
            )}

            <Feedback />

            <div className='flex flex-col items-center'>
                {bookingError && (
                    <p className="mb-2 text-red-500 text-sm text-center">{bookingError}</p>
                )}
                {bookingSuccess && (
                    <p className="mb-2 text-green-600 text-sm text-center">{bookingSuccess}</p>
                )}
                <button
                    className="mb-20 w-90 text-center bg-[#1a79f7] hover:bg-[#1563d1]
                     text-white font-semibold py-4 px-5 rounded-lg
                     transition-all shadow-md mt-4"
                    onClick={handleBookAppointment}
                >Book Appointment</button>
            </div>
        </>
    );
}

export default ViewSlot;
