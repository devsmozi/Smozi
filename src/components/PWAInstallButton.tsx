import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Sparkles, Smartphone, X, ArrowDownCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA or inside APK/TWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`relative group overflow-hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-[#34C759] via-[#28A745] to-[#1E7E34] border-2 border-[#A8FFB2] text-white font-black text-xs shadow-[0_4px_14px_rgba(52,199,89,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer ${className}`}
        title="Install Smozi for Offline Play!"
      >
        {/* Specular sheen */}
        <div className="absolute top-0 left-1 right-1 h-2/5 rounded-t-xl bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* Shimmer light sweep */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <ArrowDownCircle className="w-4 h-4 text-yellow-200 animate-bounce" />
        <span className="tracking-wide drop-shadow-sm text-[11px]">GET APP</span>
        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`relative group overflow-hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-[#3A4E88] to-[#1E2B52] border-1.5 border-[#7593E8] text-white font-black text-xs shadow-[0_3px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer ${className}`}
          title="Add Smozi to iPhone Home Screen"
        >
          {/* Specular sheen */}
          <div className="absolute top-0 left-1 right-1 h-2/5 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

          <Smartphone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="tracking-wide text-[11px]">ADD TO HOME</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#182352] via-[#0F1638] to-[#080B1E] border-3 border-[#FFD700] p-6 shadow-2xl relative text-center">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg flex items-center justify-center">
                <img src="/icon.svg" alt="App Icon" className="w-full h-full rounded-2xl" />
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                Install SMOZI on iOS
              </h3>

              <div className="bg-[#0A0E27] p-3.5 rounded-2xl border border-[#2670E8] text-left text-xs text-indigo-100 space-y-2 mb-4 shadow-inner">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-[10px]">1</span>
                  <span>Tap the <strong className="text-white">Share</strong> button in Safari.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-[10px]">2</span>
                  <span>Scroll down & tap <strong className="text-amber-300">Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-[10px]">3</span>
                  <span>Launch from home screen for fullscreen offline play!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 border border-emerald-300 text-white font-black text-sm shadow-lg hover:brightness-110 active:scale-95"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
