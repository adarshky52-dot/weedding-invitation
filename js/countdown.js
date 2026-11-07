/**
 * Wedding Event Countdown Timer
 * Amrutha & Mohan Kumar Wedding
 * Target Date: 6 December 2026, 08:30:00 IST (UTC+05:30)
 */

(function() {
  'use strict';

  // Target: December 6, 2026, 08:30 AM Indian Standard Time
  // 08:30 IST = 03:00 UTC. Date.UTC guarantees 100% cross-browser accuracy across all platforms.
  const TARGET_DATE = Date.UTC(2026, 11, 6, 3, 0, 0);

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const statusEl = document.getElementById('countdown-status');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  let timerInterval = null;

  function calculateCountdown(nowMs) {
    const distance = TARGET_DATE - nowMs;

    if (distance <= 0) {
      return {
        completed: true,
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      completed: false,
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  function updateCountdown() {
    const state = calculateCountdown(Date.now());

    daysEl.textContent = state.days;
    hoursEl.textContent = state.hours;
    minutesEl.textContent = state.minutes;
    secondsEl.textContent = state.seconds;

    if (state.completed) {
      if (statusEl) {
        statusEl.textContent = 'The Auspicious Muhurtham has begun!';
      }
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }

  // Initial immediate render
  updateCountdown();

  // Tick every second
  timerInterval = setInterval(updateCountdown, 1000);

  // Expose pure helper for automated verification and testing
  window.WeddingCountdown = {
    targetTimestamp: TARGET_DATE,
    calculate: calculateCountdown
  };
})();
