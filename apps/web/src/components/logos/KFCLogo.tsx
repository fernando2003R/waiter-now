import React from 'react';

interface KFCLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const KFCLogo: React.FC<KFCLogoProps> = ({ 
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
      <circle cx="50" cy="50" r="48" fill="#E4002B" stroke="#B8001F" strokeWidth="2"/>
      
      {/* Fondo blanco para el logo */}
      <circle cx="50" cy="50" r="40" fill="#FFFFFF"/>
      
      {/* Cara del Coronel Sanders */}
      <ellipse cx="50" cy="45" rx="15" ry="18" fill="#F5DEB3"/>
      
      {/* Cabello blanco */}
      <path 
        d="M 35 35 Q 40 25 50 30 Q 60 25 65 35 Q 65 40 60 42 Q 55 40 50 42 Q 45 40 40 42 Q 35 40 35 35" 
        fill="#FFFFFF"
      />
      
      {/* Bigote */}
      <ellipse cx="50" cy="50" rx="12" ry="3" fill="#FFFFFF"/>
      
      {/* Perilla */}
      <ellipse cx="50" cy="58" rx="4" ry="6" fill="#FFFFFF"/>
      
      {/* Ojos */}
      <circle cx="45" cy="42" r="2" fill="#000000"/>
      <circle cx="55" cy="42" r="2" fill="#000000"/>
      
      {/* Gafas */}
      <circle cx="45" cy="42" r="4" fill="none" stroke="#000000" strokeWidth="1"/>
      <circle cx="55" cy="42" r="4" fill="none" stroke="#000000" strokeWidth="1"/>
      <line x1="49" y1="42" x2="51" y2="42" stroke="#000000" strokeWidth="1"/>
      
      {/* Corbata de moño */}
      <path 
        d="M 45 62 L 55 62 L 52 68 L 48 68 Z" 
        fill="#000000"
      />
      <ellipse cx="50" cy="65" rx="3" ry="2" fill="#000000"/>
      
      {/* Texto "KFC" */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fontSize="12" 
        fontWeight="bold" 
        fill="#E4002B"
        fontFamily="Arial, sans-serif"
      >
        KFC
      </text>
      
      {/* Borde decorativo */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="#E4002B" strokeWidth="2"/>
    </svg>
  );
};