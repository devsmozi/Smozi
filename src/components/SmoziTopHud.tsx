import React, { useState, useEffect, useRef } from 'react';
import { GameMode, LevelObjective } from '../models/GameModels.ts';
import { Settings } from 'lucide-react';

interface SmoziTopHudProps {
  gameMode: GameMode;
  score: number;
  highScore: number;
  levelNumber: number;
  levelTierLabel?: string;
  stageNumber?: number;
  stageDifficultyLabel?: string;
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
  levelTierLabel,
  stageNumber,
  stageDifficultyLabel,
  objective,
  movesLeft,
  isNewHighScore = false,
  onPauseClick,
  className = ''
}) => {
  const [isBumping, setIsBumping] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      setIsBumping(true);
      setShowSparkles(true);
      const timer = setTimeout(() => setIsBumping(false), 250);
      const sparkleTimer = setTimeout(() => setShowSparkles(false), 600);
      prevScoreRef.current = score;
      return () => {
        clearTimeout(timer);
        clearTimeout(sparkleTimer);
      };
    }
    prevScoreRef.current = score;
  }, [score]);

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

        {/* Mode Indicators */}
        {gameMode === GameMode.ADVENTURE && (
          <div className="px-3.5 py-1 rounded-full bg-[#1B2B54] border border-[#38559E] shadow-sm">
            <span className="text-sm font-bold text-white tracking-wide">
              Level {levelNumber}
            </span>
          </div>
        )}

        {gameMode === GameMode.DAILY_CHALLENGE && (
          <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/40 shadow-sm flex items-center space-x-1.5">
            <span className="text-xs font-black text-amber-300">
              Stage {stageNumber || 1}/3
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

      {/* Compact Animated Score Section */}
      <div className="relative flex items-center justify-center my-0.5 select-none min-h-[36px]">
        {/* Animated Floating Sparkles upon score tick */}
        {showSparkles && (
          <div className="absolute -inset-x-6 -inset-y-2 pointer-events-none flex items-center justify-between">
            <span className="text-amber-300 text-xs animate-ping">✨</span>
            <span className="text-cyan-300 text-xs animate-bounce">✦</span>
            <span className="text-yellow-200 text-[10px] animate-pulse">⭐</span>
          </div>
        )}

        {/* New High Score Compact Glowing Crown Pill */}
        {isNewHighScore && (
          <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1 animate-bounce z-10">
            <span>👑</span>
            <span>BEST!</span>
          </div>
        )}

        {/* Score Number with Pop & Glow Animation */}
        <div
          className={`font-black text-3xl sm:text-4xl text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-150 ${
            isBumping
              ? 'scale-115 text-yellow-300 drop-shadow-[0_0_12px_rgba(255,215,0,0.85)]'
              : 'scale-100'
          }`}
        >
          {score.toLocaleString()}
        </div>
      </div>

      {/* Objective & Moves Left Bar (Adventure & Daily Challenge) */}
      {(gameMode === GameMode.ADVENTURE || gameMode === GameMode.DAILY_CHALLENGE) && objective && (
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
