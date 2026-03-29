import React from 'react'
import { SlHome } from "react-icons/sl";
import { IoSearch } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

const Nav = () => {


    // Check user type from localStorage
    const userType = localStorage.getItem("userType");

    // Don't render Nav for doctors
    if (userType === "doctor") {
        return null;
    }

    return (

        <nav className="bottom-nav fixed bottom-0 left-0 w-full bg-white flex justify-around items-center p-4 border-t border-gray-300 z-50 font-roboto">
            <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                <SlHome size={20}

                />
                <span className="text-xs">Home</span>
            </Link>
            <Link to="/search" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                <IoSearch size={20}

                />
                <span className="text-xs">Search</span>
            </Link>
            <Link to="/appointment" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                <SlCalender size={20}

                />
                <span className="text-xs">Appointment</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                <CgProfile size={20}

                />
                <span className="text-xs">Profile</span>
            </Link>
        </nav>

    )
}

export default Nav


