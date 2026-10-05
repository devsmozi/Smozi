package com.example.models

enum class SpecialBlockType(val displayName: String, val description: String) {
    NONE("Normal", "Standard puzzle block"),
    RAINBOW("Rainbow Block", "Clears all blocks of the same color"),
    BOMB("Bomb", "Clears surrounding 3x3 blocks with explosion"),
    ROCKET_ROW("Rocket (Row)", "Clears an entire horizontal row"),
    ROCKET_COL("Rocket (Column)", "Clears an entire vertical column"),
    LIGHTNING("Lightning", "Clears multiple lines across the board"),
    COLOR_BALL("Color Ball", "Clears any selected color"),
    ICE("Ice Block", "Freezes block, must be cleared twice"),
    STONE("Stone Block", "Heavy obstacle that requires multiple hits"),
    WOOD("Wooden Box", "Wooden crate cleared by adjacent line clears"),
    LOCKED("Locked Block", "Chained block unlocked by line clears"),
    GEM_BLUE("Blue Gem", "Collectible blue sapphire"),
    GEM_RED("Red Gem", "Collectible red ruby"),
    GEM_GREEN("Green Gem", "Collectible emerald")
}
