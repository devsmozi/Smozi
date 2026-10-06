import React, { useState } from 'react';
import { TargetType } from '../models/TargetModels.ts';

interface TargetIconViewProps {
  targetType: TargetType | string;
  visualAsset?: string;
  className?: string;
  size?: number | string;
}

export const TargetIconView: React.FC<TargetIconViewProps> = ({
  targetType,
  visualAsset,
  className = '',
  size = '100%'
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // If a custom image asset path is provided and hasn't failed to load, render it directly
  if (visualAsset && !imgFailed) {
    return (
      <img
        src={visualAsset}
        alt={targetType}
        onError={() => setImgFailed(true)}
        className={`object-contain pointer-events-none drop-shadow-md select-none ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const normalized = targetType.toLowerCase().replace('-', '_');

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. BLUE DIAMOND */}
      {(normalized === 'diamond' || normalized === 'blue_diamond') && (
        <svg viewBox="0 0 100 100" className="w-[82%] h-[82%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <defs>
            <linearGradient id="dia_top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#80EDFF" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
            <linearGradient id="dia_left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48CAE4" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>
            <linearGradient id="dia_right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0096C7" />
              <stop offset="100%" stopColor="#03045E" />
            </linearGradient>
          </defs>
          <polygon points="50,6 94,50 50,94 6,50" fill="#0077B6" stroke="#CFFBFF" strokeWidth="2.5" />
          <polygon points="50,14 86,50 50,50" fill="url(#dia_top)" />
          <polygon points="50,14 14,50 50,50" fill="url(#dia_left)" />
          <polygon points="50,50 86,50 50,86" fill="url(#dia_right)" />
          <polygon points="50,50 14,50 50,86" fill="#0077B6" />
          {/* Central diamond table */}
          <polygon points="50,26 74,50 50,74 26,50" fill="#90E0EF" opacity="0.95" />
          {/* Specular gleam */}
          <polygon points="50,26 62,38 50,50 38,38" fill="#FFFFFF" opacity="0.85" />
        </svg>
      )}

      {/* 2. RED STAR (Ruby Star - Reference screenshot jewel) */}
      {(normalized === 'red_star') && (
        <svg viewBox="0 0 100 100" className="w-[86%] h-[86%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="rstar_glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="40%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#7F0916" />
            </linearGradient>
            <linearGradient id="rstar_spec" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF8B8B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* 6-point gem star outline */}
          <polygon
            points="50,4 62,32 92,20 78,48 96,72 66,72 50,96 34,72 4,72 22,48 8,20 38,32"
            fill="url(#rstar_glow)"
            stroke="#FFA8A8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Facet lines meeting at center */}
          <polygon points="50,4 62,32 50,50 38,32" fill="#FF8585" opacity="0.8" />
          <polygon points="92,20 78,48 50,50 62,32" fill="#E63946" />
          <polygon points="96,72 66,72 50,50 78,48" fill="#A81827" />
          <polygon points="50,96 34,72 50,50 66,72" fill="#750E1A" />
          <polygon points="4,72 22,48 50,50 34,72" fill="#911421" />
          <polygon points="8,20 38,32 50,50 22,48" fill="#FF5E6D" opacity="0.9" />
          {/* Specular Gleam */}
          <circle cx="43" cy="38" r="6" fill="url(#rstar_spec)" />
          <polygon points="50,30 54,45 50,50 46,45" fill="#FFFFFF" opacity="0.75" />
        </svg>
      )}

      {/* 3. YELLOW GEM (Pentagon Gold Jewel - Reference screenshot jewel) */}
      {(normalized === 'yellow_gem' || normalized === 'gem') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="ygem_body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="ygem_table" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          {/* Outer pentagon */}
          <polygon
            points="50,6 94,38 76,92 24,92 6,38"
            fill="url(#ygem_body)"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Side facets */}
          <polygon points="50,6 94,38 72,46 50,26" fill="#FDE047" opacity="0.9" />
          <polygon points="94,38 76,92 64,74 72,46" fill="#D97706" />
          <polygon points="76,92 24,92 36,74 64,74" fill="#92400E" />
          <polygon points="24,92 6,38 28,46 36,74" fill="#B45309" />
          <polygon points="6,38 50,6 50,26 28,46" fill="#FEF08A" />
          {/* Central table facet */}
          <polygon points="50,26 72,46 64,74 36,74 28,46" fill="url(#ygem_table)" stroke="#FEF3C7" strokeWidth="1" />
          {/* Specular gleam */}
          <polygon points="46,32 60,42 56,54 42,44" fill="#FFFFFF" opacity="0.8" />
        </svg>
      )}

      {/* 4. GOLDEN STAR */}
      {(normalized === 'star') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <defs>
            <linearGradient id="star_fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF066" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <polygon
            points="50,6 63,35 95,38 71,60 78,92 50,75 22,92 29,60 5,38 37,35"
            fill="url(#star_fill)"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 3D facet lines */}
          <polygon points="50,6 63,35 50,52 37,35" fill="#FEF08A" opacity="0.75" />
          <polygon points="95,38 71,60 50,52 63,35" fill="#F59E0B" />
          <polygon points="78,92 50,75 50,52 71,60" fill="#B45309" />
          <polygon points="22,92 29,60 50,52 50,75" fill="#B45309" />
          <polygon points="5,38 37,35 50,52 29,60" fill="#FDE047" opacity="0.9" />
          <polygon points="48,16 54,34 50,40 44,32" fill="#FFFFFF" opacity="0.8" />
        </svg>
      )}

      {/* 5. GREEN GEM (Emerald) */}
      {(normalized === 'green_gem') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <polygon
            points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32"
            fill="#10B981"
            stroke="#A7F3D0"
            strokeWidth="2.5"
          />
          <polygon points="38,20 62,20 80,38 80,62 62,80 38,80 20,62 20,38" fill="#34D399" />
          <polygon points="42,28 58,28 72,42 72,58 58,72 42,72 28,58 28,42" fill="#6EE7B7" />
          <polygon points="38,20 62,20 58,28 42,28" fill="#FFFFFF" opacity="0.8" />
        </svg>
      )}

      {/* 6. PURPLE GEM (Amethyst) */}
      {(normalized === 'purple_gem') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <polygon
            points="50,6 88,24 88,76 50,94 12,76 12,24"
            fill="#8B5CF6"
            stroke="#DDD6FE"
            strokeWidth="2.5"
          />
          <polygon points="50,20 76,34 76,66 50,80 24,66 24,34" fill="#A78BFA" />
          <polygon points="50,30 68,40 68,60 50,70 32,60 32,40" fill="#C4B5FD" />
          <polygon points="50,20 76,34 68,40 50,30" fill="#FFFFFF" opacity="0.75" />
        </svg>
      )}

      {/* 7. CROWN */}
      {(normalized === 'crown') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <path
            d="M12 76 L88 76 L82 32 L64 54 L50 20 L36 54 L18 32 Z"
            fill="#F59E0B"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="14" y="74" width="72" height="12" rx="4" fill="#D97706" stroke="#FEF3C7" strokeWidth="1.5" />
          <circle cx="50" cy="18" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="18" cy="30" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="82" cy="30" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="36" cy="80" r="3" fill="#EF4444" />
          <circle cx="50" cy="80" r="3" fill="#10B981" />
          <circle cx="64" cy="80" r="3" fill="#3B82F6" />
        </svg>
      )}

      {/* 8. COIN */}
      {(normalized === 'coin') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <circle cx="50" cy="50" r="44" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="50" cy="50" r="36" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M30 62 L70 62 L66 42 L56 50 L50 36 L44 50 L34 42 Z" fill="#D97706" />
        </svg>
      )}

      {/* 9. PIG OBSTACLE */}
      {(normalized === 'pig') && (
        <svg viewBox="0 0 100 100" className="w-[86%] h-[86%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
          {/* Ears */}
          <polygon points="20,18 36,36 12,38" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <polygon points="80,18 88,38 64,36" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <polygon points="22,22 32,34 16,35" fill="#FBCFE8" />
          <polygon points="78,22 84,35 68,34" fill="#FBCFE8" />
          {/* Face */}
          <circle cx="50" cy="54" r="38" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
          {/* Cheeks */}
          <circle cx="26" cy="58" r="6" fill="#FB7185" opacity="0.6" />
          <circle cx="74" cy="58" r="6" fill="#FB7185" opacity="0.6" />
          {/* Eyes */}
          <ellipse cx="36" cy="46" rx="4.5" ry="6" fill="#1E293B" />
          <ellipse cx="64" cy="46" rx="4.5" ry="6" fill="#1E293B" />
          <circle cx="37.5" cy="44" r="1.5" fill="#FFFFFF" />
          <circle cx="65.5" cy="44" r="1.5" fill="#FFFFFF" />
          {/* Snout */}
          <ellipse cx="50" cy="62" rx="18" ry="13" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2" />
          <ellipse cx="44" cy="62" rx="3.5" ry="5" fill="#BE185D" />
          <ellipse cx="56" cy="62" rx="3.5" ry="5" fill="#BE185D" />
        </svg>
      )}

      {/* 10. STICK OBSTACLE */}
      {(normalized === 'stick') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <g transform="rotate(-30 50 50)">
            {/* Main stick log */}
            <rect x="40" y="10" width="20" height="80" rx="8" fill="#854D0E" stroke="#FEF08A" strokeWidth="2" />
            <rect x="44" y="14" width="6" height="72" rx="3" fill="#A16207" />
            {/* Bark knots & notches */}
            <ellipse cx="50" cy="35" rx="5" ry="4" fill="#713F12" />
            <circle cx="50" cy="35" r="2" fill="#CA8A04" />
            <ellipse cx="50" cy="65" rx="6" ry="4" fill="#713F12" />
            {/* Small branch */}
            <path d="M58 45 Q70 42 75 36" stroke="#854D0E" strokeWidth="6" strokeLinecap="round" />
            {/* Green leaf bud */}
            <ellipse cx="76" cy="34" rx="4" ry="2" fill="#22C55E" transform="rotate(-30 76 34)" />
          </g>
        </svg>
      )}

      {/* 11. HEART GEM */}
      {(normalized === 'heart') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <path
            d="M50 86 C25 68 10 50 10 32 C10 18 22 8 36 8 C43 8 50 14 50 14 C50 14 57 8 64 8 C78 8 90 18 90 32 C90 50 75 68 50 86 Z"
            fill="#F43F5E"
            stroke="#FFE4E6"
            strokeWidth="2.5"
          />
          <path d="M50 74 C32 60 22 46 22 34 C22 24 30 18 38 18 C44 18 50 24 50 24 C50 24 56 18 62 18 C70 18 78 24 78 34 C78 46 68 60 50 74 Z" fill="#FB7185" />
          <ellipse cx="34" cy="26" rx="5" ry="3" fill="#FFFFFF" opacity="0.8" transform="rotate(-25 34 26)" />
        </svg>
      )}

      {/* 12. RAINBOW GEM */}
      {(normalized === 'rainbow_gem' || normalized === 'rainbow') && (
        <svg viewBox="0 0 100 100" className="w-[84%] h-[84%] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]">
          <polygon points="50,6 94,50 50,94 6,50" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2.5" />
          <polygon points="50,14 86,50 50,50" fill="#3B82F6" />
          <polygon points="50,14 14,50 50,50" fill="#10B981" />
          <polygon points="50,50 86,50 50,86" fill="#F59E0B" />
          <polygon points="50,50 14,50 50,86" fill="#8B5CF6" />
          <polygon points="50,28 72,50 50,72 28,50" fill="#F43F5E" />
          <polygon points="50,28 60,38 50,48 40,38" fill="#FFFFFF" opacity="0.85" />
        </svg>
      )}
    </div>
  );
};
