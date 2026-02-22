import React, { useState, useRef } from 'react';
import { HiUser, HiMail, HiPhone, HiBriefcase, HiAcademicCap, HiPencil, HiCheck, HiX, HiCamera } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { CiLocationOn } from 'react-icons/ci';

function DocProfile() {

    // Get doctor info from localStorage
    const fileInputRef = useRef(null); // useRef for hidden file input
    const [profileImage, setProfileImage] = useState(localStorage.getItem('doctorProfileImage') || null);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [about, setAbout] = useState(localStorage.getItem('doctorAbout') || 'I am a dedicated healthcare professional committed to providing exceptional patient care...');

    const Doctordata = {
        name: localStorage.getItem('doctorName') || 'Dr. Md Nasique',
        email: localStorage.getItem('doctorEmail') || 'nasiquejahangir000@gmail.com',
        specialization: localStorage.getItem('doctorSpecialization') || 'General Physician',
        workingExperience: localStorage.getItem('doctorExperience') || '5 years',
        phone: localStorage.getItem('doctorPhone') || '+91 9508904653',
        hospital: localStorage.getItem('doctorHospital') || 'City Hospital',
        license: localStorage.getItem('doctorLicense') || 'MED123456',
        clinicLocation: localStorage.getItem('doctorClinicLocation') || 'Mumbai'
    };

    // Destructure doctor data for easier access
    const { name, email, specialization, workingExperience, phone, hospital, license, clinicLocation } = Doctordata;





    // Handle save and cancel for About section
    const handleSaveAbout = () => {
        localStorage.setItem('doctorAbout', about);
        setIsEditingAbout(false);
        toast.success('About section updated successfully!');
    };

    // Handle cancel - reset about to last saved value
    const handleCancelAbout = () => {
        setAbout(localStorage.getItem('doctorAbout') || 'I am a dedicated healthcare professional committed to providing exceptional patient care...');
        setIsEditingAbout(false);
    };



    // Handle profile image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image (JPG, PNG)');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should not exceed 2MB');
                return;
            }

            // Convert image to base64 and store in localStorage
            const reader = new FileReader(); // Create a FileReader to read the file

            // When the file is read successfully, this function will be called
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileImage(base64String);
                localStorage.setItem('doctorProfileImage', base64String);
                toast.success('Profile image updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger file input click
    const handleEditImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-blue-50 via-white to-cyan-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">


                {/* Header Card */}
                <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <HiUser className="w-16 h-16 text-white" />
                                )}
                            </div>
                            {/* Edit icon overlay */}
                            <button
                                onClick={handleEditImageClick}
                                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110"
                                title="Change profile picture"
                            >
                                <HiCamera className="w-4 h-4 text-white" />
                            </button>
                            {/* Hidden file input */}
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <HiAcademicCap className="text-blue-500" />
                            About Me
                        </h2>
                        {!isEditingAbout && (
                            <button
                                onClick={() => setIsEditingAbout(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
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
                                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2
                                 focus:ring-blue-200 outline-none transition-all min-h-37.5 resize-y"
                                placeholder="Write about yourself, your experience, qualifications, and approach to patient care..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveAbout}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    <HiCheck className="w-5 h-5" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelAbout}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
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




                {/* Professional Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <HiBriefcase className="text-blue-500" />
                        Professional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center  shadow-md">
                                <HiUser className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Full Name</h3>
                                <p className="text-gray-800 font-medium">{name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                                <HiMail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Email</h3>
                                <p className="text-gray-800 font-medium break-all">{email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                <HiPhone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Phone</h3>
                                <p className="text-gray-800 font-medium">{phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                                <HiAcademicCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Specialization</h3>
                                <p className="text-gray-800 font-medium">{specialization}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                <HiBriefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Experience</h3>
                                <p className="text-gray-800 font-medium">{workingExperience}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center  shadow-md">
                                <HiBriefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Hospital</h3>
                                <p className="text-gray-800 font-medium">{hospital}</p>
                            </div>
                        </div>

                        {/* // Clinic Location */}
                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center  shadow-md">

                                <CiLocationOn className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Clinic Location</h3>
                                <p className="text-gray-800 font-medium">{clinicLocation}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow md:col-span-2">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                <HiAcademicCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Medical License Number</h3>
                                <p className="text-gray-800 font-medium">{license}</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default DocProfile
