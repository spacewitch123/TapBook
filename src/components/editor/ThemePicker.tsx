'use client';

import { Theme } from '@/types';
import { THEME_PRESETS, getBackgroundStyle, getTextStyle } from '@/lib/themes';
import { Palette, Sparkles } from 'lucide-react';

interface ThemePickerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemePicker({ currentTheme, onThemeChange }: ThemePickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Theme</h3>
        <button className="text-sm text-slate-500 hover:text-slate-700">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(THEME_PRESETS).map(([name, theme]) => (
          <div
            key={name}
            onClick={() => onThemeChange(theme)}
            className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              currentTheme.style === theme.style && currentTheme.primaryColor === theme.primaryColor
                ? 'border-blue-500 shadow-lg shadow-blue-500/25 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
            }`}
          >
            {/* Beautiful Theme Preview */}
            <div
              className={`aspect-[4/5] rounded-lg overflow-hidden ${getBackgroundStyle(theme)} p-3`}
              style={{
                backgroundColor: theme.style === 'minimal' 
                  ? theme.backgroundColor 
                  : undefined
              }}
            >
              <div className="h-full flex flex-col space-y-2 relative">
                {/* Mini cover image effect */}
                <div 
                  className="h-4 w-full rounded opacity-30 -mx-3 -mt-3 mb-2"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                
                {/* Profile section */}
                <div className="flex flex-col items-center space-y-1">
                  {/* Avatar */}
                  <div 
                    className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  
                  {/* Name */}
                  <div 
                    className="h-1 w-10 rounded"
                    style={{ backgroundColor: theme.textColor, opacity: 0.8 }}
                  />
                  
                  {/* Bio */}
                  <div 
                    className="h-0.5 w-6 rounded"
                    style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
                  />
                </div>
                
                {/* Links preview */}
                <div className="space-y-1 flex-1 pt-1">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`h-1.5 shadow-sm ${
                        theme.buttonStyle === 'pill' ? 'rounded-full' : 
                        theme.buttonStyle === 'square' ? 'rounded-none' : 'rounded'
                      }`}
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        width: `${95 - i * 10}%`,
                        opacity: 1 - (i * 0.15)
                      }}
                    />
                  ))}
                </div>
                
                {/* Contact buttons */}
                <div className="space-y-1">
                  <div 
                    className="h-1 w-full rounded-sm opacity-60"
                    style={{ backgroundColor: '#25D366' }}
                  />
                  <div 
                    className="h-1 w-full rounded-sm opacity-60"
                    style={{ backgroundColor: theme.textColor }}
                  />
                </div>
              </div>
              
              {/* Enhanced Theme Effects */}
              {theme.style === 'glass' && (
                <>
                  <div className="absolute inset-0 backdrop-blur-md bg-white/20 rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
                </>
              )}
              
              {theme.style === 'neon' && (
                <>
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle at center, ${theme.primaryColor}15, transparent 70%)`
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      boxShadow: `inset 0 0 30px ${theme.primaryColor}20, 0 0 20px ${theme.primaryColor}10`
                    }}
                  />
                </>
              )}
              
              {theme.style === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-lg" />
              )}
            </div>
            
            {/* Enhanced Theme Label */}
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-slate-800 capitalize mb-1">
                {name}
              </p>
              <p className="text-xs text-slate-500">
                {name === 'modern' && 'Clean & Professional'}
                {name === 'midnight' && 'Dark & Elegant'}
                {name === 'sunset' && 'Warm & Vibrant'}
                {name === 'ocean' && 'Cool & Refreshing'}
                {name === 'glass' && 'Translucent & Modern'}
                {name === 'neon' && 'Futuristic & Bold'}
                {name === 'forest' && 'Natural & Fresh'}
                {name === 'rose' && 'Romantic & Soft'}
              </p>
            </div>
            
            {/* Premium Selection Indicator */}
            {currentTheme.style === theme.style && currentTheme.primaryColor === theme.primaryColor && (
              <>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="absolute inset-0 bg-blue-500/5 rounded-xl animate-pulse"></div>
              </>
            )}
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-300"></div>
          </div>
        ))}
      </div>
      
      {/* Pro tip section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">Choose Your Vibe</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each theme creates a unique mood for your page. Preview how your links will look and pick the one that matches your brand personality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}