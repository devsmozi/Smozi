package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.repeatable
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.example.models.Piece
import kotlin.math.roundToInt

@Composable
fun SmoziPieceView(
    piece: Piece,
    blockSize: Dp = 32.dp,
    modifier: Modifier = Modifier,
    isDragging: Boolean = false,
    isDenied: Boolean = false
) {
    val matrix = piece.shape.matrix
    val scaleAnim = remember { Animatable(if (isDragging) 1.05f else 1.0f) }
    val shakeXAnim = remember { Animatable(0f) }

    // When denied/saying "NO" on filled blocks, animate a rapid head-shake wobble
    LaunchedEffect(isDenied) {
        if (isDenied) {
            // Rapid left-right shake: -10, +10, -6, +6, 0
            shakeXAnim.animateTo(-12f, tween(30, easing = LinearEasing))
            shakeXAnim.animateTo(12f, tween(50, easing = LinearEasing))
            shakeXAnim.animateTo(-8f, tween(40, easing = LinearEasing))
            shakeXAnim.animateTo(8f, tween(40, easing = LinearEasing))
            shakeXAnim.animateTo(0f, tween(30, easing = LinearEasing))
        } else {
            shakeXAnim.snapTo(0f)
        }
    }

    Box(
        modifier = modifier
            .offset { IntOffset(shakeXAnim.value.roundToInt(), 0) }
            .scale(if (isDragging) 1.08f else 1.0f),
        contentAlignment = Alignment.Center
    ) {
        Column {
            for (row in matrix.indices) {
                Row {
                    for (col in matrix[row].indices) {
                        val isFilled = matrix[row][col]
                        if (isFilled) {
                            SmoziBlockView(
                                color = piece.color,
                                specialType = piece.specialType,
                                isDenied = isDenied,
                                modifier = Modifier.size(blockSize)
                            )
                        } else {
                            Box(modifier = Modifier.size(blockSize))
                        }
                    }
                }
            }
        }
    }
}
