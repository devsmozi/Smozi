package com.example.data

import com.example.models.BlockColor
import com.example.models.CellState
import com.example.models.LevelData
import com.example.models.LevelObjective
import com.example.models.ObjectiveType
import com.example.models.SpecialBlockType

object LevelsData {

    val allLevels: List<LevelData> by lazy {
        build50Levels()
    }

    fun getLevel(id: Int): LevelData {
        val clampedId = id.coerceIn(1, 50)
        return allLevels.getOrNull(clampedId - 1) ?: allLevels[0]
    }

    private fun build50Levels(): List<LevelData> {
        val list = mutableListOf<LevelData>()

        // Helper to place initial board cells
        fun obstacle(color: BlockColor = BlockColor.NONE, special: SpecialBlockType = SpecialBlockType.NONE): CellState {
            return CellState(
                row = 0,
                col = 0,
                isOccupied = true,
                color = color,
                specialType = special
            )
        }

        // ==========================================
        // WORLD 1: EMERALD FOREST (Levels 1 to 10)
        // Mechanics: Tutorial, basic colors, gems, combos
        // ==========================================
        list.add(
            LevelData(
                id = 1,
                worldId = 1,
                title = "First Steps",
                objective = LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 10, targetColor = BlockColor.RED),
                moveLimit = 25,
                starThresholds = Triple(400, 800, 1200),
                rewardCoins = 100,
                rewardGems = 2,
                difficulty = "Easy"
            )
        )

        list.add(
            LevelData(
                id = 2,
                worldId = 1,
                title = "Clear the Line",
                objective = LevelObjective(ObjectiveType.SCORE, targetAmount = 700),
                moveLimit = 22,
                starThresholds = Triple(500, 900, 1300),
                rewardCoins = 100,
                rewardGems = 2,
                difficulty = "Easy"
            )
        )

