import React from 'react';

interface FleurDeLisProps {
    size?: number;
    color?: string;
    className?: string;
}

export const FleurDeLis: React.FC<FleurDeLisProps> = ({
    size = 20,
    color = "currentColor",
    className = ""
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill={color}
        className={className}
        aria-hidden="true"
    >
        <path d="M50 5 C45 15 35 20 30 30 C25 40 30 50 50 50 C70 50 75 40 70 30 C65 20 55 15 50 5Z" />
        <path d="M50 95 C45 85 35 80 30 70 C25 60 30 50 50 50 C70 50 75 60 70 70 C65 80 55 85 50 95Z" />
        <path d="M5 50 C15 45 20 35 30 30 C40 25 50 30 50 50 C50 70 40 75 30 70 C20 65 15 55 5 50Z" />
        <path d="M95 50 C85 45 80 35 70 30 C60 25 50 30 50 50 C50 70 60 75 70 70 C80 65 85 55 95 50Z" />
        <circle cx="50" cy="50" r="8" />
    </svg>
);
