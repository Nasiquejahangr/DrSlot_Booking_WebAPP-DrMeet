import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createPaymentOrder, getPaymentPublicKey, verifyPaymentOrder } from '../api/userApi';

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isPaying, setIsPaying] = useState(false);

    const paymentData = location.state || {};
    const doctor = paymentData?.doctor || null;
    const user = paymentData?.user || null;
    const booking = paymentData?.booking || null;

    const isValidData = Boolean(
        doctor?.id &&
        user?.id &&
        booking?.date &&
        booking?.time
    );

    const payableAmount = useMemo(() => Number(doctor?.fee || 0), [doctor]);
    const formattedDate = booking?.date
        ? new Date(booking.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '';

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handlePayNow = async () => {
        if (!isValidData || isPaying) {
            return;
        }

        try {
            setIsPaying(true);

            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                throw new Error('Unable to load Razorpay. Please check internet and retry.');
            }

            const order = await createPaymentOrder({
                name: user?.name || 'Patient',
                email: user?.email || '',
                phoneNumber: String(user?.phoneNumber || '').replace(/\D/g, '').slice(-10),
                amount: payableAmount,
                userId: Number(user.id),
                doctorId: Number(doctor.id),
                doctorName: doctor.name || 'Doctor',
                appointmentDate: booking.date,
                appointmentTime: booking.time,
            });

            const orderKey = String(order?.key || '').trim();
            const fetchedKey = await getPaymentPublicKey();
            const cleanKey = orderKey || fetchedKey;
            const cleanOrderId = String(order?.orderId || '').trim();
            const cleanContact = String(user?.phoneNumber || '').replace(/\D/g, '').slice(-10);

            if (!cleanOrderId || !cleanKey) {
                throw new Error('Invalid payment order response.');
            }

            if (!(Number(order?.amount) > 0)) {
                throw new Error('Invalid payment amount.');
            }

            const options = {
                key: cleanKey,
                amount: Number(order.amount),
                currency: order.currency || 'INR',
                name: 'DrMeet',
                description: `Appointment with ${doctor.name || 'Doctor'}`,
                order_id: cleanOrderId,
                prefill: {
                    name: user?.name || 'Patient',
                    email: user?.email || '',
                    ...(cleanContact ? { contact: cleanContact } : {}),
                },
                notes: {
                    doctorId: String(doctor.id),
                    doctorName: doctor.name || 'Doctor',
                    appointmentDate: booking.date,
                    appointmentTime: booking.time,
                    userId: String(user.id),
                },
                theme: {
                    color: '#1a79f7',
                },
                handler: async (response) => {
                    try {
                        await verifyPaymentOrder(response);
                        toast.success('Payment successful. Appointment booked!');
                        navigate('/appointment');
                    } catch (verifyError) {
                        toast.error(verifyError?.message || 'Payment verification failed.');
                    } finally {
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsPaying(false);
                        toast.info('Payment cancelled.');
                    },
                },
                retry: {
                    enabled: true,
                    max_count: 2,
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', (response) => {
                setIsPaying(false);
                const reason = response?.error?.description || response?.error?.reason || 'Payment failed.';
                toast.error(reason);
            });
            paymentObject.open();
        } catch (error) {
            toast.error(error?.message || 'Payment failed. Please try again.');
            setIsPaying(false);
        }
    };

    if (!isValidData) {
        return (
            <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50 p-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-4xl border border-blue-100 shadow-xl p-7 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-100/60 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-indigo-100/60 blur-2xl" />
                    <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                            <FaUserMd className="text-[#1a79f7] text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment details missing</h2>
                        <p className="text-gray-600 mb-6">Please select doctor, date and time first.</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="w-full bg-[#1a79f7] hover:bg-[#1563d1] text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-md"
                        >
                            Go to Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-slate-50 p-4 pb-28">
            <div className="max-w-3xl mx-auto">
                <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#1a79f7] via-[#2f8dff] to-[#0f52b6] text-white p-6 shadow-2xl mb-5">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Secure payment</p>
                            <h1 className="text-3xl font-bold leading-tight">Confirm your appointment</h1>
                            <p className="text-blue-100 mt-1 max-w-xl">Review your booking summary and complete payment securely with Razorpay.</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 shrink-0">
                            <p className="text-blue-100 text-xs uppercase tracking-[0.2em] mb-1">Total Payable</p>
                            <p className="text-4xl font-extrabold">₹{payableAmount}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-5">
                        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Doctor Information</h2>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1a79f7] border border-blue-100">Verified doctor</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                                    {doctor.profileImage ? (
                                        <img src={doctor.profileImage} alt={doctor.name || 'Doctor'} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserMd className="text-blue-500 text-3xl" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 truncate">{doctor.name || 'Doctor'}</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">{doctor.specialization || 'Specialist'}</p>
                                    <p className="text-sm text-gray-500 mt-1">{doctor.qualification || ''}</p>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                        <FaMapMarkerAlt className="text-[#1a79f7] shrink-0" />
                                        <span className="truncate">{doctor.clinicLocation || doctor.hospitalName || 'Clinic'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Appointment Summary</h2>
                                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">Ready to pay</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <FaCalendarAlt className="text-[#1a79f7]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                        <p className="font-semibold text-gray-900">{formattedDate}</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <FaClock className="text-[#1a79f7]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                                        <p className="font-semibold text-gray-900">{booking.time}</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3 sm:col-span-2">
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <FaUser className="text-[#1a79f7]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Patient</p>
                                        <p className="font-semibold text-gray-900 truncate">{user.name || 'Patient'} {user.email ? `(${user.email})` : ''}</p>
                                        {user.phoneNumber && <p className="text-sm text-gray-500 mt-0.5">{user.phoneNumber}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Consultation fee</span>
                                    <span className="font-semibold text-gray-900">₹{payableAmount}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Platform fee</span>
                                    <span className="font-semibold text-gray-900">₹0</span>
                                </div>
                                <div className="h-px bg-gray-100 my-2" />
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-base font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-extrabold text-[#1a79f7]">₹{payableAmount}</span>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-sm font-semibold text-[#1a79f7] mb-1">Secure payment powered by Razorpay</p>
                                <p className="text-sm text-gray-600">Your payment is encrypted and your appointment is confirmed automatically after success.</p>
                            </div>

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
                                    disabled={isPaying}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePayNow}
                                    className="flex-[1.35] bg-linear-to-r from-[#1a79f7] to-[#0f52b6] hover:from-[#1563d1] hover:to-[#0c4aa3] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isPaying}
                                >
                                    {isPaying ? 'Processing Payment...' : `Pay ₹${payableAmount}`}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5">
                            <h3 className="text-base font-bold text-gray-900 mb-3">What happens next?</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#1a79f7] flex items-center justify-center font-bold shrink-0">1</span>
                                    <p>Payment is created with your name, email, phone number, doctor, date, and time.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#1a79f7] flex items-center justify-center font-bold shrink-0">2</span>
                                    <p>Razorpay opens securely for card, UPI, or wallet payment.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#1a79f7] flex items-center justify-center font-bold shrink-0">3</span>
                                    <p>After success, appointment status becomes <span className="font-semibold text-green-700">SUCCESS</span> and you are redirected to your appointments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
