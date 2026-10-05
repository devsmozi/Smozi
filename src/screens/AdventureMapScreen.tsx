import React from 'react';
import { ALL_LEVELS } from '../data/LevelsData.ts';
import { PlayerData } from '../models/GameModels.ts';
import { getSkinTheme } from '../models/SkinTheme.ts';
import { SmoziIconButton } from '../components/SmoziButton.tsx';
import { ArrowLeft, Lock, Star } from 'lucide-react';

interface AdventureMapScreenProps {
  playerData: PlayerData;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const AdventureMapScreen: React.FC<AdventureMapScreenProps> = ({
  playerData,
  onSelectLevel,
  onBack
}) => {
  const currentTheme = getSkinTheme(playerData.selectedTheme);
  const totalStars = Object.values(playerData.levelStars).reduce((sum, s) => sum + s, 0);

  // Group levels by world (1 to 5)
  const currentWorldId = Math.min(5, Math.floor((playerData.currentLevel - 1) / 10) + 1);
  const worldNames: Record<number, string> = {
    1: 'Emerald Forest',
    2: 'Solar Desert',
    3: 'Arctic Glacier',
    4: 'Volcanic Caldera',
    5: 'Cyber Nebula'
  };

  return (
    <div
      className="w-full h-full min-h-screen flex flex-col p-4 select-none max-w-md mx-auto"
      style={{
        background: currentTheme.backgroundGradient
      }}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <SmoziIconButton
          onClick={onBack}
          style="BLUE"
          size={42}
          testTag="adventure_back_button"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </SmoziIconButton>

        {/* World Title Banner */}
        <div className="px-5 py-1.5 rounded-2xl bg-gradient-to-b from-[#2670E8] to-[#1447A8] border-2 border-[#FFCC00] shadow-md flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-[#FFE680] uppercase tracking-wider">
            World {currentWorldId} / 5
          </span>
          <span className="text-sm font-black text-white">
            {worldNames[currentWorldId]}
          </span>
        </div>

        {/* Total Stars Pill */}
        <div
          className="flex items-center space-x-1 px-3 py-1.5 rounded-2xl border-1.5 border-[#FFD700] shadow-md"
          style={{ backgroundColor: currentTheme.boardBackground }}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-amber-300">{totalStars}</span>
        </div>
      </div>

      {/* Levels Grid List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-8 pr-1">
        {[1, 2, 3, 4, 5].map((worldId) => {
          const worldLevels = ALL_LEVELS.filter((l) => l.worldId === worldId);

          return (
            <div
              key={worldId}
              className="p-3.5 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xs mb-4"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <span className="text-xs font-extrabold text-white tracking-wide">
                  WORLD {worldId}: {worldNames[worldId].toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-indigo-300">
                  Levels {(worldId - 1) * 10 + 1} - {worldId * 10}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {worldLevels.map((lvl) => {
                  const isUnlocked =
                    playerData.unlockedLevels.includes(lvl.id) ||
                    lvl.id <= playerData.currentLevel;
                  const isCurrent = lvl.id === playerData.currentLevel;
                  const stars = playerData.levelStars[lvl.id] || 0;

                  return (
                    <button
                      key={lvl.id}
                      disabled={!isUnlocked}
                      onClick={() => onSelectLevel(lvl.id)}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                        !isUnlocked
                          ? 'bg-slate-900/60 border-slate-700 opacity-50 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-yellow-200 ring-3 ring-amber-400/50 shadow-lg scale-105'
                          : 'bg-[#1E2E5E] border-[#3B5998] hover:border-[#68B1FF] active:scale-95 shadow-md'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <span
                            className={`font-black text-sm ${
                              isCurrent ? 'text-black' : 'text-white'
                            }`}
                          >
                            {lvl.id}
                          </span>

                          {/* Mini stars earned */}
                          <div className="flex items-center space-x-0.5 mt-0.5">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-2 h-2 ${
                                  s <= stars
                                    ? 'text-yellow-300 fill-yellow-300'
                                    : 'text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
