import React, { useEffect, useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/index';

function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("user");

  // Redirect to doctor registration when doctor is selected
  useEffect(() => {
    if (userType === "doctor") {
      navigate("/DoctorRegister");
    }
  }, [userType, navigate]);



  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }


    //  Multi-user support (array based)
    const PatientArray = JSON.parse(localStorage.getItem("users")) || [];


    const emailExists = PatientArray.find(user => user.email === email);

    if (emailExists) {
      toast.error("User already registered with this email!");
      return;
    }
    const newPatient = {
      fullname: fullName,
      email,
      password,
      phoneNumber
    };
    PatientArray.push(newPatient);
    console.log(newPatient);
    // localStorage.setItem("users", JSON.stringify(PatientArray));
    // Set login session
    // localStorage.setItem("token", "userLoggedIn");
    // localStorage.setItem("userType", "user");
    // localStorage.setItem("currentUserId", newUser.id);
    // toast.success("User registration successful!");
    // setTimeout(() => {
    //   navigate("/login");
    // }, 1500);





    userApi.userRegister(newPatient)
      .then(data => {
        console.log("Patient saved:", data);
        //  success message
        toast.success("Registration Successful");

        //  IMPORTANT: login page pe bhej
        // window.location.href = "/login";
        navigate("/login");
      })
      .catch(err => {
        console.error(err);
        toast.error(err?.message || "Registration failed");
      });

  }

  return (
    <div className="min-h-screen bg-white px-4 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6"
        >
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
              <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1a79f7]">Healthcare Portal</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Register</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create your account on mobile in a few quick steps.
            </p>
          </div>

          {/* User Type */}
          <div className="mb-5 rounded-2xl bg-gray-50 p-3">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${userType === 'user' ? 'border-[#1a79f7] bg-blue-50 text-[#1a79f7]' : 'border-gray-200 bg-white text-gray-600'}`}>
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === 'user'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                User
              </label>

              <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${userType === 'doctor' ? 'border-[#1a79f7] bg-blue-50 text-[#1a79f7]' : 'border-gray-200 bg-white text-gray-600'}`}>
                <input
                  type="radio"
                  name="userType"
                  value="doctor"
                  checked={userType === 'doctor'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                Doctor
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <input
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
              inputMode="numeric"
              placeholder="Phone Number"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-2xl bg-[#1a79f7] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#104b9a] active:scale-[0.99]"
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?
            <a href="/login" className="ml-1 font-bold text-[#1563d1] hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;