import React from 'react';

/**
 * Realistic Game Asset Definitions
 * Faithfully handcrafted from the user's uploaded reference sheet:
 * - Collectible Gems / Target Blocks (Blue Diamond, Red Star, Yellow Gem, Green Gem, Purple Gem, Star, Crown, Coin, Rainbow Gem, Heart)
 * - Obstacles (Wooden Box, Stone Block, Ice Block, Metal Block, Locked Block, Pig Obstacle, Stick Obstacle)
 */

interface AssetProps {
  className?: string;
  size?: number | string;
}

// 1. Blue Diamond (Collect)
export const BlueDiamondAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(0,180,216,0.5)] ${className}`}>
    <defs>
      <linearGradient id="bd_body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A0F4FF" />
        <stop offset="40%" stopColor="#00B4D8" />
        <stop offset="100%" stopColor="#005F73" />
      </linearGradient>
      <linearGradient id="bd_top_facet" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0FAFF" />
        <stop offset="100%" stopColor="#90E0EF" />
      </linearGradient>
      <linearGradient id="bd_side_l" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#48CAE4" />
        <stop offset="100%" stopColor="#0077B6" />
      </linearGradient>
      <linearGradient id="bd_side_r" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0096C7" />
        <stop offset="100%" stopColor="#023E8A" />
      </linearGradient>
    </defs>
    {/* Base Rhombus Outline */}
    <polygon points="50,4 96,50 50,96 4,50" fill="url(#bd_body)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Top Triangle Facet */}
    <polygon points="50,14 84,50 50,50" fill="url(#bd_top_facet)" />
    {/* Left Triangle Facet */}
    <polygon points="50,14 16,50 50,50" fill="url(#bd_side_l)" />
    {/* Bottom Right Facet */}
    <polygon points="50,50 84,50 50,86" fill="url(#bd_side_r)" />
    {/* Bottom Left Facet */}
    <polygon points="50,50 16,50 50,86" fill="#005F73" />
    {/* Central Diamond Table Plateau */}
    <polygon points="50,24 76,50 50,76 24,50" fill="#90E0EF" stroke="#E0FAFF" strokeWidth="1.2" opacity="0.95" />
    {/* Specular Diagonal Gleam */}
    <polygon points="50,24 64,38 50,50 36,38" fill="#FFFFFF" opacity="0.85" />
    <circle cx="50" cy="36" r="3.5" fill="#FFFFFF" opacity="0.95" />
  </svg>
);

// 2. Red Star (Collect) - 6-Pointed Ruby Star from reference screenshot & sheet
export const RedStarAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_10px_rgba(230,57,70,0.6)] ${className}`}>
    <defs>
      <linearGradient id="rs_body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF758F" />
        <stop offset="45%" stopColor="#E63946" />
        <stop offset="100%" stopColor="#800F2F" />
      </linearGradient>
      <linearGradient id="rs_highlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFCCD5" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* 6-pointed gem star contour */}
    <polygon
      points="50,4 62,32 92,20 78,48 96,72 66,72 50,96 34,72 4,72 22,48 8,20 38,32"
      fill="url(#rs_body)"
      stroke="#FFD6DE"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Facet lines meeting precisely at center (50, 50) */}
    <polygon points="50,4 62,32 50,50 38,32" fill="#FFA5AB" opacity="0.85" />
    <polygon points="92,20 78,48 50,50 62,32" fill="#E63946" />
    <polygon points="96,72 66,72 50,50 78,48" fill="#A4133C" />
    <polygon points="50,96 34,72 50,50 66,72" fill="#590D22" />
    <polygon points="4,72 22,48 50,50 34,72" fill="#800F2F" />
    <polygon points="8,20 38,32 50,50 22,48" fill="#FF4D6D" opacity="0.9" />
    {/* Specular Ruby Shimmer */}
    <circle cx="44" cy="38" r="5" fill="url(#rs_highlight)" />
    <polygon points="50,28 55,44 50,50 45,44" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// 3. Yellow Gem (Collect) - Pentagon Golden Jewel from reference screenshot & sheet
