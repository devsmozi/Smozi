import React from 'react';
import { SmoziButton } from './SmoziButton.tsx';

interface ClassicMilestoneDialogProps {
  milestoneTitle: string;
  levelTier: number;
  levelTierName: string;
  score: number;
  bonusCoins: number;
  appreciationMessage: string;
  onContinue: () => void;
}

export const ClassicMilestoneDialog: React.FC<ClassicMilestoneDialogProps> = ({
  milestoneTitle,
  levelTier,
  levelTierName,
  score,
  bonusCoins,
  appreciationMessage,
  onContinue
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FFD700] p-6 shadow-2xl flex flex-col items-center animate-pop-in">
        {/* Shiny Gold Ribbon Header */}
        <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-[#FFD700] to-[#FF9500] border-2 border-[#FFF099] shadow-lg -mt-11">
          <span className="font-black text-xl text-black tracking-wide">
            {milestoneTitle}
          </span>
        </div>

        {/* Big Sparkling Badge */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <span className="text-4xl">👑</span>
          </div>
          <div className="absolute -top-1 -right-2 text-yellow-300 text-lg animate-ping">
            ✦
          </div>
          <div className="absolute -bottom-1 -left-2 text-yellow-300 text-lg animate-ping">
            ✦
          </div>
        </div>

        {/* Tier Name & Score */}
        <div className="text-center">
          <span className="text-2xl font-black text-white mt-0.5 block">
            {levelTierName}
          </span>
          <span className="text-sm font-extrabold text-[#FFE680] mt-1 block">
            Score: {score} pts
          </span>
        </div>

        {/* Appreciation Message */}
        <div className="w-full my-4 p-3 rounded-2xl bg-[#0C1333] border border-[#2670E8] text-center">
          <p className="text-xs font-medium text-indigo-100 leading-relaxed">
            {appreciationMessage}
          </p>
        </div>

        {/* Reward Pill */}
        {bonusCoins > 0 && (
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-sm mb-4">
            <span>🪙 Milestone Reward:</span>
            <span>+{bonusCoins}</span>
          </div>
        )}

        <SmoziButton
          text="Keep Playing!"
          style="GREEN"
          onClick={onContinue}
          className="w-4/5"
          testTag="classic_milestone_continue_button"
        />
      </div>
    </div>
  );
};
