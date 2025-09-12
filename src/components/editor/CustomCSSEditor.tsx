'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Code, 
  Eye, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Copy,
  Wand2,
  Lightbulb
} from 'lucide-react';
import { HoverAnimation } from './MicroAnimations';

interface CustomCSSEditorProps {
  customCSS: string;
  onCSSChange: (css: string) => void;
  className?: string;
}

const CSS_TEMPLATES = [
  {
    name: 'Glassmorphism',
    css: `/* Glassmorphism Effect */
.custom-glass {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}`,
    description: 'Frosted glass effect'
  },
  {
    name: 'Neon Glow',
    css: `/* Neon Glow Effect */
.custom-neon {
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6;
  box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6;
  animation: flicker 1.5s infinite alternate;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}`,
    description: 'Cyberpunk neon effect'
  },
  {
    name: 'Gradient Border',
    css: `/* Gradient Border Animation */
.custom-gradient-border {
  position: relative;
  background: linear-gradient(45deg, #ff006e, #fb5607, #ffbe0b, #8338ec);
  padding: 3px;
  border-radius: 15px;
  animation: gradient-rotate 3s linear infinite;
}

.custom-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 3px;
  background: linear-gradient(45deg, #ff006e, #fb5607, #ffbe0b, #8338ec);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: exclude;
  mask-composite: exclude;
}

@keyframes gradient-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    description: 'Animated gradient borders'
  },
  {
    name: 'Floating Animation',
    css: `/* Floating Animation */
.custom-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.custom-float:hover {
  animation-play-state: paused;
  transform: translateY(-10px) scale(1.05);
  transition: transform 0.3s ease;
}`,
    description: 'Gentle floating motion'
  },
  {
    name: 'Morphing Shapes',
    css: `/* Morphing Background Shapes */
.custom-morph {
  position: relative;
  overflow: hidden;
}

.custom-morph::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: morph 20s ease-in-out infinite;
  opacity: 0.1;
}

@keyframes morph {
  0%, 100% { border-radius: 50%; transform: rotate(0deg); }
  25% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(90deg); }
  50% { border-radius: 50%; transform: rotate(180deg); }
  75% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: rotate(270deg); }
}`,
    description: 'Organic shape morphing'
  },
  {
    name: 'Text Effects',
    css: `/* Advanced Text Effects */
.custom-text-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}

.custom-text-shadow {
  text-shadow: 
    1px 1px 0px #000,
    2px 2px 0px #333,
    3px 3px 0px #666,
    4px 4px 8px rgba(0,0,0,0.3);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}`,
    description: 'Gradient text with depth'
  }
];

const CSS_SNIPPETS = [
  '/* Custom CSS Rules */',
  '.my-element { }',
  'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
  'box-shadow: 0 10px 25px rgba(0,0,0,0.1);',
  'transform: translateY(-5px);',
  'transition: all 0.3s ease;',
  'border-radius: 15px;',
  'backdrop-filter: blur(10px);',
  '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
  'animation: fadeIn 1s ease-in-out;'
];

export default function CustomCSSEditor({ customCSS, onCSSChange, className = '' }: CustomCSSEditorProps) {
  const [css, setCSS] = useState(customCSS || '');
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCSS(customCSS || '');
  }, [customCSS]);

  const validateCSS = (cssText: string) => {
    try {
      // Basic CSS validation
      const style = document.createElement('style');
      style.textContent = cssText;
      document.head.appendChild(style);
      document.head.removeChild(style);
      
      setIsValid(true);
      setErrors([]);
      return true;
    } catch (error) {
      setIsValid(false);
      setErrors([error instanceof Error ? error.message : 'Invalid CSS']);
      return false;
    }
  };

  const handleCSSChange = (value: string) => {
    setCSS(value);
    if (validateCSS(value)) {
      onCSSChange(value);
    }
  };

  const applyTemplate = (template: typeof CSS_TEMPLATES[0]) => {
    const newCSS = css + '\n\n' + template.css;
    setCSS(newCSS);
    handleCSSChange(newCSS);
    setShowTemplates(false);
  };

  const insertSnippet = (snippet: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCSS = css.substring(0, start) + snippet + css.substring(end);
      setCSS(newCSS);
      handleCSSChange(newCSS);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 0);
    }
  };

  const formatCSS = () => {
    // Simple CSS formatting
    let formatted = css
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}\n')
      .replace(/;/g, ';\n  ')
      .replace(/,/g, ',\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    setCSS(formatted);
    handleCSSChange(formatted);
  };

  const resetCSS = () => {
    setCSS('');
    onCSSChange('');
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(css);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Custom CSS Editor
          </h3>
          <p className="text-sm text-gray-500">Add unlimited custom styles</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isValid ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Valid CSS
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                Invalid CSS
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <HoverAnimation hoverScale={1.05}>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            <Wand2 className="w-4 h-4" />
            Templates
          </button>
        </HoverAnimation>
        <HoverAnimation hoverScale={1.05}>
          <button
            onClick={formatCSS}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Code className="w-4 h-4" />
            Format
          </button>
        </HoverAnimation>
        <HoverAnimation hoverScale={1.05}>
          <button
            onClick={copyCSS}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </HoverAnimation>
        <HoverAnimation hoverScale={1.05}>
          <button
            onClick={resetCSS}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </HoverAnimation>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            CSS Templates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CSS_TEMPLATES.map((template, index) => (
              <HoverAnimation key={index} hoverScale={1.02}>
                <button
                  onClick={() => applyTemplate(template)}
                  className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-500">{template.description}</div>
                </button>
              </HoverAnimation>
            ))}
          </div>
        </div>
      )}

      {/* Quick Snippets */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Quick Snippets</h4>
        <div className="flex flex-wrap gap-2">
          {CSS_SNIPPETS.map((snippet, index) => (
            <button
              key={index}
              onClick={() => insertSnippet(snippet)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-mono"
            >
              {snippet.length > 30 ? snippet.substring(0, 30) + '...' : snippet}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          CSS Code
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={css}
            onChange={(e) => handleCSSChange(e.target.value)}
            placeholder={`/* Enter your custom CSS here */
.my-custom-class {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.my-custom-class:hover {
  transform: translateY(-5px);
}`}
            className={`w-full h-64 px-4 py-3 border-2 rounded-xl font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 transition-colors ${
              isValid 
                ? 'border-gray-300 focus:border-blue-500' 
                : 'border-red-300 focus:border-red-500'
            }`}
            spellCheck={false}
          />
          
          {/* Line numbers overlay (simplified) */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 rounded-l-xl pointer-events-none">
            <div className="text-xs text-gray-400 p-2 font-mono leading-5">
              {css.split('\n').map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {!isValid && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
            <AlertTriangle className="w-4 h-4" />
            CSS Errors
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <Lightbulb className="w-4 h-4" />
          Pro Tips
        </div>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Use class names starting with '.custom-' for organization</li>
          <li>• Test your CSS thoroughly across different devices</li>
          <li>• Consider accessibility when choosing colors and effects</li>
          <li>• Use CSS variables for consistent theming</li>
        </ul>
      </div>

      {/* Live Preview */}
      {css && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Live Preview</h4>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div className="custom-glass custom-gradient-border custom-float custom-text-gradient p-4 text-center">
              Your custom styles are applied here!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}