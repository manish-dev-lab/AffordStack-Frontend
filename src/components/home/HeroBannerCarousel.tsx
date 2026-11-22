import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  GraduationCap, 
  Wrench, 
  ShieldCheck, 
  CreditCard,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface BannerSlide {
  id: string;
  tag: string;
  tagIcon: React.ReactNode;
  tagColor: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  secondaryIcon?: React.ReactNode;
  accentGradient: string;
  stats: { label: string; value: string }[];
}

const SLIDES: BannerSlide[] = [
  {
    id: 'enterprise-custom-software',
    tag: 'ENTERPRISE ARCHITECTURE',
    tagIcon: <Zap className="w-3.5 h-3.5" />,
    tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    title: 'High-Performance Custom Software & Web Platforms at ',
    highlightedTitle: 'Unbeatable Low Cost',
    description: 'Production-ready .NET 10 LTS APIs, React & TypeScript web applications, and PostgreSQL data pipelines built with clean architecture — saving you 60% compared to typical agencies.',
    primaryCtaText: 'Request a Custom Quote',
    primaryCtaLink: '/request-a-quote',
    secondaryCtaText: 'Track Live Proposal',
    secondaryCtaLink: '/track-enquiry',
    secondaryIcon: <Search className="w-4 h-4 text-blue-400" />,
    accentGradient: 'from-blue-600/30 via-indigo-600/20 to-sky-500/10',
    stats: [
      { value: '< 24h', label: 'Quotation Turnaround' },
      { value: '100%', label: 'Clean Architecture' },
      { value: '0', label: 'Hidden Maintenance Fees' },
      { value: '.NET 10', label: 'LTS Modern Stack' }
    ]
  },
  {
    id: 'student-project-guidance',
    tag: 'ACADEMIC CONSULTING & VIVA DEFENSE',
    tagIcon: <GraduationCap className="w-3.5 h-3.5" />,
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    title: 'Final Year Major & Minor Projects with ',
    highlightedTitle: '100% Viva Success Rate',
    description: 'Comprehensive 1-on-1 source code explanation, IEEE-standard documentation, system diagrams, and external viva mock drills for MCA, B.Tech, BCA, and M.Tech students.',
    primaryCtaText: 'Start Your Student Project',
    primaryCtaLink: '/request-a-quote',
    secondaryCtaText: 'Explore Student Guidance',
    secondaryCtaLink: '/services',
    secondaryIcon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
    accentGradient: 'from-emerald-600/30 via-teal-600/20 to-blue-500/10',
    stats: [
      { value: '100%', label: 'External Viva Success' },
      { value: '1-on-1', label: 'Live Code Mentoring' },
      { value: 'Full', label: 'Docs & IEEE Reports' },
      { value: 'Budget', label: 'Student-Friendly Pricing' }
    ]
  },
  {
    id: 'developer-bug-fixing',
    tag: 'ON-DEMAND PROBLEM SOLVING',
    tagIcon: <Wrench className="w-3.5 h-3.5" />,
    tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    title: 'Stuck on a Stubborn Bug or Architecture Issue? ',
    highlightedTitle: 'We Fix It in Hours',
    description: 'Live pair-debugging with senior architects. From complex EF Core database bottlenecks and memory leaks to Docker container issues and third-party API breakages.',
    primaryCtaText: 'Get Developer Help Now',
    primaryCtaLink: '/request-a-quote',
    secondaryCtaText: 'View Tech Support',
    secondaryCtaLink: '/services',
    secondaryIcon: <Wrench className="w-4 h-4 text-amber-400" />,
    accentGradient: 'from-amber-600/25 via-orange-600/20 to-rose-500/10',
    stats: [
      { value: '< 2h', label: 'Initial Triage Response' },
      { value: '100%', label: 'Root Cause Resolution' },
      { value: 'Direct', label: 'Senior Engineer Pair-Fix' },
      { value: 'Fair', label: 'Milestone-Based Billing' }
    ]
  },
  {
    id: 'cashfree-milestone-payments',
    tag: 'SECURE CASHFREE PAYMENTS',
    tagIcon: <CreditCard className="w-3.5 h-3.5" />,
    tagColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    title: 'Zero Financial Risk: Pay Strictly with ',
    highlightedTitle: 'Milestone-Based Approvals',
    description: 'Powered by Cashfree Payments with UPI, NetBanking, and Cards. Pay an agreed advance to kickoff, then inspect source code and deliverables before releasing each milestone.',
    primaryCtaText: 'View Transparent Process',
    primaryCtaLink: '/about',
    secondaryCtaText: 'Track Your Project',
    secondaryCtaLink: '/track-enquiry',
    secondaryIcon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    accentGradient: 'from-purple-600/30 via-indigo-600/20 to-blue-500/10',
    stats: [
      { value: 'UPI / Cards', label: 'Cashfree PG Supported' },
      { value: 'Instant', label: 'Digital GST Invoices' },
      { value: '100%', label: 'Deliverable Transparency' },
      { value: 'Zero', label: 'Advance Lock-in Risk' }
    ]
  }
];

const INITIAL_DELAY_MS = 3500; // Delay before first auto-scroll starts
const CYCLE_INTERVAL_MS = 5500; // Normal cycle interval

export const HeroBannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStartedAuto, setHasStartedAuto] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Initial delay trigger
  useEffect(() => {
    const initTimer = setTimeout(() => {
      setHasStartedAuto(true);
    }, INITIAL_DELAY_MS);

    return () => clearTimeout(initTimer);
  }, []);

  // Recurring auto-scroll (Amazon style: pauses on hover)
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
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section 
      className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="AffordStack Highlights Carousel"
    >
      {/* Background Ambient Glows that transition with current slide */}
      <div 
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r ${currentSlide.accentGradient} blur-[140px] rounded-full pointer-events-none transition-all duration-1000`} 
      />
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Arrow Left */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Content Container */}
        <div className="text-center px-4 sm:px-12 md:px-16 min-h-[460px] sm:min-h-[420px] flex flex-col justify-center">
          {/* Tag Pill */}
          <div className="flex justify-center mb-6">
            <span 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-md transition-all duration-500 ${currentSlide.tagColor}`}
            >
              {currentSlide.tagIcon}
              <span>{currentSlide.tag}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-5xl mx-auto leading-[1.15] text-white">
            {currentSlide.title}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
              {currentSlide.highlightedTitle}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={currentSlide.primaryCtaLink}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {currentSlide.primaryCtaText}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <Link
              to={currentSlide.secondaryCtaLink}
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl border border-slate-700/80 transition-all hover:border-blue-500/50 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              {currentSlide.secondaryIcon}
              {currentSlide.secondaryCtaText}
            </Link>
          </div>
        </div>

        {/* Carousel Bottom Indicator Pills (Amazon Style) */}
        <div className="flex items-center justify-center gap-2.5 mt-8 z-20 relative">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2.5 ${
                  isActive
                    ? 'w-10 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-500/50'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            );
          })}
        </div>

        {/* Metrics Grid Bar below Carousel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-14 pt-10 border-t border-slate-800/80 text-center">
          {currentSlide.stats.map((st, i) => (
            <div key={i} className="transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {st.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
