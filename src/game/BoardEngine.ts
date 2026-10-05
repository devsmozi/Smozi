import { CellState, createEmptyCell } from '../models/CellState.ts';
import { Piece } from '../models/Piece.ts';

export class BoardEngine {
  static readonly BOARD_SIZE = 8;
  public size: number;
  private grid: CellState[][];

  constructor(size: number = 8) {
    this.size = size;
    this.grid = this.initGrid();
  }

  resize(newSize: number): void {
    this.size = newSize;
    this.grid = this.initGrid();
  }

  private initGrid(): CellState[][] {
    const arr: CellState[][] = [];
    for (let r = 0; r < this.size; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < this.size; c++) {
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
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return null;
    }
    return this.grid[row][col];
  }

  setCell(row: number, col: number, state: CellState): void {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = { ...state, row, col };
    }
  }

  resetBoard(newSize?: number): void {
    if (newSize && newSize !== this.size) {
      this.size = newSize;
    }
    this.grid = this.initGrid();
  }

  clearSingleCell(row: number, col: number): boolean {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = createEmptyCell(row, col);
      return true;
    }
    return false;
  }

  clearArea(centerRow: number, centerCol: number, radius: number = 1): [number, number][] {
    const cleared: [number, number][] = [];
    for (let r = centerRow - radius; r <= centerRow + radius; r++) {
      for (let c = centerCol - radius; c <= centerCol + radius; c++) {
        if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
          if (this.grid[r][c].isOccupied) {
            cleared.push([r, c]);
          }
          this.grid[r][c] = createEmptyCell(r, c);
        }
      }
    }
    return cleared;
  }

  loadInitialBoard(initialCells: Record<string, CellState>, boardSize?: number): void {
    this.resetBoard(boardSize);
    for (const [key, cell] of Object.entries(initialCells)) {
      const [rStr, cStr] = key.split(',');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);
      if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
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
            boardR >= this.size ||
            boardC < 0 ||
            boardC >= this.size
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
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = createEmptyCell(row, col);
    }
  }

  clone(): BoardEngine {
    const cloned = new BoardEngine(this.size);
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        cloned.grid[r][c] = { ...this.grid[r][c] };
      }
    }
    return cloned;
  }
}
