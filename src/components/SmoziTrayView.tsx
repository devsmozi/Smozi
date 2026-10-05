import React from 'react';
import { Piece } from '../models/Piece.ts';
import { SmoziPieceView } from './SmoziPieceView.tsx';

interface SmoziTrayViewProps {
  pieces: (Piece | null)[];
  activeDraggingPieceId: string | null;
  selectedSlotIndex?: number | null;
  piecePlayableStatus?: boolean[];
  onPieceDragStart: (piece: Piece, slotIndex: number, clientX: number, clientY: number) => void;
  onPieceClick?: (slotIndex: number) => void;
  className?: string;
}

export const SmoziTrayView: React.FC<SmoziTrayViewProps> = ({
  pieces,
  activeDraggingPieceId,
  selectedSlotIndex = null,
  piecePlayableStatus = [true, true, true],
  onPieceDragStart,
  onPieceClick,
  className = ''
}) => {
  return (
    <div
      className={`w-full max-w-[440px] mx-auto h-[clamp(85px,13.5dvh,120px)] px-2 sm:px-4 flex items-center justify-around select-none shrink-0 ${className}`}
    >
      {[0, 1, 2].map((slotIndex) => {
        const piece = pieces[slotIndex];
        const isBeingDragged = piece !== null && piece.id === activeDraggingPieceId;
        const isSelected = selectedSlotIndex === slotIndex;
        const isPlayable = piecePlayableStatus[slotIndex] ?? true;

        return (
          <div
            key={slotIndex}
            className={`flex-1 h-full mx-1 rounded-2xl flex items-center justify-center relative transition-all duration-300 ${
              isSelected
                ? 'bg-amber-400/20 border-2 border-amber-300 shadow-[0_0_24px_rgba(255,200,0,0.45),inset_0_0_15px_rgba(255,200,0,0.2)] -translate-y-1.5 scale-[1.04]'
                : 'border border-white/8 bg-black/20 hover:border-white/20'
            }`}
          >
            {/* Ambient Pulsing Aura for Selected Slot */}
            {isSelected && (
              <>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/80 animate-pulse pointer-events-none" />
                <span className="absolute -top-1.5 -left-1.5 text-xs text-amber-300 animate-ping pointer-events-none">✦</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-xs text-yellow-300 animate-pulse pointer-events-none">✨</span>
              </>
            )}

            {piece ? (
              <div
                className={`relative w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-all duration-200 ${
                  isBeingDragged
                    ? 'opacity-20 scale-95'
                    : !isPlayable
                    ? 'opacity-40 grayscale-[50%] cursor-not-allowed'
                    : isSelected
                    ? 'scale-105 animate-[bounce_2.5s_ease-in-out_infinite]'
                    : 'hover:scale-108 active:scale-95'
                }`}
                onPointerDown={(e) => {
                  if (e.pointerType === 'mouse' && e.button !== 0) return;
                  onPieceDragStart(piece, slotIndex, e.clientX, e.clientY);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPieceClick) onPieceClick(slotIndex);
                }}
              >
                {/* Visual twinkle if playable */}
                {isPlayable && !isSelected && (
                  <>
                    <div className="absolute top-2 left-2 text-yellow-300 text-[10px] animate-pulse pointer-events-none">
                      ✦
                    </div>
                    <div className="absolute top-2 right-2 text-blue-300 text-[8px] animate-ping pointer-events-none">
                      ✧
                    </div>
                  </>
                )}

                {/* Unplayable Hint */}
                {!isPlayable && (
                  <div className="absolute -bottom-1 px-1.5 py-0.2 rounded-md bg-black/70 border border-white/10 text-rose-300 text-[8px] font-bold tracking-tight pointer-events-none">
                    No fit
                  </div>
                )}

                <div className="animate-pop-in pointer-events-none transition-transform duration-200">
                  <SmoziPieceView piece={piece} blockSize={22} />
                </div>

                {/* Keyboard Shortcut Hint for Desktop */}
                <div className="hidden sm:block absolute bottom-1 right-2 text-[8px] font-bold text-white/30 pointer-events-none">
                  [{slotIndex + 1}]
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl border border-white/5 bg-white/[0.02] shadow-inner transition-opacity duration-300" />
            )}
          </div>
        );
      })}
    </div>
  );
};
