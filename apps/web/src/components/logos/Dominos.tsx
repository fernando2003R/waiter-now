import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const DominosLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo azul */}
      <rect width="100" height="100" fill="#0052CC" rx="15"/>
      
      {/* Dominó */}
      <rect x="25" y="20" width="50" height="60" fill="white" rx="8"/>
      
      {/* Línea divisoria */}
      <line x1="25" y1="50" x2="75" y2="50" stroke="#0052CC" strokeWidth="2"/>
      
      {/* Puntos del dominó - parte superior */}
      <circle cx="40" cy="35" r="3" fill="#0052CC"/>
      <circle cx="60" cy="35" r="3" fill="#0052CC"/>
      
      {/* Puntos del dominó - parte inferior */}
      <circle cx="35" cy="60" r="3" fill="#E31837"/>
      <circle cx="50" cy="60" r="3" fill="#E31837"/>
      <circle cx="65" cy="60" r="3" fill="#E31837"/>
      <circle cx="35" cy="70" r="3" fill="#E31837"/>
      <circle cx="50" cy="70" r="3" fill="#E31837"/>
      <circle cx="65" cy="70" r="3" fill="#E31837"/>
      
      {/* Texto Domino's */}
      <text 
        x="50" 
        y="92" 
        textAnchor="middle" 
        fill="white" 
        fontSize="9" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        Domino's
      </text>
    </svg>
  );
};

export default DominosLogo;