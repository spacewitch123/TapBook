'use client';

import { useState, useCallback } from 'react';
import { 
  Sliders, 
  Sun, 
  Contrast, 
  Droplets, 
  Zap, 
  Eye, 
  RotateCcw,
  Copy,
  Download
} from 'lucide-react';
import { HoverAnimation } from './MicroAnimations';

interface FilterSettings {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  invert: number;
  opacity: number;
  dropShadow: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
}

interface FilterStudioProps {
  onFiltersChange: (filters: FilterSettings) => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterSettings = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  opacity: 100,
  dropShadow: {
    x: 0,
    y: 0,
    blur: 0,
    color: '#000000'
  }
};

const FILTER_PRESETS = [
  { 
    name: 'None', 
    filters: DEFAULT_FILTERS,
    gradient: 'from-gray-100 to-gray-200'
  },
  { 
    name: 'Vintage', 
    filters: { ...DEFAULT_FILTERS, sepia: 80, contrast: 120, brightness: 110 },
    gradient: 'from-amber-200 to-orange-300'
  },
  { 
    name: 'B&W', 
    filters: { ...DEFAULT_FILTERS, grayscale: 100, contrast: 110 },
    gradient: 'from-gray-300 to-gray-500'
  },
  { 
    name: 'Vibrant', 
    filters: { ...DEFAULT_FILTERS, saturate: 150, contrast: 120, brightness: 105 },
    gradient: 'from-pink-200 to-purple-300'
  },
  { 
    name: 'Cool', 
    filters: { ...DEFAULT_FILTERS, hueRotate: 180, saturate: 120 },
    gradient: 'from-blue-200 to-cyan-300'
  },
  { 
    name: 'Warm', 
    filters: { ...DEFAULT_FILTERS, hueRotate: -30, saturate: 130, brightness: 105 },
    gradient: 'from-orange-200 to-red-300'
  },
  { 
    name: 'Dream', 
    filters: { ...DEFAULT_FILTERS, blur: 1, brightness: 115, saturate: 130, opacity: 90 },
    gradient: 'from-purple-200 to-pink-300'
  },
  { 
    name: 'Matrix', 
    filters: { ...DEFAULT_FILTERS, hueRotate: 120, contrast: 130, brightness: 80 },
    gradient: 'from-green-200 to-emerald-300'
  }
];

export default function FilterStudio({ onFiltersChange, className = '' }: FilterStudioProps) {
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState('None');

  const updateFilter = useCallback((key: keyof FilterSettings, value: number | string | object) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setActivePreset('Custom');
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const updateDropShadow = useCallback((key: keyof FilterSettings['dropShadow'], value: number | string) => {
    const newDropShadow = { ...filters.dropShadow, [key]: value };
    const newFilters = { ...filters, dropShadow: newDropShadow };
    setFilters(newFilters);
    setActivePreset('Custom');
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const applyPreset = useCallback((preset: typeof FILTER_PRESETS[0]) => {
    setFilters(preset.filters);
    setActivePreset(preset.name);
    onFiltersChange(preset.filters);
  }, [onFiltersChange]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActivePreset('None');
    onFiltersChange(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  const generateCSS = useCallback(() => {
    const { dropShadow } = filters;
    const filterString = [
      `blur(${filters.blur}px)`,
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturate}%)`,
      `hue-rotate(${filters.hueRotate}deg)`,
      `grayscale(${filters.grayscale}%)`,
      `sepia(${filters.sepia}%)`,
      `invert(${filters.invert}%)`,
      `opacity(${filters.opacity}%)`,
      dropShadow.blur > 0 ? `drop-shadow(${dropShadow.x}px ${dropShadow.y}px ${dropShadow.blur}px ${dropShadow.color})` : ''
    ].filter(Boolean).join(' ');

    return `filter: ${filterString};`;
  }, [filters]);

  const copyCSS = useCallback(() => {
    navigator.clipboard.writeText(generateCSS());
  }, [generateCSS]);

  const filterControls = [
    { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.1, unit: 'px', icon: Droplets },
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, unit: '%', icon: Sun },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%', icon: Contrast },
    { key: 'saturate', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%', icon: Droplets },
    { key: 'hueRotate', label: 'Hue Rotate', min: -180, max: 180, step: 1, unit: '°', icon: Zap },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%', icon: Eye },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, unit: '%', icon: Sun },
    { key: 'invert', label: 'Invert', min: 0, max: 100, step: 1, unit: '%', icon: Contrast },
    { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 1, unit: '%', icon: Eye }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            CSS Filter Studio
          </h3>
          <p className="text-sm text-gray-500">Apply real-time visual effects</p>
        </div>
        <div className="flex gap-2">
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={copyCSS}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy CSS
            </button>
          </HoverAnimation>
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </HoverAnimation>
        </div>
      </div>

      {/* Filter Presets */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FILTER_PRESETS.map((preset) => (
            <HoverAnimation key={preset.name} hoverScale={1.02}>
              <button
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl text-center transition-all duration-300 border-2 ${
                  activePreset === preset.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-full h-8 rounded-lg mb-2 bg-gradient-to-r ${preset.gradient}`} />
                <span className="text-xs font-medium">{preset.name}</span>
              </button>
            </HoverAnimation>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Manual Controls</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filterControls.map(({ key, label, min, max, step, unit, icon: IconComponent }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {label}
                </label>
                <span className="text-sm text-gray-500 font-mono">
                  {filters[key as keyof FilterSettings]}{unit}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={filters[key as keyof FilterSettings] as number}
                  onChange={(e) => updateFilter(key as keyof FilterSettings, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Shadow Controls */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Drop Shadow</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">X Offset</label>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={filters.dropShadow.x}
              onChange={(e) => updateDropShadow('x', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">{filters.dropShadow.x}px</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Y Offset</label>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={filters.dropShadow.y}
              onChange={(e) => updateDropShadow('y', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">{filters.dropShadow.y}px</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Blur</label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={filters.dropShadow.blur}
              onChange={(e) => updateDropShadow('blur', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">{filters.dropShadow.blur}px</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={filters.dropShadow.color}
              onChange={(e) => updateDropShadow('color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Live Preview</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Original</p>
            <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              No Filter
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">With Filters Applied</p>
            <div 
              className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ filter: generateCSS().replace('filter: ', '').replace(';', '') }}
            >
              Filtered
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">
          📌 Tip: Filters affect the entire page content (like Instagram filters)
        </p>
      </div>

      {/* Generated CSS */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Generated CSS</h4>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{generateCSS()}</pre>
        </div>
      </div>

      <style jsx>{`
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
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  );
}