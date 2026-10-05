import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SmoziButton } from './SmoziButton.tsx';
import { SunburstRays } from './SunburstRays.tsx';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface DailyChallengeVictoryDialogProps {
  stageNumber: number; // 1, 2, or 3
  isAllCompleted: boolean;
  score: number;
  coinsEarned: number;
  gemsEarned: number;
  appreciationQuote: string;
  onNextStage: () => void;
  onFinishDaily: () => void;
}

export const DailyChallengeVictoryDialog: React.FC<DailyChallengeVictoryDialogProps> = ({
  stageNumber,
  isAllCompleted,
  score,
  coinsEarned,
  gemsEarned,
  appreciationQuote,
  onNextStage,
  onFinishDaily
}) => {
  useEffect(() => {
    // Grand confetti explosion on victory
    confetti({
      particleCount: isAllCompleted ? 110 : 60,
      spread: 85,
      origin: { y: 0.45 },
      colors: ['#FFD700', '#FF9500', '#007AFF', '#34C759', '#AF52DE']
    });
  }, [isAllCompleted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-fade-in overflow-hidden">
      {/* Golden Rotating Sunburst Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SunburstRays color="rgba(255, 215, 0, 0.2)" size={520} />
      </div>

      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#1A265E] via-[#101942] to-[#080D24] border-3 border-[#FFD700] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(255,215,0,0.35)] flex flex-col items-center animate-pop-in">
        {/* Colorful Festive Ribbon Header */}
        <div className="relative -mt-11 mb-2 px-8 py-2.5 rounded-2xl bg-gradient-to-b from-[#FFE082] via-[#FFB300] to-[#E65100] border-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
          {/* Ribbon wing folds */}
          <div className="absolute -left-3 top-3 w-3 h-3 bg-[#7A2600] [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />
          <div className="absolute -right-3 top-3 w-3 h-3 bg-[#7A2600] [clip-path:polygon(0_0,0_100%,100%_100%)] pointer-events-none" />

          <span className="font-black text-xl text-black tracking-wide uppercase drop-shadow-sm">
            {isAllCompleted ? '🏆 DAILY CHAMPION! 🏆' : `Stage ${stageNumber} Cleared!`}
          </span>
        </div>

        {/* Centerpiece: Handcrafted 3D Victory Crest */}
        <div className="relative w-40 h-28 my-1 flex items-center justify-center">
          <img
            src="/victory-crest.svg"
            alt="Victory Trophy"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] animate-bounce"
          />
        </div>

        {/* Stage Progress Badges */}
        <div className="flex items-center space-x-2 my-2">
          {[1, 2, 3].map((stg) => {
            const isDone = stg <= stageNumber;
            return (
              <div
                key={stg}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black transition-all ${
                  isDone
                    ? 'bg-[#34C759] text-white border border-[#86E49D] shadow-sm'
                    : 'bg-white/10 text-white/40 border border-white/5'
                }`}
              >
                <span>Stage {stg}</span>
                {isDone && <Star className="w-3 h-3 fill-current text-white" />}
              </div>
            );
          })}
        </div>

        {/* Appreciation Quote Card */}
        <div className="w-full my-2.5 p-3 rounded-2xl bg-[#090E26] border border-[#2670E8] text-center shadow-inner">
          <span className="text-[10px] font-black uppercase text-[#8BA5F8] tracking-widest block mb-1">
            ⭐ Appreciation & Kudos ⭐
          </span>
          <p className="text-xs font-semibold text-emerald-300 leading-relaxed italic">
            "{appreciationQuote}"
          </p>
        </div>

        {/* Reward Bounty */}
        <div className="flex items-center space-x-5 my-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs font-black text-[#FFD700]">
            <span className="text-sm">🪙</span>
            <span>+{coinsEarned} Coins</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-black text-[#68B1FF]">
            <span className="text-sm">💎</span>
            <span>+{gemsEarned} Gems</span>
          </div>
        </div>

        {/* Action Button */}
        {isAllCompleted ? (
          <SmoziButton
            text="Claim & Complete!"
            style="GREEN"
            onClick={onFinishDaily}
            className="w-full py-3.5 text-base mt-2 shadow-[0_8px_20px_rgba(52,199,89,0.4)]"
            testTag="daily_finish_button"
          />
        ) : (
          <SmoziButton
            text={`Proceed to Stage ${stageNumber + 1} ▶`}
            style="YELLOW_ORANGE"
            onClick={onNextStage}
            className="w-full py-3.5 text-base mt-2 shadow-[0_8px_20px_rgba(255,149,0,0.4)]"
            testTag="daily_next_stage_button"
          />
        )}
      </div>
    </div>
  );
};
