import React from 'react';

export type SmoziButtonStyleType = 'GREEN' | 'YELLOW_ORANGE' | 'PURPLE' | 'BLUE' | 'RED';

interface SmoziButtonProps {
  text: string;
  onClick: () => void;
  style?: SmoziButtonStyleType;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  testTag?: string;
}

const BUTTON_STYLES: Record<
  SmoziButtonStyleType,
  {
    gradient: string;
    border: string;
    shadow: string;
    textShadow: string;
  }
> = {
  GREEN: {
    gradient: 'linear-gradient(180deg, #4CD964 0%, #28CD41 100%)',
    border: '#86E49D',
    shadow: '0 6px 0 #1B8A2B, 0 10px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 2px #1B8A2B'
  },
  YELLOW_ORANGE: {
    gradient: 'linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)',
    border: '#FFE680',
    shadow: '0 6px 0 #B36600, 0 10px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 2px #B36600'
  },
  PURPLE: {
    gradient: 'linear-gradient(180deg, #AF52DE 0%, #8944AB 100%)',
    border: '#D396F1',
    shadow: '0 6px 0 #5A1E7A, 0 10px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 2px #5A1E7A'
  },
  BLUE: {
    gradient: 'linear-gradient(180deg, #007AFF 0%, #0051B3 100%)',
    border: '#68B1FF',
    shadow: '0 6px 0 #003380, 0 10px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 2px #003380'
  },
  RED: {
    gradient: 'linear-gradient(180deg, #FF3B30 0%, #D62217 100%)',
    border: '#FF857D',
    shadow: '0 6px 0 #8F120A, 0 10px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 2px #8F120A'
  }
};

export const SmoziButton: React.FC<SmoziButtonProps> = ({
  text,
  onClick,
  style = 'GREEN',
  icon,
  disabled = false,
  className = '',
  testTag = 'smozi_button'
}) => {
  const currentStyle = BUTTON_STYLES[style] || BUTTON_STYLES.GREEN;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testTag}
      className={`relative inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-black text-white text-base tracking-wider transition-all duration-75 cursor-pointer active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
      style={{
        background: currentStyle.gradient,
        border: `2px solid ${currentStyle.border}`,
        boxShadow: currentStyle.shadow,
        textShadow: currentStyle.textShadow
      }}
    >
      {/* Specular curved reflection highlight */}
      <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-center space-x-2">
        {icon && <span>{icon}</span>}
        <span>{text}</span>
      </div>
    </button>
  );
};

export const SmoziIconButton: React.FC<{
  onClick: () => void;
  style?: SmoziButtonStyleType;
  children: React.ReactNode;
  size?: number | string;
  className?: string;
  testTag?: string;
}> = ({
  onClick,
  style = 'BLUE',
  children,
  size = 40,
  className = '',
  testTag = 'smozi_icon_button'
}) => {
  const currentStyle = BUTTON_STYLES[style] || BUTTON_STYLES.BLUE;

  return (
    <button
      onClick={onClick}
      data-testid={testTag}
      className={`relative inline-flex items-center justify-center rounded-2xl text-white transition-all duration-75 cursor-pointer active:translate-y-0.5 select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: currentStyle.gradient,
        border: `2px solid ${currentStyle.border}`,
        boxShadow: '0 3px 0 rgba(0,0,0,0.3), 0 5px 8px rgba(0,0,0,0.3)'
      }}
    >
      <div className="absolute top-0 left-1 right-1 h-1/2 rounded-t-xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-center">{children}</div>
    </button>
  );
};
