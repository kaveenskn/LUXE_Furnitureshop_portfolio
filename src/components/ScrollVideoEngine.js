import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrollVideoEngine
 * ─────────────────
 * Drives a <video> frame by frame based on scroll position, exactly like
 * Apple's product pages (iPhone, MacBook Air, AirPods, etc.).
 *
 * HOW IT WORKS
 * • The video is loaded with `preload="auto"` but NEVER plays.
 * • A tall scroll-track div (scrollHeight prop) pins the video sticky.
 * • As the user scrolls through that track, we map scroll progress → currentTime.
 * • We use requestAnimationFrame + a dirty flag so we only seek when needed.
 *
 * PERFORMANCE TRICKS
 * • IntersectionObserver — only active when the section is on screen.
 * • Passive scroll listener.
 * • Single rAF loop, cancelled on unmount.
 * • Playback rate set to 0 (seek-only mode).
 */

const ScrollVideoEngine = ({
  src,
  poster,
  scrollHeight = '500vh',   // height of the sticky scroll track
  children,                  // overlay content rendered on top of video
  onProgress,                // (0..1) callback for parent
  className = '',
}) => {
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef   = useRef(null);
  const dirtyRef = useRef(false);
  const targetTimeRef = useRef(0);

  const [videoReady, setVideoReady]     = useState(false);
  const [loadPercent, setLoadPercent]   = useState(0);
  const [isVisible, setIsVisible]       = useState(false);
  const [duration, setDuration]         = useState(0);

  /* ── 1. INTERSECTION OBSERVER ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── 2. VIDEO METADATA + BUFFER PROGRESS ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setDuration(video.duration);
      setVideoReady(true);
    };
    const onProgress = () => {
      if (video.duration > 0 && video.buffered.length > 0) {
        const pct = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
        setLoadPercent(Math.round(pct));
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('progress', onProgress);
    video.addEventListener('canplaythrough', () => setLoadPercent(100));

    // Already loaded (cache hit)
    if (video.readyState >= 2) {
      setDuration(video.duration);
      setVideoReady(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('progress', onProgress);
    };
  }, []);

  /* ── 3. SCROLL → SEEK LOOP ── */
  const handleScroll = useCallback(() => {
    if (!isVisible || !videoReady || !trackRef.current || !videoRef.current) return;

    const track  = trackRef.current;
    const rect   = track.getBoundingClientRect();
    const trackH = track.offsetHeight - window.innerHeight;

    // scrolled distance through the track
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / trackH, 0), 1);

    const video = videoRef.current;
    targetTimeRef.current = progress * video.duration;

    if (onProgress) onProgress(progress);

    if (!dirtyRef.current) {
      dirtyRef.current = true;
      rafRef.current = requestAnimationFrame(seekFrame);
    }
  }, [isVisible, videoReady, onProgress]);

  const seekFrame = useCallback(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current;
    }
    dirtyRef.current = false;
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // sync on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, handleScroll]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className={`scroll-video-track ${className}`}
      style={{ height: scrollHeight, position: 'relative' }}
    >
      {/* STICKY FRAME */}
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
        {/* LOADING OVERLAY */}
        {!videoReady && (
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

        {/* THE VIDEO — never auto-plays, seeked by scroll */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* OVERLAY CONTENT (text, UI etc.) */}
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

export default ScrollVideoEngine;
