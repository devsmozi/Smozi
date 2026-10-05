package com.example.models

import java.util.UUID

data class Piece(
    val id: String = UUID.randomUUID().toString(),
    val shape: PieceShape,
    val color: BlockColor,
    val specialType: SpecialBlockType = SpecialBlockType.NONE,
    val assetRef: String = "piece_${shape.type.name.lowercase()}"
) {
    val blockCount: Int = shape.blockCount
}
