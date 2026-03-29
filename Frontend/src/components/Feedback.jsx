import React from 'react'
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa'

function Feedback() {
    const feedbacks = [
        {
            id: 1,
            name: "John Smith",
            rating: 5,
            comment: "Excellent service! The doctor was very professional and took time to explain everything. Highly recommended!",
            date: "2026-02-28"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            rating: 4,
            comment: "Great experience overall. The appointment booking was smooth and the doctor was knowledgeable. Would visit again.",
            date: "2026-02-25"
        },
        {
            id: 3,
            name: "Michael Brown",
            rating: 5,
            comment: "Outstanding care and attention. The platform made it so easy to book an appointment. Thank you!",
            date: "2026-02-20"
        },
        {
            id: 4,
            name: "Emily Davis",
            rating: 4,
            comment: "Very satisfied with the consultation. The doctor was patient and answered all my questions thoroughly.",
            date: "2026-02-15"
        }
    ];

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= rating ? (
                            <FaStar className="text-yellow-400 text-sm" />
                        ) : (
                            <FaRegStar className="text-gray-300 text-sm" />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Feedback</h2>
                <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    <FaUserCircle className="text-gray-400 text-5xl" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    {/* Header with name and rating */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {feedback.name}
                                        </h3>
                                        {renderStars(feedback.rating)}
                                    </div>

                                    {/* Comment */}
                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                        {feedback.comment}
                                    </p>

                                    {/* Date */}
                                    <p className="text-xs text-gray-500">
                                        {new Date(feedback.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Feedback
