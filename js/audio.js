/**
 * Ambient Auspicious Sound Controller
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * Generates an authentic, serene Indian classical Tanpura drone (Sa-Pa C#)
 * with temple bell resonance via Web Audio API (zero external assets required),
 * while gracefully supporting external MP3 files if supplied in assets/audio/.
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

  function initWebAudio() {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // Generate traditional Sa-Pa (C# and G#) Tanpura drone
  function startTanpuraDrone() {
    if (!audioCtx) initWebAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    tanpuraNodes = [];

    // Frequencies: C#3 (138.59 Hz), G#3 (207.65 Hz), C#4 (277.18 Hz), C#2 (69.3 Hz)
    const dronePitches = [
      { freq: 69.3, gain: 0.12 },   // Deep base Sa
      { freq: 138.59, gain: 0.2 },  // Middle Sa
      { freq: 207.65, gain: 0.15 }, // Fifth Pa
      { freq: 277.18, gain: 0.08 }  // Higher Sa octave
    ];

    dronePitches.forEach((pitch, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Soft triangle wave for rich warm string overtones
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch.freq, audioCtx.currentTime);

      // Subtle slow detune/beating for string resonance
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.08, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(pitch.gain, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      tanpuraNodes.push(osc, lfo);
    });

    // Schedule gentle temple bell chimes every 18 seconds
    chimeInterval = setInterval(() => {
      if (isPlaying) {
        playTempleChime();
      }
    }, 18000);

    // Initial gentle chime after 1.5 seconds
    setTimeout(() => {
      if (isPlaying) playTempleChime();
    }, 1500);

    // Fade in master volume gracefully
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 2.5);
  }

  // Auspicious resonant temple bell (Ghanta) sound
  function playTempleChime() {
    if (!audioCtx || !isPlaying) return;

    const chimeFreqs = [587.33, 880, 1174.66]; // D5, A5, D6 harmonic chime
    chimeFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04 / (i + 1), audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(audioCtx.currentTime + 4.5);
    });
  }

  function stopDrone() {
    if (chimeInterval) {
      clearInterval(chimeInterval);
      chimeInterval = null;
    }

    if (masterGain && audioCtx) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);

      setTimeout(() => {
        tanpuraNodes.forEach(node => {
          try { node.stop(); } catch (e) {}
        });
        tanpuraNodes = [];
      }, 1300);
    }
  }

  function toggleAudio() {
    // If an external MP3 file is present and loaded
    if (bgAudioElement && bgAudioElement.src && !bgAudioElement.error) {
      if (bgAudioElement.paused) {
        bgAudioElement.play().then(() => {
          isPlaying = true;
          updateAudioUI(true);
        }).catch(() => {
          // Fallback to Web Audio Synth if audio element was blocked
          fallbackToSynth();
        });
      } else {
        bgAudioElement.pause();
        isPlaying = false;
        updateAudioUI(false);
      }
      return;
    }

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
      if (audioText) audioText.textContent = 'Music: Paused';
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }

  // Expose global controller for page entry
  window.WeddingAudio = {
    toggle: toggleAudio,
    isPlaying: () => isPlaying
  };
})();

