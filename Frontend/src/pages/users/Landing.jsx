import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { RiHospitalLine } from "react-icons/ri";
import DoctorType from '../../components/HomePageDoctorIcon';
import { FaCalendarCheck, FaShieldAlt, FaClock, FaUserMd, FaStar, FaCheckCircle } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { doctorApi } from "../../api/index";

function Landing() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch doctors from backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await doctorApi.getAllDoctors();
                setDoctors(data.slice(0, 3)); // Show only first 4 doctors
            } catch (error) {
                console.error(error);
                toast.error("Failed to load doctors");
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const steps = [
        { num: "1", title: "Search", desc: "Find doctors by specialization or location", color: "bg-blue-500" },
        { num: "2", title: "Choose", desc: "View profiles, ratings and availability", color: "bg-violet-500" },
        { num: "3", title: "Book", desc: "Pick a slot and confirm your appointment", color: "bg-emerald-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-28">

            {/* Hero Section */}
            <div className="bg-linear-to-br from-[#1a79f7] to-[#0f52b6] px-5 pt-20 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-52 h-52 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-10 -translate-x-8" />

                <div className="relative z-10 max-w-md mx-auto">
                    {/* Trusted Doctors sticker */}
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 mb-3 shadow-lg">
                        <FaCheckCircle className="text-green-300 text-xs" />
                        <span className="text-white text-xs font-bold tracking-wide">✦ Trusted Doctors</span>
                        <span className="bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">VERIFIED</span>
                    </div>

                    <p className="text-blue-200 text-sm font-medium mb-2">Healthcare at your fingertips</p>
                    <h1 className="text-4xl font-extrabold text-white leading-tight">
                        Find & Book<br />
                        <span className="text-blue-200">Your Doctor</span>
                    </h1>
                    <p className="text-blue-100 mt-3 text-sm leading-relaxed">
                        Connect with trusted healthcare professionals and book appointments in seconds.
                    </p>
                </div>
            </div>

            {/* Search Card */}
            <div className="px-4 -mt-8 relative z-10 max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-5 flex flex-col gap-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-5 bg-[#1a79f7] rounded-full" />
                        <p className="text-sm font-bold text-gray-700">Find a Doctor</p>
                    </div>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-3 focus-within:border-[#1a79f7] focus-within:bg-blue-50/30 transition-all">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <IoLocationOutline className="text-[#1a79f7] text-base" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Location</p>
                            <input type="text" placeholder="Enter your city or area"
                                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-3 focus-within:border-[#1a79f7] focus-within:bg-blue-50/30 transition-all">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <RiHospitalLine className="text-[#1a79f7] text-base" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Specialization</p>
                            <input type="text" placeholder="e.g. Cardiologist, Dentist"
                                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm" />
                        </div>
                    </div>
                    <button onClick={() => navigate("/search")}
                        className="bg-linear-to-r from-[#1a79f7] to-[#0f52b6] hover:from-[#1563d1] hover:to-[#0a3d8f] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95">
                        <IoSearch className="text-lg" />
                        <span>Search Doctors</span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="px-4 mt-6 max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 grid grid-cols-3 divide-x divide-gray-100">
                    {[
                        { value: "500+", label: "Doctors" },
                        { value: "10k+", label: "Patients" },
                        { value: "50+", label: "Specializations" },
                    ].map(({ value, label }, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <p className="text-lg font-extrabold text-[#1a79f7]">{value}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it Works */}
            <div className="px-4 mt-8 max-w-md mx-auto">
                <h2 className="text-base font-bold text-gray-800 mb-4">How it Works</h2>
                <div className="flex flex-col gap-3">
                    {steps.map((step, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`${step.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                                <span className="text-white font-extrabold text-base">{step.num}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">{step.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                            </div>
                            {i < steps.length - 1 && <HiArrowRight className="text-gray-300 w-4 h-4 shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Doctors */}
            <div className="px-4 mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">Top Doctors</h2>
                    <button onClick={() => navigate("/search")} className="text-[#1a79f7] text-sm font-semibold">View All</button>
                </div>
                {loading && (
                    <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">Loading doctors...</p>
                    </div>
                )}
                {!loading && doctors.length === 0 && (
                    <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-gray-200">
                        <FaUserMd className="text-gray-300 text-4xl mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No doctors available</p>
                    </div>
                )}
                {!loading && doctors.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {doctors.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blue-50 shrink-0 border border-blue-100">
                                    {doc.profileImage
                                        ? <img src={doc.profileImage} alt={doc.fullName} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center"><FaUserMd className="text-blue-300 text-2xl" /></div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 text-sm truncate">{doc.fullName}</p>
                                    <p className="text-xs text-gray-500 truncate">{doc.specialization}</p>
                                    {doc.rating && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <FaStar className="text-amber-400 text-xs" />
                                            <span className="text-xs font-semibold text-gray-700">{doc.rating}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate(`/doctor/${doc.id}`)}
                                    className="bg-blue-50 text-[#1a79f7] text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors shrink-0"
                                >
                                    Book
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Specializations */}
            <div className="px-4 mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">Specializations</h2>
                    <button onClick={() => navigate("/search")} className="text-[#1a79f7] text-sm font-semibold">View All</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
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
            </div>

            {/* Why Choose Us */}
            <div className="px-4 mt-8 max-w-md mx-auto">
                <h2 className="text-base font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                <div className="flex flex-col gap-3">
                    {[
                        { icon: FaCalendarCheck, title: 'Easy Booking', desc: 'Book appointments in seconds', bg: 'bg-blue-50', color: 'text-[#1a79f7]' },
                        { icon: FaShieldAlt, title: 'Verified Doctors', desc: 'All doctors are certified & trusted', bg: 'bg-green-50', color: 'text-green-600' },
                        { icon: FaClock, title: 'Save Time', desc: 'No waiting in long queues', bg: 'bg-amber-50', color: 'text-amber-500' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`${item.bg} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="px-4 mt-10 max-w-md mx-auto mb-0">
                <div className="bg-linear-to-r from-[#1a79f7] to-[#0f52b6] rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-blue-200">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-6 translate-x-6" />
                    <p className="text-white font-extrabold text-lg leading-snug mb-1">Ready to book your<br />appointment?</p>
                    <p className="text-blue-200 text-xs mb-4">Find the right doctor in seconds</p>
                    <button
                        onClick={() => navigate("/search")}
                        className="bg-white text-[#1a79f7] font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm active:scale-95"
                    >
                        Book Now <HiArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Landing;
