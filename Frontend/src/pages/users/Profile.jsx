import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaUser, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientEmail = sessionStorage.getItem("patientEmail") || localStorage.getItem("patientEmail");

    if (!patientEmail) {
      toast.error("No user session found");
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/patients/get/${patientEmail}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        sessionStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className='mb-20 flex flex-col items-center min-h-screen pt-24 px-4'>
        <p className='text-gray-600'>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='mb-20 flex flex-col items-center min-h-screen pt-24 px-4'>
        <p className='text-red-500'>Unable to load profile</p>
      </div>
    );
  }

  const displayName =
    userData.fullname ||
    userData.fullName ||
    userData.name ||
    "User";



  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("patientEmail");
    sessionStorage.removeItem("doctorEmail");
    sessionStorage.removeItem("currentUserId");
    sessionStorage.removeItem("currentDoctorId");

    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("patientEmail");
    localStorage.removeItem("doctorEmail");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentDoctorId");
    navigate('/login');
  };


  return (
    <>
      <div className='mb-20 flex flex-col items-center min-h-screen w-full pt-24 px-4 pb-8 bg-gray-50'>

        {/* Profile Header Card */}
        <div className='bg-white rounded-2xl shadow-md p-8 w-[95%] max-w-md mb-4 flex flex-col items-center'>
          {/* Avatar */}
          <div className='bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
            <FaUser className='w-12 h-12 text-[#1a79f7]' />
          </div>

          {/* Name & Role */}
          <h1 className='text-2xl font-bold text-gray-800 mb-1'>{displayName}</h1>
          <p className='text-gray-500 text-lg'>Patient</p>
        </div>

        {/* Personal Information Card */}
        <div className='bg-white rounded-2xl shadow-md p-6 w-[95%] max-w-md mb-4'>
          <h2 className='text-xl font-bold text-gray-800 mb-6'>Personal Information</h2>

          {/* Email */}
          <div className='flex items-start gap-4 mb-6'>
            <FaEnvelope className='w-5 h-5 text-gray-500 mt-1' />
            <div>
              <p className='text-gray-500 text-sm mb-1'>Email</p>
              <p className='text-gray-800 font-medium break-all'>{userData.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className='flex items-start gap-4 mb-6'>
            <FaPhone className='w-5 h-5 text-gray-500 mt-1' />
            <div>
              <p className='text-gray-500 text-sm mb-1'>Phone</p>
              <p className='text-gray-800 font-medium'>{userData.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className='bg-white border-2 border-gray-300
         text-gray-800 font-bold py-3 rounded-xl w-[95%] max-w-md mb-4
          hover:bg-gray-50 transition-colors'
          onClick={() => toast.info("Edit profile functionality coming soon")}
        >
          Edit Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='bg-white border-2 border-red-500 text-red-500 font-bold py-3 rounded-xl w-[95%] max-w-md flex items-center justify-center gap-2 hover:bg-red-50 transition-colors'
        >
          <FaSignOutAlt className='w-5 h-5' />
          Logout
        </button>
      </div>
    </>
  )
}

export default Profile
