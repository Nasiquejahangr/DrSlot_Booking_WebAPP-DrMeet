import React, { useState, useRef, useEffect } from 'react';
import { HiUser, HiMail, HiPhone, HiBriefcase, HiAcademicCap, HiPencil, HiCheck, HiX, HiCamera, HiArrowLeft } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { CiLocationOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../api/index';

function DocProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const defaultAbout =
        'I am a dedicated healthcare professional committed to providing exceptional patient care...';

    const [doctor, setDoctor] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [about, setAbout] = useState(defaultAbout);

    // Load doctor data on mount and when navigate changes
    useEffect(() => {
        const userType = (sessionStorage.getItem("userType") || localStorage.getItem("userType") || "").toLowerCase();
        if (userType !== "doctor") {
            navigate('/login');
            return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const email = sessionStorage.getItem("doctorEmail") || localStorage.getItem("doctorEmail") || savedUser?.email;
        if (!email) return;

        const fetchDoctor = async () => {
            try {
                const fetched = await doctorApi.getDoctorProfile(email);
                setDoctor(fetched);

                if (fetched?.id) {
                    sessionStorage.setItem("currentDoctorId", fetched.id);
                    localStorage.setItem("currentDoctorId", fetched.id);
                }

                setProfileImage(fetched?.profileImage || null);
                setAbout(fetched?.about || defaultAbout);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load doctor profile");
            }
        };

        fetchDoctor();
    }, [navigate]);

    const currentDoctor = doctor || {};

    const Doctordata = {
        name: currentDoctor.fullName || 'Unknown Doctor',
        email: currentDoctor.email || 'No Email',
        specialization: currentDoctor.specialization || 'General Physician',
        workingExperience: currentDoctor.workingExperience || '0 years',
        phone: currentDoctor.phone || 'No Phone',
        hospital: currentDoctor.hospitalName || 'No Hospital',
        license: currentDoctor.medicalLicenseNumber || 'No License',
        clinicLocation: currentDoctor.clinicLocation || 'No Location'
    };

    const { name, email, specialization, workingExperience, phone, hospital, license, clinicLocation } = Doctordata;

    const handleSaveAbout = () => {
        setDoctor((prev) => (prev ? { ...prev, about } : prev));
        setIsEditingAbout(false);
        toast.success('About section updated successfully!');
    };

    const handleCancelAbout = () => {
        setAbout(currentDoctor?.about || defaultAbout);
        setIsEditingAbout(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image (JPG, PNG)');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should not exceed 2MB');
                return;
            }

            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result;
                const doctorEmail = currentDoctor?.email || sessionStorage.getItem("doctorEmail") || localStorage.getItem("doctorEmail");

                if (!doctorEmail) {
                    toast.error('Doctor email not found. Please login again.');
                    return;
                }

                try {
                    const updatedDoctor = await doctorApi.updateDoctorProfileImage(doctorEmail, base64String);
                    setProfileImage(updatedDoctor?.profileImage || base64String);
                    if (updatedDoctor) {
                        setDoctor(updatedDoctor);
                    } else {
                        setDoctor((prev) => (prev ? { ...prev, profileImage: base64String } : prev));
                    }
                    toast.success('Profile image updated in database successfully!');
                } catch (error) {
                    console.error(error);
                    toast.error(error?.message || 'Failed to update profile image');
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleEditImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen bg-white px-4 pb-24 pt-4 sm:px-5">
            <div className="mx-auto w-full max-w-4xl space-y-4 sm:space-y-5">

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#1a79f7] hover:text-[#1a79f7]"
                >
                    <HiArrowLeft className="h-5 w-5" />
                    Back
                </button>


                {/* Header Card */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1a79f7]">
                        Doctor Profile
                    </div>
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
                        <div className="relative group">
                            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50 shadow-sm flex items-center justify-center">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <HiUser className="h-12 w-12 text-[#1a79f7]" />
                                )}
                            </div>

                            <button
                                onClick={handleEditImageClick}
                                className="absolute bottom-0 right-0 rounded-full bg-[#1a79f7] p-2 shadow-lg transition-all duration-300 hover:bg-[#1563d1] group-hover:scale-110"
                            >
                                <HiCamera className="w-4 h-4 text-white" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
                            <p className="text-base font-medium text-[#1a79f7] sm:text-lg">{specialization}</p>
                            <p className="mt-1 text-sm text-gray-500">{hospital}</p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 sm:text-2xl">
                            <HiAcademicCap className="text-blue-500" />
                            About Me
                        </h2>

                        {!isEditingAbout && (
                            <button
                                onClick={() => setIsEditingAbout(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                            >
                                <HiPencil className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditingAbout ? (
                        <div className="space-y-4">
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="min-h-36 w-full resize-y rounded-2xl border-2 border-blue-200 p-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handleSaveAbout}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a79f7] px-6 py-2.5 text-white transition-colors hover:bg-[#1563d1]"
                                >
                                    <HiCheck className="w-5 h-5" />
                                    Save
                                </button>

                                <button
                                    onClick={handleCancelAbout}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    <HiX className="w-5 h-5" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">{about}</p>
                    )}
                </div>

                {/* Professional Info */}
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6">
                    <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800 sm:text-2xl">
                        <HiBriefcase className="text-blue-500" />
                        Professional Information
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">

                        <InfoCard icon={<HiUser />} title="Full Name" value={name} />
                        <InfoCard icon={<HiMail />} title="Email" value={email} />
                        <InfoCard icon={<HiPhone />} title="Phone" value={phone} />
                        <InfoCard icon={<HiAcademicCap />} title="Specialization" value={specialization} />
                        <InfoCard icon={<HiBriefcase />} title="Experience" value={workingExperience} />
                        <InfoCard icon={<HiBriefcase />} title="Hospital" value={hospital} />
                        <InfoCard icon={<CiLocationOn />} title="Clinic Location" value={clinicLocation} />
                        <InfoCard icon={<HiAcademicCap />} title="Medical License Number" value={license} fullWidth />

                    </div>
                </div>

            </div>
        </div>
    );
}

function InfoCard({ icon, title, value, fullWidth }) {
    return (
        <div className={`flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 ${fullWidth ? "md:col-span-2" : ""}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#1a79f7] shadow-sm">
                {icon}
            </div>
            <div className="min-w-0">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
                <p className="font-medium text-gray-800 wrap-break-word">{value}</p>
            </div>
        </div>
    );
}

export default DocProfile;