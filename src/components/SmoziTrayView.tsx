import React from 'react';
import { Piece } from '../models/Piece.ts';
import { SmoziPieceView } from './SmoziPieceView.tsx';

interface SmoziTrayViewProps {
  pieces: (Piece | null)[];
  activeDraggingPieceId: string | null;
  onPieceDragStart: (piece: Piece, slotIndex: number, clientX: number, clientY: number) => void;
  className?: string;
}

export const SmoziTrayView: React.FC<SmoziTrayViewProps> = ({
  pieces,
  activeDraggingPieceId,
  onPieceDragStart,
  className = ''
}) => {
  return (
    <div
      className={`w-full max-w-[440px] mx-auto h-32 px-4 flex items-center justify-around select-none ${className}`}
    >
      {[0, 1, 2].map((slotIndex) => {
        const piece = pieces[slotIndex];
        const isBeingDragged = piece !== null && piece.id === activeDraggingPieceId;

        return (
          <div
            key={slotIndex}
            className="flex-1 h-full mx-1 flex items-center justify-center relative"
          >
            {piece ? (
              <div
                className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform ${
                  isBeingDragged ? 'opacity-20 scale-95' : 'hover:scale-105 active:scale-95'
                }`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onPieceDragStart(piece, slotIndex, e.clientX, e.clientY);
                }}
              >
                {/* Twinkle sparkle stars */}
                <div className="absolute top-2 left-2 text-yellow-300 text-xs animate-pulse pointer-events-none">
                  ✦
                </div>
                <div className="absolute top-3 right-3 text-blue-300 text-xs animate-ping pointer-events-none">
                  ✧
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] pointer-events-none">
                  ✦
                </div>

                <div className="animate-pop-in">
                  <SmoziPieceView piece={piece} blockSize={24} />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border border-white/5 bg-white/[0.02]" />
            )}
          </div>
        );
      })}
    </div>
  );
};
