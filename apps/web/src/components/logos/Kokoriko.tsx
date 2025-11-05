import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const KokorikoLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo naranja */}
      <rect width="100" height="100" fill="#FF6600" rx="15"/>
      
      {/* Círculo blanco */}
      <circle cx="50" cy="50" r="35" fill="white"/>
      
      {/* Gallo estilizado */}
      {/* Cuerpo */}
      <ellipse cx="50" cy="60" rx="18" ry="15" fill="#FF6600"/>
      
      {/* Cabeza */}
      <circle cx="50" cy="40" r="12" fill="#FF6600"/>
      
      {/* Cresta */}
      <path d="M45 28 L48 22 L50 25 L52 22 L55 28 Z" fill="#DC143C"/>
      
      {/* Pico */}
      <path d="M42 40 L35 42 L42 44 Z" fill="#FFD700"/>
      
      {/* Ojo */}
      <circle cx="48" cy="38" r="2" fill="white"/>
      <circle cx="48" cy="38" r="1" fill="black"/>
      
      {/* Barbilla */}
      <ellipse cx="45" cy="48" rx="3" ry="5" fill="#DC143C"/>
      
      {/* Cola */}
      <path d="M65 50 Q75 45 70 60 Q68 55 65 50" fill="#228B22"/>
      <path d="M68 48 Q78 43 73 58 Q71 53 68 48" fill="#0066CC"/>
      
      {/* Texto KOKORIKO */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fill="#FF6600" 
        fontSize="8" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        KOKORIKO
      </text>
    </svg>
  );
};

export default KokorikoLogo;