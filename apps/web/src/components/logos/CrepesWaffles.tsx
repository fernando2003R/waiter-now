import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const CrepesWafflesLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo rosa */}
      <rect width="100" height="100" fill="#FF69B4" rx="15"/>
      
      {/* Círculo blanco */}
      <circle cx="50" cy="50" r="35" fill="white"/>
      
      {/* Waffle estilizado */}
      {/* Base del waffle */}
      <rect x="35" y="40" width="30" height="25" fill="#DEB887" rx="3"/>
      
      {/* Patrón de cuadrícula del waffle */}
      <line x1="40" y1="40" x2="40" y2="65" stroke="#8B7355" strokeWidth="1"/>
      <line x1="45" y1="40" x2="45" y2="65" stroke="#8B7355" strokeWidth="1"/>
      <line x1="50" y1="40" x2="50" y2="65" stroke="#8B7355" strokeWidth="1"/>
      <line x1="55" y1="40" x2="55" y2="65" stroke="#8B7355" strokeWidth="1"/>
      <line x1="60" y1="40" x2="60" y2="65" stroke="#8B7355" strokeWidth="1"/>
      
      <line x1="35" y1="45" x2="65" y2="45" stroke="#8B7355" strokeWidth="1"/>
      <line x1="35" y1="50" x2="65" y2="50" stroke="#8B7355" strokeWidth="1"/>
      <line x1="35" y1="55" x2="65" y2="55" stroke="#8B7355" strokeWidth="1"/>
      <line x1="35" y1="60" x2="65" y2="60" stroke="#8B7355" strokeWidth="1"/>
      
      {/* Fresa encima */}
      <ellipse cx="45" cy="35" rx="4" ry="6" fill="#DC143C"/>
      <path d="M43 30 L45 28 L47 30" stroke="#228B22" strokeWidth="2" fill="none"/>
      
      {/* Crema */}
      <ellipse cx="55" cy="37" rx="6" ry="4" fill="#FFFACD"/>
      
      {/* Texto C&W */}
      <text 
        x="50" 
        y="80" 
        textAnchor="middle" 
        fill="#FF69B4" 
        fontSize="8" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        C&W
      </text>
      
      <text 
        x="50" 
        y="90" 
        textAnchor="middle" 
        fill="#FF69B4" 
        fontSize="6" 
        fontFamily="Arial"
      >
        Crepes & Waffles
      </text>
    </svg>
  );
};

export default CrepesWafflesLogo;