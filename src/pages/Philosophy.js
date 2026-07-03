import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { S, SERIF, SANS } from '../styles/shared';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ─── GSAP Reveal wrapper ─── */
function Reveal({ children, delay = 0, style = {}, className = '' }) {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      delay: delay / 1000,
      ease: 'power3.out',
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ willChange: 'opacity, transform', ...style }}>
      {children}
    </div>
  );
}

function PhilosophyCard({ icon, title, description, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay} style={{ flex: '1 1 280px', minWidth: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '48px 40px',
          border: hovered ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          cursor: 'default',
          height: '100%',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '20px', opacity: 0.7 }}>{icon}</div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.35rem', color: '#fff', letterSpacing: '-0.01em', marginBottom: '16px', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          {description}
        </p>
      </div>
    </Reveal>
  );
}

function GridTile({ icon, title, description, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay} style={{ flex: '1 1 calc(50% - 1px)' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          padding: '56px 48px',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
          cursor: 'default',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ position: 'absolute', top: '48px', left: '48px', fontSize: '2.2rem', opacity: hovered ? 0.5 : 0.25, transition: 'opacity 0.4s ease' }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.01em', marginBottom: hovered ? '12px' : '0', transition: 'margin-bottom 0.4s ease', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: 0, maxHeight: hovered ? '80px' : '0px', opacity: hovered ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease' }}>
          {description}
        </p>
      </div>
    </Reveal>
  );
}

