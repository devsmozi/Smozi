import { BlockColorType, PLAYABLE_COLORS, getRandomPlayableColor } from '../models/BlockColor.ts';
import { Piece, createPiece } from '../models/Piece.ts';
import { PieceShapeType, createPieceShape } from '../models/PieceShape.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';
import { BoardEngine } from './BoardEngine.ts';

export class PieceEngine {
  // Diverse library of shapes
  private simpleShapes: PieceShapeType[] = [
    PieceShapeType.LINE_2_H,
    PieceShapeType.LINE_2_V,
    PieceShapeType.CORNER_2X2_TL,
    PieceShapeType.CORNER_2X2_TR,
    PieceShapeType.CORNER_2X2_BL,
    PieceShapeType.CORNER_2X2_BR,
    PieceShapeType.LINE_3_H,
    PieceShapeType.LINE_3_V,
    PieceShapeType.SQUARE_2X2
  ];

  private mediumShapes: PieceShapeType[] = [
    PieceShapeType.L_3X2_0,
    PieceShapeType.L_3X2_90,
    PieceShapeType.L_3X2_180,
    PieceShapeType.L_3X2_270,
    PieceShapeType.J_3X2_0,
    PieceShapeType.J_3X2_90,
    PieceShapeType.J_3X2_180,
    PieceShapeType.J_3X2_270,
    PieceShapeType.T_3X2_UP,
    PieceShapeType.T_3X2_DOWN,
    PieceShapeType.T_3X2_LEFT,
    PieceShapeType.T_3X2_RIGHT,
    PieceShapeType.S_H,
    PieceShapeType.S_V,
    PieceShapeType.Z_H,
    PieceShapeType.Z_V,
    PieceShapeType.LINE_4_H,
    PieceShapeType.LINE_4_V
  ];

  private hardShapes: PieceShapeType[] = [
    PieceShapeType.LINE_5_H,
    PieceShapeType.LINE_5_V,
    PieceShapeType.SQUARE_3X3,
    PieceShapeType.CROSS_3X3
  ];

  private allCatalogShapes: PieceShapeType[] = [
    PieceShapeType.LINE_2_H,
    PieceShapeType.LINE_2_V,
    PieceShapeType.LINE_3_H,
    PieceShapeType.LINE_3_V,
    PieceShapeType.LINE_4_H,
    PieceShapeType.LINE_4_V,
    PieceShapeType.SQUARE_2X2,
    PieceShapeType.L_3X2_0,
    PieceShapeType.L_3X2_90,
    PieceShapeType.L_3X2_180,
    PieceShapeType.L_3X2_270,
    PieceShapeType.J_3X2_0,
    PieceShapeType.J_3X2_90,
    PieceShapeType.J_3X2_180,
    PieceShapeType.J_3X2_270,
    PieceShapeType.T_3X2_UP,
    PieceShapeType.T_3X2_DOWN,
    PieceShapeType.T_3X2_LEFT,
    PieceShapeType.T_3X2_RIGHT,
    PieceShapeType.S_H,
    PieceShapeType.S_V,
    PieceShapeType.Z_H,
    PieceShapeType.Z_V,
    PieceShapeType.CORNER_2X2_TL,
    PieceShapeType.CORNER_2X2_TR,
    PieceShapeType.CORNER_2X2_BL,
    PieceShapeType.CORNER_2X2_BR,
    PieceShapeType.CROSS_3X3,
    PieceShapeType.LINE_5_H,
    PieceShapeType.LINE_5_V,
    PieceShapeType.SQUARE_3X3,
    PieceShapeType.DOT_1
  ];

