export const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
export const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const S = {
  h1: {
    fontFamily: SERIF, fontWeight: 500, color: '#fff',
    lineHeight: 1.1, letterSpacing: '-0.01em',
  },
  h2: {
    fontFamily: SERIF, fontWeight: 500, color: '#fff',
    lineHeight: 1.15, letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: SERIF, fontWeight: 400, color: '#fff',
    lineHeight: 1.3,
  },
  body: {
    fontFamily: SANS, fontWeight: 300, lineHeight: 1.7,
    color: 'rgba(255,255,255,0.7)',
  },
  label: {
    fontFamily: SANS, fontWeight: 400, fontSize: '0.75rem',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  btnPrimary: {
    fontFamily: SANS, fontWeight: 500, fontSize: '0.9rem',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '16px 36px', background: '#fff', color: '#0a0a0a',
    border: '1px solid #fff', borderRadius: 0, cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
  },
  btnOutline: {
    fontFamily: SANS, fontWeight: 400, fontSize: '0.9rem',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '16px 36px', background: 'transparent', color: '#fff',
    border: '1px solid rgba(255,255,255,0.35)', borderRadius: 0,
    cursor: 'pointer', transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
  },
};
