import React from 'react'
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function DoctorCard(props) {
    const navigate = useNavigate();
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow">
            {/* Doctor Info Section */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className='rounded-full w-20 h-20 flex items-center justify-center overflow-hidden bg-gray-100'>
                    <img
                        src={props.profileImage || 'https://via.placeholder.com/150'}
                        alt={props.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Doctor Details */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{props.name || 'Dr. Rajesh Kumar'}</h3>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <FaStar className="text-[#1a79f7] w-4 h-4" />
                            <span className="font-semibold text-gray-900">{props.rating || '4.5'}</span>
                        </div>
                    </div>

                    <p className="text-base text-gray-600 mb-1">{props.specialty || 'General Physician'}</p>
                    <p className="text-sm text-gray-500 mb-2">
                        {props.qualification || 'MBBS, MD'} • {props.experience || '12'} years exp.
                    </p>

                    <div className="flex items-center gap-1 text-gray-600">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span className="text-sm font-semibold">{props.location || 'India'}</span>
                        <p className='text-sm  mx-7 font-sans font-medium'>{props.hospitalName}</p>
                    </div>
                </div>
            </div>


            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Footer Section */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                    <p className="text-xl font-bold text-[#1a79f7]">₹{props.fee || '500'}</p>
                </div>
                <button
                    className="bg-[#1a79f7] hover:bg-[#1563d1] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    onClick={() => navigate(`/doctor/${props.id}`)}
                >
                    View Slots
                </button>
            </div>
        </div>
    )
}

export default DoctorCard
