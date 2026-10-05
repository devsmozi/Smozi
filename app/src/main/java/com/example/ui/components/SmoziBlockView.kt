package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.unit.dp
import com.example.models.BlockColor
import com.example.models.SpecialBlockType

@Composable
fun SmoziBlockView(
    color: BlockColor,
    specialType: SpecialBlockType = SpecialBlockType.NONE,
    isClearing: Boolean = false,
    isPreview: Boolean = false,
    isDenied: Boolean = false,
    emptyColor: Color = Color(0xFF141D33),
    gridLineColor: Color = Color(0xFF1A2645),
    modifier: Modifier = Modifier
) {
    val scaleAnim = remember { Animatable(1f) }
    val alphaAnim = remember { Animatable(if (isPreview) 0.60f else 1f) }

    LaunchedEffect(isClearing) {
        if (isClearing) {
            scaleAnim.animateTo(
                targetValue = 1.20f,
                animationSpec = tween(durationMillis = 140, easing = FastOutSlowInEasing)
            )
            scaleAnim.animateTo(
                targetValue = 0f,
                animationSpec = tween(durationMillis = 160, easing = FastOutSlowInEasing)
            )
        } else {
            scaleAnim.snapTo(1f)
            alphaAnim.snapTo(if (isPreview) 0.60f else 1f)
        }
    }

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .padding(0.75.dp)
        ) {
            val w = size.width
            val h = size.height

            if (color == BlockColor.NONE && specialType == SpecialBlockType.NONE) {
                // Empty tile matching the active background skin theme
                drawEmptyTile(w, h, emptyColor, gridLineColor)
                return@Canvas
            }

            // Draw the exact 4-facet 3D beveled block from the video and uploaded asset sheets
            drawBeveledBlock(
                color = if (isDenied) BlockColor.RED else color,
                w = w,
                h = h,
                alpha = if (isDenied) 0.85f else alphaAnim.value
            )

            // Draw special overlays if any
            if (specialType != SpecialBlockType.NONE) {
                drawSpecialOverlay(specialType, w, h)
            }

            // If denied (colliding with filled blocks), draw glowing red warning border & X
            if (isDenied) {
                drawRoundRect(
                    color = Color(0xFFFF2D55),
                    size = Size(w, h),
                    cornerRadius = CornerRadius(w * 0.15f, h * 0.15f),
                    style = Stroke(width = 3.5f)
                )
                drawLine(
                    color = Color.White,
                    start = Offset(w * 0.25f, h * 0.25f),
                    end = Offset(w * 0.75f, h * 0.75f),
                    strokeWidth = 3f
                )
                drawLine(
                    color = Color.White,
                    start = Offset(w * 0.75f, h * 0.25f),
                    end = Offset(w * 0.25f, h * 0.75f),
                    strokeWidth = 3f
                )
            }
        }
    }
}

private fun DrawScope.drawEmptyTile(w: Float, h: Float, emptyColor: Color, gridLineColor: Color) {
    drawRect(
        color = emptyColor,
        size = Size(w, h)
    )
    drawRect(
        color = gridLineColor,
        size = Size(w, h),
        style = Stroke(width = 1f)
    )
}

/**
 * Recreates the exact 3D beveled puzzle block seen in the gameplay video and uploaded assets:
 * An elevated central plateau with 4 beveled facets (top bright, left medium, right darker, bottom deepest dark)
 * plus subtle rounded corners and clean specular reflections.
 */
private fun DrawScope.drawBeveledBlock(
    color: BlockColor,
    w: Float,
    h: Float,
    alpha: Float
) {
    val cornerRadius = CornerRadius(w * 0.16f, h * 0.16f)
    val b = w * 0.18f // Bevel width

    val primary = color.primaryColor.copy(alpha = alpha)
    val topHighlight = color.lightBevelColor.copy(alpha = alpha)
    val leftShade = color.primaryColor.copy(alpha = alpha)
    val rightShade = color.darkBevelColor.copy(alpha = alpha)
    val bottomShadow = color.darkBevelColor.copy(alpha = alpha)

    // 1. Dark bottom base outline for depth
    drawRoundRect(
        color = bottomShadow,
        size = Size(w, h),
        cornerRadius = cornerRadius
    )

    // 2. Facet paths (Top, Left, Right, Bottom trapezoids)
    // Top trapezoid (brightest)
    val topFacet = Path().apply {
        moveTo(0f, 0f)
        lineTo(w, 0f)
        lineTo(w - b, b)
        lineTo(b, b)
        close()
    }
    drawPath(topFacet, topHighlight)

    // Left trapezoid (medium highlight)
    val leftFacet = Path().apply {
        moveTo(0f, 0f)
        lineTo(b, b)
        lineTo(b, h - b)
        lineTo(0f, h)
        close()
    }
    drawPath(leftFacet, leftShade)

    // Right trapezoid (shadow)
    val rightFacet = Path().apply {
        moveTo(w, 0f)
        lineTo(w, h)
        lineTo(w - b, h - b)
        lineTo(w - b, b)
        close()
    }
    drawPath(rightFacet, rightShade)

    // Bottom trapezoid (deep shadow)
    val bottomFacet = Path().apply {
        moveTo(0f, h)
        lineTo(b, h - b)
        lineTo(w - b, h - b)
        lineTo(w, h)
        close()
    }
    drawPath(bottomFacet, bottomShadow)

    // 3. Center elevated square plateau
    drawRect(
        color = primary,
        topLeft = Offset(b, b),
        size = Size(w - 2 * b, h - 2 * b)
    )

    // 4. Subtle top-left specular gleam on the center plateau
    drawRoundRect(
        brush = Brush.verticalGradient(
            listOf(
                Color.White.copy(alpha = 0.35f * alpha),
                Color.Transparent
            )
        ),
        topLeft = Offset(b, b),
        size = Size(w - 2 * b, (h - 2 * b) * 0.45f),
        cornerRadius = CornerRadius(2f, 2f)
    )

    // 5. Crisp outer boundary line
    drawRoundRect(
        color = Color(0x33000000),
        size = Size(w, h),
        cornerRadius = cornerRadius,
        style = Stroke(width = 1f)
    )
}

