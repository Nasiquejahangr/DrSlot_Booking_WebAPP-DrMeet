import React from 'react'
import { FaUserMd, FaBaby, FaBone, FaBrain, FaHeartbeat, FaEye, FaTooth, FaLungs, FaStethoscope } from "react-icons/fa";

const iconMap = {
    'Dermatology': { icon: FaUserMd, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Cardiology': { icon: FaHeartbeat, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
    'Neurology': { icon: FaBrain, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    'Pediatrics': { icon: FaBaby, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
    'Orthopedics': { icon: FaBone, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    'Ophthalmology': { icon: FaEye, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    'Dentistry': { icon: FaTooth, bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    'Pulmonology': { icon: FaLungs, bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
    'General': { icon: FaStethoscope, bgColor: 'bg-blue-100', iconColor: 'text-[#1a79f7]' },
};

function DoctorType(props) {
    const icon = iconMap[props.type] || iconMap['General'];
    const IconComponent = icon.icon;

    return (
        <>
            <div className='flex flex-col items-center bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] 
            cursor-pointer hover:-translate-y-2
             hover:border-[#00786f] hover:shadow-xl
              transition duration-300 p-4 font-bold
               text-gray-700 font-roboto'
                onClick={() => window.location.href = `/search?specialization=${props.type}`}
            >
                <div className={`${icon.bgColor}  mt-5 rounded-3xl w-15 h-15 flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-6 ${icon.iconColor}`} />
                </div>
                <p className='text-gray-700 font-medium text-sm text-center mt-4'>{props.type}</p>
            </div>
        </>
    )
}

export default DoctorType
