import React from 'react';

const PalanLogo = () => {
    return (
        <svg width="70" height="70" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}>
            <defs>
                {/* Silver Metallic Gradient for the Border */}
                <linearGradient id="silverBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0e0e0" />
                    <stop offset="30%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#9e9e9e" />
                    <stop offset="70%" stopColor="#d1d5db" />
                    <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>

                {/* 3D Depth Gradient for the Outer Circle */}
                <radialGradient id="circleDepth" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#262626" />
                    <stop offset="100%" stopColor="#000000" />
                </radialGradient>

                {/* Drop shadow for the white paw to give it a 3D pop effect */}
                <filter id="pawShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* Outer Silver Ring (3D Border) */}
            <circle cx="50" cy="50" r="46" fill="url(#silverBorder)" />

            {/* Inner Dark Circle (Black Background) */}
            <circle cx="50" cy="50" r="42" fill="url(#circleDepth)" />

            {/* White 3D Paw Print Inside */}
            <g fill="#ffffff" filter="url(#pawShadow)">
                {/* Toe 1 (Top Left) */}
                <ellipse cx="38" cy="38" rx="6" ry="7.5" transform="rotate(-15 38 38)" />
                {/* Toe 2 (Top Right) */}
                <ellipse cx="62" cy="38" rx="6" ry="7.5" transform="rotate(15 62 62)" />
                {/* Toe 3 (Far Left) */}
                <ellipse cx="26" cy="52" rx="5.5" ry="7" transform="rotate(-35 26 52)" />
                {/* Toe 4 (Far Right) */}
                <ellipse cx="74" cy="52" rx="5.5" ry="7" transform="rotate(35 74 52)" />
                
                {/* Main Pad */}
                <path d="M50 58c-8 0-14 5-14 11.5 0 5.5 4.5 10.5 14 10.5s14-5 14-10.5c0-6.5-6-11.5-14-11.5z" />
            </g>
        </svg>
    );
};

export default PalanLogo;