import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const KFCLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo rojo */}
      <rect width="100" height="100" fill="#E4002B" rx="15"/>
      
      {/* Cara del Coronel Sanders */}
      <circle cx="50" cy="45" r="25" fill="#F5F5DC"/>
      
      {/* Cabello blanco */}
      <path
        d="M30 30 Q50 20 70 30 Q65 25 50 25 Q35 25 30 30"
        fill="white"
      />
      
      {/* Bigote */}
      <ellipse cx="50" cy="50" rx="12" ry="3" fill="white"/>
      
      {/* Perilla */}
      <ellipse cx="50" cy="60" rx="4" ry="6" fill="white"/>
      
      {/* Corbata */}
      <rect x="45" y="65" width="10" height="15" fill="#000"/>
      
      {/* Texto KFC */}
      <text x="50" y="90" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">
        KFC
      </text>
    </svg>
  );
};

export default KFCLogo;