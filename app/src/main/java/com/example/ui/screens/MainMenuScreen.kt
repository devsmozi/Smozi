package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
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
import com.example.models.PlayerData
import com.example.ui.components.SmoziButton
import com.example.ui.components.SmoziButtonStyle
import com.example.ui.components.SmoziIconButton
import com.example.ui.components.SmoziLogoView

@Composable
fun MainMenuScreen(
    playerData: PlayerData,
    onStartClassic: () -> Unit,
    onOpenAdventure: () -> Unit,
    onStartDailyChallenge: () -> Unit,
    onOpenSettings: () -> Unit,
    onOpenDailyReward: () -> Unit,
    onOpenAchievements: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Rich deep blue backdrop with soft lighting
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0D163D),
                        Color(0xFF090E29),
                        Color(0xFF050819)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar: Player profile & Currency pills (Image 6)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Player badge
                Box(
                    modifier = Modifier
                        .shadow(4.dp, RoundedCornerShape(20.dp))
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color(0xFF131D4A))
                        .border(1.5.dp, Color(0xFF2670E8), RoundedCornerShape(20.dp))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFFF9500)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "⭐", fontSize = 14.sp)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Player",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "Lv ${playerData.currentLevel}",
                                fontSize = 11.sp,
                                color = Color(0xFFFFD700),
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                // Currency Displays (Coins & Gems)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    // Coins
                    Box(
                        modifier = Modifier
                            .shadow(4.dp, RoundedCornerShape(16.dp))
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFF131D4A))
                            .border(1.5.dp, Color(0xFFFFD700), RoundedCornerShape(16.dp))
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "🪙", fontSize = 14.sp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${playerData.coins}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFFFE680)
                            )
                        }
                    }

                    // Gems
                    Box(
                        modifier = Modifier
                            .shadow(4.dp, RoundedCornerShape(16.dp))
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFF131D4A))
                            .border(1.5.dp, Color(0xFF007AFF), RoundedCornerShape(16.dp))
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "💎", fontSize = 14.sp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${playerData.gems}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFF68B1FF)
                            )
                        }
                    }

                    // Settings Icon Button
                    SmoziIconButton(
                        onClick = onOpenSettings,
                        style = SmoziButtonStyle.PURPLE,
                        size = 38.dp,
                        testTag = "menu_settings_button"
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Center: SMOZI Official Candy 3D Logo
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                SmoziLogoView(modifier = Modifier.padding(bottom = 8.dp))
                Text(
                    text = "PREMIUM BLOCK PUZZLE",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF8BA5F8),
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Game Mode Buttons (Image 6)
            Column(
                modifier = Modifier.fillMaxWidth(0.9f),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Classic Mode Button
                SmoziButton(
                    text = "▶  CLASSIC",
                    style = SmoziButtonStyle.GREEN,
                    onClick = onStartClassic,
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "menu_play_classic_button"
                )

                // Adventure Mode Button (96 Levels)
                SmoziButton(
                    text = "🗺️  ADVENTURE",
                    style = SmoziButtonStyle.YELLOW_ORANGE,
                    onClick = onOpenAdventure,
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "menu_play_adventure_button"
                )

                // Daily Challenge Button
                SmoziButton(
                    text = "🏆  DAILY CHALLENGE",
                    style = SmoziButtonStyle.PURPLE,
                    onClick = onStartDailyChallenge,
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "menu_play_daily_button"
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Bottom Actions: Daily Reward, Achievements
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Daily Reward button
                Box(
                    modifier = Modifier
                        .shadow(4.dp, RoundedCornerShape(18.dp))
                        .clip(RoundedCornerShape(18.dp))
                        .background(Color(0xFF131D4A))
                        .border(1.5.dp, Color(0xFFFF9500), RoundedCornerShape(18.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(2.dp)
                    ) {
                        SmoziIconButton(
                            onClick = onOpenDailyReward,
                            style = SmoziButtonStyle.YELLOW_ORANGE,
                            size = 36.dp,
                            testTag = "menu_daily_reward_button"
                        ) {
                            Icon(
                                imageVector = Icons.Default.CardGiftcard,
                                contentDescription = "Daily Reward",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Daily Reward",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                // Achievements button
                Box(
                    modifier = Modifier
                        .shadow(4.dp, RoundedCornerShape(18.dp))
                        .clip(RoundedCornerShape(18.dp))
                        .background(Color(0xFF131D4A))
                        .border(1.5.dp, Color(0xFFAF52DE), RoundedCornerShape(18.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(2.dp)
                    ) {
                        SmoziIconButton(
                            onClick = onOpenAchievements,
                            style = SmoziButtonStyle.PURPLE,
                            size = 36.dp,
                            testTag = "menu_achievements_button"
                        ) {
                            Icon(
                                imageVector = Icons.Default.EmojiEvents,
                                contentDescription = "Achievements",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Achievements",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}
