import React from 'react'
import { FaEnvelope, FaPhone, FaUser, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Profile() {

  //use navigate hook for redirection after logout
  const navigate = useNavigate();

  // Get user data from localStorage
  const currentUserId = localStorage.getItem("currentUserId");
  const usersArray = JSON.parse(localStorage.getItem("users")) || [];
  const userData = usersArray.find(user => user.id === parseInt(currentUserId)) || {};



  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  function handleEditProfile() {
    // Implement edit profile functionality here
    alert("Edit profile functionality is not implemented yet.");

  }

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
          <h1 className='text-2xl font-bold text-gray-800 mb-1'>{userData.name}</h1>
          <p className='text-gray-500 text-lg'>{userData.role}</p>
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
              <p className='text-gray-800 font-medium'>{userData.phoneNumber}</p>
            </div>
          </div>

          {/* Age & Gender */}
          <div className='flex items-start gap-4 mb-6'>
            <FaUser className='w-5 h-5 text-gray-500 mt-1' />
            <div>
              <p className='text-gray-500 text-sm mb-1'>Age & Gender</p>
              <p className='text-gray-800 font-medium'>{userData.age || "20"} Years • {userData.gender}</p>
            </div>
          </div>

          {/* City */}
          <div className='flex items-start gap-4'>
            <FaMapMarkerAlt className='w-5 h-5 text-gray-500 mt-1' />
            <div>
              <p className='text-gray-500 text-sm mb-1'>City</p>
              <p className='text-gray-800 font-medium'>{userData.city || "India"}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className='bg-white border-2 border-gray-300
         text-gray-800 font-bold py-3 rounded-xl w-[95%] max-w-md mb-4
          hover:bg-gray-50 transition-colors'
          onClick={handleEditProfile}

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
