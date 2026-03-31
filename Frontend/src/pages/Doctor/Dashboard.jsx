import { useEffect, useState } from 'react';
import { HiCalendar, HiTrendingUp, HiStar, HiUsers, HiCurrencyRupee, HiUser, HiClock, HiLogout, HiCurrencyDollar, HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getDoctorAppointments } from '../../util/Localstorage';

function Dashboard() {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("userType") !== "doctor") {
            navigate('/login');
            return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const email = localStorage.getItem("doctorEmail") || savedUser?.email;

        if (!email) return;

        axios.get(`http://localhost:8080/api/doctors/get/${email}`)
            .then((res) => {
                setDoctor(res.data);
                if (res.data?.id) {
                    localStorage.setItem("currentDoctorId", res.data.id);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load doctor data");
            });
    }, [navigate]);


    //for stats and welcome message
    const currentDoctorId = doctor?.id || localStorage.getItem("currentDoctorId");
    const currentDoctor = doctor || {};
    const doctorName = currentDoctor.fullName || "Doctor";
    const doctorSpecialization = currentDoctor.specialization || "";

    const appointments = getDoctorAppointments(Number(currentDoctorId));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = appointments.filter(a => {
        const d = new Date(a.date); d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    }).length;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('currentDoctorId');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const stats = [
        { icon: HiCalendar, label: "Today's", value: todayCount, subtitle: 'Appointments', color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: HiTrendingUp, label: 'Total', value: appointments.length, subtitle: 'Bookings', color: 'text-violet-600', bg: 'bg-violet-50' },
        { icon: HiStar, label: 'Rating', value: currentDoctor.rating || '—', subtitle: 'Score', color: 'text-amber-500', bg: 'bg-amber-50' },
        { icon: HiUsers, label: 'Patients', value: appointments.length, subtitle: 'Served', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const quickActions = [
        { icon: HiClock, title: 'Manage Slots', description: 'Add, edit or delete time slots', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', onClick: () => navigate('/ManageSlot') },
        { icon: HiCalendar, title: 'Appointments', description: 'View all booked appointments', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', onClick: () => navigate('/DoctorAppointments') },
        { icon: HiCurrencyDollar, title: 'Earnings', description: 'View revenue and analytics', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', onClick: null },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">

            {/* Header Banner */}
            <div className="bg-linear-to-br from-[#1a79f7] to-[#0f52b6] px-5 pt-10 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-8 -translate-x-6" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                        {currentDoctor.profileImage
                            ? <img src={currentDoctor.profileImage} alt="profile" className="w-full h-full object-cover" />
                            : <HiUser className="w-9 h-9 text-white" />
                        }
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Welcome back,</p>
                        <h1 className="text-white text-xl font-bold">Dr. {doctorName}</h1>
                        {doctorSpecialization && <p className="text-blue-200 text-xs mt-0.5">{doctorSpecialization}</p>}
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-12 relative z-10 space-y-5">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                    <Icon className={`w-5 h-5 ${s.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{s.label} {s.subtitle}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Earnings Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
                                <HiCurrencyRupee className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">This Month's Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{appointments.reduce((sum, a) => sum + Number(a.fee || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl">
                            <HiTrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-base font-bold text-gray-700 mb-3 px-1">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action, i) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={action.onClick}
                                    className={`w-full bg-white rounded-2xl p-4 shadow-sm border ${action.border} flex items-center gap-4 hover:shadow-md transition-all text-left`}
                                >
                                    <div className={`${action.bg} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-6 h-6 ${action.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{action.title}</p>
                                        <p className="text-xs text-gray-500">{action.description}</p>
                                    </div>
                                    <HiChevronRight className="w-5 h-5 text-gray-300" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => navigate('/DoctorProfile')}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <HiUser className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-gray-700">View / Edit Profile</span>
                        </div>
                        <HiChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HiLogout className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-red-500">Logout</span>
                        </div>
                        <HiChevronRight className="w-5 h-5 text-red-200" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
