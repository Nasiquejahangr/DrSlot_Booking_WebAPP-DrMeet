import { useParams } from "react-router-dom";
import DateSelector from '../../components/DateSelector';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import Feedback from '../../components/Feedback';
import { CiTimer } from "react-icons/ci";
import TimeSelector from "../../components/TimeSelector";
import { useState } from "react";

function ViewSlot() {
    const [selectedDate, setSelectedDate] = useState(null);

    // Get doctor ID from URL
    const { id } = useParams();

    // 2️ Get all doctors from localStorage
    const doctorsarr = JSON.parse(localStorage.getItem("doctors")) || [];

    // 3️ Find selected doctor by ID
    const selectedDoctor = doctorsarr.find(
        (doc) => doc.id === Number(id)
    );

    // 4️ Safety check
    if (!selectedDoctor) {
        return (
            <div className="p-10 text-center text-red-500 text-xl">
                Doctor Not Found
            </div>
        );
    }

    // Handle date selection
    const handleDateSelect = (dateInfo) => {
        console.log("Date selected:", dateInfo);
        setSelectedDate(dateInfo.fullDate);
        console.log("Selected date set to:", dateInfo.fullDate);
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







                {/* // Date Selector Component */}
                <DateSelector onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            </div>
            <div className="border-t border-gray-200"></div>

            {/* slot div - Only show when date is selected */}
            {console.log("Rendering check - selectedDate:", selectedDate)}
            {selectedDate && (
                <>
                    <div className="p-4">
                        <TimeSelector />
                    </div>
                </>
            )}

            <Feedback />

            <div className='flex justify-center '>
                <button className="mb-20 w-90 text-center bg-[#1a79f7] hover:bg-[#1563d1]
             text-white font-semibold py-4 px-5 rounded-lg
              transition-all shadow-md mt-4"
                    //show alert mess
                    onClick={() => alert("Appointment Booked Successfully!")}
                >Book Appointment</button>
            </div>

        </>
    );
}

export default ViewSlot;
