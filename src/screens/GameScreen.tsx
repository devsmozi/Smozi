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
import { getDailyChallengeStages, DailyStageConfig } from '../data/DailyChallengeData.ts';
import { SmoziTopHud } from '../components/SmoziTopHud.tsx';
import { SmoziBoardView } from '../components/SmoziBoardView.tsx';
import { SmoziTrayView } from '../components/SmoziTrayView.tsx';
import { SmoziPieceView } from '../components/SmoziPieceView.tsx';
import { ParticleOverlay } from '../components/ParticleOverlay.tsx';
import { PauseDialog } from '../components/PauseDialog.tsx';
import { LevelCompleteDialog } from '../components/LevelCompleteDialog.tsx';
import { GameOverDialog } from '../components/GameOverDialog.tsx';
import { SettingsDialog } from '../components/SettingsDialog.tsx';
import { ClassicMilestoneDialog } from '../components/ClassicMilestoneDialog.tsx';
import { DailyChallengeVictoryDialog } from '../components/DailyChallengeVictoryDialog.tsx';
import { BoosterBar, ActiveBoosterMode } from '../components/BoosterBar.tsx';
import { HintEngine, HintMove } from '../game/HintEngine.ts';
import { BombExplosionEffect } from '../components/SmoziBoardView.tsx';
import { CoinFlyAnimation, CoinFlightEvent } from '../components/CoinFlyAnimation.tsx';

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
  const [remainingTargetsByType, setRemainingTargetsByType] = useState<Record<string, number>>({});
  const [totalRemainingTargets, setTotalRemainingTargets] = useState<number>(0);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [clearingCells, setClearingCells] = useState<[number, number][]>([]);

  // Daily Challenge State (3 Stages: Simple -> Medium -> Hard)
  const [dailyStageIndex, setDailyStageIndex] = useState<number>(0);
  const [dailyStages] = useState<DailyStageConfig[]>(() => getDailyChallengeStages());
  const [showDailyVictory, setShowDailyVictory] = useState<boolean>(false);

  // Classic Mode Tier Progression & Milestones
  const [classicTier, setClassicTier] = useState<number>(1);
  const [unlockedClassicTiers, setUnlockedClassicTiers] = useState<Set<number>>(new Set([1]));
  const [classicMilestone, setClassicMilestone] = useState<{
    tier: number;
    title: string;
    tierName: string;
    score: number;
    coins: number;
    appreciation: string;
  } | null>(null);

  // Feedback FX
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [comboPercent, setComboPercent] = useState<string | null>(null);
  const [scoreIncrement, setScoreIncrement] = useState<number>(0);
  const [triggerEffect, setTriggerEffect] = useState<number>(0);

  // Dialogs State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [outOfMoves, setOutOfMoves] = useState<boolean>(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [gemsEarned, setGemsEarned] = useState<number>(0);

  // Dragging & Interaction State
  const [activeDraggingPiece, setActiveDraggingPiece] = useState<Piece | null>(null);
  const [dragSlotIndex, setDragSlotIndex] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [previewRow, setPreviewRow] = useState<number | null>(null);
  const [previewCol, setPreviewCol] = useState<number | null>(null);
  const [isPlacementValid, setIsPlacementValid] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Dual-Input: Tap-to-Select & Tap-to-Place State
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Play Store Power-Ups & Booster State
  const [activeBooster, setActiveBooster] = useState<ActiveBoosterMode>('NONE');
  const [hintMove, setHintMove] = useState<HintMove | null>(null);

  // Theme
  const currentSkin = getSkinTheme(playerData.selectedTheme);

  // Classic tier info helper
  const getClassicTierInfo = (currentScore: number) => {
    if (currentScore < 500) {
      return {
        tier: 1,
        name: 'Tier 1',
        difficulty: 1,
        rewardCoins: 50,
        appreciation: 'Splendid Start! You navigated the blocks with great finesse! Keep building!'
      };
    }
    if (currentScore < 1200) {
      return {
        tier: 2,
        name: 'Tier 2',
        difficulty: 2,
        rewardCoins: 100,
        appreciation: 'Incredible Tactics! Your spatial vision is sharp as a tack!'
      };
    }
    if (currentScore < 2500) {
      return {
        tier: 3,
        name: 'Tier 3',
        difficulty: 3,
        rewardCoins: 150,
        appreciation: 'Masterful Board Control! You cleared lines like a true puzzle maestro!'
      };
    }
    if (currentScore < 4500) {
      return {
        tier: 4,
        name: 'Tier 4',
        difficulty: 4,
        rewardCoins: 250,
        appreciation: 'PUZZLE VIRTUOSO! Outstanding intellect and spatial control!'
      };
    }
    return {
      tier: 5,
      name: 'Tier 5',
      difficulty: 5,
      rewardCoins: 500,
      appreciation: 'GRANDMASTER ASCENT! Exceptional genius! You dominate the board at the highest peak!'
    };
  };

  // Get current active difficulty level
  const getCurrentDifficulty = useCallback(
    (currentScore: number = score) => {
      if (mode === GameMode.DAILY_CHALLENGE) {
        if (dailyStageIndex === 0) return 1;
        if (dailyStageIndex === 1) return 2;
        return 4;
      }
      if (mode === GameMode.CLASSIC) {
        return getClassicTierInfo(currentScore).difficulty;
      }
      if (levelData) {
        if (levelData.difficulty === 'Easy' || levelData.difficulty === 'Simple') return 1;
        if (levelData.difficulty === 'Medium') return 2;
        if (levelData.difficulty === 'Hard') return 3;
        return 4;
      }
      return 1;
    },
    [mode, dailyStageIndex, score, levelData]
  );

  // Initialize Game Session with Fairness Safeguard
  const initGame = useCallback(
    (lvlId: number = currentLevelId, stageIdx: number = dailyStageIndex) => {
      boardEngineRef.current.resetBoard();
      comboEngineRef.current.reset();
      setClearingCells([]);
      setHintMove(null);
      setIsGameOver(false);
      setOutOfMoves(false);
      setIsLevelComplete(false);
      setShowDailyVictory(false);
      setClassicMilestone(null);
      setIsPaused(false);
      setScore(0);
      setIsNewHighScore(false);
      setFeedbackText(null);
      setComboPercent(null);
      setScoreIncrement(0);
      setSelectedSlotIndex(null);

      const checkCanFit = (p: Piece) => gameOverEngineRef.current.canPieceFitAnywhere(p);

      if (mode === GameMode.DAILY_CHALLENGE) {
        const stage = dailyStages[stageIdx] || dailyStages[0];
        setLevelData({
          ...stage,
          objective: { ...stage.objective, currentAmount: 0 }
        });
        boardEngineRef.current.loadInitialBoard(stage.initialBoard);
        setMovesLeft(stage.moveLimit);
        setHighScore(0);

        const diff = stageIdx === 0 ? 1 : stageIdx === 1 ? 2 : 4;
        const newTrio = pieceEngineRef.current.generatePieceTrio(true, diff, checkCanFit);
        setTrayPieces(newTrio);
      } else if (mode === GameMode.ADVENTURE) {
        const lvl = getLevel(lvlId);
        setLevelData(lvl);
        boardEngineRef.current.loadInitialBoard(lvl.initialBoard, lvl.boardSize || 8);
        if (lvl.targets && lvl.targets.length > 0) {
          boardEngineRef.current.loadTargets(lvl.targets);
        }
        const targetMap: Record<string, number> = {};
        (lvl.targets || []).forEach((t) => {
          targetMap[t.type] = (targetMap[t.type] || 0) + 1;
        });
        setRemainingTargetsByType(targetMap);
        setTotalRemainingTargets(lvl.targets?.length || 0);
        setHighScore(playerData.levelHighScores[lvlId] || 0);

        const newTrio = pieceEngineRef.current.generateBoardAwareTrio(
          boardEngineRef.current,
          2,
          false
        );
        setTrayPieces(newTrio);
      } else {
        setLevelData(null);
        setHighScore(playerData.classicHighScore);
        setClassicTier(1);
        setUnlockedClassicTiers(new Set([1]));

        const newTrio = pieceEngineRef.current.generatePieceTrio(true, 1, checkCanFit);
        setTrayPieces(newTrio);
      }

      setBoard(boardEngineRef.current.getBoard());
    },
    [mode, currentLevelId, dailyStageIndex, dailyStages, playerData.classicHighScore, playerData.levelHighScores]
  );

  useEffect(() => {
    initGame(initialLevelId, dailyStageIndex);
  }, [mode, initialLevelId, dailyStageIndex, initGame]);

  // Screen Wake Lock API to prevent phone display sleeping during active puzzle rounds
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !isGameOver && !isPaused) {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        }
      } catch {}
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [isGameOver, isPaused]);

  // Compute piece playability status in the tray
  const piecePlayableStatus = trayPieces.map((p) =>
    p !== null ? gameOverEngineRef.current.canPieceFitAnywhere(p) : false
  );

  // Compute if board is dangerously crowded (>= 46 out of 64 cells)
  const occupiedCount = board.reduce(
    (total, row) => total + row.filter((c) => c.isOccupied).length,
    0
  );
  const isBoardCrowded = occupiedCount >= 46;

  // Unified Piece Placement Execution Engine
  const executePlacement = useCallback(
    (piece: Piece, slotIdx: number, targetRow: number, targetCol: number) => {
      // 1. Calculate covered cells and place piece
      const matrix = piece.shape.matrix;
      const pieceCoveredCells: [number, number][] = [];
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            pieceCoveredCells.push([targetRow + r, targetCol + c]);
          }
        }
      }

      boardEngineRef.current.placePiece(piece, targetRow, targetCol);
      audioManager.playPiecePlacement();
      hapticManager.medium();

      // 2. Consume from tray
      const nextTray = [...trayPieces];
      nextTray[slotIdx] = null;
      setSelectedSlotIndex(null);
      setHintMove(null);

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

      // Audio & feedback FX
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

      // Check Classic Milestone
      if (mode === GameMode.CLASSIC) {
        const tierInfo = getClassicTierInfo(newScore);
        if (tierInfo.tier > classicTier && !unlockedClassicTiers.has(tierInfo.tier)) {
          setClassicTier(tierInfo.tier);
          setUnlockedClassicTiers((prev) => new Set([...prev, tierInfo.tier]));
          setClassicMilestone({
            tier: tierInfo.tier,
            title: `⭐ LEVEL UP: TIER ${tierInfo.tier} ⭐`,
            tierName: tierInfo.name,
            score: newScore,
            coins: tierInfo.rewardCoins,
            appreciation: tierInfo.appreciation
          });

          const updated = {
            ...playerData,
            coins: playerData.coins + tierInfo.rewardCoins
          };
          saveManager.savePlayerData(updated);
          onUpdatePlayerData(updated);

          audioManager.playLevelComplete();
          hapticManager.celebration();
        }
      }

      // 5. Check Moves (Daily Challenge Only - Adventure Mode has NO move limits)
      let nextMoves = movesLeft;
      if (mode === GameMode.DAILY_CHALLENGE) {
        nextMoves = Math.max(0, movesLeft - 1);
        setMovesLeft(nextMoves);
      }

      let wonMatch = false;

      // Check Daily Challenge Stage Objective
      if (mode === GameMode.DAILY_CHALLENGE && levelData && levelData.objective) {
        const obj = { ...levelData.objective };
        if (obj.type === ObjectiveType.SCORE) {
          obj.currentAmount = newScore;
        } else if (obj.type === ObjectiveType.CLEAR_COLOR) {
          if (piece.color === obj.targetColor) {
            obj.currentAmount = (obj.currentAmount || 0) + piece.blockCount;
          }
        } else if (obj.type === ObjectiveType.COLLECT_GEMS) {
          const totalGems = Object.values(clearResult.gemsCollected).reduce(
            (sum, val) => sum + (val || 0),
            0
          );
          obj.currentAmount = (obj.currentAmount || 0) + totalGems;
        } else if (obj.type === ObjectiveType.CLEAR_SPECIAL) {
          const matched = clearResult.specialEffectsTriggered.filter(
            (e) => e.type === obj.targetSpecial
          ).length;
          obj.currentAmount = (obj.currentAmount || 0) + matched;
        }

        setLevelData({ ...levelData, objective: obj });

        if (obj.currentAmount !== undefined && obj.targetAmount !== undefined && obj.currentAmount >= obj.targetAmount) {
          wonMatch = true;
          setShowDailyVictory(true);
          audioManager.playLevelComplete();
          hapticManager.celebration();

          const stageRewardCoins = levelData.rewardCoins;
          const stageRewardGems = levelData.rewardGems;
          setCoinsEarned(stageRewardCoins);
          setGemsEarned(stageRewardGems);

          const updated: PlayerData = {
            ...playerData,
            coins: playerData.coins + stageRewardCoins,
            gems: playerData.gems + stageRewardGems,
            dailyStreak: dailyStageIndex === 2 ? playerData.dailyStreak + 1 : playerData.dailyStreak
          };
          saveManager.savePlayerData(updated);
          onUpdatePlayerData(updated);
        }
      }

      // Check Adventure Target Collection Objective (Bubble Block style)
      if (mode === GameMode.ADVENTURE && levelData) {
        const newlyCollected: string[] = [];
        for (const [r, c] of pieceCoveredCells) {
          const cell = boardEngineRef.current.getCell(r, c);
          if (cell && cell.target && !cell.target.collected) {
            cell.target.collected = true;
            newlyCollected.push(cell.target.type);
          }
        }

        if (newlyCollected.length > 0) {
          audioManager.playGemCollect();
          hapticManager.celebration();

          setRemainingTargetsByType((prev) => {
            const nextMap = { ...prev };
            newlyCollected.forEach((type) => {
              if (nextMap[type] !== undefined) {
                nextMap[type] = Math.max(0, nextMap[type] - 1);
              }
            });
            return nextMap;
          });

          const nextRemaining = Math.max(0, totalRemainingTargets - newlyCollected.length);
          setTotalRemainingTargets(nextRemaining);

          // Level completes ONLY when all targets are collected
          if (nextRemaining === 0 && !isLevelComplete) {
            wonMatch = true;
            const starsCount =
              newScore >= levelData.starThresholds[2]
                ? 3
                : newScore >= levelData.starThresholds[1]
                ? 2
                : 1;
            const coinReward = levelData.rewardCoins;
            const gemReward = levelData.rewardGems;

            setEarnedStars(starsCount);
            setCoinsEarned(coinReward);
            setGemsEarned(gemReward);
            setIsLevelComplete(true);
            audioManager.playLevelComplete();
            hapticManager.celebration();

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
      }

      // 6. Refill tray if all 3 pieces used (Level-Aware & Board-Aware for Adventure Mode)
      let finalTray = nextTray;
      if (nextTray.every((p) => p === null)) {
        if (mode === GameMode.ADVENTURE) {
          finalTray = pieceEngineRef.current.generateBoardAwareTrio(
            boardEngineRef.current,
            getCurrentDifficulty(newScore),
            false
          );
        } else {
          const diff = getCurrentDifficulty(newScore);
          const checkCanFit = (p: Piece) => gameOverEngineRef.current.canPieceFitAnywhere(p);
          finalTray = pieceEngineRef.current.generatePieceTrio(true, diff, checkCanFit);
        }
        audioManager.playSpawnNewPieces();
      }
      setTrayPieces(finalTray);

      // 7. Check Game Over (Adventure Mode NEVER fails due to moves)
      let gameOver = false;
      let isOutOfMoves = false;

      if (!wonMatch) {
        if (mode === GameMode.DAILY_CHALLENGE && nextMoves <= 0) {
          gameOver = true;
          isOutOfMoves = true;
        } else if (gameOverEngineRef.current.isGameOver(finalTray)) {
          gameOver = true;
          isOutOfMoves = false;
        }
      }

      if (gameOver) {
        setIsGameOver(true);
        setOutOfMoves(isOutOfMoves);
        audioManager.playGameOver();
        hapticManager.strong();

        if (mode === GameMode.CLASSIC) {
          const runCoins = Math.max(10, Math.floor(newScore / 15));
          const updatedPlayer: PlayerData = {
            ...playerData,
            coins: playerData.coins + runCoins,
            classicHighScore: Math.max(playerData.classicHighScore, newScore)
          };
          saveManager.savePlayerData(updatedPlayer);
          onUpdatePlayerData(updatedPlayer);
        }
      }

      // Update board view
      setBoard(boardEngineRef.current.getBoard());
    },
    [
      trayPieces,
      score,
      highScore,
      movesLeft,
      mode,
      levelData,
      playerData,
      classicTier,
      unlockedClassicTiers,
      dailyStageIndex,
      audioManager,
      hapticManager,
      saveManager,
      onUpdatePlayerData,
      getCurrentDifficulty
    ]
  );

  // Drag Pointer Tracking
  const updateBoardHover = useCallback(
    (clientX: number, clientY: number, piece: Piece, isTouch: boolean) => {
      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();

      const cellSize = boardRect.width / BoardEngine.BOARD_SIZE;
      const pieceCenterX = piece.shape.width * cellSize * 0.5;
      const pieceCenterY = piece.shape.height * cellSize * 0.5;

      // Finger lift offset for touch so piece floats above thumb; centered for mouse
      const fingerLiftY = isTouch ? cellSize * 1.5 : cellSize * 0.3;

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
    setSelectedSlotIndex(slotIndex);
    setDragPos({ x: clientX, y: clientY });
    audioManager.playPiecePickup();
    hapticManager.light();
    updateBoardHover(clientX, clientY, piece, isTouchDevice);
  };

  // Dual-Input: Tap to Select piece in Tray
  const handleTrayPieceClick = (slotIndex: number) => {
    const piece = trayPieces[slotIndex];
    if (!piece) return;

    if (selectedSlotIndex === slotIndex) {
      setSelectedSlotIndex(null);
      setPreviewRow(null);
      setPreviewCol(null);
    } else {
      setSelectedSlotIndex(slotIndex);
      audioManager.playPiecePickup();
      hapticManager.light();
    }
  };

  // Dual-Input & Booster Board Cell Click Handler
  const handleBoardCellClick = (row: number, col: number) => {
    // 1. Hammer Booster execution
    if (activeBooster === 'HAMMER') {
      if (playerData.coins < 50) return;
      const updated = { ...playerData, coins: playerData.coins - 50 };
      saveManager.savePlayerData(updated);
      onUpdatePlayerData(updated);

      boardEngineRef.current.clearSingleCell(row, col);
      setBoard(boardEngineRef.current.getBoard());
      audioManager.playHammerSmash();
      hapticManager.strong();
      setActiveBooster('NONE');
      return;
    }

    // 2. Bomb Booster execution (3x3 explosion)
    if (activeBooster === 'BOMB') {
      if (playerData.coins < 80) return;
      const updated = { ...playerData, coins: playerData.coins - 80 };
      saveManager.savePlayerData(updated);
      onUpdatePlayerData(updated);

      const cleared = boardEngineRef.current.clearArea(row, col, 1);
      setClearingCells(cleared);
      setTimeout(() => setClearingCells([]), 350);
      setBoard(boardEngineRef.current.getBoard());
      audioManager.playBombBlast();
      hapticManager.explosion();
      setActiveBooster('NONE');
      return;
    }

    // 3. Normal piece tap-to-place
    if (selectedSlotIndex === null) return;
    const piece = trayPieces[selectedSlotIndex];
    if (!piece) return;

    const check = placementEngineRef.current.calculatePlacement(piece, row, col);
    if (check.isValid) {
      executePlacement(piece, selectedSlotIndex, row, col);
      setPreviewRow(null);
      setPreviewCol(null);
    } else {
      audioManager.playInvalidPlacement();
      hapticManager.invalid();
    }
  };

  // Shuffle Booster execution (reroll tray pieces)
  const handleTriggerShuffle = () => {
    if (playerData.coins < 35) return;
    const updated = { ...playerData, coins: playerData.coins - 35 };
    saveManager.savePlayerData(updated);
    onUpdatePlayerData(updated);

    audioManager.playShuffleSwoosh();
    hapticManager.medium();
    const diff = getCurrentDifficulty(score);
    const checkCanFit = (p: Piece) => gameOverEngineRef.current.canPieceFitAnywhere(p);
    const newTrio = pieceEngineRef.current.generatePieceTrio(true, diff, checkCanFit);
    setTrayPieces(newTrio);
    setSelectedSlotIndex(null);
    setHintMove(null);
  };

  // Hint Booster execution (highlight optimal placement)
  const handleTriggerHint = () => {
    if (playerData.coins < 15) return;
    if (hintMove) {
      setHintMove(null);
      return;
    }
    const best = HintEngine.findBestMove(boardEngineRef.current, trayPieces);
    if (best) {
      const updated = { ...playerData, coins: playerData.coins - 15 };
      saveManager.savePlayerData(updated);
      onUpdatePlayerData(updated);
      setHintMove(best);
      audioManager.playGemCollect();
      hapticManager.light();
    }
  };

  const handleBoardCellHover = (row: number, col: number) => {
    if (selectedSlotIndex === null || activeDraggingPiece) return;
    const piece = trayPieces[selectedSlotIndex];
    if (!piece) return;

    setPreviewRow(row);
    setPreviewCol(col);
    const check = placementEngineRef.current.calculatePlacement(piece, row, col);
    setIsPlacementValid(check.isValid);
  };

  // Keyboard Shortcuts (Desktop / Accessibility UX)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      } else if (e.key === '1') {
        handleTrayPieceClick(0);
      } else if (e.key === '2') {
        handleTrayPieceClick(1);
      } else if (e.key === '3') {
        handleTrayPieceClick(2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trayPieces, selectedSlotIndex]);

  // Pointer drag listener
  useEffect(() => {
    if (!activeDraggingPiece) return;

    const handlePointerMove = (e: PointerEvent) => {
      const isTouch = e.pointerType === 'touch';
      setIsTouchDevice(isTouch);
      setDragPos({ x: e.clientX, y: e.clientY });
      updateBoardHover(e.clientX, e.clientY, activeDraggingPiece, isTouch);
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

      executePlacement(piece, slotIndex, r, c);
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
    isTouchDevice,
    updateBoardHover,
    executePlacement,
    audioManager,
    hapticManager
  ]);

  const activeSelectedPiece = selectedSlotIndex !== null ? trayPieces[selectedSlotIndex] : null;

  return (
    <div
      className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-start p-2 sm:p-3 select-none touch-none overflow-hidden max-w-lg mx-auto"
      style={{
        background: currentSkin.backgroundGradient
      }}
    >
      {/* 1. Responsive Top HUD */}
      <SmoziTopHud
        gameMode={mode}
        score={score}
        highScore={highScore}
        levelNumber={currentLevelId}
        levelTierLabel={mode === GameMode.CLASSIC ? getClassicTierInfo(score).name : undefined}
        stageNumber={mode === GameMode.DAILY_CHALLENGE ? dailyStageIndex + 1 : undefined}
        objective={levelData?.objective}
        movesLeft={movesLeft}
        remainingTargetsByType={remainingTargetsByType}
        totalRemainingTargets={totalRemainingTargets}
        isNewHighScore={isNewHighScore}
        onPauseClick={() => setIsPaused(true)}
      />

      {/* 2. Responsive 8x8 Board Chassis with Danger Glow */}
      <div className="w-full flex items-center justify-center my-1 sm:my-2 px-1 shrink-0">
        <SmoziBoardView
          board={board}
          previewPiece={activeDraggingPiece || activeSelectedPiece}
          previewRow={previewRow}
          previewCol={previewCol}
          isPlacementValid={isPlacementValid}
          clearingCells={clearingCells}
          skinTheme={currentSkin}
          boardRef={boardRef}
          isCrowded={isBoardCrowded}
          hintCells={hintMove?.occupiedCells || []}
          onCellClick={handleBoardCellClick}
          onCellHover={handleBoardCellHover}
        />
      </div>

      {/* Play Store Power-Ups & Boosters - placed in the space directly under the board */}
      <div className="w-full px-2 py-1 shrink-0">
        <BoosterBar
          coins={playerData.coins}
          activeBooster={activeBooster}
          onSelectBooster={setActiveBooster}
          onTriggerShuffle={handleTriggerShuffle}
          onTriggerHint={handleTriggerHint}
          isHintActive={!!hintMove}
        />
      </div>

      {/* 3. Responsive Piece Tray - placed under board & boosters for ergonomic reach */}
      <div className="w-full px-1 py-1 shrink-0">
        <SmoziTrayView
          pieces={trayPieces}
          activeDraggingPieceId={activeDraggingPiece?.id || null}
          selectedSlotIndex={selectedSlotIndex}
          piecePlayableStatus={piecePlayableStatus}
          onPieceDragStart={handlePieceDragStart}
          onPieceClick={handleTrayPieceClick}
        />
      </div>

      {/* Empty space under blocks selection as requested */}
      <div className="w-full flex-1 min-h-2 sm:min-h-6 pointer-events-none" />

      {/* Full-screen top-level Dragging Piece Overlay */}
      {activeDraggingPiece && dragPos && boardRef.current && (
        <div
          className="fixed pointer-events-none z-50 transition-none"
          style={{
            left: dragPos.x,
            top:
              dragPos.y -
              (boardRef.current.getBoundingClientRect().width / 8) * (isTouchDevice ? 1.5 : 0.3),
            transform: 'translate(-50%, -50%)'
          }}
        >
          {isTouchDevice && (
            <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/40 shadow-md pointer-events-none" />
          )}

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
            initGame(currentLevelId, dailyStageIndex);
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

      {/* Classic Mode Level Up / Milestone Appreciation Dialog */}
      {classicMilestone && (
        <ClassicMilestoneDialog
          milestoneTitle={classicMilestone.title}
          levelTier={classicMilestone.tier}
          levelTierName={classicMilestone.tierName}
          score={classicMilestone.score}
          bonusCoins={classicMilestone.coins}
          appreciationMessage={classicMilestone.appreciation}
          onContinue={() => setClassicMilestone(null)}
        />
      )}

      {/* Daily Challenge Winning & Stage Progression Appreciation Dialog */}
      {showDailyVictory && (
        <DailyChallengeVictoryDialog
          stageNumber={dailyStageIndex + 1}
          isAllCompleted={dailyStageIndex >= 2}
          score={score}
          coinsEarned={coinsEarned}
          gemsEarned={gemsEarned}
          appreciationQuote={dailyStages[dailyStageIndex]?.appreciationQuote || 'Magnificent job!'}
          onNextStage={() => {
            const nextStage = dailyStageIndex + 1;
            setDailyStageIndex(nextStage);
            setShowDailyVictory(false);
            initGame(currentLevelId, nextStage);
          }}
          onFinishDaily={() => {
            setShowDailyVictory(false);
            onNavigateHome();
          }}
        />
      )}

      {/* Adventure Level Complete Dialog */}
      {isLevelComplete && mode === GameMode.ADVENTURE && (
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

      {/* Distinct Game Over Dialog for Classic, Daily Challenge, and Adventure */}
      {isGameOver && (
        <GameOverDialog
          gameMode={mode}
          score={score}
          bestScore={highScore}
          levelTierLabel={mode === GameMode.CLASSIC ? getClassicTierInfo(score).name : undefined}
          stageNumber={mode === GameMode.DAILY_CHALLENGE ? dailyStageIndex + 1 : undefined}
          outOfMoves={outOfMoves}
          onRetry={() => {
            setIsGameOver(false);
            initGame(currentLevelId, dailyStageIndex);
          }}
          onHome={onNavigateHome}
        />
      )}
    </div>
  );
};
