import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X } from 'lucide-react';

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
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 border border-emerald-300 text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-2 border-[#2670E8] p-5 shadow-2xl relative text-center">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-white mt-1 mb-2">
                Install on iPhone / iPad
              </h3>
              <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
                1. Tap the <strong className="text-white">Share</strong> button in your Safari toolbar.<br />
                2. Scroll down and select <strong className="text-amber-300">Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#2670E8] hover:bg-[#1a56b8] text-white font-black text-sm"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
