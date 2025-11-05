import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const StarbucksLogo: React.FC<LogoProps> = ({ 
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
      <circle cx="50" cy="50" r="45" fill="#00704A"/>
      
      {/* Círculo interior */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2"/>
      
      {/* Sirena simplificada */}
      {/* Cabeza */}
      <circle cx="50" cy="40" r="8" fill="white"/>
      
      {/* Corona */}
      <path
        d="M42 35 L46 30 L50 32 L54 30 L58 35"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Cabello/Cola */}
      <path
        d="M35 45 Q42 50 35 60 M65 45 Q58 50 65 60"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Cuerpo */}
      <ellipse cx="50" cy="55" rx="6" ry="10" fill="white"/>
      
      {/* Cola de sirena */}
      <path
        d="M44 65 Q40 70 45 75 M56 65 Q60 70 55 75"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Texto STARBUCKS */}
      <path
        d="M20 25 Q50 15 80 25"
        id="topCurve"
        fill="none"
      />
      <text fontSize="6" fill="white" fontFamily="Arial" fontWeight="bold">
        <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
          STARBUCKS
        </textPath>
      </text>
      
      <path
        d="M20 75 Q50 85 80 75"
        id="bottomCurve"
        fill="none"
      />
      <text fontSize="6" fill="white" fontFamily="Arial" fontWeight="bold">
        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
          COFFEE
        </textPath>
      </text>
    </svg>
  );
};

export default StarbucksLogo;