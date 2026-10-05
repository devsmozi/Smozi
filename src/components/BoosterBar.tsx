import React from 'react';
import { Shuffle, Bomb, Lightbulb, X } from 'lucide-react';

export type ActiveBoosterMode = 'NONE' | 'BOMB';

interface BoosterBarProps {
  coins: number;
  activeBooster: ActiveBoosterMode;
  onSelectBooster: (mode: ActiveBoosterMode) => void;
  onTriggerShuffle: () => void;
  onTriggerHint: () => void;
  isHintActive?: boolean;
  className?: string;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  coins,
  activeBooster,
  onSelectBooster,
  onTriggerShuffle,
  onTriggerHint,
  isHintActive = false,
  className = ''
}) => {
  const HINT_COST = 15;
  const SHUFFLE_COST = 25;
  const BOMB_COST = 40;

  const canAffordHint = coins >= HINT_COST;
  const canAffordShuffle = coins >= SHUFFLE_COST;
  const canAffordBomb = coins >= BOMB_COST;

  return (
    <div
      className={`w-full max-w-[420px] mx-auto flex items-center justify-between px-3 py-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xs select-none shadow-md ${className}`}
    >
      {/* Active Booster Prompt (Bomb Active) */}
      {activeBooster !== 'NONE' ? (
        <div className="w-full flex items-center justify-between px-2 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="text-base animate-bounce">💣</span>
            <span className="text-xs font-black text-amber-300">
              Tap anywhere to detonate 3x3 blast!
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
          {/* Coin Wallet Indicator */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-xl bg-black/40 border border-amber-400/25">
            <span className="text-xs">🪙</span>
            <span className="text-xs font-black text-amber-300 tracking-wide">
              {coins.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 1. HINT BOOSTER */}
            <button
              onClick={onTriggerHint}
              disabled={!canAffordHint && !isHintActive}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                isHintActive
                  ? 'bg-amber-400/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 scale-105 animate-pulse'
                  : canAffordHint
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/35 cursor-not-allowed'
              }`}
              title="Reveal best placement to clear lines"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isHintActive ? 'text-yellow-300' : 'text-amber-400'}`} />
              <span className="text-[11px] font-black hidden sm:inline">Hint</span>
              <div className="flex items-center space-x-0.5 text-[10px] font-black text-amber-300">
                <span>🪙</span>
                <span>{HINT_COST}</span>
              </div>
            </button>

            {/* 2. SHUFFLE BOOSTER */}
            <button
              onClick={onTriggerShuffle}
              disabled={!canAffordShuffle}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                canAffordShuffle
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/35 cursor-not-allowed'
              }`}
              title="Reroll all 3 pieces with guaranteed fits"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-black hidden sm:inline">Reroll</span>
              <div className="flex items-center space-x-0.5 text-[10px] font-black text-amber-300">
                <span>🪙</span>
                <span>{SHUFFLE_COST}</span>
              </div>
            </button>

            {/* 3. BOMB BOOSTER */}
            <button
              onClick={() => onSelectBooster('BOMB')}
              disabled={!canAffordBomb}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                canAffordBomb
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white active:scale-95'
                  : 'bg-white/5 border-white/5 text-white/35 cursor-not-allowed'
              }`}
              title="Blast a 3x3 area on the board"
            >
              <Bomb className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[11px] font-black hidden sm:inline">Bomb</span>
              <div className="flex items-center space-x-0.5 text-[10px] font-black text-amber-300">
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
