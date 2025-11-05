import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const JuanValdezLogo: React.FC<LogoProps> = ({ 
  width = 60, 
  height = 60, 
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
      {/* Fondo marrón café */}
      <rect width="100" height="100" fill="#8B4513" rx="15"/>
      
      {/* Círculo blanco */}
      <circle cx="50" cy="50" r="35" fill="white"/>
      
      {/* Taza de café */}
      <ellipse cx="50" cy="55" rx="18" ry="15" fill="#8B4513"/>
      <ellipse cx="50" cy="52" rx="16" ry="13" fill="#654321"/>
      <ellipse cx="50" cy="50" rx="14" ry="11" fill="#2F1B14"/>
      
      {/* Vapor del café */}
      <path d="M45 35 Q47 30 45 25" stroke="#D3D3D3" strokeWidth="2" fill="none"/>
      <path d="M50 35 Q52 30 50 25" stroke="#D3D3D3" strokeWidth="2" fill="none"/>
      <path d="M55 35 Q57 30 55 25" stroke="#D3D3D3" strokeWidth="2" fill="none"/>
      
      {/* Asa de la taza */}
      <path d="M68 50 Q75 50 75 60 Q75 65 68 65" 
            stroke="#8B4513" 
            strokeWidth="3" 
            fill="none"/>
      
      {/* Granos de café decorativos */}
      <ellipse cx="35" cy="35" rx="3" ry="5" fill="#8B4513" transform="rotate(45 35 35)"/>
      <ellipse cx="65" cy="35" rx="3" ry="5" fill="#8B4513" transform="rotate(-45 65 35)"/>
      
      {/* Texto Juan Valdez */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fill="white" 
        fontSize="7" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        JUAN VALDEZ
      </text>
    </svg>
  );
};

export default JuanValdezLogo;