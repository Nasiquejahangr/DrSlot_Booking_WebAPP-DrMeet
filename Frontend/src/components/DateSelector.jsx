import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

function DateSelector({ onDateSelect, selectedDate }) {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        // Generate next 7 days starting from today
        const generateDates = () => {
            const datesArray = [];
            const today = new Date();

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                datesArray.push({
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    date: date.getDate(),
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD format
                });
            }

            setDates(datesArray);
        };

        generateDates();

        // Auto-update every day at midnight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const midnightTimer = setTimeout(() => {
            generateDates();
            // Set up daily interval after first midnight
            const dailyInterval = setInterval(generateDates, 24 * 60 * 60 * 1000);
            return () => clearInterval(dailyInterval);
        }, timeUntilMidnight);

        return () => clearTimeout(midnightTimer);
    }, []);

    const handleDateClick = (dateInfo) => {
        if (onDateSelect) {
            onDateSelect(dateInfo);
        }
    };

    return (
        <>
            <div className="p-1">
                {/* Header */}
                <div className="flex items-center h-1 w-[20%] gap-2 mb-4">
                    <FaCalendarAlt className="text-xl text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-800">Date</h2>
                </div>

                {/* Date Cards */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {dates.map((dateInfo, index) => (
                        <div
                            key={index}
                            onClick={() => handleDateClick(dateInfo)}
                            className={`
                            min-w-20 flex flex-col items-center justify-center 
                            px-7 py-3 rounded-2xl border cursor-pointer
                            transition-all duration-200 hover:shadow-md h-25
                            ${selectedDate === dateInfo.fullDate
                                    ? 'border-[#1a79f7] bg-blue-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                }
                        `}
                        >
                            <p className={`text-sm font-medium mb-1 ${selectedDate === dateInfo.fullDate ? 'text-[#1a79f7]' : 'text-gray-600'}`}>
                                {dateInfo.day}
                            </p>
                            <p className={`text-xl font-bold mb-1 ${selectedDate === dateInfo.fullDate ? 'text-[#1a79f7]' : 'text-gray-800'}`}>
                                {dateInfo.date}
                            </p>
                            <p className={`text-sm font-medium ${selectedDate === dateInfo.fullDate ? 'text-[#1a79f7]' : 'text-gray-600'}`}>
                                {dateInfo.month}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default DateSelector;
