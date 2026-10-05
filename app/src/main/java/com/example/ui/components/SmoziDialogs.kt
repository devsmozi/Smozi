package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.data.DailyRewardsData
import com.example.models.PlayerData

@Composable
fun PauseDialog(
    onResume: () -> Unit,
    onRestart: () -> Unit,
    onSettings: () -> Unit,
    onHome: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(26.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .border(3.dp, Color(0xFF2670E8), RoundedCornerShape(26.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Blue Pause Ribbon Header
                Box(
                    modifier = Modifier
                        .shadow(6.dp, RoundedCornerShape(16.dp))
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFF007AFF), Color(0xFF0051B3))
                            )
                        )
                        .border(2.dp, Color(0xFF68B1FF), RoundedCornerShape(16.dp))
                        .padding(horizontal = 32.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "PAUSE",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                SmoziButton(
                    text = "Resume",
                    style = SmoziButtonStyle.GREEN,
                    onClick = onResume,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "pause_resume_button"
                )

                Spacer(modifier = Modifier.height(12.dp))

                SmoziButton(
                    text = "Restart",
                    style = SmoziButtonStyle.BLUE,
                    onClick = onRestart,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "pause_restart_button"
                )

                Spacer(modifier = Modifier.height(12.dp))

                SmoziButton(
                    text = "Settings",
                    style = SmoziButtonStyle.PURPLE,
                    onClick = onSettings,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "pause_settings_button"
                )

                Spacer(modifier = Modifier.height(12.dp))

                SmoziButton(
                    text = "Main Menu",
                    style = SmoziButtonStyle.RED,
                    onClick = onHome,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "pause_home_button"
                )
            }
        }
    }
}

