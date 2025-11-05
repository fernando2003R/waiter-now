import React from 'react';

interface StarbucksLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const StarbucksLogo: React.FC<StarbucksLogoProps> = ({ 
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
      <circle cx="50" cy="50" r="48" fill="#00704A" stroke="#004D33" strokeWidth="2"/>
      
      {/* Círculo interior blanco */}
      <circle cx="50" cy="50" r="40" fill="#FFFFFF"/>
      
      {/* Círculo verde interior */}
      <circle cx="50" cy="50" r="35" fill="#00704A"/>
      
      {/* Sirena - cabeza */}
      <ellipse cx="50" cy="40" rx="8" ry="10" fill="#FFFFFF"/>
      
      {/* Corona de la sirena */}
      <path 
        d="M 42 32 Q 46 28 50 30 Q 54 28 58 32 Q 58 35 55 37 Q 52 35 50 37 Q 48 35 45 37 Q 42 35 42 32" 
        fill="#FFFFFF"
      />
      
      {/* Cabello */}
      <path 
        d="M 40 38 Q 42 35 45 38 Q 48 40 50 38 Q 52 40 55 38 Q 58 35 60 38 Q 60 45 58 50 Q 55 48 52 50 Q 50 52 48 50 Q 45 48 42 50 Q 40 45 40 38" 
        fill="#FFFFFF"
      />
      
      {/* Cara */}
      <ellipse cx="50" cy="45" rx="6" ry="8" fill="#FFFFFF"/>
      
      {/* Ojos */}
      <circle cx="47" cy="43" r="1" fill="#00704A"/>
      <circle cx="53" cy="43" r="1" fill="#00704A"/>
      
      {/* Nariz */}
      <ellipse cx="50" cy="46" rx="0.5" ry="1" fill="#00704A"/>
      
      {/* Boca */}
      <path d="M 48 48 Q 50 50 52 48" fill="none" stroke="#00704A" strokeWidth="1"/>
      
      {/* Cuerpo de la sirena */}
      <ellipse cx="50" cy="60" rx="12" ry="15" fill="#FFFFFF"/>
      
      {/* Brazos */}
      <ellipse cx="38" cy="55" rx="4" ry="8" fill="#FFFFFF" transform="rotate(-30 38 55)"/>
      <ellipse cx="62" cy="55" rx="4" ry="8" fill="#FFFFFF" transform="rotate(30 62 55)"/>
      
      {/* Cola de sirena */}
      <path 
        d="M 40 70 Q 45 75 50 72 Q 55 75 60 70 Q 58 78 55 80 Q 50 82 45 80 Q 42 78 40 70" 
        fill="#FFFFFF"
      />
      
      {/* Texto "STARBUCKS" en círculo */}
      <path 
        id="circle-text" 
        d="M 50,15 A 35,35 0 1,1 49.9,15" 
        fill="none"
      />
      <text fontSize="6" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="bold">
        <textPath href="#circle-text" startOffset="25%">
          STARBUCKS COFFEE
        </textPath>
      </text>
    </svg>
  );
};