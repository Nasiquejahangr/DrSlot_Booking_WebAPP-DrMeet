import { useState } from "react";

function ManageSlots() {

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const handleAddSlot = () => {

        if (!selectedDate || !selectedTime) {
            alert("Please select date and time");
            return;
        }

        // 1️⃣ Get doctors from localStorage
        const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

        // 2️⃣ Get current doctor id
        const currentDoctorId = Number(localStorage.getItem("currentDoctorId"));

        // 3️⃣ Find doctor index
        const doctorIndex = doctors.findIndex(
            doc => doc.id === currentDoctorId
        );

        if (doctorIndex === -1) {
            alert("Doctor not found");
            return;
        }

        // 4️⃣ Ensure slots object exists
        if (!doctors[doctorIndex].slots) {
            doctors[doctorIndex].slots = {};
        }

        // 5️⃣ If date doesn't exist → create empty array
        if (!doctors[doctorIndex].slots[selectedDate]) {
            doctors[doctorIndex].slots[selectedDate] = [];
        }

        // 6️⃣ Prevent duplicate slot
        const slotExists = doctors[doctorIndex].slots[selectedDate].some(
            slot => slot.time === selectedTime
        );

        if (slotExists) {
            alert("Slot already exists for this time");
            return;
        }

        // 7️⃣ Push new slot
        doctors[doctorIndex].slots[selectedDate].push({
            time: selectedTime,
            isBooked: false
        });

        // 8️⃣ Save back to localStorage
        localStorage.setItem("doctors", JSON.stringify(doctors));

        alert("Slot added successfully");

        // Clear fields
        setSelectedDate("");
        setSelectedTime("");
    };
    return (
        <>
            <div className="p-6">

                <h2 className="text-2xl font-bold mb-4">Manage Slots</h2>

                <div className="bg-white p-4 rounded shadow w-96">

                    <div className="mb-3">
                        <label className="block mb-1">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1">Select Time</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <button
                        onClick={handleAddSlot}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Add Slot
                    </button>

                </div>

            </div>
        </>
    )
}

export default ManageSlots
