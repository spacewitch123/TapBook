'use client';

import { useState, useRef, useEffect } from 'react';
import { Theme } from '@/types';
import { HexColorPicker } from 'react-colorful';
import { gsap } from 'gsap';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Zap, 
  Layers, 
  Eye,
  Sliders,
  Wand2,
  Brush,
  Droplets,
  Sun,
  Moon,
  Contrast,
  Shuffle,
  Code,
  Filter,
  Grid,
  Pen
} from 'lucide-react';

// Import our new advanced components
import FilterStudio from './FilterStudio';
import CustomCSSEditor from './CustomCSSEditor';
import BackgroundStudio from './BackgroundStudio';
import ShadowDesigner from './ShadowDesigner';
import ParticleSystem from '../effects/ParticleSystem';

interface AdvancedThemeEditorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const BACKDROP_STYLES = [
  { id: 'none', name: 'None', preview: 'bg-transparent' },
  { id: 'blur', name: 'Blur', preview: 'backdrop-blur-md bg-white/10' },
  { id: 'glass', name: 'Glass', preview: 'backdrop-blur-xl bg-white/20 border border-white/30' },
  { id: 'frosted', name: 'Frosted', preview: 'backdrop-blur-2xl bg-white/5 border border-white/10' },
  { id: 'tinted', name: 'Tinted', preview: 'backdrop-blur-sm bg-black/20' },
  { id: 'vibrant', name: 'Vibrant', preview: 'backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20' }
];

const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', class: 'font-sans', preview: 'Modern & Clean' },
  { id: 'outfit', name: 'Outfit', class: 'font-sans', preview: 'Friendly & Rounded' },
  { id: 'space-mono', name: 'Space Mono', class: 'font-mono', preview: 'Tech & Minimal' },
  { id: 'playfair', name: 'Playfair', class: 'font-serif', preview: 'Elegant & Classic' },
  { id: 'caveat', name: 'Caveat', class: 'font-sans', preview: 'Handwritten & Fun' },
  { id: 'poppins', name: 'Poppins', class: 'font-sans', preview: 'Bold & Geometric' },
  { id: 'dm-sans', name: 'DM Sans', class: 'font-sans', preview: 'Professional & Clear' }
];

const BUTTON_STYLES = [
  { id: 'rounded', name: 'Rounded', class: 'rounded-lg', preview: '8px radius' },
  { id: 'pill', name: 'Pill', class: 'rounded-full', preview: 'Full radius' },
  { id: 'square', name: 'Square', class: 'rounded-none', preview: 'No radius' },
  { id: 'subtle', name: 'Subtle', class: 'rounded-md', preview: '4px radius' },
  { id: 'sharp', name: 'Sharp', class: 'rounded-sm', preview: '2px radius' },
  { id: 'brutal', name: 'Brutal', class: 'rounded-none border-4 border-black', preview: 'Bold borders' }
];