        list.add(
            LevelData(
                id = 3,
                worldId = 1,
                title = "Azure Stream",
                objective = LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 14, targetColor = BlockColor.BLUE),
                moveLimit = 24,
                starThresholds = Triple(600, 1000, 1500),
                rewardCoins = 120,
                rewardGems = 2,
                difficulty = "Easy"
            )
        )

        list.add(
            LevelData(
                id = 4,
                worldId = 1,
                title = "Corner Stones",
                initialBoard = mapOf(
                    (0 to 0) to obstacle(special = SpecialBlockType.STONE),
                    (0 to 7) to obstacle(special = SpecialBlockType.STONE),
                    (7 to 0) to obstacle(special = SpecialBlockType.STONE),
                    (7 to 7) to obstacle(special = SpecialBlockType.STONE)
                ),
                objective = LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 12, targetColor = BlockColor.YELLOW),
                moveLimit = 22,
                starThresholds = Triple(650, 1100, 1600),
                rewardCoins = 120,
                rewardGems = 2,
                difficulty = "Medium"
            )
        )

        list.add(
            LevelData(
                id = 5,
                worldId = 1,
                title = "Gem Cavern",
                initialBoard = mapOf(
                    (3 to 3) to obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE),
                    (3 to 4) to obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE),
                    (4 to 3) to obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE),
                    (4 to 4) to obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE)
                ),
                objective = LevelObjective(ObjectiveType.COLLECT_GEMS, targetAmount = 4),
                moveLimit = 20,
                starThresholds = Triple(700, 1200, 1800),
                rewardCoins = 150,
                rewardGems = 3,
                difficulty = "Medium"
            )
        )

        list.add(
            LevelData(
                id = 6,
                worldId = 1,
                title = "Emerald Grove",
                objective = LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 16, targetColor = BlockColor.GREEN),
                moveLimit = 22,
                starThresholds = Triple(800, 1300, 1900),
                rewardCoins = 150,
                rewardGems = 3,
                difficulty = "Medium"
            )
        )

        list.add(
            LevelData(
                id = 7,
                worldId = 1,
                title = "Timber Barricade",
                initialBoard = mapOf(
                    (2 to 2) to obstacle(special = SpecialBlockType.WOOD),
                    (2 to 5) to obstacle(special = SpecialBlockType.WOOD),
                    (5 to 2) to obstacle(special = SpecialBlockType.WOOD),
                    (5 to 5) to obstacle(special = SpecialBlockType.WOOD)
                ),
                objective = LevelObjective(ObjectiveType.CLEAR_SPECIAL, targetAmount = 4, targetSpecial = SpecialBlockType.WOOD),
                moveLimit = 20,
                starThresholds = Triple(850, 1400, 2000),
                rewardCoins = 160,
                rewardGems = 3,
                difficulty = "Medium"
            )
        )

        list.add(
            LevelData(
                id = 8,
                worldId = 1,
                title = "Ruby Cache",
                initialBoard = mapOf(
                    (1 to 3) to obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED),
                    (1 to 4) to obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED),
                    (6 to 3) to obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED),
                    (6 to 4) to obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
                ),
                objective = LevelObjective(ObjectiveType.COLLECT_GEMS, targetAmount = 4),
                moveLimit = 22,
                starThresholds = Triple(900, 1500, 2100),
                rewardCoins = 180,
                rewardGems = 3,
                difficulty = "Medium"
            )
        )

        list.add(
            LevelData(
                id = 9,
                worldId = 1,
                title = "Sunset Canopy",
                objective = LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 18, targetColor = BlockColor.ORANGE),
                moveLimit = 22,
                starThresholds = Triple(1000, 1600, 2200),
                rewardCoins = 180,
                rewardGems = 3,
                difficulty = "Hard"
            )
        )

        list.add(
            LevelData(
                id = 10,
                worldId = 1,
                title = "Forest Warden",
                initialBoard = mapOf(
                    (2 to 3) to obstacle(special = SpecialBlockType.STONE),
                    (2 to 4) to obstacle(special = SpecialBlockType.STONE),
                    (5 to 3) to obstacle(special = SpecialBlockType.STONE),
                    (5 to 4) to obstacle(special = SpecialBlockType.STONE),
                    (3 to 2) to obstacle(color = BlockColor.GREEN, special = SpecialBlockType.GEM_GREEN),
                    (4 to 5) to obstacle(color = BlockColor.GREEN, special = SpecialBlockType.GEM_GREEN)
                ),
                objective = LevelObjective(ObjectiveType.SCORE, targetAmount = 1500),
                moveLimit = 22,
                starThresholds = Triple(1200, 1800, 2500),
                rewardCoins = 250,
                rewardGems = 5,
                difficulty = "Boss"
            )
        )

        // ==========================================
        // WORLD 2: SOLAR DESERT (Levels 11 to 20)
        // Mechanics: Pyramid stone formations, tight move limits
        // ==========================================
        for (i in 11..20) {
            val offset = i - 11
            val objType = when (offset % 3) {
                0 -> ObjectiveType.CLEAR_COLOR
                1 -> ObjectiveType.SCORE
                else -> ObjectiveType.COLLECT_GEMS
            }
            val targetColor = when (offset % 4) {
                0 -> BlockColor.YELLOW
                1 -> BlockColor.ORANGE
                2 -> BlockColor.PURPLE
                else -> BlockColor.RED
            }
            val title = when (i) {
                11 -> "Dune Gate"
                12 -> "Mirage Valley"
                13 -> "Sun Temple"
                14 -> "Oasis Well"
                15 -> "Pyramid Core"
                16 -> "Sandstorm"
                17 -> "Golden Scarab"
                18 -> "Sunken Crypt"
                19 -> "Pharaoh's Vault"
                else -> "Desert Titan"
            }

            // Progressive board obstacles for Desert
            val desertObstacles = mutableMapOf<Pair<Int, Int>, CellState>()
            if (i >= 13) {
                desertObstacles[(1 to 1)] = obstacle(special = SpecialBlockType.STONE)
                desertObstacles[(1 to 6)] = obstacle(special = SpecialBlockType.STONE)
            }
            if (i >= 15) {
                desertObstacles[(3 to 3)] = obstacle(special = SpecialBlockType.STONE)
                desertObstacles[(3 to 4)] = obstacle(special = SpecialBlockType.STONE)
                desertObstacles[(4 to 3)] = obstacle(special = SpecialBlockType.STONE)
                desertObstacles[(4 to 4)] = obstacle(special = SpecialBlockType.STONE)
            }
            if (objType == ObjectiveType.COLLECT_GEMS) {
                desertObstacles[(2 to 2)] = obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
                desertObstacles[(5 to 5)] = obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
                desertObstacles[(2 to 5)] = obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
                desertObstacles[(5 to 2)] = obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
            }

            list.add(
                LevelData(
                    id = i,
                    worldId = 2,
                    title = title,
                    initialBoard = desertObstacles,
                    objective = when (objType) {
                        ObjectiveType.CLEAR_COLOR -> LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 14 + offset, targetColor = targetColor)
                        ObjectiveType.SCORE -> LevelObjective(ObjectiveType.SCORE, targetAmount = 1000 + offset * 120)
                        else -> LevelObjective(ObjectiveType.COLLECT_GEMS, targetAmount = 4 + (offset / 3))
                    },
                    moveLimit = (22 - (offset / 3)).coerceAtLeast(16),
                    starThresholds = Triple(900 + offset * 100, 1500 + offset * 120, 2200 + offset * 150),
                    rewardCoins = 180 + offset * 15,
                    rewardGems = if (i == 20) 6 else 3,
                    difficulty = if (i == 20) "Boss" else if (i >= 17) "Hard" else "Medium"
                )
            )
        }

        // ==========================================
        // WORLD 3: ARCTIC GLACIER (Levels 21 to 30)
        // Mechanics: Ice blocks (melt on line clear), Frost gems
        // ==========================================
        for (i in 21..30) {
            val offset = i - 21
            val title = when (i) {
                21 -> "Frozen Threshold"
                22 -> "Icebound River"
                23 -> "Glacial Ridge"
                24 -> "Crystal Cavern"
                25 -> "Permafrost Deep"
                26 -> "Frostbite Pass"
                27 -> "Blizzard Eye"
                28 -> "Aurora Peak"
                29 -> "Shattered Ice"
                else -> "Glacier Colossus"
            }

            val iceObstacles = mutableMapOf<Pair<Int, Int>, CellState>()
            // Ice blocks melt when their row or column is cleared
            iceObstacles[(2 to 3)] = obstacle(special = SpecialBlockType.ICE)
            iceObstacles[(2 to 4)] = obstacle(special = SpecialBlockType.ICE)
            iceObstacles[(5 to 3)] = obstacle(special = SpecialBlockType.ICE)
            iceObstacles[(5 to 4)] = obstacle(special = SpecialBlockType.ICE)

            if (i >= 25) {
                iceObstacles[(3 to 2)] = obstacle(special = SpecialBlockType.ICE)
                iceObstacles[(4 to 2)] = obstacle(special = SpecialBlockType.ICE)
                iceObstacles[(3 to 5)] = obstacle(special = SpecialBlockType.ICE)
                iceObstacles[(4 to 5)] = obstacle(special = SpecialBlockType.ICE)
            }
            if (i % 2 == 1) {
                iceObstacles[(1 to 1)] = obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE)
                iceObstacles[(6 to 6)] = obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE)
            }

            list.add(
                LevelData(
                    id = i,
                    worldId = 3,
                    title = title,
                    initialBoard = iceObstacles,
                    objective = when (offset % 3) {
                        0 -> LevelObjective(ObjectiveType.CLEAR_SPECIAL, targetAmount = 4 + (offset / 2), targetSpecial = SpecialBlockType.ICE)
                        1 -> LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 16 + offset, targetColor = BlockColor.BLUE)
                        else -> LevelObjective(ObjectiveType.SCORE, targetAmount = 1400 + offset * 150)
                    },
                    moveLimit = (24 - (offset / 2)).coerceAtLeast(17),
                    starThresholds = Triple(1200 + offset * 120, 1800 + offset * 150, 2600 + offset * 180),
                    rewardCoins = 220 + offset * 15,
                    rewardGems = if (i == 30) 7 else 4,
                    difficulty = if (i == 30) "Boss" else if (i >= 27) "Hard" else "Medium"
                )
            )
        }

        // ==========================================
        // WORLD 4: VOLCANIC CALDERA (Levels 31 to 40)
        // Mechanics: Explosive Bombs, Rockets, high combos
        // ==========================================
        for (i in 31..40) {
            val offset = i - 31
            val title = when (i) {
                31 -> "Obsidian Gate"
                32 -> "Lava Tubes"
                33 -> "Cinder Crater"
                34 -> "Magma Chamber"
                35 -> "Blast Forge"
                36 -> "Sulfur Springs"
                37 -> "Pyre Ridge"
                38 -> "Ignition Core"
                39 -> "Eruption Trench"
                else -> "Inferno Dragon"
            }

            val magmaObstacles = mutableMapOf<Pair<Int, Int>, CellState>()
            magmaObstacles[(3 to 3)] = obstacle(special = SpecialBlockType.BOMB)
            magmaObstacles[(4 to 4)] = obstacle(special = SpecialBlockType.BOMB)
            if (i >= 34) {
                magmaObstacles[(2 to 2)] = obstacle(special = SpecialBlockType.STONE)
                magmaObstacles[(5 to 5)] = obstacle(special = SpecialBlockType.STONE)
                magmaObstacles[(2 to 5)] = obstacle(special = SpecialBlockType.ROCKET_ROW)
                magmaObstacles[(5 to 2)] = obstacle(special = SpecialBlockType.ROCKET_COL)
            }

            list.add(
                LevelData(
                    id = i,
                    worldId = 4,
                    title = title,
                    initialBoard = magmaObstacles,
                    objective = when (offset % 3) {
                        0 -> LevelObjective(ObjectiveType.CLEAR_SPECIAL, targetAmount = 2 + (offset / 3), targetSpecial = SpecialBlockType.BOMB)
                        1 -> LevelObjective(ObjectiveType.CLEAR_COLOR, targetAmount = 18 + offset, targetColor = BlockColor.RED)
                        else -> LevelObjective(ObjectiveType.SCORE, targetAmount = 1800 + offset * 200)
                    },
                    moveLimit = (22 - (offset / 3)).coerceAtLeast(16),
                    starThresholds = Triple(1500 + offset * 150, 2200 + offset * 180, 3100 + offset * 200),
                    rewardCoins = 260 + offset * 20,
                    rewardGems = if (i == 40) 8 else 4,
                    difficulty = if (i == 40) "Boss" else if (i >= 37) "Expert" else "Hard"
                )
            )
        }

        // ==========================================
        // WORLD 5: CYBER NEBULA (Levels 41 to 50)
        // Mechanics: Master tier, Rainbow Orbs, multi-hazard boards
        // ==========================================
        for (i in 41..50) {
            val offset = i - 41
            val title = when (i) {
                41 -> "Neon Horizon"
                42 -> "Quantum Grid"
                43 -> "Cyber Core"
                44 -> "Data Stream"
                45 -> "Matrix Breach"
                46 -> "Synapse Loop"
                47 -> "Orbital Gateway"
                48 -> "Starlight Zenith"
                49 -> "Apex Singularity"
                else -> "The Grandmaster"
            }

            val cyberObstacles = mutableMapOf<Pair<Int, Int>, CellState>()
            // Symmetrical, challenging master layouts
            cyberObstacles[(0 to 0)] = obstacle(special = SpecialBlockType.STONE)
            cyberObstacles[(0 to 7)] = obstacle(special = SpecialBlockType.STONE)
            cyberObstacles[(7 to 0)] = obstacle(special = SpecialBlockType.STONE)
            cyberObstacles[(7 to 7)] = obstacle(special = SpecialBlockType.STONE)
            cyberObstacles[(3 to 3)] = obstacle(special = SpecialBlockType.RAINBOW)
            cyberObstacles[(4 to 4)] = obstacle(special = SpecialBlockType.RAINBOW)

            if (i >= 45) {
                cyberObstacles[(1 to 6)] = obstacle(special = SpecialBlockType.ICE)
                cyberObstacles[(6 to 1)] = obstacle(special = SpecialBlockType.ICE)
                cyberObstacles[(2 to 2)] = obstacle(color = BlockColor.BLUE, special = SpecialBlockType.GEM_BLUE)
                cyberObstacles[(5 to 5)] = obstacle(color = BlockColor.RED, special = SpecialBlockType.GEM_RED)
            }

            list.add(
                LevelData(
                    id = i,
                    worldId = 5,
                    title = title,
                    initialBoard = cyberObstacles,
                    objective = when (offset % 3) {
                        0 -> LevelObjective(ObjectiveType.CLEAR_SPECIAL, targetAmount = 2 + (offset / 3), targetSpecial = SpecialBlockType.RAINBOW)
                        1 -> LevelObjective(ObjectiveType.SCORE, targetAmount = 2200 + offset * 250)
                        else -> LevelObjective(ObjectiveType.COLLECT_GEMS, targetAmount = 6)
                    },
                    moveLimit = (22 - (offset / 4)).coerceAtLeast(16),
                    starThresholds = Triple(1800 + offset * 180, 2600 + offset * 220, 3600 + offset * 250),
                    rewardCoins = 300 + offset * 25,
                    rewardGems = if (i == 50) 10 else 5,
                    difficulty = if (i == 50) "Grandmaster" else "Expert"
                )
            )
        }

        return list
    }
}
