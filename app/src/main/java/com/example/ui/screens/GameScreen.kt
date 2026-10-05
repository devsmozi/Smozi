package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.boundsInRoot
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import com.example.game.BoardEngine
import com.example.game.GameViewModel
import com.example.models.GameMode
import com.example.models.Piece
import com.example.ui.components.GameOverDialog
import com.example.ui.components.LevelCompleteDialog
import com.example.ui.components.ParticleOverlay
import com.example.ui.components.PauseDialog
import com.example.ui.components.SettingsDialog
import com.example.ui.components.SmoziBoardView
import com.example.ui.components.SmoziPieceView
import com.example.ui.components.SmoziTopHud
import com.example.ui.components.SmoziTrayView
import kotlin.math.roundToInt

@Composable
fun GameScreen(
    viewModel: GameViewModel,
    onNavigateHome: () -> Unit,
    onNextLevel: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val playerData by viewModel.playerData.collectAsState()

    var showSettingsDialog by remember { mutableStateOf(false) }

    // Board global coordinate tracking for drag hit-testing
    var boardBounds by remember { mutableStateOf(androidx.compose.ui.geometry.Rect.Zero) }
    var currentDragRootPos by remember { mutableStateOf<Offset?>(null) }
    var activeSlotIndex by remember { mutableIntStateOf(0) }
    var activeDraggingPiece by remember { mutableStateOf<Piece?>(null) }

    BackHandler {
        viewModel.setPaused(true)
    }

    val currentSkin = com.example.models.SkinThemes.getTheme(playerData.selectedTheme)

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(currentSkin.backgroundBrush)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // 1. Top HUD matching video (👑 219, Giant Score, ⚙ Gear)
            SmoziTopHud(
                gameMode = uiState.gameMode,
                score = uiState.score,
                highScore = uiState.highScore,
                levelNumber = uiState.levelData?.id ?: 1,
                objective = uiState.levelData?.objective,
                movesLeft = uiState.movesLeft,
                isNewHighScore = uiState.isNewHighScore,
                onPauseClick = { viewModel.setPaused(true) }
            )

            Spacer(modifier = Modifier.height(4.dp))

            // 2. 8x8 Game Board
            SmoziBoardView(
                board = uiState.board,
                previewPiece = activeDraggingPiece,
                previewRow = viewModel.previewRow,
                previewCol = viewModel.previewCol,
                isPlacementValid = viewModel.isPlacementValid,
                clearingCells = uiState.clearingCells,
                skinTheme = currentSkin,
                modifier = Modifier.onGloballyPositioned { coordinates ->
                    boardBounds = coordinates.boundsInRoot()
                }
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 3. Piece Tray (matching video layout)
            SmoziTrayView(
                pieces = uiState.trayPieces,
                activeDraggingPieceId = activeDraggingPiece?.id,
                onPieceDragStart = { piece, slotIndex, startRootPos ->
                    activeDraggingPiece = piece
                    activeSlotIndex = slotIndex
                    currentDragRootPos = startRootPos
                    viewModel.onPieceDragStart(piece)
                    updateBoardHover(startRootPos, boardBounds, piece, viewModel)
                },
                onPieceDrag = { dragDelta ->
                    val pos = (currentDragRootPos ?: Offset.Zero) + dragDelta
                    currentDragRootPos = pos
                    val piece = activeDraggingPiece
                    if (piece != null) {
                        updateBoardHover(pos, boardBounds, piece, viewModel)
                    }
                },
                onPieceDragEnd = {
                    val pos = currentDragRootPos
                    val piece = activeDraggingPiece
                    val r = viewModel.previewRow
                    val c = viewModel.previewCol

                    if (pos != null && piece != null && r != null && c != null && viewModel.isPlacementValid) {
                        viewModel.onPieceDropped(r, c, activeSlotIndex)
                    } else {
                        if (piece != null && r != null && c != null && !viewModel.isPlacementValid) {
                            viewModel.audioManager.playInvalidPlacement()
                            viewModel.hapticManager.invalid()
                        }
                        viewModel.onDragCancelOrOut()
                    }
                    activeDraggingPiece = null
                    currentDragRootPos = null
                }
            )
        }

        // Full-screen Top-Level Drag Overlay with circular finger touch pointer
        if (activeDraggingPiece != null && currentDragRootPos != null) {
            val piece = activeDraggingPiece!!
            val density = LocalDensity.current
            val cellSizePx = if (boardBounds.width > 0f) boardBounds.width / BoardEngine.BOARD_SIZE else 120f
            val cellSizeDp = with(density) { cellSizePx.toDp() }

            val pieceWidthPx = piece.shape.width * cellSizePx
            val pieceHeightPx = piece.shape.height * cellSizePx

            // Comfortably lift above finger pointer so user sees empty cells below clearly
            val fingerLiftPx = cellSizePx * 1.5f
            val pieceX = currentDragRootPos!!.x - (pieceWidthPx * 0.5f)
            val pieceY = (currentDragRootPos!!.y - fingerLiftPx) - (pieceHeightPx * 0.5f)

            val isDenied = (!viewModel.isPlacementValid && viewModel.previewRow != null && viewModel.previewCol != null)

            // Circular grey touch indicator under finger (as seen in video)
            Canvas(modifier = Modifier.fillMaxSize()) {
                drawCircle(
                    color = Color.White.copy(alpha = 0.50f),
                    radius = 16.dp.toPx(),
                    center = currentDragRootPos!!
                )
            }

            Box(
                modifier = Modifier
                    .offset { IntOffset(pieceX.roundToInt(), pieceY.roundToInt()) }
                    .zIndex(200f)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    if (isDenied) {
                        Box(
                            modifier = Modifier
                                .padding(bottom = 6.dp)
                                .shadow(8.dp, RoundedCornerShape(12.dp))
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFC7002B))
                                .border(1.5.dp, Color(0xFFFF8598), RoundedCornerShape(12.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "🚫 Blocked!",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                        }
                    }

                    SmoziPieceView(
                        piece = piece,
                        blockSize = cellSizeDp, // EXACT MATCH to the 8x8 board's empty blocks!
                        isDragging = true,
                        isDenied = isDenied
                    )
                }
            }
        }

        // Particle & Combo Banner Overlay matching video
        ParticleOverlay(
            triggerEffect = uiState.effectTrigger,
            feedbackText = uiState.feedbackText,
            scoreIncrement = uiState.scoreIncrement,
            isNewHighScore = uiState.isNewHighScore,
            comboPercent = uiState.comboPercent
        )

        // Dialogs
        if (uiState.isPaused) {
            PauseDialog(
                onResume = { viewModel.setPaused(false) },
                onRestart = {
                    viewModel.setPaused(false)
                    if (uiState.gameMode == GameMode.ADVENTURE && uiState.levelData != null) {
                        viewModel.startAdventureLevel(uiState.levelData!!.id)
                    } else {
                        viewModel.startClassicGame()
                    }
                },
                onSettings = {
                    showSettingsDialog = true
                },
                onHome = {
                    viewModel.setPaused(false)
                    onNavigateHome()
                },
                onDismiss = { viewModel.setPaused(false) }
            )
        }

        if (uiState.isLevelComplete) {
            LevelCompleteDialog(
                score = uiState.score,
                stars = uiState.earnedStars,
                coinsEarned = uiState.coinsEarned,
                gemsEarned = uiState.gemsEarned,
                onNextLevel = {
                    val nextId = (uiState.levelData?.id ?: 1) + 1
                    if (nextId <= 50) {
                        onNextLevel(nextId)
                    } else {
                        onNavigateHome()
                    }
                },
                onReplay = {
                    val id = uiState.levelData?.id ?: 1
                    viewModel.startAdventureLevel(id)
                },
                onHome = onNavigateHome
            )
        }

        if (uiState.isGameOver) {
            GameOverDialog(
                score = uiState.score,
                bestScore = uiState.highScore,
                isAdventure = uiState.gameMode == GameMode.ADVENTURE,
                onRetry = {
                    if (uiState.gameMode == GameMode.ADVENTURE && uiState.levelData != null) {
                        viewModel.startAdventureLevel(uiState.levelData!!.id)
                    } else {
                        viewModel.startClassicGame()
                    }
                },
                onHome = onNavigateHome
            )
        }

        if (showSettingsDialog) {
            SettingsDialog(
                playerData = playerData,
                onToggleSound = { viewModel.setSoundEnabled(it) },
                onToggleMusic = { viewModel.setMusicEnabled(it) },
                onToggleVibration = { viewModel.setVibrationEnabled(it) },
                onSelectTheme = { viewModel.setSelectedTheme(it) },
                onDismiss = { showSettingsDialog = false }
            )
        }
    }
}

private fun updateBoardHover(
    rootPos: Offset,
    boardBounds: androidx.compose.ui.geometry.Rect,
    piece: Piece,
    viewModel: GameViewModel
) {
    if (boardBounds.width <= 0f) return

    val cellSize = boardBounds.width / BoardEngine.BOARD_SIZE

    val pieceCenterX = piece.shape.width * cellSize * 0.5f
    val pieceCenterY = piece.shape.height * cellSize * 0.5f

    val fingerLiftY = cellSize * 1.5f

    val boardRelativeX = rootPos.x - boardBounds.left - pieceCenterX
    val boardRelativeY = (rootPos.y - fingerLiftY) - boardBounds.top - pieceCenterY

    val targetCol = (boardRelativeX / cellSize + 0.5f).toInt()
    val targetRow = (boardRelativeY / cellSize + 0.5f).toInt()

    if (targetRow in 0 until BoardEngine.BOARD_SIZE && targetCol in 0 until BoardEngine.BOARD_SIZE) {
        viewModel.onBoardHover(targetRow, targetCol)
    } else {
        viewModel.onDragCancelOrOut()
    }
}
