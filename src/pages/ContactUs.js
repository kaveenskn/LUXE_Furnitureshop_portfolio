import React, { useRef } from 'react';
import { SANS, SERIF } from '../styles/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GOLD = '#c9a96e';
const GOLD_LIGHT = '#e3c48a';

/* ── tiny reusable pieces ─────────────────────────────── */
const IconCircle = ({ children }) => (
  <div style={{
    width: 38, height: 38, borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.4)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.8)',
  }}>
    {children}
  </div>
);

const InfoRow = ({ icon, label, children }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start',
    paddingBottom: 14, marginBottom: 14,
    borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <IconCircle>{icon}</IconCircle>
    <div>
      <p className="smoky-text" style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: SANS,
        fontWeight: 600, marginBottom: 3 }}>{label}</p>
      <div className="smoky-text" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)',
        fontFamily: SANS, lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: '0.6rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
      fontFamily: SANS, fontWeight: 600 }}>{label}</label>
    {children}
  </div>
);

const lineInput = {
  background: 'transparent', border: 'none', outline: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.28)',
  color: '#fff', fontFamily: SANS, fontSize: '0.88rem', padding: '7px 0',
  width: '100%', transition: 'border-color 0.25s',
};

/* ── icons (inline SVG) ───────────────────────────────── */
const IcoPin  = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>;
const IcoMail = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>;
const IcoPhone= <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.496-4.196-7.092-7.092l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>;
const IcoShare= <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>;

/* ── icons ────────────────────────────────── */
const IcoLock = <svg width="11" height="11" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>;
const IcoChev= <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>;

