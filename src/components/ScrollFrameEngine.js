import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrollFrameEngine
 * ─────────────────
 * Drives a sequence of image frames based on scroll position.
 * This replaces the video approach with a canvas approach, which provides
 * perfectly smooth frame-by-frame rendering and mobile support.
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
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  
  const currentFrameRef = useRef(startFrame);
  const targetFrameRef = useRef(startFrame);
  const lastRenderedFrameRef = useRef(startFrame);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  /* ── 1. PRELOAD IMAGES ── */
  useEffect(() => {
    let loaded = 0;
    const images = [];
    const totalFramesToLoad = frameCount - startFrame + 1;
    
    // We preload all frames into memory
    for (let i = startFrame; i <= frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (loaded >= totalFramesToLoad * 0.95) {
          // consider ready when 95% of frames are loaded to avoid waiting too long for a single dropped frame
          setIsReady(true);
        }
      };
      images[i] = img;
    }
    imagesRef.current = images;
  }, [frameCount, startFrame, framePath]);

  /* ── 2. INTERSECTION OBSERVER ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── 3. DRAW FRAME ── */
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    
    // Set internal canvas resolution to match the image
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  /* ── 4. INITIAL DRAW ── */
  useEffect(() => {
    // Draw the first frame as soon as it's available
    if (imagesLoaded > 0 && imagesRef.current[startFrame] && imagesRef.current[startFrame].complete) {
        renderFrame(startFrame);
    }
  }, [imagesLoaded, renderFrame, startFrame]);

  /* ── 5. SCROLL → SEEK LOOP ── */
  const handleScroll = useCallback(() => {
    if (!isVisible || !trackRef.current) return;

    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const trackH = track.offsetHeight - window.innerHeight;

    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / trackH, 0), 1);

    // Only update targets; the smooth loop handles rendering
    targetProgressRef.current = progress;
    const frameIndex = Math.min(frameCount, Math.max(startFrame, Math.floor(progress * (frameCount - startFrame + 1)) + startFrame));
    targetFrameRef.current = frameIndex;
  }, [isVisible, frameCount, startFrame]);

  // Smooth animation loop
  useEffect(() => {
    if (!isVisible) return;
    
    let animationFrameId;
    
    const loop = () => {
      const targetP = targetProgressRef.current;
      let currentP = currentProgressRef.current;
      const targetF = targetFrameRef.current;
      let currentF = currentFrameRef.current;
      
      const ease = 0.08; // Easing factor: higher for less lag and snappier deceleration
      
      let progressChanged = false;
      // Update progress smoothly
      if (Math.abs(targetP - currentP) > 0.00001) {
        currentP += (targetP - currentP) * ease;
        currentProgressRef.current = currentP;
        progressChanged = true;
      } else {
        currentP = targetP;
      }
      
      // Update frame smoothly
      if (Math.abs(targetF - currentF) > 0.001) {
        currentF += (targetF - currentF) * ease;
        currentFrameRef.current = currentF;
        progressChanged = true;
        
        const frameToRender = Math.round(currentF);
        if (frameToRender !== lastRenderedFrameRef.current) {
          lastRenderedFrameRef.current = frameToRender;
          renderFrame(frameToRender);
        }
      } else {
        currentF = targetF;
      }

      if (progressChanged && onProgress) {
        onProgress(currentP, currentF);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, renderFrame, onProgress]);

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Sync instantly on mount to avoid animating from 0 when restoring scroll position
    handleScroll();
    currentProgressRef.current = targetProgressRef.current;
    currentFrameRef.current = targetFrameRef.current;
    lastRenderedFrameRef.current = Math.round(targetFrameRef.current);
    renderFrame(lastRenderedFrameRef.current);
    if (onProgress) onProgress(currentProgressRef.current, currentFrameRef.current);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, handleScroll, onProgress, renderFrame]);

  const totalToLoad = frameCount - startFrame + 1;
  const loadPercent = Math.min(100, Math.round((imagesLoaded / totalToLoad) * 100));

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
                width: `${loadPercent}%`,
                background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6))',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <p style={{
              marginTop: 12, fontSize: 12, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
            }}>
              Loading {loadPercent}%
            </p>
          </div>
        )}

        {/* Use canvas for drawing frames, object-fit works nicely for responsive scaling */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: imagesLoaded > 0 ? 1 : 0,
            transition: 'opacity 0.4s ease',
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
