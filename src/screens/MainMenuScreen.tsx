import React, { useState } from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SmoziButton, SmoziIconButton } from '../components/SmoziButton.tsx';
import { SmoziLogoView } from '../components/SmoziLogoView.tsx';
import { UserProfileFrame } from '../components/UserProfileFrame.tsx';
import { UserProfileDialog } from '../components/UserProfileDialog.tsx';
import { DailyQuestsDialog } from '../components/DailyQuestsDialog.tsx';
import { PWAInstallButton } from '../components/PWAInstallButton.tsx';
import { Settings, Gift, Trophy, Target } from 'lucide-react';

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

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#0D163D] via-[#090E29] to-[#050819] flex flex-col justify-between p-4 sm:p-5 select-none max-w-md mx-auto">
      {/* Top Bar: Player profile & Currency pills */}
      <div className="w-full flex items-center justify-between">
        {/* Golden Crest Player Profile Badge */}
        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center space-x-2 px-2 py-1 rounded-full bg-[#131D4A] border-1.5 border-[#2670E8] shadow-md hover:bg-[#1C2B66] active:scale-95 transition-all cursor-pointer group"
          title="Open Player Profile"
        >
          <UserProfileFrame
            size={40}
            avatarIcon={playerData.avatarIcon || '👑'}
          />
          <div className="flex flex-col text-left leading-tight pr-2">
            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              {playerData.playerName || 'Player'}
            </span>
            <span className="text-[10px] font-extrabold text-[#FFD700]">
              Lv {playerData.currentLevel}
            </span>
          </div>
        </button>

        {/* Currency & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* PWA Install Button (shows only if installable or iOS) */}
          <PWAInstallButton />

          {/* Coins */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-[#131D4A] border-1.5 border-[#FFD700] shadow-md">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-[#FFE680]">
              {playerData.coins}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center space-x-1 px-2 py-1.5 rounded-2xl bg-[#131D4A] border-1.5 border-[#007AFF] shadow-md">
            <span className="text-sm">💎</span>
            <span className="text-xs font-black text-[#68B1FF]">
              {playerData.gems}
            </span>
          </div>

          {/* Settings Button */}
          <SmoziIconButton
            onClick={onOpenSettings}
            style="PURPLE"
            size={36}
            testTag="menu_settings_button"
          >
            <Settings className="w-4 h-4 text-white" />
          </SmoziIconButton>
        </div>
      </div>

      {/* Center: SMOZI Official Candy 3D Logo */}
      <div className="flex flex-col items-center my-auto py-3">
        <SmoziLogoView className="mb-2 scale-95 sm:scale-100" />
        <span className="text-xs font-extrabold text-[#8BA5F8] tracking-[0.25em] drop-shadow-sm">
          PREMIUM BLOCK PUZZLE
        </span>
      </div>

      {/* Main Game Mode Buttons */}
      <div className="w-full flex flex-col space-y-3.5 my-auto">
        <SmoziButton
          text="▶  CLASSIC"
          style="GREEN"
          onClick={onStartClassic}
          className="w-full py-4 text-lg"
          testTag="menu_play_classic_button"
        />

        <SmoziButton
          text="🗺️  ADVENTURE"
          style="YELLOW_ORANGE"
          onClick={onOpenAdventure}
          className="w-full py-4 text-lg"
          testTag="menu_play_adventure_button"
        />

        <SmoziButton
          text="🏆  DAILY CHALLENGE"
          style="PURPLE"
          onClick={onStartDailyChallenge}
          className="w-full py-4 text-lg"
          testTag="menu_play_daily_button"
        />
      </div>

      {/* Bottom Actions: Daily Reward, Quests & Achievements */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2">
        {/* Daily Reward Button */}
        <button
          onClick={onOpenDailyReward}
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-2xl bg-[#131D4A] border border-[#FF9500]/60 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#FFCC00] to-[#FF9500] flex items-center justify-center text-white shadow-sm shrink-0">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white truncate">Daily Gift</span>
        </button>

        {/* Daily Missions / Quests Button */}
        <button
          onClick={() => setShowQuests(true)}
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-2xl bg-[#131D4A] border border-[#2670E8]/60 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#2670E8] to-[#1447A8] flex items-center justify-center text-white shadow-sm shrink-0">
            <Target className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-[11px] font-bold text-white truncate">Missions</span>
        </button>

        {/* Achievements Button */}
        <button
          onClick={onOpenAchievements}
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-2xl bg-[#131D4A] border border-[#AF52DE]/60 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#AF52DE] to-[#7A21AA] flex items-center justify-center text-white shadow-sm shrink-0">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white truncate">Trophies</span>
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
