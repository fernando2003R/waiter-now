import React from 'react';

interface BurgerKingLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BurgerKingLogo: React.FC<BurgerKingLogoProps> = ({ 
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
      {/* Fondo circular azul */}
      <circle cx="50" cy="50" r="48" fill="#0066CC" stroke="#003D7A" strokeWidth="2"/>
      
      {/* Hamburguesa base */}
      <ellipse cx="50" cy="75" rx="35" ry="8" fill="#8B4513"/>
      
      {/* Pan inferior */}
      <ellipse cx="50" cy="72" rx="32" ry="6" fill="#DEB887"/>
      
      {/* Lechuga */}
      <ellipse cx="50" cy="65" rx="30" ry="4" fill="#228B22"/>
      
      {/* Carne */}
      <ellipse cx="50" cy="60" rx="28" ry="5" fill="#8B4513"/>
      
      {/* Queso */}
      <ellipse cx="50" cy="55" rx="26" ry="3" fill="#FFD700"/>
      
      {/* Pan superior */}
      <ellipse cx="50" cy="50" rx="30" ry="8" fill="#DEB887"/>
      <ellipse cx="50" cy="47" rx="28" ry="6" fill="#F4A460"/>
      
      {/* Semillas de sésamo */}
      <circle cx="42" cy="48" r="1.5" fill="#FFFFFF"/>
      <circle cx="48" cy="45" r="1.5" fill="#FFFFFF"/>
      <circle cx="55" cy="47" r="1.5" fill="#FFFFFF"/>
      <circle cx="58" cy="50" r="1.5" fill="#FFFFFF"/>
      
      {/* Corona */}
      <path 
        d="M 30 35 L 35 25 L 40 30 L 45 20 L 50 30 L 55 20 L 60 30 L 65 25 L 70 35 Z" 
        fill="#FFD700" 
        stroke="#FFA500" 
        strokeWidth="1"
      />
      
      {/* Texto "BK" */}
      <text 
        x="50" 
        y="38" 
        textAnchor="middle" 
        fontSize="12" 
        fontWeight="bold" 
        fill="#FFFFFF"
        fontFamily="Arial, sans-serif"
      >
        BK
      </text>
    </svg>
  );
};