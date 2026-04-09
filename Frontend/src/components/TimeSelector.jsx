import { useState, useEffect } from 'react'
import { CiTimer } from "react-icons/ci";
import { DEFAULT_SLOTS, getDoctorSlots } from '../util/Localstorage';
import { getDoctorSlotsFromDb } from '../api/userApi';

function TimeSelector({ doctorId, selectedDate, onSlotSelect }) {
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const loadSlots = async () => {
        if (!doctorId || !selectedDate) return;

        try {
            const dbSlots = await getDoctorSlotsFromDb(doctorId, selectedDate);
            const mergedSlots = DEFAULT_SLOTS.map((defaultSlot) => {
                const bookedSlot = dbSlots.find((slot) => slot.time === defaultSlot.time);
                return bookedSlot ? { ...defaultSlot, ...bookedSlot } : defaultSlot;
            });
            setSlots(mergedSlots);
            return;
        } catch {
            // Fallback to localStorage when backend is unavailable
        }

        setSlots(getDoctorSlots(doctorId, selectedDate));
    };

    useEffect(() => {
        loadSlots();
        setSelectedTime(null);
    }, [doctorId, selectedDate]);

    // Re-read when tab becomes visible again (same-tab navigation) or cross-tab storage change
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") loadSlots();
        };
        const handleStorageChange = (e) => {
            if (e.key === "doctors") loadSlots();
        };
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("storage", handleStorageChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [doctorId, selectedDate]);

    if (!doctorId || !selectedDate) return null;

    const handleSlotClick = (time) => {
        setSelectedTime(time);
        onSlotSelect(time);
    };

    return (
        <div>
            <div className="flex items-center justify-start p-5 gap-2">
                <CiTimer size={"24"} />
                <p className="text-base font-roboto font-semibold text-gray-800">Available Time Slots</p>
            </div>
            <div className="border-t border-gray-200"></div>

            <div className="p-4 grid grid-cols-3 gap-3">
                {slots.map((slot, index) => (
                    <button
                        key={index}
                        onClick={() => !slot.isBooked && handleSlotClick(slot.time)}
                        disabled={slot.isBooked}
                        className={`
                            py-4 px-2 rounded-lg font-semibold text-sm transition-all
                            ${slot.isBooked
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : selectedTime === slot.time
                                    ? 'bg-[#1a79f7] text-white shadow-md'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1a79f7] hover:text-[#1a79f7]'
                            }
                        `}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TimeSelector
