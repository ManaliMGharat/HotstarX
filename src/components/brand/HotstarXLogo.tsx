import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  hideWordmark?: boolean;
  clickable?: boolean;
  className?: string;
  badgeText?: string;
}

export const PrimeXLogo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  hideWordmark = false,
  clickable = true,
  className = '',
  badgeText,
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Distinctive Cinematic PrimeX Geometric Hyper-Prism Emblem */}
      <div className={`relative ${iconDimensions} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_18px_rgba(6,182,212,0.65)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="px-emblem-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="px-emblem-right" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="55%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
            <radialGradient id="px-spark-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Wing Blade */}
          <path
            d="M10 10L25 24L10 38L16 38L31 25.5L31 22.5L16 10H10Z"
            fill="url(#px-emblem-left)"
          />
          {/* Right Intersecting Kinetic Wing Blade forming the cinematic 'X' */}
          <path
            d="M38 10L23 24L38 38L32 38L17 25.5L17 22.5L32 10H38Z"
            fill="url(#px-emblem-right)"
            fillOpacity="0.95"
          />
          {/* Core Energy Pulse Spark */}
          <circle cx="24" cy="24" r="3.2" fill="url(#px-spark-grad)" />
        </svg>
      </div>

      {/* Brand Typography */}
      {!hideWordmark && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none ${textSizes} font-['Outfit'] flex items-center`}>
            <span className="text-white">Prime</span>
            <span className="bg-gradient-to-r from-[#00F2FE] via-[#06B6D4] to-[#A855F7] bg-clip-text text-transparent italic drop-shadow-[0_0_18px_rgba(6,182,212,0.55)]">
              X
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-cyan-400/90 font-mono">
              Powered by XQORA
            </span>
            {badgeText && (
              <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                {badgeText}
              </span>
            )}
          </div>

          {showTagline && (
            <span className="text-[10px] tracking-wider text-slate-400 font-normal mt-0.5">
              Your World of Entertainment.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded-lg p-0.5" aria-label="PrimeX Home">
        {content}
      </Link>
    );
  }

  return content;
};

// Backwards compatibility alias
export const HotstarXLogo = PrimeXLogo;
export default PrimeXLogo;
