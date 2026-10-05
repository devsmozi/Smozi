# SMOZI - Premium Block Puzzle (React Web Edition)

SMOZI is a tactile, candy-style 3D block puzzle web game ported to React + Vite + TypeScript with Tailwind CSS.

## Features

- **Classic Endless Mode**: Clear rows and columns on an 8x8 grid to score points, build combos, and beat your high score.
- **Adventure Mode (50 Levels across 5 Themed Worlds)**:
  1. Emerald Forest (Levels 1–10)
  2. Solar Desert (Levels 11–20)
  3. Arctic Glacier (Levels 21–30)
  4. Volcanic Caldera (Levels 31–40)
  5. Cyber Nebula (Levels 41–50)
- **Special Power-Up Blocks**:
  - Bomb (3x3 explosive radius)
  - Rocket Row & Rocket Column (full row/column sweep)
  - Rainbow & Color Ball (clears all blocks of matching color)
  - Gems (Collectible Blue, Red, Green jewels)
  - Obstacles (Ice blocks with 2-hit crack/melt, Stone blocks, Wooden boxes)
- **Tactile Drag-and-Drop**:
  - Touch and mouse pointer tracking with finger lift offset
  - Real-time valid preview placement highlights & blocked/denied collision warnings
  - Tray pop-in animations with sparkle twinkles
- **Dynamic Combo & FX System**:
  - Announcer callouts ("Good!", "Great!", "Excellent!", "Amazing!", "Smooth!")
  - Shockwave ripple animations and confetti celebrations
- **6 Handcrafted Themes & Background Skins**:
  - Classic Navy, Neon Night, Wooden Timber, Candy Wonderland, Mystic Forest, Volcanic Magma
- **Audio & Haptic Feedback**:
  - Procedural Web Audio API sound effects (piece pickup, placement thuds, combo chords, level victory fanfares)
  - Speech synthesis announcer voice
  - Vibration haptics for supported devices
- **Player Progression & Rewards**:
  - 7-Day Daily Reward calendar with claim streaks
  - Achievement system with progress tracking and rewards
  - LocalStorage persistence for high scores, stars, coins, and gems

## Development

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
