import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SKIN_THEMES, SkinTheme } from '../models/SkinTheme.ts';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { X, Check, Sparkles, Volume2, VolumeX, Music, Smartphone, Palette } from 'lucide-react';

interface SettingsDialogProps {
  playerData: PlayerData;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
  onToggleVibration: (enabled: boolean) => void;
  onSelectTheme: (themeId: string) => void;
  onDismiss: () => void;
}

const THEME_ICONS: Record<string, string> = {
  'classic navy': '🌌',
  'neon night': '⚡',
  'wooden timber': '🪵',
  'candy wonderland': '🍭',
  'mystic forest': '🌿',
  'volcanic magma': '🌋'
};

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none animate-fade-in"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#182352] via-[#0F1638] to-[#080B1E] border-3 border-[#2670E8] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(38,112,232,0.3)] flex flex-col items-center animate-pop-in max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <span className="font-black text-xl text-white tracking-wide">Settings</span>
          </div>
          <SmoziIconButton
            onClick={onDismiss}
            style="RED"
            size={34}
            testTag="settings_close_button"
          >
            <X className="w-4 h-4 text-white" />
          </SmoziIconButton>
        </div>

        {/* Audio & Haptic Controls */}
        <div className="w-full flex flex-col space-y-2.5 my-3 bg-[#0A0E27] p-3 rounded-2xl border border-white/10 shadow-inner">
          {/* Sound Toggle */}
          <div className="w-full flex items-center justify-between py-0.5">
            <div className="flex items-center space-x-2">
              {playerData.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
              <span className="font-bold text-white text-xs">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={playerData.soundEnabled}
                onChange={(e) => onToggleSound(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#34C759]"></div>
            </label>
          </div>

          {/* Music Toggle */}
          <div className="w-full flex items-center justify-between py-0.5">
            <div className="flex items-center space-x-2">
              <Music className={`w-4 h-4 ${playerData.musicEnabled ? 'text-indigo-400' : 'text-gray-400'}`} />
              <span className="font-bold text-white text-xs">Background Music</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={playerData.musicEnabled}
                onChange={(e) => onToggleMusic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#34C759]"></div>
            </label>
          </div>

          {/* Vibration Toggle */}
          <div className="w-full flex items-center justify-between py-0.5">
            <div className="flex items-center space-x-2">
              <Smartphone className={`w-4 h-4 ${playerData.vibrationEnabled ? 'text-amber-400' : 'text-gray-400'}`} />
              <span className="font-bold text-white text-xs">Haptic Feedback</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={playerData.vibrationEnabled}
                onChange={(e) => onToggleVibration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#34C759]"></div>
            </label>
          </div>
        </div>

        {/* Theme / Skins Selector Section */}
        <div className="w-full mt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-black uppercase text-[#8BA5F8] tracking-widest">
                BOARD SKINS & THEMES
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-bold">
              {SKIN_THEMES.length} Available
            </span>
          </div>

          {/* 6 High-Quality Themed 3D Skin Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            {SKIN_THEMES.map((skin) => {
              const isSelected =
                playerData.selectedTheme.toLowerCase() === skin.id.toLowerCase() ||
                playerData.selectedTheme.toLowerCase() === skin.name.toLowerCase();

              const icon = THEME_ICONS[skin.id.toLowerCase()] || '🎨';

              return (
                <button
                  key={skin.id}
                  onClick={() => onSelectTheme(skin.id)}
                  className={`group relative overflow-hidden flex flex-col items-center justify-between p-2 rounded-2xl transition-all duration-150 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-2 border-amber-300 ring-2 ring-amber-400/60 shadow-[0_4px_16px_rgba(255,215,0,0.35)] scale-102'
                      : 'border-2 border-white/10 hover:border-white/30 hover:scale-[1.02] shadow-sm'
                  }`}
                  style={{
                    background: skin.backgroundGradient
                  }}
                  title={`Equip ${skin.name} Theme`}
                >
                  {/* Specular sheen curve */}
                  <div className="absolute top-0 left-1 right-1 h-2/5 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  {/* Top Bar inside skin button: Icon & Name */}
                  <div className="w-full flex items-center justify-center space-x-1 z-10">
                    <span className="text-xs">{icon}</span>
                    <span
                      className={`text-[10px] font-black truncate ${
                        isSelected ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {skin.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Miniature 2x2 Themed Board Preview Box */}
                  <div
                    className="w-12 h-12 my-1.5 rounded-xl p-1 flex items-center justify-center shadow-inner z-10 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: skin.boardBackground,
                      border: `1.5px solid ${skin.boardBorder}`
                    }}
                  >
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
                      {/* Cell 1: Glossy Theme Primary Block */}
                      <div
                        className="rounded-md shadow-xs relative overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: skin.primaryAccent }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-t-md" />
                      </div>

                      {/* Cell 2: Empty Grid Slot */}
                      <div
                        className="rounded-md border border-white/5"
                        style={{ backgroundColor: skin.emptyCellColor }}
                      />

                      {/* Cell 3: Empty Grid Slot */}
                      <div
                        className="rounded-md border border-white/5"
                        style={{ backgroundColor: skin.emptyCellColor }}
                      />

                      {/* Cell 4: Golden Gem Accent Block */}
                      <div
                        className="rounded-md shadow-xs relative overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: skin.crownColor }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/50 rounded-t-md" />
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isSelected ? (
                    <div className="w-full py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-black shadow-xs flex items-center justify-center space-x-0.5 z-10">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>EQUIPPED</span>
                    </div>
                  ) : (
                    <div className="w-full py-0.5 rounded-full bg-white/10 group-hover:bg-white/20 text-white/70 group-hover:text-white text-[9px] font-bold text-center z-10 transition-colors">
                      Equip
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done / Close Button */}
        <SmoziButton
          text="SAVE & APPLY"
          style="GREEN"
          onClick={onDismiss}
          className="w-full py-3.5 mt-5 shadow-[0_8px_20px_rgba(52,199,89,0.4)] text-sm"
          testTag="settings_done_button"
        />
      </div>
    </div>
  );
};
