import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogin } from '../../api/adminApi/index.js';
import { FaEnvelope, FaLock, FaShieldAlt, FaCheckCircle, FaUserShield, FaChartLine, FaHospitalAlt } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const response = await adminLogin(email, password);

            // Store admin info in sessionStorage
            sessionStorage.setItem('admin', JSON.stringify(response));
            sessionStorage.setItem('adminId', response.id);
            sessionStorage.setItem('adminEmail', response.email);

            toast.success('Admin login successful!');

            // Redirect to admin dashboard
            navigate('/admin');
        } catch (error) {
            toast.error(error.message || 'Login failed');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-4xl bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative overflow-hidden bg-linear-to-br from-[#1a79f7] via-[#1968d6] to-[#0b3f91] p-8 lg:p-12 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />
                    <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-8 left-8 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />

                    <div className="relative flex h-full flex-col justify-between gap-10">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                                <FaUserShield />
                                Admin Access Portal
                            </div>
                            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                                Manage doctors with confidence.
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                                Sign in to review registrations, approve doctor profiles, and keep the healthcare platform secure and organized.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                            <InfoPill icon={<FaCheckCircle />} title="Approval Workflow" text="Review pending doctors and manage access in one place." />
                            <InfoPill icon={<FaChartLine />} title="Real-time Oversight" text="Track registered doctors with a clear status dashboard." />
                            <InfoPill icon={<FaHospitalAlt />} title="Healthcare Control" text="Protect the platform by approving verified professionals only." />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1a79f7] shadow-sm ring-1 ring-blue-100">
                                <FaShieldAlt className="text-2xl" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
                            <p className="mt-2 text-sm text-slate-500">Use your registered admin credentials to continue.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,82,182,0.08)]">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-linear-to-r from-[#1a79f7] to-[#0f52b6] px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Login to Admin Panel'
                                )}
                            </button>

                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                Need an account? Admins are registered via API only.
                                <span className="mt-1 block font-semibold text-[#1a79f7]">Register through Postman, then sign in here.</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

function InfoPill({ icon, title, text }) {
    return (
        <div className="flex items-start gap-4 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm shadow-lg shadow-black/5">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-blue-100">{text}</p>
            </div>
        </div>
    );
}

export default AdminLogin;
