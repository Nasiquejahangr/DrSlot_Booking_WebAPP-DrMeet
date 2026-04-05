import React, { useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorApi, userApi } from '../../../api/index';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginByRole(loginFunction, expectedRole, emailKey, successMessage) {
    try {
      const data = await loginFunction(email, password);
      const role = (data?.role || data?.Role || "").toUpperCase();

      if (role !== expectedRole) {
        return false;
      }

      const resolvedUserType = expectedRole === "DOCTOR" ? "doctor" : "user";

      sessionStorage.setItem("token", "loggedIn");
      sessionStorage.setItem("userType", resolvedUserType);
      sessionStorage.setItem(emailKey, data?.email || email);

      // Keep backward compatibility for older flows
      localStorage.setItem("userType", resolvedUserType);

      // Store user ID for session management
      if (data?.id) {
        sessionStorage.setItem("currentUserId", data.id);
        localStorage.setItem("currentUserId", data.id);
      }

      toast.success(successMessage);
      navigate(expectedRole === "DOCTOR" ? "/Dashboard" : "/");
      return true;
    } catch {
      return false;
    }
  }

  // Handle form submission for login
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const isPatientLoggedIn = await loginByRole(
        userApi.userLogin,
        "PATIENT",
        "patientEmail",
        "Patient login successful!"
      );

      if (isPatientLoggedIn) {
        return;
      }

      const isDoctorLoggedIn = await loginByRole(
        doctorApi.doctorLogin,
        "DOCTOR",
        "doctorEmail",
        "Doctor login successful!"
      );

      if (isDoctorLoggedIn) {
        return;
      }

      toast.error("Invalid email or password!");
    } catch (error) {
      toast.error(error?.message || "Invalid email or password!");
    }
  }

  return (
    <div className='mb-20 flex justify-center mt-30 shadow-[0_0_30px_rgba(0,0,0,0.15)] rounded-2xl w-[95%] max-w-md mx-auto bg-white'>

      <form
        className="flex flex-col justify-center p-9 rounded-2xl w-[95%] gap-6"
        onSubmit={handleSubmit}
      >

        <div className='flex justify-center'>
          <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
        </div>

        <h2 className="text-2xl text-center font-bold mb-6 text-gray-700">
          Login
        </h2>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors"
        >
          Login
        </button>

        <span className='text-center'>
          <span className='text-gray-600'>Don't have an account? </span>
          <a href="/register" className="text-[#1a79f7] hover:underline">
            Register
          </a>
        </span>

      </form>
    </div>
  );
}

export default Login;