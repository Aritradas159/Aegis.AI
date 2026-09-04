import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';

export function LanguageSelector({ className = '' }) {
  const { language, setLanguage, isRtl } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={`lang-selector-wrapper ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="lang-selector-btn"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Select Language"
      >
        <Globe size={16} className="lang-globe-icon" />
        <span className="lang-current-label">{currentLang.nativeLabel}</span>
        <ChevronDown size={14} className={`lang-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className={`lang-dropdown-menu ${isRtl ? 'rtl' : ''}`} role="listbox">
          <div className="lang-dropdown-header">
            <span>Choose Language</span>
          </div>
          <div className="lang-dropdown-list">
            {LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  className={`lang-option ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(item.code);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="lang-option-native">{item.nativeLabel}</span>
                  {item.code !== 'en' && (
                    <span className="lang-option-en">({item.label})</span>
                  )}
                  {isSelected && <Check size={14} className="lang-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
