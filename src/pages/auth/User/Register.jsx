import React from 'react'
import { useState } from 'react';
import Logo from '../../../assets/Logo.svg'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Render from '../../../components/Render';

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }




    // Save user data to localStorage
    localStorage.setItem("token", "userLoggedIn");
    localStorage.setItem("userName", fullName);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phoneNumber);

    // You can also add age, gender, city fields later if needed

    toast.success("Registration successful!");

    // Redirect to login or home page after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 1500); // Redirect after 1.5 seconds to show the success message
  }

  return (
    <>
      <div className='flex justify-center align-bottom mt-20'>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white justify-center p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] w-[95%] gap-5"
        >
          <div className='flex justify-center mb-4'>
            <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
          </div>
          <h2 className="text-2xl text-center font-bold mb-6 text-gray-700">User Registration</h2>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">Full Name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              id="fullName"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
              placeholder="Confirm your password"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">Phone Number</label>
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
              id="phoneNumber"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Register
          </button>

          <p className="text-center text-gray-700 mt-4">
            Already have an account? <a href="/login" className="text-[#1563d1] font-bold hover:underline">Login</a>
          </p>
        </form>
      </div>
    </>
  )
}

export default Register;
