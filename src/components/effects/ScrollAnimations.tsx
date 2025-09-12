'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 
             'scaleUp' | 'scaleDown' | 'rotateIn' | 'flipX' | 'flipY' | 
             'bounceIn' | 'zoomIn' | 'parallax' | 'reveal' | 'typewriter';
  trigger?: 'enter' | 'enterViewport' | 'scroll' | 'hover';
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
  speed?: number; // For parallax
}

export default function ScrollAnimation({
  children,
  animation = 'fadeIn',
  trigger = 'enterViewport',
  duration = 1,
  delay = 0,
  stagger = 0,
  once = true,
  className = '',
  speed = 0.5
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const children = element.children;

    // Define animation configurations
    const animations = {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      slideUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 }
      },
      slideDown: {
        from: { opacity: 0, y: -50 },
        to: { opacity: 1, y: 0 }
      },
      slideLeft: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0 }
      },
      slideRight: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0 }
      },
      scaleUp: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 }
      },
      scaleDown: {
        from: { opacity: 0, scale: 1.2 },
        to: { opacity: 1, scale: 1 }
      },
      rotateIn: {
        from: { opacity: 0, rotation: -90 },
        to: { opacity: 1, rotation: 0 }
      },
      flipX: {
        from: { opacity: 0, rotationX: -90 },
        to: { opacity: 1, rotationX: 0 }
      },
      flipY: {
        from: { opacity: 0, rotationY: -90 },
        to: { opacity: 1, rotationY: 0 }
      },
      bounceIn: {
        from: { opacity: 0, scale: 0.3 },
        to: { opacity: 1, scale: 1 }
      },
      zoomIn: {
        from: { opacity: 0, scale: 0 },
        to: { opacity: 1, scale: 1 }
      },
      parallax: {
        from: { y: 0 },
        to: { y: -100 * speed }
      },
      reveal: {
        from: { clipPath: 'inset(0 100% 0 0)' },
        to: { clipPath: 'inset(0 0% 0 0)' }
      }
    };

    const config = animations[animation] || animations.fadeIn;

    // Set initial state
    if (children.length > 0 && stagger > 0) {
      gsap.set(children, config.from);
    } else {
      gsap.set(element, config.from);
    }

    let scrollTrigger: ScrollTrigger | null = null;

    if (trigger === 'enterViewport') {
      scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        once,
        onEnter: () => {
          setIsVisible(true);
          if (children.length > 0 && stagger > 0) {
            gsap.to(children, {
              ...config.to,
              duration,
              delay,
              stagger,
              ease: getEaseForAnimation(animation)
            });
          } else {
            gsap.to(element, {
              ...config.to,
              duration,
              delay,
              ease: getEaseForAnimation(animation)
            });
          }
        },
        onLeave: () => {
          if (!once) {
            setIsVisible(false);
            gsap.to(element, config.from);
          }
        }
      });
    } else if (trigger === 'scroll' && animation === 'parallax') {
      scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.to(element, {
            y: -self.progress * 100 * speed,
            duration: 0.1,
            ease: 'none'
          });
        }
      });
    }

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [animation, trigger, duration, delay, stagger, once, speed]);

  const getEaseForAnimation = (anim: string) => {
    const eases: { [key: string]: string } = {
      fadeIn: 'power2.out',
      slideUp: 'power3.out',
      slideDown: 'power3.out',
      slideLeft: 'power3.out',
      slideRight: 'power3.out',
      scaleUp: 'back.out(1.7)',
      scaleDown: 'back.out(1.7)',
      rotateIn: 'power2.out',
      flipX: 'power2.out',
      flipY: 'power2.out',
      bounceIn: 'bounce.out',
      zoomIn: 'back.out(1.7)',
      reveal: 'power2.inOut'
    };
    return eases[anim] || 'power2.out';
  };

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// Utility hook for multiple scroll animations
export function useScrollAnimations() {
  useEffect(() => {
    // Auto-detect elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((element) => {
      const animation = element.getAttribute('data-animate') || 'fadeIn';
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const duration = parseFloat(element.getAttribute('data-duration') || '1');
      const stagger = parseFloat(element.getAttribute('data-stagger') || '0');

      const config = getAnimationConfig(animation);
      
      gsap.set(element, config.from);

      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const children = element.children;
          if (children.length > 0 && stagger > 0) {
            gsap.to(children, {
              ...config.to,
              duration,
              delay,
              stagger,
              ease: 'power3.out'
            });
          } else {
            gsap.to(element, {
              ...config.to,
              duration,
              delay,
              ease: 'power3.out'
            });
          }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}

function getAnimationConfig(animation: string) {
  const configs: { [key: string]: any } = {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    slideUp: {
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0 }
    },
    slideLeft: {
      from: { opacity: 0, x: 50 },
      to: { opacity: 1, x: 0 }
    },
    scaleUp: {
      from: { opacity: 0, scale: 0.8 },
      to: { opacity: 1, scale: 1 }
    }
  };
  return configs[animation] || configs.fadeIn;
}

// Scroll-triggered counter animation
export function ScrollCounter({ 
  target, 
  duration = 2, 
  className = '' 
}: { 
  target: number; 
  duration?: number; 
  className?: string; 
}) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!counterRef.current) return;

    const element = counterRef.current;

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to({ value: 0 }, {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: function() {
            setCount(Math.round(this.targets()[0].value));
          }
        });
      }
    });
  }, [target, duration]);

  return <span ref={counterRef} className={className}>{count}</span>;
}

// Scroll-triggered text reveal
export function ScrollTextReveal({ 
  text, 
  className = '',
  delay = 0,
  stagger = 0.05 
}: { 
  text: string; 
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const words = text.split(' ');
    
    element.innerHTML = words
      .map(word => `<span class="inline-block">${word}</span>`)
      .join(' ');

    const wordSpans = element.querySelectorAll('span');
    
    gsap.set(wordSpans, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(wordSpans, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          stagger,
          ease: 'power3.out'
        });
      }
    });
  }, [text, delay, stagger]);

  return <div ref={textRef} className={className} />;
}

// Progress bar that fills on scroll
export function ScrollProgressBar({ 
  className = '',
  color = '#6366f1' 
}: { 
  className?: string;
  color?: string;
}) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    const element = progressRef.current;

    gsap.set(element, { scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        gsap.to(element, {
          scaleX: self.progress,
          duration: 0.1,
          ease: 'none'
        });
      }
    });
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 z-50 ${className}`}>
      <div
        ref={progressRef}
        className="h-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// Magnetic effect for elements
export function MagneticElement({ 
  children, 
  strength = 0.3,
  className = '' 
}: { 
  children: React.ReactNode; 
  strength?: number;
  className?: string;
}) {
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magnetRef.current) return;

    const element = magnetRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={magnetRef} className={className}>
      {children}
    </div>
  );
}