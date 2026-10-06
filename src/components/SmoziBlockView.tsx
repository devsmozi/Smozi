import React from 'react';
import { BLOCK_COLORS, BlockColorType } from '../models/BlockColor.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';
import { BoardTarget } from '../models/TargetModels.ts';
import { TargetIconView } from './TargetIconView.tsx';

interface SmoziBlockViewProps {
  color: BlockColorType;
  specialType?: SpecialBlockType;
  durability?: number;
  isOccupied?: boolean;
  isClearing?: boolean;
  isPreview?: boolean;
  isDenied?: boolean;
  emptyColor?: string;
  gridLineColor?: string;
  className?: string;
  size?: number | string;
  target?: BoardTarget | null;
}

export const SmoziBlockView: React.FC<SmoziBlockViewProps> = ({
  color,
  specialType = SpecialBlockType.NONE,
  isOccupied,
  isClearing = false,
  isPreview = false,
  isDenied = false,
  emptyColor = '#141D33',
  gridLineColor = '#1A2645',
  className = '',
  size = '100%',
  target = null
}) => {
  // If cell holds an uncollected target and is not occupied by a placed block:
  const hasActiveTarget = target && !target.collected;

  if (hasActiveTarget && (!isOccupied || isPreview)) {
    const previewColorDef = isPreview
      ? (isDenied ? BLOCK_COLORS[BlockColorType.RED] : BLOCK_COLORS[color] || BLOCK_COLORS[BlockColorType.BLUE])
      : null;

    return (
      <div
        className={`relative box-border rounded-md select-none transition-transform duration-150 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: '#C9945B',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 0 4px rgba(0,0,0,0.3)'
        }}
      >
        {/* 3D Wooden Bevel Borders */}
        {/* Top Wood Bevel */}
        <div
          className="absolute top-0 left-0 right-0 h-[18%] pointer-events-none rounded-t-md"
          style={{
            background: 'linear-gradient(to bottom, #ECD0A8, #D8A66E)',
            clipPath: 'polygon(0% 0%, 100% 0%, 82% 100%, 18% 100%)'
          }}
        />
        {/* Left Wood Bevel */}
        <div
          className="absolute top-0 left-0 bottom-0 w-[18%] pointer-events-none rounded-l-md"
          style={{
            background: 'linear-gradient(to right, #ECD0A8, #C9945B)',
            clipPath: 'polygon(0% 0%, 100% 18%, 100% 82%, 0% 100%)'
          }}
        />
        {/* Right Wood Bevel */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[18%] pointer-events-none rounded-r-md"
          style={{
            background: 'linear-gradient(to left, #8E5B28, #C9945B)',
            clipPath: 'polygon(100% 0%, 100% 100%, 0% 82%, 0% 18%)'
          }}
        />
        {/* Bottom Wood Bevel */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[18%] pointer-events-none rounded-b-md"
          style={{
            background: 'linear-gradient(to top, #7A491D, #C9945B)',
            clipPath: 'polygon(0% 100%, 18% 0%, 82% 0%, 100% 100%)'
          }}
        />

        {/* Sunken Wooden Plateau with warm wood tone */}
        <div
          className="absolute inset-[18%] rounded-[3px] pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: '#B57C40',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)'
          }}
        >
          {/* Target Icon */}
          <TargetIconView
            targetType={target.type}
            visualAsset={target.visualAsset}
            className="w-full h-full"
          />
        </div>

        {/* Dark outer frame */}
        <div className="absolute inset-0 rounded-md border border-black/35 pointer-events-none" />

        {/* Drag Preview Ghost overlay if dragging piece over target cell */}
        {isPreview && previewColorDef && (
          <div
            className={`absolute inset-0 rounded-md border-2 z-10 flex items-center justify-center pointer-events-none ${
              isDenied
                ? 'bg-red-600/50 border-red-500'
                : 'bg-emerald-400/40 border-emerald-300'
            }`}
          >
            {!isDenied && (
              <span className="text-white text-xs font-black animate-ping">✦</span>
            )}
          </div>
        )}
      </div>
    );
  }

  const isNone =
    (isOccupied !== undefined && !isOccupied && specialType === SpecialBlockType.NONE) ||
    (color === BlockColorType.NONE && specialType === SpecialBlockType.NONE);

  if (isNone) {
    return (
      <div
        className={`relative w-full h-full box-border rounded-xs ${className}`}
        style={{
          backgroundColor: emptyColor,
          border: `1px solid ${gridLineColor}`,
          width: size,
          height: size
        }}
      >
        {/* Subtle inset shadow to give depressed cell depth */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-xs" />
      </div>
    );
  }

  const effectiveColorType = isDenied ? BlockColorType.RED : color;
  const colorDef = BLOCK_COLORS[effectiveColorType] || BLOCK_COLORS[BlockColorType.BLUE];

  return (
    <div
      className={`relative box-border rounded-md transition-transform duration-150 select-none ${
        isClearing ? 'animate-block-clear z-20' : ''
      } ${isPreview ? (isDenied ? 'opacity-80' : 'opacity-70') : ''} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: colorDef.primaryColor,
        boxShadow: isDenied
          ? '0 0 12px rgba(255, 45, 85, 0.8), inset 0 0 4px rgba(255, 255, 255, 0.6)'
          : `0 2px 4px rgba(0,0,0,0.4), 0 0 8px ${colorDef.glowColor}`
      }}
    >
      {/* 3D Bevel Facets: Top Highlight, Left Light, Right Dark, Bottom Shadow */}
      {/* Top Bevel */}
      <div
        className="absolute top-0 left-0 right-0 h-[18%] pointer-events-none rounded-t-md"
        style={{
          background: `linear-gradient(to bottom, ${colorDef.lightBevelColor}, ${colorDef.primaryColor})`,
          clipPath: 'polygon(0% 0%, 100% 0%, 82% 100%, 18% 100%)'
        }}
      />
      {/* Left Bevel */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[18%] pointer-events-none rounded-l-md"
        style={{
          background: `linear-gradient(to right, ${colorDef.lightBevelColor}, ${colorDef.primaryColor})`,
          clipPath: 'polygon(0% 0%, 100% 18%, 100% 82%, 0% 100%)'
        }}
      />
      {/* Right Bevel */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[18%] pointer-events-none rounded-r-md"
        style={{
          background: `linear-gradient(to left, ${colorDef.darkBevelColor}, ${colorDef.primaryColor})`,
          clipPath: 'polygon(100% 0%, 100% 100%, 0% 82%, 0% 18%)'
        }}
      />
      {/* Bottom Bevel */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[18%] pointer-events-none rounded-b-md"
        style={{
          background: `linear-gradient(to top, ${colorDef.darkBevelColor}, ${colorDef.primaryColor})`,
          clipPath: 'polygon(0% 100%, 18% 0%, 82% 0%, 100% 100%)'
        }}
      />

      {/* Central Plateau */}
      <div
        className="absolute inset-[18%] rounded-[3px] pointer-events-none overflow-hidden"
        style={{
          backgroundColor: colorDef.primaryColor
        }}
      >
        {/* Specular curved reflection gleam */}
        <div
          className="absolute top-0 left-0 right-0 h-[50%]"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)'
          }}
        />
      </div>

      {/* Outer subtle dark border */}
      <div className="absolute inset-0 rounded-md border border-black/25 pointer-events-none" />

      {/* Special Overlays */}
      {specialType === SpecialBlockType.BOMB && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[68%] h-[68%] rounded-full bg-radial from-slate-600 via-slate-900 to-black shadow-lg flex items-center justify-center relative">
            <span className="text-yellow-400 text-xs font-black">★</span>
            <div className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          </div>
        </div>
      )}

      {specialType === SpecialBlockType.ROCKET_ROW && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[75%] h-[40%] bg-white rounded-r-full relative flex items-center shadow-md border border-red-500">
            <div className="w-[35%] h-full bg-red-600 rounded-r-full" />
            <span className="absolute text-[8px] font-black text-black right-1">➔</span>
          </div>
        </div>
      )}

      {specialType === SpecialBlockType.ROCKET_COL && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[75%] w-[40%] bg-white rounded-t-full relative flex flex-col items-center shadow-md border border-red-500">
            <div className="h-[35%] w-full bg-red-600 rounded-t-full" />
            <span className="absolute text-[8px] font-black text-black top-0.5">▲</span>
          </div>
        </div>
      )}

      {(specialType === SpecialBlockType.RAINBOW || specialType === SpecialBlockType.COLOR_BALL) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[70%] h-[70%] rounded-full animate-spin shadow-lg border border-white"
            style={{
              background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)',
              animationDuration: '4s'
            }}
          />
        </div>
      )}

      {specialType === SpecialBlockType.GEM_BLUE && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base drop-shadow-md">💎</span>
        </div>
      )}

      {specialType === SpecialBlockType.GEM_RED && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base drop-shadow-md">♦</span>
        </div>
      )}

      {specialType === SpecialBlockType.GEM_GREEN && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base drop-shadow-md">🟢</span>
        </div>
      )}

      {specialType === SpecialBlockType.ICE && (
        <div className="absolute inset-0 bg-cyan-200/40 border border-cyan-100 flex items-center justify-center rounded-md pointer-events-none">
          <span className="text-xs">❄️</span>
        </div>
      )}

      {specialType === SpecialBlockType.STONE && (
        <div className="absolute inset-0 bg-stone-700/60 border border-stone-400 flex items-center justify-center rounded-md pointer-events-none">
          <span className="text-xs text-stone-200 font-bold">▦</span>
        </div>
      )}

      {specialType === SpecialBlockType.WOOD && (
        <div className="absolute inset-0 bg-amber-900/60 border border-amber-500 flex items-center justify-center rounded-md pointer-events-none">
          <span className="text-xs text-amber-200 font-bold">📦</span>
        </div>
      )}

      {/* Denied Warning State (Colliding with filled blocks) */}
      {isDenied && (
        <div className="absolute inset-0 rounded-md border-2 border-red-500 bg-red-600/30 flex items-center justify-center pointer-events-none">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      )}
    </div>
  );
};
