import React, { useEffect, useRef } from 'react';

interface WaiterNowLogoProps {
  width?: number;
  height?: number;
  className?: string;
  background?: string;
}

export const WaiterNowLogo: React.FC<WaiterNowLogoProps> = ({
  width = 300,
  height = 300,
  className = '',
  background = '#f5f5dc'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // Scale factor for responsive design
    const scale = Math.min(width / 300, height / 300);
    ctx.scale(scale, scale);

    // Draw waiter figure - matching the original image exactly
    // Head (beige/cream color)
    ctx.beginPath();
    ctx.arc(75, 65, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#f5f5dc';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Hair (dark navy)
    ctx.beginPath();
    ctx.fillStyle = '#2c3e50';
    ctx.ellipse(75, 45, 30, 20, 0, 0, Math.PI);
    ctx.fill();

    // Body/Suit (dark navy)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(50, 90, 50, 60);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 90, 50, 60);

    // White shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(65, 95);
    ctx.lineTo(85, 95);
    ctx.lineTo(80, 105);
    ctx.lineTo(70, 105);
    ctx.closePath();
    ctx.fill();

    // Bow tie (orange/brown)
    ctx.fillStyle = '#d2691e';
    ctx.beginPath();
    ctx.moveTo(65, 105);
    ctx.lineTo(70, 100);
    ctx.lineTo(80, 100);
    ctx.lineTo(85, 105);
    ctx.lineTo(80, 110);
    ctx.lineTo(70, 110);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bow tie center knot
    ctx.beginPath();
    ctx.arc(75, 105, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Phone/Tablet (light blue)
    ctx.fillStyle = '#5dade2';
    ctx.fillRect(20, 70, 40, 60);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 70, 40, 60);

    // Phone screen (white/cream)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(25, 75, 30, 40);

    // Green status bar on screen
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(27, 78, 26, 5);

    // Phone home button
    ctx.beginPath();
    ctx.arc(40, 120, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Hourglass (right side)
    // Top part
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(120, 70, 30, 8);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 70, 30, 8);

    // Bottom part
    ctx.fillRect(120, 112, 30, 8);
    ctx.strokeRect(120, 112, 30, 8);

    // Hourglass sides
    ctx.beginPath();
    ctx.moveTo(122, 78);
    ctx.lineTo(148, 78);
    ctx.lineTo(138, 95);
    ctx.lineTo(132, 95);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(122, 112);
    ctx.lineTo(148, 112);
    ctx.lineTo(138, 95);
    ctx.lineTo(132, 95);
    ctx.closePath();
    ctx.stroke();

    // Sand in bottom half
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(125, 112);
    ctx.lineTo(145, 112);
    ctx.lineTo(138, 100);
    ctx.lineTo(132, 100);
    ctx.closePath();
    ctx.fill();

    // Text "WAITER NOW" - bold and prominent
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WAITER', 150, 180);
    ctx.fillText('NOW', 150, 230);

  }, [width, height, background]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{ backgroundColor: background }}
      />
    </div>
  );
};

// Compact version for smaller spaces
export const WaiterNowLogoCompact: React.FC<Omit<WaiterNowLogoProps, 'showText'>> = ({
  width = 80,
  height = 80,
  className = '',
  background = 'transparent'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill background if not transparent
    if (background !== 'transparent') {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    }

    // Scale factor for responsive design
    const scale = Math.min(width / 80, height / 80);
    ctx.scale(scale, scale);

    // Draw waiter figure (scaled down) - matching original image style
    // Head (beige/cream color)
    ctx.beginPath();
    ctx.arc(20, 17, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f5f5dc';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hair (dark navy)
    ctx.beginPath();
    ctx.fillStyle = '#2c3e50';
    ctx.ellipse(20, 12, 7, 5, 0, 0, Math.PI);
    ctx.fill();

    // Body/Suit (dark navy)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(14, 23, 12, 15);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 23, 12, 15);

    // White shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(17, 25);
    ctx.lineTo(23, 25);
    ctx.lineTo(21, 28);
    ctx.lineTo(19, 28);
    ctx.closePath();
    ctx.fill();

    // Bow tie (orange/brown)
    ctx.fillStyle = '#d2691e';
    ctx.beginPath();
    ctx.moveTo(17, 28);
    ctx.lineTo(19, 26);
    ctx.lineTo(21, 26);
    ctx.lineTo(23, 28);
    ctx.lineTo(21, 30);
    ctx.lineTo(19, 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Bow tie center knot
    ctx.beginPath();
    ctx.arc(20, 28, 0.8, 0, 2 * Math.PI);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Phone/Tablet (light blue)
    ctx.fillStyle = '#5dade2';
    ctx.fillRect(5, 18, 10, 15);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 18, 10, 15);

    // Phone screen (white/cream)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(6, 20, 8, 10);

    // Green status bar on screen
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(6.5, 21, 7, 1.5);

    // Phone home button
    ctx.beginPath();
    ctx.arc(10, 31, 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Hourglass (right side)
    // Top part
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(32, 18, 8, 2);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 18, 8, 2);

    // Bottom part
    ctx.fillRect(32, 29, 8, 2);
    ctx.strokeRect(32, 29, 8, 2);

    // Hourglass sides
    ctx.beginPath();
    ctx.moveTo(32.5, 20);
    ctx.lineTo(39.5, 20);
    ctx.lineTo(37, 24.5);
    ctx.lineTo(35, 24.5);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(32.5, 29);
    ctx.lineTo(39.5, 29);
    ctx.lineTo(37, 24.5);
    ctx.lineTo(35, 24.5);
    ctx.closePath();
    ctx.stroke();

    // Sand in bottom half
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(33, 29);
    ctx.lineTo(39, 29);
    ctx.lineTo(37, 26);
    ctx.lineTo(35, 26);
    ctx.closePath();
    ctx.fill();

    // Text "WAITER NOW" - bold and prominent
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 10px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WAITER', 40, 47);
    ctx.fillText('NOW', 40, 58);

  }, [width, height, background]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded ${className}`}
      style={{ backgroundColor: background !== 'transparent' ? background : undefined }}
    />
  );
};

// Text only version
export const WaiterNowText: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`font-black text-gray-900 ${sizeClasses[size]} ${className} leading-tight`} style={{fontFamily: 'Arial Black, sans-serif'}}>
      <div>WAITER</div>
      <div>NOW</div>
    </div>
  );
};