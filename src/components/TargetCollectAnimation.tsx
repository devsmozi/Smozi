import React, { useEffect, useState } from 'react';
import { TargetIconView } from './TargetIconView.tsx';

export interface TargetCollectionEvent {
  id: number;
  startX: number;
  startY: number;
  targetType: string;
}

interface TargetCollectAnimationProps {
  events: TargetCollectionEvent[];
  onComplete?: (id: number) => void;
}

export const TargetCollectAnimation: React.FC<TargetCollectAnimationProps> = ({
  events,
  onComplete
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {events.map((ev) => (
        <TargetFloatingItem key={ev.id} event={ev} onComplete={onComplete} />
      ))}
    </div>
  );
};

const TargetFloatingItem: React.FC<{
  event: TargetCollectionEvent;
  onComplete?: (id: number) => void;
}> = ({ event, onComplete }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      if (onComplete) onComplete(event.id);
    }, 750);
    return () => clearTimeout(timer);
  }, [event.id, onComplete]);

  if (!active) return null;

  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none select-none transition-all duration-700 ease-out"
      style={{
        left: event.startX,
        top: event.startY,
        transform: 'translate(-50%, -50%)',
        animation: 'targetFlyUp 0.75s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards'
      }}
    >
      {/* Floating Gem with halo glow */}
      <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">
        <TargetIconView targetType={event.targetType} size={42} />
        <span className="absolute -top-1 -right-1 text-sm text-yellow-300 animate-ping">✨</span>
      </div>

      {/* Target Collected badge */}
      <div className="mt-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center space-x-1">
        <span>+1</span>
        <span>COLLECTED</span>
      </div>
    </div>
  );
};
