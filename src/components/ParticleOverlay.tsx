import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ParticleOverlayProps {
  triggerEffect: number;
  feedbackText: string | null;
  scoreIncrement: number;
  isNewHighScore?: boolean;
  comboPercent: string | null;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({
  triggerEffect,
  feedbackText,
  scoreIncrement,
  isNewHighScore = false,
  comboPercent
}) => {
  useEffect(() => {
    if (triggerEffect > 0) {
      if (feedbackText === 'Amazing!' || feedbackText === 'Excellent!' || isNewHighScore) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [triggerEffect, feedbackText, isNewHighScore]);

  if (!triggerEffect || (!feedbackText && scoreIncrement <= 0 && !comboPercent)) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Shockwave ring pulse */}
      <div className="absolute w-72 h-72 rounded-full border-4 border-white/60 animate-ping duration-700" />

      {/* Floating feedback text banner */}
      {feedbackText && (
        <div className="animate-float-up flex flex-col items-center">
          <div
            className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-white font-black text-3xl tracking-wider shadow-2xl border-2 border-white/80"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}
          >
            {feedbackText}
          </div>

          {comboPercent && (
            <span className="text-yellow-300 font-extrabold text-xl mt-1 drop-shadow-md">
              Combo {comboPercent}
            </span>
          )}

          {scoreIncrement > 0 && (
            <span className="text-white font-black text-2xl mt-1 drop-shadow-lg text-emerald-300">
              +{scoreIncrement}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
