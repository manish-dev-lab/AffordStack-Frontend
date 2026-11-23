import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  link: string;
  ctaText: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'enterprise-custom-software',
    image: '/banners/banner-enterprise.jpg',
    alt: 'AffordStack Enterprise Custom Software Development',
    badge: 'Enterprise .NET & React',
    title: 'High-Performance Custom Software & Cloud Platforms',
    subtitle: 'Scalable .NET 10 LTS APIs, React Web Applications & Clean Architecture at Low Cost',
    link: '/request-a-quote',
    ctaText: 'Request a Custom Quote'
  },
  {
    id: 'student-academic-mentoring',
    image: '/banners/banner-students.jpg',
    alt: 'Academic Project Mentoring & 1-on-1 Viva Preparation',
    badge: 'MCA & B.Tech Project Guidance',
    title: '100% Viva Success Rate: Major & Minor Projects',
    subtitle: '1-on-1 Code Mentoring, IEEE Standards Documentation & Viva Coaching',
    link: '/services',
    ctaText: 'Explore Student Projects'
  },
  {
    id: 'developer-bug-fixing',
    image: '/banners/banner-debugging.jpg',
    alt: 'On-Demand Developer Bug Fixing & Milestone Engineering',
    badge: 'Expert Developer Support',
    title: 'Fast Bug Fixing, Database Tuning & Milestone Billing',
    subtitle: 'Resolve Critical Production Bugs & Pay Zero-Risk Milestone by Milestone',
    link: '/request-a-quote',
    ctaText: 'Get Bug Fixed Fast'
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
      className="relative w-full overflow-hidden bg-slate-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="AffordStack Highlights Banners"
    >
      {/* 
        HEIGHT CONSTRAINT:
        - min-h-[52vh] on mobile / iPhone ensures the banner height is strictly NOT less than half the screen height.
        - Scales seamlessly to h-[54vh] on small screens, h-[60vh] on tablets, and max 640px on large desktop monitors.
      */}
      <div className="relative w-full min-h-[52vh] sm:min-h-[54vh] md:min-h-[58vh] lg:h-[62vh] max-h-[640px] overflow-hidden">
        {/* Banner Images Track */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative w-full h-full shrink-0 flex items-center justify-center"
            >
              <Link
                to={banner.link}
                className="block w-full h-full relative cursor-pointer group"
                tabIndex={index === currentIndex ? 0 : -1}
                title={banner.title}
              >
                {/* Full-bleed Banner Image */}
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Subtle dark vignette overlay for depth and contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/30 sm:from-slate-950/85 sm:via-transparent sm:to-transparent pointer-events-none" />

                {/* Amazon-style Bottom Blend Gradient into Page */}
                <div className="absolute inset-x-0 bottom-0 h-24 sm:h-36 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

                {/* Sleek Content Overlay Card */}
                <div className="absolute left-4 right-4 sm:left-12 sm:right-auto bottom-6 sm:bottom-10 max-w-xl z-20 pointer-events-auto">
                  <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 dark:bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-2xl space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {banner.badge}
                    </span>
                    <h2 className="text-base sm:text-2xl font-black text-white tracking-tight leading-snug">
                      {banner.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {banner.subtitle}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-blue-400 group-hover:text-blue-300 transition-colors">
                        {banner.ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Amazon-style Left Navigation Arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Amazon-style Right Navigation Arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          aria-label="Next banner"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
