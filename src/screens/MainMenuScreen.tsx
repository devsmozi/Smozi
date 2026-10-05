import React from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { SmoziButton, SmoziIconButton } from '../components/SmoziButton.tsx';
import { SmoziLogoView } from '../components/SmoziLogoView.tsx';
import { Settings, Gift, Trophy } from 'lucide-react';

interface MainMenuScreenProps {
  playerData: PlayerData;
  onStartClassic: () => void;
  onOpenAdventure: () => void;
  onStartDailyChallenge: () => void;
  onOpenSettings: () => void;
  onOpenDailyReward: () => void;
  onOpenAchievements: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  playerData,
  onStartClassic,
  onOpenAdventure,
  onStartDailyChallenge,
  onOpenSettings,
  onOpenDailyReward,
  onOpenAchievements
}) => {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#0D163D] via-[#090E29] to-[#050819] flex flex-col justify-between p-5 select-none max-w-md mx-auto">
      {/* Top Bar: Player profile & Currency pills */}
      <div className="w-full flex items-center justify-between">
        {/* Player Badge */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#131D4A] border-1.5 border-[#2670E8] shadow-md">
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-sm shadow-inner">
            ⭐
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-white">Player</span>
            <span className="text-[11px] font-extrabold text-[#FFD700]">
              Lv {playerData.currentLevel}
            </span>
          </div>
        </div>

        {/* Currency & Settings */}
        <div className="flex items-center space-x-2">
          {/* Coins */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-2xl bg-[#131D4A] border-1.5 border-[#FFD700] shadow-md">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-[#FFE680]">
              {playerData.coins}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-2xl bg-[#131D4A] border-1.5 border-[#007AFF] shadow-md">
            <span className="text-sm">💎</span>
            <span className="text-xs font-black text-[#68B1FF]">
              {playerData.gems}
            </span>
          </div>

          {/* Settings Button */}
          <SmoziIconButton
            onClick={onOpenSettings}
            style="PURPLE"
            size={38}
            testTag="menu_settings_button"
          >
            <Settings className="w-5 h-5 text-white" />
          </SmoziIconButton>
        </div>
      </div>

      {/* Center: SMOZI Official Candy 3D Logo */}
      <div className="flex flex-col items-center my-auto py-4">
        <SmoziLogoView className="mb-2" />
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

      {/* Bottom Actions: Daily Reward & Achievements */}
      <div className="w-full flex items-center justify-around pt-3">
        {/* Daily Reward Button */}
        <button
          onClick={onOpenDailyReward}
          className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-[#131D4A] border-1.5 border-[#FF9500] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#FFCC00] to-[#FF9500] flex items-center justify-center text-white shadow-sm">
            <Gift className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Daily Reward</span>
        </button>

        {/* Achievements Button */}
        <button
          onClick={onOpenAchievements}
          className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-[#131D4A] border-1.5 border-[#AF52DE] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#AF52DE] to-[#7A21AA] flex items-center justify-center text-white shadow-sm">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Achievements</span>
        </button>
      </div>
    </div>
  );
};
