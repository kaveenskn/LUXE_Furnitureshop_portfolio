import React, { useRef } from 'react';
import { S, SERIF, SANS } from '../styles/shared';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Initial Consultation',
    desc: "We begin by understanding your vision, lifestyle, and spatial requirements. This foundation ensures the entire project aligns perfectly with your expectations.",
    img: '/images/office.png'
  },
  {
    num: '02',
    title: 'Concept & Spatial Planning',
    desc: "Our design team translates your requirements into precise spatial layouts and initial moodboards, optimizing flow and function.",
    img: '/images/bedroom.png'
  },
  {
    num: '03',
    title: 'Material Selection',
    desc: "We curate premium materials—from natural stones and rare woods to bespoke furniture fittings—focusing on both aesthetics and tactile quality.",
    img: '/images/kitchen.png'
  },
  {
    num: '04',
    title: 'Detailed Design & 3D Visualization',
    desc: "Before construction begins, we provide photorealistic 3D renderings and comprehensive technical drawings, allowing you to walk through the space virtually.",
    img: '/images/living_room.png'
  },
  {
    num: '05',
    title: 'Craftsmanship & Construction',
    desc: "Our master builders and artisans bring the design to life with uncompromising attention to detail, precision, and quality control.",
    img: 'https://images.unsplash.com/photo-1581428982868-e410dd127a90?auto=format&fit=crop&q=80&w=800'
  },
  {
    num: '06',
    title: 'Final Reveal & Handover',
    desc: "We conduct a meticulous final walkthrough, ensuring every element is perfect before welcoming you to your newly transformed space.",
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Process() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Header animation
    gsap.from('.process-header > *', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // Step animations
    gsap.utils.toArray('.process-card').forEach((card, i) => {
      const isEven = i % 2 === 0;
      
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: isEven ? -50 : 50,
        duration: 0.8,
        ease: 'power3.out',
      });
      
      // Animate images separately for parallax/reveal effect
      const img = card.querySelector('.process-img');
      if (img) {
        gsap.from(img, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          scale: 1.2,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    });
    
    // Animate the central line
    gsap.to('.process-line-fill', {
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 50%',
        end: 'bottom 80%',
        scrub: true,
      },
      height: '100%',
      ease: 'none'
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', paddingBottom: '120px' }}>
      
      {/* Header */}
      <section className="process-header" style={{ paddingTop: '160px', paddingBottom: '80px', textAlign: 'center', padding: '160px 5vw 80px' }}>
        <span style={{ ...S.label, marginBottom: '20px', display: 'block', color: 'rgba(255,255,255,0.5)' }}>How We Work</span>
        <h1 style={{ ...S.h1, fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '30px' }}>Our Process</h1>
        <p style={{ ...S.body, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
          A meticulous step-by-step journey from initial conception to the final flawless execution.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="process-timeline" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Central Line */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.1)', display: 'none' }} className="desktop-line">
          <div className="process-line-fill" style={{ width: '100%', height: '0%', background: '#fff' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {PROCESS_STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={step.num} className="process-card" style={{ 
                display: 'flex', 
                flexDirection: isEven ? 'row' : 'row-reverse',
                alignItems: 'center',
                gap: '8vw',
                position: 'relative'
              }}>
                
                {/* Text Content */}
                <div style={{ flex: 1, textAlign: isEven ? 'right' : 'left' }}>
                  <span style={{ fontFamily: SERIF, fontSize: '3.5rem', color: 'rgba(255,255,255,0.1)', fontWeight: 300, lineHeight: 1 }}>{step.num}</span>
                  <h3 style={{ ...S.h2, fontSize: '2rem', marginBottom: '16px', marginTop: '-10px' }}>{step.title}</h3>
                  <p style={{ ...S.body, fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)' }}>{step.desc}</p>
                </div>
                
                {/* Image */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    position: 'relative', 
                    aspectRatio: '4/3', 
                    overflow: 'hidden', 
                    borderRadius: '4px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }}>
                    <img 
                      className="process-img"
                      src={step.img} 
                      alt={step.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                </div>

                {/* Dot marker on line (Desktop only via CSS) */}
                <div className="process-dot" style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#fff',
                  border: '3px solid #0a0a0a',
                  display: 'none',
                  zIndex: 2
                }} />
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .desktop-line, .process-dot {
            display: block !important;
          }
        }
        @media (max-width: 767px) {
          .process-card {
            flex-direction: column-reverse !important;
            gap: 30px !important;
            text-align: left !important;
          }
          .process-card > div {
            text-align: left !important;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
