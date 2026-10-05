import React from 'react';
import { BoardEngine } from '../game/BoardEngine.ts';
import { CellState } from '../models/CellState.ts';
import { Piece } from '../models/Piece.ts';
import { SkinTheme } from '../models/SkinTheme.ts';
import { SmoziBlockView } from './SmoziBlockView.tsx';
import { BlockColorType } from '../models/BlockColor.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

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
  onCellClick,
  onCellHover,
  className = ''
}) => {
  const clearingSet = new Set(clearingCells.map(([r, c]) => `${r},${c}`));

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
      } ${className}`}
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
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 border border-white text-white text-[9px] font-black tracking-wider uppercase shadow-md pointer-events-none z-10 animate-bounce">
          ⚠️ Space Critical
        </div>
      )}

      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5 sm:gap-1 p-0.5 sm:p-1">
        {Array.from({ length: BoardEngine.BOARD_SIZE }).map((_, r) =>
          Array.from({ length: BoardEngine.BOARD_SIZE }).map((_, c) => {
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
            const isCollisionDenied = inPreview && cell.isOccupied;

            return (
              <div
                key={`${r}-${c}`}
                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                onClick={() => onCellClick && onCellClick(r, c)}
                onPointerEnter={() => onCellHover && onCellHover(r, c)}
              >
                {inPreview && !cell.isOccupied ? (
                  <SmoziBlockView
                    color={previewPiece!.color}
                    specialType={previewPiece!.specialType}
                    isPreview={true}
                    isDenied={!isPlacementValid}
                    emptyColor={skinTheme.emptyCellColor}
                  />
                ) : isCollisionDenied ? (
                  <SmoziBlockView
                    color={cell.color}
                    specialType={cell.specialType}
                    durability={cell.durability}
                    isDenied={true}
                    emptyColor={skinTheme.emptyCellColor}
                  />
                ) : (
                  <SmoziBlockView
                    color={cell.color}
                    specialType={cell.specialType}
                    durability={cell.durability}
                    isClearing={isClearing}
                    emptyColor={skinTheme.emptyCellColor}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
