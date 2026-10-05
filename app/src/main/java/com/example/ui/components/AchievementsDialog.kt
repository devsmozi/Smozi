package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.data.AchievementsData
import com.example.models.PlayerData

@Composable
fun AchievementsDialog(
    playerData: PlayerData,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(26.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.96f)
                .border(3.dp, Color(0xFFAF52DE), RoundedCornerShape(26.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header (Image 3, 9)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .shadow(6.dp, RoundedCornerShape(16.dp))
                            .clip(RoundedCornerShape(16.dp))
                            .background(
                                Brush.verticalGradient(
                                    listOf(Color(0xFFAF52DE), Color(0xFF7A21AA))
                                )
                            )
                            .border(2.dp, Color(0xFFD396F1), RoundedCornerShape(16.dp))
                            .padding(horizontal = 20.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Achievements",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }

                    SmoziIconButton(
                        onClick = onDismiss,
                        style = SmoziButtonStyle.RED,
                        size = 36.dp,
                        testTag = "achievements_close_button"
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(360.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(AchievementsData.initialAchievements) { achievement ->
                        val progress = when (achievement.id) {
                            "first_win" -> if (playerData.unlockedLevels.size > 1) 1 else 0
                            "adventure_explorer" -> (playerData.currentLevel).coerceAtMost(10)
                            "high_scorer" -> (playerData.classicHighScore).coerceAtMost(2000)
                            "perfect_puzzler" -> playerData.levelStars.count { it.value == 3 }.coerceAtMost(5)
                            else -> 0
                        }
                        val isUnlocked = progress >= achievement.targetValue

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(
                                    if (isUnlocked) Color(0xFF1B2E6E) else Color(0xFF0C1333)
                                )
                                .border(
                                    1.dp,
                                    if (isUnlocked) Color(0xFFFFD700) else Color(0xFF263A7D),
                                    RoundedCornerShape(14.dp)
                                )
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(42.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(if (isUnlocked) Color(0xFFFFD700) else Color(0xFF2B3356)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.EmojiEvents,
                                        contentDescription = null,
                                        tint = if (isUnlocked) Color(0xFF6B4500) else Color.White,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = achievement.title,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = if (isUnlocked) Color(0xFFFFE680) else Color.White
                                    )
                                    Text(
                                        text = achievement.description,
                                        fontSize = 12.sp,
                                        color = Color(0xFFA5B4FC)
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    LinearProgressIndicator(
                                        progress = { (progress.toFloat() / achievement.targetValue).coerceIn(0f, 1f) },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(6.dp)
                                            .clip(RoundedCornerShape(3.dp)),
                                        color = Color(0xFF34C759),
                                        trackColor = Color(0xFF1E284E)
                                    )
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        text = "🪙 ${achievement.rewardCoins}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFFFFD700)
                                    )
                                    Text(
                                        text = "💎 ${achievement.rewardGems}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF68B1FF)
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                SmoziButton(
                    text = "Close",
                    style = SmoziButtonStyle.BLUE,
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(0.6f),
                    testTag = "achievements_done_button"
                )
            }
        }
    }
}
