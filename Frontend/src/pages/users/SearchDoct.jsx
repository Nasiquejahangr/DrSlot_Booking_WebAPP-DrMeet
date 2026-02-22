import React from 'react'
import DoctorCard from '../../components/DoctorCard'
import { IoIosArrowRoundBack } from "react-icons/io";

function SearchDoct() {

  //passing props from doctor registraction page from local storage and then displaying it in the doctor card component and then in the doctor profile page as well

  const doctorName = localStorage.getItem('doctorName') || 'Unknown Doctor';
  const doctorSpecialty = localStorage.getItem('doctorSpecialization') || 'General Physician';
  const doctorLocation = localStorage.getItem('doctorClinicLocation') || 'India';
  const doctorRating = localStorage.getItem('doctorRating') || '4.5';
  const doctorExperience = localStorage.getItem('doctorExperience') || '0 years';
  const doctorFee = localStorage.getItem('doctorFee') || '500';
  const doctorQualification = localStorage.getItem('doctorQualification') || 'MBBS, MD';
  const doctorProfileImage = localStorage.getItem('doctorProfileImage') || null;


  // Destructure doctor data for easier access
  const { name, specialty, location, rating, experience, fee, qualification, profileimage } = {
    name: doctorName,
    specialty: doctorSpecialty,
    location: doctorLocation,
    rating: doctorRating,
    experience: doctorExperience,
    fee: doctorFee,
    qualification: doctorQualification,
    profileimage: doctorProfileImage
  };



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
        <DoctorCard
          name={name}
          specialty={specialty}
          location={location}
          rating={rating}
          experience={experience}
          fee={fee}
          profileimage={profileimage}
          qualification={qualification} />
      </div>
    </>
  )
}

export default SearchDoct
