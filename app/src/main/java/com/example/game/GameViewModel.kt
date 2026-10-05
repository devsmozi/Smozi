package com.example.game

import android.app.Application
import androidx.compose.ui.geometry.Offset
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.LevelsData
import com.example.models.BlockColor
import com.example.models.CellState
import com.example.models.GameMode
import com.example.models.LevelData
import com.example.models.ObjectiveType
import com.example.models.Piece
import com.example.models.PlayerData
import com.example.models.SpecialBlockType
import com.example.systems.AudioManager
import com.example.systems.HapticManager
import com.example.systems.SaveManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class GameUiState(
    val gameMode: GameMode = GameMode.CLASSIC,
    val levelData: LevelData? = null,
    val score: Int = 0,
    val highScore: Int = 0,
    val movesLeft: Int = 20,
    val currentCombo: Int = 0,
    val board: List<List<CellState>> = emptyList(),
    val trayPieces: List<Piece?> = listOf(null, null, null),
    val clearingCells: Set<Pair<Int, Int>> = emptySet(),
    val feedbackText: String? = null,
    val effectTrigger: Long = 0L,
    val scoreIncrement: Int = 0,
    val comboPercent: String? = null,
    val isNewHighScore: Boolean = false,
    val isPaused: Boolean = false,
    val isGameOver: Boolean = false,
    val isLevelComplete: Boolean = false,
    val earnedStars: Int = 0,
    val coinsEarned: Int = 0,
    val gemsEarned: Int = 0
)

class GameViewModel(application: Application) : AndroidViewModel(application) {

    val audioManager = AudioManager(application.applicationContext)
    val hapticManager = HapticManager(application.applicationContext)
    val saveManager = SaveManager(application.applicationContext)

    private val boardEngine = BoardEngine()
    private val pieceEngine = PieceEngine()
    private val placementEngine = PlacementEngine(boardEngine)
    private val lineClearEngine = LineClearEngine(boardEngine)
    private val scoreEngine = ScoreEngine()
    private val comboEngine = ComboEngine()
    private val gameOverEngine = GameOverEngine(boardEngine)

    private val _playerData = MutableStateFlow(saveManager.loadPlayerData())
    val playerData: StateFlow<PlayerData> = _playerData.asStateFlow()

    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    // Drag & Placement Preview State
    var draggedPiece: Piece? = null
        private set
    var previewRow: Int? = null
        private set
    var previewCol: Int? = null
        private set
    var isPlacementValid: Boolean = false
        private set

    init {
        // Sync system settings
        val data = _playerData.value
        audioManager.isSoundEnabled = data.soundEnabled
        audioManager.isMusicEnabled = data.musicEnabled
        hapticManager.isEnabled = data.vibrationEnabled
    }

    fun startClassicGame() {
        boardEngine.resetBoard()
        comboEngine.reset()
        val newPieces = pieceEngine.generatePieceTrio(includeSpecials = true)

        _uiState.value = GameUiState(
            gameMode = GameMode.CLASSIC,
            levelData = null,
            score = 0,
            highScore = _playerData.value.classicHighScore,
            board = boardEngine.getBoard(),
            trayPieces = newPieces
        )
    }

    fun startAdventureLevel(levelId: Int) {
        val level = LevelsData.getLevel(levelId)
        boardEngine.loadInitialBoard(level.initialBoard)
        comboEngine.reset()
        val newPieces = pieceEngine.generatePieceTrio(includeSpecials = true)

        _uiState.value = GameUiState(
            gameMode = GameMode.ADVENTURE,
            levelData = level.copy(
                objective = level.objective.copy(currentAmount = 0)
            ),
            score = 0,
            highScore = _playerData.value.levelHighScores[levelId] ?: 0,
            movesLeft = level.moveLimit,
            board = boardEngine.getBoard(),
            trayPieces = newPieces
        )
    }

    fun startDailyChallenge() {
        boardEngine.resetBoard()
        comboEngine.reset()
        val newPieces = pieceEngine.generatePieceTrio(includeSpecials = true)

        _uiState.value = GameUiState(
            gameMode = GameMode.DAILY_CHALLENGE,
            levelData = null,
            score = 0,
            highScore = _playerData.value.classicHighScore,
            board = boardEngine.getBoard(),
            trayPieces = newPieces
        )
    }

    fun onPieceDragStart(piece: Piece) {
        draggedPiece = piece
        previewRow = null
        previewCol = null
        isPlacementValid = false
        audioManager.playPiecePickup()
        hapticManager.light()
    }

