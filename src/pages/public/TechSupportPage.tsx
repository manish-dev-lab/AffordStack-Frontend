import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Bug, Database, ShieldCheck, Zap, ArrowRight, Layers } from 'lucide-react';

export const TechSupportPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-6">
            <Wrench className="w-4 h-4" /> Senior Engineering Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl">
            Developer Technical Support &amp; Production Bug Fixing
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Stuck on an elusive ASP.NET Core deadlock, broken React state hook, slow PostgreSQL query, or JWT token refresh loop? Our senior architects rapidly isolate root causes and deliver tested, permanent resolutions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-a-quote?category=Bug%20Fixing"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              Request Debugging Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Bug,
              title: '.NET & C# Bug Fixing',
              desc: 'Deadlocks in async/await code, Entity Framework Core N+1 queries, tracking conflicts, memory leaks, and dependency injection lifecycle mismatches.',
            },
            {
              icon: Layers,
              title: 'React Troubleshooting',
              desc: 'Infinite re-renders in useEffect, broken Axios interceptors, complex state synchronization with Redux/Zustand, and responsive layout shifts.',
            },
            {
              icon: Database,
              title: 'Database Query Optimization',
              desc: 'Profiling PostgreSQL and SQL Server execution plans, composite B-tree & GIN index engineering, transaction isolation tuning, and connection pool stabilization.',
            },
            {
              icon: ShieldCheck,
              title: 'Auth & JWT Resolution',
              desc: 'Troubleshooting token validation failures, expired tokens, CORS cross-origin blocking, role-based authorization policies, and security hardening.',
            },
            {
              icon: Zap,
              title: 'REST API Integration',
              desc: 'Diagnosing payload serialization errors, HTTP status code discrepancies, multipart upload handling, and third-party webhook integrations.',
            },
            {
              icon: Wrench,
              title: 'Architecture Review',
              desc: 'Codebase review, refactoring legacy monolithic structures into clean layered architectures, and enforcing SOLID design principles.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-indigo-50 rounded-3xl p-10 border border-indigo-100">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Have a blocker slowing down your release?
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Attach error logs, stack traces, or code snippets through our quotation form for a fast technical consultation.
          </p>
          <div className="mt-6">
            <Link
              to="/request-a-quote?category=Bug%20Fixing"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3 rounded-xl shadow-md"
            >
              Submit Technical Issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
