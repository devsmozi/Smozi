import React from 'react';

interface UserProfileFrameProps {
  size?: number; // width & height in px
  avatarUrl?: string;
  avatarIcon?: string;
  avatarBgColor?: string;
  className?: string;
  onClick?: () => void;
}

export const UserProfileFrame: React.FC<UserProfileFrameProps> = ({
  size = 64,
  avatarUrl,
  avatarIcon = '👑',
  avatarBgColor = 'bg-gradient-to-tr from-[#1B2B54] via-[#2A3E75] to-[#4062B8]',
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{
        width: size,
        height: size
      }}
    >
      {/* 1. Center Avatar Circle inside the Golden Ring */}
      <div
        className={`absolute rounded-full flex items-center justify-center overflow-hidden shadow-inner ${avatarBgColor}`}
        style={{
          width: '50%',
          height: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="font-black drop-shadow-md select-none"
            style={{
              fontSize: size * 0.26,
              lineHeight: 1
            }}
          >
            {avatarIcon}
          </span>
        )}
      </div>

      {/* 2. Top-Level Golden Winged 5-Star Crest Overlay */}
      <img
        src="/Profile.svg"
        alt="Profile Frame"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
        style={{ zIndex: 2 }}
        draggable={false}
      />
    </div>
  );
};
