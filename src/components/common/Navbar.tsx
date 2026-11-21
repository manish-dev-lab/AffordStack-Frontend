import React, { useState, useEffect } from 'react';
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
  Layers,
  Sparkles,
  ArrowRight
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

  // Lock body scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle click on search icon or Track Enquiry link
  const handleTrackClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (location.pathname === '/track-enquiry' || location.pathname === '/track') {
      e.preventDefault();
      const input = document.getElementById('tracking-ref-input') || document.querySelector('input[type="text"]');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (input as HTMLInputElement).focus();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const userInitial = (clientUser?.fullName || clientUser?.email || 'U').charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Code className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="truncate">
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Software<span className="text-blue-600 dark:text-blue-400 font-extrabold">Services</span>
              </span>
              <span className="hidden sm:block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Engineering &amp; Mentoring
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center lg:gap-3 xl:gap-5 text-xs xl:text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/about') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
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
                className={`flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                  location.pathname.startsWith('/services') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full -left-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <Link
                    to="/services/student-project-guidance"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
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
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group mt-1 cursor-pointer"
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
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group mt-1 cursor-pointer"
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
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Portfolio
            </Link>

            <Link
              to="/technologies"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/technologies') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Technologies
            </Link>

            <Link
              to="/blog"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/blog') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Blog
            </Link>

            <Link
              to="/track-enquiry"
              onClick={handleTrackClick}
              className={`flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/track-enquiry') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
              title="Track Live Enquiry Status"
            >
              <Search className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Track</span>
            </Link>

            <Link
              to="/contact"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${
                isActive('/contact') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <ThemeToggle />

            {/* Client Account: Sign In or Avatar Icon */}
            {isUserAuthenticated ? (
              <Link
                to="/user/dashboard"
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-900 transition-colors group cursor-pointer"
                title={`${clientUser?.fullName || 'User'} - Customer Dashboard & Enquiries`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase">
                  {userInitial}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 max-w-[90px] xl:max-w-[120px] truncate">
                  {clientUser?.fullName?.split(' ')[0] || 'My Account'}
                </span>
              </Link>
            ) : (
              <Link
                to="/user/login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 py-2 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Client Sign In / Register"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Portal Button */}
            <Link
              to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAdminAuthenticated ? "Admin Dashboard" : "Admin Portal"}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminAuthenticated ? 'Admin' : 'Portal'}</span>
            </Link>

            <Link
              to="/request-a-quote"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs xl:text-sm font-bold px-3.5 xl:px-4 py-2 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Request Quote</span>
            </Link>
          </div>

          {/* Mobile Menu Button & Quick Actions */}
          <div className="lg:hidden flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />

            {/* If logged in on mobile, show user initial avatar circle */}
            {isUserAuthenticated && (
              <Link
                to="/user/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase cursor-pointer shrink-0"
                title="My Account"
              >
                {userInitial}
              </Link>
            )}

            {/* Track and Quote are hidden on narrow mobile to prevent any horizontal overflow, since both are prominently at top of drawer */}
            <Link
              to="/track-enquiry"
              onClick={handleTrackClick}
              className="hidden sm:inline-flex p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Track Live Enquiry"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              to="/request-a-quote"
              className="hidden sm:inline-flex bg-blue-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl cursor-pointer"
            >
              Quote
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-slate-900 dark:text-white" /> : <Menu className="w-6 h-6 text-slate-900 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu: Solid full screen dropdown without gaps */}
      {isOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-50 lg:hidden flex flex-col bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-y-auto overscroll-contain animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 pt-3 pb-20 space-y-2.5">
            {/* 1. Home */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            {/* 2. Customer Enquiries & Account */}
            {isUserAuthenticated ? (
              <Link
                to="/user/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-base font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                  {userInitial}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {clientUser?.fullName || 'My Account'}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    My Enquiries &amp; Quotations &rarr;
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to="/user/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold">Client Sign In / Register</span>
                  <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">Track all past &amp; live enquiries</span>
                </div>
              </Link>
            )}

            {/* 3. Quick Action: Request Quote Banner */}
            <Link
              to="/request-a-quote"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Request a Custom Quote</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* 4. Track Project Enquiry */}
            <Link
              to="/track-enquiry"
              onClick={handleTrackClick}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60"
            >
              <Search className="w-4 h-4" />
              <span>Track Project Enquiry</span>
            </Link>

            {/* 5. Services Submenu */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1">
              <div className="px-3.5 text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Services</div>
              <Link
                to="/services/student-project-guidance"
                onClick={() => setIsOpen(false)}
                className="block px-3.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
              >
                Student Project Guidance (MCA, B.Tech)
              </Link>
              <Link
                to="/services/developer-technical-support"
                onClick={() => setIsOpen(false)}
                className="block px-3.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
              >
                Developer Technical Support
              </Link>
              <Link
                to="/services/business-enterprise-software"
                onClick={() => setIsOpen(false)}
                className="block px-3.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
              >
                Business &amp; Enterprise Software
              </Link>
            </div>

            {/* 6. Portfolio */}
            <Link
              to="/portfolio"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Portfolio
            </Link>

            {/* 7. Technologies */}
            <Link
              to="/technologies"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/technologies') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Technologies
            </Link>

            {/* 8. Blog */}
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/blog') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Blog &amp; Articles
            </Link>

            {/* 9. About Us */}
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/about') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              About Us
            </Link>

            {/* 10. Contact Us */}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/contact') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Contact Us
            </Link>

            {/* 11. Admin Console Link */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminAuthenticated ? 'Admin Console' : 'Admin Portal Login'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
