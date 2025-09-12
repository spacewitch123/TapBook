'use client';

import { useState, useCallback } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Copy, 
  RotateCcw,
  Eye,
  Lightbulb,
  Settings
} from 'lucide-react';
import { HoverAnimation } from './MicroAnimations';

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

interface ShadowDesignerProps {
  onShadowChange: (shadow: string) => void;
  className?: string;
}

const SHADOW_PRESETS = [
  {
    name: 'Subtle',
    shadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    layers: [
      { id: '1', x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false },
      { id: '2', x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 24, inset: false }
    ]
  },
  {
    name: 'Soft',
    shadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.06)',
    layers: [
      { id: '1', x: 0, y: 4, blur: 6, spread: 0, color: '#000000', opacity: 7, inset: false },
      { id: '2', x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 6, inset: false }
    ]
  },
  {
    name: 'Medium',
    shadow: '0 10px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    layers: [
      { id: '1', x: 0, y: 10, blur: 25, spread: 0, color: '#000000', opacity: 15, inset: false },
      { id: '2', x: 0, y: 5, blur: 10, spread: 0, color: '#000000', opacity: 5, inset: false }
    ]
  },
  {
    name: 'Large',
    shadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)',
    layers: [
      { id: '1', x: 0, y: 20, blur: 40, spread: 0, color: '#000000', opacity: 10, inset: false },
      { id: '2', x: 0, y: 8, blur: 16, spread: 0, color: '#000000', opacity: 6, inset: false }
    ]
  },
  {
    name: 'Colored',
    shadow: '0 10px 25px rgba(99, 102, 241, 0.3), 0 5px 10px rgba(139, 92, 246, 0.2)',
    layers: [
      { id: '1', x: 0, y: 10, blur: 25, spread: 0, color: '#6366f1', opacity: 30, inset: false },
      { id: '2', x: 0, y: 5, blur: 10, spread: 0, color: '#8b5cf6', opacity: 20, inset: false }
    ]
  },
  {
    name: 'Neon',
    shadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)',
    layers: [
      { id: '1', x: 0, y: 0, blur: 20, spread: 0, color: '#6366f1', opacity: 80, inset: false },
      { id: '2', x: 0, y: 0, blur: 40, spread: 0, color: '#8b5cf6', opacity: 40, inset: false }
    ]
  },
  {
    name: 'Inset',
    shadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.06)',
    layers: [
      { id: '1', x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 10, inset: true },
      { id: '2', x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 6, inset: true }
    ]
  },
  {
    name: '3D',
    shadow: '0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
    layers: [
      { id: '1', x: 0, y: 1, blur: 0, spread: 0, color: '#ffffff', opacity: 40, inset: false },
      { id: '2', x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 30, inset: false },
      { id: '3', x: 0, y: 1, blur: 0, spread: 0, color: '#ffffff', opacity: 40, inset: true }
    ]
  }
];

