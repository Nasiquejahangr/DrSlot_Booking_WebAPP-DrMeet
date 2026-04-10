import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock, FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaGraduationCap, FaMoneyBillWave, FaSignOutAlt, FaRedoAlt, FaLayerGroup, FaHourglassHalf, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { approveDoctor, getAllDoctorsForAdmin, rejectDoctor } from '../../api/doctorApi';

function DoctorApprovals() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const adminEmail = sessionStorage.getItem('adminEmail');

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const data = await getAllDoctorsForAdmin();
            setDoctors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || 'Failed to load doctors');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    const visibleDoctors = useMemo(() => {
        if (statusFilter === 'ALL') return doctors;
        return doctors.filter((doctor) => {
            const status = (doctor.approvalStatus || 'PENDING').toUpperCase();
            return status === statusFilter;
        });
    }, [doctors, statusFilter]);

    const counts = useMemo(() => ({
        total: doctors.length,
        pending: doctors.filter((doctor) => (doctor.approvalStatus || 'PENDING').toUpperCase() === 'PENDING').length,
        approved: doctors.filter((doctor) => (doctor.approvalStatus || 'PENDING').toUpperCase() === 'APPROVED').length,
        rejected: doctors.filter((doctor) => (doctor.approvalStatus || 'PENDING').toUpperCase() === 'REJECTED').length,
    }), [doctors]);

    const handleApprove = async (doctorId) => {
        try {
            setUpdatingId(doctorId);
            await approveDoctor(doctorId);
            toast.success('Doctor approved successfully');
            await loadDoctors();
        } catch (error) {
            toast.error(error?.message || 'Failed to approve doctor');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleReject = async (doctorId) => {
        try {
            setUpdatingId(doctorId);
            await rejectDoctor(doctorId);
            toast.success('Doctor rejected successfully');
            await loadDoctors();
        } catch (error) {
            toast.error(error?.message || 'Failed to reject doctor');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch ((status || 'PENDING').toUpperCase()) {
            case 'APPROVED':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'REJECTED':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin');
        sessionStorage.removeItem('adminId');
        sessionStorage.removeItem('adminEmail');
        toast.success('Logged out successfully');
        navigate('/admin-login');
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50 pb-20">
            <div className="bg-linear-to-br from-[#1a79f7] via-[#1968d6] to-[#0b3f91] px-5 pt-10 pb-24 relative overflow-hidden shadow-[0_20px_60px_rgba(26,121,247,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-20 translate-x-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300/20 rounded-full translate-y-16 -translate-x-10 blur-2xl" />
                <div className="relative max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-6">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm mb-4">
                                <FaShieldAlt className="text-cyan-100" />
                                Secure admin workspace
                            </div>
                            <p className="text-blue-100 text-sm uppercase tracking-[0.2em] mb-2">Admin Panel</p>
                            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">Doctor Approvals</h1>
                            <p className="text-blue-100 mt-3 max-w-2xl text-base sm:text-lg leading-7">
                                Review doctor registrations, inspect full profile details, and approve or reject access to the platform.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                            <div className="rounded-2xl bg-white/15 border border-white/20 px-4 py-3 text-white backdrop-blur-sm shadow-lg">
                                <div className="text-[11px] uppercase tracking-[0.2em] text-blue-100">Logged in as</div>
                                <div className="font-semibold break-all">{adminEmail}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f52b6] hover:bg-blue-50 px-5 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <FaSignOutAlt size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-14 relative z-10 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-4 shadow-[0_12px_35px_rgba(15,82,182,0.08)] border border-white/60 hover:-translate-y-1 transition-all duration-200">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1a79f7] flex items-center justify-center mb-3">
                            <FaLayerGroup />
                        </div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{counts.total}</p>
                    </div>
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-4 shadow-[0_12px_35px_rgba(245,158,11,0.10)] border border-amber-100 hover:-translate-y-1 transition-all duration-200">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                            <FaHourglassHalf />
                        </div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-3xl font-bold text-amber-600 mt-1">{counts.pending}</p>
                    </div>
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-4 shadow-[0_12px_35px_rgba(34,197,94,0.10)] border border-green-100 hover:-translate-y-1 transition-all duration-200">
                        <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                            <FaCheckCircle />
                        </div>
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{counts.approved}</p>
                    </div>
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-4 shadow-[0_12px_35px_rgba(239,68,68,0.10)] border border-red-100 hover:-translate-y-1 transition-all duration-200">
                        <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
                            <FaTimesCircle />
                        </div>
                        <p className="text-sm text-gray-500">Rejected</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{counts.rejected}</p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur rounded-3xl shadow-[0_12px_35px_rgba(15,82,182,0.07)] border border-white/70 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Filter doctors</p>
                        <p className="text-sm text-gray-600">Switch between approval statuses to review registrations faster.</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setStatusFilter(item)}
                                className={`px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 ${statusFilter === item
                                    ? 'bg-[#1a79f7] text-white shadow-lg shadow-blue-200/60 scale-[1.02]'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-[#1a79f7]'
                                    }`}
                            >
                                {item.charAt(0) + item.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={loadDoctors}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:text-[#1a79f7] hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <FaRedoAlt size={14} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-gray-600 border border-gray-100 shadow-[0_12px_35px_rgba(15,82,182,0.07)]">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-blue-100 border-t-[#1a79f7] animate-spin" />
                        Loading doctors...
                    </div>
                ) : visibleDoctors.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-dashed border-gray-300 shadow-[0_12px_35px_rgba(15,82,182,0.07)]">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-blue-50 text-[#1a79f7] flex items-center justify-center">
                            <FaClock className="text-3xl" />
                        </div>
                        <p className="text-xl font-semibold text-gray-800">No doctors found for this filter.</p>
                        <p className="text-sm text-gray-500 mt-2">Try another status or refresh the list to check for new registrations.</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {visibleDoctors.map((doctor) => {
                            const status = (doctor.approvalStatus || 'PENDING').toUpperCase();
                            const disabled = updatingId === doctor.id;

                            return (
                                <div key={doctor.id} className="group bg-white/95 backdrop-blur rounded-[30px] border border-gray-100 shadow-[0_12px_35px_rgba(15,82,182,0.08)] p-5 lg:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,82,182,0.12)]">
                                    <div className="flex flex-col xl:flex-row xl:items-start gap-5">
                                        <div className="w-24 h-24 rounded-[28px] overflow-hidden bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm ring-4 ring-blue-50">
                                            {doctor.profileImage ? (
                                                <img src={doctor.profileImage} alt={doctor.fullName || 'Doctor'} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserMd className="text-[#1a79f7] text-4xl" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h2 className="text-2xl font-bold text-gray-900">{doctor.fullName || 'Doctor'}</h2>
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(status)}`}>
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{doctor.specialization || 'Specialization not provided'}</p>
                                                    <p className="text-sm text-gray-500 mt-1">License: {doctor.medicalLicenseNumber || 'N/A'}</p>
                                                </div>

                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => handleApprove(doctor.id)}
                                                        disabled={disabled || status === 'APPROVED'}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <FaCheckCircle />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(doctor.id)}
                                                        disabled={disabled || status === 'REJECTED'}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <FaTimesCircle />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
                                                <DetailItem icon={<FaEnvelope />} label="Email" value={doctor.email} />
                                                <DetailItem icon={<FaPhone />} label="Phone" value={doctor.phone} />
                                                <DetailItem icon={<FaMapMarkerAlt />} label="Clinic" value={doctor.clinicLocation} />
                                                <DetailItem icon={<FaGraduationCap />} label="Qualification" value={doctor.qualification} />
                                                <DetailItem icon={<FaIdCard />} label="Hospital" value={doctor.hospitalName} />
                                                <DetailItem icon={<FaMoneyBillWave />} label="Fee" value={`₹${doctor.fee || 0}`} />
                                                <DetailItem icon={<FaClock />} label="Experience" value={`${doctor.workingExperience || 0} years`} />
                                                <DetailItem icon={<FaIdCard />} label="Role" value={doctor.role || 'DOCTOR'} />
                                            </div>

                                            {doctor.about && (
                                                <div className="mt-5 rounded-3xl bg-linear-to-r from-slate-50 to-blue-50 border border-slate-100 p-4">
                                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">About</p>
                                                    <p className="text-sm text-gray-700 leading-6">{doctor.about}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3 hover:bg-white hover:shadow-sm transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#1a79f7] shrink-0 ring-1 ring-blue-50">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-900 wrap-break-word leading-6">{value || 'N/A'}</p>
            </div>
        </div>
    );
}

export default DoctorApprovals;
