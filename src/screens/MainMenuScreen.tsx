import React, { useState } from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SmoziButton, SmoziIconButton } from '../components/SmoziButton.tsx';
import { SmoziLogoView } from '../components/SmoziLogoView.tsx';
import { UserProfileFrame } from '../components/UserProfileFrame.tsx';
import { UserProfileDialog } from '../components/UserProfileDialog.tsx';
import { DailyQuestsDialog } from '../components/DailyQuestsDialog.tsx';
import { PWAInstallButton } from '../components/PWAInstallButton.tsx';
import { getSkinTheme } from '../models/SkinTheme.ts';
import { Settings, Gift, Trophy, Target, Play, Compass } from 'lucide-react';

interface MainMenuScreenProps {
  playerData: PlayerData;
  onUpdatePlayerData: (data: PlayerData) => void;
  onStartClassic: () => void;
  onOpenAdventure: () => void;
  onStartDailyChallenge: () => void;
  onOpenSettings: () => void;
  onOpenDailyReward: () => void;
  onOpenAchievements: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  playerData,
  onUpdatePlayerData,
  onStartClassic,
  onOpenAdventure,
  onStartDailyChallenge,
  onOpenSettings,
  onOpenDailyReward,
  onOpenAchievements
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  const handleClaimQuest = (questId: string, rewardCoins: number, rewardGems: number) => {
    const updated: PlayerData = {
      ...playerData,
      coins: playerData.coins + rewardCoins,
      gems: playerData.gems + rewardGems,
      achievements: {
        ...playerData.achievements,
        [questId]: 1
      }
    };
    onUpdatePlayerData(updated);
  };

  const currentSkin = getSkinTheme(playerData.selectedTheme);

