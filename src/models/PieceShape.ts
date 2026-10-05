export enum PieceShapeType {
  DOT_1 = 'DOT_1',
  LINE_2_H = 'LINE_2_H',
  LINE_2_V = 'LINE_2_V',
  LINE_3_H = 'LINE_3_H',
  LINE_3_V = 'LINE_3_V',
  LINE_4_H = 'LINE_4_H',
  LINE_4_V = 'LINE_4_V',
  LINE_5_H = 'LINE_5_H',
  LINE_5_V = 'LINE_5_V',
  SQUARE_2X2 = 'SQUARE_2X2',
  SQUARE_3X3 = 'SQUARE_3X3',
  L_3X2_0 = 'L_3X2_0',
  L_3X2_90 = 'L_3X2_90',
  L_3X2_180 = 'L_3X2_180',
  L_3X2_270 = 'L_3X2_270',
  J_3X2_0 = 'J_3X2_0',
  J_3X2_90 = 'J_3X2_90',
  J_3X2_180 = 'J_3X2_180',
  J_3X2_270 = 'J_3X2_270',
  T_3X2_UP = 'T_3X2_UP',
  T_3X2_DOWN = 'T_3X2_DOWN',
  T_3X2_LEFT = 'T_3X2_LEFT',
  T_3X2_RIGHT = 'T_3X2_RIGHT',
  S_H = 'S_H',
  S_V = 'S_V',
  Z_H = 'Z_H',
  Z_V = 'Z_V',
  CORNER_2X2_TL = 'CORNER_2X2_TL',
  CORNER_2X2_TR = 'CORNER_2X2_TR',
  CORNER_2X2_BL = 'CORNER_2X2_BL',
  CORNER_2X2_BR = 'CORNER_2X2_BR',
  CROSS_3X3 = 'CROSS_3X3'
}

export interface PieceShape {
  type: PieceShapeType;
  name: string;
  matrix: boolean[][];
  height: number;
  width: number;
  blockCount: number;
}

export function createPieceShape(type: PieceShapeType): PieceShape {
  let matrix: boolean[][];

  switch (type) {
    case PieceShapeType.DOT_1:
      matrix = [[true]];
      break;
    case PieceShapeType.LINE_2_H:
      matrix = [[true, true]];
      break;
    case PieceShapeType.LINE_2_V:
      matrix = [[true], [true]];
      break;
    case PieceShapeType.LINE_3_H:
      matrix = [[true, true, true]];
      break;
    case PieceShapeType.LINE_3_V:
      matrix = [[true], [true], [true]];
      break;
    case PieceShapeType.LINE_4_H:
      matrix = [[true, true, true, true]];
      break;
    case PieceShapeType.LINE_4_V:
      matrix = [[true], [true], [true], [true]];
      break;
    case PieceShapeType.LINE_5_H:
      matrix = [[true, true, true, true, true]];
      break;
    case PieceShapeType.LINE_5_V:
      matrix = [[true], [true], [true], [true], [true]];
      break;
    case PieceShapeType.SQUARE_2X2:
      matrix = [
        [true, true],
        [true, true]
      ];
      break;
    case PieceShapeType.SQUARE_3X3:
      matrix = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      break;
    case PieceShapeType.L_3X2_0:
      matrix = [
        [true, false],
        [true, false],
        [true, true]
      ];
      break;
    case PieceShapeType.L_3X2_90:
      matrix = [
        [true, true, true],
        [true, false, false]
      ];
      break;
    case PieceShapeType.L_3X2_180:
      matrix = [
        [true, true],
        [false, true],
        [false, true]
      ];
      break;
    case PieceShapeType.L_3X2_270:
      matrix = [
        [false, false, true],
        [true, true, true]
      ];
      break;
    case PieceShapeType.J_3X2_0:
      matrix = [
        [false, true],
        [false, true],
        [true, true]
      ];
      break;
    case PieceShapeType.J_3X2_90:
      matrix = [
        [true, false, false],
        [true, true, true]
      ];
      break;
    case PieceShapeType.J_3X2_180:
      matrix = [
        [true, true],
        [true, false],
        [true, false]
      ];
      break;
    case PieceShapeType.J_3X2_270:
      matrix = [
        [true, true, true],
        [false, false, true]
      ];
      break;
    case PieceShapeType.T_3X2_UP:
      matrix = [
        [false, true, false],
        [true, true, true]
      ];
      break;
    case PieceShapeType.T_3X2_DOWN:
      matrix = [
        [true, true, true],
        [false, true, false]
      ];
      break;
    case PieceShapeType.T_3X2_LEFT:
      matrix = [
        [false, true],
        [true, true],
        [false, true]
      ];
      break;
    case PieceShapeType.T_3X2_RIGHT:
      matrix = [
        [true, false],
        [true, true],
        [true, false]
      ];
      break;
    case PieceShapeType.S_H:
      matrix = [
        [false, true, true],
        [true, true, false]
      ];
      break;
    case PieceShapeType.S_V:
      matrix = [
        [true, false],
        [true, true],
        [false, true]
      ];
      break;
    case PieceShapeType.Z_H:
      matrix = [
        [true, true, false],
        [false, true, true]
      ];
      break;
    case PieceShapeType.Z_V:
      matrix = [
        [false, true],
        [true, true],
        [true, false]
      ];
      break;
    case PieceShapeType.CORNER_2X2_TL:
      matrix = [
        [true, true],
        [true, false]
      ];
      break;
    case PieceShapeType.CORNER_2X2_TR:
      matrix = [
        [true, true],
        [false, true]
      ];
      break;
    case PieceShapeType.CORNER_2X2_BL:
      matrix = [
        [true, false],
        [true, true]
      ];
      break;
    case PieceShapeType.CORNER_2X2_BR:
      matrix = [
        [false, true],
        [true, true]
      ];
      break;
    case PieceShapeType.CROSS_3X3:
      matrix = [
        [false, true, false],
        [true, true, true],
        [false, true, false]
      ];
      break;
    default:
      matrix = [[true]];
  }

  const height = matrix.length;
  const width = matrix[0] ? matrix[0].length : 0;
  let blockCount = 0;
  for (const row of matrix) {
    for (const cell of row) {
      if (cell) blockCount++;
    }
  }

  return {
    type,
    name: type,
    matrix,
    height,
    width,
    blockCount
  };
}
