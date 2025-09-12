'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleSystemProps {
  type: 'snow' | 'stars' | 'bubbles' | 'geometric' | 'fireflies' | 'matrix';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  enabled?: boolean;
  className?: string;
}

export default function ParticleSystem({ 
  type, 
  intensity = 'medium', 
  color = '#ffffff', 
  enabled = true,
  className = ''
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const particleCounts = {
    low: 20,
    medium: 50,
    high: 100
  };

  const createParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const { width, height } = canvas;

    switch (type) {
      case 'snow':
        return {
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          life: 1,
          maxLife: 1,
          size: Math.random() * 4 + 2,
          color: color,
          opacity: Math.random() * 0.8 + 0.2
        };

      case 'bubbles':
        return {
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 1,
          vy: -(Math.random() * 2 + 1),
          life: 1,
          maxLife: 1,
          size: Math.random() * 20 + 10,
          color: color,
          opacity: Math.random() * 0.5 + 0.1
        };

      case 'stars':
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
          size: Math.random() * 3 + 1,
          color: color,
          opacity: Math.random() * 0.8 + 0.2
        };

      case 'fireflies':
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 200 + 100,
          maxLife: Math.random() * 200 + 100,
          size: Math.random() * 4 + 2,
          color: '#ffeb3b',
          opacity: Math.random() * 0.8 + 0.2
        };

      case 'geometric':
        return {
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 1,
          life: 1,
          maxLife: 1,
          size: Math.random() * 15 + 5,
          color: color,
          opacity: Math.random() * 0.7 + 0.3
        };

      case 'matrix':
        return {
          x: Math.random() * width,
          y: -10,
          vx: 0,
          vy: Math.random() * 5 + 3,
          life: 1,
          maxLife: 1,
          size: Math.random() * 15 + 10,
          color: '#00ff41',
          opacity: Math.random() * 0.9 + 0.1
        };

      default:
        return {} as Particle;
    }
  };

  const updateParticle = (particle: Particle, deltaTime: number) => {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    if (type === 'stars' || type === 'fireflies') {
      particle.life -= deltaTime;
      particle.opacity = (particle.life / particle.maxLife) * 0.8;
      
      if (type === 'fireflies') {
        // Floating motion
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Pulsing effect
        particle.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.01 + particle.x * 0.01);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Remove particles that are out of bounds or dead
    if (particle.y > canvas.height + 50 || 
        particle.x < -50 || 
        particle.x > canvas.width + 50 || 
        (particle.life <= 0 && (type === 'stars' || type === 'fireflies'))) {
      return false;
    }

    return true;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;

    switch (type) {
      case 'snow':
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'bubbles':
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color + '80');
        gradient.addColorStop(0.7, particle.color + '20');
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight
        ctx.fillStyle = '#ffffff60';
        ctx.beginPath();
        ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'stars':
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        
        // Star shape
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size * 0.5;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes;
          const x = particle.x + Math.cos(angle) * radius;
          const y = particle.y + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'fireflies':
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 25;
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'geometric':
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.life * 0.05);
        
        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(-particle.size * 0.866, particle.size * 0.5);
        ctx.lineTo(particle.size * 0.866, particle.size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;

      case 'matrix':
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 5;
        ctx.font = `${particle.size}px monospace`;
        ctx.textAlign = 'center';
        
        // Random matrix character
        const chars = 'アカサタナハマヤラワガザダバパ1234567890';
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, particle.x, particle.y);
        break;
    }

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !enabled) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const alive = updateParticle(particle, 1);
      if (alive) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });

    // Add new particles
    const maxParticles = particleCounts[intensity];
    while (particlesRef.current.length < maxParticles) {
      particlesRef.current.push(createParticle());
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      particlesRef.current = [];
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, type, intensity, color]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    />
  );
}