/* ─────────────────────────────────────────────────────── */
export default function ContactUs() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Left column animations
    tl.from('.cx-left > p, .cx-left > h1', { opacity: 0, y: 30, duration: 0.8, stagger: 0.15 })
      .from('.cx-info-row', { opacity: 0, x: -20, duration: 0.6, stagger: 0.1 }, '-=0.4');

    // Right column animations
    tl.from('.cx-card', { opacity: 0, y: 40, duration: 0.8 }, '-=0.8')
      .from('.cx-field', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.4')
      .from('.cx-btn', { opacity: 0, scale: 0.95, duration: 0.5 }, '-=0.2');

  }, { scope: container });

  const gold = e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.9)'; };
  const grey = e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.28)'; };
  const goldBorder = e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; };
  const greyBorder = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

  return (
    <>
      <style>{`
        /* ── page shell ── */
        .cx-page {
          height: 100vh;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              105deg,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.52) 48%,
              rgba(0,0,0,0.80) 100%
            ),
            url('https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?auto=format&fit=crop&q=85&w=2200')
            center/cover no-repeat;
          color: #fff;
          font-family: ${SANS};
          padding-top: 80px; /* nav clearance */
          box-sizing: border-box;
        }

        /* ── two-column content ── */
        .cx-body {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 64px;
          align-items: center;
          padding: 0 6vw 0 2vw;
          max-width: 1320px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── glassmorphism form card ── */
        .cx-card {
          background: rgba(12,12,12,0.45);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 36px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.65);
        }

        /* ── input helpers ── */
        .cx-input::placeholder  { color: rgba(255,255,255,0.3); }
        .cx-ta::placeholder     { color: rgba(255,255,255,0.3); }
        .cx-select option       { background: #111; color: #fff; }

        /* ── send button ── */
        .cx-btn {
          width: 100%; border: none; border-radius: 3px; cursor: pointer;
          font-family: ${SANS}; font-weight: 700; font-size: 0.82rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 0;
          background: #fff;
          color: #0a0a0a;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.25s, color 0.25s, transform 0.2s;
          box-shadow: 0 8px 28px rgba(255,255,255,0.08);
        }
        .cx-btn:hover { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.6); transform: translateY(-1px); }

        /* ── mobile ── */
        @media (max-width: 900px) {
          .cx-page   { height: auto; min-height: 100vh; overflow-y: auto; padding: 120px 0 60px; }
          .cx-body   { grid-template-columns: 1fr; gap: 36px; }
          .cx-card   { padding: 28px 22px; }
        }

        /* ── smoky text shadow ── */
        .smoky-text {
          text-shadow: 0 2px 10px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.9) !important;
        }
      `}</style>

      <div className="cx-page" ref={container}>
        <div className="cx-body">

          {/* LEFT — heading + contact info */}
          <div className="cx-left">
            <p className="smoky-text" style={{ margin: '0 0 10px', fontSize: '0.8rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
              Get in Touch
            </p>
            <h1 className="smoky-text" style={{ margin: '0 0 14px', fontFamily: SERIF,
              fontSize: 'clamp(2.8rem, 4.5vw, 4.8rem)', lineHeight: 1.08,
              fontWeight: 500 }}>
              Let's Discuss<br />Your Next Space.
            </h1>
            <p className="smoky-text" style={{ margin: '0 0 32px', fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, maxWidth: 400 }}>
              Have a project in mind? We'd love to hear about it.
              Reach out and let's create something extraordinary together.
            </p>

            <div className="cx-info-row"><InfoRow icon={IcoPin}  label="Studio">
              124 Design Avenue, Suite 400<br />New York, NY 10012
            </InfoRow></div>
            <div className="cx-info-row"><InfoRow icon={IcoMail} label="Email">
              hello@luxedesign.com
            </InfoRow></div>
            <div className="cx-info-row"><InfoRow icon={IcoPhone} label="Phone">
              +1 (555) 123-4567
            </InfoRow></div>
            <div className="cx-info-row"><InfoRow icon={IcoShare} label="Follow">
              <div style={{ display: 'flex', gap: 18 }}>
                {['Instagram','Pinterest','LinkedIn'].map(n => (
                  <a key={n} href="#"
                    style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                      fontSize: '1rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
                  >{n}</a>
                ))}
              </div>
            </InfoRow></div>
          </div>

          {/* RIGHT — glass form card */}
          <div className="cx-card">
            <form onSubmit={e => e.preventDefault()}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="cx-field"><Field label="Name">
                  <input type="text" placeholder="Jane Doe"
                    className="cx-input" style={lineInput}
                    onFocus={gold} onBlur={grey} />
                </Field></div>
                <div className="cx-field"><Field label="Email">
                  <input type="email" placeholder="jane@example.com"
                    className="cx-input" style={lineInput}
                    onFocus={gold} onBlur={grey} />
                </Field></div>
              </div>

              {/* Project Type */}
              <div className="cx-field"><Field label="Project Type">
                <div style={{ position: 'relative' }}>
                  <select className="cx-select"
                    style={{ ...lineInput, appearance: 'none', WebkitAppearance: 'none',
                      cursor: 'pointer', paddingRight: 24,
                      color: 'rgba(255,255,255,0.75)' }}
                    onFocus={gold} onBlur={grey}>
                    <option value="">Select a project type</option>
                    <option value="residential">Residential Design</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="retail">Retail & Brand</option>
                  </select>
                  <span style={{ position: 'absolute', right: 6, bottom: 10,
                    pointerEvents: 'none', color: 'rgba(255,255,255,0.4)' }}>
                    {IcoChev}
                  </span>
                </div>
              </Field></div>

              {/* Message */}
              <div className="cx-field"><Field label="Message">
                <textarea rows={3} placeholder="Tell us about your project..."
                  className="cx-ta"
                  style={{ ...lineInput, resize: 'none', borderBottom: 'none',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                    padding: '10px 12px', background: 'rgba(0,0,0,0.18)',
                    transition: 'border-color 0.25s' }}
                  onFocus={goldBorder} onBlur={greyBorder} />
              </Field></div>

              {/* Submit */}
              <button type="submit" className="cx-btn">
                Send Inquiry
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </button>

              {/* Security note */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: -4 }}>
                {IcoLock}
                Your information is kept private and secure.
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
