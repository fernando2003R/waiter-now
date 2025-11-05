import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const McDonaldsLogo: React.FC<LogoProps> = ({ 
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
      <rect width="100" height="100" fill="#DA020E" rx="15"/>
      
      {/* Arcos dorados (M) */}
      <path
        d="M20 75 Q30 25 40 75"
        stroke="#FFC72C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 75 Q50 25 60 75"
        stroke="#FFC72C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60 75 Q70 25 80 75"
        stroke="#FFC72C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default McDonaldsLogo;