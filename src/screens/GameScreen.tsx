import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BoardEngine } from '../game/BoardEngine.ts';
import { PieceEngine } from '../game/PieceEngine.ts';
import { PlacementEngine } from '../game/PlacementEngine.ts';
import { LineClearEngine } from '../game/LineClearEngine.ts';
import { ScoreEngine, ComboEngine } from '../game/ScoreEngine.ts';
import { GameOverEngine } from '../game/GameOverEngine.ts';
import { AudioManager } from '../systems/AudioManager.ts';
import { HapticManager } from '../systems/HapticManager.ts';
import { SaveManager } from '../systems/SaveManager.ts';
import { GameMode, LevelData, PlayerData, ObjectiveType } from '../models/GameModels.ts';
import { Piece } from '../models/Piece.ts';
import { CellState } from '../models/CellState.ts';
import { getSkinTheme } from '../models/SkinTheme.ts';
import { getLevel } from '../data/LevelsData.ts';
import { SmoziTopHud } from '../components/SmoziTopHud.tsx';
import { SmoziBoardView } from '../components/SmoziBoardView.tsx';
import { SmoziTrayView } from '../components/SmoziTrayView.tsx';
import { SmoziPieceView } from '../components/SmoziPieceView.tsx';
import { ParticleOverlay } from '../components/ParticleOverlay.tsx';
import { PauseDialog } from '../components/PauseDialog.tsx';
import { LevelCompleteDialog } from '../components/LevelCompleteDialog.tsx';
import { GameOverDialog } from '../components/GameOverDialog.tsx';
import { SettingsDialog } from '../components/SettingsDialog.tsx';

