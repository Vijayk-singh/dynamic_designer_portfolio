import React, { useState, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';

const themes = [
  { id: 'behance', name: 'Behance Classic', color: '#0057ff', bg: '#f9f9f9' },
  { id: 'cyber', name: 'Tokyo Midnight', color: '#ff007f', bg: '#0a0b10' },
  { id: 'slate', name: 'Slate Minimalist', color: '#3b82f6', bg: '#0f1015' },
  { id: 'editorial', name: 'Terracotta Editorial', color: '#b84c2a', bg: '#fbf9f4' },
  { id: 'synthwave', name: 'Synthwave \'84', color: '#00f0ff', bg: '#220f38' }
];

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('behance');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'behance';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('portfolio-theme', themeId);
    setIsOpen(false);
  };

  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="theme-selector-wrapper">
      <button 
        type="button" 
        className="theme-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Palette size={16} />
        <span>Theme: {currentThemeObj.name}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          {/* Invisible click overlay to close dropdown */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 190 }} onClick={() => setIsOpen(false)} />
          
          <div className="theme-dropdown" style={{ zIndex: 200 }}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => changeTheme(theme.id)}
                role="option"
                aria-selected={currentTheme === theme.id}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span 
                    className="theme-color-dot" 
                    style={{ backgroundColor: theme.color }} 
                  />
                  <span>{theme.name}</span>
                </div>
                {currentTheme === theme.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
