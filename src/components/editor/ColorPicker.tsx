'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 rounded-lg border-2 border-gray-200 flex items-center gap-3 px-3 hover:border-gray-300 transition-colors"
      >
        <div
          className="w-6 h-6 rounded-md border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-mono text-gray-600 flex-1 text-left">
          {color.toUpperCase()}
        </span>
        <Palette className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Color picker popup */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Pick a color</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <HexColorPicker 
              color={color} 
              onChange={onChange}
            />
            
            {/* Preset colors */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Popular colors</p>
              <div className="grid grid-cols-8 gap-1">
                {[
                  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316',
                  '#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'
                ].map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      onChange(presetColor);
                      setIsOpen(false);
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
            </div>
            
            {/* Current color display */}
            <div className="mt-4 p-2 bg-gray-50 rounded text-center">
              <span className="text-sm font-mono text-gray-600">
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}