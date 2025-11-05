import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const PrestoLogo: React.FC<LogoProps> = ({ 
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
      {/* Fondo verde */}
      <rect width="100" height="100" fill="#228B22" rx="15"/>
      
      {/* Círculo blanco */}
      <circle cx="50" cy="50" r="35" fill="white"/>
      
      {/* Pizza estilizada */}
      {/* Base de la pizza */}
      <circle cx="50" cy="50" r="25" fill="#DEB887"/>
      
      {/* Salsa de tomate */}
      <circle cx="50" cy="50" r="22" fill="#DC143C"/>
      
      {/* Queso */}
      <circle cx="50" cy="50" r="20" fill="#FFD700"/>
      
      {/* Pepperoni */}
      <circle cx="45" cy="45" r="3" fill="#8B0000"/>
      <circle cx="55" cy="40" r="3" fill="#8B0000"/>
      <circle cx="60" cy="55" r="3" fill="#8B0000"/>
      <circle cx="40" cy="60" r="3" fill="#8B0000"/>
      
      {/* Líneas de división de pizza */}
      <line x1="50" y1="30" x2="50" y2="70" stroke="white" strokeWidth="1"/>
      <line x1="30" y1="50" x2="70" y2="50" stroke="white" strokeWidth="1"/>
      <line x1="36" y1="36" x2="64" y2="64" stroke="white" strokeWidth="1"/>
      <line x1="64" y1="36" x2="36" y2="64" stroke="white" strokeWidth="1"/>
      
      {/* Texto PRESTO */}
      <text 
        x="50" 
        y="85" 
        textAnchor="middle" 
        fill="white" 
        fontSize="10" 
        fontWeight="bold" 
        fontFamily="Arial"
      >
        PRESTO
      </text>
    </svg>
  );
};

export default PrestoLogo;