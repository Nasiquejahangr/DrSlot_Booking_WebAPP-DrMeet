import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { approveDoctor, getAllDoctorsForAdmin, rejectDoctor } from '../../api/doctorApi';

function DoctorApprovals() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

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

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50 pb-20">
            <div className="bg-linear-to-br from-[#1a79f7] to-[#0f52b6] px-5 pt-10 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-6" />
                <div className="relative max-w-6xl mx-auto text-white">
                    <p className="text-blue-100 text-sm uppercase tracking-[0.2em] mb-2">Admin Panel</p>
                    <h1 className="text-3xl sm:text-4xl font-bold">Doctor Approvals</h1>
                    <p className="text-blue-100 mt-2 max-w-2xl">Review doctor registrations, inspect full profile details, and approve or reject access to the platform.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-14 relative z-10 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{counts.total}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-3xl font-bold text-amber-600 mt-1">{counts.pending}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{counts.approved}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
                        <p className="text-sm text-gray-500">Rejected</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{counts.rejected}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setStatusFilter(item)}
                            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-colors ${statusFilter === item
                                ? 'bg-[#1a79f7] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {item.charAt(0) + item.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl p-10 text-center text-gray-600 border border-gray-100 shadow-sm">
                        Loading doctors...
                    </div>
                ) : visibleDoctors.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-dashed border-gray-300 shadow-sm">
                        <FaClock className="text-gray-300 text-5xl mx-auto mb-4" />
                        <p className="text-lg font-medium">No doctors found for this filter.</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {visibleDoctors.map((doctor) => {
                            const status = (doctor.approvalStatus || 'PENDING').toUpperCase();
                            const disabled = updatingId === doctor.id;

                            return (
                                <div key={doctor.id} className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 lg:p-6">
                                    <div className="flex flex-col xl:flex-row xl:items-start gap-5">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
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
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FaCheckCircle />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(doctor.id)}
                                                        disabled={disabled || status === 'REJECTED'}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">
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
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#1a79f7] shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-900 wrap-break-word">{value || 'N/A'}</p>
            </div>
        </div>
    );
}

export default DoctorApprovals;
