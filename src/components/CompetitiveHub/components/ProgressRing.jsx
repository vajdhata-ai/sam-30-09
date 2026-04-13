import React from 'react';

/**
 * Animated circular progress ring.
 * @param {number} percent - 0 to 100
 * @param {number} size - SVG size in pixels
 * @param {string} color - stroke color
 * @param {number} strokeWidth - ring thickness
 */
const ProgressRing = ({ percent = 0, size = 120, color = '#6366F1', strokeWidth = 8, children }) => {
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-200 dark:text-slate-700"
                />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children || (
                    <span className="text-xl font-bold" style={{ color }}>{Math.round(percent)}%</span>
                )}
            </div>
        </div>
    );
};

export default ProgressRing;