  private getRandomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * LEVEL-AWARE & BOARD-AWARE Piece Generation System:
   * Analyzes the current board layout, uncollected target coordinates,
   * available empty spaces, and difficulty level to generate a balanced,
   * engaging trio with high tactical utility and guaranteed playability.
   */
  generateBoardAwareTrio(
    boardEngine: BoardEngine,
    difficultyLevel: number = 2,
    includeSpecials: boolean = false
  ): Piece[] {
    const size = boardEngine.size;
    const grid = boardEngine.getBoard();

    // 1. Locate uncollected targets
    const uncollectedTargets: [number, number][] = [];
    let occupiedCount = 0;
    const totalCells = size * size;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = grid[r][c];
        if (cell.isOccupied) {
          occupiedCount++;
        }
        if (cell.target && !cell.target.collected) {
          uncollectedTargets.push([r, c]);
        }
      }
    }

    const fullnessRatio = occupiedCount / totalCells;

    // 2. Evaluate all shapes against the actual board
    interface ShapeEvaluation {
      shapeType: PieceShapeType;
      blockCount: number;
      canFit: boolean;
      coversTargetCount: number;
      clearsLineCount: number;
    }

    const evaluations: ShapeEvaluation[] = [];

    // Shuffle catalog to ensure fresh variety each generation
    const candidates = [...this.allCatalogShapes].sort(() => Math.random() - 0.5);

    for (const shapeType of candidates) {
      const shape = createPieceShape(shapeType);
      const testPiece = createPiece(shape, BlockColorType.BLUE, SpecialBlockType.NONE);
      const maxR = size - shape.height;
      const maxC = size - shape.width;

      if (maxR < 0 || maxC < 0) continue;

      let canFit = false;
      let maxCoversTarget = 0;
      let maxClearsLine = 0;

      for (let r = 0; r <= maxR; r++) {
        for (let c = 0; c <= maxC; c++) {
          if (boardEngine.canPlace(testPiece, r, c)) {
            canFit = true;

            // Check if this placement covers any uncollected targets
            let covers = 0;
            const matrix = shape.matrix;
            for (let pr = 0; pr < matrix.length; pr++) {
              for (let pc = 0; pc < matrix[pr].length; pc++) {
                if (matrix[pr][pc]) {
                  const br = r + pr;
                  const bc = c + pc;
                  if (uncollectedTargets.some(([tr, tc]) => tr === br && tc === bc)) {
                    covers++;
                  }
                }
              }
            }
            if (covers > maxCoversTarget) {
              maxCoversTarget = covers;
            }

            // Quick line clear estimation for row/col
            let potentialClears = 0;
            for (let pr = 0; pr < matrix.length; pr++) {
              const br = r + pr;
              let rowFill = 0;
              for (let col = 0; col < size; col++) {
                if (grid[br][col].isOccupied || (col >= c && col < c + matrix[pr].length && matrix[pr][col - c])) {
                  rowFill++;
                }
              }
              if (rowFill === size) potentialClears++;
            }
            if (potentialClears > maxClearsLine) {
              maxClearsLine = potentialClears;
            }
          }
        }
      }

      evaluations.push({
        shapeType,
        blockCount: shape.blockCount,
        canFit,
        coversTargetCount: maxCoversTarget,
        clearsLineCount: maxClearsLine
      });
    }

    // Filter to only shapes that actually fit on the board
    const fittable = evaluations.filter((e) => e.canFit);

    // If board is somehow so full that almost nothing fits, allow tiny shapes
    if (fittable.length === 0) {
      const emergencyShapes = [
        PieceShapeType.DOT_1,
        PieceShapeType.LINE_2_H,
        PieceShapeType.LINE_2_V
      ];
      return emergencyShapes.slice(0, 3).map((sh) =>
        createPiece(createPieceShape(sh), getRandomPlayableColor(), SpecialBlockType.NONE)
      );
    }

    // Categorize shapes by tactical value
    const targetReachers = fittable
      .filter((e) => e.coversTargetCount > 0)
      .sort((a, b) => b.coversTargetCount - a.coversTargetCount || b.blockCount - a.blockCount);

    const lineClearers = fittable
      .filter((e) => e.clearsLineCount > 0)
      .sort((a, b) => b.clearsLineCount - a.clearsLineCount || b.blockCount - a.blockCount);

    // Distinct size categories to guarantee varied block sizes for the player:
    // Small (1-2 cells): Dot, 2-lines
    const smallFittable = fittable.filter((e) => e.blockCount <= 2);
    // Medium (3 cells): 3-lines, 2x2 corners
    const mediumFittable = fittable.filter((e) => e.blockCount === 3);
    // Large (4 cells): 2x2 Square, L, J, T, S, Z, 4-lines
    const largeFittable = fittable.filter((e) => e.blockCount === 4);
    // Extra Large (5+ cells): 5-lines, 3x3 Square, Cross
    const xlFittable = fittable.filter((e) => e.blockCount >= 5);

    const selectedShapeTypes: PieceShapeType[] = [];

    // 1. First piece: Target reacher if targets exist; otherwise a diverse small/precision piece
    if (uncollectedTargets.length > 0 && targetReachers.length > 0) {
      // Pick a target reacher (can be any size that hits target)
      const chosen = this.getRandomFrom(targetReachers);
      selectedShapeTypes.push(chosen.shapeType);
    } else if (smallFittable.length > 0 && Math.random() < 0.75) {
      selectedShapeTypes.push(this.getRandomFrom(smallFittable).shapeType);
    } else if (mediumFittable.length > 0) {
      selectedShapeTypes.push(this.getRandomFrom(mediumFittable).shapeType);
    } else {
      selectedShapeTypes.push(fittable[0].shapeType);
    }

    // 2. Second piece: Medium size block (3-4 cells) distinct from first piece
    const availableForSecond = fittable.filter((e) => !selectedShapeTypes.includes(e.shapeType));
    const pool2 = availableForSecond.length > 0 ? availableForSecond : fittable;
    const medPool = pool2.filter((e) => e.blockCount >= 3 && e.blockCount <= 4);
    if (medPool.length > 0) {
      selectedShapeTypes.push(this.getRandomFrom(medPool).shapeType);
    } else {
      selectedShapeTypes.push(pool2[0].shapeType);
    }

    // 3. Third piece: Complementary size (small precision piece if not picked, or large/xl shape)
    const availableForThird = fittable.filter((e) => !selectedShapeTypes.includes(e.shapeType));
    const pool3 = availableForThird.length > 0 ? availableForThird : fittable;

    const hasSmall = selectedShapeTypes.some((st) => {
      const sh = fittable.find((f) => f.shapeType === st);
      return sh && sh.blockCount <= 2;
    });

    if (!hasSmall && smallFittable.length > 0) {
      // Ensure we have a small piece in the trio
      const smallPick = smallFittable.find((e) => !selectedShapeTypes.includes(e.shapeType)) || smallFittable[0];
      selectedShapeTypes.push(smallPick.shapeType);
    } else {
      // Provide larger / exciting shape (4-5 cells)
      const bigPool = pool3.filter((e) => e.blockCount >= 4);
      if (bigPool.length > 0 && fullnessRatio < 0.65) {
        selectedShapeTypes.push(this.getRandomFrom(bigPool).shapeType);
      } else {
        selectedShapeTypes.push(this.getRandomFrom(pool3).shapeType);
      }
    }

    // Shuffle the trio so small/medium/large pieces appear across different slots
    selectedShapeTypes.sort(() => Math.random() - 0.5);

    // 4. Assign distinct vibrant colors and optional specials
    const colors = [...PLAYABLE_COLORS].sort(() => Math.random() - 0.5);
    const result: Piece[] = [];

    for (let i = 0; i < 3; i++) {
      const shapeType = selectedShapeTypes[i] || PieceShapeType.LINE_2_H;
      const color = colors[i] || getRandomPlayableColor();
      let specialType = SpecialBlockType.NONE;

      // Special block chance based on difficulty
      const specialChance = difficultyLevel >= 3 ? 0.12 : 0.08;
      if (includeSpecials && Math.random() < specialChance) {
        const randSpecial = Math.floor(Math.random() * 4);
        if (randSpecial === 0) specialType = SpecialBlockType.BOMB;
        else if (randSpecial === 1) specialType = SpecialBlockType.ROCKET_ROW;
        else if (randSpecial === 2) specialType = SpecialBlockType.ROCKET_COL;
        else specialType = SpecialBlockType.RAINBOW;
      }

      result.push(createPiece(createPieceShape(shapeType), color, specialType));
    }

    return result;
  }

  /**
   * Classic Mode / Fallback Generator with shape diversity
   */
  generatePieceTrio(
    includeSpecials: boolean = true,
    difficultyLevel: number = 1,
    fitnessChecker?: (piece: Piece) => boolean
  ): Piece[] {
    const result: Piece[] = [];
    const shapePool: PieceShapeType[] = [];

    // Slot 1: Medium or Simple
    if (difficultyLevel <= 2) {
      shapePool.push(this.getRandomFrom(this.simpleShapes));
    } else {
      shapePool.push(Math.random() < 0.6 ? this.getRandomFrom(this.mediumShapes) : this.getRandomFrom(this.simpleShapes));
    }

    // Slot 2: Rich Medium shape (L, J, T, S, Z, 4-line)
    if (difficultyLevel === 1) {
      shapePool.push(Math.random() < 0.6 ? this.getRandomFrom(this.simpleShapes) : this.getRandomFrom(this.mediumShapes));
    } else if (difficultyLevel === 2) {
      shapePool.push(this.getRandomFrom(this.mediumShapes));
    } else {
      const rand = Math.random();
      if (rand < 0.25) shapePool.push(this.getRandomFrom(this.simpleShapes));
      else if (rand < 0.7) shapePool.push(this.getRandomFrom(this.mediumShapes));
      else shapePool.push(this.getRandomFrom(this.hardShapes));
    }

    // Slot 3: Complementary shape
    if (difficultyLevel === 1) {
      shapePool.push(Math.random() < 0.5 ? this.getRandomFrom(this.mediumShapes) : this.getRandomFrom(this.simpleShapes));
    } else if (difficultyLevel === 2) {
      shapePool.push(Math.random() < 0.35 ? this.getRandomFrom(this.hardShapes) : this.getRandomFrom(this.mediumShapes));
    } else {
      shapePool.push(Math.random() < 0.45 ? this.getRandomFrom(this.hardShapes) : this.getRandomFrom(this.mediumShapes));
    }

    const availableColors = [...PLAYABLE_COLORS].sort(() => Math.random() - 0.5);

    for (const shapeType of shapePool) {
      const color = availableColors.pop() || getRandomPlayableColor();
      let specialType = SpecialBlockType.NONE;

      const specialChance = difficultyLevel >= 3 ? 0.15 : 0.08;
      if (includeSpecials && Math.random() < specialChance) {
        const randSpecial = Math.floor(Math.random() * 4);
        if (randSpecial === 0) specialType = SpecialBlockType.BOMB;
        else if (randSpecial === 1) specialType = SpecialBlockType.ROCKET_ROW;
        else if (randSpecial === 2) specialType = SpecialBlockType.ROCKET_COL;
        else specialType = SpecialBlockType.RAINBOW;
      }

      result.push(createPiece(createPieceShape(shapeType), color, specialType));
    }

    // Fairness Safeguard: Ensure at least one piece can fit
    if (fitnessChecker && !result.some((p) => fitnessChecker(p))) {
      const fallbackShapes = [
        PieceShapeType.CORNER_2X2_TL,
        PieceShapeType.LINE_2_H,
        PieceShapeType.LINE_2_V,
        PieceShapeType.L_3X2_0,
        PieceShapeType.LINE_3_H
      ];
      for (const shape of fallbackShapes) {
        const fallbackPiece = createPiece(createPieceShape(shape), getRandomPlayableColor(), SpecialBlockType.NONE);
        if (fitnessChecker(fallbackPiece)) {
          result[0] = fallbackPiece;
          break;
        }
      }
    }

    return result;
  }
}
