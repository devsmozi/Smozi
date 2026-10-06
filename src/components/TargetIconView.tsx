import React, { useState } from 'react';
import { TargetType } from '../models/TargetModels.ts';
import {
  BlueDiamondAsset,
  RedStarAsset,
  YellowGemAsset,
  StarAsset,
  GreenGemAsset,
  PurpleGemAsset,
  CrownAsset,
  CoinAsset,
  RainbowGemAsset,
  HeartAsset,
  PigAsset,
  StickAsset
} from '../assets/RealisticGameAssets.tsx';

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
      className={`relative flex items-center justify-center pointer-events-none select-none transition-transform ${className}`}
      style={{ width: size, height: size }}
    >
      {(normalized === 'diamond' || normalized === 'blue_diamond') && <BlueDiamondAsset size="88%" />}
      {normalized === 'red_star' && <RedStarAsset size="90%" />}
      {(normalized === 'yellow_gem' || normalized === 'gem') && <YellowGemAsset size="88%" />}
      {normalized === 'star' && <StarAsset size="88%" />}
      {normalized === 'green_gem' && <GreenGemAsset size="88%" />}
      {normalized === 'purple_gem' && <PurpleGemAsset size="88%" />}
      {normalized === 'crown' && <CrownAsset size="88%" />}
      {normalized === 'coin' && <CoinAsset size="88%" />}
      {(normalized === 'rainbow_gem' || normalized === 'rainbow') && <RainbowGemAsset size="88%" />}
      {normalized === 'heart' && <HeartAsset size="88%" />}
      {normalized === 'pig' && <PigAsset size="90%" />}
      {normalized === 'stick' && <StickAsset size="88%" />}
    </div>
  );
};
