import React from 'react';
import { SANS, SERIF } from '../styles/shared';

const lineInput = {
  background: 'transparent', border: 'none', outline: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.28)',
  color: '#fff', fontFamily: SANS, fontSize: '0.88rem', padding: '7px 0',
  width: '100%', transition: 'border-color 0.25s',
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: '0.6rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
      fontFamily: SANS, fontWeight: 600 }}>{label}</label>
    {children}
  </div>
);

export default function InstallationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const whiteFocus = e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.9)'; };
  const greyBlur = e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.28)'; };
  const whiteBorderFocus = e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; };
  const greyBorderBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(12,12,12,0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '36px 40px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 24,
            background: 'none', border: 'none', color: '#fff',
            fontSize: '1.5rem', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.5}
        >
          &times;
        </button>

        <h2 style={{ fontFamily: SERIF, fontSize: '2rem', color: '#fff', marginBottom: '8px', marginTop: 0 }}>
          Schedule Installation
        </h2>
        <p style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Fill out the details below and we will contact you to confirm your installation appointment.
        </p>

        <form onSubmit={e => { e.preventDefault(); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Full Name">
              <input type="text" placeholder="John Doe" style={lineInput} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
            <Field label="Phone Number">
              <input type="tel" placeholder="+1 (555) 000-0000" style={lineInput} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Email">
              <input type="email" placeholder="john@example.com" style={lineInput} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
            <Field label="Furniture Type">
              <input type="text" placeholder="e.g. Living Room Sofa" style={lineInput} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
          </div>

          <Field label="Address">
            <input type="text" placeholder="123 Design St, City, NY 10001" style={lineInput} onFocus={whiteFocus} onBlur={greyBlur} required />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Preferred Date">
              <input type="date" style={{ ...lineInput, color: 'rgba(255,255,255,0.7)' }} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
            <Field label="Preferred Time">
              <input type="time" style={{ ...lineInput, color: 'rgba(255,255,255,0.7)' }} onFocus={whiteFocus} onBlur={greyBlur} required />
            </Field>
          </div>

          <Field label="Additional Notes">
            <textarea 
              rows={3} 
              placeholder="Any special instructions or details..."
              style={{ ...lineInput, resize: 'none', borderBottom: 'none',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '10px 12px', background: 'rgba(0,0,0,0.18)',
                transition: 'border-color 0.25s' }}
              onFocus={whiteBorderFocus} onBlur={greyBorderBlur}
            />
          </Field>

          <button type="submit" style={{
            width: '100%', border: 'none', borderRadius: '3px', cursor: 'pointer',
            fontFamily: SANS, fontWeight: 700, fontSize: '0.82rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '14px 0', marginTop: '8px',
            background: '#fff', color: '#0a0a0a',
            transition: 'background 0.25s, color 0.25s',
          }}
          onMouseEnter={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; e.target.style.border = '1px solid rgba(255,255,255,0.6)'; }}
          onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; e.target.style.border = 'none'; }}
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