export default function ShadowDesigner({ onShadowChange, className = '' }: ShadowDesignerProps) {
  const [shadowLayers, setShadowLayers] = useState<ShadowLayer[]>([
    {
      id: '1',
      x: 0,
      y: 4,
      blur: 6,
      spread: 0,
      color: '#000000',
      opacity: 15,
      inset: false
    }
  ]);

  const generateShadow = useCallback((layers: ShadowLayer[]) => {
    const shadowString = layers
      .map(layer => {
        const rgba = hexToRgba(layer.color, layer.opacity / 100);
        const insetPrefix = layer.inset ? 'inset ' : '';
        return `${insetPrefix}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${rgba}`;
      })
      .join(', ');
    
    return shadowString;
  }, []);

  const updateLayer = useCallback((layerId: string, property: keyof ShadowLayer, value: any) => {
    const newLayers = shadowLayers.map(layer =>
      layer.id === layerId ? { ...layer, [property]: value } : layer
    );
    setShadowLayers(newLayers);
    onShadowChange(generateShadow(newLayers));
  }, [shadowLayers, onShadowChange, generateShadow]);

  const addLayer = useCallback(() => {
    const newLayer: ShadowLayer = {
      id: Date.now().toString(),
      x: 0,
      y: 2,
      blur: 4,
      spread: 0,
      color: '#000000',
      opacity: 10,
      inset: false
    };
    const newLayers = [...shadowLayers, newLayer];
    setShadowLayers(newLayers);
    onShadowChange(generateShadow(newLayers));
  }, [shadowLayers, onShadowChange, generateShadow]);

  const removeLayer = useCallback((layerId: string) => {
    if (shadowLayers.length <= 1) return;
    const newLayers = shadowLayers.filter(layer => layer.id !== layerId);
    setShadowLayers(newLayers);
    onShadowChange(generateShadow(newLayers));
  }, [shadowLayers, onShadowChange, generateShadow]);

  const duplicateLayer = useCallback((layerId: string) => {
    const layerToDuplicate = shadowLayers.find(layer => layer.id === layerId);
    if (!layerToDuplicate) return;
    
    const newLayer = { 
      ...layerToDuplicate, 
      id: Date.now().toString(),
      x: layerToDuplicate.x + 2,
      y: layerToDuplicate.y + 2
    };
    const newLayers = [...shadowLayers, newLayer];
    setShadowLayers(newLayers);
    onShadowChange(generateShadow(newLayers));
  }, [shadowLayers, onShadowChange, generateShadow]);

  const applyPreset = useCallback((preset: typeof SHADOW_PRESETS[0]) => {
    const newLayers = preset.layers.map((layer, index) => ({
      ...layer,
      id: Date.now().toString() + index
    }));
    setShadowLayers(newLayers);
    onShadowChange(preset.shadow);
  }, [onShadowChange]);

  const resetShadows = useCallback(() => {
    const defaultLayer: ShadowLayer = {
      id: '1',
      x: 0,
      y: 0,
      blur: 0,
      spread: 0,
      color: '#000000',
      opacity: 0,
      inset: false
    };
    setShadowLayers([defaultLayer]);
    onShadowChange('none');
  }, [onShadowChange]);

  const copyShadowCSS = useCallback(() => {
    const css = `box-shadow: ${generateShadow(shadowLayers)};`;
    navigator.clipboard.writeText(css);
  }, [shadowLayers, generateShadow]);

  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 0, 0, ${alpha})`;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Shadow Designer
          </h3>
          <p className="text-sm text-gray-500">Create layered shadow effects</p>
        </div>
        <div className="flex gap-2">
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={copyShadowCSS}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy CSS
            </button>
          </HoverAnimation>
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={resetShadows}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </HoverAnimation>
        </div>
      </div>

      {/* Shadow Presets */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SHADOW_PRESETS.map((preset, index) => (
            <HoverAnimation key={index} hoverScale={1.02}>
              <button
                onClick={() => applyPreset(preset)}
                className="p-3 rounded-xl text-center transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md group"
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2 bg-white border border-gray-100"
                  style={{ boxShadow: preset.shadow }}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {preset.name}
                </span>
              </button>
            </HoverAnimation>
          ))}
        </div>
      </div>

      {/* Shadow Layers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Shadow Layers</h4>
          <HoverAnimation hoverScale={1.05}>
            <button
              onClick={addLayer}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Layer
            </button>
          </HoverAnimation>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {shadowLayers.map((layer, index) => (
            <div key={layer.id} className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Layer {index + 1} {layer.inset && '(Inset)'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateLayer(layer.id)}
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {shadowLayers.length > 1 && (
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Position Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X Offset: {layer.x}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={layer.x}
                    onChange={(e) => updateLayer(layer.id, 'x', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y Offset: {layer.y}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={layer.y}
                    onChange={(e) => updateLayer(layer.id, 'y', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Blur and Spread */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blur: {layer.blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.blur}
                    onChange={(e) => updateLayer(layer.id, 'blur', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spread: {layer.spread}px
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={layer.spread}
                    onChange={(e) => updateLayer(layer.id, 'spread', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Color and Opacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="color"
                    value={layer.color}
                    onChange={(e) => updateLayer(layer.id, 'color', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opacity: {layer.opacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.opacity}
                    onChange={(e) => updateLayer(layer.id, 'opacity', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Inset Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Inset Shadow</label>
                <input
                  type="checkbox"
                  checked={layer.inset}
                  onChange={(e) => updateLayer(layer.id, 'inset', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Live Preview
        </h4>
        <div className="bg-gray-100 p-8 rounded-xl flex items-center justify-center">
          <div
            className="w-32 h-32 bg-white rounded-xl flex items-center justify-center text-gray-600 font-medium"
            style={{ boxShadow: generateShadow(shadowLayers) }}
          >
            Preview
          </div>
        </div>
      </div>

      {/* Generated CSS */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Generated CSS</h4>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>box-shadow: {generateShadow(shadowLayers)};</pre>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <Lightbulb className="w-4 h-4" />
          Pro Tips
        </div>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Layer multiple shadows for depth and realism</li>
          <li>• Use colored shadows for modern, vibrant effects</li>
          <li>• Inset shadows create pressed/carved appearances</li>
          <li>• Subtle shadows work best for most UI elements</li>
        </ul>
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
      `}</style>
    </div>
  );
}