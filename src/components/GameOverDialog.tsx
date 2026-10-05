import React from 'react';
import { GameMode } from '../models/GameModels.ts';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { Home } from 'lucide-react';

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
    ? 'Game Over'
    : isDaily
    ? `Stage ${stageNumber || 1} Failed`
    : 'Level Failed';

  const failureReason = outOfMoves
    ? 'Out of moves! Target was not reached in time.'
    : 'No more moves! No remaining pieces fit on the board.';

  // Coins earned from classic run (1 coin per 15 pts)
  const coinsEarned = isClassic ? Math.max(10, Math.floor(score / 15)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FF3B30] p-6 shadow-2xl flex flex-col items-center animate-pop-in">
        {/* Purple/Red Ribbon Header */}
        <div className="px-7 py-2.5 rounded-2xl bg-gradient-to-b from-[#AF52DE] to-[#7A21AA] border-2 border-[#D396F1] shadow-lg -mt-11">
          <span className="font-black text-2xl text-white tracking-wide">
            {headerTitle}
          </span>
        </div>

        <p className="text-[#A5B4FC] text-xs font-semibold text-center mt-5 mb-1 px-2">
          {failureReason}
        </p>

        {/* Tier badge if Classic */}
        {isClassic && levelTierLabel && (
          <div className="px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-[11px] font-bold text-indigo-200 mb-2">
            Reached: {levelTierLabel}
          </div>
        )}

        {/* Score Card */}
        <div className="w-4/5 py-3.5 my-3 rounded-2xl bg-[#0C1333] border border-[#2670E8] flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#8BA5F8] tracking-widest">
            {isClassic ? 'FINAL RUN SCORE' : 'STAGE SCORE'}
          </span>
          <span className="text-3xl font-black text-white mt-0.5">
            {score}
          </span>

          {isClassic && (
            <span className="text-xs font-bold text-amber-400 mt-1">
              Best: {bestScore}
            </span>
          )}

          {isClassic && coinsEarned > 0 && (
            <span className="text-xs font-black text-emerald-400 mt-1.5">
              🪙 Earned: +{coinsEarned} coins
            </span>
          )}
        </div>

        {/* Retry Button */}
        <SmoziButton
          text={isDaily ? 'Try Stage Again' : 'Play Again'}
          style="RED"
          onClick={onRetry}
          className="w-4/5 mt-2"
          testTag="game_over_retry_button"
        />

        {/* Home Button */}
        <SmoziIconButton
          onClick={onHome}
          style="BLUE"
          size={42}
          className="mt-4"
          testTag="game_over_home_button"
        >
          <Home className="w-5 h-5 text-white" />
        </SmoziIconButton>
      </div>
    </div>
  );
};
