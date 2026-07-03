import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import ScrollFrameEngine from '../components/ScrollFrameEngine';
import InstallationModal from '../components/InstallationModal';
import { S, SERIF, SANS } from '../styles/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function lerp(frame, [s, e], [v0, v1]) {
  if (frame <= s) return v0;
  if (frame >= e) return v1;
  return v0 + ((frame - s) / (e - s)) * (v1 - v0);
}

function active(frame, [s, e], margin = 3) {
  return frame >= s - margin && frame <= e + margin;
}

/* ─────────────────────────────────────────────
   1 · HERO  (frames 1–25)
───────────────────────────────────────────── */
const HeroSection = memo(({ f }) => {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-label', { opacity: 0, y: 20, duration: 1, delay: 0.2 })
      .from('.hero-h1', { opacity: 0, y: 40, duration: 1 }, '-=0.6')
      .from('.hero-body', { opacity: 0, y: 20, duration: 1 }, '-=0.6')
      .from('.hero-btn-container', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4');
  }, { scope: container });

  if (!active(f, [1, 25])) return null;

  const headOp = 1;
  const headY  = 0;
  const bodyOp = 1;
  const bodyY  = 0;
  const btnOp  = 1;
  const fadeOut = lerp(f, [20, 25], [1, 0]);
  const op = fadeOut;

  return (
    <div className="hero-section" ref={container} style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', padding: '0 6vw', opacity: op, pointerEvents: 'none',
    }}>
      <p className="smoky-text hero-label" style={{ ...S.label, marginBottom: 24, opacity: headOp }}>Interior Design Studio</p>
      <h1 className="smoky-text hero-h1" style={{
        ...S.h1, fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', maxWidth: 900,
        marginBottom: '1.2rem', opacity: headOp,
        transform: `translateY(${headY}px)`,
      }}>
        Designing Spaces That Feel Like Home
      </h1>
      <p className="smoky-text hero-body" style={{
        ...S.body, fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', maxWidth: 560,
        marginBottom: '2.5rem', opacity: bodyOp,
        transform: `translateY(${bodyY}px)`,
      }}>
        Transforming interiors into timeless experiences through thoughtful design, craftsmanship, and innovation.
      </p>
      <div className="hero-btn-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', opacity: btnOp, pointerEvents: btnOp > 0.5 ? 'auto' : 'none' }}>
        <button className="hero-btn" style={S.btnPrimary}
          onMouseEnter={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
          onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}>
          View Projects
        </button>
        <button className="hero-btn" style={S.btnOutline}
          onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}>
          Start Your Project
        </button>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   2 · INTRODUCTION  (frames 26–55)
