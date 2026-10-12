import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { MediaItem, ContentSection } from '../types';
import { HeroBanner } from '../components/hero/HeroBanner';
import { ContentRail } from '../components/rails/ContentRail';
import { ContinueWatchingRail } from '../components/rails/ContinueWatchingRail';
import { HeroSkeleton, RailSkeleton } from '../components/ui/SkeletonLoader';

export const HomePage: React.FC = () => {
  const { isKidsMode } = useAuth();
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.getHomeContent(isKidsMode).then((data) => {
      if (isMounted) {
        setHeroItems(data.hero);
        setSections(data.sections);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isKidsMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <HeroSkeleton />
        <RailSkeleton isPortrait={true} />
        <RailSkeleton isPortrait={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-12 relative">
      {/* Home Ambient Glow in Subtle Midnight Navy & Oceanic Sky */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-sky-950/20 via-blue-950/10 to-transparent pointer-events-none" />
      {/* Featured Hero Showcase */}
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      {/* Content Rails Section: Begins Cleanly Below Hero */}
      <div id="continue-watching" className="mt-3 sm:mt-5 lg:mt-6 relative z-30 space-y-4 sm:space-y-6">
        <ContinueWatchingRail />


        {/* Dynamic Content Rails */}
        {sections.map((section) => (
          <ContentRail
            key={section.id}
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={section.items}
            isPortrait={section.isPortrait}
            isRanked={section.isRanked}
            isLiveRail={section.id === 'sec-sports-live'}
            viewAllRoute={section.viewAllRoute}
          />
        ))}
      </div>
    </div>
  );
};
