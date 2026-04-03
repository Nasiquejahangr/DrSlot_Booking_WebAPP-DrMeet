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
      fullName,
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
        toast.error("Registration failed");
      });

  }

  return (
    <div className='flex justify-center align-bottom mt-20'>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white justify-center p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] w-[95%] gap-5"
      >
        <div className='flex justify-center mb-4'>
          <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
        </div>

        <h2 className="text-2xl text-center font-bold mb-6 text-gray-700">
          Registration
        </h2>

        {/* User Type */}
        <div className="mb-4">
          <label className="block text-center text-gray-700 mb-3 font-semibold">
            Register as
          </label>

          <div className="flex gap-6 justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="user"
                checked={userType === "user"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2 w-4 h-4 text-[#1a79f7]"
              />
              <span>User</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="doctor"
                checked={userType === "doctor"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2 w-4 h-4 text-[#1a79f7]"
              />
              <span>Doctor</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
        />

        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
        />

        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
        />

        <input
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
        />

        <input
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          placeholder="Phone Number"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
        />

        <button
          type="submit"
          className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors"
        >
          Register
        </button>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?
          <a href="/login" className="text-[#1563d1] font-bold hover:underline ml-1">
            Login
          </a>
        </p>

      </form>
    </div>
  );
}

export default Register;