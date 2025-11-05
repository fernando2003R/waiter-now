import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ElCorralLogo: React.FC<LogoProps> = ({ 
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
      <rect width="100" height="100" fill="#C41E3A" rx="15"/>
      
      {/* Círculo blanco */}
      <circle cx="50" cy="50" r="35" fill="white"/>
      
      {/* Hamburguesa estilizada */}
      {/* Pan superior */}
      <ellipse cx="50" cy="35" rx="20" ry="8" fill="#D2691E"/>
      
      {/* Lechuga */}
      <ellipse cx="50" cy="42" rx="18" ry="3" fill="#228B22"/>
      
      {/* Carne */}
      <ellipse cx="50" cy="48" rx="18" ry="4" fill="#8B4513"/>
      
      {/* Queso */}
      <ellipse cx="50" cy="54" rx="18" ry="3" fill="#FFD700"/>
      
      {/* Pan inferior */}
      <ellipse cx="50" cy="62" rx="20" ry="8" fill="#D2691E"/>
      
      {/* Texto EL CORRAL */}
      <text 
        x="50" 
        y="80" 
        textAnchor="middle" 
        fill="#C41E3A" 
        fontSize="8" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        EL CORRAL
      </text>
    </svg>
  );
};

export default ElCorralLogo;