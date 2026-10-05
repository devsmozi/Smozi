import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlayerData } from '../models/GameModels.ts';
import { DAILY_REWARDS_DATA, DailyRewardItem } from '../data/AchievementsData.ts';
import { SmoziButton } from './SmoziButton.tsx';
import { Sparkles, Check, Gift, Crown, Clock, X } from 'lucide-react';

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
  
  // Calculate if naturally 24h passed
  const timeSinceLastClaim = Date.now() - (playerData.lastDailyClaimTimestamp || 0);
  const isNaturallyDue = timeSinceLastClaim > ONE_DAY_MS || playerData.lastDailyClaimTimestamp === 0;

  // Selected day state for interactive inspection/claiming
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return Math.min(7, Math.max(1, playerData.dailyStreak || 1));
  });

  const [claimedDays, setClaimedDays] = useState<number[]>(() => {
    const list: number[] = [];
    const currentStreak = playerData.dailyStreak || 1;
    for (let d = 1; d < currentStreak; d++) {
      list.push(d);
    }
    // If not due today, current streak day was already claimed today
    if (!isNaturallyDue && playerData.lastDailyClaimTimestamp > 0) {
      if (!list.includes(currentStreak)) {
        list.push(currentStreak);
      }
    }
    return list;
  });

  const currentStreakDay = Math.min(7, Math.max(1, playerData.dailyStreak || 1));
  const isSelectedClaimed = claimedDays.includes(selectedDay);

  // Time remaining until natural 24h reset
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      if (isNaturallyDue) {
        setCountdown('Reward Ready!');
        return;
      }
      const remainingMs = Math.max(0, ONE_DAY_MS - (Date.now() - playerData.lastDailyClaimTimestamp));
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [playerData.lastDailyClaimTimestamp, isNaturallyDue]);

  // Handle claiming a specific day reward
  const handleClaimDay = (dayNum: number) => {
    const item = DAILY_REWARDS_DATA.find((r) => r.day === dayNum) || DAILY_REWARDS_DATA[dayNum - 1];
    if (!item) return;

    // Confetti celebration
    confetti({
      particleCount: dayNum === 7 ? 90 : 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF9500', '#34C759', '#007AFF']
    });

    setClaimedDays((prev) => (prev.includes(dayNum) ? prev : [...prev, dayNum]));
    onClaim(item.coins, item.gems);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none animate-fade-in"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#182352] via-[#0F1638] to-[#080B1E] border-3 border-[#FF9500] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,149,0,0.3)] flex flex-col items-center animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Festive Ribbon Header */}
        <div className="relative -mt-11 mb-3 px-8 py-2.5 rounded-2xl bg-gradient-to-b from-[#FF5252] via-[#E53935] to-[#B71C1C] border-2 border-[#FFCDD2] shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <div className="absolute -left-3 top-3 w-3 h-3 bg-[#5A0A0A] [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />
          <div className="absolute -right-3 top-3 w-3 h-3 bg-[#5A0A0A] [clip-path:polygon(0_0,0_100%,100%_100%)] pointer-events-none" />

          <span className="font-black text-xl text-white tracking-widest drop-shadow-sm uppercase flex items-center space-x-1.5">
            <Gift className="w-5 h-5 text-amber-300 animate-bounce" />
            <span>DAILY REWARDS</span>
          </span>
        </div>

        {/* Streak status pill */}
        <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 mb-3 text-xs">
          <div className="flex items-center space-x-1.5 font-black text-amber-300">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak: Day {currentStreakDay} of 7</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-indigo-200">
            <Clock className="w-3 h-3 text-indigo-300" />
            <span>{countdown}</span>
          </div>
        </div>

        {/* Days Grid: Row 1 (Days 1 to 4) */}
        <div className="w-full grid grid-cols-4 gap-2 mb-2.5">
          {DAILY_REWARDS_DATA.slice(0, 4).map((item) => {
            const isClaimed = claimedDays.includes(item.day);
            const isSelected = selectedDay === item.day;
            const isCurrent = item.day === currentStreakDay;

            return (
              <button
                key={item.day}
                onClick={() => {
                  setSelectedDay(item.day);
                  if (!isClaimed) {
                    handleClaimDay(item.day);
                  }
                }}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#25429E] to-[#14235B] border-[#FFD700] ring-2 ring-[#FFD700]/50 shadow-lg scale-105 z-10'
                    : isClaimed
                    ? 'bg-[#0B1530] border-emerald-500/60 opacity-80'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#1C3275] to-[#0E1B45] border-amber-400 shadow-md animate-pulse'
                    : 'bg-[#090F26] border-white/10 hover:border-white/30'
                }`}
                title={`Day ${item.day}: Tap to claim`}
              >
                <span
                  className={`text-[11px] font-black ${
                    isSelected ? 'text-amber-300' : 'text-indigo-200'
                  }`}
                >
                  Day {item.day}
                </span>

                {item.coins > 0 && (
                  <span className="text-[11px] font-black text-[#FFD700] mt-1 flex items-center space-x-0.5">
                    <span>🪙</span>
                    <span>{item.coins}</span>
                  </span>
                )}
                {item.gems > 0 && (
                  <span className="text-[11px] font-black text-[#68B1FF] mt-1 flex items-center space-x-0.5">
                    <span>💎</span>
                    <span>{item.gems}</span>
                  </span>
                )}

                {isClaimed ? (
                  <div className="flex items-center space-x-0.5 text-[9px] font-black text-emerald-400 mt-1">
                    <Check className="w-3 h-3" />
                    <span>Done</span>
                  </div>
                ) : (
                  <span className="text-[9px] font-extrabold text-amber-300/80 mt-1">
                    Tap!
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Days Grid: Row 2 (Days 5, 6, 7 with Grand Day 7 Chest) */}
        <div className="w-full grid grid-cols-3 gap-2.5 mb-4">
          {DAILY_REWARDS_DATA.slice(4).map((item) => {
            const isClaimed = claimedDays.includes(item.day);
            const isSelected = selectedDay === item.day;
            const isCurrent = item.day === currentStreakDay;
            const isDay7 = item.day === 7;

            return (
              <button
                key={item.day}
                onClick={() => {
                  setSelectedDay(item.day);
                  if (!isClaimed) {
                    handleClaimDay(item.day);
                  }
                }}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                  isDay7
                    ? isClaimed
                      ? 'bg-gradient-to-b from-[#2E2407] to-[#120F02] border-amber-500'
                      : 'bg-gradient-to-b from-[#3D2E0B] via-[#241B03] to-[#140F00] border-2 border-[#FFD700] shadow-[0_4px_16px_rgba(255,215,0,0.35)] ring-2 ring-[#FFD700]/30 animate-pulse'
                    : isSelected
                    ? 'bg-gradient-to-b from-[#25429E] to-[#14235B] border-[#FFD700] ring-2 ring-[#FFD700]/50 shadow-lg scale-105 z-10'
                    : isClaimed
                    ? 'bg-[#0B1530] border-emerald-500/60 opacity-80'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#1C3275] to-[#0E1B45] border-amber-400 shadow-md'
                    : 'bg-[#090F26] border-white/10 hover:border-white/30'
                }`}
                title={`Day ${item.day}: Tap to claim`}
              >
                {/* Day 7 Crown Ribbon */}
                {isDay7 && (
                  <div className="absolute -top-1 px-2 py-0.5 rounded-b-md bg-[#FFD700] text-black font-black text-[8px] tracking-wider uppercase shadow-xs">
                    GRAND PRIZE
                  </div>
                )}

                <span
                  className={`text-[11px] font-black ${
                    isDay7
                      ? 'text-[#FFE680] mt-2'
                      : isSelected
                      ? 'text-amber-300'
                      : 'text-indigo-200'
                  }`}
                >
                  Day {item.day}
                </span>

                {item.coins > 0 && (
                  <span className="text-[11px] font-black text-[#FFD700] mt-1 flex items-center space-x-0.5">
                    <span>🪙</span>
                    <span>{item.coins}</span>
                  </span>
                )}
                {item.gems > 0 && (
                  <span className="text-[11px] font-black text-[#68B1FF] mt-0.5 flex items-center space-x-0.5">
                    <span>💎</span>
                    <span>{item.gems}</span>
                  </span>
                )}

                {item.specialBonus && (
                  <span className="text-[9px] font-black text-rose-300 mt-1 truncate max-w-full">
                    🎁 {item.specialBonus}
                  </span>
                )}

                {isClaimed ? (
                  <div className="flex items-center space-x-0.5 text-[9px] font-black text-emerald-400 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Claimed!</span>
                  </div>
                ) : (
                  <span className="text-[9px] font-black text-amber-300 mt-1 bg-amber-400/20 px-1.5 py-0.5 rounded-full">
                    Claim Now
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Reward Summary Card */}
        {(() => {
          const item = DAILY_REWARDS_DATA.find((r) => r.day === selectedDay) || DAILY_REWARDS_DATA[0];
          const isClaimed = claimedDays.includes(selectedDay);

          return (
            <div className="w-full p-3 rounded-2xl bg-[#080D24] border border-[#2670E8] flex items-center justify-between mb-4 shadow-inner">
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-white flex items-center space-x-1">
                  <span>Day {item.day} Reward</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </span>
                <span className="text-[11px] font-bold text-indigo-200">
                  {item.coins > 0 && `🪙 +${item.coins} `}
                  {item.gems > 0 && `💎 +${item.gems} `}
                  {item.specialBonus && `🎁 ${item.specialBonus}`}
                </span>
              </div>

              {!isClaimed ? (
                <button
                  onClick={() => handleClaimDay(selectedDay)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 border border-emerald-300 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  Claim!
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-400 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Collected</span>
                </span>
              )}
            </div>
          );
        })()}

        {/* Bottom Action: Claim Next or Close */}
        <div className="w-full flex space-x-2">
          {!claimedDays.includes(currentStreakDay) ? (
            <SmoziButton
              text={`CLAIM DAY ${currentStreakDay} 🎁`}
              style="GREEN"
              onClick={() => handleClaimDay(currentStreakDay)}
              className="flex-1 py-3 text-sm shadow-[0_8px_20px_rgba(52,199,89,0.4)]"
              testTag="daily_reward_claim_button"
            />
          ) : (
            <SmoziButton
              text="CLAIM DAY 7 JACKPOT 👑"
              style="YELLOW_ORANGE"
              onClick={() => handleClaimDay(7)}
              className="flex-1 py-3 text-sm shadow-[0_8px_20px_rgba(255,149,0,0.4)]"
              testTag="daily_reward_claim_button"
            />
          )}

          <button
            onClick={onDismiss}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-black text-xs active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