    fun onBoardHover(targetRow: Int, targetCol: Int) {
        val piece = draggedPiece ?: return
        previewRow = targetRow
        previewCol = targetCol

        val preview = placementEngine.calculatePlacement(piece, targetRow, targetCol)
        isPlacementValid = preview.isValid
    }

    fun onDragCancelOrOut() {
        previewRow = null
        previewCol = null
        isPlacementValid = false
    }

    fun onPieceDropped(targetRow: Int, targetCol: Int, slotIndex: Int) {
        val piece = draggedPiece
        draggedPiece = null
        previewRow = null
        previewCol = null

        if (piece == null) return

        val canPlace = boardEngine.canPlace(piece, targetRow, targetCol)
        if (!canPlace) {
            audioManager.playInvalidPlacement()
            hapticManager.invalid()
            return
        }

        // 1. Place piece on board
        boardEngine.placePiece(piece, targetRow, targetCol)
        audioManager.playPiecePlacement()
        hapticManager.medium()

        // 2. Consume from tray
        val currentTray = _uiState.value.trayPieces.toMutableList()
        val removeIndex = currentTray.indexOfFirst { it?.id == piece.id }
        if (removeIndex != -1) {
            currentTray[removeIndex] = null
        }

        // 3. Clear lines
        val clearResult = lineClearEngine.checkAndClearLines()
        val linesCleared = clearResult.linesClearedCount
        val combo = comboEngine.registerMove(linesCleared)

        // 4. Score calculation
        val breakdown = scoreEngine.calculateScore(
            blocksPlaced = piece.blockCount,
            linesCleared = linesCleared,
            comboCount = combo
        )
        val newScore = _uiState.value.score + breakdown.totalPoints

        val previousHighScore = _uiState.value.highScore
        val isNewHighScore = previousHighScore > 0 && newScore > previousHighScore && _uiState.value.score <= previousHighScore

        if (linesCleared > 0) {
            audioManager.playBubbleBurstPop(1.0f + (combo * 0.1f))
            audioManager.playLineClear(combo)
            hapticManager.strong()
            breakdown.feedbackText?.let { audioManager.speakAnnouncer(it) }
        }

        if (clearResult.gemsCollected.isNotEmpty()) {
            audioManager.playGemCollect()
        }

        // 5. Objective update for Adventure mode
        var currentMoves = _uiState.value.movesLeft
        if (_uiState.value.gameMode == GameMode.ADVENTURE) {
            currentMoves = (currentMoves - 1).coerceAtLeast(0)
        }

        val levelData = _uiState.value.levelData
        var levelComplete = false
        var earnedStars = 0
        var coinsEarned = 0
        var gemsEarned = 0

        if (levelData != null) {
            val obj = levelData.objective
            val updatedProgress = when (obj.type) {
                ObjectiveType.SCORE -> newScore
                ObjectiveType.CLEAR_COLOR -> {
                    if (piece.color == obj.targetColor) {
                        obj.currentAmount + piece.blockCount
                    } else obj.currentAmount
                }
                ObjectiveType.COLLECT_GEMS -> {
                    val collected = clearResult.gemsCollected.values.sum()
                    obj.currentAmount + collected
                }
                ObjectiveType.CLEAR_SPECIAL -> {
                    val specialCount = clearResult.specialEffectsTriggered.count { it.second == obj.targetSpecial }
                    obj.currentAmount + specialCount
                }
                ObjectiveType.CLEAR_ALL -> obj.currentAmount
            }
            obj.currentAmount = updatedProgress

            if (obj.isCompleted) {
                levelComplete = true
                earnedStars = when {
                    newScore >= levelData.starThresholds.third -> 3
                    newScore >= levelData.starThresholds.second -> 2
                    else -> 1
                }
                coinsEarned = levelData.rewardCoins
                gemsEarned = levelData.rewardGems
                audioManager.playLevelComplete()
                hapticManager.celebration()
                saveLevelWin(levelData.id, earnedStars, newScore, coinsEarned, gemsEarned)
            }
        }

        // 6. Refill tray if all 3 pieces used
        var nextTray: List<Piece?> = currentTray
        if (currentTray.all { it == null }) {
            nextTray = pieceEngine.generatePieceTrio(includeSpecials = true)
            audioManager.playSpawnNewPieces()
        }

        // 7. Check Game Over
        var gameOver = false
        if (!levelComplete) {
            if (_uiState.value.gameMode == GameMode.ADVENTURE && currentMoves <= 0) {
                gameOver = true
            } else if (gameOverEngine.isGameOver(nextTray)) {
                gameOver = true
            }
        }

        if (gameOver) {
            audioManager.playGameOver()
            hapticManager.strong()
            if (_uiState.value.gameMode == GameMode.CLASSIC && newScore > _playerData.value.classicHighScore) {
                saveClassicHighScore(newScore)
            }
        }

        // 8. Update UI State
        _uiState.value = _uiState.value.copy(
            score = newScore,
            highScore = maxOf(_uiState.value.highScore, newScore),
            movesLeft = currentMoves,
            currentCombo = combo,
            board = boardEngine.getBoard(),
            trayPieces = nextTray,
            clearingCells = clearResult.clearedCells,
            feedbackText = breakdown.feedbackText,
            scoreIncrement = if (linesCleared > 0) breakdown.totalPoints else 0,
            comboPercent = breakdown.comboPercent,
            isNewHighScore = isNewHighScore,
            effectTrigger = if (linesCleared > 0) System.currentTimeMillis() else _uiState.value.effectTrigger,
            isGameOver = gameOver,
            isLevelComplete = levelComplete,
            earnedStars = earnedStars,
            coinsEarned = coinsEarned,
            gemsEarned = gemsEarned
        )

        // Clear transient animation state
        if (clearResult.clearedCells.isNotEmpty()) {
            viewModelScope.launch {
                delay(300)
                _uiState.value = _uiState.value.copy(clearingCells = emptySet())
            }
        }
    }

