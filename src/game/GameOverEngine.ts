import { BoardEngine } from './BoardEngine.ts';
import { Piece } from '../models/Piece.ts';

export class GameOverEngine {
  constructor(private boardEngine: BoardEngine) {}

  /**
   * Returns true only if NONE of the available pieces can fit anywhere on the 8x8 board.
   * If even one valid placement exists for any available piece, returns false.
   */
  isGameOver(availablePieces: (Piece | null)[]): boolean {
    const nonNullPieces = availablePieces.filter((p): p is Piece => p !== null);
    if (nonNullPieces.length === 0) {
      // All pieces placed, new ones will spawn, so not game over.
      return false;
    }

    for (const piece of nonNullPieces) {
      if (this.canPieceFitAnywhere(piece)) {
        return false;
      }
    }

    return true;
  }

  canPieceFitAnywhere(piece: Piece): boolean {
    const maxStartRow = BoardEngine.BOARD_SIZE - piece.shape.height;
    const maxStartCol = BoardEngine.BOARD_SIZE - piece.shape.width;

    if (maxStartRow < 0 || maxStartCol < 0) return false;

    for (let r = 0; r <= maxStartRow; r++) {
      for (let c = 0; c <= maxStartCol; c++) {
        if (this.boardEngine.canPlace(piece, r, c)) {
          return true;
        }
      }
    }
    return false;
  }
}