private fun DrawScope.drawSpecialOverlay(type: SpecialBlockType, w: Float, h: Float) {
    val cx = w / 2f
    val cy = h / 2f

    when (type) {
        SpecialBlockType.BOMB -> {
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF4A4E69), Color(0xFF1F2232), Color(0xFF0F1019)),
                    center = Offset(cx - w * 0.1f, cy - h * 0.1f),
                    radius = w * 0.35f
                ),
                radius = w * 0.32f,
                center = Offset(cx, cy)
            )
            drawStar(cx, cy, w * 0.14f, Color(0xFFFFD700))
            drawLine(Color(0xFFFFA000), Offset(cx, cy - w * 0.3f), Offset(cx + w * 0.18f, cy - w * 0.42f), strokeWidth = 3f)
            drawCircle(Color(0xFFFF3D00), radius = w * 0.08f, center = Offset(cx + w * 0.18f, cy - w * 0.42f))
        }

        SpecialBlockType.ROCKET_ROW, SpecialBlockType.ROCKET_COL -> {
            rotate(if (type == SpecialBlockType.ROCKET_ROW) 0f else 90f, pivot = Offset(cx, cy)) {
                val rPath = Path().apply {
                    moveTo(cx + w * 0.35f, cy)
                    lineTo(cx - w * 0.2f, cy - h * 0.18f)
                    lineTo(cx - w * 0.3f, cy)
                    lineTo(cx - w * 0.2f, cy + h * 0.18f)
                    close()
                }
                drawPath(rPath, Color.White)
                val nosePath = Path().apply {
                    moveTo(cx + w * 0.35f, cy)
                    lineTo(cx + w * 0.1f, cy - h * 0.12f)
                    lineTo(cx + w * 0.1f, cy + h * 0.12f)
                    close()
                }
                drawPath(nosePath, Color(0xFFFF2D55))
            }
        }

        SpecialBlockType.RAINBOW, SpecialBlockType.COLOR_BALL -> {
            val spectrumColors = listOf(
                Color(0xFFFF2D55),
                Color(0xFFFF9500),
                Color(0xFFFFCC00),
                Color(0xFF34C759),
                Color(0xFF007AFF),
                Color(0xFFAF52DE),
                Color(0xFFFF2D55)
            )
            drawCircle(
                brush = Brush.sweepGradient(spectrumColors, center = Offset(cx, cy)),
                radius = w * 0.32f,
                center = Offset(cx, cy)
            )
        }

        SpecialBlockType.GEM_BLUE -> drawGemFacet(cx, cy, w * 0.3f, Color(0xFF007AFF), Color(0xFF68B1FF))
        SpecialBlockType.GEM_RED -> drawGemFacet(cx, cy, w * 0.3f, Color(0xFFFF2D55), Color(0xFFFF7A95))
        SpecialBlockType.GEM_GREEN -> drawGemFacet(cx, cy, w * 0.3f, Color(0xFF34C759), Color(0xFF86E49D))

        else -> {}
    }
}

private fun DrawScope.drawGemFacet(cx: Float, cy: Float, radius: Float, base: Color, highlight: Color) {
    val path = Path().apply {
        moveTo(cx, cy - radius)
        lineTo(cx + radius, cy - radius * 0.3f)
        lineTo(cx, cy + radius)
        lineTo(cx - radius, cy - radius * 0.3f)
        close()
    }
    drawPath(path, base)
}

private fun DrawScope.drawStar(cx: Float, cy: Float, radius: Float, color: Color) {
    val path = Path()
    val points = 5
    val innerRadius = radius * 0.45f
    val step = Math.PI / points
    var angle = -Math.PI / 2
    path.moveTo(
        (cx + radius * Math.cos(angle)).toFloat(),
        (cy + radius * Math.sin(angle)).toFloat()
    )
    for (i in 1 until points * 2) {
        angle += step
        val r = if (i % 2 == 1) innerRadius else radius
        path.lineTo(
            (cx + r * Math.cos(angle)).toFloat(),
            (cy + r * Math.sin(angle)).toFloat()
        )
    }
    path.close()
    drawPath(path, color)
}
