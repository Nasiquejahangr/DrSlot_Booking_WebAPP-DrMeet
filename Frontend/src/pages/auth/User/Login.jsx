import React, { useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorApi, userApi } from '../../../api/index';
import { getPatientDisplayName } from '../../../api/userApi/index';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

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
      const resolvedUserName = getPatientDisplayName(data) || data?.email || email;

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

      if (resolvedUserName) {
        sessionStorage.setItem("currentUserName", resolvedUserName);
        localStorage.setItem("currentUserName", resolvedUserName);
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
    <div className="min-h-screen bg-white px-4 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center">
        <form
          className="w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
              <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1a79f7]">Healthcare Portal</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Login</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to continue to your account.
            </p>
          </div>

          <div className="space-y-3">
            {/* <Field label="Email" icon={<FaEnvelope />}> */}
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {/* </Field> */}

            {/* <Field label="Password" icon={<FaLock />}> */}
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {/* </Field> */}
          </div>

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a79f7] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#104b9a] active:scale-[0.99]"
          >
            <FaSignInAlt />
            Login
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?
            <a href="/register" className="ml-1 font-bold text-[#1a79f7] hover:underline">
              Register
            </a>
          </p>
        </form>
      </div >
    </div >
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-3.5 text-gray-400">{icon}</span>
        <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
        {children}
      </div>
    </div>
  );
}

export default Login;