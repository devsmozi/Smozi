import { BoardEngine } from './BoardEngine.ts';
import { LineClearEngine } from './LineClearEngine.ts';
import { Piece } from '../models/Piece.ts';

export interface HintMove {
  slotIndex: number;
  piece: Piece;
  row: number;
  col: number;
  occupiedCells: [number, number][];
  linesCleared: number;
}

export class HintEngine {
  /**
   * Evaluates all available tray pieces and boards to find the best valid move.
   * Prioritizes moves that clear lines, then moves that fit cleanly next to existing blocks.
   */
  static findBestMove(
    boardEngine: BoardEngine,
    pieces: (Piece | null)[]
  ): HintMove | null {
    let bestMove: HintMove | null = null;
    let highestScore = -Infinity;

    for (let slotIndex = 0; slotIndex < pieces.length; slotIndex++) {
      const piece = pieces[slotIndex];
      if (!piece) continue;

      const size = boardEngine.size;
      const maxR = size - piece.shape.height;
      const maxC = size - piece.shape.width;

      if (maxR < 0 || maxC < 0) continue;

      for (let r = 0; r <= maxR; r++) {
        for (let c = 0; c <= maxC; c++) {
          if (!boardEngine.canPlace(piece, r, c)) continue;

          // Simulate placement on cloned board
          const testBoard = boardEngine.clone();
          testBoard.placePiece(piece, r, c);
          const lineClear = new LineClearEngine(testBoard);
          const clearRes = lineClear.checkAndClearLines();

          // Calculate move score
          let moveScore = clearRes.linesClearedCount * 150;

          // Adjacency bonus: placing next to other blocks is better than scattering
          const matrix = piece.shape.matrix;
          const occupiedCells: [number, number][] = [];
          for (let pr = 0; pr < matrix.length; pr++) {
            for (let pc = 0; pc < matrix[pr].length; pc++) {
              if (matrix[pr][pc]) {
                const br = r + pr;
                const bc = c + pc;
                occupiedCells.push([br, bc]);

                // Check neighbors
                const neighbors: [number, number][] = [
                  [br - 1, bc],
                  [br + 1, bc],
                  [br, bc - 1],
                  [br, bc + 1]
                ];
                for (const [nr, nc] of neighbors) {
                  const nCell = boardEngine.getCell(nr, nc);
                  if (nCell && nCell.isOccupied) {
                    moveScore += 5;
                  }
                }
              }
            }
          }

          // Bonus for clearing rows near crowded center
          moveScore += (size - Math.abs(r - size / 2)) * 2;

          if (moveScore > highestScore) {
            highestScore = moveScore;
            bestMove = {
              slotIndex,
              piece,
              row: r,
              col: c,
              occupiedCells,
              linesCleared: clearRes.linesClearedCount
            };
          }
        }
      }
    }

    return bestMove;
  }
}
