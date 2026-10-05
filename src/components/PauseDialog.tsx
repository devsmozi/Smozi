import React from 'react';
import { SmoziButton } from './SmoziButton.tsx';

interface PauseDialogProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onHome: () => void;
  onDismiss: () => void;
}

export const PauseDialog: React.FC<PauseDialogProps> = ({
  onResume,
  onRestart,
  onSettings,
  onHome,
  onDismiss
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#2670E8] p-6 shadow-2xl flex flex-col items-center animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue Ribbon Header */}
        <div className="px-8 py-2 rounded-2xl bg-gradient-to-b from-[#007AFF] to-[#0051B3] border-2 border-[#68B1FF] shadow-lg -mt-10">
          <span className="font-black text-2xl text-white tracking-widest">
            PAUSE
          </span>
        </div>

        <div className="w-full flex flex-col space-y-3.5 mt-8">
          <SmoziButton
            text="Resume"
            style="GREEN"
            onClick={onResume}
            className="w-full"
            testTag="pause_resume_button"
          />
          <SmoziButton
            text="Restart"
            style="BLUE"
            onClick={onRestart}
            className="w-full"
            testTag="pause_restart_button"
          />
          <SmoziButton
            text="Settings"
            style="PURPLE"
            onClick={onSettings}
            className="w-full"
            testTag="pause_settings_button"
          />
          <SmoziButton
            text="Main Menu"
            style="RED"
            onClick={onHome}
            className="w-full"
            testTag="pause_home_button"
          />
        </div>
      </div>
    </div>
  );
};
