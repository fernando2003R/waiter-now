import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const PizzaHutLogo: React.FC<LogoProps> = ({ 
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
      <rect width="100" height="100" fill="#EE3124" rx="15"/>
      
      {/* Techo de la cabaña */}
      <path
        d="M20 45 L50 25 L80 45 Z"
        fill="#8B4513"
      />
      
      {/* Pared de la cabaña */}
      <rect x="25" y="45" width="50" height="30" fill="#D2691E"/>
      
      {/* Puerta */}
      <rect x="40" y="55" width="20" height="20" fill="#654321"/>
      
      {/* Ventana */}
      <rect x="30" y="50" width="8" height="8" fill="#87CEEB"/>
      <rect x="62" y="50" width="8" height="8" fill="#87CEEB"/>
      
      {/* Texto Pizza Hut */}
      <text 
        x="50" 
        y="90" 
        textAnchor="middle" 
        fill="white" 
        fontSize="10" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        Pizza Hut
      </text>
    </svg>
  );
};

export default PizzaHutLogo;