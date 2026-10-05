import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SmoziButton } from './SmoziButton.tsx';
import { CheckCircle2, Target, X } from 'lucide-react';

interface DailyQuestsDialogProps {
  playerData: PlayerData;
  onClaimQuest: (questId: string, rewardCoins: number, rewardGems: number) => void;
  onClose: () => void;
}

interface QuestDef {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardGems: number;
}

export const DailyQuestsDialog: React.FC<DailyQuestsDialogProps> = ({
  playerData,
  onClaimQuest,
  onClose
}) => {
  const quests: QuestDef[] = [
    {
      id: 'quest_classic_score',
      title: 'Score Milestone',
      description: 'Score at least 1,000 points in Classic Mode',
      target: 1000,
      current: Math.min(1000, playerData.classicHighScore),
      rewardCoins: 150,
      rewardGems: 1
    },
    {
      id: 'quest_adventure',
      title: 'Adventure Explorer',
      description: 'Unlock World 2 in Adventure Mode (Level 11+)',
      target: 11,
      current: Math.min(11, playerData.currentLevel),
      rewardCoins: 200,
      rewardGems: 2
    },
    {
      id: 'quest_streak',
      title: 'Daily Dedication',
      description: 'Maintain a 2-day login streak',
      target: 2,
      current: Math.min(2, playerData.dailyStreak),
      rewardCoins: 120,
      rewardGems: 1
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FFD700] p-5 shadow-2xl flex flex-col items-center animate-pop-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ribbon Header */}
        <div className="px-6 py-2 rounded-2xl bg-gradient-to-b from-[#FFD700] to-[#FF9500] border-2 border-[#FFF099] shadow-lg -mt-10 mb-3">
          <span className="font-black text-lg text-black tracking-wide">
            DAILY MISSIONS
          </span>
        </div>

        <p className="text-xs text-indigo-200 mb-3 text-center">
          Complete missions to earn extra Coins & Gems for power-ups!
        </p>

        {/* Quests List */}
        <div className="w-full space-y-2.5 mb-4">
          {quests.map((q) => {
            const isCompleted = q.current >= q.target;
            const isClaimed = !!playerData.achievements[q.id];

            return (
              <div
                key={q.id}
                className="w-full p-3 rounded-2xl bg-[#0C1333] border border-[#2670E8] flex items-center justify-between shadow-inner"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-black text-white">{q.title}</span>
                  </div>
                  <p className="text-[11px] text-indigo-200 mt-0.5">{q.description}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                      style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 mt-0.5 block">
                    {q.current} / {q.target}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  {isClaimed ? (
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Done</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => onClaimQuest(q.id, q.rewardCoins, q.rewardGems)}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                    >
                      Claim!
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-[11px] font-black text-amber-300">
                      <span>🪙+{q.rewardCoins}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <SmoziButton
          text="Back to Menu"
          style="GREEN"
          onClick={onClose}
          className="w-full py-2.5 text-sm"
          testTag="daily_quests_close_button"
        />
      </div>
    </div>
  );
};
