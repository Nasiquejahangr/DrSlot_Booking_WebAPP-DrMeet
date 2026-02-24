import React from 'react';
import { HiCalendar, HiTrendingUp, HiStar, HiUsers, HiCurrencyRupee, HiUser, HiArrowRight, HiClock, HiLogout, HiCurrencyDollar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {

    const navigate = useNavigate();
    //i want to remove nav if user == doctor
    if (localStorage.getItem("userType") !== "doctor") {
        navigate('/login');
    }
    //  Get doctors array
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const currentDoctorId = localStorage.getItem("currentDoctorId");

    //  Find current doctor
    const currentDoctor = doctors.find(
        doc => doc.id == currentDoctorId
    ) || {};
    const doctorName = currentDoctor.fullName || "Doctor";
    const doctorEmail = currentDoctor.email || "No Email";

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('currentDoctorId');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const quickActions = [
        {
            icon: HiCurrencyDollar,
            title: 'Earnings & Analytics',
            description: 'View revenue and reports',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: HiClock,
            title: 'Manage Slots',
            description: 'Set your availability',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: HiCalendar,
            title: 'Appointments',
            description: 'View booked appointments',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        }
    ];

    const stats = [
        {
            icon: HiCalendar,
            label: 'Today',
            value: '0',
            subtitle: 'Appointments',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            icon: HiTrendingUp,
            label: 'Total',
            value: '0',
            subtitle: 'Bookings',
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-50'
        },
        {
            icon: HiStar,
            label: 'Rating',
            value: '0.0',
            subtitle: '0 Reviews',
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-50'
        },
        {
            icon: HiUsers,
            label: 'Completed',
            value: '0',
            subtitle: 'Patients',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        }
    ];

    return (
        <div className="p-2 mt-2 cursor-pointer">

            {/* Doctor Profile Card */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                            {currentDoctor.profileImage ? (
                                <img
                                    src={currentDoctor.profileImage}
                                    alt="Doctor Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <HiUser className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 truncate">
                                {`Dr. ${doctorName}`}
                            </h2>
                            <p className="text-gray-600 text-sm truncate">
                                {doctorEmail}
                            </p>
                        </div>
                    </div>

                    <button
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-md w-full sm:w-auto"
                        onClick={() => navigate('/DoctorProfile')}
                    >
                        View Profile
                    </button>
                </div>

                <div className="mt-4 sm:mt-6">
                    <button
                        onClick={() => navigate('/DoctorProfile')}
                        className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-left flex items-center justify-center gap-2 text-blue-600"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-around w-full gap-y-6 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white w-40 h-40 rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-gray-600 text-sm">{stat.label}</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-gray-600 text-sm">{stat.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Earnings */}
            <div className="rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <HiCurrencyRupee className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">This Month</p>
                            <h2 className="text-3xl font-bold text-gray-900">₹0</h2>
                        </div>
                    </div>
                    <div className="bg-cyan-100 p-2 rounded-lg">
                        <HiTrendingUp className="w-6 h-6 text-cyan-600" />
                    </div>
                </div>
            </div>


            {/* // Quick Actions */}
            <div className="mt-8 cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Quick Actions
                </h2>

                <div className="space-y-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${action.bgColor} w-14 h-14 rounded-full flex items-center justify-center`}>
                                        <Icon className={`w-7 h-7 ${action.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>







            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mb-20 w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6"
            >
                <div className="flex items-center justify-center gap-2 text-red-600">
                    <HiLogout className="w-5 h-5" />
                    <span className="text-lg font-semibold">Logout</span>
                </div>
            </button>
        </div>
    )
}

export default Dashboard;