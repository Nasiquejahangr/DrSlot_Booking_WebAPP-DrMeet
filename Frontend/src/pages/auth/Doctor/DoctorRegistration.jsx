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
    const [certificate, setCertificate] = useState(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (PDF, JPG, PNG)
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error("Please upload a valid certificate (PDF, JPG, or PNG)");
                e.target.value = null;
                return;
            }
            // Validate file size (max 5MB)
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

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Validate phone number
        if (!/^\d{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit phone number!");
            return;
        }

        // Validate medical license number (basic validation)
        if (medicalLicenseNumber.length < 10) {
            toast.error("Please enter a valid medical license number!");
            return;
        }

        // Save doctor data to localStorage
        localStorage.setItem("token", "doctorLoggedIn");
        localStorage.setItem("userType", "doctor");
        localStorage.setItem("isDoctor", "true");
        localStorage.setItem("doctorName", fullName);
        localStorage.setItem("doctorEmail", email);
        localStorage.setItem("doctorPhone", phone);
        localStorage.setItem("doctorSpecialization", specialization);
        localStorage.setItem("doctorHospital", hospitalName);
        localStorage.setItem("doctorLicense", medicalLicenseNumber);

        // In a real application, you would upload the certificate to a server
        if (certificate) {
            localStorage.setItem("doctorCertificateName", certificate.name);
        }

        toast.success("Doctor registration successful!");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
            navigate("/Dashboard");
        }, 1500);
    }

    return (
        <>
            <div className='flex justify-center align-bottom mt-10 mb-20'>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col bg-white justify-center p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.15)] w-[95%] max-w-2xl gap-5"
                >
                    <div className='flex justify-center mb-2'>
                        <img src={Logo} alt="Logo" className='w-20 h-20 object-contain' />
                    </div>
                    <h2 className="text-2xl text-center font-bold mb-4 text-gray-700">Doctor Registration</h2>

                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="fullName">Full Name *</label>
                        <input
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            id="fullName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email *</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="doctor@hospital.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number *</label>
                        <input
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            id="phone"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="1234567890"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password *</label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="specialization">Specialization *</label>
                        <input
                            required
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            type="text"
                            id="specialization"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="e.g., Cardiologist, Dermatologist"
                        />
                    </div>

                    {/* Hospital Name */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="hospitalName">Hospital Name *</label>
                        <input
                            required
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            type="text"
                            id="hospitalName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="City Hospital"
                        />
                    </div>

                    {/* Medical License Number */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-2" htmlFor="medicalLicenseNumber">Medical License Number *</label>
                        <input
                            required
                            value={medicalLicenseNumber}
                            onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                            type="text"
                            id="medicalLicenseNumber"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7]"
                            placeholder="MED123456"
                        />
                    </div>

                    {/* Upload Certificate */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="certificate">
                            Upload Certificate (Optional)
                        </label>
                        <input
                            onChange={handleFileChange}
                            type="file"
                            id="certificate"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a79f7] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1a79f7] file:text-white hover:file:bg-[#104b9a] file:cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                        {certificate && (
                            <p className="text-sm text-green-600 mt-2">✓ {certificate.name}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1a79f7] hover:bg-[#104b9a] text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Register as Doctor
                    </button>

                    <p className="text-center text-gray-700 mt-4">
                        Already have an account? <a href="/login" className="text-[#1563d1] font-bold hover:underline">Login</a>
                    </p>
                </form>
            </div>
        </>
    );
}

export default DoctorRegistration;
