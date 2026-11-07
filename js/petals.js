/**
 * Petals & Sacred Stardust Particle Simulation (Canvas 2D)
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * High-performance 60fps single-canvas simulation:
 * 1. South Indian temple flower petals (Jasmine white & Marigold gold) with 3D tumbling & depth-of-field
 * 2. Floating golden dust motes drifting through sunrise rays with gentle twinkling
 * 3. Reactive cursor breeze & proximity deflection
 * 4. Refined, low-density golden stardust cursor trail
 */

(function() {
  'use strict';

  // Check reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    return;
  }

  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let animationFrameId = null;
  let isRunning = true;

  // Breeze velocity influences
  let mouseBreezeX = 0;
  let targetBreezeX = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let pointerActive = false;

  // Dynamic device-based density tuning (keeps 60fps and elegant whisper-light density)
  const isMobile = width <= 768;
  const PETAL_COUNT = isMobile ? 6 : 10;
  const MOTE_COUNT = isMobile ? 18 : 32;
  const MAX_TRAIL_SPARKS = 18;

  // Petal Palette - Soft, translucent and elegant (Warm Sunset Temple Palette)
  const PETAL_TYPES = [
    // Jasmine Petals (Delicate Warm Ivory #F2E4CE / Pure White)
    {
      color1: 'rgba(255, 252, 246, 0.88)',
      color2: 'rgba(242, 228, 206, 0.68)',
      ratio: 1.75,
      type: 'jasmine'
    },
    // Sunset Peach & Soft Antique Gold Petals (#E8B58D & #D99A59)
    {
      color1: 'rgba(232, 181, 141, 0.82)',
      color2: 'rgba(217, 154, 89, 0.65)',
      ratio: 1.4,
      type: 'marigold'
    },
    // Soft Antique Gold Petals (#D99A59)
    {
      color1: 'rgba(242, 228, 206, 0.78)',
      color2: 'rgba(217, 154, 89, 0.55)',
      ratio: 1.5,
      type: 'gold'
    }
  ];

  // --------------------------------------------------------------------------
  // 1. Flower Petal Particle (Jasmine & Marigold)
  // --------------------------------------------------------------------------
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 50;
      this.z = Math.random() * 0.7 + 0.3; // Depth factor (0.3 = distant/small, 1.0 = close)
      
      // Slender, elegant petal size
      this.size = (Math.random() * 6 + 7) * this.z;
      this.type = PETAL_TYPES[Math.floor(Math.random() * PETAL_TYPES.length)];

      this.speedY = (Math.random() * 0.55 + 0.35) * this.z;
      this.speedX = (Math.random() * 0.3 - 0.15) * this.z;
      this.vx = 0;
      this.vy = 0;

      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() * 0.015 - 0.0075) * this.z;

      this.tilt = Math.random() * Math.PI;
      this.tiltSpeed = Math.random() * 0.02 + 0.008;

      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.014 + 0.007;
      this.swayRadius = (Math.random() * 1.2 + 0.5) * this.z;
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.rotation += this.rotationSpeed;
      this.tilt += this.tiltSpeed;

      // Cursor proximity repulsion: gently deflecting petals near the cursor
      if (pointerActive) {
        const dx = this.x - pointerX;
        const dy = this.y - pointerY;
        const distSq = dx * dx + dy * dy;
        const repulseRadius = 90;
        if (distSq < repulseRadius * repulseRadius && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repulseRadius) * 1.8 * this.z;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      // Smooth velocity damping
      this.vx *= 0.92;
      this.vy *= 0.92;

      // Vertical drift with dampening
      this.y += this.speedY + this.vy;

      // Horizontal sway + external cursor breeze
      this.x += Math.sin(this.swayAngle) * this.swayRadius + this.speedX + mouseBreezeX * this.z + this.vx;

      // Recycle when off screen
      if (this.y > height + 40) {
        this.reset();
      }
      if (this.x > width + 40) {
        this.x = -30;
      } else if (this.x < -40) {
        this.x = width + 30;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, Math.cos(this.tilt)); // 3D flip effect

      const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
      grad.addColorStop(0, this.type.color1);
      grad.addColorStop(1, this.type.color2);

      ctx.fillStyle = grad;
      ctx.beginPath();

      // Slender organic petal geometry
      const w = this.size * 0.58;
      const h = this.size * this.type.ratio;

      ctx.moveTo(0, -h);
      ctx.bezierCurveTo(w, -h * 0.5, w * 1.2, h * 0.4, 0, h);
      ctx.bezierCurveTo(-w * 1.2, h * 0.4, -w, -h * 0.5, 0, -h);
      ctx.closePath();

      // Subtle depth shadow on foreground petals
      if (this.z > 0.65) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
        ctx.shadowBlur = 4 * this.z;
        ctx.shadowOffsetY = 2 * this.z;
      }

      ctx.fill();
      ctx.restore();
    }
  }

  // --------------------------------------------------------------------------
  // 2. Floating Golden Dust Particle (Sacred Stardust / Sunbeam Mote)
  // --------------------------------------------------------------------------
  class GoldMote {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10 + Math.random() * 20;
      this.radius = Math.random() * 1.4 + 0.7; // 0.7px to 2.1px delicate mote
      this.z = Math.random() * 0.7 + 0.3;

      // Subtle upward convection drift (sacred stardust floating in warm air)
      this.speedY = -(Math.random() * 0.35 + 0.15) * this.z;
      this.speedX = (Math.random() * 0.2 - 0.1) * this.z;
      this.vx = 0;
      this.vy = 0;

      // Sinusoidal twinkling luminosity
      this.alpha = Math.random() * 0.5 + 0.2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.twinkleAngle += this.twinkleSpeed;
      const currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.twinkleAngle));

      // Cursor repulsion on dust
      if (pointerActive) {
        const dx = this.x - pointerX;
        const dy = this.y - pointerY;
        const distSq = dx * dx + dy * dy;
        const repulseRadius = 60;
        if (distSq < repulseRadius * repulseRadius && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repulseRadius) * 1.2 * this.z;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      this.vx *= 0.90;
      this.vy *= 0.90;

      this.y += this.speedY + this.vy;
      this.x += this.speedX + mouseBreezeX * 0.5 * this.z + this.vx;

      // Recycle when motes drift off top or sides
      if (this.y < -15) {
        this.reset();
      }
      if (this.x > width + 20) {
        this.x = -10;
      } else if (this.x < -20) {
        this.x = width + 10;
      }

      this.currentAlpha = currentAlpha;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      // Warm antique gold & ivory glowing dust
      ctx.fillStyle = `rgba(242, 228, 206, ${this.currentAlpha})`;
      if (this.radius > 1.2) {
        ctx.shadowColor = 'rgba(217, 154, 89, 0.7)';
        ctx.shadowBlur = 6;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // --------------------------------------------------------------------------
  // 3. Low-Density Gold Cursor Trail Sparkle (Micro-stardust)
  // --------------------------------------------------------------------------
  class CursorSpark {
    constructor(x, y) {
      this.x = x + (Math.random() * 10 - 5);
      this.y = y + (Math.random() * 10 - 5);
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8 - 0.3; // subtle rise
      this.radius = Math.random() * 1.8 + 0.8;
      this.life = 1.0;
      this.decay = Math.random() * 0.035 + 0.025; // Lasts ~0.5 - 0.7s
      this.color = Math.random() > 0.4 ? '217, 154, 89' : '242, 228, 206'; // Antique gold or ivory
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.radius *= 0.96;
    }

    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.2, this.radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.75})`;
      ctx.shadowColor = `rgba(${this.color}, 0.6)`;
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    }
  }

  // Particle instances
  const petals = [];
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  const motes = [];
  for (let i = 0; i < MOTE_COUNT; i++) {
    motes.push(new GoldMote());
  }

  const cursorSparks = [];

  // --------------------------------------------------------------------------
  // Animation Loop (60 FPS)
  // --------------------------------------------------------------------------
  function render() {
    if (!isRunning) return;

    // Smooth breeze damping
    mouseBreezeX += (targetBreezeX - mouseBreezeX) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw floating golden dust motes in background/midground
    for (let i = 0; i < motes.length; i++) {
      motes[i].update();
      motes[i].draw();
    }

    // 2. Draw flower petals (Jasmine & Marigold)
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    // 3. Draw cursor stardust trail sparks
    for (let i = cursorSparks.length - 1; i >= 0; i--) {
      const spark = cursorSparks[i];
      spark.update();
      if (spark.life <= 0) {
        cursorSparks.splice(i, 1);
      } else {
        spark.draw();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // --------------------------------------------------------------------------
  // Interactive Breeze & Cursor Trail Listener
  // --------------------------------------------------------------------------
  let lastX = 0;
  let lastTrailTime = 0;

  function handlePointerMove(e) {
    pointerActive = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    pointerX = clientX;
    pointerY = clientY;

    // Horizontal breeze acceleration
    const deltaX = (clientX - lastX) * 0.04;
    targetBreezeX = Math.max(Math.min(deltaX, 2.5), -2.5);
    lastX = clientX;

    // Spawn subtle gold trail stardust sparks (throttled every 35ms, max pool 18)
    const now = performance.now();
    if (now - lastTrailTime > 35 && cursorSparks.length < MAX_TRAIL_SPARKS) {
      cursorSparks.push(new CursorSpark(clientX, clientY));
      lastTrailTime = now;
    }

    // Reset breeze back to calm after a short delay
    clearTimeout(handlePointerMove.timer);
    handlePointerMove.timer = setTimeout(() => {
      targetBreezeX = 0;
      pointerActive = false;
    }, 450);
  }

  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  // Pause when tab is hidden to conserve CPU & battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      lastX = width / 2;
      render();
    }
  });

  // Start simulation loop
  render();
})();
