import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { DAILY_REWARDS_DATA } from '../data/AchievementsData.ts';
import { SmoziButton } from './SmoziButton.tsx';

interface DailyRewardDialogProps {
  playerData: PlayerData;
  onClaim: (coins: number, gems: number) => void;
  onDismiss: () => void;
}

export const DailyRewardDialog: React.FC<DailyRewardDialogProps> = ({
  playerData,
  onClaim,
  onDismiss
}) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const canClaim =
    Date.now() - playerData.lastDailyClaimTimestamp > ONE_DAY_MS ||
    playerData.lastDailyClaimTimestamp === 0;
  const currentStreakDay = Math.min(7, Math.max(1, playerData.dailyStreak));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FF9500] p-5 shadow-2xl flex flex-col items-center animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-2 rounded-2xl bg-gradient-to-b from-[#FF3B30] to-[#C7002B] border-2 border-[#FFCC00] shadow-lg -mt-10 mb-4">
          <span className="font-black text-xl text-white tracking-wide">
            Daily Reward
          </span>
        </div>

        {/* Days Grid: row 1 (1-4) and row 2 (5-7) */}
        <div className="w-full grid grid-cols-4 gap-2 mb-2">
          {DAILY_REWARDS_DATA.slice(0, 4).map((item) => {
            const isClaimed = item.day < currentStreakDay;
            const isCurrent = item.day === currentStreakDay;

            return (
              <div
                key={item.day}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center ${
                  isCurrent
                    ? 'bg-[#1E3585] border-[#FFD700] ring-2 ring-[#FFD700]/30'
                    : isClaimed
                    ? 'bg-[#0C1333] border-[#34C759]'
                    : 'bg-[#0C1333] border-[#263A7D]'
                }`}
              >
                <span
                  className={`text-[11px] font-bold ${
                    isCurrent ? 'text-[#FFE680]' : 'text-[#A5B4FC]'
                  }`}
                >
                  Day {item.day}
                </span>
                {item.coins > 0 && (
                  <span className="text-[11px] font-bold text-[#FFD700] mt-1">
                    🪙 {item.coins}
                  </span>
                )}
                {item.gems > 0 && (
                  <span className="text-[11px] font-bold text-[#68B1FF] mt-1">
                    💎 {item.gems}
                  </span>
                )}
                {isClaimed && (
                  <span className="text-[9px] font-bold text-[#34C759] mt-0.5">
                    ✓ Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          {DAILY_REWARDS_DATA.slice(4).map((item) => {
            const isClaimed = item.day < currentStreakDay;
            const isCurrent = item.day === currentStreakDay;

            return (
              <div
                key={item.day}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center ${
                  isCurrent
                    ? 'bg-[#1E3585] border-[#FFD700] ring-2 ring-[#FFD700]/30'
                    : isClaimed
                    ? 'bg-[#0C1333] border-[#34C759]'
                    : 'bg-[#0C1333] border-[#263A7D]'
                }`}
              >
                <span
                  className={`text-[11px] font-bold ${
                    isCurrent ? 'text-[#FFE680]' : 'text-[#A5B4FC]'
                  }`}
                >
                  Day {item.day}
                </span>
                {item.coins > 0 && (
                  <span className="text-[11px] font-bold text-[#FFD700] mt-1">
                    🪙 {item.coins}
                  </span>
                )}
                {item.gems > 0 && (
                  <span className="text-[11px] font-bold text-[#68B1FF] mt-1">
                    💎 {item.gems}
                  </span>
                )}
                {item.specialBonus && (
                  <span className="text-[9px] font-bold text-[#FF85BF] mt-0.5 truncate w-full">
                    🎁 {item.specialBonus}
                  </span>
                )}
                {isClaimed && (
                  <span className="text-[9px] font-bold text-[#34C759] mt-0.5">
                    ✓ Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim / Dismiss Button */}
        {canClaim ? (
          <SmoziButton
            text="Claim Reward"
            style="GREEN"
            onClick={() => {
              const reward = DAILY_REWARDS_DATA[currentStreakDay - 1];
              onClaim(reward.coins, reward.gems);
            }}
            className="w-4/5"
            testTag="daily_reward_claim_button"
          />
        ) : (
          <SmoziButton
            text="Claimed Today!"
            style="BLUE"
            onClick={onDismiss}
            className="w-4/5"
            testTag="daily_reward_claim_button"
          />
        )}
      </div>
    </div>
  );
};
