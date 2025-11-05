import React from 'react';

interface JuanValdezLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const JuanValdezLogo: React.FC<JuanValdezLogoProps> = ({ 
  width = 64, 
  height = 64, 
  className = "" 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fondo circular verde */}
      <circle cx="50" cy="50" r="48" fill="#2D5016" stroke="#1A3009" strokeWidth="2"/>
      
      {/* Montañas de fondo */}
      <path 
        d="M 10 70 Q 25 50 40 60 Q 55 45 70 55 Q 85 40 100 50 L 100 85 L 10 85 Z" 
        fill="#4A7C59" 
        opacity="0.6"
      />
      
      {/* Sombrero */}
      <ellipse cx="50" cy="25" rx="18" ry="6" fill="#8B4513"/>
      <ellipse cx="50" cy="23" rx="16" ry="4" fill="#A0522D"/>
      
      {/* Cara */}
      <circle cx="50" cy="40" r="12" fill="#D2B48C"/>
      
      {/* Bigote */}
      <ellipse cx="50" cy="45" rx="8" ry="2" fill="#654321"/>
      
      {/* Ojos */}
      <circle cx="46" cy="38" r="1.5" fill="#000000"/>
      <circle cx="54" cy="38" r="1.5" fill="#000000"/>
      
      {/* Granos de café */}
      <ellipse cx="30" cy="60" rx="3" ry="5" fill="#8B4513" transform="rotate(15 30 60)"/>
      <ellipse cx="70" cy="65" rx="3" ry="5" fill="#8B4513" transform="rotate(-20 70 65)"/>
      <ellipse cx="25" cy="75" rx="2.5" ry="4" fill="#A0522D" transform="rotate(45 25 75)"/>
      <ellipse cx="75" cy="75" rx="2.5" ry="4" fill="#A0522D" transform="rotate(-30 75 75)"/>
      
      {/* Taza de café */}
      <rect x="40" y="55" width="20" height="15" rx="2" fill="#FFFFFF"/>
      <rect x="42" y="57" width="16" height="11" rx="1" fill="#8B4513"/>
      
      {/* Asa de la taza */}
      <path 
        d="M 60 60 Q 65 60 65 65 Q 65 70 60 70" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="2"
      />
      
      {/* Vapor */}
      <path 
        d="M 45 55 Q 47 50 45 48 Q 43 46 45 44" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        opacity="0.7"
      />
      <path 
        d="M 50 55 Q 52 50 50 48 Q 48 46 50 44" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        opacity="0.7"
      />
      <path 
        d="M 55 55 Q 57 50 55 48 Q 53 46 55 44" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
        opacity="0.7"
      />
      
      {/* Texto "100% COLOMBIANO" */}
      <text 
        x="50" 
        y="88" 
        textAnchor="middle" 
        fontSize="6" 
        fontWeight="bold" 
        fill="#FFD700"
        fontFamily="Arial, sans-serif"
      >
        100% COLOMBIANO
      </text>
    </svg>
  );
};