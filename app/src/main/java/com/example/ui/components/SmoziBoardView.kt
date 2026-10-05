package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.game.BoardEngine
import com.example.models.BlockColor
import com.example.models.CellState
import com.example.models.Piece
import com.example.models.SkinTheme
import com.example.models.SkinThemes
import com.example.models.SpecialBlockType

@Composable
fun SmoziBoardView(
    board: List<List<CellState>>,
    previewPiece: Piece?,
    previewRow: Int?,
    previewCol: Int?,
    isPlacementValid: Boolean,
    clearingCells: Set<Pair<Int, Int>>,
    skinTheme: SkinTheme = SkinThemes.CLASSIC_NAVY,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        // 8x8 Outer Board Chassis dynamically styled to match the active background skin theme
        Box(
            modifier = Modifier
                .fillMaxSize()
                .shadow(elevation = 10.dp, shape = RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp))
                .background(skinTheme.boardBackground)
                .border(
                    width = 2.5.dp,
                    color = skinTheme.boardBorder,
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(4.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                for (r in 0 until BoardEngine.BOARD_SIZE) {
                    Row(modifier = Modifier.weight(1f)) {
                        for (c in 0 until BoardEngine.BOARD_SIZE) {
                            val cell = board.getOrNull(r)?.getOrNull(c) ?: CellState(r, c)
                            val isClearing = clearingCells.contains(r to c)

                            // Check preview piece overlay
                            val isPreviewCell = if (previewPiece != null && previewRow != null && previewCol != null) {
                                val matrix = previewPiece.shape.matrix
                                val pr = r - previewRow
                                val pc = c - previewCol
                                pr in matrix.indices && pc in matrix[pr].indices && matrix[pr][pc]
                            } else {
                                false
                            }

                            val isCollisionDenied = isPreviewCell && cell.isOccupied

                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                if (isPreviewCell && !cell.isOccupied) {
                                    if (isPlacementValid) {
                                        SmoziBlockView(
                                            color = previewPiece!!.color,
                                            specialType = previewPiece.specialType,
                                            isPreview = true,
                                            emptyColor = skinTheme.emptyCellColor,
                                            gridLineColor = skinTheme.gridLineColor,
                                            modifier = Modifier.fillMaxSize()
                                        )
                                    } else {
                                        SmoziBlockView(
                                            color = BlockColor.RED,
                                            specialType = SpecialBlockType.NONE,
                                            isPreview = true,
                                            isDenied = true,
                                            emptyColor = skinTheme.emptyCellColor,
                                            gridLineColor = skinTheme.gridLineColor,
                                            modifier = Modifier.fillMaxSize()
                                        )
                                    }
                                } else if (cell.isOccupied) {
                                    SmoziBlockView(
                                        color = cell.color,
                                        specialType = cell.specialType,
                                        isClearing = isClearing,
                                        isDenied = isCollisionDenied,
                                        emptyColor = skinTheme.emptyCellColor,
                                        gridLineColor = skinTheme.gridLineColor,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                } else {
                                    // Empty tile depression
                                    SmoziBlockView(
                                        color = BlockColor.NONE,
                                        specialType = SpecialBlockType.NONE,
                                        emptyColor = skinTheme.emptyCellColor,
                                        gridLineColor = skinTheme.gridLineColor,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                }

                                // Glowing rainbow beam outline on clearing lines (as in video 00:18)
                                if (isClearing) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .border(
                                                width = 2.dp,
                                                brush = Brush.horizontalGradient(
                                                    listOf(
                                                        Color(0xFFFF2D55),
                                                        Color(0xFFFFCC00),
                                                        Color(0xFF34C759),
                                                        Color(0xFF007AFF)
                                                    )
                                                ),
                                                shape = RectangleShape
                                            )
                                    )
                                    Text(
                                        text = "👍",
                                        fontSize = 14.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
