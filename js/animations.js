/**
 * GSAP Animations & Living Cinematic Parallax Controller
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * 1. 8-Stage Cinematic Opening Sequence
 * 2. Continuous Subtle Ambient Camera Breathe
 * 3. Genuine Multi-Layer 3D Cursor-Responsive Parallax
 * 4. Touch Orientation & Mobile Idle Living Motion
 * 5. ScrollTrigger Section Content Reveals
 */

(function() {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAnimations() {
    if (typeof gsap === 'undefined') {
      // Fallback if GSAP is unavailable: make all elements immediately visible
      document.querySelectorAll('.reveal-item, .reveal-fade').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-item, .reveal-fade').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Register ScrollTrigger if loaded
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
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
    // 1. Cinematic 8-Stage Opening Sequence
    // ------------------------------------------------------------------------
    const heroTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        startAmbientCameraBreathe();
      }
    });

    // Stage 1: Soft sunrise atmosphere (sky & light rays fade in with soft glow, 0.0s - 1.8s)
    heroTl
      .fromTo(layerSky,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.0 }
      )
      .fromTo(layerLightRays,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 2.2 },
        '-=1.8'
      )
      // Stage 2: Ambient light brightens & golden sun orb pulses (0.3s - 2.0s)
      .fromTo(goldenSunOrb,
        { scale: 0.75, opacity: 0 },
        { scale: 1, opacity: 0.55, duration: 2.0 },
        '-=1.9'
      )
      .fromTo(layerCursorGlow,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 0.65, duration: 2.0 },
        '-=1.8'
      )
      // Stage 3: Temple details emerge with gentle scale/depth push (0.5s - 2.2s)
      .fromTo(layerTemple,
        { scale: 1.11, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 2.2 },
        '-=1.9'
      )
      // Stage 4: Decorative framing elements (torana arch, side pillars, foreground deepams, 0.8s - 2.2s)
      .fromTo(layerArch,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 0.90, duration: 1.5 },
        '-=1.6'
      )
      .fromTo(layerPillarLeft,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 0.65, duration: 1.4 },
        '-=1.4'
      )
      .fromTo(layerPillarRight,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 0.65, duration: 1.4 },
        '-=1.4'
      )
      .fromTo([diyaLeft, diyaRight].filter(Boolean),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, stagger: 0.15 },
        '-=1.2'
      )
      // Stage 5: Sacred invocation crest fades in smoothly with warm backdrop (1.2s - 2.0s)
      .fromTo('.sacred-invocation',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 },
        '-=1.1'
      )
      .fromTo('.hero-badge',
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 },
        '-=0.9'
      )
      // Stage 6: "Amrutha K.V." reveals with vertical cascade and gold shimmer (1.5s - 2.5s)
      .fromTo(coupleNames[0],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=0.7'
      )
      // Stage 7: Ampersand scales up, divider lines draw outward, and "Mohan Kumar P.A." reveals (1.8s - 2.8s)
      .fromTo('.couple-ampersand',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 0.95, duration: 0.9 },
        '-=0.9'
      )
      .fromTo(coupleNames[1],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=0.7'
      )
      // Stage 8: Rangoli motif, invitation quote, action buttons & scroll hint settle (2.2s - 3.2s)
      .fromTo('.ornament-divider',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.85, duration: 0.8 },
        '-=0.8'
      )
      .fromTo('.invitation-quote',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.7'
      )
      .fromTo('.hero-actions',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.7'
      )
      .fromTo('.scroll-hint',
        { opacity: 0 },
        { opacity: 0.85, duration: 1.0 },
        '-=0.5'
      );

    // ------------------------------------------------------------------------
    // 2. Continuous Subtle Ambient Camera Breathe
    // ------------------------------------------------------------------------
    function startAmbientCameraBreathe() {
      if (!parallaxScene) return;
      // Gentle cinematic breathing scale on the background scene
      gsap.to(parallaxScene, {
        scale: 1.018,
        duration: 8.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // ------------------------------------------------------------------------
    // 3. Genuine Multi-Layer 3D Cursor-Responsive Parallax (Desktop)
    // ------------------------------------------------------------------------
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (heroStage && !isTouchDevice) {
      // Perspective scene 3D rotation (scene tilts gently; text outside remains rock-solid)
      const setSceneRotY = parallaxScene ? gsap.quickTo(parallaxScene, 'rotationY', { duration: 1.8, ease: 'power2.out' }) : null;
      const setSceneRotX = parallaxScene ? gsap.quickTo(parallaxScene, 'rotationX', { duration: 1.8, ease: 'power2.out' }) : null;

      // Layer 1: Distant sky (~4px)
      const setSkyX = layerSky ? gsap.quickTo(layerSky, 'x', { duration: 2.2, ease: 'power2.out' }) : null;
      const setSkyY = layerSky ? gsap.quickTo(layerSky, 'y', { duration: 2.2, ease: 'power2.out' }) : null;

      // Layer 1.5: Volumetric light rays (~7px)
      const setRaysX = layerLightRays ? gsap.quickTo(layerLightRays, 'x', { duration: 2.0, ease: 'power2.out' }) : null;
      const setRaysY = layerLightRays ? gsap.quickTo(layerLightRays, 'y', { duration: 2.0, ease: 'power2.out' }) : null;

      // Layer 2: Central temple gopuram (~10px)
      const setTempleX = layerTemple ? gsap.quickTo(layerTemple, 'x', { duration: 1.8, ease: 'power2.out' }) : null;
      const setTempleY = layerTemple ? gsap.quickTo(layerTemple, 'y', { duration: 1.8, ease: 'power2.out' }) : null;

      // Layer 3: Middle torana mandapam arch (~14px)
      const setArchX = layerArch ? gsap.quickTo(layerArch, 'x', { duration: 1.5, ease: 'power2.out' }) : null;
      const setArchY = layerArch ? gsap.quickTo(layerArch, 'y', { duration: 1.5, ease: 'power2.out' }) : null;

      // Layer 4: Foreground framing carved stone pillars (~22px with subtle opposing 3D tilt)
      const setPillarLeftX = layerPillarLeft ? gsap.quickTo(layerPillarLeft, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
      const setPillarLeftY = layerPillarLeft ? gsap.quickTo(layerPillarLeft, 'y', { duration: 1.2, ease: 'power2.out' }) : null;
      const setPillarLeftRotY = layerPillarLeft ? gsap.quickTo(layerPillarLeft, 'rotationY', { duration: 1.2, ease: 'power2.out' }) : null;

      const setPillarRightX = layerPillarRight ? gsap.quickTo(layerPillarRight, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
      const setPillarRightY = layerPillarRight ? gsap.quickTo(layerPillarRight, 'y', { duration: 1.2, ease: 'power2.out' }) : null;
      const setPillarRightRotY = layerPillarRight ? gsap.quickTo(layerPillarRight, 'rotationY', { duration: 1.2, ease: 'power2.out' }) : null;

      // Layer 4.5: Foreground auspicious temple deepams (~22px)
      const setDiyaLeftX = diyaLeft ? gsap.quickTo(diyaLeft, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
      const setDiyaLeftY = diyaLeft ? gsap.quickTo(diyaLeft, 'y', { duration: 1.2, ease: 'power2.out' }) : null;
      const setDiyaRightX = diyaRight ? gsap.quickTo(diyaRight, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
      const setDiyaRightY = diyaRight ? gsap.quickTo(diyaRight, 'y', { duration: 1.2, ease: 'power2.out' }) : null;

      // Layer 5: Ambient cursor glow (~32px)
      const setGlowX = layerCursorGlow ? gsap.quickTo(layerCursorGlow, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
      const setGlowY = layerCursorGlow ? gsap.quickTo(layerCursorGlow, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

      // Normalized pointer tracking (-1 to +1)
      const onMouseMove = (e) => {
        const normX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
        const normY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));

        // Subtle 3D perspective rotation on background scene (1.0deg horiz, 0.7deg vert)
        if (setSceneRotY) setSceneRotY(normX * 1.0);
        if (setSceneRotX) setSceneRotX(-normY * 0.7);

        // Layer 1: Sky (~4px)
        if (setSkyX) {
          setSkyX(normX * 4);
          setSkyY(normY * 3);
        }

        // Layer 1.5: Light rays (~7px)
        if (setRaysX) {
          setRaysX(normX * 7);
          setRaysY(normY * 5);
        }

        // Layer 2: Main temple & gopuram (~10px)
        if (setTempleX) {
          setTempleX(normX * 10);
          setTempleY(normY * 7);
        }

        // Layer 3: Torana arch with bells (~14px)
        if (setArchX) {
          setArchX(normX * 14);
          setArchY(normY * 9);
        }

        // Layer 4: Foreground pillars (~22px, subtle perspective opposing movement)
        if (setPillarLeftX) {
          setPillarLeftX(-normX * 22);
          setPillarLeftY(-normY * 15);
          if (setPillarLeftRotY) setPillarLeftRotY(normX * 1.6);
        }

        if (setPillarRightX) {
          setPillarRightX(normX * 22);
          setPillarRightY(-normY * 15);
          if (setPillarRightRotY) setPillarRightRotY(-normX * 1.6);
        }

        // Layer 4.5: Foreground deepams
        if (setDiyaLeftX) {
          setDiyaLeftX(-normX * 24);
          setDiyaLeftY(-normY * 16);
        }
        if (setDiyaRightX) {
          setDiyaRightX(normX * 24);
          setDiyaRightY(-normY * 16);
        }

        // Layer 5: Ambient cursor glow (~32px)
        if (setGlowX) {
          setGlowX(normX * 32);
          setGlowY(normY * 22);
        }
      };

      // Smooth return to initial state when pointer leaves hero stage
      const onMouseLeave = () => {
        if (parallaxScene) {
          gsap.to(parallaxScene, {
            rotationY: 0,
            rotationX: 0,
            duration: 1.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        const resetTargets = [
          layerSky,
          layerLightRays,
          layerTemple,
          layerArch,
          layerPillarLeft,
          layerPillarRight,
          diyaLeft,
          diyaRight,
          layerCursorGlow
        ].filter(Boolean);

        gsap.to(resetTargets, {
          x: 0,
          y: 0,
          rotationY: 0,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      heroStage.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }

    // ------------------------------------------------------------------------
    // 4. Touch Device Interaction (Orientation or Subtle Ambient Living Drift)
    // ------------------------------------------------------------------------
    if (isTouchDevice) {
      let hasOrientation = false;

      const handleOrientation = (e) => {
        if (e.gamma === null || e.beta === null) return;
        hasOrientation = true;

        const tiltX = Math.max(-1, Math.min(1, e.gamma / 25));
        const tiltY = Math.max(-1, Math.min(1, (e.beta - 40) / 25));

        if (layerSky) gsap.to(layerSky, { x: tiltX * 2, y: tiltY * 1.5, duration: 0.8, ease: 'power1.out' });
        if (layerLightRays) gsap.to(layerLightRays, { x: tiltX * 3.5, y: tiltY * 2.5, duration: 0.8, ease: 'power1.out' });
        if (layerTemple) gsap.to(layerTemple, { x: tiltX * 5, y: tiltY * 3.5, duration: 0.8, ease: 'power1.out' });
        if (layerArch) gsap.to(layerArch, { x: tiltX * 7, y: tiltY * 4.5, duration: 0.8, ease: 'power1.out' });
        if (layerPillarLeft) gsap.to(layerPillarLeft, { x: -tiltX * 10, y: -tiltY * 7, duration: 0.7, ease: 'power1.out' });
        if (layerPillarRight) gsap.to(layerPillarRight, { x: tiltX * 10, y: -tiltY * 7, duration: 0.7, ease: 'power1.out' });
        if (diyaLeft) gsap.to(diyaLeft, { x: -tiltX * 11, y: -tiltY * 8, duration: 0.7, ease: 'power1.out' });
        if (diyaRight) gsap.to(diyaRight, { x: tiltX * 11, y: -tiltY * 8, duration: 0.7, ease: 'power1.out' });
        if (layerCursorGlow) gsap.to(layerCursorGlow, { x: tiltX * 14, y: tiltY * 9, duration: 1.0, ease: 'power1.out' });
      };

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      }

      // Continuous ambient living movement if orientation is unavailable or stationary
      setTimeout(() => {
        if (!hasOrientation) {
          if (layerSky) {
            gsap.to(layerSky, {
              x: 2.5,
              y: 1.5,
              duration: 5.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
          if (layerTemple) {
            gsap.to(layerTemple, {
              x: 4,
              y: 2.5,
              duration: 4.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
          if (layerArch) {
            gsap.to(layerArch, {
              x: -3,
              y: -2,
              duration: 5.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
          if (layerPillarLeft) {
            gsap.to(layerPillarLeft, {
              x: -4,
              y: 2.5,
              duration: 4.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
          if (layerPillarRight) {
            gsap.to(layerPillarRight, {
              x: 4,
              y: 2.5,
              duration: 4.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        }
      }, 1500);
    }

    // ------------------------------------------------------------------------
    // 5. Scroll-Triggered Section Reveals (GSAP ScrollTrigger Architecture)
    // ------------------------------------------------------------------------
    if (typeof ScrollTrigger !== 'undefined') {
      // Family Lineage Cards Reveal
      gsap.from('.family-card', {
        scrollTrigger: {
          trigger: '.family-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.25,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Event Muhurtham & Reception Cards Reveal
      gsap.from('.event-card', {
        scrollTrigger: {
          trigger: '.events-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        stagger: 0.3,
        duration: 1.3,
        ease: 'power3.out'
      });

      // Countdown Timer Reveal
      gsap.from('.countdown-box', {
        scrollTrigger: {
          trigger: '.countdown-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        scale: 0.9,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: 'back.out(1.4)'
      });

      // Venue Section Card Reveal
      gsap.from('.venue-card-wrapper', {
        scrollTrigger: {
          trigger: '.venue-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
