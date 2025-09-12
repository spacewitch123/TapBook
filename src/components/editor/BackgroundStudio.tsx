'use client';

import { useState, useEffect } from 'react';
import { 
  Grid, 
  Waves, 
  Zap, 
  Circle, 
  Square, 
  Triangle,
  Brush,
  Palette,
  Settings,
  Eye
} from 'lucide-react';
import { HoverAnimation } from './MicroAnimations';

interface BackgroundPattern {
  id: string;
  name: string;
  type: 'geometric' | 'organic' | 'texture' | 'animated';
  icon: any;
  generate: (options: PatternOptions) => string;
  preview: string;
}

interface PatternOptions {
  primaryColor: string;
  secondaryColor: string;
  size: number;
  opacity: number;
  rotation: number;
  spacing: number;
  blendMode: string;
  animation?: boolean;
}

interface BackgroundStudioProps {
  onPatternChange: (pattern: string, options: PatternOptions) => void;
  className?: string;
}

const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
  'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten'
];

const BACKGROUND_PATTERNS: BackgroundPattern[] = [
  {
    id: 'dots',
    name: 'Polka Dots',
    type: 'geometric',
    icon: Circle,
    preview: 'radial-gradient(circle at 20px 20px, #6366f1 2px, transparent 2px)',
    generate: (options) => `
      background-image: radial-gradient(circle at ${options.spacing}px ${options.spacing}px, ${options.primaryColor} ${options.size}px, transparent ${options.size}px);
      background-size: ${options.spacing * 2}px ${options.spacing * 2}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'grid',
    name: 'Grid Lines',
    type: 'geometric',
    icon: Grid,
    preview: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
    generate: (options) => `
      background-image: 
        linear-gradient(${options.primaryColor} ${options.size}px, transparent ${options.size}px),
        linear-gradient(90deg, ${options.primaryColor} ${options.size}px, transparent ${options.size}px);
      background-size: ${options.spacing}px ${options.spacing}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'diagonal',
    name: 'Diagonal Lines',
    type: 'geometric',
    icon: Zap,
    preview: 'repeating-linear-gradient(45deg, #6366f1, #6366f1 2px, transparent 2px, transparent 20px)',
    generate: (options) => `
      background-image: repeating-linear-gradient(
        ${options.rotation}deg,
        ${options.primaryColor},
        ${options.primaryColor} ${options.size}px,
        transparent ${options.size}px,
        transparent ${options.spacing}px
      );
      opacity: ${options.opacity / 100};
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'checkerboard',
    name: 'Checkerboard',
    type: 'geometric',
    icon: Square,
    preview: 'conic-gradient(#6366f1 90deg, transparent 90deg)',
    generate: (options) => `
      background-image: conic-gradient(
        ${options.primaryColor} 90deg,
        ${options.secondaryColor} 90deg,
        ${options.secondaryColor} 180deg,
        ${options.primaryColor} 180deg,
        ${options.primaryColor} 270deg,
        ${options.secondaryColor} 270deg
      );
      background-size: ${options.spacing}px ${options.spacing}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'triangles',
    name: 'Triangle Pattern',
    type: 'geometric',
    icon: Triangle,
    preview: 'linear-gradient(135deg, #6366f1 25%, transparent 25%)',
    generate: (options) => `
      background-image: 
        linear-gradient(135deg, ${options.primaryColor} 25%, transparent 25%),
        linear-gradient(225deg, ${options.primaryColor} 25%, transparent 25%),
        linear-gradient(45deg, ${options.primaryColor} 25%, transparent 25%),
        linear-gradient(315deg, ${options.primaryColor} 25%, transparent 25%);
      background-size: ${options.spacing}px ${options.spacing}px;
      background-position: 0 0, ${options.spacing/2}px 0, ${options.spacing/2}px ${options.spacing/2}px, 0px ${options.spacing/2}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'waves',
    name: 'Wave Pattern',
    type: 'organic',
    icon: Waves,
    preview: 'radial-gradient(ellipse at top, #6366f1, transparent)',
    generate: (options) => `
      background-image: 
        radial-gradient(ellipse ${options.spacing}px ${options.size}px at 0 0, ${options.primaryColor}, transparent),
        radial-gradient(ellipse ${options.spacing}px ${options.size}px at ${options.spacing/2}px ${options.size}px, ${options.secondaryColor}, transparent);
      background-size: ${options.spacing}px ${options.size * 2}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
      ${options.animation ? 'animation: wave-float 6s ease-in-out infinite;' : ''}
    `
  },
  {
    id: 'hexagons',
    name: 'Hexagon Grid',
    type: 'geometric',
    icon: Circle,
    preview: 'radial-gradient(circle at 50% 50%, #6366f1, transparent)',
    generate: (options) => `
      background-image: 
        radial-gradient(circle at 25% 25%, ${options.primaryColor} 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, ${options.secondaryColor} 2px, transparent 2px);
      background-size: ${options.spacing}px ${options.spacing}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
    `
  },
  {
    id: 'organic-shapes',
    name: 'Organic Shapes',
    type: 'organic',
    icon: Brush,
    preview: 'radial-gradient(ellipse, #6366f1, transparent)',
    generate: (options) => `
      background-image: 
        radial-gradient(ellipse ${options.size}px ${options.size * 1.5}px at 20% 30%, ${options.primaryColor}, transparent),
        radial-gradient(ellipse ${options.size * 0.8}px ${options.size}px at 80% 70%, ${options.secondaryColor}, transparent),
        radial-gradient(ellipse ${options.size * 1.2}px ${options.size * 0.7}px at 50% 90%, ${options.primaryColor}66, transparent);
      background-size: ${options.spacing}px ${options.spacing}px;
      opacity: ${options.opacity / 100};
      transform: rotate(${options.rotation}deg);
      mix-blend-mode: ${options.blendMode};
      ${options.animation ? 'animation: organic-morph 20s ease-in-out infinite;' : ''}
    `
  }
];

const TEXTURE_PATTERNS: BackgroundPattern[] = [
  {
    id: 'noise',
    name: 'Noise Texture',
    type: 'texture',
    icon: Settings,
    preview: 'url("data:image/svg+xml,...")',
    generate: (options) => {
      const noiseData = generateNoiseTexture(options);
      return `
        background-image: url("${noiseData}");
        background-size: ${options.spacing}px ${options.spacing}px;
        opacity: ${options.opacity / 100};
        mix-blend-mode: ${options.blendMode};
      `;
    }
  },
  {
    id: 'paper',
    name: 'Paper Texture',
    type: 'texture',
    icon: Brush,
    preview: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)',
    generate: (options) => `
      background-image: 
        radial-gradient(circle at 1px 1px, ${options.primaryColor}33 1px, transparent 0),
        radial-gradient(circle at 2px 2px, ${options.secondaryColor}22 1px, transparent 0);
      background-size: ${options.spacing}px ${options.spacing}px;
      opacity: ${options.opacity / 100};
      mix-blend-mode: ${options.blendMode};
    `
  }
];

function generateNoiseTexture(options: PatternOptions): string {
  const canvas = document.createElement('canvas');
  canvas.width = options.spacing;
  canvas.height = options.spacing;
  const ctx = canvas.getContext('2d')!;
  
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255;
    data[i] = noise;     // red
    data[i + 1] = noise; // green  
    data[i + 2] = noise; // blue
    data[i + 3] = options.opacity * 2.55; // alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export default function BackgroundStudio({ onPatternChange, className = '' }: BackgroundStudioProps) {
  const [selectedPattern, setSelectedPattern] = useState<BackgroundPattern | null>(null);
  const [options, setOptions] = useState<PatternOptions>({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    size: 2,
    opacity: 30,
    rotation: 0,
    spacing: 20,
    blendMode: 'normal',
    animation: false
  });

  const allPatterns = [...BACKGROUND_PATTERNS, ...TEXTURE_PATTERNS];

  const updateOption = (key: keyof PatternOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    if (selectedPattern) {
      onPatternChange(selectedPattern.generate(newOptions), newOptions);
    }
  };

  const selectPattern = (pattern: BackgroundPattern) => {
    setSelectedPattern(pattern);
    onPatternChange(pattern.generate(options), options);
  };

  const clearPattern = () => {
    setSelectedPattern(null);
    onPatternChange('', options);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Background Studio
          </h3>
          <p className="text-sm text-gray-500">Create decorative patterns behind your content</p>
        </div>
        {selectedPattern && (
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={clearPattern}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Clear Pattern
            </button>
          </HoverAnimation>
        )}
      </div>

      {/* Pattern Selection */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Choose Pattern</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allPatterns.map((pattern) => {
            const IconComponent = pattern.icon;
            return (
              <HoverAnimation key={pattern.id} hoverScale={1.02}>
                <button
                  onClick={() => selectPattern(pattern)}
                  className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                    selectedPattern?.id === pattern.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div 
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ background: pattern.preview }}
                  />
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{pattern.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{pattern.type}</span>
                </button>
              </HoverAnimation>
            );
          })}
        </div>
      </div>

      {/* Pattern Controls */}
      {selectedPattern && (
        <div className="space-y-4 bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900">Pattern Controls</h4>
          
          {/* Color Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={options.primaryColor}
                onChange={(e) => updateOption('primaryColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={options.secondaryColor}
                onChange={(e) => updateOption('secondaryColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Size and Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {options.size}px
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={options.size}
                onChange={(e) => updateOption('size', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spacing: {options.spacing}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={options.spacing}
                onChange={(e) => updateOption('spacing', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Opacity and Rotation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity: {options.opacity}%
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={options.opacity}
                onChange={(e) => updateOption('opacity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {options.rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={options.rotation}
                onChange={(e) => updateOption('rotation', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Blend Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blend Mode
            </label>
            <select
              value={options.blendMode}
              onChange={(e) => updateOption('blendMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {BLEND_MODES.map(mode => (
                <option key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Animation Toggle */}
          {(selectedPattern.type === 'organic' || selectedPattern.type === 'animated') && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Animation</label>
              <input
                type="checkbox"
                checked={options.animation}
                onChange={(e) => updateOption('animation', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Live Preview */}
      {selectedPattern && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Live Preview
          </h4>
          <div 
            className="w-full h-32 border border-gray-200 rounded-lg relative overflow-hidden"
            style={{ backgroundColor: '#f8fafc' }}
          >
            <div
              className="absolute inset-0"
              style={{ 
                background: selectedPattern.generate(options).replace(/background-image:|opacity:|transform:|mix-blend-mode:|animation:/g, '').trim()
              }}
            />
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes wave-float {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes organic-morph {
          0%, 100% { background-position: 0% 0%, 0% 0%, 0% 0%; }
          25% { background-position: 50% 25%, 25% 50%, 75% 25%; }
          50% { background-position: 100% 50%, 50% 100%, 50% 50%; }
          75% { background-position: 25% 75%, 75% 25%, 25% 75%; }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
          transition: background .15s ease-in-out;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #4f46e5;
          box-shadow: 0 0 5px 0 #333;
        }
      `}</style>
    </div>
  );
}