import React from 'react';
import { GameMode, LevelObjective } from '../models/GameModels.ts';
import { Settings } from 'lucide-react';

interface SmoziTopHudProps {
  gameMode: GameMode;
  score: number;
  highScore: number;
  levelNumber: number;
  objective?: LevelObjective;
  movesLeft: number;
  isNewHighScore?: boolean;
  onPauseClick: () => void;
  className?: string;
}

export const SmoziTopHud: React.FC<SmoziTopHudProps> = ({
  gameMode,
  score,
  highScore,
  levelNumber,
  objective,
  movesLeft,
  isNewHighScore = false,
  onPauseClick,
  className = ''
}) => {
  return (
    <div
      className={`w-full max-w-[440px] mx-auto px-4 py-2 flex flex-col items-center select-none ${className}`}
    >
      {/* Top navigation row */}
      <div className="w-full flex items-center justify-between">
        {/* Crown + High score */}
        <div
          onClick={onPauseClick}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-xl">👑</span>
          <span className="text-lg font-black text-amber-400 tracking-wide">
            {highScore}
          </span>
        </div>

        {/* Adventure Level Indicator */}
        {gameMode === GameMode.ADVENTURE && (
          <div className="px-3.5 py-1 rounded-full bg-[#1B2B54] border border-[#38559E] shadow-sm">
            <span className="text-sm font-bold text-white tracking-wide">
              Level {levelNumber}
            </span>
          </div>
        )}

        {/* Settings gear with red notification dot */}
        <button
          onClick={onPauseClick}
          className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 active:scale-90 transition-transform cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-[#A5B8E8]" />
          <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 border border-white flex items-center justify-center text-[8px] font-black text-white">
            !
          </div>
        </button>
      </div>

      {/* Giant white score */}
      <div className="flex flex-col items-center mt-1">
        {isNewHighScore && (
          <span className="text-blue-400 text-lg font-black animate-bounce">
            ◆ NEW HIGH SCORE ◆
          </span>
        )}
        <div className="text-5xl font-black text-white tracking-tight drop-shadow-md transition-transform duration-150">
          {score}
        </div>
      </div>

      {/* Adventure Objective & Moves Left Bar */}
      {gameMode === GameMode.ADVENTURE && objective && (
        <div className="w-full max-w-[360px] mt-2 px-3 py-1.5 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center space-x-2 text-indigo-200">
            <span>Target:</span>
            <span className="text-white font-extrabold">
              {objective.currentAmount} / {objective.targetAmount}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-indigo-200">Moves:</span>
            <span
              className={`font-black text-sm ${
                movesLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            >
              {movesLeft}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