@Composable
fun LevelCompleteDialog(
    score: Int,
    stars: Int,
    coinsEarned: Int,
    gemsEarned: Int,
    onNextLevel: () -> Unit,
    onReplay: () -> Unit,
    onHome: () -> Unit
) {
    Dialog(onDismissRequest = {}) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .border(3.dp, Color(0xFFFFCC00), RoundedCornerShape(28.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Red Ribbon Header (Image 1, 3, 9)
                Box(
                    modifier = Modifier
                        .shadow(8.dp, RoundedCornerShape(18.dp))
                        .clip(RoundedCornerShape(18.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFFFF3B30), Color(0xFFC7002B))
                            )
                        )
                        .border(2.dp, Color(0xFFFF9500), RoundedCornerShape(18.dp))
                        .padding(horizontal = 28.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = "Level Complete!",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // 3 Glowing Stars
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    for (i in 1..3) {
                        val isStarEarned = i <= stars
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Star $i",
                            tint = if (isStarEarned) Color(0xFFFFD700) else Color(0xFF333E68),
                            modifier = Modifier.size(if (i == 2) 48.dp else 38.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Score card
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF0C1333))
                        .border(1.dp, Color(0xFF2670E8), RoundedCornerShape(16.dp))
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "SCORE",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF8BA5F8)
                        )
                        Text(
                            text = "$score",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFFFE680)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Rewards pill
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🪙", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "+$coinsEarned",
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFFFFD700),
                            fontSize = 16.sp
                        )
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "💎", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "+$gemsEarned",
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF68B1FF),
                            fontSize = 16.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Next Button
                SmoziButton(
                    text = "Next",
                    style = SmoziButtonStyle.GREEN,
                    onClick = onNextLevel,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "level_complete_next_button"
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Secondary actions: Replay & Home
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    SmoziIconButton(
                        onClick = onReplay,
                        style = SmoziButtonStyle.BLUE,
                        size = 44.dp,
                        testTag = "level_complete_replay_button"
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Replay",
                            tint = Color.White
                        )
                    }
                    SmoziIconButton(
                        onClick = onHome,
                        style = SmoziButtonStyle.PURPLE,
                        size = 44.dp,
                        testTag = "level_complete_home_button"
                    ) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Home",
                            tint = Color.White
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun GameOverDialog(
    score: Int,
    bestScore: Int,
    isAdventure: Boolean,
    onRetry: () -> Unit,
    onHome: () -> Unit
) {
    Dialog(onDismissRequest = {}) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .border(3.dp, Color(0xFFFF3B30), RoundedCornerShape(28.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Purple/Red ribbon header (Image 9)
                Box(
                    modifier = Modifier
                        .shadow(8.dp, RoundedCornerShape(18.dp))
                        .clip(RoundedCornerShape(18.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFFAF52DE), Color(0xFF7A21AA))
                            )
                        )
                        .border(2.dp, Color(0xFFD396F1), RoundedCornerShape(18.dp))
                        .padding(horizontal = 28.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = if (isAdventure) "Level Failed" else "Game Over",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "No more moves available!",
                    fontSize = 15.sp,
                    color = Color(0xFFA5B4FC)
                )

                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF0C1333))
                        .border(1.dp, Color(0xFF2670E8), RoundedCornerShape(16.dp))
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "FINAL SCORE",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF8BA5F8)
                        )
                        Text(
                            text = "$score",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        if (!isAdventure) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Best: $bestScore",
                                fontSize = 14.sp,
                                color = Color(0xFFFFD700),
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(22.dp))

                SmoziButton(
                    text = "Retry",
                    style = SmoziButtonStyle.RED,
                    onClick = onRetry,
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "game_over_retry_button"
                )

                Spacer(modifier = Modifier.height(14.dp))

                SmoziIconButton(
                    onClick = onHome,
                    style = SmoziButtonStyle.BLUE,
                    size = 44.dp,
                    testTag = "game_over_home_button"
                ) {
                    Icon(
                        imageVector = Icons.Default.Home,
                        contentDescription = "Home",
                        tint = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun SettingsDialog(
    playerData: PlayerData,
    onToggleSound: (Boolean) -> Unit,
    onToggleMusic: (Boolean) -> Unit,
    onToggleVibration: (Boolean) -> Unit,
    onSelectTheme: (String) -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(26.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .border(3.dp, Color(0xFF2670E8), RoundedCornerShape(26.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(22.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Settings",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    SmoziIconButton(
                        onClick = onDismiss,
                        style = SmoziButtonStyle.RED,
                        size = 36.dp,
                        testTag = "settings_close_button"
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Sound toggle
                SettingToggleRow(
                    label = "Sound Effects",
                    checked = playerData.soundEnabled,
                    onCheckedChange = onToggleSound
                )

                // Music toggle
                SettingToggleRow(
                    label = "Music",
                    checked = playerData.musicEnabled,
                    onCheckedChange = onToggleMusic
                )

                // Vibration toggle
                SettingToggleRow(
                    label = "Vibration",
                    checked = playerData.vibrationEnabled,
                    onCheckedChange = onToggleVibration
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Theme selector with all 6 high-quality skins from reference assets
                Text(
                    text = "Background Skin & Theme",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF8BA5F8),
                    modifier = Modifier.align(Alignment.Start)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val themes = com.example.models.SkinThemes.allThemes
                    // 2 rows of 3 themes each
                    for (rowThemes in themes.chunked(3)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            for (skin in rowThemes) {
                                val isSelected = playerData.selectedTheme.equals(skin.id, ignoreCase = true) ||
                                        playerData.selectedTheme.equals(skin.name, ignoreCase = true)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(skin.boardBackground)
                                        .border(
                                            width = if (isSelected) 2.5.dp else 1.dp,
                                            color = if (isSelected) skin.primaryAccent else skin.boardBorder,
                                            shape = RoundedCornerShape(12.dp)
                                        )
                                        .clickable { onSelectTheme(skin.id) }
                                        .padding(vertical = 10.dp, horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(
                                            modifier = Modifier
                                                .size(16.dp)
                                                .clip(CircleShape)
                                                .background(skin.primaryAccent)
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = skin.name,
                                            fontSize = 11.sp,
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
                                            color = if (isSelected) Color.White else Color(0xFFA5B4FC),
                                            maxLines = 1
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                SmoziButton(
                    text = "Done",
                    style = SmoziButtonStyle.GREEN,
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(0.7f),
                    testTag = "settings_done_button"
                )
            }
        }
    }
}

@Composable
private fun SettingToggleRow(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF34C759),
                uncheckedThumbColor = Color(0xFF8E8E93),
                uncheckedTrackColor = Color(0xFF2C2C2E)
            )
        )
    }
}

@Composable
fun DailyRewardDialog(
    playerData: PlayerData,
    onClaim: (coins: Int, gems: Int) -> Unit,
    onDismiss: () -> Unit
) {
    val canClaim = System.currentTimeMillis() - playerData.lastDailyClaimTimestamp > 24 * 60 * 60 * 1000L || playerData.lastDailyClaimTimestamp == 0L
    val currentStreakDay = playerData.dailyStreak.coerceIn(1, 7)

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF131D4A)),
            modifier = Modifier
                .fillMaxWidth(0.96f)
                .border(3.dp, Color(0xFFFF9500), RoundedCornerShape(28.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header (Image 3, 9)
                Box(
                    modifier = Modifier
                        .shadow(6.dp, RoundedCornerShape(16.dp))
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFFFF3B30), Color(0xFFC7002B))
                            )
                        )
                        .border(2.dp, Color(0xFFFFCC00), RoundedCornerShape(16.dp))
                        .padding(horizontal = 26.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Daily Reward",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Days grid (1 to 7)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    DailyRewardsData.days.take(4).forEach { item ->
                        DailyDayCard(
                            day = item.day,
                            coins = item.coins,
                            gems = item.gems,
                            isClaimed = item.day < currentStreakDay,
                            isCurrent = item.day == currentStreakDay
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    DailyRewardsData.days.drop(4).forEach { item ->
                        DailyDayCard(
                            day = item.day,
                            coins = item.coins,
                            gems = item.gems,
                            isClaimed = item.day < currentStreakDay,
                            isCurrent = item.day == currentStreakDay
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                val rewardItem = DailyRewardsData.days[currentStreakDay - 1]
                SmoziButton(
                    text = if (canClaim) "Claim Reward" else "Claimed Today!",
                    style = if (canClaim) SmoziButtonStyle.GREEN else SmoziButtonStyle.BLUE,
                    onClick = {
                        if (canClaim) {
                            onClaim(rewardItem.coins, rewardItem.gems)
                        } else {
                            onDismiss()
                        }
                    },
                    modifier = Modifier.fillMaxWidth(0.85f),
                    testTag = "daily_reward_claim_button"
                )
            }
        }
    }
}

@Composable
private fun DailyDayCard(
    day: Int,
    coins: Int,
    gems: Int,
    isClaimed: Boolean,
    isCurrent: Boolean
) {
    Box(
        modifier = Modifier
            .width(68.dp)
            .height(80.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(
                if (isCurrent) Color(0xFF1E3585) else Color(0xFF0C1333)
            )
            .border(
                1.5.dp,
                if (isCurrent) Color(0xFFFFD700) else if (isClaimed) Color(0xFF34C759) else Color(0xFF263A7D),
                RoundedCornerShape(14.dp)
            )
            .padding(4.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Day $day",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (isCurrent) Color(0xFFFFE680) else Color(0xFFA5B4FC)
            )
            Spacer(modifier = Modifier.height(4.dp))
            if (coins > 0) {
                Text(text = "🪙 $coins", fontSize = 11.sp, color = Color(0xFFFFD700), fontWeight = FontWeight.Bold)
            }
            if (gems > 0) {
                Text(text = "💎 $gems", fontSize = 11.sp, color = Color(0xFF68B1FF), fontWeight = FontWeight.Bold)
            }
            if (day == 7) {
                Text(text = "🎁 Chest", fontSize = 10.sp, color = Color(0xFFFF85BF))
            }
            if (isClaimed) {
                Text(text = "✓ Claimed", fontSize = 9.sp, color = Color(0xFF34C759), fontWeight = FontWeight.Bold)
            }
        }
    }
}
