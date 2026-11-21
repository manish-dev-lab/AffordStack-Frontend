import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Award, 
  Terminal, 
  Database, 
  Layers 
} from 'lucide-react';

interface TickerItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
}

const ITEMS: TickerItem[] = [
  { icon: <Cpu className="w-4 h-4 text-blue-500" />, label: '.NET 10 & ASP.NET Core Web API', badge: 'High-Throughput' },
  { icon: <Layers className="w-4 h-4 text-cyan-400" />, label: 'React 19 & Tailwind v4 Architecture', badge: 'Production' },
  { icon: <Clock className="w-4 h-4 text-emerald-400" />, label: '< 24hr Quotation Turnaround', highlight: true },
  { icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />, label: 'Enterprise Clean Architecture & EF Core' },
  { icon: <Award className="w-4 h-4 text-amber-400" />, label: '100% Academic Viva & Demo Success' },
  { icon: <Terminal className="w-4 h-4 text-rose-400" />, label: 'Full Project Source & Documentation Included' },
  { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: 'Live Real-Time Enquiry Tracking', highlight: true },
  { icon: <Database className="w-4 h-4 text-sky-400" />, label: 'SQL Server & Redis Cache Optimized' },
  { icon: <Sparkles className="w-4 h-4 text-purple-400" />, label: 'Full Support & 30-Day Defect Warranty' },
];

export const MovingBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden border-y border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-slate-300 py-3 select-none relative ${className}`}>
      {/* Edge gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      {/* Marquee Wrapper */}
      <div className="animate-marquee flex items-center gap-8">
        {/* Sequence 1 */}
        {ITEMS.map((item, idx) => (
          <div
            key={`ticker-1-${idx}`}
            className="flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap bg-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 transition-colors"
          >
            {item.icon}
            <span className={item.highlight ? 'text-white font-bold' : 'text-slate-300'}>
              {item.label}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {item.badge}
              </span>
            )}
          </div>
        ))}

        {/* Duplicate Sequence for seamless infinite loop */}
        {ITEMS.map((item, idx) => (
          <div
            key={`ticker-2-${idx}`}
            className="flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap bg-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 transition-colors"
          >
            {item.icon}
            <span className={item.highlight ? 'text-white font-bold' : 'text-slate-300'}>
              {item.label}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
