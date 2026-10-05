export class HapticManager {
  isEnabled: boolean = true;

  light(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  }

  medium(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  }

  strong(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 20, 45]);
      } catch {}
    }
  }

  invalid(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 30, 20]);
      } catch {}
    }
  }

  celebration(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 40, 50, 40, 80]);
      } catch {}
    }
  }

  explosion(): void {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 30, 80, 40, 100]);
      } catch {}
    }
  }
}
