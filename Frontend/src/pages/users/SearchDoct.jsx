import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import DoctorCard from '../../components/Doctorcard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SearchDoct() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const navigate = useNavigate();

  // Fetch all doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/doctors/all");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();

        // Format backend data to match DoctorCard props
        const formattedDoctors = data.map((doc) => ({
          id: doc.id,
          name: doc.fullName || "Dr. Unknown",
          specialty: doc.specialization || "General Physician",
          location: doc.clinicLocation || "Location Not Available",
          rating: doc.rating || "4.5",
          experience: doc.workingExperience || "0",
          fee: doc.fee || "500",
          qualification: doc.qualification || "MBBS",
          profileImage: doc.profileImage || null,
          hospitalName: doc.hospitalName || "Hospital Not Listed"
        }));

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load doctors");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);



  return (
    <>
      {/* // back button */}
      <div className='p-6  cursor-pointer border-b border-gray-300 
      fixed w-full bg-white z-10'
      >
        <div className='flex justify-between'>
          <IoIosArrowRoundBack
            onClick={() => navigate("/")}
            className='text-3xl text-gray-700 cursor-pointer' />

          {/* // dropdown for specialty filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border-2  text-gray-600 px-4 py-2.5 pr-10 rounded-lg font-medium cursor-pointer hover:border-[#1a79f7] focus:outline-none focus:ring-2 focus:ring-[#1a79f7] focus:border-transparent transition-all shadow-sm"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="All"> All Specialties</option>
              <option value="General Physician">🩺 General Physician</option>
              <option value="Cardiologist">❤️ Cardiologist</option>
              <option value="Dentist">🦷 Dentist</option>
              <option value="Dermatologist">🧴 Dermatologist</option>
              <option value="Pediatrician">👶 Pediatrician</option>
              <option value="Neurologist">🧠 Neurologist</option>
              <option value="Orthopedic">🦴 Orthopedic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

      </div>
      <div className='p-6 cursor-pointer '>
        <div className=' mt-20 w-[98%] h-5 border border-gray-300 flex items-center rounded-2xl mx-auto px-4 py-8 bg-white shadow-[0_0_30px_rgba(0,0,0,0.15)]'>
          <input className=" w-full h-full text-black px-4 py-2 focus:outline-none"
            type="text"
            placeholder="Search for doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='bg-[#1a79f7] text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-[#1563d1] transition-colors'>Search</button>
        </div>
      </div>

      <div className=" p-3 mb-20 gap-5 flex flex-col w-[98%] mx-auto">
        {loading && (
          <p className="text-center text-gray-500">Loading doctors...</p>
        )}

        {!loading && doctors.length === 0 && (
          <p className="text-center text-gray-500">No doctors found 😔</p>
        )}

        {!loading && doctors.length > 0 && doctors
          .filter((doctor) => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
            return matchesSearch && matchesSpecialty;
          })
          .map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              location={doctor.location}
              rating={doctor.rating}
              experience={doctor.experience}
              fee={doctor.fee}
              profileImage={doctor.profileImage}
              qualification={doctor.qualification}
              hospitalName={`Hospital- ${doctor.hospitalName}`}
            />
          ))}
      </div>
    </>
  )
}
export default SearchDoct
