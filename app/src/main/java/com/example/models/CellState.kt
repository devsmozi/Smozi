package com.example.models

data class CellState(
    val row: Int,
    val col: Int,
    val isOccupied: Boolean = false,
    val color: BlockColor = BlockColor.NONE,
    val specialType: SpecialBlockType = SpecialBlockType.NONE,
    val durability: Int = 1,
    val isClearing: Boolean = false,
    val isHighlighted: Boolean = false,
    val isPossiblePlacement: Boolean = false
) {
    val isEmpty: Boolean
        get() = !isOccupied

    val isObstacle: Boolean
        get() = specialType in listOf(SpecialBlockType.ICE, SpecialBlockType.STONE, SpecialBlockType.WOOD, SpecialBlockType.LOCKED)
}
