package com.example.systems

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.SystemClock
import android.speech.tts.TextToSpeech
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Locale
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.sin

class AudioManager(private val context: Context) : TextToSpeech.OnInitListener {

    var isSoundEnabled: Boolean = true
    var isMusicEnabled: Boolean = true

    private val audioScope = CoroutineScope(Dispatchers.Default)
    private val sampleRate = 44100
    private var lastSoundTimestamp: Long = 0L

    private val audioTrackLock = Any()
    private var audioTrack: AudioTrack? = null

    // Casual game announcer voice (e.g. "Good!", "Great!", "Smooth!" as heard in video)
    private var tts: TextToSpeech? = null
    private var ttsReady = false

    init {
        try {
            tts = TextToSpeech(context.applicationContext, this)
        } catch (_: Exception) {}
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            try {
                tts?.language = Locale.US
                tts?.setPitch(1.08f)
                tts?.setSpeechRate(1.18f)
                ttsReady = true
            } catch (_: Exception) {}
        }
    }

    fun speakAnnouncer(text: String) {
        if (!isSoundEnabled || !ttsReady) return
        try {
            val cleanWord = text.replace("!", "").trim()
            tts?.speak(cleanWord, TextToSpeech.QUEUE_FLUSH, null, "announcer_${System.currentTimeMillis()}")
        } catch (_: Exception) {}
    }

    private fun getOrCreateAudioTrack(): AudioTrack? {
        synchronized(audioTrackLock) {
            if (audioTrack != null) return audioTrack
            try {
                val minBufferSize = AudioTrack.getMinBufferSize(
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
                )
                if (minBufferSize <= 0) return null

                audioTrack = AudioTrack.Builder()
                    .setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_GAME)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
                    .setAudioFormat(
                        AudioFormat.Builder()
                            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(sampleRate)
                            .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                            .build()
                    )
                    .setBufferSizeInBytes(minBufferSize * 4)
                    .setTransferMode(AudioTrack.MODE_STREAM)
                    .build().apply {
                        try {
                            play()
                        } catch (_: Exception) {}
                    }
            } catch (_: Exception) {
                audioTrack = null
            }
            return audioTrack
        }
    }

    /**
     * Tactile bubble/pop sound when picking up a block
     */
    fun playPiecePickup() {
        if (!shouldPlaySound(80L)) return
        audioScope.launch {
            val pcm = synthesizeChirp(380f, 680f, 45, amplitude = 0.75f, decayPower = 5f)
            playPcm(pcm)
        }
    }

    /**
     * Signature Bubble Blast liquid pop bursting sound
     */
    fun playBubbleBurstPop(pitchMultiplier: Float = 1.0f) {
        if (!shouldPlaySound(40L)) return
        audioScope.launch {
            val startFreq = 800f * pitchMultiplier
            val endFreq = 2200f * pitchMultiplier
            val chirp = synthesizeChirp(startFreq, endFreq, 28, amplitude = 0.85f, decayPower = 12f)
            val drop = synthesizeTone(120f, 25, amplitude = 0.6f, decayPower = 10f)
            playPcm(mixPcm(chirp, drop))
        }
    }

    /**
     * Punchy wooden thud / clack when snapping a block to the board
     */
    fun playPiecePlacement() {
        if (!shouldPlaySound(90L)) return
        audioScope.launch {
            val thump = synthesizeTone(190f, 65, amplitude = 0.9f, decayPower = 7f)
            val knock = synthesizeTone(720f, 30, amplitude = 0.5f, decayPower = 12f)
            val combined = mixPcm(thump, knock)
            playPcm(combined)
        }
    }

    /**
     * Denied / "Say No" sound when attempting to place over filled blocks
     */
    fun playInvalidPlacement() {
        if (!shouldPlaySound(180L)) return
        audioScope.launch {
            val b1 = synthesizeTone(160f, 50, amplitude = 0.85f, decayPower = 8f, isSquare = true)
            val pause = ShortArray(sampleRate * 25 / 1000)
            val b2 = synthesizeTone(120f, 60, amplitude = 0.85f, decayPower = 8f, isSquare = true)
            playPcm(concatPcm(b1, pause, b2))
        }
    }

    /**
     * Subtle tactile tick when moving over a new valid board slot
     */
    fun playHoverTick() {
        if (!shouldPlaySound(150L)) return
        audioScope.launch {
            val tick = synthesizeTone(880f, 15, amplitude = 0.22f, decayPower = 15f)
            playPcm(tick)
        }
    }

    /**
     * Beautiful harmonic chime when clearing lines
     */
    fun playLineClear(comboCount: Int = 1) {
        if (!shouldPlaySound(120L)) return
        audioScope.launch {
            val baseFreq = when (comboCount.coerceIn(1, 6)) {
                1 -> 523.25f // C5
                2 -> 587.33f // D5
                3 -> 659.25f // E5
                4 -> 783.99f // G5
                5 -> 880.00f // A5
                else -> 1046.50f // C6
            }

            val note1 = synthesizeChime(baseFreq, 120, amplitude = 0.7f)
            val note2 = synthesizeChime(baseFreq * 1.25f, 140, amplitude = 0.75f)
            val note3 = synthesizeChime(baseFreq * 1.50f, 160, amplitude = 0.8f)
            val note4 = synthesizeChime(baseFreq * 2.00f, 220, amplitude = 0.85f)

            val delaySamples = (sampleRate * 0.045f).toInt()
            val chord = overlayWithDelay(listOf(note1, note2, note3, note4), delaySamples)
            playPcm(chord)
        }
    }

    fun playGemCollect() {
        if (!shouldPlaySound(100L)) return
        audioScope.launch {
            val n1 = synthesizeChime(1174.66f, 100, amplitude = 0.7f)
            val n2 = synthesizeChime(1760.00f, 160, amplitude = 0.8f)
            val delaySamples = (sampleRate * 0.04f).toInt()
            playPcm(overlayWithDelay(listOf(n1, n2), delaySamples))
        }
    }

    fun playSpecialExplosion() {
        if (!shouldPlaySound(150L)) return
        audioScope.launch {
            val boom = synthesizeNoise(160, amplitude = 0.9f)
            val sub = synthesizeTone(90f, 180, amplitude = 0.85f, decayPower = 5f)
            playPcm(mixPcm(boom, sub))
        }
    }

    fun playLevelComplete() {
        if (!shouldPlaySound(300L)) return
        audioScope.launch {
            val n1 = synthesizeChime(523.25f, 140, amplitude = 0.8f)
            val n2 = synthesizeChime(659.25f, 140, amplitude = 0.8f)
            val n3 = synthesizeChime(783.99f, 160, amplitude = 0.85f)
            val n4 = synthesizeChime(1046.50f, 320, amplitude = 0.9f)
            val delaySamples = (sampleRate * 0.12f).toInt()
            playPcm(overlayWithDelay(listOf(n1, n2, n3, n4), delaySamples))
        }
    }

    fun playGameOver() {
        if (!shouldPlaySound(300L)) return
        audioScope.launch {
            val n1 = synthesizeTone(330f, 120, amplitude = 0.7f, decayPower = 5f)
            val n2 = synthesizeTone(293f, 140, amplitude = 0.7f, decayPower = 5f)
            val n3 = synthesizeTone(261f, 220, amplitude = 0.8f, decayPower = 4f)
            val delaySamples = (sampleRate * 0.11f).toInt()
            playPcm(overlayWithDelay(listOf(n1, n2, n3), delaySamples))
        }
    }

    fun playButtonClick() {
        if (!shouldPlaySound(60L)) return
        audioScope.launch {
            val click = synthesizeChirp(500f, 900f, 25, amplitude = 0.5f, decayPower = 10f)
            playPcm(click)
        }
    }

    fun playSpawnNewPieces() {
        if (!shouldPlaySound(200L)) return
        audioScope.launch {
            val p1 = synthesizeChirp(350f, 600f, 35, amplitude = 0.6f, decayPower = 6f)
            val p2 = synthesizeChirp(450f, 750f, 35, amplitude = 0.65f, decayPower = 6f)
            val p3 = synthesizeChirp(550f, 900f, 40, amplitude = 0.7f, decayPower = 6f)
            val delaySamples = (sampleRate * 0.05f).toInt()
            playPcm(overlayWithDelay(listOf(p1, p2, p3), delaySamples))
        }
    }

    @Synchronized
    private fun shouldPlaySound(minIntervalMs: Long): Boolean {
        if (!isSoundEnabled) return false
        val now = SystemClock.uptimeMillis()
        if (now - lastSoundTimestamp < minIntervalMs) {
            return false
        }
        lastSoundTimestamp = now
        return true
    }

    private fun playPcm(pcm: ShortArray) {
        val track = getOrCreateAudioTrack() ?: return
        synchronized(audioTrackLock) {
            try {
                track.write(pcm, 0, pcm.size, AudioTrack.WRITE_NON_BLOCKING)
            } catch (_: Exception) {}
        }
    }

    // DSP Synthesis Functions
    private fun synthesizeTone(
        freq: Float,
        durationMs: Int,
        amplitude: Float,
        decayPower: Float = 6f,
        isSquare: Boolean = false
    ): ShortArray {
        val totalSamples = (sampleRate * durationMs / 1000)
        val buffer = ShortArray(totalSamples)
        for (i in 0 until totalSamples) {
            val t = i.toFloat() / sampleRate
            val progress = i.toFloat() / totalSamples
            val envelope = exp(-progress * decayPower)
            var sample = sin(2.0 * PI * freq * t).toFloat()
            if (isSquare) {
                sample = if (sample >= 0f) 0.8f else -0.8f
            }
            buffer[i] = (sample * envelope * amplitude * 32767).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun synthesizeChirp(
        startFreq: Float,
        endFreq: Float,
        durationMs: Int,
        amplitude: Float,
        decayPower: Float = 6f
    ): ShortArray {
        val totalSamples = (sampleRate * durationMs / 1000)
        val buffer = ShortArray(totalSamples)
        var phase = 0.0
        for (i in 0 until totalSamples) {
            val progress = i.toFloat() / totalSamples
            val currentFreq = startFreq + (endFreq - startFreq) * progress
            phase += 2.0 * PI * currentFreq / sampleRate
            val envelope = exp(-progress * decayPower)
            val sample = sin(phase).toFloat()
            buffer[i] = (sample * envelope * amplitude * 32767).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun synthesizeChime(freq: Float, durationMs: Int, amplitude: Float): ShortArray {
        val totalSamples = (sampleRate * durationMs / 1000)
        val buffer = ShortArray(totalSamples)
        for (i in 0 until totalSamples) {
            val t = i.toFloat() / sampleRate
            val progress = i.toFloat() / totalSamples
            val envelope = exp(-progress * 5f)
            val wave = sin(2.0 * PI * freq * t).toFloat() +
                    0.4f * sin(2.0 * PI * (freq * 2.01f) * t).toFloat() +
                    0.2f * sin(2.0 * PI * (freq * 3.02f) * t).toFloat()
            buffer[i] = (wave * 0.6f * envelope * amplitude * 32767).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun synthesizeNoise(durationMs: Int, amplitude: Float): ShortArray {
        val totalSamples = (sampleRate * durationMs / 1000)
        val buffer = ShortArray(totalSamples)
        for (i in 0 until totalSamples) {
            val progress = i.toFloat() / totalSamples
            val envelope = exp(-progress * 8f)
            val noise = (Math.random() * 2.0 - 1.0).toFloat()
            buffer[i] = (noise * envelope * amplitude * 32767).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun mixPcm(a: ShortArray, b: ShortArray): ShortArray {
        val len = maxOf(a.size, b.size)
        val result = ShortArray(len)
        for (i in 0 until len) {
            val sampleA = if (i < a.size) a[i].toInt() else 0
            val sampleB = if (i < b.size) b[i].toInt() else 0
            result[i] = (sampleA + sampleB).coerceIn(-32768, 32767).toShort()
        }
        return result
    }

    private fun concatPcm(vararg parts: ShortArray): ShortArray {
        val total = parts.sumOf { it.size }
        val result = ShortArray(total)
        var offset = 0
        for (part in parts) {
            System.arraycopy(part, 0, result, offset, part.size)
            offset += part.size
        }
        return result
    }

    private fun overlayWithDelay(parts: List<ShortArray>, delaySamples: Int): ShortArray {
        var totalLen = 0
        parts.forEachIndexed { index, part ->
            totalLen = maxOf(totalLen, index * delaySamples + part.size)
        }
        val result = ShortArray(totalLen)
        parts.forEachIndexed { index, part ->
            val start = index * delaySamples
            for (i in part.indices) {
                val existing = result[start + i].toInt()
                val nextVal = (existing + part[i].toInt()).coerceIn(-32768, 32767).toShort()
                result[start + i] = nextVal
            }
        }
        return result
    }

    fun release() {
        try {
            tts?.stop()
            tts?.shutdown()
            tts = null
        } catch (_: Exception) {}

        synchronized(audioTrackLock) {
            try {
                audioTrack?.stop()
                audioTrack?.release()
                audioTrack = null
            } catch (_: Exception) {}
        }
    }
}
