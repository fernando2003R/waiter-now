import React from 'react';

interface DominosLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const DominosLogo: React.FC<DominosLogoProps> = ({ 
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
      {/* Fondo circular blanco */}
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2"/>
      
      {/* Domino principal - mitad azul */}
      <rect x="25" y="25" width="50" height="25" rx="3" fill="#0052CC"/>
      
      {/* Domino principal - mitad roja */}
      <rect x="25" y="50" width="50" height="25" rx="3" fill="#E31837"/>
      
      {/* Línea divisoria */}
      <line x1="25" y1="50" x2="75" y2="50" stroke="#FFFFFF" strokeWidth="2"/>
      
      {/* Puntos del domino - parte azul */}
      <circle cx="35" cy="35" r="3" fill="#FFFFFF"/>
      <circle cx="50" cy="35" r="3" fill="#FFFFFF"/>
      <circle cx="65" cy="35" r="3" fill="#FFFFFF"/>
      
      {/* Puntos del domino - parte roja */}
      <circle cx="40" cy="60" r="3" fill="#FFFFFF"/>
      <circle cx="60" cy="60" r="3" fill="#FFFFFF"/>
      
      {/* Texto "DOMINO'S" */}
      <text 
        x="50" 
        y="88" 
        textAnchor="middle" 
        fontSize="8" 
        fontWeight="bold" 
        fill="#0052CC"
        fontFamily="Arial, sans-serif"
      >
        DOMINO'S
      </text>
      
      {/* Sombra del domino */}
      <rect x="27" y="27" width="50" height="25" rx="3" fill="none" stroke="#000000" strokeWidth="1" opacity="0.1"/>
    </svg>
  );
};