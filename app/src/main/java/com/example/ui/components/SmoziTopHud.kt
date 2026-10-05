package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.models.GameMode
import com.example.models.LevelObjective

@Composable
fun SmoziTopHud(
    gameMode: GameMode,
    score: Int,
    highScore: Int,
    levelNumber: Int,
    objective: LevelObjective?,
    movesLeft: Int,
    isNewHighScore: Boolean = false,
    onPauseClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scoreScale = remember { Animatable(1f) }

    LaunchedEffect(score) {
        if (score > 0) {
            scoreScale.animateTo(1.15f, tween(80, easing = FastOutSlowInEasing))
            scoreScale.animateTo(1f, tween(120, easing = FastOutSlowInEasing))
        }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Navigation Row matching video (00:00 - 00:49)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Crown + High Score on top-left (e.g. 👑 219)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onPauseClick
                    )
            ) {
                Text(
                    text = "👑",
                    fontSize = 22.sp
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "$highScore",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFFFD700)
                )
            }

            // Adventure level indicator if playing adventure
            if (gameMode == GameMode.ADVENTURE) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xFF1B2B54))
                        .border(1.dp, Color(0xFF38559E), RoundedCornerShape(14.dp))
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "Level $levelNumber",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            // Settings gear on top-right with red notification badge (as in video 00:00)
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onPauseClick
                    )
                    .testTag("hud_settings_button"),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = Color(0xFFA5B8E8),
                    modifier = Modifier.size(28.dp)
                )
                // Red notification dot on gear (as seen in video)
                Box(
                    modifier = Modifier
                        .size(14.dp)
                        .align(Alignment.TopEnd)
                        .offset(x = (-2).dp, y = 2.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFFF2D55)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "!",
                        color = Color.White,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(2.dp))

        // Center: Giant white score number with upward diamond crest (as in video 00:00 - 00:49)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.scale(scoreScale.value)
        ) {
            // Glowing blue diamond / chevron popping up on score increase or new high score
            AnimatedVisibility(
                visible = isNewHighScore,
                enter = scaleIn() + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                Text(
                    text = "◆",
                    color = Color(0xFF68B1FF),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Text(
                text = "$score",
                fontSize = 52.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                letterSpacing = (-1).sp
            )
        }

        // Objective and moves panel for Adventure mode
        if (gameMode == GameMode.ADVENTURE && objective != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(0.9f),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Target: ${objective.currentAmount}/${objective.targetAmount}",
                    color = Color(0xFFA5B8E8),
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
                Text(
                    text = "Moves: $movesLeft",
                    color = if (movesLeft <= 5) Color(0xFFFF6688) else Color(0xFFFFD700),
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 14.sp
                )
            }
        }
    }
}
