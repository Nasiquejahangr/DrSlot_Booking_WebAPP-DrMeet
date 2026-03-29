import React, { useState } from 'react'
import { CiTimer } from "react-icons/ci";

function TimeSelector() {
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Dummy time slots array
    const slot = [
        { time: "09:00 AM", isBooked: false },
        { time: "09:30 AM", isBooked: false },
        { time: "10:00 AM", isBooked: false },
        { time: "10:30 AM", isBooked: false },
        { time: "11:00 AM", isBooked: false },
        { time: "11:30 AM", isBooked: false },
        { time: "12:00 PM", isBooked: false },
        { time: "12:30 PM", isBooked: false },
        { time: "02:00 PM", isBooked: false },
        { time: "02:30 PM", isBooked: false },
        { time: "03:00 PM", isBooked: false },
        { time: "03:30 PM", isBooked: false },
        { time: "04:00 PM", isBooked: false },
        { time: "04:30 PM", isBooked: false },
        { time: "05:00 PM", isBooked: false },
        { time: "05:30 PM", isBooked: false },
        { time: "06:00 PM", isBooked: false },
        { time: "06:30 PM", isBooked: false },
        { time: "07:00 PM", isBooked: false },
        { time: "07:30 PM", isBooked: true }, // Booked slot
    ];

    const handleSlotClick = (time) => {
        setSelectedSlot(time);
    };

    return (
        <>
            <div>
                <div className="flex items-center justify-start p-5 gap-2 ">
                    <div>
                        <CiTimer size={"24"} />
                    </div>
                    <div>
                        <p className="text-base font-roboto font-semibold text-gray-800">Available Time Slots</p>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>

                {/* Time Slots Grid */}
                <div className="p-4 grid grid-cols-3 gap-3">
                    {slot.map((slot, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlotClick(slot.time)}
                            disabled={slot.isBooked}
                            className={`
                            py-4 px-2 rounded-lg font-semibold text-sm transition-all
                            ${slot.isBooked
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : selectedSlot === slot.time
                                        ? 'bg-[#1a79f7] text-white shadow-md '
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1a79f7] hover:text-[#1a79f7]'
                                }
                        `}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>
            </div>

        </>
    )
}

export default TimeSelector
