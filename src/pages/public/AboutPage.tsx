import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Our Identity &amp; Mission</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto mt-2 text-white">
            Engineering Excellence, Academic Guidance &amp; Developer Support
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <span className="text-white font-bold">AffordStack</span>. We are a team of senior software architects, full-stack developers, and academic mentors dedicated to delivering real-world custom software and project mentoring at market-leading affordable rates.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Zero Shortcut Philosophy</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We never use flimsy mock data or fragile hacks. Every application is built with real relational PostgreSQL database schemas, strong typing, clean DTOs, and proper security.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Student Empowerment</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              College projects should not be intimidating black boxes. We mentor students line-by-line through their codebase, empowering them with genuine confidence during external evaluations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transparent Collaboration</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              From our itemized PDF quotations and clear milestone deliverables to direct customer proposal decision links, we keep clients informed every step of the journey.
            </p>
          </div>
        </div>
      </section>

      {/* Story / About */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bridging Industry Architecture and Academic Practicality
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Founded by veteran engineers with hands-on enterprise experience in Microsoft .NET, PostgreSQL, and modern React, <span className="font-semibold text-slate-900 dark:text-white">AffordStack</span> was formed to eliminate excessive agency markups and provide transparent, high-performance custom development for everyone.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Today, we serve a dual mission: empowering businesses with bespoke, high-efficiency software at truly affordable costs, and coaching university students to achieve academic distinction through industry-standard software engineering.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Explore Our Services
            </Link>
            <Link
              to="/contact"
              className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
