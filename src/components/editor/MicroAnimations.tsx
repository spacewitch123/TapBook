'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MicroAnimationsProps {
  children: React.ReactNode;
  type?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'bounceIn' | 'flipIn';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function MicroAnimations({ 
  children, 
  type = 'fadeIn', 
  delay = 0, 
  duration = 0.6,
  className = ''
}: MicroAnimationsProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    const animations = {
      fadeIn: () => {
        gsap.fromTo(element, 
          { opacity: 0 },
          { opacity: 1, duration, delay, ease: "power2.out" }
        );
      },
      slideUp: () => {
        gsap.fromTo(element,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
        );
      },
      scaleIn: () => {
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.7)" }
        );
      },
      bounceIn: () => {
        gsap.fromTo(element,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration, delay, ease: "bounce.out" }
        );
      },
      flipIn: () => {
        gsap.fromTo(element,
          { opacity: 0, rotationY: -90 },
          { opacity: 1, rotationY: 0, duration, delay, ease: "power2.out" }
        );
      }
    };

    animations[type]();
  }, [type, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// Hover animation component
export function HoverAnimation({ 
  children, 
  className = '',
  hoverScale = 1.05,
  hoverRotation = 0
}: {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotation?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: hoverScale,
        rotation: hoverRotation,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoverScale, hoverRotation]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}