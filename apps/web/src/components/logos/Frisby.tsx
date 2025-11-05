import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const FrisbyLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo amarillo */}
      <rect width="100" height="100" fill="#FFD700" rx="15"/>
      
      {/* Círculo rojo */}
      <circle cx="50" cy="50" r="35" fill="#DC143C"/>
      
      {/* Pollo estilizado */}
      {/* Cuerpo del pollo */}
      <ellipse cx="50" cy="55" rx="15" ry="20" fill="white"/>
      
      {/* Cabeza del pollo */}
      <circle cx="50" cy="35" r="10" fill="white"/>
      
      {/* Pico */}
      <path d="M45 35 L40 37 L45 39 Z" fill="#FFA500"/>
      
      {/* Ojo */}
      <circle cx="48" cy="33" r="2" fill="black"/>
      
      {/* Cresta */}
      <path d="M48 25 L50 20 L52 25 Z" fill="#DC143C"/>
      
      {/* Alas */}
      <ellipse cx="40" cy="50" rx="8" ry="12" fill="#F0F0F0"/>
      <ellipse cx="60" cy="50" rx="8" ry="12" fill="#F0F0F0"/>
      
      {/* Texto FRISBY */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fill="white" 
        fontSize="10" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        FRISBY
      </text>
    </svg>
  );
};

export default FrisbyLogo;