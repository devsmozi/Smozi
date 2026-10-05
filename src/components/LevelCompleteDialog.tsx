import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { SunburstRays } from './SunburstRays.tsx';
import { RotateCcw, Home, Star, Sparkles } from 'lucide-react';

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
  useEffect(() => {
    // Grand celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.45 },
      colors: ['#FFD700', '#FF9500', '#007AFF', '#34C759', '#AF52DE']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-fade-in overflow-hidden">
      {/* Golden Rotating Sunburst Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SunburstRays color="rgba(255, 215, 0, 0.22)" size={520} />
      </div>

      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#1A265E] via-[#101942] to-[#080D24] border-3 border-[#FFD700] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(255,215,0,0.35)] flex flex-col items-center animate-pop-in">
        {/* 3D Radiant Golden Ribbon Header */}
        <div className="relative -mt-11 mb-2 px-8 py-2.5 rounded-2xl bg-gradient-to-b from-[#FFE082] via-[#FFB300] to-[#E65100] border-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
          {/* Ribbon wing folds */}
          <div className="absolute -left-3 top-3 w-3 h-3 bg-[#7A2600] [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />
          <div className="absolute -right-3 top-3 w-3 h-3 bg-[#7A2600] [clip-path:polygon(0_0,0_100%,100%_100%)] pointer-events-none" />

          <span className="font-black text-xl text-black tracking-widest drop-shadow-sm uppercase flex items-center space-x-1.5">
            <span>✨ LEVEL COMPLETE! ✨</span>
          </span>
        </div>

        {/* Centerpiece: Handcrafted 3D Golden Laurel Trophy Crest */}
        <div className="relative w-44 h-32 my-1 flex items-center justify-center">
          <img
            src="/victory-crest.svg"
            alt="Victory Trophy"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] animate-bounce"
          />
        </div>

        {/* 3 Grand Glowing Stars with Elevated Center */}
        <div className="flex items-center justify-center space-x-3 my-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            const isCenter = starIdx === 2;

            return (
              <div
                key={starIdx}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isCenter ? '-translate-y-2 scale-110' : ''
                }`}
              >
                {/* Golden star halo if earned */}
                {isEarned && (
                  <div className="absolute inset-0 rounded-full bg-amber-400/40 filter blur-md animate-pulse" />
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-transform ${
                    isEarned
                      ? 'bg-gradient-to-b from-[#FFF59D] via-[#FFD54F] to-[#FF8F00] border-white scale-105'
                      : 'bg-[#0E1538] border-white/10 opacity-40'
                  }`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      isEarned
                        ? 'text-amber-900 fill-current drop-shadow-sm'
                        : 'text-white/20 fill-current'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Score & Rewards Plaque */}
        <div className="w-full rounded-2xl bg-[#090E26] border-1.5 border-[#2A3E7A] p-3.5 shadow-inner flex flex-col items-center mb-4">
          <span className="text-[10px] font-extrabold uppercase text-[#8BA5F8] tracking-[0.2em] mb-0.5">
            STAGE SCORE
          </span>

          <span className="text-4xl font-black text-[#FFE680] tracking-tight drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
            {score.toLocaleString()}
          </span>

          {/* Reward Bounty */}
          <div className="flex items-center space-x-5 mt-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#FFD700]">
              <span className="text-sm">🪙</span>
              <span>+{coinsEarned}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#68B1FF]">
              <span className="text-sm">💎</span>
              <span>+{gemsEarned}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button: 3D Glossy "NEXT LEVEL" Button */}
        <SmoziButton
          text="CONTINUE  ▶"
          style="GREEN"
          onClick={onNextLevel}
          className="w-full py-3.5 text-base shadow-[0_8px_20px_rgba(52,199,89,0.4)]"
          testTag="level_complete_next_button"
        />

        {/* Secondary Replay & Home Buttons */}
        <div className="flex items-center space-x-4 mt-3">
          <SmoziIconButton
            onClick={onReplay}
            style="BLUE"
            size={40}
            testTag="level_complete_replay_button"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </SmoziIconButton>

          <SmoziIconButton
            onClick={onHome}
            style="PURPLE"
            size={40}
            testTag="level_complete_home_button"
          >
            <Home className="w-4 h-4 text-white" />
          </SmoziIconButton>
        </div>
      </div>
    </div>
  );
};