export const YellowGemAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.6)] ${className}`}>
    <defs>
      <linearGradient id="yg_body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="yg_table" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    {/* Pentagon Gem Base */}
    <polygon points="50,5 95,38 78,94 22,94 5,38" fill="url(#yg_body)" stroke="#FEF3C7" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Bevel facets */}
    <polygon points="50,5 95,38 72,46 50,26" fill="#FDE047" opacity="0.9" />
    <polygon points="95,38 78,94 64,74 72,46" fill="#D97706" />
    <polygon points="78,94 22,94 36,74 64,74" fill="#92400E" />
    <polygon points="22,94 5,38 28,46 36,74" fill="#B45309" />
    <polygon points="5,38 50,5 50,26 28,46" fill="#FEF08A" />
    {/* Central Table Plateau */}
    <polygon points="50,26 72,46 64,74 36,74 28,46" fill="url(#yg_table)" stroke="#FEF3C7" strokeWidth="1.2" />
    {/* Specular Golden Glint */}
    <polygon points="46,30 62,42 56,54 40,42" fill="#FFFFFF" opacity="0.85" />
    <circle cx="48" cy="38" r="3.5" fill="#FFFFFF" />
  </svg>
);

// 4. Star (Collect) - Golden 5-Point Star
export const StarAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)] ${className}`}>
    <defs>
      <linearGradient id="st_grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF9A6" />
        <stop offset="45%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <polygon
      points="50,5 63,35 96,38 72,61 79,94 50,77 21,94 28,61 4,38 37,35"
      fill="url(#st_grad)"
      stroke="#FEF3C7"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* 3D bevel ridges */}
    <polygon points="50,5 63,35 50,52 37,35" fill="#FEF08A" opacity="0.8" />
    <polygon points="96,38 72,61 50,52 63,35" fill="#F59E0B" />
    <polygon points="79,94 50,77 50,52 72,61" fill="#B45309" />
    <polygon points="21,94 28,61 50,52 50,77" fill="#B45309" />
    <polygon points="4,38 37,35 50,52 28,61" fill="#FDE047" opacity="0.9" />
    <circle cx="47" cy="32" r="3" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

// 5. Green Gem (Collect) - Emerald Hexagon
export const GreenGemAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.5)] ${className}`}>
    <polygon points="32,6 68,6 94,32 94,68 68,94 32,94 6,68 6,32" fill="#10B981" stroke="#D1FAE5" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="38,18 62,18 82,38 82,62 62,82 38,82 18,62 18,38" fill="#34D399" />
    <polygon points="42,26 58,26 74,42 74,58 58,74 42,74 26,58 26,42" fill="#6EE7B7" />
    <polygon points="38,18 62,18 58,26 42,26" fill="#FFFFFF" opacity="0.85" />
    <circle cx="44" cy="34" r="3.5" fill="#FFFFFF" />
  </svg>
);

// 6. Purple Gem (Collect) - Amethyst Octagon
export const PurpleGemAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(139,92,246,0.5)] ${className}`}>
    <polygon points="50,5 90,22 90,78 50,95 10,78 10,22" fill="#7C3AED" stroke="#EDE9FE" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="50,18 78,32 78,68 50,82 22,68 22,32" fill="#8B5CF6" />
    <polygon points="50,28 70,38 70,62 50,72 30,62 30,38" fill="#A78BFA" />
    <polygon points="50,18 78,32 70,38 50,28" fill="#FFFFFF" opacity="0.8" />
    <circle cx="46" cy="34" r="3" fill="#FFFFFF" />
  </svg>
);

