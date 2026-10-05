import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SKIN_THEMES } from '../models/SkinTheme.ts';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { X } from 'lucide-react';

interface SettingsDialogProps {
  playerData: PlayerData;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
  onToggleVibration: (enabled: boolean) => void;
  onSelectTheme: (themeId: string) => void;
  onDismiss: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  playerData,
  onToggleSound,
  onToggleMusic,
  onToggleVibration,
  onSelectTheme,
  onDismiss
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#2670E8] p-5 shadow-2xl flex flex-col items-center animate-pop-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between">
          <span className="font-black text-2xl text-white">Settings</span>
          <SmoziIconButton
            onClick={onDismiss}
            style="RED"
            size={36}
            testTag="settings_close_button"
          >
            <X className="w-5 h-5 text-white" />
          </SmoziIconButton>
        </div>

        <div className="w-full flex flex-col space-y-3.5 my-4">
          {/* Sound Toggle */}
          <div className="w-full flex items-center justify-between py-1">
            <span className="font-bold text-white text-base">Sound Effects</span>
            <input
              type="checkbox"
              checked={playerData.soundEnabled}
              onChange={(e) => onToggleSound(e.target.checked)}
              className="w-6 h-6 accent-[#34C759] cursor-pointer"
            />
          </div>

          {/* Music Toggle */}
          <div className="w-full flex items-center justify-between py-1">
            <span className="font-bold text-white text-base">Music</span>
            <input
              type="checkbox"
              checked={playerData.musicEnabled}
              onChange={(e) => onToggleMusic(e.target.checked)}
              className="w-6 h-6 accent-[#34C759] cursor-pointer"
            />
          </div>

          {/* Vibration Toggle */}
          <div className="w-full flex items-center justify-between py-1">
            <span className="font-bold text-white text-base">Vibration</span>
            <input
              type="checkbox"
              checked={playerData.vibrationEnabled}
              onChange={(e) => onToggleVibration(e.target.checked)}
              className="w-6 h-6 accent-[#34C759] cursor-pointer"
            />
          </div>
        </div>

        {/* Theme Selector */}
        <div className="w-full mt-2">
          <span className="text-xs font-bold text-[#8BA5F8] uppercase tracking-wider block mb-2">
            Background Skin & Theme
          </span>

          <div className="grid grid-cols-3 gap-2">
            {SKIN_THEMES.map((skin) => {
              const isSelected =
                playerData.selectedTheme.toLowerCase() === skin.id.toLowerCase() ||
                playerData.selectedTheme.toLowerCase() === skin.name.toLowerCase();

              return (
                <button
                  key={skin.id}
                  onClick={() => onSelectTheme(skin.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2979FF] ring-2 ring-[#2979FF]/50 scale-102'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{
                    backgroundColor: skin.boardBackground
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full mb-1 shadow-sm"
                    style={{ backgroundColor: skin.primaryAccent }}
                  />
                  <span
                    className={`text-[11px] truncate w-full text-center ${
                      isSelected ? 'font-black text-white' : 'font-medium text-[#A5B4FC]'
                    }`}
                  >
                    {skin.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <SmoziButton
          text="Done"
          style="GREEN"
          onClick={onDismiss}
          className="w-3/4 mt-6"
          testTag="settings_done_button"
        />
      </div>
    </div>
  );
};
