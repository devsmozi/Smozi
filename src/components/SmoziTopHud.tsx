import React, { useState, useEffect, useRef } from 'react';
import { GameMode, LevelObjective } from '../models/GameModels.ts';
import { Settings } from 'lucide-react';
import { TargetIconView } from './TargetIconView.tsx';

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
  remainingTargetsByType?: Record<string, number>;
  totalRemainingTargets?: number;
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
  remainingTargetsByType,
  totalRemainingTargets,
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
      className={`w-full max-w-[460px] mx-auto px-2 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between select-none ${className}`}
    >
      {/* Left: Crown / High score */}
      <div
        onClick={onPauseClick}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 cursor-pointer active:scale-95 transition-transform"
        title="High Score"
      >
        <span className="text-base sm:text-lg">👑</span>
        <span className="text-sm sm:text-base font-black text-amber-400 tracking-wide">
          {highScore}
        </span>
      </div>

      {/* Center: Adventure Target Counter OR Score */}
      {gameMode === GameMode.ADVENTURE ? (
        <div className="flex items-center space-x-2">
          {/* Level Badge */}
          <div className="px-2.5 py-0.5 rounded-full bg-[#1B2B54] border border-[#38559E] shadow-sm">
            <span className="text-xs font-bold text-white tracking-wide">
              Level {levelNumber}
            </span>
          </div>

          {/* Unified Target Counter Capsule matching reference game header */}
          {remainingTargetsByType && Object.keys(remainingTargetsByType).length > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-2xl bg-black/50 border border-white/20 shadow-md">
              {Object.entries(remainingTargetsByType).map(([tType, count]) => (
                <div key={tType} className="flex items-center space-x-1.5">
                  <div className="w-6 h-6 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    <TargetIconView targetType={tType} size={22} />
                  </div>
                  <span
                    className={`text-base font-black tracking-tight ${
                      count === 0 ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : gameMode === GameMode.DAILY_CHALLENGE ? (
        <div className="flex items-center space-x-2">
          <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/40 shadow-sm">
            <span className="text-xs font-black text-amber-300">
              Stage {stageNumber || 1}/3
            </span>
          </div>
          {objective && (
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-xl bg-black/40 border border-white/10 text-xs">
              <span className="text-white font-extrabold">{objective.currentAmount}/{objective.targetAmount}</span>
            </div>
          )}
        </div>
      ) : (
        /* Classic Mode Score */
        <div className="relative flex items-center justify-center select-none">
          {isNewHighScore && (
            <div className="absolute -top-2.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[8px] font-black uppercase tracking-wider animate-bounce">
              BEST!
            </div>
          )}
          <span
            className={`font-black text-2xl sm:text-3xl text-white tracking-tight leading-none drop-shadow-md transition-all duration-150 ${
              isBumping ? 'scale-110 text-yellow-300' : 'scale-100'
            }`}
          >
            {score.toLocaleString()}
          </span>
        </div>
      )}

      {/* Right: Settings gear */}
      <button
        onClick={onPauseClick}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 active:scale-90 transition-transform cursor-pointer"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4 text-[#A5B8E8]" />
      </button>
    </div>
  );
};
