import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrollFrameEngine  — PERFORMANCE-OPTIMISED
 * ─────────────────────────────────────────
 * Key improvements over previous version:
 *  • No per-frame React state updates — progress/frame exposed via refs + optional callback.
 *  • rAF loop is SELF-TERMINATING: runs only while scroll targets are changing.
 *  • Image preloading tracked with a plain counter ref — only 2 setState calls total
 *    (one at 95 % loaded, one at 100 %).
 *  • Canvas size stored in refs; resize only resets when the image dimensions actually change.
 *  • Easing factor raised to 0.18 for a snappier, less laggy feel.
 *  • Scroll handler is throttled to one update per rAF to prevent handler pile-ups.
 */
const ScrollFrameEngine = ({
  frameCount = 250,
  startFrame = 1,
  framePath = (index) => `/Furniturescroll/frame_${index.toString().padStart(4, '0')}.webp`,
  scrollHeight = '500vh',
  children,
  onProgress,
  className = '',
}) => {
  const canvasRef   = useRef(null);
  const trackRef    = useRef(null);

  // Animation state — all plain refs, zero React re-renders during playback
  const currentFrameRef      = useRef(startFrame);
  const targetFrameRef       = useRef(startFrame);
  const lastRenderedFrameRef = useRef(-1);       // -1 forces first draw
  const currentProgressRef   = useRef(0);
  const targetProgressRef    = useRef(0);
  const rafRef               = useRef(null);
  const rafRunningRef        = useRef(false);

  // Momentum / inertia refs
  const scrollMomentumRef    = useRef(0);        // smoothed scroll velocity (frames/rAF)
  const coastVelRef          = useRef(0);        // active coasting velocity
  const isCoastingRef        = useRef(false);    // true during deceleration phase
  const lastScrollMsRef      = useRef(0);        // timestamp of last scroll event
  const prevTargetFrameRef   = useRef(startFrame); // previous target, for Δ velocity

  // Scroll throttle flag
  const scrollScheduledRef   = useRef(false);

  // Canvas intrinsic size cache — avoid resizing on every draw
  const canvasWRef = useRef(0);
  const canvasHRef = useRef(0);

  const imagesRef      = useRef([]);
  const loadedCountRef = useRef(0);   // plain ref, not state

  const [loadPercent, setLoadPercent] = useState(0);
  const [isReady,     setIsReady]     = useState(false);
  const [isVisible,   setIsVisible]   = useState(false);

  /* ── 1. PRELOAD IMAGES ──
     Only 2 React setState calls total: at 95 % and at 100 % loaded.
  ── */
  useEffect(() => {
    const totalFramesToLoad = frameCount - startFrame + 1;
    let ready95Fired = false;

    const images = [];
    imagesRef.current = images;
    loadedCountRef.current = 0;

    for (let i = startFrame; i <= frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      images[i] = img;

      img.onload = () => {
        loadedCountRef.current += 1;
        const pct = Math.min(100, Math.round((loadedCountRef.current / totalFramesToLoad) * 100));

        if (!ready95Fired && loadedCountRef.current >= totalFramesToLoad * 0.95) {
          ready95Fired = true;
          setLoadPercent(pct);
          setIsReady(true);
        } else if (loadedCountRef.current === totalFramesToLoad) {
          setLoadPercent(100);
        }
      };
    }

  }, [frameCount, startFrame]);

  /* ── 2. INTERSECTION OBSERVER ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── 3. DRAW FRAME — no canvas resize unless dimensions changed ── */
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[frameIndex];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    // Only resize canvas if needed (expensive operation)
    if (canvasWRef.current !== img.naturalWidth || canvasHRef.current !== img.naturalHeight) {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvasWRef.current = img.naturalWidth;
      canvasHRef.current = img.naturalHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  }, []);

  /* ── 4. INITIAL DRAW — draw first frame once any image loads ── */
  useEffect(() => {
    if (isReady) {
      const firstImg = imagesRef.current[startFrame];
      if (firstImg && firstImg.complete) {
        renderFrame(startFrame);
        lastRenderedFrameRef.current = startFrame;
      }
    }
  }, [isReady, renderFrame, startFrame]);

  /* ── 5. TWO-PHASE ANIMATION LOOP ──
   *
   *  PHASE 1 — ACTIVE SCROLL (user is scrolling):
   *    Direct frame tracking with gentle lerp. Stays tight to scroll position.
   *
   *  PHASE 2 — COAST (user lifted finger / stopped scrolling):
   *    Measured scroll velocity is used as initial momentum.
   *    Friction decays it at COAST_FRICTION per rAF frame (~60fps).
   *    COAST_FRICTION = 0.92 → velocity halves every ~8 frames ≈ 130 ms.
   *    Full stop takes ~30 frames ≈ 500 ms — feels like a natural deceleration.
   *
   *  Detection: if no scroll event fires for SCROLL_IDLE_MS, phase switches.
   * ── */
  const SCROLL_IDLE_MS  = 80;    // ms of silence = scroll stopped
  const COAST_FRICTION  = 0.92;  // velocity retained per frame during coast
  const COAST_MIN_VEL   = 0.08;  // frames/frame — stop coasting below this
  const ACTIVE_LERP     = 0.18;  // lerp strength while actively scrolling

  const startLoop = useCallback(() => {
    if (rafRunningRef.current) return;
    rafRunningRef.current = true;

    const loop = () => {
      const now      = performance.now();
      const msSince  = now - lastScrollMsRef.current;
      const isActive = msSince < SCROLL_IDLE_MS;

      // ─── Detect scroll-stop: launch coast phase ───
      if (!isActive && !isCoastingRef.current) {
        const vel = scrollMomentumRef.current;
        if (Math.abs(vel) > COAST_MIN_VEL) {
          isCoastingRef.current = true;
          coastVelRef.current   = vel;
        }
      }

      // ─── New scroll input cancels coast ───
      if (isActive && isCoastingRef.current) {
        isCoastingRef.current = false;
        coastVelRef.current   = 0;
      }

      let currentF = currentFrameRef.current;

      if (isCoastingRef.current) {
        /* ─── PHASE 2: COAST — friction deceleration ─── */
        coastVelRef.current *= COAST_FRICTION;
        currentF = currentF + coastVelRef.current;
        // Clamp to valid frame range
        currentF = Math.min(frameCount, Math.max(startFrame, currentF));
        currentFrameRef.current = currentF;

        // Keep target updated so spring doesn't fight momentum after coast
        targetFrameRef.current = currentF;

        // Coast complete?
        if (Math.abs(coastVelRef.current) < COAST_MIN_VEL) {
          isCoastingRef.current = false;
          coastVelRef.current   = 0;
          scrollMomentumRef.current = 0;
          // Snap to nearest integer frame cleanly
          const snapped = Math.round(currentF);
          currentFrameRef.current = snapped;
          targetFrameRef.current  = snapped;
          currentF = snapped;
        }

      } else {
        /* ─── PHASE 1: ACTIVE — lerp toward scroll target ─── */
        const targetF = targetFrameRef.current;
        const diff    = targetF - currentF;
        currentF += diff * ACTIVE_LERP;
        currentFrameRef.current = currentF;
      }

      // ─── Render frame if it changed ───
      const frameToRender = Math.round(currentF);
      if (frameToRender !== lastRenderedFrameRef.current) {
        lastRenderedFrameRef.current = frameToRender;
        renderFrame(frameToRender);
      }

      // ─── Progress bar (tracks frame position) ───
      const currentP = (currentF - startFrame) / Math.max(1, frameCount - startFrame);
      currentProgressRef.current = currentP;
      if (onProgress) onProgress(currentP, currentF);

      // ─── Settle check ───
      const targetF   = targetFrameRef.current;
      const fDiff     = Math.abs(targetF - currentF);
      const coasting  = isCoastingRef.current;
      const settled   = !coasting && fDiff < 0.1;

      if (settled) {
        // Final snap and stop loop
        const exact = Math.round(targetF);
        currentFrameRef.current = exact;
        if (exact !== lastRenderedFrameRef.current) {
          lastRenderedFrameRef.current = exact;
          renderFrame(exact);
        }
        const finalP = (exact - startFrame) / Math.max(1, frameCount - startFrame);
        currentProgressRef.current = finalP;
        if (onProgress) onProgress(finalP, exact);
        rafRunningRef.current = false;
        return; // EXIT
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [renderFrame, onProgress, frameCount, startFrame]);

  /* ── 6. SCROLL HANDLER — measures velocity + throttled to one rAF per burst ── */
  const handleScroll = useCallback(() => {
    if (!isVisible || !trackRef.current) return;
    if (scrollScheduledRef.current) return;
    scrollScheduledRef.current = true;

    requestAnimationFrame(() => {
      scrollScheduledRef.current = false;
      const track  = trackRef.current;
      if (!track) return;

      const rect     = track.getBoundingClientRect();
      const trackH   = track.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / trackH, 0), 1);
      const frameIndex = Math.min(
        frameCount,
        Math.max(startFrame, Math.floor(progress * (frameCount - startFrame + 1)) + startFrame)
      );

      // ── Measure scroll velocity (frames per rAF tick at 60fps) ──
      const now = performance.now();
      const dt  = now - lastScrollMsRef.current;
      if (dt > 0 && dt < 150) {
        const rawVel = (frameIndex - prevTargetFrameRef.current) * (16.67 / dt);
        // Smooth the velocity estimate with a short EMA
        scrollMomentumRef.current = scrollMomentumRef.current * 0.4 + rawVel * 0.6;
      }
      lastScrollMsRef.current    = now;
      prevTargetFrameRef.current = frameIndex;

      targetProgressRef.current = progress;
      targetFrameRef.current    = frameIndex;

      startLoop();
    });
  }, [isVisible, frameCount, startFrame, startLoop]);

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sync instantly on mount
    const track = trackRef.current;
    if (track) {
      const rect     = track.getBoundingClientRect();
      const trackH   = track.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / trackH, 0), 1);
      const frameIndex = Math.min(
        frameCount,
        Math.max(startFrame, Math.floor(progress * (frameCount - startFrame + 1)) + startFrame)
      );

      targetProgressRef.current    = progress;
      currentProgressRef.current   = progress;
      targetFrameRef.current       = frameIndex;
      currentFrameRef.current      = frameIndex;
      lastRenderedFrameRef.current = frameIndex;
      scrollMomentumRef.current    = 0;
      coastVelRef.current          = 0;
      isCoastingRef.current        = false;
      lastScrollMsRef.current      = performance.now();
      prevTargetFrameRef.current   = frameIndex;
      renderFrame(frameIndex);
      if (onProgress) onProgress(progress, frameIndex);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, handleScroll, onProgress, renderFrame, frameCount, startFrame]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pct = loadPercent;

  return (
    <div
      ref={trackRef}
      className={`scroll-video-track ${className}`}
      style={{ height: scrollHeight, position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {!isReady && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#000', zIndex: 10,
          }}>
            <div style={{
              width: 48, height: 48, marginBottom: 24,
              border: '2px solid rgba(255,255,255,0.1)',
              borderTop: '2px solid #fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{
              width: 200, height: 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 1, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6))',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <p style={{
              marginTop: 12, fontSize: 12, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
            }}>
              Loading {pct}%
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.4s ease',
            willChange: 'transform',      // promote to GPU compositing layer
          }}
        />

        {children && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {children}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScrollFrameEngine;
