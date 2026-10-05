import React from 'react';
import { SmoziBlockView } from './SmoziBlockView.tsx';
import { BlockColorType } from '../models/BlockColor.ts';

export const SmoziLogoView: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Decorative background mini blocks backing the logo */}
      <div className="flex space-x-1.5 -mb-5 z-0 opacity-80">
        <div className="w-6 h-6"><SmoziBlockView color={BlockColorType.YELLOW} /></div>
        <div className="w-7 h-7"><SmoziBlockView color={BlockColorType.RED} /></div>
        <div className="w-6 h-6"><SmoziBlockView color={BlockColorType.BLUE} /></div>
        <div className="w-7 h-7"><SmoziBlockView color={BlockColorType.GREEN} /></div>
        <div className="w-6 h-6"><SmoziBlockView color={BlockColorType.PURPLE} /></div>
      </div>

      {/* Candy 3D "SMOZI" letters */}
      <div className="relative flex items-center justify-center z-10 space-x-0.5">
        <CandyLetter char="S" fromColor="#FFCC00" toColor="#FF9500" />
        <CandyLetter char="M" fromColor="#68B1FF" toColor="#007AFF" />
        <CandyLetter char="O" fromColor="#D396F1" toColor="#AF52DE" />
        <CandyLetter char="Z" fromColor="#FFD600" toColor="#FF8800" />
        <CandyLetter char="I" fromColor="#75E6E0" toColor="#00C7BE" />
      </div>
    </div>
  );
};

const CandyLetter: React.FC<{ char: string; fromColor: string; toColor: string }> = ({
  char,
  fromColor,
  toColor
}) => {
  return (
    <div className="relative font-black text-5xl tracking-tighter px-0.5 drop-shadow-[0_6px_8px_rgba(0,0,0,0.8)]">
      {/* Outer dark stroke */}
      <span
        className="absolute inset-0 text-slate-950 translate-y-1 select-none pointer-events-none"
        style={{
          WebkitTextStroke: '6px #0A1138'
        }}
      >
        {char}
      </span>
      {/* White mid stroke */}
      <span
        className="absolute inset-0 text-white select-none pointer-events-none"
        style={{
          WebkitTextStroke: '3px white'
        }}
      >
        {char}
      </span>
      {/* Front gradient fill */}
      <span
        className="relative bg-clip-text text-transparent select-none"
        style={{
          backgroundImage: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`
        }}
      >
        {char}
      </span>
    </div>
  );
};
