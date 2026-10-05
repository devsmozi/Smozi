import React, { useState } from 'react';
import { PlayerData } from '../models/GameModels.ts';
import { UserProfileFrame } from './UserProfileFrame.tsx';
import { SmoziButton, SmoziIconButton } from './SmoziButton.tsx';
import { X, Trophy, Star, Flame, MapPin, Edit2, Check } from 'lucide-react';

interface UserProfileDialogProps {
  playerData: PlayerData;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onClose: () => void;
}

const AVAILABLE_AVATARS = ['👑', '🦁', '🧙', '🦊', '🐱', '🐼', '🤖', '🚀', '⭐', '🐯'];

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  playerData,
  onUpdatePlayerData,
  onClose
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerData.playerName || 'Puzzle Master');
  const [selectedAvatar, setSelectedAvatar] = useState(playerData.avatarIcon || '👑');

  const getRankTitle = (lvl: number) => {
    if (lvl <= 5) return 'Novice Puzzler';
    if (lvl <= 15) return 'Adept Strategist';
    if (lvl <= 30) return 'Master Builder';
    return 'Legendary Grandmaster';
  };

  const handleSaveProfile = () => {
    const trimmed = nameInput.trim() || 'Puzzle Master';
    const updated: PlayerData = {
      ...playerData,
      playerName: trimmed,
      avatarIcon: selectedAvatar
    };
    onUpdatePlayerData(updated);
    setIsEditingName(false);
  };

  const handleSelectAvatar = (icon: string) => {
    setSelectedAvatar(icon);
    const updated: PlayerData = {
      ...playerData,
      avatarIcon: icon
    };
    onUpdatePlayerData(updated);
  };

  // Count total stars earned
  const totalStars = Object.values(playerData.levelStars || {}).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#131D4A] border-3 border-[#2670E8] p-5 shadow-2xl flex flex-col items-center animate-pop-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 active:scale-90 transition-transform cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Purple Ribbon Header */}
        <div className="px-6 py-2 rounded-2xl bg-gradient-to-b from-[#007AFF] to-[#0051B3] border-2 border-[#68B1FF] shadow-lg -mt-10 mb-2">
          <span className="font-black text-xl text-white tracking-wide">
            PLAYER PROFILE
          </span>
        </div>

        {/* Large Golden Winged Crest Frame */}
        <div className="my-2">
          <UserProfileFrame
            size={130}
            avatarIcon={selectedAvatar}
            avatarBgColor="bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA]"
          />
        </div>

        {/* Editable Name & Rank Title */}
        <div className="flex flex-col items-center mt-1 mb-3">
          {isEditingName ? (
            <div className="flex items-center space-x-1.5 mt-1">
              <input
                type="text"
                value={nameInput}
                maxLength={16}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-2.5 py-1 text-sm font-black rounded-lg bg-black/40 border border-[#007AFF] text-white text-center outline-none focus:border-amber-400"
                autoFocus
              />
              <button
                onClick={handleSaveProfile}
                className="p-1 rounded-lg bg-green-600 hover:bg-green-500 text-white cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="flex items-center space-x-1.5 cursor-pointer group"
            >
              <span className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                {playerData.playerName || 'Puzzle Master'}
              </span>
              <Edit2 className="w-3.5 h-3.5 text-indigo-300 opacity-70 group-hover:opacity-100" />
            </div>
          )}

          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-[11px]">
              Level {playerData.currentLevel}
            </span>
            <span className="text-indigo-200 font-bold text-xs">
              {getRankTitle(playerData.currentLevel)}
            </span>
          </div>
        </div>

        {/* Avatar Selector Tray */}
        <div className="w-full bg-[#0C1333] border border-[#1E2E66] rounded-2xl p-2.5 mb-3">
          <span className="text-[10px] font-bold text-[#8BA5F8] uppercase tracking-wider block mb-1.5 text-center">
            Choose Crest Avatar
          </span>
          <div className="flex items-center justify-center space-x-2 overflow-x-auto py-1">
            {AVAILABLE_AVATARS.map((icon) => (
              <button
                key={icon}
                onClick={() => handleSelectAvatar(icon)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                  selectedAvatar === icon
                    ? 'bg-amber-500 scale-110 shadow-md ring-2 ring-white'
                    : 'bg-white/5 hover:bg-white/10 active:scale-95'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Key Career Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          {/* Classic Best */}
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-200">Classic Record</span>
              <span className="text-sm font-black text-white">{playerData.classicHighScore}</span>
            </div>
          </div>

          {/* Adventure Progress */}
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 flex items-center space-x-2.5">
            <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-200">Adventure Lv</span>
              <span className="text-sm font-black text-white">{playerData.currentLevel}</span>
            </div>
          </div>

          {/* Total Stars */}
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 flex items-center space-x-2.5">
            <Star className="w-5 h-5 text-yellow-400 fill-current shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-200">Stars Earned</span>
              <span className="text-sm font-black text-white">{totalStars} ★</span>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/5 flex items-center space-x-2.5">
            <Flame className="w-5 h-5 text-orange-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-200">Daily Streak</span>
              <span className="text-sm font-black text-white">{playerData.dailyStreak} Days</span>
            </div>
          </div>
        </div>

        {/* Done / Close Button */}
        <SmoziButton
          text="Save & Close"
          style="GREEN"
          onClick={() => {
            handleSaveProfile();
            onClose();
          }}
          className="w-full text-sm py-2.5"
          testTag="user_profile_done_button"
        />
      </div>
    </div>
  );
};
