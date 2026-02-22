import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { RiHospitalLine } from "react-icons/ri";
import DoctorType from '../../components/DoctorTypeIcon';
import { FaCalendarCheck, FaShieldAlt, FaClock } from "react-icons/fa";



function Landing() {

    return (
        <>
            {/* this is main div where all will exist - parent div*/}
            <div className="hero flex flex-col items-center min-h-screen w-full pt-16" >
                {/* this div for heading and subheading */}
                <div className='h-9xl w-screen p-5 font-roboto mt-4'>
                    <h1 className='text-5xl font-extrabold  text-gray-700'>Find & Book</h1>
                    <h1 className='text-4xl text-[#1a79f7] mt-3 font-roboto font-bold'>Your Doctor</h1>
                    <p className='text-gray-600 mt-4'>Connect with trusted healthcare professionals and book appointments easily.</p>
                </div>
                {/* this div for search bar and location */}
                <div className='rounded-3xl bg-white shadow-[0_0_30px_rgba(0,0,0,0.15)]   pb-5 px-5 w-[90%] max-w-md flex flex-col gap-8 h-72 mt-2 pt-12' >
                    {/* Location Input */}
                    <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 hover:border-[#1a79f7] transition-colors">
                        <IoLocationOutline className="text-[#1a79f7] text-xl mr-3" />
                        <input
                            type="text"
                            placeholder="Enter your location"
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent" />
                    </div>
                    {/* Specialist Input */}
                    <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 hover:border-[#1a79f7] transition-colors">
                        <RiHospitalLine className="text-[#1a79f7] text-xl mr-3" />
                        <input
                            type="text"
                            placeholder="Search specialization or doctor"
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>
                    {/* Search Button */}
                    <button className="bg-[#1a79f7] hover:bg-[#1563d1] text-white font-semibold py-3 rounded-xl flex items-center justify-center
                    cursor-pointer gap-2 transition duration-300 shadow-md">
                        <IoSearch className="text-xl font-bold" />
                        <span>Search Doctors</span>
                    </button>
                </div>


                <div className='flex justify-between w-[90%] max-w-md mt-8 font-roboto text-gray-700 p-2 cursor-pointer'>
                    <p className='text-1.5xl font-semibold'>Specializations</p>
                    <p className='text-[#1a79f7] font-bold'>View All</p>
                </div>

                {/* this div for specializations */}
                <div className='grid grid-cols-3 gap-3  w-[90%] mt-10 max-w-md cursor-pointer'>

                    <DoctorType type="General Physician" />
                    <DoctorType type="Cardiology" />
                    <DoctorType type="Neurology" />
                    <DoctorType type="Pediatrics" />
                    <DoctorType type="Orthopedics" />
                    <DoctorType type="Dentistry" />
                    <DoctorType type="Ophthalmology" />
                    <DoctorType type="Pulmonology" />
                    <DoctorType type="Dermatology" />

                </div>

                <div className='mb-30  mt-10 font-black text-gray-700 font-roboto text-center text-2xl'>
                    <h2 className="text-2xl font-bold text-gray-700 ">Why Choose Us?</h2>

                    {/* Feature Cards */}
                    <div className='flex flex-col gap-4 w-[99.9%] mt-9 max-w-md  mx-auto'>
                        {/* Easy Booking */}
                        <div className='flex items-center bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] p-5 gap-4'>
                            <div className='bg-blue-100 rounded-2xl w-15 h-14 flex items-center justify-center '>
                                <FaCalendarCheck className='w-6 h-6 text-black' />
                            </div>
                            <div className='text-left'>
                                <h3 className='text-lg font-bold text-gray-800'>Easy Booking</h3>
                                <p className='text-sm text-gray-600 font-normal'>Book appointments in seconds</p>
                            </div>
                        </div>

                        {/* Verified Doctors */}
                        <div className='flex items-center bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] p-5 gap-4'>
                            <div className='bg-blue-100 rounded-2xl w-15 h-14 flex items-center justify-center '>
                                <FaShieldAlt className='w-6 h-6 text-black' />
                            </div>
                            <div className='text-left'>
                                <h3 className='text-lg font-bold text-gray-800'>Verified Doctors</h3>
                                <p className='text-sm text-gray-600 font-normal'>All doctors are certified</p>
                            </div>
                        </div>

                        {/* Save Time */}
                        <div className='flex items-center bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] p-5 gap-4'>
                            <div className='bg-blue-100 rounded-2xl w-15 h-14 flex items-center justify-center'>
                                <FaClock className='w-6 h-6 text-black' />
                            </div>
                            <div className='text-left'>
                                <h3 className='text-lg font-bold text-gray-800'>Save Time</h3>
                                <p className='text-sm text-gray-600 font-normal'>No waiting in queues</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}


export default Landing;
