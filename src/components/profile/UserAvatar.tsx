import React, { useState } from 'react';
import type { UserProfile } from '../../types';
import { resolveUserAvatar, DEFAULT_NEUTRAL_AVATAR } from '../../data/avatarCatalog';
import { Baby } from 'lucide-react';

export interface UserAvatarProps {
  profile?: Partial<UserProfile> | null;
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  ringClass?: string;
  showKidsBadge?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
  xl: 'w-16 h-16 text-base',
  '2xl': 'w-24 h-24 text-xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  profile,
  src,
  alt,
  size = 'md',
  className = '',
  ringClass = '',
  showKidsBadge = false,
  clickable = false,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Compute active image source
  const resolvedSrc = src || resolveUserAvatar(profile);
  const displaySrc = imgError ? DEFAULT_NEUTRAL_AVATAR : resolvedSrc;
  const displayName = profile?.name || alt || 'User Avatar';
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  const isKids = Boolean(profile?.isKids);

  return (
    <div
      className={`relative inline-block shrink-0 select-none ${
        clickable ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all' : ''
      } ${className}`}
      onClick={clickable ? onClick : undefined}
      title={displayName}
    >
      <img
        src={displaySrc}
        alt={displayName}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover bg-[#0f172a] ${ringClass}`}
        loading="lazy"
      />

      {showKidsBadge && isKids && (
        <span
          className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-black shadow-md"
          title="Kids Profile Active"
        >
          <Baby className="w-2.5 h-2.5" />
        </span>
      )}
    </div>
  );
};
