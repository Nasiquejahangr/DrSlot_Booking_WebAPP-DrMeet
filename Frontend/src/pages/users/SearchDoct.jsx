import React from 'react'
import DoctorCard from '../../components/DoctorCard'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from 'react';

function SearchDoct() {

  //passing props from doctor registraction page from local storage and then displaying it in the doctor card component and then in the doctor profile page as well
  //create array of doctor data and then pass it to the doctor card component and then display it in the doctor profile page as well

  const [doctors, setDoctors] = useState([]);

  React.useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem("doctors")) || [];

    // Map stored doctors to match your DoctorCard props
    const formattedDoctors = storedDoctors.map((doc) => ({
      name: doc.fullName,
      specialty: doc.specialization,
      location: doc.clinicLocation,
      rating: doc.rating || "4.5",
      experience: doc.workingExperience,
      fee: doc.fee || "500",
      qualification: doc.qualification,
      profileImage: doc.profileImage || null,
      hospitalName: doc.hospitalName || null

    }));

    setDoctors(formattedDoctors);
  }, []);
  // For demonstration, we can create an array of doctors with the same data

  return (
    <>
      {/* // back button */}
      <div className='p-6  cursor-pointer border-b border-gray-300 fixed w-full bg-white z-10'>
        <IoIosArrowRoundBack className='text-3xl text-gray-700 cursor-pointer' />
      </div>
      <div className='p-6 cursor-pointer '>
        <div className=' mt-15 w-[98%] h-5 border border-gray-300 flex items-center rounded-2xl mx-auto px-4 py-8 bg-white shadow-[0_0_30px_rgba(0,0,0,0.15)]'>
          <input className=" w-full h-full text-black px-4 py-2 focus:outline-none"
            type="text" placeholder="Search for doctors..." />
          <button className='bg-[#1a79f7] text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-[#1563d1] transition-colors'>Search</button>
        </div>
      </div>

      <div className=" p-3 mb-20 gap-5 flex flex-col w-[98%] mx-auto">
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={index}
            name={doctor.name}
            specialty={doctor.specialty}
            location={doctor.location}
            rating={doctor.rating}
            experience={doctor.experience}
            fee={doctor.fee}
            profileImage={doctor.profileImage}
            qualification={doctor.qualification}
            hospitalName={`Hospital- ${doctor.hospitalName}`} />
        ))}
      </div>
    </>
  )
}
export default SearchDoct
