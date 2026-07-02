import React, { useState, useRef } from 'react';
import { S, SERIF, SANS } from '../styles/shared';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'The Glass House', category: 'Luxury Living', image: '/images/living_room.png', className: 'span-2x2' },
  { id: 2, title: 'Minimalist Haven', category: 'Bedroom Design', image: '/images/bedroom.png', className: 'span-2x1' },
  { id: 3, title: 'Noir Kitchen', category: 'Modern Kitchens', image: '/images/kitchen.png', className: 'span-2x1' },
  { id: 4, title: 'Executive Suite', category: 'Office Spaces', image: '/images/office.png', className: 'span-1x2' },
  { id: 5, title: 'Coastal Retreat', category: 'Living Spaces', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800', className: 'span-1x2' },
  { id: 6, title: 'Urban Sanctuary', category: 'Master Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800', className: 'span-2x1' },
  { id: 7, title: "Chef's Paradise", category: 'Culinary Spaces', image: 'https://images.unsplash.com/photo-1556909211-36987daf7b4d?auto=format&fit=crop&q=80&w=800', className: 'span-2x1' },
  { id: 8, title: 'Creative Studio', category: 'Workspaces', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', className: 'span-2x2' },
  { id: 9, title: 'Modern Pavilion', category: 'Architecture', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', className: 'span-2x1' },
  { id: 10, title: 'Nordic Lounge', category: 'Living Spaces', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', className: 'span-2x1' },
];

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`portfolio-card ${project.className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '8px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${project.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)',
        transition: 'background 0.5s ease',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        transform: hovered ? 'translateY(0)' : 'translateY(10px)',
        opacity: hovered ? 1 : 0.8,
        transition: 'all 0.5s ease',
      }}>
        <p style={{
          ...S.label,
          marginBottom: '8px',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {project.category}
        </p>
        <h3 style={{
          ...S.h2,
          fontSize: '2rem',
          margin: 0,
          textShadow: '0 4px 20px rgba(0,0,0,0.6)'
        }}>
          {project.title}
        </h3>
      </div>
    </div>
  );
};

export default function OurWorks() {
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  /* Header entrance */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.port-label', { opacity: 0, y: 20, duration: 0.6, delay: 0.15 })
      .from('.port-h1', { opacity: 0, y: 40, duration: 0.9 }, '-=0.3')
      .from('.port-body', { opacity: 0, y: 25, duration: 0.7 }, '-=0.4');
  }, { scope: headerRef });

  /* Staggered grid items */
  useGSAP(() => {
    gsap.from('.portfolio-card', {
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: gridRef });

  return (
    <div ref={pageRef} style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '80px',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>
        <header ref={headerRef} style={{ marginBottom: '80px', textAlign: 'center' }}>
          <p className="port-label" style={{ ...S.label, marginBottom: '16px' }}>Portfolio</p>
          <h1 className="port-h1" style={{ ...S.h1, fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '24px' }}>Our Selected Works</h1>
          <p className="port-body" style={{ ...S.body, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Explore our latest interior design projects, showcasing our commitment to timeless aesthetics, natural materials, and meticulous craftsmanship.
          </p>
        </header>

        <div ref={gridRef} className="portfolio-grid" style={{
          display: 'grid',
          gridAutoFlow: 'dense',
        }}>
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>

        <style>{`
          .portfolio-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 350px;
            gap: 24px;
          }

          .span-2x2 { grid-column: span 2; grid-row: span 2; }
          .span-2x1 { grid-column: span 2; grid-row: span 1; }
          .span-1x2 { grid-column: span 1; grid-row: span 2; }
          .span-1x1 { grid-column: span 1; grid-row: span 1; }

          @media (max-width: 1024px) {
            .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
          }

          @media (max-width: 767px) {
            .portfolio-grid {
              grid-template-columns: repeat(2, 1fr);
              grid-auto-rows: 200px;
              gap: 12px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
