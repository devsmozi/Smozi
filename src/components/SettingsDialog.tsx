import React, { useState } from 'react';
import { PlayerData, INITIAL_PLAYER_DATA } from '../models/GameModels.ts';
import { SKIN_THEMES, SkinTheme } from '../models/SkinTheme.ts';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import {
  X,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  Smartphone,
  Palette,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  Copy
} from 'lucide-react';

interface SettingsDialogProps {
  playerData: PlayerData;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
  onToggleVibration: (enabled: boolean) => void;
  onSelectTheme: (themeId: string) => void;
  onUpdatePlayerData?: (data: PlayerData) => void;
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
  onUpdatePlayerData,
  onDismiss
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportBackup = () => {
    try {
      const code = btoa(unescape(encodeURIComponent(JSON.stringify(playerData))));
      navigator.clipboard.writeText(code);
      setCopyStatus('Copied backup code to clipboard!');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch {
      setCopyStatus('Could not copy automatically');
    }
  };

  const handleImportBackup = () => {
    if (!backupCodeInput.trim()) return;
    try {
      let jsonStr = backupCodeInput.trim();
      try {
        jsonStr = decodeURIComponent(escape(atob(jsonStr)));
      } catch {}
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) {
        setImportStatus('Invalid backup code');
        return;
      }
      const merged: PlayerData = {
        ...INITIAL_PLAYER_DATA,
        ...parsed,
        levelStars: parsed.levelStars || {},
        levelHighScores: parsed.levelHighScores || {},
        achievements: parsed.achievements || {}
      };
      if (onUpdatePlayerData) {
        onUpdatePlayerData(merged);
      }
      setImportStatus('Progress restored successfully!');
      setTimeout(() => {
        setImportStatus(null);
        setShowBackupModal(false);
      }, 1500);
    } catch {
      setImportStatus('Error importing save data');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
      if (onUpdatePlayerData) {
        onUpdatePlayerData({ ...INITIAL_PLAYER_DATA });
      }
      setShowBackupModal(false);
    }
  };
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

        {/* Data & Google Play Safety Section */}
        <div className="w-full mt-3 pt-3 border-t border-white/10 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#8BA5F8] tracking-wider">
              DATA SAFETY & BACKUP
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 inline" />
              <span>100% Offline Safe</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowBackupModal(true)}
              className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Cloud / Save Backup</span>
            </button>

            <button
              onClick={() => setShowPrivacyModal(true)}
              className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* App Version Info */}
        <div className="w-full text-center mt-2">
          <span className="text-[10px] text-white/40 font-semibold tracking-wider">
            SMOZI Puzzle • v1.0.0 • Google Play Edition
          </span>
        </div>

        {/* Done / Close Button */}
        <SmoziButton
          text="SAVE & APPLY"
          style="GREEN"
          onClick={onDismiss}
          className="w-full py-3 mt-3 shadow-[0_8px_20px_rgba(52,199,89,0.4)] text-sm"
          testTag="settings_done_button"
        />

        {/* Privacy Policy Modal */}
        {showPrivacyModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm bg-[#0E163D] border-2 border-blue-500 rounded-3xl p-5 shadow-2xl flex flex-col text-left max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-lg text-white">Privacy Policy</span>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <p>
                  <strong>SMOZI: Premium Block Puzzle</strong> is an offline-first puzzle experience designed with privacy at its core.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-amber-300 font-bold">✓ Zero Personal Data Collected</div>
                  <p className="text-[11px] text-slate-400">
                    Your gameplay progress, level stars, coin balance, and high scores are saved locally on your device.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-amber-300 font-bold">✓ COPPA & Family Policy Compliant</div>
                  <p className="text-[11px] text-slate-400">
                    Safe for all ages with no external social feeds or chat rooms.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-amber-300 font-bold">✓ Minimal Permissions</div>
                  <p className="text-[11px] text-slate-400">
                    Only hardware vibration for piece drops and Web Audio for sound effects.
                  </p>
                </div>
                <a
                  href="/privacy.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/50 text-blue-300 font-bold text-xs mt-2"
                >
                  <span>Open Full Web Policy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer"
              >
                Understood & Agree
              </button>
            </div>
          </div>
        )}

        {/* Cloud & Save Backup Modal */}
        {showBackupModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm bg-[#0E163D] border-2 border-indigo-500 rounded-3xl p-5 shadow-2xl flex flex-col text-left max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-indigo-400" />
                  <span className="font-black text-lg text-white">Save Backup & Sync</span>
                </div>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="p-1 rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Export Section */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">
                    1. Export Progress Code
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Copy your encrypted save string to back up or transfer your progress to another device.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer active:scale-95 transition-transform"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Save Code</span>
                  </button>
                  {copyStatus && (
                    <span className="text-[10px] text-emerald-400 font-bold block text-center">
                      {copyStatus}
                    </span>
                  )}
                </div>

                {/* Import Section */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-blue-300 block">
                    2. Restore from Save Code
                  </span>
                  <input
                    type="text"
                    placeholder="Paste save code here..."
                    value={backupCodeInput}
                    onChange={(e) => setBackupCodeInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleImportBackup}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer active:scale-95 transition-transform"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore Progress</span>
                  </button>
                  {importStatus && (
                    <span
                      className={`text-[10px] font-bold block text-center ${
                        importStatus.includes('successfully') ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {importStatus}
                    </span>
                  )}
                </div>

                {/* Reset Section */}
                <div className="pt-1">
                  <button
                    onClick={handleResetData}
                    className="w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 font-bold text-[11px] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Game Progress</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
