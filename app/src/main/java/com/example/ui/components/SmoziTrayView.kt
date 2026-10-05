package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.models.Piece
import kotlinx.coroutines.delay

@Composable
fun SmoziTrayView(
    pieces: List<Piece?>,
    activeDraggingPieceId: String?,
    onPieceDragStart: (piece: Piece, slotIndex: Int, screenOffset: Offset) -> Unit,
    onPieceDrag: (dragOffset: Offset) -> Unit,
    onPieceDragEnd: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Open, minimalist tray matching the video's clean casual vibe (00:00, 00:04, 00:16)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(130.dp)
            .padding(horizontal = 16.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            for (index in 0..2) {
                val piece = pieces.getOrNull(index)
                val isBeingDragged = piece != null && piece.id == activeDraggingPieceId

                TraySlot(
                    piece = piece,
                    slotIndex = index,
                    isBeingDragged = isBeingDragged,
                    onDragStart = { p, rootPos -> onPieceDragStart(p, index, rootPos) },
                    onDrag = onPieceDrag,
                    onDragEnd = onPieceDragEnd,
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 6.dp)
                )
            }
        }
    }
}

@Composable
private fun TraySlot(
    piece: Piece?,
    slotIndex: Int,
    isBeingDragged: Boolean,
    onDragStart: (Piece, Offset) -> Unit,
    onDrag: (Offset) -> Unit,
    onDragEnd: () -> Unit,
    modifier: Modifier = Modifier
) {
    var slotRootPos by remember { mutableStateOf(Offset.Zero) }
    val spawnScaleAnim = remember(piece?.id) { Animatable(0f) }
    val sparkleAnim = remember(piece?.id) { Animatable(1f) }

    // Spawn pop-in bounce animation with twinkle sparkles (as seen in video 00:04, 00:16, 00:40)
    LaunchedEffect(piece?.id) {
        if (piece != null) {
            delay(slotIndex * 70L)
            spawnScaleAnim.animateTo(
                targetValue = 1f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessMedium
                )
            )
            // Sparkle stars fade out after pop-in
            delay(400)
            sparkleAnim.animateTo(0f, tween(400, easing = FastOutSlowInEasing))
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .onGloballyPositioned { coordinates ->
                slotRootPos = coordinates.positionInRoot()
            },
        contentAlignment = Alignment.Center
    ) {
        if (piece != null) {
            // Sparkle stars around newly spawned pieces (as in video)
            if (sparkleAnim.value > 0.05f) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .alpha(sparkleAnim.value)
                ) {
                    Text(
                        text = "✦",
                        color = Color(0xFFFFD700),
                        fontSize = 14.sp,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = 6.dp, y = 8.dp)
                    )
                    Text(
                        text = "✧",
                        color = Color(0xFF68B1FF),
                        fontSize = 12.sp,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .offset(x = (-8).dp, y = 10.dp)
                    )
                    Text(
                        text = "✦",
                        color = Color.White,
                        fontSize = 10.sp,
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .offset(y = (-6).dp)
                    )
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .scale(spawnScaleAnim.value)
                    .alpha(if (isBeingDragged) 0.15f else 1f)
                    .pointerInput(piece.id) {
                        detectDragGestures(
                            onDragStart = { localOffset ->
                                val startRoot = slotRootPos + localOffset
                                onDragStart(piece, startRoot)
                            },
                            onDrag = { change, dragAmount ->
                                change.consume()
                                onDrag(dragAmount)
                            },
                            onDragEnd = {
                                onDragEnd()
                            },
                            onDragCancel = {
                                onDragEnd()
                            }
                        )
                    }
                    .testTag("tray_piece_$slotIndex"),
                contentAlignment = Alignment.Center
            ) {
                SmoziPieceView(
                    piece = piece,
                    blockSize = 24.dp,
                    isDragging = false
                )
            }
        }
    }
}
