package com.example.systems

import com.example.models.BlockColor
import com.example.models.SpecialBlockType

/**
 * Centralized AssetRegistry as required by SMOZI specifications (Section 26).
 * Provides typed logical references to all uploaded visual assets:
 * blocks, pieces, power-ups, board tiles, gems, HUD, popups, and backgrounds.
 */
object AssetRegistry {

    object Blocks {
        val red = "block_red"
        val yellow = "block_yellow"
        val green = "block_green"
        val blue = "block_blue"
        val orange = "block_orange"
        val purple = "block_purple"
        val cyan = "block_cyan"
        val pink = "block_pink"

        fun getAssetForColor(color: BlockColor): String = when (color) {
            BlockColor.RED -> red
            BlockColor.YELLOW -> yellow
            BlockColor.GREEN -> green
            BlockColor.BLUE -> blue
            BlockColor.ORANGE -> orange
            BlockColor.PURPLE -> purple
            BlockColor.CYAN -> cyan
            BlockColor.PINK -> pink
            BlockColor.RAINBOW -> Special.rainbow
            BlockColor.NONE -> "tile_empty"
        }
    }

    object Special {
        val rainbow = "block_rainbow"
        val bomb = "block_bomb"
        val rocket = "block_rocket"
        val lightning = "block_lightning"
        val colorBall = "block_color_ball"
        val ice = "block_ice"
        val stone = "block_stone"
        val wood = "block_wood"
        val locked = "block_locked"

        fun getAssetForType(type: SpecialBlockType): String = when (type) {
            SpecialBlockType.RAINBOW -> rainbow
            SpecialBlockType.BOMB -> bomb
            SpecialBlockType.ROCKET_ROW, SpecialBlockType.ROCKET_COL -> rocket
            SpecialBlockType.LIGHTNING -> lightning
            SpecialBlockType.COLOR_BALL -> colorBall
            SpecialBlockType.ICE -> ice
            SpecialBlockType.STONE -> stone
            SpecialBlockType.WOOD -> wood
            SpecialBlockType.LOCKED -> locked
            SpecialBlockType.GEM_BLUE -> Gems.blue
            SpecialBlockType.GEM_RED -> Gems.red
            SpecialBlockType.GEM_GREEN -> Gems.green
            SpecialBlockType.NONE -> "block_normal"
        }
    }

    object Gems {
        val blue = "gem_blue"
        val red = "gem_red"
        val green = "gem_green"
        val star = "star"
        val crown = "icon_crown"
        val coin = "coin"
        val chest = "world_reward"
    }

    object BoardTiles {
        val empty = "tile_empty"
        val filled = "tile_filled"
        val highlight = "tile_highlight"
        val locked = "tile_locked"
        val possible = "tile_possible"
    }

    object UI {
        val play = "btn_play"
        val adventure = "btn_adventure"
        val dailyChallenge = "btn_daily"
        val pause = "btn_pause"
        val settings = "btn_settings"
        val retry = "btn_retry"
        val restart = "btn_restart"
        val home = "btn_home"
        val back = "btn_back"
        val close = "btn_close"
        val next = "btn_next"
        val claim = "btn_claim"
        val shop = "btn_shop"
        val achievements = "btn_achievements"
    }

    object Backgrounds {
        val menu = "menu_bg"
        val gameplay = "gameplay_bg"
        val adventure = "adventure_map_bg"
        val victory = "victory_bg"
        val gameOver = "game_over_bg"
        val settings = "settings_bg"
        val splash = "splash_bg"

        val themeForest = "theme_forest"
        val themeDesert = "theme_desert"
        val themeSnow = "theme_snow"
        val themeVolcano = "theme_volcano"
        val themeSpace = "theme_space"
    }

    object Effects {
        val blockClear = "effect_block_clear"
        val lineClear = "effect_line_clear"
        val combo = "effect_combo"
        val bombExplosion = "effect_bomb_explosion"
        val rocketBeam = "effect_rocket"
        val gemCollect = "effect_gem_collect"
        val starBurst = "effect_star_burst"
        val confetti = "effect_confetti"
    }

    object TextPopups {
        val good = "popup_good"
        val great = "popup_great"
        val excellent = "popup_excellent"
        val amazing = "popup_amazing"
        val combo = "popup_combo"
        val perfect = "popup_perfect"
    }
}