───────────────────────────────────────────── */
const IntroSection = memo(({ f }) => {
  if (!active(f, [26, 55])) return null;

  const opIn  = lerp(f, [26, 32], [0, 1]);
  const opOut = lerp(f, [50, 55], [1, 0]);
  const op = Math.min(opIn, opOut);
  const y  = lerp(f, [26, 34], [40, 0]);

  return (
    <div className="intro-section" style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', padding: '0 10vw', opacity: op, pointerEvents: 'none',
    }}>
      <div style={{ transform: `translateY(${y}px)`, maxWidth: 700 }}>
        <p className="smoky-text" style={{ ...S.label, marginBottom: 18 }}>Our Vision</p>
        <h2 className="smoky-text" style={{
          ...S.h2, fontSize: 'clamp(2rem, 4vw, 3.6rem)', marginBottom: '1.4rem',
        }}>
          Every Great Interior Begins With Possibility
        </h2>
        <p className="smoky-text" style={{
          ...S.body, fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
        }}>
          Great design isn't about filling a room. It's about creating an experience
          where architecture, light, materials, and furniture work together in harmony.
        </p>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   3 · TRANSFORMATION  (frames 56–90)
───────────────────────────────────────────── */
const TRANSFORM_CARDS = [
  { title: 'Premium Flooring',       icon: '◈', in: [58, 63], out: [70, 74] },
  { title: 'Bespoke Furniture',      icon: '◇', in: [65, 70], out: [77, 81] },
  { title: 'Architectural Lighting', icon: '△', in: [72, 77], out: [84, 88] },
  { title: 'Curated Decor',          icon: '○', in: [79, 84], out: [87, 90] },
];

const TransformSection = memo(({ f }) => {
  if (!active(f, [56, 90])) return null;

  const hIn  = lerp(f, [56, 60], [0, 1]);
  const hOut = lerp(f, [86, 90], [1, 0]);
  const hOp  = Math.min(hIn, hOut);
  const hY   = lerp(f, [56, 60], [30, 0]);

  return (
    <div className="transform-section" style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 5vw', pointerEvents: 'none',
    }}>
      <h2 className="smoky-text" style={{
        ...S.h2, fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
        opacity: hOp, transform: `translateY(${hY}px)`,
        position: 'absolute', top: '18vh',
        textAlign: 'center', width: '100%', padding: '0 20px',
      }}>
        Transformation Happens Layer by Layer
      </h2>

      {TRANSFORM_CARDS.map((c, i) => {
        const cIn  = lerp(f, c.in, [0, 1]);
        const cOut = lerp(f, c.out, [1, 0]);
        const cOp  = Math.min(cIn, cOut);
        const sc   = lerp(f, c.in, [0.88, 1]);

        return (
          <div key={i} style={{
            position: 'absolute', opacity: cOp,
            transform: `scale(${sc})`,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '36px 48px',
            minWidth: 260, textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            willChange: 'opacity, transform',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.6 }}>{c.icon}</div>
            <h3 style={{ ...S.h3, fontSize: '1.3rem', margin: 0 }}>{c.title}</h3>
          </div>
        );
      })}
    </div>
  );
});

/* ─────────────────────────────────────────────
   4 · DESIGN PHILOSOPHY  (frames 91–125)
───────────────────────────────────────────── */
const PHILOSOPHY_CARDS = [
  { title: 'Human-Centered Design', desc: 'Spaces shaped around the way you actually live and work.', delay: 0 },
  { title: 'Natural Materials',      desc: 'Stone, wood, linen — honest textures that age beautifully.', delay: 3 },
  { title: 'Thoughtful Details',     desc: 'Every handle, joint, and finish chosen with intention.',   delay: 6 },
];