    private fun saveLevelWin(levelId: Int, stars: Int, score: Int, coins: Int, gems: Int) {
        val current = _playerData.value
        val updatedUnlocked = current.unlockedLevels.toMutableSet()
        if (levelId + 1 <= 50) {
            updatedUnlocked.add(levelId + 1)
        }
        val updatedStars = current.levelStars.toMutableMap()
        val oldStars = updatedStars[levelId] ?: 0
        if (stars > oldStars) {
            updatedStars[levelId] = stars
        }
        val updatedScores = current.levelHighScores.toMutableMap()
        val oldScore = updatedScores[levelId] ?: 0
        if (score > oldScore) {
            updatedScores[levelId] = score
        }

        val updatedData = current.copy(
            coins = current.coins + coins,
            gems = current.gems + gems,
            currentLevel = maxOf(current.currentLevel, (levelId + 1).coerceAtMost(96)),
            unlockedLevels = updatedUnlocked,
            levelStars = updatedStars,
            levelHighScores = updatedScores
        )
        _playerData.value = updatedData
        saveManager.savePlayerData(updatedData)
    }

    private fun saveClassicHighScore(score: Int) {
        val updated = _playerData.value.copy(classicHighScore = score)
        _playerData.value = updated
        saveManager.savePlayerData(updated)
    }

    fun claimDailyReward(coins: Int, gems: Int) {
        val current = _playerData.value
        val nextStreak = if (current.dailyStreak >= 7) 1 else current.dailyStreak + 1
        val updated = current.copy(
            coins = current.coins + coins,
            gems = current.gems + gems,
            dailyStreak = nextStreak,
            lastDailyClaimTimestamp = System.currentTimeMillis()
        )
        _playerData.value = updated
        saveManager.savePlayerData(updated)
        audioManager.playGemCollect()
        hapticManager.celebration()
    }

    fun setSoundEnabled(enabled: Boolean) {
        audioManager.isSoundEnabled = enabled
        val updated = _playerData.value.copy(soundEnabled = enabled)
        _playerData.value = updated
        saveManager.savePlayerData(updated)
    }

    fun setMusicEnabled(enabled: Boolean) {
        audioManager.isMusicEnabled = enabled
        val updated = _playerData.value.copy(musicEnabled = enabled)
        _playerData.value = updated
        saveManager.savePlayerData(updated)
    }

    fun setVibrationEnabled(enabled: Boolean) {
        hapticManager.isEnabled = enabled
        val updated = _playerData.value.copy(vibrationEnabled = enabled)
        _playerData.value = updated
        saveManager.savePlayerData(updated)
    }

    fun setSelectedTheme(theme: String) {
        val updated = _playerData.value.copy(selectedTheme = theme)
        _playerData.value = updated
        saveManager.savePlayerData(updated)
    }

    fun setPaused(paused: Boolean) {
        _uiState.value = _uiState.value.copy(isPaused = paused)
    }

    override fun onCleared() {
        super.onCleared()
        audioManager.release()
    }
}
