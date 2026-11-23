import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  link: string;
  title: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'enterprise-custom-software',
    image: '/banners/banner-enterprise.jpg',
    alt: 'AffordStack Low-Cost Custom Software & Business Websites',
    link: '/request-a-quote',
    title: 'Affordable High-Quality Custom Software & Business Websites'
  },
  {
    id: 'student-academic-mentoring',
    image: '/banners/banner-students.jpg',
    alt: 'Academic Minor & Major Projects: Full Code, Documentation & Setup Guide',
    link: '/services/student-project-guidance',
    title: 'Academic Projects: Complete Code, IEEE Documentation & Setup Guide'
  },
  {
    id: 'developer-bug-fixing',
    image: '/banners/banner-debugging.jpg',
    alt: 'Fast Production Bug Fixing & Milestone Billing with Zero Risk',
    link: '/services/developer-technical-support',
    title: 'Expert Developer Support: Fast Bug Fixing & Milestone Billing'
  }
];

const INITIAL_DELAY_MS = 3500; // Delay before first auto-scroll starts
const CYCLE_INTERVAL_MS = 5000; // Normal Amazon auto-scroll interval

export const HeroBannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStartedAuto, setHasStartedAuto] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe handling for iPhone / Mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Initial delay trigger
  useEffect(() => {
    const initTimer = setTimeout(() => {
      setHasStartedAuto(true);
    }, INITIAL_DELAY_MS);

    return () => clearTimeout(initTimer);
  }, []);

  // Recurring auto-scroll (Amazon style: pauses on hover/touch)
  useEffect(() => {
    if (!hasStartedAuto || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStartedAuto, isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 select-none mb-0 pb-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="AffordStack Highlights Banners"
    >
      {/* 
        HEIGHT CONSTRAINT:
        - h-[52vh] min-h-[320px] on mobile / iPhone ensures the banner height is strictly NOT less than half the screen height.
        - Scales seamlessly to h-[50vh] on tablets and max 560px on large desktop monitors.
      */}
      <div className="relative w-full h-[52vh] min-h-[320px] sm:h-[50vh] md:h-[450px] lg:h-[520px] max-h-[580px] overflow-hidden">
        {/* Banner Images Track */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative w-full h-full shrink-0 flex items-center justify-center bg-slate-950"
            >
              <Link
                to={banner.link}
                className="block w-full h-full relative cursor-pointer group"
                tabIndex={index === currentIndex ? 0 : -1}
                title={banner.title}
              >
                {/* Full-bleed Professional Banner Image */}
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.01]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Subtle bottom edge gradient for smooth transition */}
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
              </Link>
            </div>
          ))}
        </div>

        {/* Amazon-style Left Navigation Arrow (Desktop Only - Hidden on Mobile for Swipe) */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          aria-label="Previous banner"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-slate-800 text-white/90 hover:text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Amazon-style Right Navigation Arrow (Desktop Only - Hidden on Mobile for Swipe) */}
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          aria-label="Next banner"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-slate-800 text-white/90 hover:text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Pagination Indicator Pills (Amazon Style) */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-auto">
          {BANNERS.map((banner, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={banner.id}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                aria-label={`Go to banner ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                  isActive
                    ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50'
                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
