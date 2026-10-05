import React from 'react';
import { GameMode } from '../models/GameModels.ts';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { Home, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';

interface GameOverDialogProps {
  gameMode: GameMode;
  score: number;
  bestScore: number;
  levelTierLabel?: string;
  stageNumber?: number;
  outOfMoves?: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  gameMode,
  score,
  bestScore,
  levelTierLabel,
  stageNumber,
  outOfMoves = false,
  onRetry,
  onHome
}) => {
  const isClassic = gameMode === GameMode.CLASSIC;
  const isDaily = gameMode === GameMode.DAILY_CHALLENGE;

  const headerTitle = isClassic
    ? 'GAME OVER'
    : isDaily
    ? `STAGE ${stageNumber || 1} FAILED`
    : 'LEVEL FAILED';

  const failureReason = outOfMoves
    ? 'Move limit reached! Reach the objective sooner.'
    : 'No moves left! No available pieces fit on the board.';

  const coinsEarned = isClassic ? Math.max(10, Math.floor(score / 15)) : 0;
  const isNewRecord = bestScore > 0 && score >= bestScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-fade-in">
      {/* Background ambient crimson glow */}
      <div className="absolute w-80 h-80 rounded-full bg-rose-600/15 filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#182352] via-[#0F1638] to-[#080B1E] border-3 border-[#E53935] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(229,57,53,0.3)] flex flex-col items-center animate-pop-in relative">
        {/* 3D Crimson Ribbon Header */}
        <div className="relative -mt-11 mb-2 px-8 py-2.5 rounded-2xl bg-gradient-to-b from-[#FF5252] via-[#D32F2F] to-[#8B0000] border-2 border-[#FFCDD2] shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
          {/* Ribbon wing folds */}
          <div className="absolute -left-3 top-3 w-3 h-3 bg-[#4A0000] [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />
          <div className="absolute -right-3 top-3 w-3 h-3 bg-[#4A0000] [clip-path:polygon(0_0,0_100%,100%_100%)] pointer-events-none" />

          <span className="font-black text-xl text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
            {headerTitle}
          </span>
        </div>

        {/* Centerpiece: Handcrafted 3D Defeat Crest SVG */}
        <div className="relative w-44 h-32 my-1 flex items-center justify-center">
          <img
            src="/game-over-crest.svg"
            alt="Defeat Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] animate-[pulse_3s_ease-in-out_infinite]"
          />
        </div>

        {/* Failure reason explanation pill */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-[11px] text-rose-200 font-semibold mb-3 text-center">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate max-w-[260px]">{failureReason}</span>
        </div>

        {/* Royal Obsidian Score Plaque */}
        <div className="w-full rounded-2xl bg-[#090E26] border-1.5 border-[#2A3E7A] p-3.5 shadow-inner flex flex-col items-center mb-4">
          <span className="text-[10px] font-extrabold uppercase text-[#8BA5F8] tracking-[0.2em] mb-0.5">
            {isClassic ? 'FINAL RUN SCORE' : 'STAGE SCORE'}
          </span>

          <span className="text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {score.toLocaleString()}
          </span>

          {/* High Score / Best Record Pill */}
          {bestScore > 0 && (
            <div className="flex items-center space-x-1.5 mt-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-amber-400/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black text-amber-300">
                {isNewRecord ? 'NEW BEST RECORD!' : `Best: ${bestScore.toLocaleString()}`}
              </span>
            </div>
          )}

          {/* Coins Earned Banner for Classic */}
          {isClassic && coinsEarned > 0 && (
            <div className="flex items-center space-x-1.5 mt-2 text-xs font-black text-emerald-400">
              <span className="text-sm">🪙</span>
              <span>Earned +{coinsEarned} Coins</span>
            </div>
          )}

          {/* Classic Tier Reached */}
          {isClassic && levelTierLabel && (
            <span className="text-[10px] font-bold text-indigo-300 mt-1">
              Rank Reached: <strong className="text-amber-300">{levelTierLabel}</strong>
            </span>
          )}
        </div>

        {/* Primary Action Button: 3D Glossy Replay Button */}
        <SmoziButton
          text={isDaily ? '▶  RETRY STAGE' : '▶  PLAY AGAIN'}
          style="GREEN"
          onClick={onRetry}
          className="w-full py-3.5 text-base shadow-[0_8px_20px_rgba(52,199,89,0.4)]"
          testTag="game_over_retry_button"
        />

        {/* Secondary Home Button */}
        <button
          onClick={onHome}
          className="flex items-center space-x-2 mt-3 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/70 hover:text-white transition-all cursor-pointer text-xs font-bold"
        >
          <Home className="w-4 h-4" />
          <span>Return to Menu</span>
        </button>
      </div>
    </div>
  );
};