interface GameScreenProps {
  mode: GameMode;
  initialLevelId?: number;
  playerData: PlayerData;
  audioManager: AudioManager;
  hapticManager: HapticManager;
  saveManager: SaveManager;
  onUpdatePlayerData: (data: PlayerData) => void;
  onNavigateHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  initialLevelId = 1,
  playerData,
  audioManager,
  hapticManager,
  saveManager,
  onUpdatePlayerData,
  onNavigateHome
}) => {
  // Game Engines
  const boardEngineRef = useRef<BoardEngine>(new BoardEngine());
  const pieceEngineRef = useRef<PieceEngine>(new PieceEngine());
  const placementEngineRef = useRef<PlacementEngine>(new PlacementEngine(boardEngineRef.current));
  const lineClearEngineRef = useRef<LineClearEngine>(new LineClearEngine(boardEngineRef.current));
  const scoreEngineRef = useRef<ScoreEngine>(new ScoreEngine());
  const comboEngineRef = useRef<ComboEngine>(new ComboEngine());
  const gameOverEngineRef = useRef<GameOverEngine>(new GameOverEngine(boardEngineRef.current));

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Game State
  const [currentLevelId, setCurrentLevelId] = useState<number>(initialLevelId);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [board, setBoard] = useState<CellState[][]>([]);
  const [trayPieces, setTrayPieces] = useState<(Piece | null)[]>([null, null, null]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(
    mode === GameMode.ADVENTURE
      ? playerData.levelHighScores[initialLevelId] || 0
      : playerData.classicHighScore
  );
  const [movesLeft, setMovesLeft] = useState<number>(25);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [clearingCells, setClearingCells] = useState<[number, number][]>([]);

  // Feedback FX
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [comboPercent, setComboPercent] = useState<string | null>(null);
  const [scoreIncrement, setScoreIncrement] = useState<number>(0);
  const [triggerEffect, setTriggerEffect] = useState<number>(0);

  // Dialogs State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [gemsEarned, setGemsEarned] = useState<number>(0);

  // Dragging State
  const [activeDraggingPiece, setActiveDraggingPiece] = useState<Piece | null>(null);
  const [dragSlotIndex, setDragSlotIndex] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [previewRow, setPreviewRow] = useState<number | null>(null);
  const [previewCol, setPreviewCol] = useState<number | null>(null);
  const [isPlacementValid, setIsPlacementValid] = useState<boolean>(false);

  // Theme
  const currentSkin = getSkinTheme(playerData.selectedTheme);

  // Initialize Game
  const initGame = useCallback(
    (lvlId: number = currentLevelId) => {
      boardEngineRef.current.resetBoard();
      comboEngineRef.current.reset();
      setClearingCells([]);
      setIsGameOver(false);
      setIsLevelComplete(false);
      setIsPaused(false);
      setScore(0);
      setIsNewHighScore(false);
      setFeedbackText(null);
      setComboPercent(null);
      setScoreIncrement(0);

      const newTrio = pieceEngineRef.current.generatePieceTrio(true);
      setTrayPieces(newTrio);

      if (mode === GameMode.ADVENTURE) {
        const lvl = getLevel(lvlId);
        setLevelData({
          ...lvl,
          objective: { ...lvl.objective, currentAmount: 0 }
        });
        boardEngineRef.current.loadInitialBoard(lvl.initialBoard);
        setMovesLeft(lvl.moveLimit);
        setHighScore(playerData.levelHighScores[lvlId] || 0);
      } else {
        setLevelData(null);
        setHighScore(playerData.classicHighScore);
      }

      setBoard(boardEngineRef.current.getBoard());
    },
    [mode, currentLevelId, playerData.classicHighScore, playerData.levelHighScores]
  );

  useEffect(() => {
    initGame(initialLevelId);
  }, [mode, initialLevelId, initGame]);

  // Drag Pointer Tracking
  const updateBoardHover = useCallback(
    (clientX: number, clientY: number, piece: Piece) => {
      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();

      const cellSize = boardRect.width / BoardEngine.BOARD_SIZE;
      const pieceCenterX = piece.shape.width * cellSize * 0.5;
      const pieceCenterY = piece.shape.height * cellSize * 0.5;

      // Finger lift offset so piece floats above touch pointer
      const fingerLiftY = cellSize * 1.5;

      const boardRelX = clientX - boardRect.left - pieceCenterX;
      const boardRelY = clientY - fingerLiftY - boardRect.top - pieceCenterY;

      const targetCol = Math.round(boardRelX / cellSize);
      const targetRow = Math.round(boardRelY / cellSize);

      if (
        targetRow >= 0 &&
        targetRow < BoardEngine.BOARD_SIZE &&
        targetCol >= 0 &&
        targetCol < BoardEngine.BOARD_SIZE
      ) {
        setPreviewRow(targetRow);
        setPreviewCol(targetCol);
        const preview = placementEngineRef.current.calculatePlacement(piece, targetRow, targetCol);
        setIsPlacementValid(preview.isValid);
      } else {
        setPreviewRow(null);
        setPreviewCol(null);
        setIsPlacementValid(false);
      }
    },
    []
  );

  const handlePieceDragStart = (
    piece: Piece,
    slotIndex: number,
    clientX: number,
    clientY: number
  ) => {
    setActiveDraggingPiece(piece);
    setDragSlotIndex(slotIndex);
    setDragPos({ x: clientX, y: clientY });
    audioManager.playPiecePickup();
    hapticManager.light();
    updateBoardHover(clientX, clientY, piece);
  };

  useEffect(() => {
    if (!activeDraggingPiece) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });
      updateBoardHover(e.clientX, e.clientY, activeDraggingPiece);
    };

    const handlePointerUp = () => {
      const piece = activeDraggingPiece;
      const slotIndex = dragSlotIndex;
      const r = previewRow;
      const c = previewCol;
      const valid = isPlacementValid;

      setActiveDraggingPiece(null);
      setDragSlotIndex(null);
      setDragPos(null);
      setPreviewRow(null);
      setPreviewCol(null);
      setIsPlacementValid(false);

      if (!piece || slotIndex === null || r === null || c === null || !valid) {
        if (piece && r !== null && c !== null && !valid) {
          audioManager.playInvalidPlacement();
          hapticManager.invalid();
        }
        return;
      }

      // 1. Place piece on board
      boardEngineRef.current.placePiece(piece, r, c);
      audioManager.playPiecePlacement();
      hapticManager.medium();

      // 2. Consume from tray
      const nextTray = [...trayPieces];
      nextTray[slotIndex] = null;

      // 3. Clear lines
      const clearResult = lineClearEngineRef.current.checkAndClearLines();
      const linesCleared = clearResult.linesClearedCount;
      const combo = comboEngineRef.current.registerMove(linesCleared);

      // 4. Calculate score
      const breakdown = scoreEngineRef.current.calculateScore(
        piece.blockCount,
        linesCleared,
        combo
      );
      const newScore = score + breakdown.totalPoints;
      setScore(newScore);

      const hadNewHighScore =
        highScore > 0 && newScore > highScore && score <= highScore;
      if (hadNewHighScore) {
        setIsNewHighScore(true);
      }
      if (newScore > highScore) {
        setHighScore(newScore);
      }

      // Sound & feedback FX
      if (linesCleared > 0) {
        audioManager.playBubbleBurstPop(1.0 + combo * 0.1);
        audioManager.playLineClear(combo);
        hapticManager.strong();
        if (breakdown.feedbackText) {
          audioManager.speakAnnouncer(breakdown.feedbackText);
        }
        setFeedbackText(breakdown.feedbackText);
        setComboPercent(breakdown.comboPercent);
        setScoreIncrement(breakdown.totalPoints);
        setTriggerEffect(Date.now());

        setClearingCells(clearResult.clearedCells);
        setTimeout(() => {
          setClearingCells([]);
        }, 320);
      } else {
        setFeedbackText(null);
        setComboPercent(null);
        setScoreIncrement(0);
      }

      if (Object.keys(clearResult.gemsCollected).length > 0) {
        audioManager.playGemCollect();
      }

      // 5. Check Adventure objectives
      let nextMoves = movesLeft;
      if (mode === GameMode.ADVENTURE) {
        nextMoves = Math.max(0, movesLeft - 1);
        setMovesLeft(nextMoves);
      }

      let levelWon = false;
      let starsCount = 0;
      let coinReward = 0;
      let gemReward = 0;

      if (levelData) {
        const obj = { ...levelData.objective };
        if (obj.type === ObjectiveType.SCORE) {
          obj.currentAmount = newScore;
        } else if (obj.type === ObjectiveType.CLEAR_COLOR) {
          if (piece.color === obj.targetColor) {
            obj.currentAmount += piece.blockCount;
          }
        } else if (obj.type === ObjectiveType.COLLECT_GEMS) {
          const totalGems = Object.values(clearResult.gemsCollected).reduce(
            (sum, val) => sum + (val || 0),
            0
          );
          obj.currentAmount += totalGems;
        } else if (obj.type === ObjectiveType.CLEAR_SPECIAL) {
          const matched = clearResult.specialEffectsTriggered.filter(
            (e) => e.type === obj.targetSpecial
          ).length;
          obj.currentAmount += matched;
        }

        setLevelData({ ...levelData, objective: obj });

        if (obj.currentAmount >= obj.targetAmount) {
          levelWon = true;
          starsCount =
            newScore >= levelData.starThresholds[2]
              ? 3
              : newScore >= levelData.starThresholds[1]
              ? 2
              : 1;
          coinReward = levelData.rewardCoins;
          gemReward = levelData.rewardGems;

          setEarnedStars(starsCount);
          setCoinsEarned(coinReward);
          setGemsEarned(gemReward);
          setIsLevelComplete(true);
          audioManager.playLevelComplete();
          hapticManager.celebration();

          // Save progression
          const updatedUnlocked = Array.from(
            new Set([...playerData.unlockedLevels, levelData.id + 1])
          );
          const updatedStars = {
            ...playerData.levelStars,
            [levelData.id]: Math.max(
              playerData.levelStars[levelData.id] || 0,
              starsCount
            )
          };
          const updatedHighScores = {
            ...playerData.levelHighScores,
            [levelData.id]: Math.max(
              playerData.levelHighScores[levelData.id] || 0,
              newScore
            )
          };
          const updatedPlayer: PlayerData = {
            ...playerData,
            coins: playerData.coins + coinReward,
            gems: playerData.gems + gemReward,
            currentLevel: Math.max(playerData.currentLevel, levelData.id + 1),
            unlockedLevels: updatedUnlocked,
            levelStars: updatedStars,
            levelHighScores: updatedHighScores
          };
          saveManager.savePlayerData(updatedPlayer);
          onUpdatePlayerData(updatedPlayer);
        }
      }

      // 6. Refill tray if all 3 pieces used
      let finalTray = nextTray;
      if (nextTray.every((p) => p === null)) {
        finalTray = pieceEngineRef.current.generatePieceTrio(true);
        audioManager.playSpawnNewPieces();
      }
      setTrayPieces(finalTray);

      // 7. Check Game Over
      let gameOver = false;
      if (!levelWon) {
        if (mode === GameMode.ADVENTURE && nextMoves <= 0) {
          gameOver = true;
        } else if (gameOverEngineRef.current.isGameOver(finalTray)) {
          gameOver = true;
        }
      }

      if (gameOver) {
        setIsGameOver(true);
        audioManager.playGameOver();
        hapticManager.strong();

        if (mode === GameMode.CLASSIC && newScore > playerData.classicHighScore) {
          const updatedPlayer: PlayerData = {
            ...playerData,
            classicHighScore: newScore
          };
          saveManager.savePlayerData(updatedPlayer);
          onUpdatePlayerData(updatedPlayer);
        }
      }

      // Update board view
      setBoard(boardEngineRef.current.getBoard());
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    activeDraggingPiece,
    dragSlotIndex,
    previewRow,
    previewCol,
    isPlacementValid,
    trayPieces,
    score,
    highScore,
    movesLeft,
    mode,
    levelData,
    playerData,
    audioManager,
    hapticManager,
    saveManager,
    onUpdatePlayerData,
    updateBoardHover
  ]);

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col justify-between p-3 select-none touch-none overflow-hidden max-w-md mx-auto"
      style={{
        background: currentSkin.backgroundGradient
      }}
    >
      {/* 1. Top HUD */}
      <SmoziTopHud
        gameMode={mode}
        score={score}
        highScore={highScore}
        levelNumber={currentLevelId}
        objective={levelData?.objective}
        movesLeft={movesLeft}
        isNewHighScore={isNewHighScore}
        onPauseClick={() => setIsPaused(true)}
      />

      {/* 2. 8x8 Board Chassis */}
      <div className="w-full flex-1 flex items-center justify-center my-auto">
        <SmoziBoardView
          board={board}
          previewPiece={activeDraggingPiece}
          previewRow={previewRow}
          previewCol={previewCol}
          isPlacementValid={isPlacementValid}
          clearingCells={clearingCells}
          skinTheme={currentSkin}
          boardRef={boardRef}
        />
      </div>

      {/* 3. Piece Tray */}
      <SmoziTrayView
        pieces={trayPieces}
        activeDraggingPieceId={activeDraggingPiece?.id || null}
        onPieceDragStart={handlePieceDragStart}
      />

      {/* Full-screen top-level Dragging Piece Overlay */}
      {activeDraggingPiece && dragPos && boardRef.current && (
        <div
          className="fixed pointer-events-none z-50 transition-none"
          style={{
            left: dragPos.x,
            top: dragPos.y - (boardRef.current.getBoundingClientRect().width / 8) * 1.5,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Finger touch indicator dot */}
          <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/40 shadow-md pointer-events-none" />

          <SmoziPieceView
            piece={activeDraggingPiece}
            blockSize={boardRef.current.getBoundingClientRect().width / 8}
            isDragging={true}
            isDenied={!isPlacementValid && previewRow !== null && previewCol !== null}
          />
        </div>
      )}

      {/* Feedback Particle & Combo Overlay */}
      <ParticleOverlay
        triggerEffect={triggerEffect}
        feedbackText={feedbackText}
        scoreIncrement={scoreIncrement}
        isNewHighScore={isNewHighScore}
        comboPercent={comboPercent}
      />

      {/* Modals & Dialogs */}
      {isPaused && (
        <PauseDialog
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            initGame(currentLevelId);
          }}
          onSettings={() => setShowSettings(true)}
          onHome={onNavigateHome}
          onDismiss={() => setIsPaused(false)}
        />
      )}

      {showSettings && (
        <SettingsDialog
          playerData={playerData}
          onToggleSound={(enabled) => {
            audioManager.isSoundEnabled = enabled;
            const updated = { ...playerData, soundEnabled: enabled };
            saveManager.savePlayerData(updated);
            onUpdatePlayerData(updated);
          }}
          onToggleMusic={(enabled) => {
            audioManager.isMusicEnabled = enabled;
            const updated = { ...playerData, musicEnabled: enabled };
            saveManager.savePlayerData(updated);
            onUpdatePlayerData(updated);
          }}
          onToggleVibration={(enabled) => {
            hapticManager.isEnabled = enabled;
            const updated = { ...playerData, vibrationEnabled: enabled };
            saveManager.savePlayerData(updated);
            onUpdatePlayerData(updated);
          }}
          onSelectTheme={(themeId) => {
            const updated = { ...playerData, selectedTheme: themeId };
            saveManager.savePlayerData(updated);
            onUpdatePlayerData(updated);
          }}
          onDismiss={() => setShowSettings(false)}
        />
      )}

      {isLevelComplete && (
        <LevelCompleteDialog
          score={score}
          stars={earnedStars}
          coinsEarned={coinsEarned}
          gemsEarned={gemsEarned}
          onNextLevel={() => {
            setIsLevelComplete(false);
            const nextLvl = currentLevelId + 1;
            if (nextLvl <= 50) {
              setCurrentLevelId(nextLvl);
              initGame(nextLvl);
            } else {
              onNavigateHome();
            }
          }}
          onReplay={() => {
            setIsLevelComplete(false);
            initGame(currentLevelId);
          }}
          onHome={onNavigateHome}
        />
      )}

      {isGameOver && (
        <GameOverDialog
          score={score}
          bestScore={highScore}
          isAdventure={mode === GameMode.ADVENTURE}
          onRetry={() => {
            setIsGameOver(false);
            initGame(currentLevelId);
          }}
          onHome={onNavigateHome}
        />
      )}
    </div>
  );
};
