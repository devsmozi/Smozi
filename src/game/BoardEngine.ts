import { CellState, createEmptyCell } from '../models/CellState.ts';
import { Piece } from '../models/Piece.ts';

export class BoardEngine {
  static readonly BOARD_SIZE = 8;
  private grid: CellState[][];

  constructor() {
    this.grid = this.initGrid();
  }

  private initGrid(): CellState[][] {
    const arr: CellState[][] = [];
    for (let r = 0; r < BoardEngine.BOARD_SIZE; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < BoardEngine.BOARD_SIZE; c++) {
        row.push(createEmptyCell(r, c));
      }
      arr.push(row);
    }
    return arr;
  }

  getBoard(): CellState[][] {
    return this.grid.map((row) => row.map((cell) => ({ ...cell })));
  }

  getCell(row: number, col: number): CellState | null {
    if (row < 0 || row >= BoardEngine.BOARD_SIZE || col < 0 || col >= BoardEngine.BOARD_SIZE) {
      return null;
    }
    return this.grid[row][col];
  }

  setCell(row: number, col: number, state: CellState): void {
    if (row >= 0 && row < BoardEngine.BOARD_SIZE && col >= 0 && col < BoardEngine.BOARD_SIZE) {
      this.grid[row][col] = { ...state, row, col };
    }
  }

  resetBoard(): void {
    this.grid = this.initGrid();
  }

  loadInitialBoard(initialCells: Record<string, CellState>): void {
    this.resetBoard();
    for (const [key, cell] of Object.entries(initialCells)) {
      const [rStr, cStr] = key.split(',');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);
      if (r >= 0 && r < BoardEngine.BOARD_SIZE && c >= 0 && c < BoardEngine.BOARD_SIZE) {
        this.grid[r][c] = { ...cell, row: r, col: c };
      }
    }
  }

  canPlace(piece: Piece, startRow: number, startCol: number): boolean {
    const matrix = piece.shape.matrix;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const boardR = startRow + r;
          const boardC = startCol + c;
          if (
            boardR < 0 ||
            boardR >= BoardEngine.BOARD_SIZE ||
            boardC < 0 ||
            boardC >= BoardEngine.BOARD_SIZE
          ) {
            return false;
          }
          if (this.grid[boardR][boardC].isOccupied) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(piece: Piece, startRow: number, startCol: number): boolean {
    if (!this.canPlace(piece, startRow, startCol)) return false;
    const matrix = piece.shape.matrix;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const boardR = startRow + r;
          const boardC = startCol + c;
          this.grid[boardR][boardC] = {
            row: boardR,
            col: boardC,
            isOccupied: true,
            color: piece.color,
            specialType: piece.specialType,
            durability: 1,
            isClearing: false
          };
        }
      }
    }
    return true;
  }

  clearCell(row: number, col: number): void {
    if (row >= 0 && row < BoardEngine.BOARD_SIZE && col >= 0 && col < BoardEngine.BOARD_SIZE) {
      this.grid[row][col] = createEmptyCell(row, col);
    }
  }

  clone(): BoardEngine {
    const cloned = new BoardEngine();
    for (let r = 0; r < BoardEngine.BOARD_SIZE; r++) {
      for (let c = 0; c < BoardEngine.BOARD_SIZE; c++) {
        cloned.grid[r][c] = { ...this.grid[r][c] };
      }
    }
    return cloned;
  }
}
