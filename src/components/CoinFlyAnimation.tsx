import React, { useEffect, useState } from 'react';

export interface CoinFlightEvent {
  id: number;
  startX: number;
  startY: number;
  amount: number;
}

interface CoinFlyAnimationProps {
  flight: CoinFlightEvent | null;
  targetX?: number;
  targetY?: number;
  onComplete?: () => void;
}

export const CoinFlyAnimation: React.FC<CoinFlyAnimationProps> = ({
  flight,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; offsetX: number; offsetY: number }>>([]);

  useEffect(() => {
    if (!flight) {
      setParticles([]);
      return;
    }

    const count = Math.min(6, Math.max(2, flight.amount * 2));
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      delay: i * 80,
      offsetX: (Math.random() - 0.5) * 60,
      offsetY: (Math.random() - 0.5) * 40
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1100);

    return () => clearTimeout(timer);
  }, [flight, onComplete]);

  if (!flight || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Pop up badge: e.g. +1 🪙 or +2 🪙 */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-amber-400 text-black font-black text-xs shadow-lg flex items-center space-x-1 animate-[bounce_0.6s_ease-out]"
        style={{
          left: flight.startX,
          top: flight.startY - 30
        }}
      >
        <span>+{flight.amount}</span>
        <span>🪙</span>
      </div>

      {/* Flying golden coins */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-xl select-none"
          style={{
            left: flight.startX + p.offsetX,
            top: flight.startY + p.offsetY,
            animation: `coinFly 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
            animationDelay: `${p.delay}ms`
          }}
        >
          🪙
        </div>
      ))}
    </div>
  );
};
