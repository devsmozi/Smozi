export interface ScoreBreakdown {
  placementPoints: number;
  linePoints: number;
  comboBonus: number;
  totalPoints: number;
  feedbackText: string | null;
  comboPercent: string | null;
}

export class ScoreEngine {
  calculateScore(
    blocksPlaced: number,
    linesCleared: number,
    comboCount: number
  ): ScoreBreakdown {
    const placementPoints = blocksPlaced;
    let linePoints = 0;
    if (linesCleared === 1) linePoints = 10;
    else if (linesCleared === 2) linePoints = 25;
    else if (linesCleared === 3) linePoints = 50;
    else if (linesCleared === 4) linePoints = 100;
    else if (linesCleared > 4) linePoints = 100 + (linesCleared - 4) * 40;

    const comboBonus = linesCleared > 0 && comboCount > 1 ? (comboCount - 1) * 15 : 0;
    const totalPoints = placementPoints + linePoints + comboBonus;

    let feedbackText: string | null = null;
    if (linesCleared >= 4 || comboCount >= 4) {
      feedbackText = 'Amazing!';
    } else if (linesCleared === 3 || comboCount === 3) {
      feedbackText = 'Excellent!';
    } else if (linesCleared === 2 || comboCount === 2) {
      feedbackText = 'Great!';
    } else if (linesCleared === 1 && comboCount === 1) {
      feedbackText = Math.random() > 0.5 ? 'Smooth!' : 'Good!';
    } else if (linesCleared === 1) {
      feedbackText = 'Good!';
    }

    let comboPercent: string | null = null;
    if (linesCleared >= 3 || comboCount >= 3) {
      comboPercent = '140%';
    } else if (linesCleared === 2 || comboCount === 2) {
      comboPercent = comboCount > 2 ? '80%' : '40%';
    }

    return {
      placementPoints,
      linePoints,
      comboBonus,
      totalPoints,
      feedbackText,
      comboPercent
    };
  }
}

export class ComboEngine {
  private _currentCombo: number = 0;

  get currentCombo(): number {
    return this._currentCombo;
  }

  registerMove(linesCleared: number): number {
    if (linesCleared > 0) {
      this._currentCombo++;
    } else {
      this._currentCombo = 0;
    }
    return this._currentCombo;
  }

  reset(): void {
    this._currentCombo = 0;
  }
}
