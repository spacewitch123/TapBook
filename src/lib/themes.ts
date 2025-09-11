import { Theme } from '@/types';

export const THEME_PRESETS: Record<string, Theme> = {
  modern: {
    style: 'minimal',
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    buttonStyle: 'rounded',
    font: 'inter'
  },
  midnight: {
    style: 'dark',
    primaryColor: '#818cf8',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    buttonStyle: 'rounded',
    font: 'inter'
  },
  sunset: {
    style: 'gradient',
    primaryColor: '#f59e0b',
    backgroundColor: 'from-amber-400 via-orange-500 to-rose-500',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'outfit'
  },
  ocean: {
    style: 'gradient',
    primaryColor: '#0891b2',
    backgroundColor: 'from-sky-400 via-cyan-500 to-blue-600',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'inter'
  },
  glass: {
    style: 'glass',
    primaryColor: '#8b5cf6',
    backgroundColor: 'from-violet-400/20 via-purple-400/20 to-indigo-400/20',
    textColor: '#1e293b',
    buttonStyle: 'rounded',
    font: 'inter'
  },
  neon: {
    style: 'neon',
    primaryColor: '#c084fc',
    backgroundColor: '#0f0f23',
    textColor: '#f1f5f9',
    buttonStyle: 'rounded',
    font: 'space-mono'
  },
  forest: {
    style: 'gradient',
    primaryColor: '#10b981',
    backgroundColor: 'from-emerald-400 via-green-500 to-teal-600',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'outfit'
  },
  rose: {
    style: 'gradient',
    primaryColor: '#ec4899',
    backgroundColor: 'from-pink-400 via-rose-500 to-red-500',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    font: 'caveat'
  }
};

export const FONT_FAMILIES = {
  inter: 'Inter, system-ui, -apple-system, sans-serif',
  outfit: 'Outfit, system-ui, -apple-system, sans-serif',
  'space-mono': 'Space Mono, Monaco, Consolas, monospace',
  playfair: 'Playfair Display, Georgia, serif',
  caveat: 'Caveat, cursive, system-ui'
};

export const BUTTON_STYLES = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
  square: 'rounded-none',
  brutal: 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000000]',
  ghost: 'rounded-lg border-2 bg-transparent hover:bg-opacity-10'
};

// Enhanced utility functions for beautiful theme rendering
export function getBackgroundStyle(theme: Theme): string {
  switch (theme.style) {
    case 'gradient':
      return `bg-gradient-to-br ${theme.backgroundColor} relative overflow-hidden`;
    case 'glass':
      return `bg-gradient-to-br ${theme.backgroundColor} backdrop-blur-xl relative overflow-hidden`;
    case 'dark':
      return 'bg-slate-900 relative overflow-hidden';
    case 'neon':
      return 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden';
    default:
      return 'bg-white relative overflow-hidden';
  }
}

export function getTextStyle(theme: Theme): string {
  const fontFamily = FONT_FAMILIES[theme.font];
  let textColor = theme.textColor;
  
  if (theme.style === 'neon') {
    return `text-[${textColor}] drop-shadow-[0_0_10px_${textColor}] font-mono`;
  }
  
  return `text-[${textColor}]`;
}

export function getButtonStyle(theme: Theme): string {
  const baseStyle = BUTTON_STYLES[theme.buttonStyle];
  const primaryColor = theme.primaryColor;
  
  // Base animation and hover effects
  const baseAnimation = 'transition-all duration-300 transform hover:scale-105 active:scale-95';
  
  // Handle special button styles first
  if (theme.buttonStyle === 'brutal') {
    return `${baseStyle} ${baseAnimation} bg-[${primaryColor}] text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000]`;
  }
  
  if (theme.buttonStyle === 'ghost') {
    return `${baseStyle} ${baseAnimation} border-[${primaryColor}] text-[${primaryColor}] hover:bg-[${primaryColor}] hover:text-white`;
  }
  
  // Enhanced theme-specific styles
  switch (theme.style) {
    case 'neon':
      return `${baseStyle} ${baseAnimation} bg-transparent border-2 border-[${primaryColor}] text-[${primaryColor}] hover:bg-[${primaryColor}] hover:text-slate-900 shadow-lg hover:shadow-[0_0_30px_${primaryColor}60] hover:shadow-purple-500/30`;
    case 'glass':
      return `${baseStyle} ${baseAnimation} bg-white/20 backdrop-blur-xl border border-white/40 text-slate-800 hover:bg-white/30 shadow-lg hover:shadow-xl`;
    case 'gradient':
      return `${baseStyle} ${baseAnimation} bg-gradient-to-r from-[${primaryColor}] to-[${primaryColor}] hover:from-[${primaryColor}] hover:to-[${primaryColor}] text-white shadow-lg hover:shadow-xl hover:shadow-[${primaryColor}]/25`;
    case 'dark':
      return `${baseStyle} ${baseAnimation} bg-[${primaryColor}] text-white hover:bg-[${primaryColor}]/90 shadow-lg hover:shadow-xl hover:shadow-[${primaryColor}]/25`;
    default:
      return `${baseStyle} ${baseAnimation} bg-[${primaryColor}] text-white hover:bg-[${primaryColor}]/90 shadow-lg hover:shadow-xl`;
  }
}

export function getFontClass(font: Theme['font']): string {
  switch (font) {
    case 'inter':
      return 'font-sans';
    case 'outfit':
      return 'font-sans tracking-wide';
    case 'space-mono':
      return 'font-mono';
    case 'playfair':
      return 'font-serif';
    case 'caveat':
      return 'font-sans';
    default:
      return 'font-sans';
  }
}

// Helper to convert hex to rgb
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Generate complementary color
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const complementaryR = 255 - r;
  const complementaryG = 255 - g;
  const complementaryB = 255 - b;
  
  return `#${complementaryR.toString(16).padStart(2, '0')}${complementaryG.toString(16).padStart(2, '0')}${complementaryB.toString(16).padStart(2, '0')}`;
}

// Auto-enhance theme with complementary colors
export function enhanceTheme(theme: Theme): Theme {
  const enhanced = { ...theme };
  
  if (theme.style === 'gradient') {
    const complementary = getComplementaryColor(theme.primaryColor);
    enhanced.backgroundColor = `from-[${theme.primaryColor}] to-[${complementary}]`;
  }
  
  return enhanced;
}