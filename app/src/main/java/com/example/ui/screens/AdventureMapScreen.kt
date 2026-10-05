package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
import com.example.data.LevelsData
import com.example.models.PlayerData
import com.example.models.SkinThemes
import com.example.ui.components.SmoziButtonStyle
import com.example.ui.components.SmoziIconButton

@Composable
fun AdventureMapScreen(
    playerData: PlayerData,
    onSelectLevel: (Int) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    BackHandler { onBack() }

    val currentTheme = SkinThemes.getTheme(playerData.selectedTheme)
    val listState = rememberLazyListState()

    // Scroll to current level initially
    LaunchedEffect(playerData.currentLevel) {
        val targetIndex = (playerData.currentLevel - 1).coerceIn(0, 49)
        listState.scrollToItem(targetIndex)
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(currentTheme.backgroundBrush)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top Header: Back Button, World Title, Total Stars Earned
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                SmoziIconButton(
                    onClick = onBack,
                    style = SmoziButtonStyle.BLUE,
                    size = 42.dp,
                    testTag = "adventure_back_button"
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = Color.White
                    )
                }

                // Current World Title Banner
                val currentWorld = ((playerData.currentLevel - 1) / 10) + 1
                val worldName = when (currentWorld) {
                    1 -> "Emerald Forest"
                    2 -> "Solar Desert"
                    3 -> "Arctic Glacier"
                    4 -> "Volcanic Caldera"
                    else -> "Cyber Nebula"
                }

                Box(
                    modifier = Modifier
                        .shadow(6.dp, RoundedCornerShape(16.dp))
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0xFF2670E8), Color(0xFF1447A8))
                            )
                        )
                        .border(2.dp, Color(0xFFFFCC00), RoundedCornerShape(16.dp))
                        .padding(horizontal = 20.dp, vertical = 6.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "World $currentWorld / 5",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFE680)
                        )
                        Text(
                            text = worldName,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                }

                // Total Stars Pill
                val totalStars = playerData.levelStars.values.sum()
                Box(
                    modifier = Modifier
                        .shadow(4.dp, RoundedCornerShape(16.dp))
                        .clip(RoundedCornerShape(16.dp))
                        .background(currentTheme.boardBackground)
                        .border(1.5.dp, Color(0xFFFFD700), RoundedCornerShape(16.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Stars",
                            tint = Color(0xFFFFD700),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$totalStars/150",
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFFFFE680),
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // 50-Level Winding Road Map
            LazyColumn(
                state = listState,
                contentPadding = PaddingValues(bottom = 36.dp, top = 8.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(LevelsData.allLevels) { level ->
                    val isUnlocked = playerData.unlockedLevels.contains(level.id)
                    val isCurrent = level.id == playerData.currentLevel
                    val stars = playerData.levelStars[level.id] ?: 0
                    val isCompleted = stars > 0

                    // Show World Header Banner before level 1, 11, 21, 31, 41
                    if (level.id in listOf(1, 11, 21, 31, 41)) {
                        val wName = when (level.id) {
                            1 -> "🌲 World 1: Emerald Forest"
                            11 -> "☀️ World 2: Solar Desert"
                            21 -> "❄️ World 3: Arctic Glacier"
                            31 -> "🌋 World 4: Volcanic Caldera"
                            else -> "🌌 World 5: Cyber Nebula"
                        }
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(Color(0x55000000))
                                    .border(1.dp, Color(0x66FFFFFF), RoundedCornerShape(20.dp))
                                    .padding(horizontal = 18.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = wName,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }

                    // Winding horizontal curve offset for snake-like adventure path
                    val horizontalOffset = when (level.id % 4) {
                        0 -> (-45).dp
                        1 -> 0.dp
                        2 -> 45.dp
                        else -> 0.dp
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        LevelNodeItem(
                            levelId = level.id,
                            isUnlocked = isUnlocked,
                            isCurrent = isCurrent,
                            isCompleted = isCompleted,
                            stars = stars,
                            difficulty = level.difficulty,
                            onClick = {
                                if (isUnlocked) {
                                    onSelectLevel(level.id)
                                }
                            },
                            modifier = Modifier.offset(x = horizontalOffset)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun LevelNodeItem(
    levelId: Int,
    isUnlocked: Boolean,
    isCurrent: Boolean,
    isCompleted: Boolean,
    stars: Int,
    difficulty: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val nodeColor = when {
        isCurrent -> listOf(Color(0xFFFFCC00), Color(0xFFFF9500))
        isCompleted -> listOf(Color(0xFF34C759), Color(0xFF1E8738))
        isUnlocked -> listOf(Color(0xFF007AFF), Color(0xFF0051B3))
        else -> listOf(Color(0xFF4A4E5A), Color(0xFF2C2F36))
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
    ) {
        // Node button
        Box(
            modifier = Modifier
                .size(if (isCurrent) 68.dp else 58.dp)
                .shadow(if (isCurrent) 10.dp else 4.dp, CircleShape)
                .clip(CircleShape)
                .background(Brush.verticalGradient(nodeColor))
                .border(
                    width = if (isCurrent) 3.5.dp else 2.dp,
                    color = if (isCurrent) Color.White else Color(0x66FFFFFF),
                    shape = CircleShape
                )
                .clickable(enabled = isUnlocked, onClick = onClick)
                .testTag("level_node_$levelId"),
            contentAlignment = Alignment.Center
        ) {
            if (isUnlocked) {
                Text(
                    text = "$levelId",
                    fontSize = if (isCurrent) 22.sp else 18.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = "Locked",
                    tint = Color(0xFFAAAAAA),
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        // Stars underneath completed levels (0-3 stars)
        if (isCompleted || isCurrent) {
            Spacer(modifier = Modifier.height(3.dp))
            Row(horizontalArrangement = Arrangement.Center) {
                for (s in 1..3) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        tint = if (s <= stars) Color(0xFFFFD700) else Color(0x44FFFFFF),
                        modifier = Modifier.size(13.dp)
                    )
                }
            }
        }
    }
}
