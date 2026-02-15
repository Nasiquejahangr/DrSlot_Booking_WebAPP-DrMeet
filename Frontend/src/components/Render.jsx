import React from 'react'

function Render({ size = 40, strokeWidth = 6, color = "#14b8a6" }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    return (
        <div className='mt-20 flex items-center justify-center'>
            <div className='relative' style={{ width: size, height: size }}>
                <svg
                    className='animate-spin'
                    width={size}
                    height={size}
                    style={{ animationDuration: '1s' }}
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Animated progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>
            </div>
        </div>
    )
}

export default Render
