'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  transition?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'curtain' | 'wipe' | 'zoom' | 'morph' | 'liquid';
  duration?: number;
  easing?: string;
  className?: string;
}

interface TransitionOverlayProps {
  isActive: boolean;
  type: string;
  onComplete: () => void;
}

export default function PageTransition({
  children,
  transition = 'fade',
  duration = 0.8,
  easing = 'power2.inOut',
  className = ''
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTransition, setCurrentTransition] = useState(transition);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    setIsTransitioning(true);

    // Page enter animation
    const enterAnimation = getEnterAnimation(currentTransition, element, duration, easing);
    
    enterAnimation.play().then(() => {
      setIsTransitioning(false);
    });

    return () => {
      enterAnimation.kill();
    };
  }, [pathname, currentTransition, duration, easing]);

  const getEnterAnimation = (type: string, element: HTMLElement, dur: number, ease: string) => {
    const timeline = gsap.timeline({ paused: true });

    switch (type) {
      case 'fade':
        timeline
          .set(element, { opacity: 0 })
          .to(element, { opacity: 1, duration: dur, ease });
        break;

      case 'slide':
        timeline
          .set(element, { x: '100%' })
          .to(element, { x: '0%', duration: dur, ease });
        break;

      case 'scale':
        timeline
          .set(element, { scale: 0.8, opacity: 0 })
          .to(element, { scale: 1, opacity: 1, duration: dur, ease });
        break;

      case 'rotate':
        timeline
          .set(element, { rotation: 90, opacity: 0 })
          .to(element, { rotation: 0, opacity: 1, duration: dur, ease });
        break;

      case 'flip':
        timeline
          .set(element, { rotationY: -90, opacity: 0 })
          .to(element, { rotationY: 0, opacity: 1, duration: dur, ease });
        break;

      case 'curtain':
        timeline
          .set(element, { clipPath: 'inset(0 100% 0 0)' })
          .to(element, { clipPath: 'inset(0 0% 0 0)', duration: dur, ease });
        break;

      case 'wipe':
        timeline
          .set(element, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' })
          .to(element, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', duration: dur, ease });
        break;

      case 'zoom':
        timeline
          .set(element, { scale: 2, opacity: 0 })
          .to(element, { scale: 1, opacity: 1, duration: dur, ease });
        break;

      case 'morph':
        timeline
          .set(element, { borderRadius: '50%', scale: 0, opacity: 0 })
          .to(element, { 
            borderRadius: '0%', 
            scale: 1, 
            opacity: 1, 
            duration: dur, 
            ease: 'back.out(1.7)' 
          });
        break;

      case 'liquid':
        const path1 = 'M0,0 C0,0 0,100 0,100 L100,100 L100,0 Z';
        const path2 = 'M0,0 C50,150 50,-50 100,0 L100,100 L0,100 Z';
        const path3 = 'M0,0 C0,0 100,0 100,0 L100,100 L0,100 Z';
        
        timeline
          .set(element, { opacity: 0, clipPath: `path('${path1}')` })
          .to(element, { opacity: 1, duration: 0.1 })
          .to(element, { clipPath: `path('${path2}')`, duration: dur * 0.4, ease })
          .to(element, { clipPath: `path('${path3}')`, duration: dur * 0.6, ease });
        break;

      default:
        timeline.set(element, { opacity: 1 });
    }

    return timeline;
  };

  return (
    <div 
      ref={containerRef} 
      className={`transition-container ${className} ${isTransitioning ? 'transitioning' : ''}`}
    >
      {children}
    </div>
  );
}

// Transition overlay component for complex transitions
function TransitionOverlay({ isActive, type, onComplete }: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !isActive) return;

    const overlay = overlayRef.current;
    const timeline = gsap.timeline({ onComplete });

    switch (type) {
      case 'curtain':
        timeline
          .set(overlay, { scaleY: 0, transformOrigin: 'top' })
          .to(overlay, { scaleY: 1, duration: 0.5, ease: 'power2.out' })
          .to(overlay, { scaleY: 0, transformOrigin: 'bottom', duration: 0.5, ease: 'power2.in' });
        break;

      case 'wipe':
        timeline
          .set(overlay, { x: '-100%' })
          .to(overlay, { x: '0%', duration: 0.5, ease: 'power2.out' })
          .to(overlay, { x: '100%', duration: 0.5, ease: 'power2.in' });
        break;

      case 'liquid':
        // Complex liquid transition using multiple elements
        const particles = overlay.querySelectorAll('.particle');
        timeline
          .set(particles, { scale: 0, opacity: 0 })
          .to(particles, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: 'back.out(1.7)' 
          })
          .to(particles, { 
            scale: 0, 
            opacity: 0, 
            duration: 0.6, 
            stagger: 0.05, 
            ease: 'power2.in' 
          });
        break;
    }

    return () => {
      timeline.kill();
    };
  }, [isActive, type, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {type === 'curtain' && (
        <div className="w-full h-full bg-gradient-to-b from-purple-600 to-pink-600" />
      )}
      {type === 'wipe' && (
        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-600" />
      )}
      {type === 'liquid' && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-4 h-4 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Hook for programmatic transitions
export function usePageTransition(type: string = 'fade') {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (callback?: () => void) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      callback?.();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }, 400);
  };

  return { isTransitioning, startTransition };
}

