import React from 'react';

interface SunburstRaysProps {
  color?: string;
  size?: number;
  className?: string;
}

export const SunburstRays: React.FC<SunburstRaysProps> = ({
  color = 'rgba(255, 215, 0, 0.15)',
  size = 360,
  className = ''
}) => {
  const raysCount = 16;
  const angleStep = 360 / raysCount;

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full animate-[spin_18s_linear_infinite]"
        style={{
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)'
        }}
      >
        {Array.from({ length: raysCount }).map((_, i) => {
          const startAngle = (i * angleStep * Math.PI) / 180;
          const endAngle = ((i * angleStep + angleStep * 0.5) * Math.PI) / 180;
          const x1 = 100 + 120 * Math.cos(startAngle);
          const y1 = 100 + 120 * Math.sin(startAngle);
          const x2 = 100 + 120 * Math.cos(endAngle);
          const y2 = 100 + 120 * Math.sin(endAngle);

          return (
            <path
              key={i}
              d={`M 100 100 L ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} Z`}
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
};
