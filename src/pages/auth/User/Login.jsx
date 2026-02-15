import React from 'react'
import { useState } from 'react';
import Logo from '../../../assets/Logo.svg'
import { useNavigate } from 'react-router-dom';
function Login() {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setemail(e.target.email.value);
    setpassword(e.target.password.value);
    // Here you can add your login logic, such as making an API call to authenticate the user.
  }





  // Simulate successful login and redirect to homepage
  const navigate = useNavigate();
  function handleLogin() {
    // after backend success
    localStorage.setItem("token", "userLoggedIn");
    navigate("/");
  }

  return (
    <>

      <div className='mb-20 flex justify-center align-bottom mt-30  shadow-[0_0_30px_rgba(0,0,0,0.15)] rounded-2xl w-[95%] max-w-md mx-auto bg-white'>

        <form className=" flex flex-col justify-center 
       p-9 rounded-2xl  w-[95%]  gap-6 "
          onSubmit={handleSubmit}
        >

          <div className='flex justify-center'>
            <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
          </div>
          <h2 className="text-2xl text-center font-roboto font-bold mb-6 text-gray-700">Login</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
              type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]" placeholder="Enter your email" />
          </div>


          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password" id="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]" placeholder="Enter your password" />
          </div>

          <button
            onClick={handleLogin}
            type="submit" className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors">Login</button>
          <span className='text-[#1a79f7] text-center'><span className='text-gray-600'>Don't have an account?</span> <a href="/register" className="text-[#1a79f7] hover:underline">Register</a></span>
        </form>
      </div>
    </>
  )
}

export default Login