// 7. Crown (Collect) - Royal Gold Crown
export const CrownAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)] ${className}`}>
    <path d="M10 76 L90 76 L84 30 L65 52 L50 18 L35 52 L16 30 Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="2.5" strokeLinejoin="round" />
    <rect x="12" y="74" width="76" height="12" rx="4" fill="#D97706" stroke="#FEF3C7" strokeWidth="1.5" />
    {/* Gem Ornaments */}
    <circle cx="50" cy="16" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="16" cy="28" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="84" cy="28" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="34" cy="80" r="3" fill="#EF4444" />
    <circle cx="50" cy="80" r="3" fill="#10B981" />
    <circle cx="66" cy="80" r="3" fill="#3B82F6" />
  </svg>
);

// 8. Coin (Collect) - Golden Crown Medallion
export const CoinAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)] ${className}`}>
    <circle cx="50" cy="50" r="44" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="3" />
    <circle cx="50" cy="50" r="36" fill="#FBBF24" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M32 62 L68 62 L64 44 L55 52 L50 38 L45 52 L36 44 Z" fill="#D97706" />
    <circle cx="50" cy="35" r="2.5" fill="#D97706" />
  </svg>
);

// 9. Rainbow Gem (Collect)
export const RainbowGemAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(244,63,94,0.5)] ${className}`}>
    <polygon points="50,4 96,50 50,96 4,50" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2.5" />
    <polygon points="50,14 84,50 50,50" fill="#3B82F6" />
    <polygon points="50,14 16,50 50,50" fill="#10B981" />
    <polygon points="50,50 84,50 50,86" fill="#F59E0B" />
    <polygon points="50,50 16,50 50,86" fill="#8B5CF6" />
    <polygon points="50,26 74,50 50,74 26,50" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1" />
    <polygon points="50,26 62,38 50,50 38,38" fill="#FFFFFF" opacity="0.85" />
  </svg>
);

// 10. Heart (Collect) - 3D Ruby Heart
export const HeartAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(244,63,94,0.6)] ${className}`}>
    <path
      d="M50 88 C24 70 8 50 8 32 C8 18 20 8 34 8 C42 8 50 14 50 14 C50 14 58 8 66 8 C80 8 92 18 92 32 C92 50 76 70 50 88 Z"
      fill="#F43F5E"
      stroke="#FFE4E6"
      strokeWidth="2.5"
    />
    <path d="M50 76 C30 62 18 46 18 34 C18 24 28 18 36 18 C42 18 48 24 50 24 C52 24 58 18 64 18 C72 18 82 24 82 34 C82 46 70 62 50 76 Z" fill="#FB7185" />
    <ellipse cx="32" cy="25" rx="5.5" ry="3.5" fill="#FFFFFF" opacity="0.85" transform="rotate(-25 32 25)" />
  </svg>
);

