import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCompanySettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const settings = useCompanySettings();
  const location = useLocation();

  // Pages where the bottom CTA quote banner is redundant or intrusive
  const isCtaExcluded = 
    location.pathname === '/request-a-quote' ||
    location.pathname.startsWith('/quotations/decision') ||
    location.pathname.includes('/login') ||
    location.pathname === '/track-enquiry';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top CTA Banner - Compact and Sleek */}
        {!isCtaExcluded && (
          <div className="mb-10 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-900/50 via-indigo-950/70 to-slate-900 rounded-2xl p-5 sm:p-6 border border-blue-500/25 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> High-Performance Delivery
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Ready to execute your software or project requirements?
                </h3>
                <p className="text-slate-300 mt-1 text-xs sm:text-sm max-w-xl">
                  Get an instant quotation, architectural breakdown, and project roadmap with no upfront obligation.
                </p>
              </div>
              <Link
                to="/request-a-quote"
                className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Request Instant Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Links Grid - Balanced & Space-Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          {/* Brand Info & Contact */}
          <div className="space-y-4">
            <BrandLogo
              to="/"
              subtitleText="Low-Cost Custom Software & Mentoring"
              className="[&_span]:text-white"
            />
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Premier low-cost custom software engineering and academic project development platform. Delivering high-quality systems at unbeatable market rates.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-blue-400 truncate">{settings.email}</a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-blue-400">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Student Projects */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Academic Projects</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  MCA &amp; B.Tech Projects
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  .NET 10 &amp; C# Guidance
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  Java &amp; Spring Boot Architecture
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  React Full-Stack Projects
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  Project Setup &amp; Code Walkthrough
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Support & Solutions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Technical Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  .NET &amp; C# Bug Resolution
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  ASP.NET Core Web API
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  PostgreSQL &amp; Query Optimization
                </Link>
              </li>
              <li>
                <Link to="/services/business-enterprise-software" className="hover:text-blue-400 transition-colors">
                  Low-Cost Business Websites
                </Link>
              </li>
              <li>
                <Link to="/services/business-enterprise-software" className="hover:text-blue-400 transition-colors">
                  Custom ERP &amp; CRM Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portal &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track-enquiry" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5">
                  Track Live Enquiry &rarr;
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-blue-400 transition-colors">
                  Delivered Projects Portfolio
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-blue-400 transition-colors">
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/delivery-policy" className="hover:text-blue-400 transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-blue-400 transition-colors text-slate-500">
                  Staff Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AffordStack Platform. All rights reserved. Built with ASP.NET Core (.NET 10 LTS), React &amp; PostgreSQL.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-300 hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 hover:underline">Terms</Link>
            <Link to="/refund-policy" className="hover:text-slate-300 hover:underline">Refund</Link>
            <Link to="/delivery-policy" className="hover:text-slate-300 hover:underline">Delivery</Link>
            <Link to="/contact" className="hover:text-slate-300 hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
