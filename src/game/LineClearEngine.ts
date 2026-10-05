import { BoardEngine } from './BoardEngine.ts';
import { BlockColorType } from '../models/BlockColor.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

export interface ClearResult {
  linesClearedCount: number;
  clearedRows: number[];
  clearedCols: number[];
  clearedCells: [number, number][];
  specialEffectsTriggered: Array<{ coord: [number, number]; type: SpecialBlockType }>;
  gemsCollected: Record<SpecialBlockType, number>;
  blocksDestroyedCount: number;
}

export class LineClearEngine {
  constructor(private boardEngine: BoardEngine) {}

  checkAndClearLines(): ClearResult {
    const completedRows: number[] = [];
    const completedCols: number[] = [];

    // 1. Check all rows
    for (let r = 0; r < BoardEngine.BOARD_SIZE; r++) {
      let rowComplete = true;
      for (let c = 0; c < BoardEngine.BOARD_SIZE; c++) {
        const cell = this.boardEngine.getCell(r, c);
        if (!cell || !cell.isOccupied) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) {
        completedRows.push(r);
      }
    }

    // 2. Check all columns
    for (let c = 0; c < BoardEngine.BOARD_SIZE; c++) {
      let colComplete = true;
      for (let r = 0; r < BoardEngine.BOARD_SIZE; r++) {
        const cell = this.boardEngine.getCell(r, c);
        if (!cell || !cell.isOccupied) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) {
        completedCols.push(c);
      }
    }

    const totalLines = completedRows.length + completedCols.length;
    if (totalLines === 0) {
      return {
        linesClearedCount: 0,
        clearedRows: [],
        clearedCols: [],
        clearedCells: [],
        specialEffectsTriggered: [],
        gemsCollected: {} as Record<SpecialBlockType, number>,
        blocksDestroyedCount: 0
      };
    }

    // Collect all cells in completed rows and columns
    const cellsToClearMap = new Map<string, [number, number]>();
    for (const r of completedRows) {
      for (let c = 0; c < BoardEngine.BOARD_SIZE; c++) {
        cellsToClearMap.set(`${r},${c}`, [r, c]);
      }
    }
    for (const c of completedCols) {
      for (let r = 0; r < BoardEngine.BOARD_SIZE; r++) {
        cellsToClearMap.set(`${r},${c}`, [r, c]);
      }
    }

    const gemsCollected: Partial<Record<SpecialBlockType, number>> = {};
    const specialEffects: Array<{ coord: [number, number]; type: SpecialBlockType }> = [];
    const secondaryCellsMap = new Map<string, [number, number]>();

    // Process special blocks inside cleared cells
    for (const [r, c] of cellsToClearMap.values()) {
      const cell = this.boardEngine.getCell(r, c);
      if (!cell) continue;

      if (
        cell.specialType === SpecialBlockType.GEM_BLUE ||
        cell.specialType === SpecialBlockType.GEM_RED ||
        cell.specialType === SpecialBlockType.GEM_GREEN
      ) {
        gemsCollected[cell.specialType] = (gemsCollected[cell.specialType] || 0) + 1;
      } else if (cell.specialType === SpecialBlockType.BOMB) {
        specialEffects.push({ coord: [r, c], type: SpecialBlockType.BOMB });
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BoardEngine.BOARD_SIZE && nc >= 0 && nc < BoardEngine.BOARD_SIZE) {
              secondaryCellsMap.set(`${nr},${nc}`, [nr, nc]);
            }
          }
        }
      } else if (cell.specialType === SpecialBlockType.ROCKET_ROW) {
        specialEffects.push({ coord: [r, c], type: SpecialBlockType.ROCKET_ROW });
        for (let col = 0; col < BoardEngine.BOARD_SIZE; col++) {
          secondaryCellsMap.set(`${r},${col}`, [r, col]);
        }
      } else if (cell.specialType === SpecialBlockType.ROCKET_COL) {
        specialEffects.push({ coord: [r, c], type: SpecialBlockType.ROCKET_COL });
        for (let row = 0; row < BoardEngine.BOARD_SIZE; row++) {
          secondaryCellsMap.set(`${row},${c}`, [row, c]);
        }
      } else if (
        cell.specialType === SpecialBlockType.RAINBOW ||
        cell.specialType === SpecialBlockType.COLOR_BALL
      ) {
        specialEffects.push({ coord: [r, c], type: SpecialBlockType.RAINBOW });
        const targetColor = cell.color;
        if (targetColor !== BlockColorType.NONE) {
          for (let row = 0; row < BoardEngine.BOARD_SIZE; row++) {
            for (let col = 0; col < BoardEngine.BOARD_SIZE; col++) {
              const other = this.boardEngine.getCell(row, col);
              if (other && other.isOccupied && other.color === targetColor) {
                secondaryCellsMap.set(`${row},${col}`, [row, col]);
              }
            }
          }
        }
      }
    }

    // Combine primary and secondary cells
    const allCellsToClear = new Map([...cellsToClearMap, ...secondaryCellsMap]);

    for (const [r, c] of allCellsToClear.values()) {
      const cell = this.boardEngine.getCell(r, c);
      if (!cell) continue;
      if (cell.specialType === SpecialBlockType.ICE && cell.durability > 1) {
        this.boardEngine.setCell(r, c, { ...cell, durability: 1 });
      } else {
        this.boardEngine.clearCell(r, c);
      }
    }

    const clearedCoordsList = Array.from(allCellsToClear.values());

    return {
      linesClearedCount: totalLines,
      clearedRows: completedRows,
      clearedCols: completedCols,
      clearedCells: clearedCoordsList,
      specialEffectsTriggered: specialEffects,
      gemsCollected: gemsCollected as Record<SpecialBlockType, number>,
      blocksDestroyedCount: clearedCoordsList.length
    };
  }
}
