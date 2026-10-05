import React from 'react';
import { CellState } from '../models/CellState.ts';
import { Piece } from '../models/Piece.ts';
import { SkinTheme } from '../models/SkinTheme.ts';
import { SmoziBlockView } from './SmoziBlockView.tsx';
import { BlockColorType } from '../models/BlockColor.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

export interface BombExplosionEffect {
  centerRow: number;
  centerCol: number;
  id: number;
}

interface SmoziBoardViewProps {
  board: CellState[][];
  previewPiece: Piece | null;
  previewRow: number | null;
  previewCol: number | null;
  isPlacementValid: boolean;
  clearingCells: [number, number][];
  skinTheme: SkinTheme;
  boardRef: React.RefObject<HTMLDivElement | null>;
  isCrowded?: boolean;
  hintCells?: [number, number][];
  bombExplosion?: BombExplosionEffect | null;
  onCellClick?: (r: number, c: number) => void;
  onCellHover?: (r: number, c: number) => void;
  className?: string;
}

export const SmoziBoardView: React.FC<SmoziBoardViewProps> = ({
  board,
  previewPiece,
  previewRow,
  previewCol,
  isPlacementValid,
  clearingCells,
  skinTheme,
  boardRef,
  isCrowded = false,
  hintCells = [],
  bombExplosion = null,
  onCellClick,
  onCellHover,
  className = ''
}) => {
  const size = board.length || 8;
  const clearingSet = new Set(clearingCells.map(([r, c]) => `${r},${c}`));
  const hintSet = new Set(hintCells.map(([r, c]) => `${r},${c}`));

  // Check if a cell is part of the preview piece
  const isPreviewCell = (r: number, c: number): boolean => {
    if (!previewPiece || previewRow === null || previewCol === null) return false;
    const matrix = previewPiece.shape.matrix;
    const pr = r - previewRow;
    const pc = c - previewCol;
    return pr >= 0 && pr < matrix.length && pc >= 0 && pc < matrix[pr].length && matrix[pr][pc];
  };

  return (
    <div
      ref={boardRef}
      className={`relative w-full max-w-[min(92vw,min(420px,calc(100dvh-265px)))] aspect-square mx-auto p-1.5 sm:p-2 rounded-2xl shadow-2xl transition-all duration-300 box-border select-none touch-none ${
        isCrowded ? 'ring-2 ring-red-500/70 animate-pulse' : ''
      } ${bombExplosion ? 'animate-shake-strong' : ''} ${className}`}
      style={{
        backgroundColor: skinTheme.boardBackground,
        border: `3px solid ${isCrowded ? '#FF3B30' : skinTheme.boardBorder}`,
        boxShadow: isCrowded
          ? '0 0 25px rgba(255, 59, 48, 0.45), inset 0 0 15px rgba(255, 59, 48, 0.3)'
          : `0 12px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5), 0 0 2px ${skinTheme.primaryAccent}`
      }}
    >
      {/* Danger Warning Banner if board is crowded */}
      {isCrowded && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 border border-white text-white text-[9px] font-black tracking-wider uppercase shadow-md pointer-events-none z-20 animate-bounce">
          ⚠️ Space Critical
        </div>
      )}

      {/* Hint Pointer Indicator */}
      {hintCells.length > 0 && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black tracking-wide uppercase shadow-lg pointer-events-none z-20 flex items-center space-x-1 animate-bounce">
          <span>💡</span>
          <span>BEST SPOT!</span>
        </div>
      )}

      {/* Dynamic Grid Chassis */}
      <div
        className="w-full h-full grid gap-0.5 sm:gap-1 p-0.5 sm:p-1 relative overflow-hidden rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => {
            const cell = board[r]?.[c] || {
              row: r,
              col: c,
              isOccupied: false,
              color: BlockColorType.NONE,
              specialType: SpecialBlockType.NONE,
              durability: 1
            };
            const isClearing = clearingSet.has(`${r},${c}`);
            const inPreview = isPreviewCell(r, c);
            const isHint = hintSet.has(`${r},${c}`);

            return (
              <div
                key={`${r}-${c}`}
                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                onClick={() => onCellClick && onCellClick(r, c)}
                onPointerEnter={() => onCellHover && onCellHover(r, c)}
              >
                {/* Hint Placement Highlight */}
                {isHint && !cell.isOccupied && !inPreview && (
                  <div className="absolute inset-0 rounded-lg ring-2 ring-amber-400 bg-amber-400/30 z-10 pointer-events-none flex items-center justify-center animate-pulse">
                    <span className="text-amber-200 text-[10px] animate-ping">✦</span>
                  </div>
                )}

                {inPreview && !cell.isOccupied ? (
                  <SmoziBlockView
                    color={previewPiece!.color}
                    specialType={previewPiece!.specialType}
                    isPreview={true}
                    isDenied={!isPlacementValid}
                    emptyColor={skinTheme.emptyCellColor}
                  />
                ) : (
                  <SmoziBlockView
                    color={cell.color}
                    specialType={cell.specialType}
                    durability={cell.durability}
                    isOccupied={cell.isOccupied}
                    isClearing={isClearing}
                    emptyColor={skinTheme.emptyCellColor}
                  />
                )}
              </div>
            );
          })
        )}

        {/* Spectacular Bomb Detonation Visual Shockwave */}
        {bombExplosion && (
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: `${((bombExplosion.centerCol + 0.5) / size) * 100}%`,
              top: `${((bombExplosion.centerRow + 0.5) / size) * 100}%`,
              width: `${(3 / size) * 100}%`,
              height: `${(3 / size) * 100}%`
            }}
          >
            {/* Fiery Expanding Shockwave Plasma */}
            <div className="w-full h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 opacity-90 shadow-[0_0_50px_rgba(255,100,0,0.9)] animate-pulse" />
            <span className="absolute text-3xl animate-bounce">💥</span>
          </div>
        )}
      </div>
    </div>
  );
};
