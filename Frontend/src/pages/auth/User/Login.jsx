import React, { useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/doctors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      // const role = (data?.role || data?.Role || "").toUpperCase();
      // localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", "loggedIn");
      const role = (data?.role || data?.Role || "").toUpperCase();

      if (role === "DOCTOR") {
        localStorage.setItem("userType", "doctor");
        localStorage.setItem("doctorEmail", data?.email || email);
        // if (data?.id) {
        //   localStorage.setItem("currentDoctorId", data.id);
        // }
        toast.success("Doctor login successful!");
        navigate("/Dashboard");
        return;
      }

      localStorage.setItem("userType", "user");
      if (data?.id) {
        localStorage.setItem("currentUserId", data.id);
      }
      toast.success("Login successful!");
      navigate("/");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Invalid email or password!");
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