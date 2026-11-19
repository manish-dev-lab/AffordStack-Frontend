import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCompanySettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const settings = useCompanySettings();
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-950/80 rounded-3xl p-8 sm:p-12 border border-blue-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Performance Delivery
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to execute your software or project requirements?
            </h3>
            <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-xl">
              Get an instant quotation, architectural breakdown, and project roadmap with no upfront obligation.
            </p>
          </div>
          <Link
            to="/request-a-quote"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Request Instant Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mt-16 pt-12 border-t border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Code className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Software<span className="text-blue-500">Services</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              Premier software engineering consultancy and academic project mentoring platform. Dedicated to delivering production-grade systems, resolving complex technical challenges, and mentoring the next generation of engineers.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-blue-500" />
                <a href={`mailto:${settings.email}`} className="hover:text-blue-400">{settings.email}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-blue-500" />
                <a href={`tel:${settings.phone}`} className="hover:text-blue-400">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Student Guidance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Student Guidance</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  MCA / B.Tech Projects
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  .NET &amp; C# Guidance
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  Java &amp; Spring Boot
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  React Full-Stack Apps
                </Link>
              </li>
              <li>
                <Link to="/services/student-project-guidance" className="hover:text-blue-400 transition-colors">
                  Viva &amp; Demo Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Technical Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  .NET &amp; C# Bug Fixing
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  ASP.NET Core Web API
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  PostgreSQL &amp; SQL Server
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  React Troubleshooting
                </Link>
              </li>
              <li>
                <Link to="/services/developer-technical-support" className="hover:text-blue-400 transition-colors">
                  Auth &amp; JWT Resolution
                </Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Enterprise &amp; Portal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/business-software-development" className="hover:text-blue-400 transition-colors">
                  Custom ERP &amp; CRM
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-blue-400 transition-colors">
                  Client Portfolio
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors">
                  Terms &amp; Conditions
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
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Software Services Platform. All rights reserved. Built with ASP.NET Core (.NET 10 LTS), React &amp; PostgreSQL.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:underline">Terms</Link>
            <Link to="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
