import React from 'react';

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] bg-[#0B1422] overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/60 to-transparent" />
      
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 space-y-4">
        <div className="h-6 w-36 rounded-md bg-white/10 animate-pulse" />
        <div className="h-12 w-2/3 max-w-md rounded-xl bg-white/10 animate-pulse" />
        <div className="h-4 w-1/2 max-w-sm rounded bg-white/5 animate-pulse" />
        <div className="h-16 w-3/4 max-w-lg rounded-xl bg-white/5 animate-pulse" />
        <div className="flex gap-3 pt-2">
          <div className="h-12 w-36 rounded-xl bg-white/15 animate-pulse" />
          <div className="h-12 w-32 rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ isPortrait?: boolean }> = ({ isPortrait = true }) => {
  return (
    <div className={`shrink-0 ${isPortrait ? 'w-[145px] sm:w-[185px] md:w-[210px]' : 'w-[240px] sm:w-[300px] md:w-[350px]'}`}>
      <div className={`rounded-xl sm:rounded-2xl overflow-hidden bg-[#0B1422] border border-white/5 relative ${isPortrait ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="mt-2 space-y-1.5 px-1">
        <div className="h-3.5 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-2.5 w-1/2 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
};

export const RailSkeleton: React.FC<{ isPortrait?: boolean }> = ({ isPortrait = true }) => {
  return (
    <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} isPortrait={isPortrait} />
        ))}
      </div>
    </div>
  );
};

export const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div key={i} className="flex flex-col space-y-2">
          <div className="aspect-[2/3] w-full rounded-2xl bg-[#0B1422] border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-3.5 w-3/4 rounded bg-white/10 animate-pulse" />
          <div className="h-2.5 w-1/2 rounded bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-[#0B1422] rounded-3xl border border-white/10 overflow-hidden space-y-6">
      <div className="aspect-video w-full bg-[#050B14] relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="p-6 space-y-4">
        <div className="h-8 w-1/2 rounded-xl bg-white/10 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-white/5 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#0B1422] relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-4 w-28 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const PlansSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-96 rounded-3xl bg-[#0B1422] border border-white/5 relative overflow-hidden p-6 space-y-4">
          <div className="absolute inset-0 animate-shimmer" />
          <div className="h-6 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-10 w-24 rounded bg-white/10 animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
