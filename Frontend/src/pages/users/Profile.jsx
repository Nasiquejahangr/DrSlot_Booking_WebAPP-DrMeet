import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaUser, FaSignOutAlt, FaEdit, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '../../api/index';

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
        const data = await userApi.getUserProfile(patientEmail);
        setUserData(data);
        // console.log("Fetched user profile:", data); // Debug log to verify data structure
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
      <div className='mb-20 flex min-h-screen flex-col items-center justify-center bg-white px-4'>
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#1a79f7]" />
        <p className='text-gray-600 font-medium'>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='mb-20 flex flex-col items-center justify-center min-h-screen bg-white px-4'>
        <p className='text-red-500'>Unable to load profile</p>
      </div>
    );
  }

  const displayName =
    userData.fullname ||
    userData.fullName ||
    userData.name ||
    "Name is not comming....";



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
    <div className='mb-20 min-h-screen w-full bg-white px-4 pb-8 pt-6 sm:px-5'>
      <div className='mx-auto w-full max-w-md space-y-4'>

        <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)]'>
          <div className='bg-linear-to-r from-[#1a79f7] to-[#0f52b6] px-5 py-5 text-white'>
            <p className='text-xs uppercase tracking-[0.2em] text-blue-100'>My Profile</p>
            <h1 className='mt-1 text-2xl font-bold'>Welcome back</h1>
            <p className='mt-1 text-sm text-blue-100'>Manage your account details and session</p>
          </div>

          <div className='px-5 pb-6 pt-5'>
            <div className='mb-4 flex flex-col items-center text-center'>
              <div className='mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-50 shadow-sm'>
                <FaUser className='h-10 w-10 text-[#1a79f7]' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>{displayName}</h2>
              <span className='mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1a79f7]'>
                <FaShieldAlt />
                Patient Account
              </span>
            </div>

            <div className='space-y-3'>
              <InfoRow
                icon={<FaEnvelope className='text-[#1a79f7]' />}
                label='Email'
                value={userData.email}
                breakWord
              />
              <InfoRow
                icon={<FaPhone className='text-[#1a79f7]' />}
                label='Phone'
                value={userData.phoneNumber || 'N/A'}
              />
            </div>
          </div>
        </div>

        <button
          className='flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-bold text-gray-800 shadow-sm transition hover:bg-gray-50 active:scale-[0.99]'
          onClick={() => toast.info("Edit profile functionality coming soon")}
        >
          <FaEdit />
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className='flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.99]'
        >
          <FaSignOutAlt className='h-5 w-5' />
          Logout
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, breakWord = false }) {
  return (
    <div className='flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4'>
      <div className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='text-xs uppercase tracking-wide text-gray-500'>{label}</p>
        <p className={`mt-1 font-semibold text-gray-900 ${breakWord ? 'break-all' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

export default Profile
