import React from 'react';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { Home } from 'lucide-react';

interface GameOverDialogProps {
  score: number;
  bestScore: number;
  isAdventure: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  score,
  bestScore,
  isAdventure,
  onRetry,
  onHome
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FF3B30] p-6 shadow-2xl flex flex-col items-center animate-pop-in">
        {/* Purple/Red Ribbon Header */}
        <div className="px-7 py-2.5 rounded-2xl bg-gradient-to-b from-[#AF52DE] to-[#7A21AA] border-2 border-[#D396F1] shadow-lg -mt-11">
          <span className="font-black text-2xl text-white tracking-wide">
            {isAdventure ? 'Level Failed' : 'Game Over'}
          </span>
        </div>

        <p className="text-[#A5B4FC] text-sm font-semibold mt-6">
          No more moves available!
        </p>

        {/* Score card */}
        <div className="w-4/5 py-4 my-5 rounded-2xl bg-[#0C1333] border border-[#2670E8] flex flex-col items-center">
          <span className="text-xs font-bold text-[#8BA5F8] tracking-widest">
            FINAL SCORE
          </span>
          <span className="text-3xl font-black text-white mt-1">
            {score}
          </span>
          {!isAdventure && (
            <span className="text-xs font-bold text-amber-400 mt-1">
              Best: {bestScore}
            </span>
          )}
        </div>

        <SmoziButton
          text="Retry"
          style="RED"
          onClick={onRetry}
          className="w-4/5"
          testTag="game_over_retry_button"
        />

        <SmoziIconButton
          onClick={onHome}
          style="BLUE"
          size={44}
          className="mt-4"
          testTag="game_over_home_button"
        >
          <Home className="w-5 h-5 text-white" />
        </SmoziIconButton>
      </div>
    </div>
  );
};
