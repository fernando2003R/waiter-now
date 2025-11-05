import React from 'react';

interface McDonaldsLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const McDonaldsLogo: React.FC<McDonaldsLogoProps> = ({ 
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
      {/* Fondo circular rojo */}
      <circle cx="50" cy="50" r="48" fill="#DA020E" stroke="#B8001F" strokeWidth="2"/>
      
      {/* Arcos dorados de McDonald's */}
      <path 
        d="M 25 70 Q 25 35 40 35 Q 45 35 50 45 Q 55 35 60 35 Q 75 35 75 70 Q 75 75 70 75 Q 65 75 65 70 Q 65 45 60 45 Q 55 45 50 55 Q 45 45 40 45 Q 35 45 35 70 Q 35 75 30 75 Q 25 75 25 70 Z" 
        fill="#FFC72C"
      />
      
      {/* Sombra de los arcos */}
      <path 
        d="M 27 72 Q 27 37 42 37 Q 47 37 52 47 Q 57 37 62 37 Q 77 37 77 72" 
        fill="none" 
        stroke="#E6A800" 
        strokeWidth="2" 
        opacity="0.5"
      />
      
      {/* Texto "McDonald's" */}
      <text 
        x="50" 
        y="88" 
        textAnchor="middle" 
        fontSize="8" 
        fontWeight="bold" 
        fill="#FFC72C"
        fontFamily="Arial, sans-serif"
      >
        McDonald's
      </text>
    </svg>
  );
};