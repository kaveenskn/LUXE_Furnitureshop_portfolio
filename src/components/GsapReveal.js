import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function GsapReveal({ 
  children, 
  delay = 0, 
  duration = 0.85, 
  y = 40,
  className = '', 
  style = {},
  stagger = 0,
  ease = "power3.out",
  triggerOffset = "top 85%" 
}) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(container.current, {
      scrollTrigger: {
        trigger: container.current,
        start: triggerOffset,
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: y,
      duration: duration,
      delay: delay,
      ease: ease,
      stagger: stagger,
    });
  }, { scope: container });

  return (
    <div ref={container} className={className} style={{ willChange: 'opacity, transform', ...style }}>
      {children}
    </div>
  );
}
