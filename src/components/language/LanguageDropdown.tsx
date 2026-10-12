import React, { useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

interface LanguageDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const { currentLanguage, setLanguageByCode } = useLanguage();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectLanguage = (code: LanguageCode, nativeName: string) => {
    setLanguageByCode(code);
    showToast({
      title: 'Interface Language Changed',
      description: `Language set to ${nativeName}. Content titles and navigation have been updated.`,
      type: 'info',
    });
    onClose();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
          isOpen
            ? 'bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/50'
            : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
        }`}
        aria-label="Select Preferred Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-[#00C2FF]" />
        <span className="hidden sm:inline-block max-w-[70px] truncate">{currentLanguage.native}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-[#091526]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-white/5 bg-[#050B14]/80 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Language
            </span>
            <span className="text-[10px] text-[#00C2FF] font-semibold">Instant UI Update</span>
          </div>

          <div className="p-1.5 max-h-72 overflow-y-auto space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code, lang.native)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? 'bg-[#00C2FF]/20 text-white font-bold border border-[#00C2FF]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{lang.native}</span>
                    <span className="text-[11px] text-slate-400">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00C2FF]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