// 11. Pig Obstacle - Cute Pink Pig
export const PigAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_8px_rgba(236,72,153,0.5)] ${className}`}>
    {/* Ears */}
    <polygon points="18,16 36,34 10,36" fill="#F472B6" stroke="#BE185D" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="82,16 90,36 64,34" fill="#F472B6" stroke="#BE185D" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="20,20 32,32 14,33" fill="#FCE7F3" />
    <polygon points="80,20 86,33 68,32" fill="#FCE7F3" />
    {/* Head */}
    <circle cx="50" cy="54" r="38" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
    {/* Cheeks */}
    <circle cx="25" cy="58" r="6.5" fill="#FB7185" opacity="0.7" />
    <circle cx="75" cy="58" r="6.5" fill="#FB7185" opacity="0.7" />
    {/* Big expressive eyes */}
    <ellipse cx="36" cy="46" rx="4.5" ry="6" fill="#1E293B" />
    <ellipse cx="64" cy="46" rx="4.5" ry="6" fill="#1E293B" />
    <circle cx="37.5" cy="44" r="1.5" fill="#FFFFFF" />
    <circle cx="65.5" cy="44" r="1.5" fill="#FFFFFF" />
    {/* Snout */}
    <ellipse cx="50" cy="62" rx="18" ry="13" fill="#FDF2F8" stroke="#BE185D" strokeWidth="2" />
    <ellipse cx="44" cy="62" rx="3.5" ry="5" fill="#BE185D" />
    <ellipse cx="56" cy="62" rx="3.5" ry="5" fill="#BE185D" />
  </svg>
);

// 12. Stick Obstacle - Wooden Stick / Twig
export const StickAsset: React.FC<AssetProps> = ({ className = '', size = '100%' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className={`filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] ${className}`}>
    <g transform="rotate(-30 50 50)">
      <rect x="38" y="8" width="24" height="84" rx="10" fill="#78350F" stroke="#FDE68A" strokeWidth="2" />
      <rect x="42" y="12" width="6" height="76" rx="3" fill="#92400E" />
      <ellipse cx="50" cy="34" rx="5" ry="4" fill="#451A03" />
      <ellipse cx="50" cy="66" rx="6" ry="4" fill="#451A03" />
      <path d="M58 45 Q70 42 76 34" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="78" cy="32" rx="4.5" ry="2.5" fill="#22C55E" transform="rotate(-25 78 32)" />
    </g>
  </svg>
);

// 13. Realistic 3D Wooden Target Crate (matching Block Juggle reference)
export const WoodenCrateAsset: React.FC<AssetProps & { children?: React.ReactNode }> = ({
  className = '',
  size = '100%',
  children
}) => (
  <div
    style={{ width: size, height: size }}
    className={`relative rounded-lg overflow-hidden select-none box-border flex items-center justify-center ${className}`}
  >
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="crate_outer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFAD7A" />
          <stop offset="50%" stopColor="#C48852" />
          <stop offset="100%" stopColor="#8C5325" />
        </linearGradient>
        <linearGradient id="crate_bevel_top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F7D8B5" />
          <stop offset="100%" stopColor="#D59A64" />
        </linearGradient>
        <linearGradient id="crate_bevel_bottom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78421A" />
          <stop offset="100%" stopColor="#552B0E" />
        </linearGradient>
        <radialGradient id="crate_inner_recess" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6E3D19" />
          <stop offset="85%" stopColor="#4A250B" />
          <stop offset="100%" stopColor="#301505" />
        </radialGradient>
      </defs>

      {/* Main Outer Wood Box */}
      <rect x="2" y="2" width="96" height="96" rx="8" fill="url(#crate_outer)" stroke="#4A250B" strokeWidth="2.5" />

      {/* 3D Top Bevel Frame */}
      <polygon points="2,2 98,2 84,16 16,16" fill="url(#crate_bevel_top)" />
      {/* 3D Left Bevel Frame */}
      <polygon points="2,2 16,16 16,84 2,98" fill="#D59A64" />
      {/* 3D Right Bevel Frame */}
      <polygon points="98,2 98,98 84,84 84,16" fill="#8C5325" />
      {/* 3D Bottom Bevel Frame */}
      <polygon points="2,98 16,84 84,84 98,98" fill="url(#crate_bevel_bottom)" />

      {/* Sunken Inner Plateau with Deep Depth Shadow */}
      <rect x="16" y="16" width="68" height="68" rx="4" fill="url(#crate_inner_recess)" stroke="#301505" strokeWidth="1.5" />

      {/* Wood plank grooves */}
      <line x1="16" y1="50" x2="84" y2="50" stroke="#301505" strokeWidth="1" opacity="0.6" />

      {/* Brass Corner Rivets for tactile realism */}
      <circle cx="8" cy="8" r="2.5" fill="#FFE082" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="92" cy="8" r="2.5" fill="#FFE082" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="8" cy="92" r="2.5" fill="#FFE082" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="92" cy="92" r="2.5" fill="#FFE082" stroke="#B45309" strokeWidth="0.8" />
    </svg>

    {/* Content / Jewel resting inside crate */}
    <div className="relative z-10 w-[72%] h-[72%] flex items-center justify-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      {children}
    </div>
  </div>
);

