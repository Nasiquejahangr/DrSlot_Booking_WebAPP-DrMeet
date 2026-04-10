import React, { useState } from 'react';
import Logo from '../../../assets/Logo.svg';
import { toast } from 'react-toastify';
import { doctorApi } from '../../../api/index';
import { FaStethoscope } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

function DoctorRegistration() {
    // const navigate = useNavigate();

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



    async function handleSubmit(e) {
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
        // for certificate if not upload toste message
        if (!certificate) {
            toast.error("Please upload your certificate!");
            return;
        }

        //  Create new doctor object
        const newDoctor = {
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
            approvalStatus: 'PENDING',
            //slot for user managed by doctor in dashboard
            slots: "{}"
        };

        newDoctor.slots = JSON.stringify(newDoctor.slots);
        newDoctor.fee = Number(newDoctor.fee);
        newDoctor.workingExperience = Number(newDoctor.workingExperience);

        try {
            await doctorApi.doctorRegister(newDoctor);
            toast.success("Registration submitted. Waiting for admin approval.");
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            toast.error(err?.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen bg-white px-3 py-4 sm:px-4 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-gray-100">
                <div className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6 sm:py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm sm:h-14 sm:w-14">
                            <img src={Logo} alt="Logo" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#1a79f7] sm:text-sm">Doctor onboarding</p>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Register as Doctor</h2>
                        </div>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                        Fill in your profile on mobile easily. Your registration will be reviewed by the admin team.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6 lg:p-8"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-[#1a79f7] shadow-sm">
                                <FaStethoscope className="text-xl" />
                            </div>
                        </div>

                    </div>

                    {/* Full Name */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name *</label>
                        <input
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Email *</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="doctor@hospital.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Phone Number *</label>
                        <input
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            inputMode="numeric"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="1234567890"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Password *</label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm Password *</label>
                        <input
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Specialization *</label>
                        <select
                            required
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="" disabled>Select your specialization</option>
                            <option value="General Physician">General Physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dentist">Dentist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                        </select>
                    </div>

                    {/* Qualification */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Qualification *</label>
                        <input
                            required
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            type="text"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="e.g., MBBS, MD"
                        />
                    </div>

                    {/* Hospital */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Hospital Name / Clinic Name *
                        </label>
                        <input
                            required
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            type="text"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="City Hospital"
                        />
                    </div>

                    {/* Clinic Location */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Clinic Location *</label>
                        <input
                            required
                            value={clinicLocation}
                            onChange={(e) => setClinicLocation(e.target.value)}
                            type="text"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="Delhi"
                        />
                    </div>

                    {/* License */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Medical License Number *
                        </label>
                        <input
                            required
                            value={medicalLicenseNumber}
                            onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                            type="text"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="MED123456"
                        />
                    </div>


                    {/* fees */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Fee *</label>
                        <input
                            required
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="500"
                        />
                    </div>

                    {/* Working Experience */}
                    <div className="mb-2 sm:mb-3">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Working Experience *</label>
                        <input
                            required
                            value={workingExperience}
                            onChange={(e) => setWorkingExperience(e.target.value)}
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#1a79f7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="5 years"
                        />
                    </div>


                    {/* Certificate */}
                    <div className="mb-4">
                        <label className="mb-3 block text-sm font-semibold text-gray-700">
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
                                className="flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-7 text-center transition-all duration-200 hover:border-[#1a79f7] hover:bg-blue-50 sm:py-8"
                            >
                                <div className="text-center">
                                    <p className="mb-2 text-2xl">📄</p>
                                    <p className="mb-1 font-semibold text-[#1a79f7]">Click to upload certificate</p>
                                    <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </label>
                        </div>
                        {certificate && (
                            <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl text-green-600">✓</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{certificate.name}</p>
                                        <p className="text-xs text-gray-500">{(certificate.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCertificate(null)}
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-[#1a79f7] px-4 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#104b9a] active:scale-[0.99] sm:text-lg"
                    >
                        Register as Doctor
                    </button>
                    <a href="/login" className="mt-2 block text-center font-bold text-[#1563d1] hover:underline">
                        Already have an account? Login
                    </a>
                </form>
            </div>
        </div>
    );
}

export default DoctorRegistration;