  return (
    <div
      className="w-full h-full min-h-screen flex flex-col justify-between p-4 sm:p-5 select-none max-w-md mx-auto transition-all duration-300"
      style={{
        background: currentSkin.backgroundGradient
      }}
    >
      {/* Top Bar: Player profile & Currency pills */}
      <div className="w-full flex items-center justify-between">
        {/* Golden Cartouche Player Profile Badge */}
        <button
          onClick={() => setShowProfile(true)}
          className="relative group overflow-hidden flex items-center space-x-2 pl-1.5 pr-3 py-1 rounded-full bg-gradient-to-r from-[#172559] to-[#0D153B] border-2 border-[#FFD700] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          title="Open Player Profile"
        >
          {/* Subtle specular sheen */}
          <div className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

          <UserProfileFrame
            size={38}
            avatarIcon={playerData.avatarIcon || '👑'}
          />
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors drop-shadow-sm flex items-center space-x-1">
              <span>{playerData.playerName || 'Player'}</span>
              <span className="text-[10px] text-amber-300 opacity-80">✦</span>
            </span>
            <span className="text-[9px] font-black text-[#FFD700] tracking-wider uppercase">
              Level {playerData.currentLevel}
            </span>
          </div>
        </button>

        {/* Currency & Actions Container */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* PWA Install Button (Creative 3D Emerald Capsule) */}
          <PWAInstallButton />

          {/* 3D Golden Coins Capsule */}
          <div className="relative overflow-hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#1E2958] to-[#0E1538] border-2 border-[#FFD700] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <div className="absolute top-0 left-1 right-1 h-1/2 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="text-xs drop-shadow-sm animate-pulse">🪙</span>
            <span className="text-xs font-black text-[#FFE680] drop-shadow-sm tracking-tight">
              {playerData.coins.toLocaleString()}
            </span>
          </div>

          {/* 3D Sapphire Gems Capsule */}
          <div className="relative overflow-hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#16275A] to-[#0A1333] border-2 border-[#38B6FF] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <div className="absolute top-0 left-1 right-1 h-1/2 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="text-xs drop-shadow-sm">💎</span>
            <span className="text-xs font-black text-[#8AE3FF] drop-shadow-sm tracking-tight">
              {playerData.gems.toLocaleString()}
            </span>
          </div>

          {/* Creative Royal Gear Settings Button */}
          <button
            onClick={onOpenSettings}
            data-testid="menu_settings_button"
            className="relative group overflow-hidden w-9 h-9 rounded-2xl bg-gradient-to-b from-[#9C27B0] via-[#7B1FA2] to-[#4A148C] border-2 border-[#E1BEE7] shadow-[0_4px_10px_rgba(123,31,162,0.45),inset_0_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center text-white hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
            title="Game Settings"
          >
            {/* Top specular curve */}
            <div className="absolute top-0 left-1 right-1 h-2/5 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
            <Settings className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow-sm" />
          </button>
        </div>
      </div>

      {/* Center: SMOZI Official Candy 3D Logo */}
      <div className="flex flex-col items-center my-auto py-3">
        <SmoziLogoView className="mb-2 scale-95 sm:scale-100" />
        <span className="text-xs font-extrabold text-[#8BA5F8] tracking-[0.25em] drop-shadow-sm">
          PREMIUM BLOCK PUZZLE
        </span>
      </div>

      {/* Main Game Mode Buttons: Clean, Simple, Bold 3D Candy Arcade Style */}
      <div className="w-full flex flex-col space-y-3.5 my-auto">
        {/* 1. CLASSIC BUTTON */}
        <button
          onClick={onStartClassic}
          data-testid="menu_play_classic_button"
          className="relative group overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-[#4CD964] via-[#34C759] to-[#248A3D] border-2 border-[#A3FFAE] shadow-[0_6px_0_#175927,0_10px_16px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#175927,0_4px_8px_rgba(0,0,0,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-3 text-white select-none"
        >
          {/* Specular curved highlight */}
          <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
          <Play className="w-6 h-6 fill-current text-white drop-shadow-md group-hover:scale-110 transition-transform" />
          <span className="font-black text-xl tracking-wider text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
            CLASSIC
          </span>
        </button>

        {/* 2. ADVENTURE BUTTON */}
        <button
          onClick={onOpenAdventure}
          data-testid="menu_play_adventure_button"
          className="relative group overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-[#FFCC00] via-[#FF9500] to-[#CC6D00] border-2 border-[#FFE885] shadow-[0_6px_0_#804400,0_10px_16px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#804400,0_4px_8px_rgba(0,0,0,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-3 text-white select-none"
        >
          {/* Specular curved highlight */}
          <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
          <Compass className="w-6 h-6 text-white drop-shadow-md group-hover:rotate-45 transition-transform" />
          <span className="font-black text-xl tracking-wider text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
            ADVENTURE
          </span>
        </button>

        {/* 3. DAILY CHALLENGE BUTTON */}
        <button
          onClick={onStartDailyChallenge}
          data-testid="menu_play_daily_button"
          className="relative group overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-[#AF52DE] via-[#8944AB] to-[#5A1E7A] border-2 border-[#E8B4F8] shadow-[0_6px_0_#3F1356,0_10px_16px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#3F1356,0_4px_8px_rgba(0,0,0,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-3 text-white select-none"
        >
          {/* Specular curved highlight */}
          <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
          <Trophy className="w-6 h-6 text-yellow-300 drop-shadow-md group-hover:scale-110 transition-transform" />
          <span className="font-black text-xl tracking-wider text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
            DAILY CHALLENGE
          </span>
        </button>
      </div>

      {/* Bottom Actions: Daily Reward, Quests & Achievements */}
      <div className="w-full grid grid-cols-3 gap-2 pt-1">
        {/* Daily Reward Button */}
        <button
          onClick={onOpenDailyReward}
          className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2.5 px-1.5 rounded-2xl bg-gradient-to-b from-[#182352] to-[#0A102E] border-1.5 border-[#FF9500] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#FFCC00] to-[#FF9500] flex items-center justify-center text-white shadow-sm shrink-0">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black text-white truncate">Daily Gift</span>
        </button>

        {/* Daily Missions / Quests Button */}
        <button
          onClick={() => setShowQuests(true)}
          className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2.5 px-1.5 rounded-2xl bg-gradient-to-b from-[#182352] to-[#0A102E] border-1.5 border-[#2670E8] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#2670E8] to-[#1447A8] flex items-center justify-center text-white shadow-sm shrink-0">
            <Target className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-[11px] font-black text-white truncate">Missions</span>
        </button>

        {/* Achievements Button */}
        <button
          onClick={onOpenAchievements}
          className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2.5 px-1.5 rounded-2xl bg-gradient-to-b from-[#182352] to-[#0A102E] border-1.5 border-[#AF52DE] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#AF52DE] to-[#7A21AA] flex items-center justify-center text-white shadow-sm shrink-0">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black text-white truncate">Trophies</span>
        </button>
      </div>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileDialog
          playerData={playerData}
          onUpdatePlayerData={onUpdatePlayerData}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Daily Quests / Missions Modal */}
      {showQuests && (
        <DailyQuestsDialog
          playerData={playerData}
          onClaimQuest={handleClaimQuest}
          onClose={() => setShowQuests(false)}
        />
      )}
    </div>
  );
};
