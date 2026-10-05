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
      className={`relative w-full max-w-[420px] aspect-square mx-auto p-2 rounded-2xl shadow-2xl transition-colors duration-300 box-border select-none touch-none ${className}`}
      style={{
        backgroundColor: skinTheme.boardBackground,
        border: `3px solid ${skinTheme.boardBorder}`,
        boxShadow: `0 12px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5), 0 0 2px ${skinTheme.primaryAccent}`
      }}
    >
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1 p-1">
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
                className="relative w-full h-full flex items-center justify-center"
              >
                {inPreview && !cell.isOccupied ? (
                  <SmoziBlockView
                    color={previewPiece!.color}
                    specialType={previewPiece!.specialType}
                    isPreview={true}
                    isDenied={!isPlacementValid}
                    emptyColor={skinTheme.emptyCellColor}
                    gridLineColor={skinTheme.gridLineColor}
                  />
                ) : cell.isOccupied ? (
                  <SmoziBlockView
                    color={cell.color}
                    specialType={cell.specialType}
                    isClearing={isClearing}
                    isDenied={isCollisionDenied}
                    emptyColor={skinTheme.emptyCellColor}
                    gridLineColor={skinTheme.gridLineColor}
                  />
                ) : (
                  <SmoziBlockView
                    color={BlockColorType.NONE}
                    specialType={SpecialBlockType.NONE}
                    emptyColor={skinTheme.emptyCellColor}
                    gridLineColor={skinTheme.gridLineColor}
                  />
                )}

                {/* Glowing clear line banner effect */}
                {isClearing && (
                  <div
                    className="absolute inset-0 rounded-md border-2 border-white pointer-events-none animate-pulse-glow"
                    style={{
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.9)'
                    }}
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
