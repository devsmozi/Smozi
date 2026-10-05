import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { INITIAL_ACHIEVEMENTS } from '../data/AchievementsData.ts';
import { SmoziIconButton } from './SmoziButton.tsx';
import { X, Award } from 'lucide-react';

interface AchievementsDialogProps {
  playerData: PlayerData;
  onDismiss: () => void;
}

export const AchievementsDialog: React.FC<AchievementsDialogProps> = ({
  playerData,
  onDismiss
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#AF52DE] p-5 shadow-2xl flex flex-col items-center animate-pop-in max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-400" />
            <span className="font-black text-2xl text-white">Achievements</span>
          </div>
          <SmoziIconButton
            onClick={onDismiss}
            style="RED"
            size={36}
            testTag="achievements_close_button"
          >
            <X className="w-5 h-5 text-white" />
          </SmoziIconButton>
        </div>

        {/* Scrollable list of achievements */}
        <div className="w-full flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            // Determine progress based on player state
            let progress = 0;
            if (ach.id === 'first_win') {
              progress = (playerData.unlockedLevels.length > 1 || playerData.currentLevel > 1) ? 1 : 0;
            } else if (ach.id === 'adventure_explorer') {
              progress = Math.min(ach.targetValue, playerData.currentLevel);
            } else if (ach.id === 'perfect_puzzler') {
              const threeStars = Object.values(playerData.levelStars).filter((s) => s === 3).length;
              progress = Math.min(ach.targetValue, threeStars);
            } else if (ach.id === 'high_scorer') {
              progress = Math.min(ach.targetValue, playerData.classicHighScore);
            } else {
              progress = playerData.achievements[ach.id] || 0;
            }

            const pct = Math.min(100, Math.floor((progress / ach.targetValue) * 100));
            const isCompleted = progress >= ach.targetValue;

            return (
              <div
                key={ach.id}
                className="w-full p-3 rounded-2xl bg-[#0C1333] border border-white/10 flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">{ach.title}</span>
                  <div className="flex items-center space-x-2 text-xs">
                    {ach.rewardCoins > 0 && (
                      <span className="font-bold text-[#FFD700]">🪙 {ach.rewardCoins}</span>
                    )}
                    {ach.rewardGems > 0 && (
                      <span className="font-bold text-[#68B1FF]">💎 {ach.rewardGems}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-indigo-300/80">{ach.description}</p>

                {/* Progress bar */}
                <div className="w-full flex items-center space-x-2 mt-1">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-[#34C759]' : 'bg-[#AF52DE]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-white whitespace-nowrap">
                    {progress} / {ach.targetValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
