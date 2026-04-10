import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import DoctorCard from '../../components/Doctorcard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorApi } from '../../api/index';
import { FaSearch, FaStethoscope, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';

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
        const data = await doctorApi.getAllDoctors();

        // Format backend data to match DoctorCard props
        const formattedDoctors = data.map((doc) => ({
          id: doc.id,
          name: doc.fullName || "Dr. Unknown",
          fullName: doc.fullName || "Dr. Unknown",
          specialty: doc.specialization || "General Physician",
          specialization: doc.specialization || "General Physician",
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
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white text-3xl text-gray-700 shadow-sm transition hover:border-[#1a79f7] hover:text-[#1a79f7]"
            aria-label="Go back"
          >
            <IoIosArrowRoundBack />
          </button>

          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1a79f7] sm:text-sm">
            <FaFilter />
            Find your doctor
          </div>

          <div className="relative hidden sm:block">
            <select
              className="appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-700 shadow-sm outline-none transition hover:border-[#1a79f7] focus:border-[#1a79f7] focus:ring-4 focus:ring-blue-100"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="All">All Specialties</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic">Orthopedic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-linear-to-br from-white to-slate-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1a79f7]">
                <FaStethoscope />
                Search doctors in seconds
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Find the right specialist</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Search by doctor name and filter by specialty to quickly discover the best available doctors.
              </p>
            </div>

            <div className="relative w-full lg:w-95">
              <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#1a79f7] focus-within:ring-4 focus-within:ring-blue-100">
                <FaSearch className="mr-3 text-gray-400" />
                <input
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  type="text"
                  placeholder="Search for doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 px-4 py-4 sm:px-6 sm:hidden">
            <div className="relative">
              <select
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-700 shadow-sm outline-none transition hover:border-[#1a79f7] focus:border-[#1a79f7] focus:ring-4 focus:ring-blue-100"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="All">All Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dentist">Dentist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6">
        {loading && (
          <div className="rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#1a79f7]" />
            <p className="font-medium text-gray-600">Loading doctors...</p>
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1a79f7]">
              <FaMapMarkerAlt />
            </div>
            <p className="text-lg font-semibold text-gray-800">No doctors found</p>
            <p className="mt-2 text-sm text-gray-500">Try a different specialty or search term.</p>
          </div>
        )}

        {!loading && doctors.length > 0 && doctors
          .filter((doctor) => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
            return matchesSearch && matchesSpecialty;
          })
          .map((doctor) => (
            <div key={doctor.id} className="rounded-[28px] border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
              <DoctorCard
                id={doctor.id}
                name={doctor.name}
                fullName={doctor.fullName}
                specialty={doctor.specialty}
                specialization={doctor.specialization}
                location={doctor.location}
                rating={doctor.rating}
                experience={doctor.experience}
                fee={doctor.fee}
                profileImage={doctor.profileImage}
                qualification={doctor.qualification}
                hospitalName={`Hospital- ${doctor.hospitalName}`}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
export default SearchDoct
