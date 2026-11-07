/**
 * Ambient Auspicious Sound Controller
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * - Generates an authentic, serene Indian classical Tanpura drone (Sa-Pa in C#)
 *   with periodic temple bell resonance via Web Audio API (zero external assets required).
 * - Safe lifecycle management: prevents duplicate audio contexts, clears pending stop timeouts,
 *   and eliminates overlapping sounds.
 * - Handles modern browser autoplay restrictions via user gesture activation.
 * - Zero network missing-file errors.
 */

(function() {
  'use strict';

  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioText = document.getElementById('audio-toggle-text');
  const bgAudioElement = document.getElementById('wedding-bg-audio');

  let isPlaying = false;
  let audioCtx = null;
  let masterGain = null;
  let tanpuraNodes = [];
  let chimeInterval = null;
  let stopTimeout = null;

  // Lazily initialize single shared Web Audio Context on first user gesture
  function initWebAudio() {
    if (audioCtx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // Force-kill all currently running oscillator nodes cleanly
  function cleanupActiveNodes() {
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }

    tanpuraNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {
        // Node already stopped
      }
    });
    tanpuraNodes = [];

    if (chimeInterval) {
      clearInterval(chimeInterval);
      chimeInterval = null;
    }
  }

  // Generate traditional Sa-Pa (C# and G#) Tanpura drone
  function startTanpuraDrone() {
    initWebAudio();
    if (!audioCtx) return;

    // Handle browser autoplay restriction (unlock suspended context)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Prevent duplicate overlapping sounds
    cleanupActiveNodes();

    // Harmonic Tanpura string frequencies:
    // C#2 (69.30 Hz) - Deep base Sa
    // C#3 (138.59 Hz) - Middle Sa
    // G#3 (207.65 Hz) - Fifth Pa
    // C#4 (277.18 Hz) - Upper Sa octave
    const dronePitches = [
      { freq: 69.30, gain: 0.12, lfoSpeed: 0.22 },
      { freq: 138.59, gain: 0.20, lfoSpeed: 0.28 },
      { freq: 207.65, gain: 0.15, lfoSpeed: 0.35 },
      { freq: 277.18, gain: 0.08, lfoSpeed: 0.42 }
    ];

    dronePitches.forEach(pitch => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Soft triangle waveform simulates rich acoustic string overtones
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch.freq, audioCtx.currentTime);

      // Low-frequency oscillator for organic acoustic beating/chorus
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(pitch.lfoSpeed, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(pitch.gain, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      tanpuraNodes.push(osc, lfo, gain, lfoGain);
    });

    // Schedule gentle temple bell chimes every 18 seconds
    chimeInterval = setInterval(() => {
      if (isPlaying) {
        playTempleChime();
      }
    }, 18000);

    // Initial soft blessing chime after 1.5 seconds
    setTimeout(() => {
      if (isPlaying) {
        playTempleChime();
      }
    }, 1500);

    // Fade in master volume smoothly over 2 seconds (eliminates audio clicks)
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.32, now + 2.0);
  }

  // Auspicious resonant temple bell (Ghanta) sound
  function playTempleChime() {
    if (!audioCtx || !isPlaying) return;

    // Harmonic chime overtone series: D5 (587.33 Hz), A5 (880 Hz), D6 (1174.66 Hz)
    const chimeFreqs = [587.33, 880.00, 1174.66];
    const now = audioCtx.currentTime;

    chimeFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Natural exponential bell decay
      const initialGain = 0.035 / (i + 1);
      gain.gain.setValueAtTime(initialGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 4.2);
    });
  }

  // Gracefully fade out and stop oscillators
  function stopDrone() {
    if (chimeInterval) {
      clearInterval(chimeInterval);
      chimeInterval = null;
    }

    if (masterGain && audioCtx) {
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      stopTimeout = setTimeout(() => {
        cleanupActiveNodes();
        stopTimeout = null;
      }, 900);
    } else {
      cleanupActiveNodes();
    }
  }

  function toggleAudio() {
    // If an external MP3 file is present, loaded, and has a ready source
    if (bgAudioElement && bgAudioElement.currentSrc && bgAudioElement.readyState >= 2 && !bgAudioElement.error) {
      if (bgAudioElement.paused) {
        bgAudioElement.play().then(() => {
          isPlaying = true;
          updateAudioUI(true);
        }).catch(() => {
          fallbackToSynth();
        });
      } else {
        bgAudioElement.pause();
        isPlaying = false;
        updateAudioUI(false);
      }
      return;
    }

    // Default primary Web Audio classical Tanpura & Bell synthesis
    fallbackToSynth();
  }

  function fallbackToSynth() {
    if (!isPlaying) {
      startTanpuraDrone();
      isPlaying = true;
      updateAudioUI(true);
    } else {
      stopDrone();
      isPlaying = false;
      updateAudioUI(false);
    }
  }

  function updateAudioUI(playing) {
    if (!audioBtn) return;
    if (playing) {
      audioBtn.classList.add('audio-playing');
      audioBtn.setAttribute('aria-label', 'Pause Auspicious Background Music');
      if (audioText) audioText.textContent = 'Music: Playing';
    } else {
      audioBtn.classList.remove('audio-playing');
      audioBtn.setAttribute('aria-label', 'Play Auspicious Background Music');
      if (audioText) audioText.textContent = 'Music: Play';
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }

  // Expose for testing and automated validation
  window.WeddingAudio = {
    toggle: toggleAudio,
    isPlaying: () => isPlaying,
    start: () => { if (!isPlaying) toggleAudio(); },
    stop: () => { if (isPlaying) toggleAudio(); },
    getContext: () => audioCtx
  };
})();
