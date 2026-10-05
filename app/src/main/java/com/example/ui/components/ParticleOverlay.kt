package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlin.random.Random

data class ConfettiRibbon(
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    var rotation: Float,
    var rotSpeed: Float,
    var color: Color,
    var width: Float,
    var height: Float,
    var alpha: Float = 1f,
    var life: Float = 1f
)

data class ShockwaveRing(
    var centerX: Float,
    var centerY: Float,
    var radius: Float,
    var maxRadius: Float,
    var alpha: Float,
    var strokeWidth: Float,
    var color: Color
)

@Composable
fun ParticleOverlay(
    triggerEffect: Long,
    feedbackText: String?,
    scoreIncrement: Int = 0,
    isNewHighScore: Boolean = false,
    comboPercent: String? = null,
    modifier: Modifier = Modifier
) {
    val ribbons = remember { mutableStateListOf<ConfettiRibbon>() }
    val shockwaves = remember { mutableStateListOf<ShockwaveRing>() }

    var visibleText by remember { mutableStateOf<String?>(null) }
    var visiblePoints by remember { mutableStateOf<String?>(null) }
    var visiblePercent by remember { mutableStateOf<String?>(null) }
    var showHighScoreBanner by remember { mutableStateOf(false) }

    LaunchedEffect(triggerEffect) {
        if (triggerEffect > 0L) {
            visibleText = feedbackText
            visiblePoints = if (scoreIncrement > 0) "+$scoreIncrement" else null
            visiblePercent = comboPercent
            showHighScoreBanner = isNewHighScore

            // Bubble Blast signature shockwave ripple rings
            val centerX = 540f
            val centerY = 900f
            shockwaves.add(
                ShockwaveRing(
                    centerX = centerX,
                    centerY = centerY,
                    radius = 20f,
                    maxRadius = 500f,
                    alpha = 0.9f,
                    strokeWidth = 10f,
                    color = Color(0xFF68B1FF)
                )
            )
            shockwaves.add(
                ShockwaveRing(
                    centerX = centerX,
                    centerY = centerY,
                    radius = 10f,
                    maxRadius = 420f,
                    alpha = 0.7f,
                    strokeWidth = 6f,
                    color = Color(0xFFFFD700)
                )
            )

            // Multicolored festive confetti ribbons bursting across board (matching video 00:19, 00:31)
            val colors = listOf(
                Color(0xFFFF2D55), // Red
                Color(0xFFFF9500), // Orange
                Color(0xFFFFCC00), // Yellow
                Color(0xFF34C759), // Green
                Color(0xFF00C7BE), // Cyan
                Color(0xFF007AFF), // Blue
                Color(0xFFAF52DE), // Purple
                Color(0xFFFF2D8D)  // Pink
            )

            val newRibbons = (0..36).map {
                val angle = Random.nextFloat() * 2 * Math.PI
                val speed = Random.nextFloat() * 14f + 6f
                ConfettiRibbon(
                    x = centerX + (Random.nextFloat() - 0.5f) * 200f,
                    y = centerY + (Random.nextFloat() - 0.5f) * 200f,
                    vx = (Math.cos(angle) * speed).toFloat(),
                    vy = (Math.sin(angle) * speed).toFloat() - 6f,
                    rotation = Random.nextFloat() * 360f,
                    rotSpeed = (Random.nextFloat() - 0.5f) * 16f,
                    color = colors.random(),
                    width = Random.nextFloat() * 12f + 8f,
                    height = Random.nextFloat() * 24f + 14f
                )
            }
            ribbons.addAll(newRibbons)

            // Animate ribbons and shockwaves
            var elapsed = 0
            while (elapsed < 800 && (ribbons.isNotEmpty() || shockwaves.isNotEmpty())) {
                delay(16)
                elapsed += 16

                // Update shockwaves
                for (s in shockwaves) {
                    val progress = (s.radius / s.maxRadius).coerceIn(0f, 1f)
                    s.radius += 24f
                    s.alpha = (1f - progress).coerceIn(0f, 1f)
                    s.strokeWidth = 10f * (1f - progress * 0.6f)
                }
                shockwaves.removeAll { it.radius >= it.maxRadius }

                // Update ribbons
                for (r in ribbons) {
                    r.x += r.vx
                    r.y += r.vy
                    r.vy += 0.4f // gravity
                    r.vx *= 0.98f // drag
                    r.rotation += r.rotSpeed
                    r.life -= 0.02f
                    r.alpha = r.life.coerceIn(0f, 1f)
                }
                ribbons.removeAll { it.life <= 0f }
            }
            ribbons.clear()
            shockwaves.clear()
            delay(500)
            visibleText = null
            visiblePoints = null
            visiblePercent = null
            showHighScoreBanner = false
        }
    }

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        // Draw shockwave ripple rings and confetti ribbons
        if (shockwaves.isNotEmpty() || ribbons.isNotEmpty()) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                // 1. Shockwaves
                for (s in shockwaves) {
                    if (s.alpha > 0.01f) {
                        drawCircle(
                            color = s.color.copy(alpha = s.alpha),
                            radius = s.radius,
                            center = Offset(s.centerX, s.centerY),
                            style = Stroke(width = s.strokeWidth)
                        )
                    }
                }

                // 2. Ribbons
                for (r in ribbons) {
                    rotate(r.rotation, pivot = Offset(r.x, r.y)) {
                        drawRoundRect(
                            color = r.color.copy(alpha = r.alpha),
                            topLeft = Offset(r.x - r.width / 2f, r.y - r.height / 2f),
                            size = Size(r.width, r.height)
                        )
                    }
                }
            }
        }

        // Floating elements: Score points, High Score, Combo %, and Text Popups
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.offset(y = (-40).dp)
        ) {
            // NEW HIGH SCORE banner (from video 00:37)
            AnimatedVisibility(
                visible = showHighScoreBanner,
                enter = scaleIn() + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                Text(
                    text = "NEW HIGH\nSCORE",
                    style = TextStyle(
                        fontSize = 34.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFFF3B30),
                        shadow = Shadow(Color(0xFF5A0000), Offset(0f, 4f), 6f)
                    ),
                    lineHeight = 34.sp
                )
            }

            // Percentage badge: e.g. "40%", "80%", "140%" (from video 00:19, 00:31, 00:46)
            AnimatedVisibility(
                visible = visiblePercent != null,
                enter = scaleIn() + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                Text(
                    text = visiblePercent ?: "",
                    style = TextStyle(
                        fontSize = 44.sp,
                        fontWeight = FontWeight.Black,
                        brush = Brush.verticalGradient(
                            listOf(Color(0xFFFFFFFF), Color(0xFF68B1FF))
                        ),
                        shadow = Shadow(Color(0xFF003399), Offset(0f, 6f), 8f)
                    ),
                    modifier = Modifier.rotate(-6f)
                )
            }

            // Floating score points: "+10", "+20", "+60t!", "+80" (from video 00:09, 00:19, 00:32, 00:37)
            AnimatedVisibility(
                visible = visiblePoints != null,
                enter = scaleIn() + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                Text(
                    text = visiblePoints ?: "",
                    style = TextStyle(
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        shadow = Shadow(Color(0xFF0A1230), Offset(0f, 4f), 5f)
                    )
                )
            }

            // Juicy Casual Pill Banner: "Smooth!", "Good!", "Great!" (from video 00:09, 00:19, 00:30)
            AnimatedVisibility(
                visible = visibleText != null,
                enter = scaleIn() + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                val bannerBg = when (visibleText) {
                    "Smooth!" -> Brush.horizontalGradient(listOf(Color(0xFF28CD41), Color(0xFF4CD964)))
                    "Good!" -> Brush.horizontalGradient(listOf(Color(0xFF34C759), Color(0xFF30D158)))
                    "Great!" -> Brush.horizontalGradient(listOf(Color(0xFFFF9500), Color(0xFFFFCC00)))
                    else -> Brush.horizontalGradient(listOf(Color(0xFFFF2D55), Color(0xFFFF9500)))
                }

                Box(
                    modifier = Modifier
                        .shadow(12.dp, RoundedCornerShape(20.dp))
                        .clip(RoundedCornerShape(20.dp))
                        .background(bannerBg)
                        .border(2.5.dp, Color.White, RoundedCornerShape(20.dp))
                        .padding(horizontal = 26.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = visibleText ?: "",
                        style = TextStyle(
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            shadow = Shadow(Color(0x66000000), Offset(0f, 3f), 4f)
                        )
                    )
                }
            }
        }
    }
}
