import { BoardEngine } from './BoardEngine.ts';
import { Piece } from '../models/Piece.ts';

export interface PlacementPreview {
  isValid: boolean;
  targetRow: number;
  targetCol: number;
  occupiedCells: [number, number][];
}

export class PlacementEngine {
  constructor(private boardEngine: BoardEngine) {}

  calculatePlacement(
    piece: Piece,
    targetRow: number,
    targetCol: number
  ): PlacementPreview {
    const matrix = piece.shape.matrix;
    const cellsToOccupy: [number, number][] = [];

    let isValid = true;
    const size = this.boardEngine.size;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const boardR = targetRow + r;
          const boardC = targetCol + c;
          if (
            boardR < 0 ||
            boardR >= size ||
            boardC < 0 ||
            boardC >= size
          ) {
            isValid = false;
          } else {
            cellsToOccupy.push([boardR, boardC]);
            const existing = this.boardEngine.getCell(boardR, boardC);
            if (existing && existing.isOccupied) {
              isValid = false;
            }
          }
        }
      }
    }

    return {
      isValid,
      targetRow,
      targetCol,
      occupiedCells: cellsToOccupy
    };
  }
}
