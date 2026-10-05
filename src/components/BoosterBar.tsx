import React from 'react';
import { Hammer, Shuffle, Bomb, X } from 'lucide-react';

export type ActiveBoosterMode = 'NONE' | 'HAMMER' | 'BOMB';

interface BoosterBarProps {
  coins: number;
  activeBooster: ActiveBoosterMode;
  onSelectBooster: (mode: ActiveBoosterMode) => void;
  onTriggerShuffle: () => void;
  className?: string;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  coins,
  activeBooster,
  onSelectBooster,
  onTriggerShuffle,
  className = ''
}) => {
  const HAMMER_COST = 50;
  const SHUFFLE_COST = 35;
  const BOMB_COST = 80;

  const canAffordHammer = coins >= HAMMER_COST;
  const canAffordShuffle = coins >= SHUFFLE_COST;
  const canAffordBomb = coins >= BOMB_COST;

  return (
    <div
      className={`w-full max-w-[420px] mx-auto flex items-center justify-between px-3 py-1.5 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xs select-none ${className}`}
    >
      {/* Active Booster Prompt */}
      {activeBooster !== 'NONE' ? (
        <div className="w-full flex items-center justify-between px-2 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="text-sm animate-bounce">
              {activeBooster === 'HAMMER' ? '🔨' : '💣'}
            </span>
            <span className="text-xs font-black text-amber-300">
              {activeBooster === 'HAMMER'
                ? 'Tap any block to smash!'
                : 'Tap to detonate 3x3 area!'}
            </span>
          </div>
          <button
            onClick={() => onSelectBooster('NONE')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-extrabold text-[11px] shadow-sm cursor-pointer active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      ) : (
        <>
          <span className="text-[10px] font-black uppercase text-[#8BA5F8] tracking-widest pl-1 hidden sm:inline">
            Power-Ups:
          </span>

          <div className="flex items-center space-x-2 sm:space-x-3 mx-auto sm:mx-0">
            {/* 1. Hammer Booster */}
            <button
              onClick={() => onSelectBooster('HAMMER')}
              disabled={!canAffordHammer}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                canAffordHammer
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed'
              }`}
              title="Smash any single block on the board"
            >
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex items-center space-x-0.5 text-[10px] font-black">
                <span>🪙</span>
                <span>{HAMMER_COST}</span>
              </div>
            </button>

            {/* 2. Shuffle Booster */}
            <button
              onClick={onTriggerShuffle}
              disabled={!canAffordShuffle}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                canAffordShuffle
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed'
              }`}
              title="Reroll all 3 pieces in the tray"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex items-center space-x-0.5 text-[10px] font-black">
                <span>🪙</span>
                <span>{SHUFFLE_COST}</span>
              </div>
            </button>

            {/* 3. Bomb Booster */}
            <button
              onClick={() => onSelectBooster('BOMB')}
              disabled={!canAffordBomb}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                canAffordBomb
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed'
              }`}
              title="Blast a 3x3 area on the board"
            >
              <Bomb className="w-3.5 h-3.5 text-rose-400" />
              <div className="flex items-center space-x-0.5 text-[10px] font-black">
                <span>🪙</span>
                <span>{BOMB_COST}</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
