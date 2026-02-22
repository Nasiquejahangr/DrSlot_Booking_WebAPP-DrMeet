import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TimeSlot() {

    const navigate = useNavigate();

    const handleBooking = () => {
        navigate("/payment", {
            state: {
                selectedDate,
                selectedTime
            }
        });
    };

    const dummySlots = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM"
    ];
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSlots(dummySlots); // temporary
    };




    const [selectedDate, setSelectedDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);


    const getNext7Days = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(new Date(date));
        }
        return days;
    };

    const next7Days = getNext7Days();



    return (
        <>
            <div>
                {next7Days.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`date-box ${selectedDate === day ? "active" : ""}`}
                    >
                        {day.toDateString()}
                    </div>
                ))}
            </div>
            {slots.map((slot, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedTime(slot)}
                    className={`slot-btn ${selectedTime === slot ? "active" : ""}`}
                >
                    {slot}
                </button>
            ))}
            <button
                disabled={!selectedTime}
                onClick={handleBooking}
            >
                Book Appointment
            </button>

        </>
    )
}

export default TimeSlot
