import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERIF, SANS } from '../styles/shared';

const NavLinkItem = ({ to, children, onClick, mobile }) => {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link 
      to={to} 
      onClick={onClick}
      style={{
        ...navLinkStyle,
        fontSize: mobile ? '1.4rem' : '0.78rem',
        letterSpacing: mobile ? '0.15em' : '0.12em',
        color: hovered || isActive ? '#fff' : 'rgba(255,255,255,0.6)',
        borderBottom: isActive && !mobile ? '1px solid rgba(255,255,255,0.7)' : '1px solid transparent',
        paddingBottom: '2px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
};

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial position
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen]);

  // For subpages, we might always want the solid background
  const isHome = location.pathname === '/';
  const shouldBeSolid = scrolled || !isHome;

  return (
    <>
      <style>{`
        .desktop-links { display: flex; gap: 2.4rem; }
        .mobile-toggle { display: none; background: none; border: none; cursor: pointer; padding: 8px; margin-right: -8px; z-index: 201; }
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
        opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <NavLinkItem mobile to="/our-works" onClick={() => setMenuOpen(false)}>Our Works</NavLinkItem>
        <NavLinkItem mobile to="/philosophy" onClick={() => setMenuOpen(false)}>Philosophy</NavLinkItem>
        <NavLinkItem mobile to="/process" onClick={() => setMenuOpen(false)}>Process</NavLinkItem>
        <NavLinkItem mobile to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLinkItem>
      </div>

      <nav style={{
        position: 'fixed', 
        top: '24px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw',
        maxWidth: '1100px',
        zIndex: 200,
        padding: '0 32px', 
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: shouldBeSolid || menuOpen ? 'rgba(18,18,18,0.85)' : 'rgba(18,18,18,0.4)',
        backdropFilter: 'blur(24px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '100px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: (shouldBeSolid || menuOpen) ? '0 12px 40px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          <span style={{
            fontFamily: SERIF, fontWeight: 500, fontSize: '1.3rem',
            letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff',
          }}>
            Luxe
          </span>
        </Link>
        
        <div className="desktop-links">
          <NavLinkItem to="/our-works">Our Works</NavLinkItem>
          <NavLinkItem to="/philosophy">Philosophy</NavLinkItem>
          <NavLinkItem to="/process">Process</NavLinkItem>
          <NavLinkItem to="/contact">Contact</NavLinkItem>
        </div>

        <button 
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div style={{
            width: '24px', height: '2px', background: '#fff', marginBottom: '6px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none'
          }} />
          <div style={{
            width: '24px', height: '2px', background: '#fff',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: menuOpen ? 0 : 1
          }} />
          <div style={{
            width: '24px', height: '2px', background: '#fff', marginTop: '6px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none'
          }} />
        </button>
      </nav>
    </>
  );
};

const navLinkStyle = {
  fontFamily: SANS, fontWeight: 400,
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 0.25s',
};

export default Nav;
