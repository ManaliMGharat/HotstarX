import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  hideWordmark?: boolean;
  clickable?: boolean;
  className?: string;
}

export const HotstarXLogo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  hideWordmark = false,
  clickable = true,
  className = '',
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
      {/* Original Geometric HotstarX Streaming Emblem */}
      <div className={`relative ${iconDimensions} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_16px_rgba(255,94,58,0.55)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hx-pri-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5E3A" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>
            <linearGradient id="hx-wing-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C026D3" />
              <stop offset="55%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#FF5E3A" />
            </linearGradient>
            <linearGradient id="hx-spark" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Left Wing / Chevron */}
          <path
            d="M10 10L24 24L10 38L16 38L30 25.5L30 22.5L16 10H10Z"
            fill="url(#hx-pri-grad)"
          />
          {/* Right Intersecting Geometric Wing forming the 'X' Prism */}
          <path
            d="M38 10L24 24L38 38L32 38L18 25.5L18 22.5L32 10H38Z"
            fill="url(#hx-wing-grad)"
            fillOpacity="0.95"
          />
          {/* Dynamic Core Energy Spark */}
          <circle cx="24" cy="24" r="3.2" fill="url(#hx-spark)" />
        </svg>
      </div>

      {/* Brand Typography */}
      {!hideWordmark && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none ${textSizes} font-['Outfit']`}>
            <span className="text-white">Hotstar</span>
            <span className="bg-gradient-to-r from-[#FF5E3A] via-[#F59E0B] to-[#C026D3] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(255,94,58,0.45)]">
              X
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] tracking-widest uppercase font-medium text-stone-400 mt-1">
              Entertainment, reimagined.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E3A] rounded-lg p-0.5" aria-label="HotstarX Home">
        {content}
      </Link>
    );
  }

  return content;
};
