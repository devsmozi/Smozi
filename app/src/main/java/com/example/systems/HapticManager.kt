package com.example.systems

import android.content.Context
import android.os.Build
import android.os.SystemClock
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

class HapticManager(private val context: Context) {

    private val vibrator: Vibrator? by lazy {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }
        } catch (_: Exception) {
            null
        }
    }

    var isEnabled: Boolean = true
    private var lastVibrateTimestamp: Long = 0L

    fun light() {
        if (!shouldVibrate(90L)) return
        vibrate(25, 70)
    }

    fun medium() {
        if (!shouldVibrate(120L)) return
        vibrate(50, 150)
    }

    fun strong() {
        if (!shouldVibrate(150L)) return
        vibrate(100, 220)
    }

    fun celebration() {
        if (!shouldVibrate(300L)) return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val timings = longArrayOf(0, 40, 60, 60, 60, 100)
                val amplitudes = intArrayOf(0, 80, 0, 150, 0, 220)
                vibrator?.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(longArrayOf(0, 40, 60, 60, 60, 100), -1)
            }
        } catch (_: Exception) {}
    }

    fun invalid() {
        if (!shouldVibrate(200L)) return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val timings = longArrayOf(0, 30, 40, 30)
                val amplitudes = intArrayOf(0, 100, 0, 100)
                vibrator?.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(longArrayOf(0, 30, 40, 30), -1)
            }
        } catch (_: Exception) {}
    }

    @Synchronized
    private fun shouldVibrate(minIntervalMs: Long): Boolean {
        if (!isEnabled) return false
        val now = SystemClock.uptimeMillis()
        if (now - lastVibrateTimestamp < minIntervalMs) {
            return false
        }
        lastVibrateTimestamp = now
        return true
    }

    private fun vibrate(durationMs: Long, amplitude: Int) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, amplitude))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(durationMs)
            }
        } catch (_: Exception) {}
    }
}