const COLOR_PALETTES = [
  { name: 'Ocean', colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985'] },
  { name: 'Forest', colors: ['#10b981', '#059669', '#047857', '#065f46'] },
  { name: 'Sunset', colors: ['#f59e0b', '#d97706', '#b45309', '#92400e'] },
  { name: 'Purple', colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'] },
  { name: 'Rose', colors: ['#ec4899', '#db2777', '#be185d', '#9d174d'] },
  { name: 'Emerald', colors: ['#10b981', '#059669', '#047857', '#065f46'] }
];

export default function AdvancedThemeEditor({ theme, onThemeChange }: AdvancedThemeEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'effects' | 'filters' | 'backgrounds' | 'shadows' | 'particles' | 'css'>('colors');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const updateTheme = (updates: Partial<Theme>) => {
    onThemeChange({ ...theme, ...updates });
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette, description: 'Brand colors & palette' },
    { id: 'typography', label: 'Typography', icon: Type, description: 'Fonts & text styles' },
    { id: 'layout', label: 'Layout', icon: Layout, description: 'Structure & spacing' },
    { id: 'effects', label: 'Effects', icon: Sparkles, description: 'Animations & backdrops' },
    { id: 'filters', label: 'Filters', icon: Filter, description: 'CSS visual effects' },
    { id: 'backgrounds', label: 'Patterns', icon: Grid, description: 'Background textures' },
    { id: 'shadows', label: 'Shadows', icon: Layers, description: 'Shadow effects' },
    { id: 'particles', label: 'Particles', icon: Sparkles, description: 'Particle effects' },
    { id: 'css', label: 'Custom CSS', icon: Code, description: 'Raw CSS editing' }
  ] as const;

  const generateRandomTheme = () => {
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const randomFont = FONT_OPTIONS[Math.floor(Math.random() * FONT_OPTIONS.length)];
    const randomButton = BUTTON_STYLES[Math.floor(Math.random() * BUTTON_STYLES.length)];
    
    updateTheme({
      primaryColor: randomPalette.colors[0],
      font: randomFont.id as Theme['font'],
      buttonStyle: randomButton.id as Theme['buttonStyle']
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Magic Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Advanced Styling</h2>
          <p className="text-sm text-gray-500">Customize every aspect of your page</p>
        </div>
        <button
          onClick={generateRandomTheme}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Shuffle className="w-4 h-4" />
          Surprise Me
        </button>
      </div>

      {/* Enhanced Tab Navigation with Horizontal Scroll */}
      <div ref={tabsRef} className="relative">
        <div className="bg-gray-100 p-1 rounded-xl overflow-hidden">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1" style={{ scrollSnapType: 'x mandatory' }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <IconComponent className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Gradient fade indicators for scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-10" />
      </div>

      {/* Tab Content */}
      <div ref={containerRef} className="min-h-[400px]">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Color Palettes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Quick Palettes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => updateTheme({ primaryColor: palette.colors[0] })}
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{palette.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { key: 'primaryColor', label: 'Primary Color', icon: Brush },
                { key: 'backgroundColor', label: 'Background Color', icon: Droplets },
                { key: 'textColor', label: 'Text Color', icon: Type }
              ].map(({ key, label, icon: IconComponent }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {label}
                  </label>
                  <button
                    onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 flex items-center gap-3 px-4 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm"
                      style={{ backgroundColor: theme[key as keyof Theme] as string }}
                    />
                    <span className="text-sm font-mono text-gray-600 flex-1 text-left">
                      {(theme[key as keyof Theme] as string).toUpperCase()}
                    </span>
                    <Palette className="w-4 h-4 text-gray-400" />
                  </button>

                  {showColorPicker === key && (
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                      <HexColorPicker
                        color={theme[key as keyof Theme] as string}
                        onChange={(color) => updateTheme({ [key]: color })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            {/* Font Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Family
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateTheme({ font: font.id as Theme['font'] })}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-md ${
                      theme.font === font.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-lg font-semibold ${font.class}`} style={{ fontFamily: font.name }}>
                          {font.name}
                        </div>
                        <div className="text-sm text-gray-500">{font.preview}</div>
                      </div>
                      {theme.font === font.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Button Styles */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Button Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BUTTON_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateTheme({ buttonStyle: style.id as Theme['buttonStyle'] })}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-md ${
                      theme.buttonStyle === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-full h-8 bg-gray-300 mb-2 ${style.class}`}
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div className="text-sm font-medium">{style.name}</div>
                      <div className="text-xs text-gray-500">{style.preview}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            {/* Theme Styles */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Page Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'minimal', name: 'Minimal', description: 'Clean & simple' },
                  { id: 'dark', name: 'Dark Mode', description: 'Dark theme' },
                  { id: 'gradient', name: 'Gradient', description: 'Colorful backgrounds' },
                  { id: 'glass', name: 'Glassmorphism', description: 'Frosted glass effect' },
                  { id: 'neon', name: 'Neon', description: 'Cyberpunk vibes' },
                  { id: 'pastel', name: 'Pastel', description: 'Soft colors' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateTheme({ style: style.id as Theme['style'] })}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-md ${
                      theme.style === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{style.name}</div>
                    <div className="text-sm text-gray-500">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-6">
            {/* Backdrop Effects */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Backdrop Effects
              </h3>
              <p className="text-sm text-gray-500 mb-3">Apply glass/blur effects behind buttons and cards</p>
              <div className="grid grid-cols-2 gap-3">
                {BACKDROP_STYLES.map((backdrop) => (
                  <button
                    key={backdrop.id}
                    onClick={() => updateTheme({ backdropStyle: backdrop.id })}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className={`w-full h-16 rounded-lg mb-2 ${backdrop.preview}`} />
                    <div className="text-sm font-medium text-center">{backdrop.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Settings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Animations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Enable Animations</label>
                  <input
                    type="checkbox"
                    checked={theme.animations !== false}
                    onChange={(e) => updateTheme({ animations: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Hover Effects</label>
                  <input
                    type="checkbox"
                    checked={theme.hoverEffects !== false}
                    onChange={(e) => updateTheme({ hoverEffects: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <FilterStudio
            onFiltersChange={(filters) => {
              // Handle filter changes here
              console.log('Filters updated:', filters);
            }}
          />
        )}

        {activeTab === 'backgrounds' && (
          <BackgroundStudio
            onPatternChange={(pattern, options) => {
              // Extract just the background value from the CSS
              const backgroundValue = pattern
                .replace(/background-image:\s*/g, '')
                .replace(/background:\s*/g, '')
                .replace(/opacity:.*?;/g, '')
                .replace(/transform:.*?;/g, '')
                .replace(/mix-blend-mode:.*?;/g, '')
                .replace(/animation:.*?;/g, '')
                .trim()
                .replace(/;$/, '');
              
              updateTheme({ backgroundPattern: backgroundValue || null });
            }}
          />
        )}

        {activeTab === 'shadows' && (
          <ShadowDesigner
            onShadowChange={(shadow) => {
              // Handle shadow changes here
              updateTheme({ customShadow: shadow });
            }}
          />
        )}

        {activeTab === 'particles' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Particle Effects
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['snow', 'stars', 'bubbles', 'geometric', 'fireflies', 'matrix'].map(type => (
                <button
                  key={type}
                  onClick={() => updateTheme({ particleEffect: type })}
                  className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                    theme.particleEffect === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
            <div className="bg-gray-100 p-4 rounded-xl relative overflow-hidden h-32">
              <ParticleSystem 
                type={theme.particleEffect as any || 'stars'}
                intensity="medium"
                enabled={!!theme.particleEffect}
              />
              <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">
                Particle Preview
              </div>
            </div>
          </div>
        )}

        {activeTab === 'css' && (
          <CustomCSSEditor
            customCSS={theme.customCSS || ''}
            onCSSChange={(css) => updateTheme({ customCSS: css })}
          />
        )}
      </div>

      {/* Backdrop overlay for color picker */}
      {showColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColorPicker(null)}
        />
      )}

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}