const createTone = (context, frequency, duration, volume, type = "sawtooth") => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
};

export class IntroAudioManager {
  constructor(audioSettings) {
    this.audioSettings = audioSettings;
    this.context = null;
    this.muted = false;
  }

  async ensureReady() {
    if (this.muted) return null;
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") await this.context.resume();
    return this.context;
  }

  setMuted(nextMuted) {
    this.muted = nextMuted;
  }

  setSettings(nextSettings) {
    this.audioSettings = nextSettings;
  }

  getVolume(channel) {
    if (!this.audioSettings.enabled) return 0;
    return this.audioSettings.masterVolume * this.audioSettings[channel];
  }

  async engineWake() {
    const context = await this.ensureReady();
    if (!context) return;
    const volume = this.getVolume("engineVolume");
    createTone(context, 42, 1.35, 0.09 * volume);
    createTone(context, 56, 1.2, 0.11 * volume);
    window.setTimeout(() => createTone(context, 74, 0.7, 0.09 * volume), 220);
  }

  async ambienceBed() {
    const context = await this.ensureReady();
    if (!context) return;
    createTone(context, 28, 2.4, 0.035 * this.getVolume("ambienceVolume"), "triangle");
  }

  async metallicHit() {
    const context = await this.ensureReady();
    if (!context) return;
    createTone(context, 240, 0.18, 0.05 * this.getVolume("uiVolume"), "triangle");
  }

  async bassImpact() {
    const context = await this.ensureReady();
    if (!context) return;
    createTone(context, 34, 0.95, 0.22 * this.getVolume("engineVolume"));
  }

  async transitionSweep() {
    const context = await this.ensureReady();
    if (!context) return;
    createTone(context, 120, 0.6, 0.08 * this.getVolume("uiVolume"), "triangle");
  }

  async stinger() {
    const context = await this.ensureReady();
    if (!context) return;
    createTone(context, 320, 0.28, 0.045 * this.getVolume("uiVolume"), "triangle");
  }

  async easterEggRoar() {
    const context = await this.ensureReady();
    if (!context) return;
    const volume = this.getVolume("engineVolume");
    createTone(context, 48, 0.9, 0.16 * volume);
    window.setTimeout(() => createTone(context, 96, 0.5, 0.11 * volume), 120);
  }

  destroy() {
    this.context?.close();
    this.context = null;
  }
}