const PhilosophySection = memo(({ f }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!active(f, [91, 125])) return null;

  const hIn  = lerp(f, [91, 96], [0, 1]);
  const hOut = lerp(f, [120, 125], [1, 0]);
  const hOp  = Math.min(hIn, hOut);
  const hY   = lerp(f, [91, 96], [30, 0]);

  return (
    <div className="philosophy-section" style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 5vw', pointerEvents: 'none',
    }}>
      <div id="philosophy" className="philosophy-title" style={{ opacity: hOp, transform: `translateY(${hY}px)`, textAlign: 'center', marginBottom: 50 }}>
        <p className="smoky-text" style={{ ...S.label, marginBottom: 14 }}>Our Philosophy</p>
        <h2 className="smoky-text" style={{
          ...S.h2, fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: '0.8rem',
        }}>
          Designed Around the People Who Live There
        </h2>
        <p className="smoky-text" style={{
          ...S.body, fontSize: '1.1rem',
        }}>
          Create interiors that feel warm, functional, timeless, and personal.
        </p>
      </div>

      <div className="philosophy-cards" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {PHILOSOPHY_CARDS.map((c, i) => {
          const base = 98 + c.delay;
          const cIn  = lerp(f, [base, base + 5], [0, 1]);
          const cOut = lerp(f, [120, 125], [1, 0]);
          const cOp  = Math.min(cIn, cOut);
          const cY   = lerp(f, [base, base + 5], [35, 0]);
          const isExpanded = expandedIndex === i;

          return (
            <div key={i} 
                 className={`philosophy-card ${isExpanded ? 'expanded' : ''}`}
                 onClick={() => setExpandedIndex(isExpanded ? null : i)}
                 style={{
              opacity: cOp, transform: `translateY(${cY}px)`,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '40px 32px', width: 280, textAlign: 'center',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              willChange: 'opacity, transform',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}>
              <h3 className="philosophy-card-title" style={{ ...S.h3, fontSize: '1.15rem', marginBottom: 10 }}>{c.title}</h3>
              <p className="philosophy-card-desc" style={{ ...S.body, fontSize: '0.9rem', margin: 0 }}>{c.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   5 · OUR PROCESS  (frames 126–160)
───────────────────────────────────────────── */
const PROCESS_STEPS = [
  'Consultation', 'Concept Design', '3D Visualization',
  'Material Selection', 'Construction', 'Final Styling',
];

const ProcessSection = memo(({ f }) => {
  if (!active(f, [126, 160])) return null;

  const opIn  = lerp(f, [126, 130], [0, 1]);
  const opOut = lerp(f, [156, 160], [1, 0]);
  const op    = Math.min(opIn, opOut);
  const line  = lerp(f, [131, 154], [0, 1]);

  return (
    <div id="process" className="process-section" style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 6vw', opacity: op, pointerEvents: 'none',
    }}>
      <p className="smoky-text" style={{ ...S.label, marginBottom: 14 }}>How We Work</p>
      <h2 className="smoky-text" style={{
        ...S.h2, fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', marginBottom: 56,
      }}>
        Our Process
      </h2>

      <div className="process-container" style={{ position: 'relative', width: '100%', maxWidth: 1000, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        {/* track bg */}
        <div className="process-track-bg" style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
          background: 'rgba(255,255,255,0.1)',
        }} />
        {/* track fill */}
        <div className="process-track-fill" style={{
          position: 'absolute', top: 0, left: '8%', height: 1,
          background: 'rgba(255,255,255,0.8)',
          width: `${line * 84}%`, /* 84% = inner span */
          transition: 'width 0.05s linear',
          '--line-prog': `${line * 100}%`
        }} />

        {PROCESS_STEPS.map((step, i) => {
          const thresh = i / (PROCESS_STEPS.length - 1);
          const on = line >= thresh - 0.02;
          const dotScale = on ? 1 : 0.5;
          const labelOp  = on ? 1 : 0;

          return (
            <div key={i} className="process-step" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              flex: 1, position: 'relative',
            }}>
              <div className="process-dot" style={{
                width: 10, height: 10, borderRadius: '50%',
                background: on ? '#fff' : 'rgba(255,255,255,0.15)',
                transform: `scale(${dotScale}) translateY(-4px)`,
                '--dot-scale': dotScale,
                transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                boxShadow: on ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
              }} />
              <span className="smoky-text process-label" style={{
                ...S.label, fontSize: '0.92rem', marginTop: 16, textAlign: 'center',
                color: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                opacity: labelOp, transition: 'all 0.4s ease',
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   6 · FEATURED SPACES  (frames 161–190)
───────────────────────────────────────────── */
const SPACE_CATS = [
  'Luxury Living Rooms', 'Elegant Bedrooms', 'Modern Kitchens',
  'Boutique Hotels', 'Executive Offices', 'Luxury Villas',
];

const SpacesSection = memo(({ f }) => {
  if (!active(f, [161, 190])) return null;

  const hIn  = lerp(f, [161, 165], [0, 1]);
  const hOut = lerp(f, [186, 190], [1, 0]);
  const hOp  = Math.min(hIn, hOut);

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 5vw', pointerEvents: 'none',
    }}>
      <p className="smoky-text" style={{ ...S.label, marginBottom: 14, opacity: hOp }}>Portfolio</p>
      <h2 className="smoky-text" style={{
        ...S.h2, fontSize: 'clamp(2rem, 3.5vw, 3rem)', opacity: hOp,
        marginBottom: 48,
      }}>
        Spaces We Create
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.2rem', maxWidth: 900, width: '100%',
      }}>
        {SPACE_CATS.map((cat, i) => {
          const d = 164 + i * 2;
          const cIn  = lerp(f, [d, d + 4], [0, 1]);
          const cOut = lerp(f, [186, 190], [1, 0]);
          const cOp  = Math.min(cIn, cOut);
          const cY   = lerp(f, [d, d + 4], [40, 0]);

          return (
            <div key={i} style={{
              opacity: cOp, transform: `translateY(${cY}px)`,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '28px 20px', textAlign: 'center',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
              <h3 style={{ ...S.h3, fontSize: '1rem', letterSpacing: '0.04em', margin: 0 }}>{cat}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   7 · STATISTICS  (frames 191–220)
───────────────────────────────────────────── */
const Counter = ({ target, suffix, label, triggerFrame, f }) => {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (f >= triggerFrame && !started.current) {
      started.current = true;
      let t0 = null;
      const dur = 1400;
      const tick = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);        // easeOutQuart
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [f, triggerFrame, target]);

  return (
    <div style={{ textAlign: 'center', minWidth: 140 }}>
      <div style={{ ...S.h1, fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', marginBottom: 6 }}>
        {val}{suffix}
      </div>
      <div style={{ ...S.label }}>{label}</div>
    </div>
  );
};

const StatsSection = memo(({ f }) => {
  if (!active(f, [191, 220])) return null;

  const opIn  = lerp(f, [191, 196], [0, 1]);
  const opOut = lerp(f, [215, 220], [1, 0]);
  const op    = Math.min(opIn, opOut);

  return (
    <div className="stats-section" style={{
      position: 'absolute', inset: 0, display: 'flex',
      justifyContent: 'center', alignItems: 'center', gap: '5vw',
      flexWrap: 'wrap', padding: '0 8vw', opacity: op,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)', pointerEvents: 'none',
    }}>
      <Counter target={120} suffix="+" label="Completed Projects"  triggerFrame={194} f={f} />
      <Counter target={12}  suffix="+" label="Years of Experience" triggerFrame={194} f={f} />
      <Counter target={98}  suffix="%" label="Client Satisfaction" triggerFrame={194} f={f} />
      <Counter target={18}  suffix=""  label="Design Awards"       triggerFrame={194} f={f} />
    </div>
  );
});

/* ─────────────────────────────────────────────
   8 · CALL TO ACTION  (frames 221–240)
───────────────────────────────────────────── */
const CTASection = memo(({ f, setIsModalOpen }) => {
  if (!active(f, [221, 240])) return null;

  const opIn  = lerp(f, [221, 226], [0, 1]);
  const opOut = lerp(f, [235, 240], [1, 0]);
  const op    = Math.min(opIn, opOut);
  const y     = lerp(f, [221, 226], [30, 0]);

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 5vw', pointerEvents: 'none',
    }}>
      <div style={{
        opacity: op,
        transform: `translateY(${y}px)`, textAlign: 'center',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        padding: '64px 56px', maxWidth: 680, pointerEvents: 'auto',
        willChange: 'opacity, transform',
      }}>
        <h2 style={{ ...S.h2, fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: '1rem' }}>
          Ready to Transform Your Space?
        </h2>
        <p style={{ ...S.body, fontSize: '1.05rem', marginBottom: '2.5rem' }}>
          Let's design an environment that reflects your lifestyle and vision.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="hero-btn" style={S.btnPrimary}
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
            onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}>
            Schedule Installation
          </button>
          <button className="hero-btn" style={S.btnOutline}
            onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}>
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   9 · ENDING  (frames 241–250)
───────────────────────────────────────────── */
const EndingSection = memo(({ f }) => {
  if (!active(f, [241, 250])) return null;

  const op = lerp(f, [241, 245], [0, 1]);

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '0 5vw', opacity: op,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)', pointerEvents: 'none',
    }}>
      <h1 className="smoky-text" style={{
        ...S.h1, fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.6rem',
      }}>
        LUXE
      </h1>
      <p className="smoky-text" style={{
        ...S.h3, fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
        fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '4rem',
      }}>
        Crafting Timeless Interiors.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{ ...S.label, fontSize: '0.7rem' }}>Scroll Down to Explore Our Portfolio</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          style={{ animation: 'endBounce 2s ease-in-out infinite', opacity: 0.5 }}>
          <path d="M10 3v14M4 11l6 6 6-6" stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   OVERLAY COMPOSITOR
───────────────────────────────────────────── */
const Overlay = memo(({ frame, setIsModalOpen, progressBarRef }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    {/* cinematic vignette */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `
        radial-gradient(ellipse 85% 65% at 50% 50%, transparent 25%, rgba(0,0,0,0.55) 100%),
        linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.5) 100%)
      `,
    }} />

    {/* scroll progress — updated imperatively via ref to avoid re-renders */}
    <div ref={progressBarRef} style={{
      position: 'absolute', bottom: 0, left: 0, height: 2,
      width: '0%',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2))',
      zIndex: 50,
    }} />

    <HeroSection f={frame} />
    <IntroSection f={frame} />
    <TransformSection f={frame} />
    <PhilosophySection f={frame} />
    <ProcessSection f={frame} />
    <SpacesSection f={frame} />
    <StatsSection f={frame} />
    <CTASection f={frame} setIsModalOpen={setIsModalOpen} />
    <EndingSection f={frame} />

    {/* scroll hint at start */}
    <div style={{
      position: 'absolute', bottom: '4vh', left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      opacity: frame < 4 ? 1 - (frame - 1) / 3 : 0,
      pointerEvents: 'none',
    }}>
      <span className="smoky-text" style={{ ...S.label, fontSize: '0.65rem' }}>Scroll to explore</span>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
        style={{ animation: 'endBounce 1.6s ease-in-out infinite' }}>
        <path d="M10 4v12M4 10l6 6 6-6" stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    <style>{`
      .smoky-text {
        text-shadow: 0 2px 10px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.9) !important;
      }
      @keyframes endBounce {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50%      { transform: translateY(5px); opacity: 0.9; }
      }
      @media (max-width: 768px) {
        .hero-btn { padding: 12px 24px !important; font-size: 0.8rem !important; }
        .hero-btn-container { gap: 0.8rem !important; }
        .philosophy-title { margin-bottom: 24px !important; }
        .philosophy-cards { gap: 1rem !important; }
        .philosophy-card { padding: 24px 20px !important; width: 100% !important; max-width: 280px !important; }
        .philosophy-card-title { font-size: 1.05rem !important; margin-bottom: 8px !important; }
        .philosophy-card-desc { font-size: 0.85rem !important; }
        
        .process-container { flex-direction: column !important; align-items: flex-start !important; padding-left: 10% !important; gap: 32px !important; justify-content: flex-start !important; }
        .process-track-bg { left: calc(10% + 4px) !important; top: 12px !important; bottom: 12px !important; width: 2px !important; height: auto !important; right: auto !important; background: rgba(255,255,255,0.15) !important; }
        .process-track-fill { left: calc(10% + 4px) !important; top: 12px !important; width: 2px !important; height: var(--line-prog) !important; right: auto !important; transition: height 0.05s linear !important; max-height: calc(100% - 24px) !important; }
        .process-step { width: 100% !important; flex-direction: row !important; align-items: center !important; }
        .process-dot { transform: scale(var(--dot-scale, 1)) !important; margin-right: 24px !important; }
        .process-label { margin-top: 0 !important; text-align: left !important; white-space: normal !important; }
      }

      /* Keep desktop placement untouched; only adjust visibility/placement on medium and below */
      @media (max-width: 1200px) {
        .wa-floating {
          left: 87.5% !important;
          top: 83% !important;
          width: 58px !important;
          height: 58px !important;
        }
        .wa-floating svg {
          width: 32px !important;
          height: 32px !important;
        }
      }

      @media (max-width: 992px) {
        .wa-floating {
          left: 84.5% !important;
          top: 84% !important;
        }
      }

      @media (max-width: 768px) {
        .wa-floating {
          left: 82% !important;
          top: 85% !important;
          width: 54px !important;
          height: 54px !important;
        }
        .wa-floating svg {
          width: 30px !important;
          height: 30px !important;
        }
        
        .hero-section, .intro-section, .transform-section, .philosophy-section, .process-section, .detail-section, .outro-section {
          padding-top: 88px !important;
        }

        .stats-section {
          padding-top: 120px !important;
          align-content: center !important;
        }
        
        .philosophy-cards {
          gap: 0.8rem !important;
        }
        .philosophy-card {
          padding: 18px 20px !important;
          transition: scale 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease, background 0.4s ease !important;
          scale: 1;
        }
        .philosophy-card-desc {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin: 0 !important;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.4s ease !important;
        }
        .philosophy-card-title {
          margin-bottom: 0 !important;
          transition: margin-bottom 0.4s ease !important;
        }
        
        .philosophy-card.expanded {
          padding: 24px 20px !important;
          scale: 1.05;
          z-index: 10;
          background: rgba(30, 30, 30, 0.85) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8) !important;
        }
        .philosophy-card.expanded .philosophy-card-title {
          margin-bottom: 10px !important;
        }
        .philosophy-card.expanded .philosophy-card-desc {
          max-height: 150px;
          opacity: 1;
          margin-top: 10px !important;
        }
      }
    `}</style>
  </div>
));

export default function Home() {
  const [frame, setFrame] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use a ref for the progress bar DOM element to avoid re-renders on every frame
  const progressBarRef = useRef(null);
  const lastFrameRef   = useRef(1);

  const onProgress = useCallback((p, f) => {
    // Update progress bar directly via DOM — zero React overhead
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${p * 100}%`;
    }
    // Only schedule a React re-render when the integer frame actually changes
    const rounded = f !== undefined ? Math.round(f) : lastFrameRef.current;
    if (rounded !== lastFrameRef.current) {
      lastFrameRef.current = rounded;
      setFrame(rounded);
    }
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <ScrollFrameEngine
        frameCount={250}
        startFrame={1}
        scrollHeight="2090vh"
        onProgress={onProgress}
      >
        <Overlay frame={frame} setIsModalOpen={setIsModalOpen} progressBarRef={progressBarRef} />
      </ScrollFrameEngine>
      
      <InstallationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Tracker for object-fit: cover to hide the watermark exactly */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1000,
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'max(100vw, 177.777vh)',
          height: 'max(100vh, 56.25vw)',
        }}>
          {/* Floating WhatsApp Icon over the watermark */}
          <a className="wa-floating" href="#" style={{
            position: 'absolute',
            top: '82.5%',
            left: '90.5%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            backgroundColor: '#25D366',
            color: '#FFF',
            borderRadius: '50px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            pointerEvents: 'auto',
          }}>
            <svg viewBox="0 0 32 32" width="36" height="36" fill="currentColor" style={{ marginLeft: '2px', marginTop: '1px' }}>
              <path d="M16 2a13 13 0 0 0-11 20.3L3 29l6.9-2.2A13 13 0 1 0 16 2zm0 24a11 11 0 0 1-5.7-1.6l-.4-.2-4.2 1.3 1.1-4-.2-.5A11 11 0 1 1 16 26zm6-8.2c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.1-.7.2-.2.3-.8 1.1-1 1.3-.2.3-.4.3-.7.1-.3-.2-1.4-.5-2.6-1.6-1-1-1.3-1.3-1.4-1.6-.2-.3 0-.5.1-.6.2-.2.4-.4.5-.6.2-.2.3-.4.4-.7s.1-.5 0-.7c-.1-.2-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5H12c-.3 0-.7.1-1.1.5-.3.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 3.9c.2.3 2.7 4.1 6.5 5.7 3.8 1.6 3.8 1.1 4.5 1 .7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.6-.4z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
