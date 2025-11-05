import React from 'react';

interface PizzaHutLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const PizzaHutLogo: React.FC<PizzaHutLogoProps> = ({ 
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
      
      {/* Techo rojo característico */}
      <path 
        d="M 20 45 Q 50 20 80 45 L 75 50 Q 50 30 25 50 Z" 
        fill="#E31837"
      />
      
      {/* Sombra del techo */}
      <path 
        d="M 22 47 Q 50 25 78 47 L 75 50 Q 50 30 25 50 Z" 
        fill="#B8001F" 
        opacity="0.6"
      />
      
      {/* Base del edificio */}
      <rect x="25" y="50" width="50" height="25" fill="#FFC72C"/>
      
      {/* Ventanas */}
      <rect x="30" y="55" width="8" height="8" fill="#E31837"/>
      <rect x="42" y="55" width="8" height="8" fill="#E31837"/>
      <rect x="54" y="55" width="8" height="8" fill="#E31837"/>
      <rect x="66" y="55" width="8" height="8" fill="#E31837"/>
      
      {/* Puerta */}
      <rect x="45" y="65" width="10" height="10" fill="#8B4513"/>
      <circle cx="53" cy="70" r="1" fill="#FFD700"/>
      
      {/* Texto "PIZZA HUT" */}
      <text 
        x="50" 
        y="88" 
        textAnchor="middle" 
        fontSize="8" 
        fontWeight="bold" 
        fill="#E31837"
        fontFamily="Arial, sans-serif"
      >
        PIZZA HUT
      </text>
      
      {/* Borde decorativo */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#E31837" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
};