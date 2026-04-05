import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api/config.js';

const initialFormState = {
	name: '',
	email: '',
	phone: '',
	amount: '500',
	note: '',
};

const paymentEndpoint =
	import.meta.env.VITE_RAZORPAY_ORDER_API_URL || `${API_BASE_URL}/payments/create-order`;

function Payment() {
	const [formData, setFormData] = useState(initialFormState);
	const [loading, setLoading] = useState(false);
	const [backendResponse, setBackendResponse] = useState(null);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({
			...current,
			[name]: value,
		}));
	};

	const validateForm = () => {
		const trimmedName = formData.name.trim();
		const trimmedEmail = formData.email.trim();
		const trimmedPhone = formData.phone.trim();
		const amountValue = Number(formData.amount);

		if (!trimmedName) {
			toast.error('Please enter your name.');
			return false;
		}

		if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			toast.error('Please enter a valid email address.');
			return false;
		}

		if (!trimmedPhone || !/^[0-9+\-()\s]{7,15}$/.test(trimmedPhone)) {
			toast.error('Please enter a valid phone number.');
			return false;
		}

		if (!Number.isFinite(amountValue) || amountValue <= 0) {
			toast.error('Please enter a valid amount.');
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setBackendResponse(null);

		const payload = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			phone: formData.phone.trim(),
			amount: Number(formData.amount),
			note: formData.note.trim(),
		};

		try {
			const response = await fetch(paymentEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const responseData = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(responseData?.message || 'Unable to create payment order.');
			}

			setBackendResponse(responseData);
			toast.success('Payment details sent to the backend successfully.');
		} catch (error) {
			toast.error(error.message || 'Something went wrong while creating payment.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="payment-page"
			style={{
				minHeight: '100vh',
				padding: '32px 16px',
				background:
					'radial-gradient(circle at top, rgba(14, 165, 233, 0.14), transparent 28%), linear-gradient(135deg, #f8fbff 0%, #eef6ff 48%, #fefefe 100%)',
			}}
		>
			<div
				style={{
					maxWidth: '1100px',
					margin: '0 auto',
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '24px',
					alignItems: 'stretch',
				}}
			>
				<section
					style={{
						background: 'rgba(255, 255, 255, 0.88)',
						backdropFilter: 'blur(18px)',
						border: '1px solid rgba(148, 163, 184, 0.18)',
						borderRadius: '28px',
						padding: '32px',
						boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
					}}
				>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px',
							padding: '8px 14px',
							borderRadius: '999px',
							background: 'rgba(14, 165, 233, 0.12)',
							color: '#0369a1',
							fontWeight: 600,
							fontSize: '14px',
							marginBottom: '18px',
						}}
					>
						Razorpay test checkout
					</div>

					<h1 style={{ margin: '0 0 12px', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0f172a' }}>
						Payment Details
					</h1>
					<p style={{ margin: '0 0 24px', color: '#475569', lineHeight: 1.7 }}>
						Fill in the customer information below and send it to your backend order API for Razorpay testing.
					</p>

					<div
						style={{
							display: 'grid',
							gap: '14px',
							padding: '18px',
							borderRadius: '20px',
							background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(59, 130, 246, 0.05))',
							color: '#1e293b',
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
							<span style={{ color: '#64748b' }}>Backend endpoint</span>
							<span style={{ fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>{paymentEndpoint}</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
							<span style={{ color: '#64748b' }}>Mode</span>
							<span style={{ fontWeight: 600 }}>Test / Sandbox</span>
						</div>
					</div>
				</section>

				<section
					style={{
						background: '#ffffff',
						borderRadius: '28px',
						padding: '32px',
						boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
						border: '1px solid rgba(148, 163, 184, 0.16)',
					}}
				>
					<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
						<div>
							<label style={labelStyle} htmlFor="name">
								Full name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter user name"
								style={inputStyle}
							/>
						</div>

						<div>
							<label style={labelStyle} htmlFor="email">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter email address"
								style={inputStyle}
							/>
						</div>

						<div>
							<label style={labelStyle} htmlFor="phone">
								Phone number
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								value={formData.phone}
								onChange={handleChange}
								placeholder="Enter phone number"
								style={inputStyle}
							/>
						</div>

						<div>
							<label style={labelStyle} htmlFor="amount">
								Amount
							</label>
							<input
								id="amount"
								name="amount"
								type="number"
								min="1"
								step="1"
								value={formData.amount}
								onChange={handleChange}
								placeholder="500"
								style={inputStyle}
							/>
						</div>

						<div>
							<label style={labelStyle} htmlFor="note">
								Note
							</label>
							<textarea
								id="note"
								name="note"
								rows="4"
								value={formData.note}
								onChange={handleChange}
								placeholder="Optional note for the payment order"
								style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							style={{
								...buttonStyle,
								opacity: loading ? 0.75 : 1,
								cursor: loading ? 'not-allowed' : 'pointer',
							}}
						>
							{loading ? 'Creating order...' : 'Proceed to Razorpay'}
						</button>
					</form>

					{backendResponse && (
						<div
							style={{
								marginTop: '20px',
								padding: '18px',
								borderRadius: '18px',
								background: '#f8fafc',
								border: '1px solid #e2e8f0',
								color: '#0f172a',
							}}
						>
							<div style={{ fontWeight: 700, marginBottom: '8px' }}>Backend response</div>
							<pre style={responseStyle}>{JSON.stringify(backendResponse, null, 2)}</pre>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

const labelStyle = {
	display: 'block',
	marginBottom: '8px',
	fontSize: '14px',
	fontWeight: 600,
	color: '#334155',
};

const inputStyle = {
	width: '100%',
	borderRadius: '16px',
	border: '1px solid #cbd5e1',
	background: '#fff',
	padding: '14px 16px',
	fontSize: '15px',
	color: '#0f172a',
	outline: 'none',
	boxSizing: 'border-box',
};

const buttonStyle = {
	border: 'none',
	borderRadius: '16px',
	padding: '14px 18px',
	fontSize: '16px',
	fontWeight: 700,
	color: '#fff',
	background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
	boxShadow: '0 16px 30px rgba(37, 99, 235, 0.25)',
};

const responseStyle = {
	margin: 0,
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',
	fontSize: '13px',
	lineHeight: 1.6,
	color: '#334155',
};

export default Payment;
