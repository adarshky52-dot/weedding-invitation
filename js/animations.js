/**
 * Living Cinematic Animation & Parallax Controller
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * - Multi-depth 3D cursor-responsive parallax
 * - Continuous organic ambient camera breathing & environmental drift
 * - Touch device gyroscope / ambient living motion support
 * - Performance-optimized RAF engine with IntersectionObserver resource pausing
 * - Smooth scroll-triggered section reveals
 * - Full prefers-reduced-motion accessibility compliance
 */

(function() {
  'use strict';

  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAnimations() {
    // ------------------------------------------------------------------------
    // 0. Accessibility Fallback for Reduced Motion
    // ------------------------------------------------------------------------
    if (prefersReducedMotion) {
      document.querySelectorAll('.scroll-reveal, .reveal-item, .reveal-fade').forEach(el => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
      return;
    }

    // Cache key DOM elements
    const heroStage = document.getElementById('hero');
    const parallaxScene = document.getElementById('parallax-scene');
    const layerSky = document.querySelector('.layer-sky');
    const layerLightRays = document.querySelector('.layer-light-rays');
    const layerTemple = document.querySelector('.layer-temple-photo');
    const layerArch = document.querySelector('.layer-arch');
    const layerPillarLeft = document.querySelector('.layer-pillar-left');
    const layerPillarRight = document.querySelector('.layer-pillar-right');
    const layerCursorGlow = document.querySelector('.layer-cursor-glow');
    const diyaLeft = document.querySelector('.foreground-diya.diya-left');
    const diyaRight = document.querySelector('.foreground-diya.diya-right');
    const goldenSunOrb = document.querySelector('.golden-sun-orb');
    const coupleNames = document.querySelectorAll('.couple-name');

    // ------------------------------------------------------------------------
    // 1. Cinematic Opening Sequence (Dual Mode: GSAP if present, CSS/RAF if offline)
    // ------------------------------------------------------------------------
    const hasGsap = typeof gsap !== 'undefined';

    if (hasGsap) {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Stage 1: Sunrise Sky & Light Rays
      heroTl
        .fromTo(layerSky, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.0 })
        .fromTo(layerLightRays, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2.2 }, '-=1.8')
        // Stage 2: Sun Orb & Ambient Cursor Glow
        .fromTo(goldenSunOrb, { scale: 0.75, opacity: 0 }, { scale: 1, opacity: 0.55, duration: 2.0 }, '-=1.9')
        .fromTo(layerCursorGlow, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.65, duration: 2.0 }, '-=1.8')
        // Stage 3: Temple Details Emerge
        .fromTo(layerTemple, { scale: 1.11, opacity: 0 }, { scale: 1.05, opacity: 1, duration: 2.2 }, '-=1.9')
        // Stage 4: Mandapam Arch & Dravidian Pillars
        .fromTo(layerArch, { y: -30, opacity: 0 }, { y: 0, opacity: 0.90, duration: 1.5 }, '-=1.6')
        .fromTo(layerPillarLeft, { x: -30, opacity: 0 }, { x: 0, opacity: 0.65, duration: 1.4 }, '-=1.4')
        .fromTo(layerPillarRight, { x: 30, opacity: 0 }, { x: 0, opacity: 0.65, duration: 1.4 }, '-=1.4')
        .fromTo([diyaLeft, diyaRight].filter(Boolean), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.15 }, '-=1.2')
        // Stage 5: Sacred Invocation Crest
        .fromTo('.sacred-invocation', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, '-=1.1')
        .fromTo('.hero-badge', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 }, '-=0.9')
        // Stage 6: Couple Names & Ampersand
        .fromTo(coupleNames[0], { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.7')
        .fromTo('.couple-ampersand', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 0.95, duration: 0.9 }, '-=0.9')
        .fromTo(coupleNames[1], { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.7')
        // Stage 7: Rangoli Divider, Invitation Quote, Action Buttons & Scroll Hint
        .fromTo('.ornament-divider', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.8 }, '-=0.8')
        .fromTo('.invitation-quote', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.7')
        .fromTo('.hero-actions', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.7')
        .fromTo('.scroll-hint', { opacity: 0 }, { opacity: 0.85, duration: 1.0 }, '-=0.5');
    } else {
      // Offline fallback: smooth, staggered CSS entrance
      const heroContentEls = [
        { sel: '.sacred-invocation', delay: '0.2s' },
        { sel: '.hero-badge', delay: '0.4s' },
        { sel: '.couple-names-wrapper', delay: '0.7s' },
        { sel: '.ornament-divider', delay: '1.0s' },
        { sel: '.invitation-quote', delay: '1.2s' },
        { sel: '.hero-actions', delay: '1.4s' },
        { sel: '.scroll-hint', delay: '1.7s' }
      ];

      heroContentEls.forEach(item => {
        const el = document.querySelector(item.sel);
        if (el) {
          el.style.animation = `heroFadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay} backwards`;
        }
      });
    }

    // ------------------------------------------------------------------------
    // 2. High-Performance Multi-Layer Parallax & Ambient Motion Engine
    // ------------------------------------------------------------------------
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollPillarOffset = 0;
    let scrollArchOffset = 0;

    let heroVisible = true;
    let rafId = null;

    // Smooth lerp helper
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    // Main 60fps RAF loop
    function animateHeroEnvironment(timestamp) {
      if (!heroVisible) return;

      // Smooth interpolation towards mouse/device target
      currentX = lerp(currentX, targetX, 0.055);
      currentY = lerp(currentY, targetY, 0.055);

      // Organic sinusoidal ambient breathing (scene stays alive even when idle)
      const t = timestamp || performance.now();
      const ambX = Math.sin(t * 0.0005) * 2.5;
      const ambY = Math.cos(t * 0.0007) * 1.8;

      // 3D Perspective Rotation on background scene wrapper
      if (parallaxScene) {
        const rotY = (currentX * 1.0) + (ambX * 0.15);
        const rotX = (-currentY * 0.7) - (ambY * 0.12);
        parallaxScene.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      }

      // Layer 1: Distant Sunrise Sky (~4px)
      if (layerSky) {
        const sx = (currentX * 4 + ambX * 0.4).toFixed(1);
        const sy = (currentY * 3 + ambY * 0.4).toFixed(1);
        layerSky.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      }

      // Layer 1.5: Volumetric Sunrise Light Rays (~7px)
      if (layerLightRays) {
        const rx = (currentX * 7 + ambX * 0.7).toFixed(1);
        const ry = (currentY * 5 + ambY * 0.6).toFixed(1);
        layerLightRays.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      // Layer 2: Central Temple Gopuram & Courtyard (~10px)
      if (layerTemple) {
        const tx = (currentX * 10 + ambX * 1.0).toFixed(1);
        const ty = (currentY * 7 + ambY * 0.8).toFixed(1);
        layerTemple.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      // Layer 3: Torana Mandapam Arch (~14px)
      if (layerArch) {
        const ax = (currentX * 14 + ambX * 1.3).toFixed(1);
        const ay = (currentY * 9 + ambY * 1.0 - scrollArchOffset).toFixed(1);
        layerArch.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      }

      // Layer 4: Foreground Dravidian Pillars (~22px with opposing 3D depth and scroll push)
      if (layerPillarLeft) {
        const plx = (-currentX * 22 - ambX * 1.4 - scrollPillarOffset).toFixed(1);
        const ply = (-currentY * 15 - ambY * 1.0).toFixed(1);
        const plRotY = (currentX * 1.4).toFixed(2);
        layerPillarLeft.style.transform = `translate3d(${plx}px, ${ply}px, 0) rotateY(${plRotY}deg)`;
      }
      if (layerPillarRight) {
        const prx = (currentX * 22 + ambX * 1.4 + scrollPillarOffset).toFixed(1);
        const pry = (-currentY * 15 - ambY * 1.0).toFixed(1);
        const prRotY = (-currentX * 1.4).toFixed(2);
        layerPillarRight.style.transform = `translate3d(${prx}px, ${pry}px, 0) rotateY(${prRotY}deg)`;
      }

      // Layer 4.5: Foreground Deepams (~24px)
      if (diyaLeft) {
        const dlx = (-currentX * 24 - ambX * 1.5).toFixed(1);
        const dly = (-currentY * 16 - ambY * 1.1).toFixed(1);
        diyaLeft.style.transform = `translate3d(${dlx}px, ${dly}px, 0)`;
      }
      if (diyaRight) {
        const drx = (currentX * 24 + ambX * 1.5).toFixed(1);
        const dry = (-currentY * 16 - ambY * 1.1).toFixed(1);
        diyaRight.style.transform = `translate3d(${drx}px, ${dry}px, 0)`;
      }

      // Layer 5: Ambient Cursor Glow (~32px)
      if (layerCursorGlow) {
        const gx = (currentX * 32).toFixed(1);
        const gy = (currentY * 22).toFixed(1);
        layerCursorGlow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      }

      rafId = requestAnimationFrame(animateHeroEnvironment);
    }

    // ------------------------------------------------------------------------
    // 3. User Interaction Listeners (Desktop Mouse & Mobile DeviceOrientation)
    // ------------------------------------------------------------------------
    if (!isTouchDevice && heroStage) {
      window.addEventListener('mousemove', (e) => {
        targetX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
        targetY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      }, { passive: true });

      heroStage.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      }, { passive: true });
    }

    if (isTouchDevice && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          targetX = Math.max(-1, Math.min(1, e.gamma / 28));
          targetY = Math.max(-1, Math.min(1, (e.beta - 42) / 28));
        }
      }, { passive: true });
    }

    // ------------------------------------------------------------------------
    // 4. Parallax & Ambient Motion Engine (Active Across Entire Journey)
    // ------------------------------------------------------------------------
    // Start ambient animation loop
    rafId = requestAnimationFrame(animateHeroEnvironment);

    // ------------------------------------------------------------------------
    // 5. Scroll-Triggered Section Entrances (IntersectionObserver)
    // ------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // ------------------------------------------------------------------------
    // 6. PHASE 7: Connected Cinematic Viewport Stage & Continuous Camera Flow
    // ------------------------------------------------------------------------
    const stageScene1 = document.getElementById('stage-scene-1');
    const stageScene2 = document.getElementById('stage-scene-2');
    const stageScene3 = document.getElementById('stage-scene-3');
    const stageScene4 = document.getElementById('stage-scene-4');
    const stageScene5 = document.getElementById('stage-scene-5');
    const stageScene6 = document.getElementById('stage-scene-6');

    const secFamily = document.getElementById('family');
    const secEvents = document.getElementById('events');
    const secCountdown = document.getElementById('countdown');
    const secVenue = document.getElementById('venue');
    const secClosing = document.getElementById('closing');

    const stagePillars = document.querySelectorAll('.stage-framing-pillar');

    if (stageScene1 && stageScene2 && stageScene3 && stageScene4 && stageScene5 && stageScene6) {
      let isStageTicking = false;

      function clamp(min, max, val) {
        return Math.max(min, Math.min(max, val));
      }

      function updateCinematicStage() {
        const vh = window.innerHeight;

        // Transition progress points (0.0 = previous scene fully active, 1.0 = next scene fully active)
        // Transition 1: Hero -> Family
        const famRect = secFamily ? secFamily.getBoundingClientRect() : { top: vh * 2 };
        const t1 = clamp(0, 1, (vh - famRect.top) / (0.85 * vh));

        // Transition 2: Family -> Events
        const eveRect = secEvents ? secEvents.getBoundingClientRect() : { top: vh * 2 };
        const t2 = clamp(0, 1, (vh - eveRect.top) / (0.85 * vh));

        // Transition 3: Events -> Countdown
        const countRect = secCountdown ? secCountdown.getBoundingClientRect() : { top: vh * 2 };
        const t3 = clamp(0, 1, (vh - countRect.top) / (0.85 * vh));

        // Transition 4: Countdown -> Venue
        const venRect = secVenue ? secVenue.getBoundingClientRect() : { top: vh * 2 };
        const t4 = clamp(0, 1, (vh - venRect.top) / (0.85 * vh));

        // Transition 5: Venue -> Closing
        const closeRect = secClosing ? secClosing.getBoundingClientRect() : { top: vh * 2 };
        const t5 = clamp(0, 1, (vh - closeRect.top) / (0.85 * vh));

        if (prefersReducedMotion) {
          // Accessibility fallback: Simple clean opacities without camera translation
          if (t1 < 0.5) {
            stageScene1.style.opacity = '1'; stageScene2.style.opacity = '0';
            stageScene3.style.opacity = '0'; stageScene4.style.opacity = '0';
            stageScene5.style.opacity = '0'; stageScene6.style.opacity = '0';
          } else if (t2 < 0.5) {
            stageScene1.style.opacity = '0'; stageScene2.style.opacity = '1';
            stageScene3.style.opacity = '0'; stageScene4.style.opacity = '0';
            stageScene5.style.opacity = '0'; stageScene6.style.opacity = '0';
          } else if (t3 < 0.5) {
            stageScene1.style.opacity = '0'; stageScene2.style.opacity = '0';
            stageScene3.style.opacity = '1'; stageScene4.style.opacity = '0';
            stageScene5.style.opacity = '0'; stageScene6.style.opacity = '0';
          } else if (t4 < 0.5) {
            stageScene1.style.opacity = '0'; stageScene2.style.opacity = '0';
            stageScene3.style.opacity = '0'; stageScene4.style.opacity = '1';
            stageScene5.style.opacity = '0'; stageScene6.style.opacity = '0';
          } else if (t5 < 0.5) {
            stageScene1.style.opacity = '0'; stageScene2.style.opacity = '0';
            stageScene3.style.opacity = '0'; stageScene4.style.opacity = '0';
            stageScene5.style.opacity = '1'; stageScene6.style.opacity = '0';
          } else {
            stageScene1.style.opacity = '0'; stageScene2.style.opacity = '0';
            stageScene3.style.opacity = '0'; stageScene4.style.opacity = '0';
            stageScene5.style.opacity = '0'; stageScene6.style.opacity = '1';
          }
          isStageTicking = false;
          return;
        }

        // ====================================================================
        // REAL CONNECTED ARCHITECTURAL CAMERA SCROLL FLOW (Continuous Progression)
        // ====================================================================

        const famImg = stageScene2.querySelector('.stage-scene-img');
        const eveImg = stageScene3.querySelector('.stage-scene-img');
        const countImg = stageScene4.querySelector('.stage-scene-img');
        const venImg = stageScene5.querySelector('.stage-scene-img');
        const closeImg = stageScene6.querySelector('.stage-scene-img');

        // Update continuous pillar & arch scroll offsets for unified 3D camera
        scrollPillarOffset = 45 * clamp(0, 1, t1);
        scrollArchOffset = 35 * clamp(0, 1, t1);

        // Scene 1 -> Scene 2: Outer Gateway Walk-In & Aisle Perspective Push (Smooth Illumination Crossfade)
        if (t1 < 1) {
          const s1Opacity = clamp(0, 1, 1 - Math.pow(t1, 1.4));
          const s2Opacity = clamp(0, 1, Math.pow(t1, 0.75));

          stageScene1.style.opacity = s1Opacity.toFixed(3);
          stageScene2.style.opacity = s2Opacity.toFixed(3);
          stageScene3.style.opacity = '0';
          stageScene4.style.opacity = '0';
          stageScene5.style.opacity = '0';
          stageScene6.style.opacity = '0';

          stageScene1.classList.toggle('is-active', s1Opacity > 0.02);
          stageScene2.classList.toggle('is-active', s2Opacity > 0.02);

          // Camera push forward into gateway
          const pushScale = (1.0 + 0.08 * t1).toFixed(3);
          const pushY = (-24 * t1).toFixed(1);
          stageScene1.style.transform = `scale(${pushScale}) translate3d(0, ${pushY}px, 0)`;

          // Inner Mahamandapa colonnade emerges from depth
          if (famImg) {
            const famScale = (0.95 + 0.05 * t1).toFixed(3);
            const famY = (25 * (1 - t1)).toFixed(1);
            famImg.style.transform = `scale(${famScale}) translate3d(0, ${famY}px, 0)`;
          }
        }
        // Scene 2 -> Scene 3: Colonnade Aisle Track -> Wedding Mandapam
        else if (t2 < 1) {
          const s2Opacity = clamp(0, 1, 1 - Math.pow(t2, 1.4));
          const s3Opacity = clamp(0, 1, Math.pow(t2, 0.75));

          stageScene1.style.opacity = '0';
          stageScene2.style.opacity = s2Opacity.toFixed(3);
          stageScene3.style.opacity = s3Opacity.toFixed(3);
          stageScene4.style.opacity = '0';
          stageScene5.style.opacity = '0';
          stageScene6.style.opacity = '0';

          stageScene2.classList.toggle('is-active', s2Opacity > 0.02);
          stageScene3.classList.toggle('is-active', s3Opacity > 0.02);

          // Camera tracks down colonnade aisle
          if (famImg) {
            const famScale = (1.0 + 0.06 * t2).toFixed(3);
            const famY = (-20 * t2).toFixed(1);
            famImg.style.transform = `scale(${famScale}) translate3d(0, ${famY}px, 0)`;
          }

          // Altar with marigolds and lamps arrives into focus
          if (eveImg) {
            const eveScale = (0.96 + 0.04 * t2).toFixed(3);
            const eveY = (20 * (1 - t2)).toFixed(1);
            eveImg.style.transform = `scale(${eveScale}) translate3d(0, ${eveY}px, 0)`;
          }
        }
        // Scene 3 -> Scene 4: Covered Mandapam -> Sunlit Golden Courtyard
        else if (t3 < 1) {
          const s3Opacity = clamp(0, 1, 1 - Math.pow(t3, 1.4));
          const s4Opacity = clamp(0, 1, Math.pow(t3, 0.75));

          stageScene1.style.opacity = '0';
          stageScene2.style.opacity = '0';
          stageScene3.style.opacity = s3Opacity.toFixed(3);
          stageScene4.style.opacity = s4Opacity.toFixed(3);
          stageScene5.style.opacity = '0';
          stageScene6.style.opacity = '0';

          stageScene3.classList.toggle('is-active', s3Opacity > 0.02);
          stageScene4.classList.toggle('is-active', s4Opacity > 0.02);

          // Lateral camera pan out into open courtyard
          if (eveImg) {
            const eveX = (-45 * t3).toFixed(1);
            const eveScale = (1.0 + 0.03 * t3).toFixed(3);
            eveImg.style.transform = `translate3d(${eveX}px, 0, 0) scale(${eveScale})`;
          }

          // Sunlit courtyard colonnade slides in gracefully from right
          if (countImg) {
            const countX = (45 * (1 - t3)).toFixed(1);
            const countScale = (0.97 + 0.03 * t3).toFixed(3);
            countImg.style.transform = `translate3d(${countX}px, 0, 0) scale(${countScale})`;
          }
        }
        // Scene 4 -> Scene 5: Courtyard -> Stone Pavilion Entrance
        else if (t4 < 1) {
          const s4Opacity = clamp(0, 1, 1 - Math.pow(t4, 1.4));
          const s5Opacity = clamp(0, 1, Math.pow(t4, 0.75));

          stageScene1.style.opacity = '0';
          stageScene2.style.opacity = '0';
          stageScene3.style.opacity = '0';
          stageScene4.style.opacity = s4Opacity.toFixed(3);
          stageScene5.style.opacity = s5Opacity.toFixed(3);
          stageScene6.style.opacity = '0';

          stageScene4.classList.toggle('is-active', s4Opacity > 0.02);
          stageScene5.classList.toggle('is-active', s5Opacity > 0.02);

          // Step along the courtyard stone plinth
          if (countImg) {
            const countScale = (1.0 + 0.05 * t4).toFixed(3);
            const countY = (-20 * t4).toFixed(1);
            countImg.style.transform = `scale(${countScale}) translate3d(0, ${countY}px, 0)`;
          }

          // Grand Dravidian stone pavilion entrance anchors
          if (venImg) {
            const venScale = (0.96 + 0.04 * t4).toFixed(3);
            const venY = (24 * (1 - t4)).toFixed(1);
            venImg.style.transform = `scale(${venScale}) translate3d(0, ${venY}px, 0)`;
          }
        }
        // Scene 5 -> Scene 6: Pavilion Plinth -> Twilight Sunset Sky & Horizon
        else {
          const s5Opacity = clamp(0, 1, 1 - Math.pow(t5, 1.4));
          const s6Opacity = clamp(0, 1, Math.pow(t5, 0.75));

          stageScene1.style.opacity = '0';
          stageScene2.style.opacity = '0';
          stageScene3.style.opacity = '0';
          stageScene4.style.opacity = '0';
          stageScene5.style.opacity = s5Opacity.toFixed(3);
          stageScene6.style.opacity = s6Opacity.toFixed(3);

          stageScene5.classList.toggle('is-active', s5Opacity > 0.02);
          stageScene6.classList.toggle('is-active', s6Opacity > 0.02);

          // Camera tilts skyward: Pavilion plinth descends gently
          if (venImg) {
            const venY = (45 * t5).toFixed(1);
            const venScale = (1.0 + 0.02 * t5).toFixed(3);
            venImg.style.transform = `translate3d(0, ${venY}px, 0) scale(${venScale})`;
          }

          // Peach sunset sky & temple silhouette descend into position
          if (closeImg) {
            const closeY = (-30 * (1 - t5)).toFixed(1);
            const closeScale = (0.98 + 0.02 * t5).toFixed(3);
            closeImg.style.transform = `translate3d(0, ${closeY}px, 0) scale(${closeScale})`;
          }
        }

        isStageTicking = false;
      }

      window.addEventListener('scroll', () => {
        if (!isStageTicking) {
          requestAnimationFrame(updateCinematicStage);
          isStageTicking = true;
        }
      }, { passive: true });

      // Run immediately on page load to configure initial scene state
      updateCinematicStage();
    }
  }

  // Initialize once DOM is fully parsed
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
