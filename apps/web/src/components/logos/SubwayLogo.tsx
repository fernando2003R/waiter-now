import React from 'react';

interface SubwayLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const SubwayLogo: React.FC<SubwayLogoProps> = ({ 
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
      {/* Fondo circular verde */}
      <circle cx="50" cy="50" r="48" fill="#00A651" stroke="#007A3D" strokeWidth="2"/>
      
      {/* Fondo blanco para el logo */}
      <ellipse cx="50" cy="50" rx="40" ry="35" fill="#FFFFFF"/>
      
      {/* Sandwich base */}
      <ellipse cx="50" cy="65" rx="35" ry="8" fill="#D2B48C"/>
      
      {/* Lechuga */}
      <ellipse cx="50" cy="58" rx="32" ry="4" fill="#228B22"/>
      
      {/* Tomate */}
      <ellipse cx="45" cy="55" rx="4" ry="2" fill="#FF6347"/>
      <ellipse cx="55" cy="55" rx="4" ry="2" fill="#FF6347"/>
      
      {/* Queso */}
      <ellipse cx="50" cy="52" rx="30" ry="3" fill="#FFD700"/>
      
      {/* Carne */}
      <ellipse cx="50" cy="48" rx="28" ry="4" fill="#8B4513"/>
      
      {/* Pan superior */}
      <ellipse cx="50" cy="42" rx="32" ry="8" fill="#DEB887"/>
      
      {/* Texto "SUBWAY" */}
      <text 
        x="50" 
        y="35" 
        textAnchor="middle" 
        fontSize="10" 
        fontWeight="bold" 
        fill="#00A651"
        fontFamily="Arial, sans-serif"
      >
        SUBWAY
      </text>
      
      {/* Flechas características */}
      <path 
        d="M 20 25 L 30 30 L 20 35" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M 80 25 L 70 30 L 80 35" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Texto "EAT FRESH" */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fontSize="6" 
        fontWeight="bold" 
        fill="#00A651"
        fontFamily="Arial, sans-serif"
      >
        EAT FRESH
      </text>
    </svg>
  );
};