export default function Philosophy() {
  const heroRef       = useRef(null);
  const heroBgRef     = useRef(null);  // direct DOM ref for parallax
  const pageRef       = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hero entrance animation */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.phil-hero-label', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 })
      .from('.phil-hero-h1', { opacity: 0, y: 50, duration: 1 }, '-=0.4')
      .from('.phil-hero-body', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
      .from('.phil-hero-scroll', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
  }, { scope: heroRef });

  /* Parallax for split image */
  useGSAP(() => {
    gsap.to('.split-img img', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.split-screen',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} style={{ background: '#0a0a0a', color: '#fff', fontFamily: SANS, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .phil-label { font-family: 'Inter',sans-serif; font-weight:400; font-size:0.72rem; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-bottom:20px; display:block; }
        .phil-h2 { font-family:'Playfair Display',serif; font-weight:500; font-size:clamp(2rem,4vw,3.2rem); line-height:1.1; letter-spacing:-0.02em; color:#fff; }
        .phil-body { font-family:'Inter',sans-serif; font-weight:300; font-size:1.05rem; line-height:1.8; color:rgba(255,255,255,0.6); }
        .phil-section { padding:120px 0; }
        .phil-container { max-width:1180px; margin:0 auto; padding:0 48px; }
        .phil-divider { width:48px; height:1px; background:rgba(255,255,255,0.25); margin:28px 0; }
        .believe-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .split-screen { display:grid; grid-template-columns:1fr 1fr; min-height:80vh; }
        .phil-grid-2x2 { display:flex; flex-wrap:wrap; gap:1px; background:rgba(255,255,255,0.07); }
        .phil-grid-2x2 > * { flex:1 1 calc(50% - 1px); background:#0a0a0a; }
        .cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .phil-btn-primary { font-family:'Inter',sans-serif; font-weight:500; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; padding:18px 44px; background:#fff; color:#0a0a0a; border:1px solid #fff; cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .phil-btn-primary:hover { background:transparent; color:#fff; }
        .phil-btn-outline { font-family:'Inter',sans-serif; font-weight:400; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; padding:18px 44px; background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.3); cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .phil-btn-outline:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.6); }
        @keyframes scrollPulse { 0%,100%{opacity:0.3;transform:scaleY(0.5) translateY(-10px)} 50%{opacity:1;transform:scaleY(1) translateY(0)} }
        @media(max-width:900px){.believe-grid{grid-template-columns:1fr;gap:48px}.split-screen{grid-template-columns:1fr}.split-screen .split-img{min-height:300px}}
        @media(max-width:680px){.phil-container{padding:0 24px}.phil-section{padding:120px 0}.phil-grid-2x2>*{flex:1 1 100%}.stats-row{flex-direction:column !important; gap:32px !important;}}
      `}</style>

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} style={{ position:'relative', height:'100vh', minHeight:'680px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', textAlign:'center' }}>
        <div ref={heroBgRef} style={{ position:'absolute', inset:'-10%', backgroundImage:'url(/philosophy-hero.png)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.28)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0) 40%, rgba(10,10,10,0.8) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'0 24px', maxWidth:'800px' }}>
          <span className="phil-hero-label phil-label" style={{ marginBottom:'24px', display:'block' }}>Furniture Fittings Excellence</span>
          <h1 className="phil-hero-h1" style={{ fontFamily:"'Playfair Display',serif", fontWeight:500, fontSize:'clamp(3rem,6vw,5.5rem)', lineHeight:1.05, letterSpacing:'-0.02em', color:'#fff', marginBottom:'28px' }}>
            Our Philosophy
          </h1>
          <p className="phil-hero-body phil-body" style={{ fontSize:'clamp(0.95rem,1.5vw,1.15rem)', maxWidth:'580px', margin:'0 auto' }}>
            We believe exceptional furniture begins with exceptional fittings. Every mechanism we create is guided by precision, innovation, and a commitment to lasting quality.
          </p>
          <div className="phil-hero-scroll" style={{ marginTop:'64px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
            <span style={{ fontFamily:SANS, fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>Scroll</span>
            <div style={{ width:'1px', height:'48px', background:'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)', animation:'scrollPulse 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══════ WHAT WE BELIEVE ══════ */}
      <section className="phil-section">
        <div className="phil-container">
          <Reveal><span className="phil-label">What We Believe</span></Reveal>
          <div className="believe-grid">
            <Reveal delay={100}>
              <div style={{ position:'relative', aspectRatio:'4/5', overflow:'hidden' }}>
                <img
                  src="/philosophy-cabinet.png"
                  alt="Premium cabinet hinge detail"
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{ position:'absolute', bottom:'32px', left:'32px', width:'48px', height:'48px', borderLeft:'2px solid rgba(255,255,255,0.4)', borderBottom:'2px solid rgba(255,255,255,0.4)' }} />
              </div>
            </Reveal>
            <div>
              <Reveal delay={180}>
                <h2 className="phil-h2" style={{ marginBottom:'24px' }}>Precision in<br />Every Detail</h2>
                <div className="phil-divider" />
                <p className="phil-body" style={{ marginBottom:'32px' }}>
                  Every component is designed with meticulous attention to detail, ensuring flawless functionality, seamless integration, and long-term reliability.
                </p>
                <p className="phil-body">
                  Our engineers obsess over tolerances measured in fractions of a millimeter, because we know that the quality of a fitting determines the quality of everything it holds together.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="stats-row" style={{ display:'flex', gap:'48px', marginTop:'48px', flexWrap:'wrap' }}>
                  {[['25+','Years Experience'],['180+','Product Lines'],['99%','Quality Rate']].map(([num, label]) => (
                    <div key={label}>
                      <div style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:500, color:'#fff', lineHeight:1 }}>{num}</div>
                      <div style={{ fontFamily:SANS, fontSize:'0.72rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginTop:'8px' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PHILOSOPHY CARDS ══════ */}
      <section style={{ padding:'0 0 120px' }}>
        <div className="phil-container" style={{ marginBottom:'64px' }}>
          <Reveal>
            <span className="phil-label">Core Values</span>
            <h2 className="phil-h2">Our Guiding Principles</h2>
          </Reveal>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', gap:'1px', background:'rgba(255,255,255,0.08)', flexWrap:'wrap' }}>
            <PhilosophyCard icon="◈" title="Precision" description="Every millimeter matters. Accurate engineering ensures smooth performance and effortless installation across every product we make." delay={0} />
            <PhilosophyCard icon="◎" title="Innovation" description="We constantly refine our products to improve usability, durability, and the overall furniture experience through thoughtful R&D." delay={120} />
            <PhilosophyCard icon="◇" title="Quality Without Compromise" description="From material selection to final inspection, every fitting reflects our commitment to excellence and long-term performance." delay={240} />
          </div>
        </div>
      </section>

      {/* ══════ DESIGN MEETS FUNCTION ══════ */}
      <section>
        <div className="split-screen">
          <div className="split-img" style={{ position:'relative', overflow:'hidden', minHeight:'600px' }}>
            <img
              src="/philosophy-room.png"
              alt="Modern furniture interior"
              style={{ position:'absolute', inset:0, width:'100%', height:'110%', objectFit:'cover', filter:'brightness(0.85)' }}
            />
            <div style={{ position:'absolute', bottom:'40px', left:'40px' }}>
              <span className="phil-label" style={{ color:'rgba(255,255,255,0.7)' }}>Design Meets Function</span>
            </div>
          </div>
          <div style={{ background:'#111', display:'flex', alignItems:'center', padding:'80px 72px' }}>
            <div>
              <Reveal>
                <span className="phil-label">The Hidden Craft</span>
                <h2 className="phil-h2" style={{ marginBottom:'28px' }}>Beauty Starts<br />Beneath the Surface</h2>
                <div className="phil-divider" />
                <p className="phil-body" style={{ marginBottom:'20px' }}>
                  Great furniture is more than beautiful surfaces. True craftsmanship lies beneath—where precision-engineered fittings bring every design to life.
                </p>
                <p className="phil-body">
                  The silent close of a drawer, the smooth arc of a cabinet door—these experiences are only possible when the hardware underneath is built with the same care as the visible wood.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ OUR COMMITMENT ══════ */}
      <section style={{ position:'relative', padding:'140px 0', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'url(/philosophy-commitment.png)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.12)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(10,10,10,0) 0%, rgba(10,10,10,0.65) 100%)' }} />
        <div className="phil-container" style={{ position:'relative', zIndex:2 }}>
          <Reveal><span className="phil-label" style={{ textAlign:'center', display:'block' }}>Our Commitment</span></Reveal>
          <Reveal delay={120}>
            <p style={{ fontFamily:SERIF, fontWeight:400, fontSize:'clamp(1.3rem,2.5vw,2rem)', lineHeight:1.65, color:'rgba(255,255,255,0.88)', maxWidth:'860px', margin:'0 auto', letterSpacing:'-0.01em' }}>
              We don't simply manufacture furniture fittings. We create dependable solutions that elevate craftsmanship, enhance everyday living, and stand the test of time.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ width:'64px', height:'1px', background:'rgba(255,255,255,0.3)', margin:'48px auto 0' }} />
          </Reveal>
        </div>
      </section>

      {/* ══════ PHILOSOPHY GRID 2x2 ══════ */}
      <section className="phil-section">
        <div className="phil-container">
          <Reveal>
            <span className="phil-label">How We Work</span>
            <h2 className="phil-h2" style={{ marginBottom:'64px', maxWidth:'480px' }}>Four Pillars of Excellence</h2>
          </Reveal>
        </div>
        <div className="phil-container" style={{ padding:0 }}>
          <div className="phil-grid-2x2">
            <GridTile icon="⬡" title="Precision Engineering" description="Our products are manufactured to tolerances invisible to the naked eye. Every spec, every groove, every fastener point is exactingly controlled." delay={0} />
            <GridTile icon="◈" title="Long-Term Durability" description="We select materials that endure decades of daily use without compromise—tested to outlast trends and exceed industry standards." delay={120} />
            <GridTile icon="○" title="Thoughtful Innovation" description="Innovation at our company means solving real problems—quieter closes, easier installation, longer service life. No change for change's sake." delay={240} />
            <GridTile icon="◇" title="Customer-Centered Design" description="We listen to craftsmen, furniture makers, and homeowners alike. Every insight from the field feeds back into how we design and refine our products." delay={360} />
          </div>
        </div>
      </section>

      {/* ══════ QUOTE ══════ */}
      <section style={{ background:'#050505', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'140px 0', textAlign:'center' }}>
        <div className="phil-container">
          <Reveal>
            <div style={{ marginBottom:'32px', opacity:0.2 }}>
              <span style={{ fontFamily:SERIF, fontSize:'6rem', lineHeight:0.5, color:'#fff', display:'block' }}>"</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <blockquote style={{ fontFamily:SERIF, fontWeight:400, fontSize:'clamp(1.25rem,2.8vw,2.1rem)', lineHeight:1.6, color:'rgba(255,255,255,0.9)', maxWidth:'820px', margin:'0 auto', letterSpacing:'-0.01em', fontStyle:'italic' }}>
              Perfection isn't seen. It's experienced every time a drawer glides smoothly, a cabinet closes silently, and furniture performs flawlessly.
            </blockquote>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ marginTop:'48px', display:'flex', alignItems:'center', justifyContent:'center', gap:'16px' }}>
              <div style={{ width:'32px', height:'1px', background:'rgba(255,255,255,0.25)' }} />
              <span style={{ fontFamily:SANS, fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>Our Founding Principle</span>
              <div style={{ width:'32px', height:'1px', background:'rgba(255,255,255,0.25)' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="phil-section" style={{ textAlign:'center' }}>
        <div className="phil-container">
          <Reveal><span className="phil-label">Take the Next Step</span></Reveal>
          <Reveal delay={100}>
            <h2 className="phil-h2" style={{ marginBottom:'20px' }}>Ready to build furniture<br />that lasts?</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="phil-body" style={{ maxWidth:'500px', margin:'0 auto 52px' }}>
              Discover our complete range of precision-engineered fittings or speak with our team about your next project.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="cta-btns">
              <Link to="/our-works" className="phil-btn-primary" id="cta-explore-products">Explore Our Products</Link>
              <Link to="/contact" className="phil-btn-outline" id="cta-contact-us">Contact Us</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'40px 0', textAlign:'center' }}>
        <p style={{ fontFamily:SANS, fontSize:'0.72rem', letterSpacing:'0.15em', color:'rgba(255,255,255,0.2)', textTransform:'uppercase' }}>
          Precision · Innovation · Quality
        </p>
      </div>
    </div>
  );
}
