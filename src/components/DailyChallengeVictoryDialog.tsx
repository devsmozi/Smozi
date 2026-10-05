import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SmoziButton } from './SmoziButton.tsx';
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
      particleCount: isAllCompleted ? 100 : 50,
      spread: 80,
      origin: { y: 0.5 }
    });
  }, [isAllCompleted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#FFD700] p-6 shadow-2xl flex flex-col items-center animate-pop-in">
        {/* Colorful Festive Ribbon Header */}
        <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-[#FFCC00] to-[#FF9500] border-2 border-white shadow-lg -mt-11">
          <span className="font-black text-xl text-black tracking-wide">
            {isAllCompleted ? '🏆 DAILY CHAMPION! 🏆' : `Stage ${stageNumber} Cleared!`}
          </span>
        </div>

        {/* Centerpiece Icon */}
        <div className="relative my-4 flex items-center justify-center">
          {isAllCompleted ? (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
              <Trophy className="w-14 h-14 text-amber-900 drop-shadow-md" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-xl border-3 border-white">
              <Sparkles className="w-10 h-10 text-yellow-300" />
            </div>
          )}
        </div>

        {/* Title & Stage Indicators */}
        <div className="flex items-center space-x-2 mb-2">
          {[1, 2, 3].map((stg) => {
            const isDone = stg <= stageNumber;
            return (
              <div
                key={stg}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black ${
                  isDone
                    ? 'bg-[#34C759] text-white border border-[#86E49D]'
                    : 'bg-white/10 text-white/50 border border-white/10'
                }`}
              >
                <span>Stage {stg}</span>
                {isDone && <Star className="w-3 h-3 fill-current text-white" />}
              </div>
            );
          })}
        </div>

        {/* Appreciation Quote Card */}
        <div className="w-full my-3 p-3.5 rounded-2xl bg-[#0C1333] border border-[#2670E8] text-center shadow-inner">
          <span className="text-[10px] font-black uppercase text-[#8BA5F8] tracking-widest block mb-1">
            ⭐ Appreciation & Kudos ⭐
          </span>
          <p className="text-xs font-semibold text-emerald-200 leading-relaxed italic">
            "{appreciationQuote}"
          </p>
        </div>

        {/* Score Card */}
        <div className="w-full py-2 px-4 rounded-xl bg-black/25 flex items-center justify-between text-xs font-bold mb-3 border border-white/5">
          <span className="text-[#8BA5F8]">Stage Score:</span>
          <span className="text-lg font-black text-[#FFE680]">{score}</span>
        </div>

        {/* Rewards pill */}
        <div className="flex items-center space-x-6 my-2">
          <div className="flex items-center space-x-1.5 text-base font-extrabold text-[#FFD700]">
            <span>🪙</span>
            <span>+{coinsEarned}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-base font-extrabold text-[#68B1FF]">
            <span>💎</span>
            <span>+{gemsEarned}</span>
          </div>
        </div>

        {/* Action Button */}
        {isAllCompleted ? (
          <SmoziButton
            text="Claim & Complete!"
            style="GREEN"
            onClick={onFinishDaily}
            className="w-4/5 mt-3"
            testTag="daily_challenge_finish_button"
          />
        ) : (
          <SmoziButton
            text={`Proceed to Stage ${stageNumber + 1} (Harder) ➔`}
            style="YELLOW_ORANGE"
            onClick={onNextStage}
            className="w-full mt-3 text-sm"
            testTag="daily_challenge_next_stage_button"
          />
        )}
      </div>
    </div>
  );
};
