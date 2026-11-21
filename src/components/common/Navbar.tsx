import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Code, 
  GraduationCap, 
  Wrench, 
  Building2, 
  FileText, 
  Lock,
  Search,
  User,
  LogIn,
  LayoutDashboard
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useUserAuth } from '../../context/UserAuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const location = useLocation();
  const { isAuthenticated: isAdminAuthenticated } = useAuth();
  const { isUserAuthenticated, user: clientUser } = useUserAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Software<span className="text-blue-600 dark:text-blue-400 font-extrabold">Services</span>
              </span>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Engineering &amp; Mentoring
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/about') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                to="/services"
                className={`text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  location.pathname.startsWith('/services') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Services
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full -left-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/services/student-project-guidance"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Student Projects</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">MCA, BCA, B.Tech &amp; M.Tech guidance</div>
                    </div>
                  </Link>

                  <Link
                    to="/services/developer-technical-support"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Developer Support</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Bug fixes, Web API &amp; DB tuning</div>
                    </div>
                  </Link>

                  <Link
                    to="/services/business-enterprise-software"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Enterprise Dev</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">ERP, CRM, E-commerce &amp; SaaS apps</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/portfolio"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Portfolio
            </Link>

            <Link
              to="/technologies"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/technologies') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Technologies
            </Link>

            <Link
              to="/blog"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/blog') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Blog
            </Link>

            <Link
              to="/track-enquiry"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/track-enquiry') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              Track Status
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive('/contact') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {/* Client Account: Sign In or Dashboard */}
            {isUserAuthenticated ? (
              <Link
                to="/user/dashboard"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center gap-1.5 py-2 px-3 rounded-lg border border-blue-200/60 dark:border-blue-900 transition-colors"
                title="Client Dashboard & Enquiries"
              >
                <User className="w-3.5 h-3.5" />
                <span>{clientUser?.fullName?.split(' ')[0] || 'My Account'}</span>
              </Link>
            ) : (
              <Link
                to="/user/login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Client Sign In"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Portal Button */}
            <Link
              to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isAdminAuthenticated ? "Admin Dashboard" : "Admin Portal"}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminAuthenticated ? 'Admin' : 'Portal'}</span>
            </Link>

            <Link
              to="/request-a-quote"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Request a Quote
            </Link>
          </div>

          {/* Mobile Menu Button & Quick Actions */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/track-enquiry"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Track Enquiry"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/request-a-quote"
              className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg"
            >
              Quote
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            About Us
          </Link>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1">
            <div className="px-3 text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Services</div>
            <Link
              to="/services/student-project-guidance"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
            >
              Student Project Guidance (MCA, B.Tech)
            </Link>
            <Link
              to="/services/developer-technical-support"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
            >
              Developer Technical Support
            </Link>
            <Link
              to="/services/business-enterprise-software"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
            >
              Business &amp; Enterprise Software
            </Link>
          </div>
          <Link
            to="/portfolio"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Portfolio
          </Link>
          <Link
            to="/technologies"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Technologies
          </Link>
          <Link
            to="/blog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Blog &amp; Articles
          </Link>
          <Link
            to="/track-enquiry"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60"
          >
            <Search className="w-4 h-4" />
            Track Project Enquiry
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Contact Us
          </Link>
          {/* Client Account Link (Mobile) */}
          {isUserAuthenticated ? (
            <Link
              to="/user/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
            >
              <User className="w-4 h-4" />
              <span>My Enquiries &amp; Account</span>
            </Link>
          ) : (
            <Link
              to="/user/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <LogIn className="w-4 h-4" />
              <span>Client Sign In / Register</span>
            </Link>
          )}

          {/* Admin Link (Mobile) */}
          <Link
            to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminAuthenticated ? 'Admin Console' : 'Admin Portal Login'}</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
