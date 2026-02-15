import React from 'react'
import DoctorCard from '../../components/DoctorCard'


function SearchDoct() {

  return (
    <>
      {/* this is parent div */}
      <div className='mt-20  '>
        <div className=' w-[98%] h-15 border border-gray-300 flex items-center rounded-2xl mx-auto px-4 py-8 gap-4'>
          <input className=" w-full h-full text-black px-4 py-2 focus:outline-none"
            type="text" placeholder="Search for doctors..." />
          <button className='bg-[#1a79f7] text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-[#1563d1] transition-colors'>Search</button>
        </div>
      </div>

      <div className="mt-5 p-3 mb-20 gap-6 flex flex-col w-[98%] mx-auto">
        <DoctorCard name="Md Nasique"
          specialty="Cardiologist"
          location="Koramangala, Bangalore"
          rating="4.8"
          experience="12 years"
          fee="500" />
        <DoctorCard name="Dr. Priya Sharma"
          specialty="Dermatologist"
          location="MG Road, Bangalore"
          rating="4.6"
          experience="8 years"
          fee="400" />
        <DoctorCard name="Dr. Arjun Verma"
          specialty="Pediatrician"
          location="Indiranagar, Bangalore"
          rating="4.9"
          experience="15 years"
          fee="600" />
        <DoctorCard name="Dr. Anjali Mehta"
          specialty="Orthopedic"
          location="Whitefield, Bangalore"
          rating="4.7"
          experience="10 years"
          fee="550" />
        <DoctorCard name="Dr. Rakesh Gupta"
          specialty="Neurologist"
          location="Jayanagar, Bangalore"
          rating="4.5"
          experience="9 years"
          fee="450" />
        <DoctorCard name="Dr. Suman Rao"
          specialty="General Physician"
          location="HSR Layout, Bangalore"
          rating="4.8"
          experience="11 years"
          fee="500" />
        <DoctorCard name="Dr. Kavita Singh"
          specialty="Ophthalmologist"
          location="Electronic City, Bangalore"
          rating="4.6"
          experience="7 years"
          fee="400" />
        <DoctorCard name="Dr. Vikram Desai"
          specialty="Pulmonologist"
          location="Bannerghatta Road, Bangalore"
          rating="4.7"
          experience="13 years"
          fee="550" />
        <DoctorCard name="Dr. Neha Kapoor"
          specialty="Dentist"
          location="Koramangala, Bangalore"
          rating="4.9"
          experience="14 years"
          fee="600" />
        <DoctorCard name="Dr. Rahul Mehta"
          specialty="Cardiologist"
          location="MG Road, Bangalore"
          rating="4.8"
          experience="12 years"
          fee="500" />
        <DoctorCard name="Dr. Ananya Singh"
          specialty="Dermatologist"
          location="Indiranagar, Bangalore"
          rating="4.6"
          experience="8 years"
          fee="400" />
        <DoctorCard name="Dr. Arjun Verma"
          specialty="Pediatrician"
          location="Whitefield, Bangalore"
          rating="4.9"
          experience="15 years"
          fee="600" />
        <DoctorCard name="Dr. Anjali Mehta"
          specialty="Orthopedic"
          location="Jayanagar, Bangalore"
          rating="4.7"
          experience="10 years"
          fee="550" />
        <DoctorCard name="Dr. Rakesh Gupta"
          specialty="Neurologist"
          location="HSR Layout, Bangalore"
          rating="4.5"
          experience="9 years"
          fee="450" />
        <DoctorCard name="Dr. Suman Rao"
          specialty="General Physician"
          location="Electronic City, Bangalore"
          rating="4.8"
          experience="11 years"
          fee="500" />
        <DoctorCard name="Dr. Kavita Singh"
          specialty="Ophthalmologist"
          location="Bannerghatta Road, Bangalore"
          rating="4.6"
          experience="7 years"
          fee="400" />
        <DoctorCard name="Dr. Vikram Desai"
          specialty="Pulmonologist"
          location="Koramangala, Bangalore"
          rating="4.7"
          experience="13 years"
          fee="550" />
        <DoctorCard name="Dr. Neha Kapoor"
          specialty="Dentist"
          location="MG Road, Bangalore"
          rating="4.9"
          experience="14 years"
          fee="600" />
      </div>
    </>
  )
}

export default SearchDoct
