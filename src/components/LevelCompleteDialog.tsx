import React from 'react';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { RotateCcw, Home, Star } from 'lucide-react';

interface LevelCompleteDialogProps {
  score: number;
  stars: number;
  coinsEarned: number;
  gemsEarned: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteDialog: React.FC<LevelCompleteDialogProps> = ({
  score,
  stars,
  coinsEarned,
  gemsEarned,
  onNextLevel,
  onReplay,
  onHome
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FFCC00] p-6 shadow-2xl flex flex-col items-center animate-pop-in">
        {/* Red Ribbon Header */}
        <div className="px-7 py-2.5 rounded-2xl bg-gradient-to-b from-[#FF3B30] to-[#C7002B] border-2 border-[#FF9500] shadow-lg -mt-11">
          <span className="font-black text-2xl text-white tracking-wide">
            Level Complete!
          </span>
        </div>

        {/* 3 Glowing Stars */}
        <div className="flex items-center space-x-3 my-5">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-transform duration-300 ${
                  starIdx === 2 ? 'scale-125 -translate-y-1' : ''
                }`}
              >
                <Star
                  className={`w-11 h-11 ${
                    isEarned
                      ? 'text-[#FFD700] fill-[#FFD700] filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                      : 'text-[#333E68] fill-[#212745]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score Card */}
        <div className="w-4/5 py-3 rounded-2xl bg-[#0C1333] border border-[#2670E8] flex flex-col items-center">
          <span className="text-xs font-bold text-[#8BA5F8] tracking-widest">
            SCORE
          </span>
          <span className="text-3xl font-black text-[#FFE680] mt-0.5">
            {score}
          </span>
        </div>

        {/* Rewards pill */}
        <div className="flex items-center space-x-6 my-4">
          <div className="flex items-center space-x-1.5 text-base font-extrabold text-[#FFD700]">
            <span>🪙</span>
            <span>+{coinsEarned}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-base font-extrabold text-[#68B1FF]">
            <span>💎</span>
            <span>+{gemsEarned}</span>
          </div>
        </div>

        {/* Next Button */}
        <SmoziButton
          text="Next"
          style="GREEN"
          onClick={onNextLevel}
          className="w-4/5 mt-2"
          testTag="level_complete_next_button"
        />

        {/* Secondary actions: Replay & Home */}
        <div className="flex items-center space-x-4 mt-4">
          <SmoziIconButton
            onClick={onReplay}
            style="BLUE"
            size={44}
            testTag="level_complete_replay_button"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </SmoziIconButton>
          <SmoziIconButton
            onClick={onHome}
            style="PURPLE"
            size={44}
            testTag="level_complete_home_button"
          >
            <Home className="w-5 h-5 text-white" />
          </SmoziIconButton>
        </div>
      </div>
    </div>
  );
};
