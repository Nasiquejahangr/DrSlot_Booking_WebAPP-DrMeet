import React, { useState, useRef } from 'react';
import { HiUser, HiMail, HiPhone, HiBriefcase, HiAcademicCap, HiPencil, HiCheck, HiX, HiCamera } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { CiLocationOn } from 'react-icons/ci';

function DocProfile() {

    const fileInputRef = useRef(null);

    // 🔥 Get all doctors
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const currentDoctorId = localStorage.getItem("currentDoctorId");

    // 🔥 Find logged-in doctor
    const currentDoctor = doctors.find(
        doc => doc.id == currentDoctorId
    ) || {};

    //  State initialization from current doctor
    const [profileImage, setProfileImage] = useState(currentDoctor?.profileImage || null);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [about, setAbout] = useState(
        currentDoctor?.about ||
        'I am a dedicated healthcare professional committed to providing exceptional patient care...'
    );

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

    //  Save About (update inside doctors array)
    const handleSaveAbout = () => {
        const updatedDoctors = doctors.map(doc => {
            if (doc.id == currentDoctorId) {
                return { ...doc, about };
            }
            return doc;
        });

        localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
        setIsEditingAbout(false);
        toast.success('About section updated successfully!');
    };

    const handleCancelAbout = () => {
        setAbout(currentDoctor?.about ||
            'I am a dedicated healthcare professional committed to providing exceptional patient care...');
        setIsEditingAbout(false);
    };




    //  Handle profile image upload
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

            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileImage(base64String);

                const updatedDoctors = doctors.map(doc => {
                    if (doc.id == currentDoctorId) {
                        return { ...doc, profileImage: base64String };
                    }
                    return doc;
                });

                localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
                toast.success('Profile image updated successfully!');
            };

            reader.readAsDataURL(file);
        }
    };

    const handleEditImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-blue-50 via-white to-cyan-50 p-6 mb-20">
            <div className="max-w-4xl mx-auto space-y-6">


                {/* Header Card */}
                <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center 
                            justify-center border-4 border-white/30 shadow-lg overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <HiUser className="w-16 h-16 text-white" />
                                )}
                            </div>

                            <button
                                onClick={handleEditImageClick}
                                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full
                                 shadow-lg transition-all duration-300 group-hover:scale-110"
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
                            <h1 className="text-3xl font-bold mb-2">{name}</h1>
                            <p className="text-blue-100 text-lg">{specialization}</p>
                            <p className="text-blue-50 text-sm mt-1">{hospital}</p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <HiAcademicCap className="text-blue-500" />
                            About Me
                        </h2>

                        {!isEditingAbout && (
                            <button
                                onClick={() => setIsEditingAbout(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
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
                                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-37.5 resize-y"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveAbout}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg"
                                >
                                    <HiCheck className="w-5 h-5" />
                                    Save
                                </button>

                                <button
                                    onClick={handleCancelAbout}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg"
                                >
                                    <HiX className="w-5 h-5" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about}</p>
                    )}
                </div>

                {/* Professional Info */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <HiBriefcase className="text-blue-500" />
                        Professional Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
        <div className={`flex items-start gap-4 p-4 bg-blue-50 rounded-xl ${fullWidth ? "md:col-span-2" : ""}`}>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-md">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">{title}</h3>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );
}

export default DocProfile;