import { PitchDetector } from "pitchy";
import { computeRms, freqToMidi, SILENCE_THRESHOLD } from "@/lib/music/pitch-utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PitchFrame {
  midi: number;
  clarity: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** FFT buffer size. 4096 gives better frequency resolution for low guitar notes (E2 ≈ 82 Hz). */
const BUFFER_SIZE = 4096;

// ── PitchService (singleton) ──────────────────────────────────────────────────

/**
 * Thin wrapper around the Web Audio API + pitchy.
 * Manages the AudioContext, microphone MediaStream, AnalyserNode, and
 * exposes a `getFrame()` method that callers can poll on every rAF tick.
 *
 * Usage:
 *   await PitchService.start();   // requests mic permission + opens AudioContext
 *   const frame = PitchService.getFrame(); // call on each rAF
 *   PitchService.stop();          // tear-down, releases mic
 */
class PitchServiceClass {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private detector: PitchDetector<Float32Array<ArrayBuffer>> | null = null;
  private inputBuffer: Float32Array<ArrayBuffer> | null = null;
  private _isRunning = false;

  get isRunning() {
    return this._isRunning;
  }

  /**
   * Open the microphone stream and set up the audio pipeline.
   * Idempotent — safe to call if already running.
   * Throws if the user denies microphone permission.
   */
  async start(): Promise<void> {
    if (this._isRunning) return;

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;

    this.source = this.audioCtx.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);

    this.detector = PitchDetector.forFloat32Array(BUFFER_SIZE);
    this.inputBuffer = new Float32Array(BUFFER_SIZE) as Float32Array<ArrayBuffer>;

    this._isRunning = true;
  }

  /**
   * Stop the microphone stream and release all audio resources.
   * Safe to call even if not running.
   */
  stop(): void {
    this._isRunning = false;

    this.source?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.audioCtx?.close();

    this.audioCtx = null;
    this.analyser = null;
    this.source = null;
    this.stream = null;
    this.detector = null;
    this.inputBuffer = null;
  }

  /**
   * Read one frame of audio and return the detected pitch + clarity.
   * Returns `null` if:
   *   - The service is not running.
   *   - The input is below the silence threshold (no guitar sound).
   */
  getFrame(): PitchFrame | null {
    if (!this._isRunning || !this.analyser || !this.detector || !this.inputBuffer) {
      return null;
    }

    this.analyser.getFloatTimeDomainData(this.inputBuffer);

    // Gate on loudness — skip processing if too quiet
    if (computeRms(this.inputBuffer) < SILENCE_THRESHOLD) {
      return null;
    }

    const sampleRate = this.audioCtx!.sampleRate;
    const [freq, clarity] = this.detector.findPitch(this.inputBuffer, sampleRate);

    if (freq <= 0) return null;

    return { midi: freqToMidi(freq), clarity };
  }
}

// Export as a singleton
export const PitchService = new PitchServiceClass();
