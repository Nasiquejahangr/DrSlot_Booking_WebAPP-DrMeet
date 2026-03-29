import React, { useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function DoctorRegistration() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [hospitalName, setHospitalName] = useState("");
    const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
    const [workingExperience, setWorkingExperience] = useState("");
    const [clinicLocation, setClinicLocation] = useState("");
    const [qualification, setQualification] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [fee, setFee] = useState("");


    function handleFileChange(e) {
        //  Handle certificate upload with validation
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

            if (!validTypes.includes(file.type)) {
                toast.error("Please upload a valid certificate (PDF, JPG, or PNG)");
                e.target.value = null;
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should not exceed 5MB");
                e.target.value = null;
                return;
            }

            setCertificate(file);
        }
    }



    function handleSubmit(e) {
        e.preventDefault();


        // Password validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Phone validation
        if (!/^\d{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit phone number!");
            return;
        }

        // License validation
        if (medicalLicenseNumber.length < 10) {
            toast.error("Please enter a valid medical license number!");
            return;
        }



        if (fee <= 0 || fee > 1000) {
            toast.error("Please enter a valid fee (between 0 and 1000)!");
            return;
        }
        // Get existing doctors array AND check for duplicates
        const doctorarray = JSON.parse(localStorage.getItem("doctors")) || [];

        //  Check duplicate email
        const emailExists = doctorarray.find(doc => doc.email === email);

        if (emailExists) {
            toast.error("Doctor already registered with this email!");
            return;
        }

        //  Create new doctor object
        const newDoctor = {
            id: Date.now(),
            fullName,
            email,
            phone,
            password,
            specialization,
            qualification,
            hospitalName,
            medicalLicenseNumber,
            workingExperience,
            clinicLocation,
            fee,
            certificate: certificate ? certificate.name : null,
            profileImage: null,
            about: 'I am a dedicated healthcare professional committed to providing exceptional patient care...',
            //slot for user managed by doctor in dashboard
            slots: {}
        };

        //  Add to array
        doctorarray.push(newDoctor);

        //  Save back to localStorage
        localStorage.setItem("doctors", JSON.stringify(doctorarray));



        // Save login session
        localStorage.setItem("token", "doctorLoggedIn");
        localStorage.setItem("userType", "doctor");
        localStorage.setItem("currentDoctorId", newDoctor.id);

        toast.success("Doctor registration successful!");

        setTimeout(() => {
            navigate("/Dashboard");
        }, 1500);
    }

    return (
        <>
            <div className='flex justify-center align-bottom mt-10 mb-20'>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col bg-white justify-center p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] w-[95%] max-w-2xl gap-5">
                    <div className='flex justify-center mb-2'>
                        <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
                    </div>
                    <h2 className="text-2xl text-center font-bold mb-4 text-gray-700">
                        Doctor Registration
                    </h2>

                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Full Name *</label>
                        <input
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Email *</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="doctor@hospital.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Phone Number *</label>
                        <input
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="1234567890"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Password *</label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Confirm Password *</label>
                        <input
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Specialization *</label>
                        <input
                            required
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="e.g., Cardiologist"
                        />
                    </div>

                    {/* Qualification */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Qualification *</label>
                        <input
                            required
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="e.g., MBBS, MD"
                        />
                    </div>

                    {/* Hospital */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">
                            Hospital Name / Clinic Name *
                        </label>
                        <input
                            required
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="City Hospital"
                        />
                    </div>

                    {/* Clinic Location */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Clinic Location *</label>
                        <input
                            required
                            value={clinicLocation}
                            onChange={(e) => setClinicLocation(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Delhi"
                        />
                    </div>

                    {/* License */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">
                            Medical License Number *
                        </label>
                        <input
                            required
                            value={medicalLicenseNumber}
                            onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="MED123456"
                        />
                    </div>


                    {/* fees */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Fee *</label>
                        <input
                            required
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="500"
                        />
                    </div>

                    {/* Working Experience */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2">Working Experience *</label>
                        <input
                            required
                            value={workingExperience}
                            onChange={(e) => setWorkingExperience(e.target.value)}
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="5 years"
                        />
                    </div>


                    {/* Certificate */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-3">
                            Upload Certificate <span className="text-sm font-normal text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleFileChange}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                id="certificate-upload"
                                className="hidden"
                            />
                            <label
                                htmlFor="certificate-upload"
                                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-[#1a79f7] rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-200"
                            >
                                <div className="text-center">
                                    <p className="text-2xl mb-2">📄</p>
                                    <p className="text-[#1a79f7] font-semibold mb-1">Click to upload certificate</p>
                                    <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </label>
                        </div>
                        {certificate && (
                            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-green-600 text-xl">✓</span>
                                    <div>
                                        <p className="text-sm text-gray-700 font-medium">{certificate.name}</p>
                                        <p className="text-xs text-gray-500">{(certificate.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCertificate(null)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm font-semibold"
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Register as Doctor
                    </button>
                    <a href="/login" className="text-[#1563d1] font-bold hover:underline text-center block mt-4">
                        Already have an account? Login
                    </a>
                </form>

            </div>
        </>
    );
}

export default DoctorRegistration;