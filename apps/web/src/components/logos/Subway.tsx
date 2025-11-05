import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const SubwayLogo: React.FC<LogoProps> = ({ 
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
      <rect width="100" height="100" fill="#FFCC00" rx="15"/>
      
      {/* Fondo verde para el texto */}
      <rect x="10" y="35" width="80" height="30" fill="#00A651" rx="5"/>
      
      {/* Texto SUBWAY */}
      <text 
        x="50" 
        y="55" 
        textAnchor="middle" 
        fill="white" 
        fontSize="14" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        SUBWAY
      </text>
      
      {/* Flechas decorativas */}
      <path
        d="M15 25 L25 20 L25 30 Z"
        fill="#00A651"
      />
      <path
        d="M85 75 L75 70 L75 80 Z"
        fill="#00A651"
      />
    </svg>
  );
};

export default SubwayLogo;