// Loading transition component
export function LoadingTransition({ 
  isLoading, 
  type = 'fade',
  color = '#6366f1',
  className = ''
}: {
  isLoading: boolean;
  type?: 'fade' | 'pulse' | 'spin' | 'wave' | 'morph' | 'liquid';
  color?: string;
  className?: string;
}) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const loader = loaderRef.current;
    
    if (isLoading) {
      gsap.set(loader, { display: 'flex' });
      gsap.fromTo(loader, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      );

      // Start loader animation
      startLoaderAnimation(loader, type, color);
    } else {
      gsap.to(loader, { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => {
          gsap.set(loader, { display: 'none' });
        }
      });
    }
  }, [isLoading, type, color]);

  const startLoaderAnimation = (element: HTMLElement, animType: string, animColor: string) => {
    const inner = element.querySelector('.loader-inner');
    if (!inner) return;

    gsap.killTweensOf(inner);

    switch (animType) {
      case 'pulse':
        gsap.to(inner, {
          scale: 1.2,
          opacity: 0.7,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
        break;

      case 'spin':
        gsap.to(inner, {
          rotation: 360,
          duration: 1,
          repeat: -1,
          ease: 'none'
        });
        break;

      case 'wave':
        const dots = inner.querySelectorAll('.dot');
        gsap.to(dots, {
          y: -20,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          stagger: 0.1,
          ease: 'power2.inOut'
        });
        break;

      case 'morph':
        gsap.to(inner, {
          borderRadius: '50% 10% 50% 10%',
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
        break;

      case 'liquid':
        gsap.to(inner, {
          scaleX: 1.5,
          scaleY: 0.7,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
        break;
    }
  };

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm ${className}`}
    >
      <div className="loader-inner flex items-center justify-center">
        {type === 'spin' && (
          <div 
            className="w-12 h-12 border-4 border-transparent rounded-full"
            style={{ 
              borderTopColor: color,
              borderRightColor: color
            }}
          />
        )}
        {type === 'wave' && (
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="dot w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
        {(type === 'pulse' || type === 'morph' || type === 'liquid') && (
          <div 
            className="w-16 h-16 rounded-xl"
            style={{ backgroundColor: color }}
          />
        )}
        {type === 'fade' && (
          <div 
            className="w-8 h-8 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
    </div>
  );
}

// Route transition wrapper
export function RouteTransition({ 
  children,
  transition = 'fade' 
}: { 
  children: React.ReactNode;
  transition?: string;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (children !== displayChildren) {
      setIsTransitioning(true);
      
      // Exit animation
      setTimeout(() => {
        setDisplayChildren(children);
        // Enter animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 400);
    }
  }, [children, displayChildren]);

  return (
    <PageTransition 
      transition={transition as any}
      className={isTransitioning ? 'opacity-0' : 'opacity-100'}
    >
      {displayChildren}
    </PageTransition>
  );
}