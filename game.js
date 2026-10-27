/**
 * ============================================================================
 * HIT THE MOSQUITO — COZY ARCADE REFLEX GAME
 * Pure Vanilla JavaScript Game Engine & Web Audio Procedural Synthesizer
 * ============================================================================
 */

(function () {
  'use strict';

  // --- GAME CONSTANTS & TUNING ---
  const STORAGE_KEY_BEST = 'gamility_hit_the_mosquito_best';
  const MAX_LIVES = 3;
  const BITE_TIMEOUT_MS = 8000; // Time before an unswatted mosquito bites

  // Insect definitions & SVG templates
  const INSECT_TYPES = {
    regular: {
      id: 'regular',
      name: 'Regular Mosquito',
      pts: 100,
      width: 44,
      height: 44,
      speed: 1.8,
      splatColor: '#854d0e',
      spawnWeight: 55,
      svg: `
        <svg viewBox="0 0 44 44" class="insect-svg" width="44" height="44">
          <!-- Wings -->
          <ellipse cx="14" cy="16" rx="10" ry="4" fill="#e2e8f0" fill-opacity="0.75" stroke="#94a3b8" stroke-width="0.8" class="wing-left" />
          <ellipse cx="30" cy="16" rx="10" ry="4" fill="#e2e8f0" fill-opacity="0.75" stroke="#94a3b8" stroke-width="0.8" class="wing-right" />
          <!-- Legs -->
          <g stroke="#451a03" stroke-width="1.2" stroke-linecap="round">
            <line x1="20" y1="22" x2="10" y2="28" />
            <line x1="24" y1="22" x2="34" y2="28" />
            <line x1="20" y1="26" x2="8" y2="36" />
            <line x1="24" y1="26" x2="36" y2="36" />
          </g>
          <!-- Body Segments -->
          <ellipse cx="22" cy="18" rx="4.5" ry="4" fill="#78350f" />
          <ellipse cx="22" cy="27" rx="3.5" ry="9" fill="#92400e" stroke="#78350f" stroke-width="0.8" />
          <!-- Proboscis (Sucker Needle) -->
          <line x1="22" y1="14" x2="22" y2="6" stroke="#451a03" stroke-width="1.5" stroke-linecap="round" />
          <!-- Big cartoon red eyes -->
          <circle cx="20" cy="16" r="1.6" fill="#ef4444" />
          <circle cx="24" cy="16" r="1.6" fill="#ef4444" />
        </svg>`
    },
    bloated: {
      id: 'bloated',
      name: 'Bloated Mosquito',
      pts: 250,
      width: 50,
      height: 50,
      speed: 1.3,
      splatColor: '#dc2626',
      spawnWeight: 22,
      svg: `
        <svg viewBox="0 0 50 50" class="insect-svg" width="50" height="50">
          <!-- Wings -->
          <ellipse cx="16" cy="18" rx="11" ry="4.5" fill="#fecaca" fill-opacity="0.7" stroke="#f87171" stroke-width="0.8" class="wing-left" />
          <ellipse cx="34" cy="18" rx="11" ry="4.5" fill="#fecaca" fill-opacity="0.7" stroke="#f87171" stroke-width="0.8" class="wing-right" />
          <!-- Legs -->
          <g stroke="#451a03" stroke-width="1.3" stroke-linecap="round">
            <line x1="22" y1="24" x2="10" y2="30" />
            <line x1="28" y1="24" x2="40" y2="30" />
            <line x1="22" y1="28" x2="8" y2="40" />
            <line x1="28" y1="28" x2="42" y2="40" />
          </g>
          <!-- Thorax & Plump Blood-Filled Abdomen -->
          <ellipse cx="25" cy="20" rx="5" ry="4" fill="#78350f" />
          <ellipse cx="25" cy="31" rx="8" ry="12" fill="#dc2626" stroke="#991b1b" stroke-width="1.2" />
          <!-- Specular blood highlight -->
          <ellipse cx="22" cy="29" rx="2.5" ry="5" fill="#fca5a5" fill-opacity="0.8" />
          <!-- Proboscis -->
          <line x1="25" y1="16" x2="25" y2="7" stroke="#451a03" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="23" cy="18" r="1.8" fill="#ef4444" />
          <circle cx="27" cy="18" r="1.8" fill="#ef4444" />
        </svg>`
    },
    ninja: {
      id: 'ninja',
      name: 'Ninja Mosquito',
      pts: 400,
      width: 42,
      height: 42,
      speed: 2.6,
      splatColor: '#1e293b',
      spawnWeight: 14,
      svg: `
        <svg viewBox="0 0 42 42" class="insect-svg" width="42" height="42">
          <!-- Dark Stealth Wings -->
          <ellipse cx="13" cy="15" rx="10" ry="3.5" fill="#475569" fill-opacity="0.6" stroke="#0f172a" stroke-width="0.8" class="wing-left" />
          <ellipse cx="29" cy="15" rx="10" ry="3.5" fill="#475569" fill-opacity="0.6" stroke="#0f172a" stroke-width="0.8" class="wing-right" />
          <!-- Legs -->
          <g stroke="#0f172a" stroke-width="1.2" stroke-linecap="round">
            <line x1="19" y1="20" x2="9" y2="26" />
            <line x1="23" y1="20" x2="33" y2="26" />
            <line x1="19" y1="25" x2="7" y2="34" />
            <line x1="23" y1="25" x2="35" y2="34" />
          </g>
          <!-- Sleek Black Body -->
          <ellipse cx="21" cy="17" rx="4" ry="3.5" fill="#1e293b" />
          <ellipse cx="21" cy="25" rx="3" ry="8" fill="#0f172a" stroke="#020617" stroke-width="0.8" />
          <!-- Ninja Headband -->
          <rect x="17" y="14" width="8" height="2.2" rx="1" fill="#ef4444" />
          <!-- Needle -->
          <line x1="21" y1="13" x2="21" y2="5" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="19" cy="15" r="1.3" fill="#ffffff" />
          <circle cx="23" cy="15" r="1.3" fill="#ffffff" />
        </svg>`
    },
    queen: {
      id: 'queen',
      name: 'Golden Queen',
      pts: 500,
      width: 48,
      height: 48,
      speed: 2.2,
      splatColor: '#d97706',
      spawnWeight: 7,
      svg: `
        <svg viewBox="0 0 48 48" class="insect-svg" width="48" height="48">
          <!-- Shimmering Golden Wings -->
          <ellipse cx="15" cy="17" rx="11" ry="4" fill="#fef08a" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" class="wing-left" />
          <ellipse cx="33" cy="17" rx="11" ry="4" fill="#fef08a" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" class="wing-right" />
          <!-- Legs -->
          <g stroke="#78350f" stroke-width="1.3" stroke-linecap="round">
            <line x1="21" y1="23" x2="11" y2="29" />
            <line x1="27" y1="23" x2="37" y2="29" />
            <line x1="21" y1="27" x2="9" y2="38" />
            <line x1="27" y1="27" x2="39" y2="38" />
          </g>
          <!-- Golden Body -->
          <ellipse cx="24" cy="19" rx="5" ry="4" fill="#b45309" />
          <ellipse cx="24" cy="29" rx="4.5" ry="10" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
          <!-- Tiny Royal Crown -->
          <path d="M20 13 L21 15 L24 12 L27 15 L28 13 L28 16 L20 16 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
          <line x1="24" y1="12" x2="24" y2="5" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="22" cy="17" r="1.6" fill="#fbbf24" />
          <circle cx="26" cy="17" r="1.6" fill="#fbbf24" />
        </svg>`
    },
    bee: {
      id: 'bee',
      name: 'Honeybee Hazard',
      isHazard: true,
      pts: -1, // Penalty / sting
      width: 52,
      height: 52,
      speed: 1.1,
      svg: `
        <svg viewBox="0 0 52 52" class="insect-svg" width="52" height="52">
          <!-- Bee Wings -->
          <ellipse cx="17" cy="18" rx="12" ry="5.5" fill="#e0f2fe" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" class="wing-left" />
          <ellipse cx="35" cy="18" rx="12" ry="5.5" fill="#e0f2fe" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" class="wing-right" />
          <!-- Cute Striped Bee Body -->
          <g>
            <ellipse cx="26" cy="28" rx="11" ry="13" fill="#facc15" stroke="#78350f" stroke-width="1.5" />
            <!-- Black Fur Stripes -->
            <path d="M16 23 Q26 21 36 23 L36 26 Q26 24 16 26 Z" fill="#1c1917" />
            <path d="M15 29 Q26 27 37 29 L36 33 Q26 31 16 33 Z" fill="#1c1917" />
            <!-- Stinger at bottom -->
            <polygon points="24,41 28,41 26,46" fill="#1c1917" />
          </g>
          <!-- Bee Head -->
          <circle cx="26" cy="17" r="7.5" fill="#78350f" />
          <!-- Cute Friendly Eyes -->
          <circle cx="23" cy="16" r="2.2" fill="#ffffff" />
          <circle cx="23" cy="16" r="1.2" fill="#1c1917" />
          <circle cx="29" cy="16" r="2.2" fill="#ffffff" />
          <circle cx="29" cy="16" r="1.2" fill="#1c1917" />
          <!-- Smiling mouth -->
          <path d="M24 19 Q26 21 28 19" fill="none" stroke="#facc15" stroke-width="1.2" stroke-linecap="round" />
          <!-- Antennae -->
          <path d="M23 11 Q20 7 18 8" fill="none" stroke="#1c1917" stroke-width="1.3" stroke-linecap="round" />
          <path d="M29 11 Q32 7 34 8" fill="none" stroke="#1c1917" stroke-width="1.3" stroke-linecap="round" />
        </svg>`
    }
  };

  // --- AUDIO SYNTHESIZER (Pure Web Audio API) ---
  class SoundController {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
      this.buzzOsc = null;
      this.buzzGain = null;
      this.buzzMod = null;
      this.buzzActive = false;
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.soundEnabled = !this.soundEnabled;
      if (!this.soundEnabled) {
        this.stopBuzz();
      }
      return this.soundEnabled;
    }

    // Procedural Ambient Mosquito Buzz (FM Synthesis)
    startBuzz() {
      if (!this.soundEnabled || !this.ctx || this.buzzActive) return;
      try {
        const t = this.ctx.currentTime;
        // Carrier: creates nasal mosquito whine
        this.buzzOsc = this.ctx.createOscillator();
        this.buzzOsc.type = 'sawtooth';
        this.buzzOsc.frequency.setValueAtTime(220, t);

        // Modulator: creates rapid insect wing flutter vibration
        this.buzzMod = this.ctx.createOscillator();
        this.buzzMod.type = 'sine';
        this.buzzMod.frequency.setValueAtTime(42, t);

        const modGain = this.ctx.createGain();
        modGain.gain.setValueAtTime(60, t);

        this.buzzMod.connect(modGain);
        modGain.connect(this.buzzOsc.frequency);

        // Bandpass filter to focus on insect frequency
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, t);
        filter.Q.setValueAtTime(3.5, t);

        this.buzzGain = this.ctx.createGain();
        this.buzzGain.gain.setValueAtTime(0.015, t);

        this.buzzOsc.connect(filter);
        filter.connect(this.buzzGain);
        this.buzzGain.connect(this.ctx.destination);

        this.buzzOsc.start(t);
        this.buzzMod.start(t);
        this.buzzActive = true;
      } catch (e) {
        // Audio policy fallback
      }
    }

    updateBuzzIntensity(count, closestDistRatio) {
      if (!this.soundEnabled || !this.ctx || !this.buzzGain || !this.buzzActive) return;
      try {
        const t = this.ctx.currentTime;
        if (count <= 0) {
          this.buzzGain.gain.setTargetAtTime(0, t, 0.1);
          return;
        }
        // Base volume scaled by active insects & proximity to center
        const targetVol = Math.min(0.06, 0.015 + count * 0.008 + (1 - closestDistRatio) * 0.025);
        this.buzzGain.gain.setTargetAtTime(targetVol, t, 0.1);
        // Slightly wobble carrier frequency
        const freqShift = 210 + Math.sin(t * 4) * 20 + (1 - closestDistRatio) * 40;
        this.buzzOsc.frequency.setTargetAtTime(freqShift, t, 0.1);
      } catch (e) {}
    }

    stopBuzz() {
      if (!this.buzzActive) return;
      try {
        if (this.buzzOsc) {
          this.buzzOsc.stop();
          this.buzzOsc.disconnect();
          this.buzzOsc = null;
        }
        if (this.buzzMod) {
          this.buzzMod.stop();
          this.buzzMod.disconnect();
          this.buzzMod = null;
        }
        if (this.buzzGain) {
          this.buzzGain.disconnect();
          this.buzzGain = null;
        }
      } catch (e) {}
      this.buzzActive = false;
    }

    // Swatter Slap (Thwack Impact)
    playSwat() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        // Meaty click / noise burst
        const bufferSize = this.ctx.sampleRate * 0.07;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, t);
        filter.frequency.exponentialRampToValueAtTime(180, t + 0.07);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
      } catch (e) {}
    }

    // Splat Squish / Squeak
    playSplat() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } catch (e) {}
    }

    // Honeybee Sting Shock (Dissonant zap + siren pinch)
    playBeeSting() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(880, t);
        osc1.frequency.exponentialRampToValueAtTime(150, t + 0.35);

        osc2.frequency.setValueAtTime(640, t);
        osc2.frequency.exponentialRampToValueAtTime(130, t + 0.35);

        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.36);
        osc2.stop(t + 0.36);
      } catch (e) {}
    }

    // Mosquito Bite (Pinch Sound)
    playBite() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.2);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.21);
      } catch (e) {}
    }

    // Combo Streak Chime
    playCombo(streak) {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const baseFreq = 523.25; // C5
        const semitones = [0, 4, 7, 12, 16, 19];
        const noteIdx = Math.min(streak, semitones.length - 1);
        const freq = baseFreq * Math.pow(2, semitones[noteIdx] / 12);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.31);
      } catch (e) {}
    }

    // Game Over Slide
    playGameOver() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [440, 415, 392, 330];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.18);
          gain.gain.setValueAtTime(0.3, t + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.18 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.18);
          osc.stop(t + idx * 0.18 + 0.26);
        });
      } catch (e) {}
    }
  }

  // --- GAME ENGINE ---
  class HitTheMosquitoGame {
    constructor() {
      // DOM Elements
      this.viewport = document.getElementById('gameViewport');
      this.stage = document.getElementById('mosquitoStage');
      this.fxOverlay = document.getElementById('fxOverlay');
      this.swatterCursor = document.getElementById('swatterCursor');

      // HUD
      this.hudScore = document.getElementById('hudScore');
      this.hudComboBadge = document.getElementById('hudComboBadge');
      this.hudBestScore = document.getElementById('hudBestScore');
      this.hudHearts = document.getElementById('hudHearts');
      this.btnPause = document.getElementById('btnPauseGame');
      this.btnToggleAudio = document.getElementById('btnToggleAudio');
      this.audioIcon = document.getElementById('audioIcon');

      // Overlays
      this.startOverlay = document.getElementById('startOverlay');
      this.pauseOverlay = document.getElementById('pauseOverlay');
      this.gameOverOverlay = document.getElementById('gameOverOverlay');

      this.btnStart = document.getElementById('btnStartGame');
      this.btnResume = document.getElementById('btnResumeGame');
      this.btnRestartFromPause = document.getElementById('btnRestartFromPause');
      this.btnPlayAgain = document.getElementById('btnPlayAgain');

      // Game Over Stats
      this.goFinalScore = document.getElementById('goFinalScore');
      this.goBestScore = document.getElementById('goBestScore');
      this.goMosquitoesSwatted = document.getElementById('goMosquitoesSwatted');
      this.goMaxCombo = document.getElementById('goMaxCombo');
      this.goAccuracy = document.getElementById('goAccuracy');
      this.pauseCurrentScore = document.getElementById('pauseCurrentScore');
      this.pauseStreak = document.getElementById('pauseStreak');

      // Audio Controller
      this.audio = new SoundController();

      // State
      this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER
      this.score = 0;
      this.bestScore = 0;
      this.lives = MAX_LIVES;
      this.comboStreak = 0;
      this.maxCombo = 0;
      this.totalSwats = 0;
      this.totalHits = 0;
      this.insects = []; // Active insect instances
      this.lastFrameTime = 0;
      this.spawnTimer = 0;
      this.spawnInterval = 1400; // ms

      this.loadBestScore();
      this.bindEvents();
    }

    loadBestScore() {
      try {
        const val = localStorage.getItem(STORAGE_KEY_BEST);
        this.bestScore = val ? parseInt(val, 10) || 0 : 0;
        this.hudBestScore.textContent = this.bestScore.toLocaleString();
      } catch (e) {
        this.bestScore = 0;
      }
    }

    saveBestScore() {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        try {
          localStorage.setItem(STORAGE_KEY_BEST, this.bestScore.toString());
        } catch (e) {}
        this.hudBestScore.textContent = this.bestScore.toLocaleString();
      }
    }

    bindEvents() {
      // Audio toggle
      this.btnToggleAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.init();
        const enabled = this.audio.toggle();
        this.audioIcon.textContent = enabled ? '🔊' : '🔇';
      });

      // Overlay Buttons
      this.btnStart.addEventListener('click', () => this.startGame());
      this.btnResume.addEventListener('click', () => this.resumeGame());
      this.btnRestartFromPause.addEventListener('click', () => this.startGame());
      this.btnPlayAgain.addEventListener('click', () => this.startGame());
      this.btnPause.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePause();
      });

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          this.togglePause();
        } else if (e.code === 'KeyR') {
          if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'GAMEOVER') {
            this.startGame();
          }
        }
      });

      // Cursor movement inside viewport
      this.viewport.addEventListener('mousemove', (e) => {
        const rect = this.viewport.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.swatterCursor.style.display = 'block';
        this.swatterCursor.style.left = `${x}px`;
        this.swatterCursor.style.top = `${y}px`;
      });

      this.viewport.addEventListener('mouseleave', () => {
        this.swatterCursor.style.display = 'none';
      });

      // Swat on Click or Touch
      this.viewport.addEventListener('pointerdown', (e) => {
        // Disregard if clicked HUD button or modal
        if (e.target.closest('.game-hud-bar') || e.target.closest('.game-overlay-modal')) return;
        this.handleSwatInput(e);
      });
    }

    startGame() {
      this.audio.init();
      this.audio.resume();

      this.state = 'PLAYING';
      this.score = 0;
      this.lives = MAX_LIVES;
      this.comboStreak = 0;
      this.maxCombo = 0;
      this.totalSwats = 0;
      this.totalHits = 0;
      this.spawnTimer = 0;
      this.spawnInterval = 1400;

      // Clear stage
      this.stage.innerHTML = '';
      this.fxOverlay.innerHTML = '';
      this.insects = [];

      this.updateHUD();
      this.startOverlay.style.display = 'none';
      this.pauseOverlay.style.display = 'none';
      this.gameOverOverlay.style.display = 'none';

      this.audio.startBuzz();

      this.lastFrameTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.pauseCurrentScore.textContent = this.score.toLocaleString();
        this.pauseStreak.textContent = `${this.comboStreak}x`;
        this.pauseOverlay.style.display = 'flex';
        this.audio.stopBuzz();
      } else if (this.state === 'PAUSED') {
        this.resumeGame();
      }
    }

    resumeGame() {
      if (this.state !== 'PAUSED') return;
      this.state = 'PLAYING';
      this.pauseOverlay.style.display = 'none';
      this.audio.startBuzz();
      this.lastFrameTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    // --- SWATTING ACTION & HIT DETECTION ---
    handleSwatInput(e) {
      if (this.state !== 'PLAYING') return;

      const rect = this.stage.getBoundingClientRect();
      const swatX = e.clientX - rect.left;
      const swatY = e.clientY - rect.top;

      // Position & animate cursor
      this.swatterCursor.style.left = `${e.clientX - this.viewport.getBoundingClientRect().left}px`;
      this.swatterCursor.style.top = `${e.clientY - this.viewport.getBoundingClientRect().top}px`;
      this.swatterCursor.classList.remove('swat-active');
      void this.swatterCursor.offsetWidth; // Trigger reflow
      this.swatterCursor.classList.add('swat-active');

      this.audio.playSwat();
      this.totalSwats++;

      // Check hits (swat collision box centered around swat position)
      const swatRadius = 38; // forgiving radius
      let hitInsect = null;
      let hitIndex = -1;

      // Check in reverse order (top rendered insect first)
      for (let i = this.insects.length - 1; i >= 0; i--) {
        const ins = this.insects[i];
        const dist = Math.hypot(ins.x - swatX, ins.y - swatY);
        if (dist <= swatRadius + ins.def.width * 0.4) {
          hitInsect = ins;
          hitIndex = i;
          break;
        }
      }

      if (hitInsect) {
        this.processHit(hitInsect, hitIndex, swatX, swatY);
      } else {
        // Missed swat breaks combo
        if (this.comboStreak > 1) {
          this.comboStreak = 0;
          this.updateHUD();
        }
      }
    }

    processHit(insect, index, swatX, swatY) {
      // Remove insect from list and DOM
      this.insects.splice(index, 1);
      if (insect.el && insect.el.parentNode) {
        insect.el.remove();
      }

      // Check if hazard (Honeybee)
      if (insect.def.isHazard) {
        this.audio.playBeeSting();
        this.triggerDamageFeedback();
        this.spawnComicText('OUCH! STUNG!', swatX, swatY, '#ef4444');
        this.lives--;
        this.comboStreak = 0;
        this.updateHUD();

        if (this.lives <= 0) {
          this.triggerGameOver('STUNG BY A BEE!');
        }
        return;
      }

      // Successful Mosquito Hit!
      this.totalHits++;
      this.comboStreak++;
      if (this.comboStreak > this.maxCombo) {
        this.maxCombo = this.comboStreak;
      }

      this.audio.playSplat();
      if (this.comboStreak > 2) {
        this.audio.playCombo(this.comboStreak);
      }

      // Calculate score with combo multiplier
      const multiplier = Math.min(3.0, 1 + (this.comboStreak - 1) * 0.25);
      const earnedPts = Math.round(insect.def.pts * multiplier);
      this.score += earnedPts;
      this.saveBestScore();

      // Visuals
      this.spawnSplatDecal(swatX, swatY, insect.def.splatColor);
      this.spawnComicText(`+${earnedPts}`, swatX, swatY, '#fbbf24');
      this.spawnStars(swatX, swatY, insect.def.splatColor);

      // Adjust difficulty (speed up spawns as score increases)
      this.spawnInterval = Math.max(650, 1400 - Math.floor(this.score / 250) * 35);
      this.updateHUD();
    }

    triggerDamageFeedback() {
      this.viewport.classList.remove('hit-damage-flash', 'screen-shake');
      void this.viewport.offsetWidth;
      this.viewport.classList.add('hit-damage-flash', 'screen-shake');
    }

    // --- VISUAL FX SPAWNERS ---
    spawnSplatDecal(x, y, color) {
      const decal = document.createElement('div');
      decal.className = 'splat-decal';
      decal.style.left = `${x}px`;
      decal.style.top = `${y}px`;

      const rot = Math.floor(Math.random() * 360);
      const size = 38 + Math.floor(Math.random() * 20);

      decal.innerHTML = `
        <svg viewBox="0 0 50 50" width="${size}" height="${size}" style="transform: rotate(${rot}deg)">
          <path d="M25 10 C27 4, 33 6, 32 14 C36 10, 44 14, 40 22 C46 25, 43 33, 37 34 C41 40, 34 46, 27 42 C24 47, 16 46, 17 38 C10 41, 6 34, 11 28 C5 24, 8 16, 15 17 C16 9, 23 8, 25 10 Z" fill="${color}" fill-opacity="0.85" />
          <circle cx="28" cy="22" r="3" fill="#ffffff" fill-opacity="0.3" />
        </svg>
      `;

      this.fxOverlay.appendChild(decal);
      setTimeout(() => decal.remove(), 2500);
    }

    spawnComicText(text, x, y, color) {
      const el = document.createElement('div');
      el.className = 'floating-comic-text';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = color;
      el.style.fontSize = text.length > 5 ? '1.15rem' : '1.4rem';
      el.textContent = text;
      this.fxOverlay.appendChild(el);
      setTimeout(() => el.remove(), 850);
    }

    spawnStars(x, y, color) {
      const starCount = 5;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('span');
        star.className = 'comic-star';
        star.textContent = '✨';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        const angle = (Math.PI * 2 / starCount) * i + Math.random() * 0.5;
        const dist = 30 + Math.random() * 35;
        star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        this.fxOverlay.appendChild(star);
        setTimeout(() => star.remove(), 600);
      }
    }

    // --- INSECT SPAWNING & BEHAVIOR ---
    spawnInsect() {
      // Pick insect type based on score weight
      let pool = [];
      for (let i = 0; i < INSECT_TYPES.regular.spawnWeight; i++) pool.push(INSECT_TYPES.regular);
      for (let i = 0; i < INSECT_TYPES.bloated.spawnWeight; i++) pool.push(INSECT_TYPES.bloated);

      if (this.score >= 500) {
        for (let i = 0; i < INSECT_TYPES.ninja.spawnWeight; i++) pool.push(INSECT_TYPES.ninja);
      }
      if (this.score >= 1000) {
        for (let i = 0; i < INSECT_TYPES.queen.spawnWeight; i++) pool.push(INSECT_TYPES.queen);
      }
      // Honeybee hazard chance (12% when score > 300)
      if (this.score >= 300 && Math.random() < 0.14) {
        pool = [INSECT_TYPES.bee];
      }

      const def = pool[Math.floor(Math.random() * pool.length)];
      const stageW = this.stage.clientWidth || 360;
      const stageH = this.stage.clientHeight || 560;

      // Spawn at random edge of stage
      let startX, startY;
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { startX = Math.random() * stageW; startY = -30; } // Top
      else if (edge === 1) { startX = stageW + 30; startY = Math.random() * stageH; } // Right
      else if (edge === 2) { startX = Math.random() * stageW; startY = stageH + 30; } // Bottom
      else { startX = -30; startY = Math.random() * stageH; } // Left

      // Target point (Mosquitoes flock around glowing lamp near top center)
      const targetX = def.isHazard
        ? (startX < stageW / 2 ? stageW + 40 : -40)
        : (stageW * 0.5 + (Math.random() * 180 - 90));
      const targetY = def.isHazard
        ? (stageH * 0.3 + Math.random() * (stageH * 0.4))
        : (stageH * 0.22 + Math.random() * (stageH * 0.5));

      // Create DOM element
      const el = document.createElement('div');
      el.className = `insect-entity ${def.id}-mosquito`;
      if (def.isHazard) el.className = `insect-entity honey-bee`;
      el.innerHTML = def.svg;
      this.stage.appendChild(el);

      const insect = {
        def: def,
        el: el,
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        targetX: targetX,
        targetY: targetY,
        angle: 0,
        age: 0,
        isBiting: false,
        biteStartTime: performance.now()
      };

      this.insects.push(insect);
    }

    // --- MAIN GAME LOOP ---
    loop(currentTime) {
      if (this.state !== 'PLAYING') return;

      const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = currentTime;

      // Handle Spawner
      this.spawnTimer += dt * 1000;
      if (this.spawnTimer >= this.spawnInterval && this.insects.length < 8) {
        this.spawnInsect();
        this.spawnTimer = 0;
      }

      // Update Insects
      const stageW = this.stage.clientWidth || 360;
      const stageH = this.stage.clientHeight || 560;
      let minLampDist = 1;

      for (let i = this.insects.length - 1; i >= 0; i--) {
        const ins = this.insects[i];
        ins.age += dt;

        // Retarget periodically for lifelike erratic jitter
        if (Math.random() < 0.05 && !ins.def.isHazard) {
          ins.targetX = Math.max(30, Math.min(stageW - 30, ins.targetX + (Math.random() * 120 - 60)));
          ins.targetY = Math.max(40, Math.min(stageH - 40, ins.targetY + (Math.random() * 120 - 60)));
        }

        // Steer towards target
        const dx = ins.targetX - ins.x;
        const dy = ins.targetY - ins.y;
        const dist = Math.hypot(dx, dy) || 1;

        const moveSpeed = ins.def.speed * 85 * dt;
        ins.x += (dx / dist) * moveSpeed + (Math.random() * 4 - 2);
        ins.y += (dy / dist) * moveSpeed + (Math.random() * 4 - 2);

        // Turn angle facing motion direction
        ins.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        // Apply to DOM
        ins.el.style.left = `${ins.x}px`;
        ins.el.style.top = `${ins.y}px`;
        ins.el.style.transform = `translate(-50%, -50%) rotate(${ins.angle}deg)`;

        // Check if mosquito lingered too long and bites player
        if (!ins.def.isHazard && (currentTime - ins.biteStartTime) >= BITE_TIMEOUT_MS) {
          this.triggerBite(ins, i);
          continue;
        }

        // Remove bee if drifted off opposite screen
        if (ins.def.isHazard && ins.age > 8) {
          if (ins.x < -40 || ins.x > stageW + 40 || ins.y < -40 || ins.y > stageH + 40) {
            ins.el.remove();
            this.insects.splice(i, 1);
            continue;
          }
        }

        // Audio proximity tracking (distance to screen center)
        const lampDist = Math.hypot(ins.x - stageW * 0.5, ins.y - stageH * 0.25) / stageH;
        if (lampDist < minLampDist) minLampDist = lampDist;
      }

      // Update ambient buzzing sound
      this.audio.updateBuzzIntensity(this.insects.length, minLampDist);

      requestAnimationFrame((t) => this.loop(t));
    }

    triggerBite(insect, index) {
      // Mosquito bites and flies away!
      this.insects.splice(index, 1);
      if (insect.el && insect.el.parentNode) {
        insect.el.remove();
      }

      this.audio.playBite();
      this.triggerDamageFeedback();
      this.spawnComicText('CHOMP! BITTEN! 🦟', insect.x, insect.y, '#ef4444');

      this.lives--;
      this.comboStreak = 0;
      this.updateHUD();

      if (this.lives <= 0) {
        this.triggerGameOver('SWARMED & BITTEN!');
      }
    }

    triggerGameOver(reason) {
      this.state = 'GAMEOVER';
      this.audio.stopBuzz();
      this.audio.playGameOver();

      this.saveBestScore();

      // Update Game Over Modal
      document.getElementById('gameOverTitle').textContent = reason || 'GAME OVER!';
      this.goFinalScore.textContent = this.score.toLocaleString();
      this.goBestScore.textContent = this.bestScore.toLocaleString();
      this.goMosquitoesSwatted.textContent = this.totalHits.toString();
      this.goMaxCombo.textContent = `${this.maxCombo}x`;

      const accuracy = this.totalSwats > 0 ? Math.round((this.totalHits / this.totalSwats) * 100) : 0;
      this.goAccuracy.textContent = `${accuracy}%`;

      this.gameOverOverlay.style.display = 'flex';
    }

    // --- HUD UPDATES ---
    updateHUD() {
      this.hudScore.textContent = this.score.toLocaleString();

      // Combo badge
      if (this.comboStreak > 1) {
        const mult = Math.min(3.0, 1 + (this.comboStreak - 1) * 0.25);
        this.hudComboBadge.textContent = `x${mult.toFixed(1)}`;
        this.hudComboBadge.style.display = 'inline-block';
      } else {
        this.hudComboBadge.style.display = 'none';
      }

      // Hearts
      const hearts = this.hudHearts.querySelectorAll('.heart-icon');
      hearts.forEach((h, idx) => {
        if (idx < this.lives) {
          h.classList.add('active');
          h.classList.remove('lost');
        } else {
          h.classList.remove('active');
          h.classList.add('lost');
        }
      });
    }
  }

  // Auto-boot when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    window.gamilityHitTheMosquito = new HitTheMosquitoGame();
  });

})();
