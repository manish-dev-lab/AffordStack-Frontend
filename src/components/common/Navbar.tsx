import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  Layers,
  Sparkles,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useUserAuth } from '../../context/UserAuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileUserDropdown, setMobileUserDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: isAdminAuthenticated } = useAuth();
  const { isUserAuthenticated, user: clientUser, logout: userLogout } = useUserAuth();

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

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdown(false);
    setUserDropdown(false);
    setMobileUserDropdown(false);
  }, [location.pathname]);

  // Click outside listener for user avatar dropdown (both desktop and mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
        setMobileUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper for clicking links: closes all menus and scrolls to top smoothly if already on page
  const handleNavClick = (path: string, e?: React.MouseEvent) => {
    setIsOpen(false);
    setServicesDropdown(false);
    setUserDropdown(false);
    setMobileUserDropdown(false);

    if (location.pathname === path) {
      e?.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle click on search icon or Track Enquiry link
  const handleTrackClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    setServicesDropdown(false);
    setUserDropdown(false);
    setMobileUserDropdown(false);

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

  const handleUserSignOut = () => {
    setUserDropdown(false);
    setMobileUserDropdown(false);
    setIsOpen(false);
    userLogout();
    navigate('/user/login');
  };

  const userInitial = (clientUser?.fullName || clientUser?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Brand Logo */}
            <BrandLogo
              to="/"
              onClick={(e) => handleNavClick('/', e)}
              subtitleText="Low-Cost Custom Software"
            />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center lg:gap-2 xl:gap-3.5 2xl:gap-5 text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0">
              <Link
                to="/"
                onClick={(e) => handleNavClick('/', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={(e) => handleNavClick('/about', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/about') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                About Us
              </Link>

              {/* Services Dropdown (Closes on click) */}
              <div 
                className="relative shrink-0"
                onMouseEnter={() => setServicesDropdown(true)}
                onMouseLeave={() => setServicesDropdown(false)}
              >
                <Link
                  to="/services"
                  onClick={(e) => handleNavClick('/services', e)}
                  className={`flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
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
                      onClick={(e) => handleNavClick('/services/student-project-guidance', e)}
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
                      onClick={(e) => handleNavClick('/services/developer-technical-support', e)}
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
                      onClick={(e) => handleNavClick('/services/business-enterprise-software', e)}
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
                onClick={(e) => handleNavClick('/portfolio', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Portfolio
              </Link>

              <Link
                to="/technologies"
                onClick={(e) => handleNavClick('/technologies', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/technologies') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Technologies
              </Link>

              <Link
                to="/blog"
                onClick={(e) => handleNavClick('/blog', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/blog') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Blog
              </Link>

              <Link
                to="/track-enquiry"
                onClick={handleTrackClick}
                className={`flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/track-enquiry') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
                title="Track Live Enquiry Status"
              >
                <Search className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Track</span>
              </Link>

              <Link
                to="/contact"
                onClick={(e) => handleNavClick('/contact', e)}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 whitespace-nowrap shrink-0 ${
                  isActive('/contact') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0 whitespace-nowrap">
              <ThemeToggle />

              {/* Client Account: Round Avatar Dropdown (Always visible on Desktop) */}
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdown((prev) => !prev)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-hidden shrink-0 border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-blue-500/30 shadow-xs"
                  title={isUserAuthenticated ? `${clientUser?.fullName || 'User'} - Click for Account Menu` : 'Guest Account - Click to Sign In'}
                >
                  {isUserAuthenticated ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-xs">
                      {userInitial}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Desktop Account Dropdown */}
                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    {isUserAuthenticated ? (
                      <>
                        <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {clientUser?.fullName || 'Client User'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {clientUser?.email}
                          </div>
                        </div>

                        <div className="py-1 space-y-1">
                          <Link
                            to="/user/dashboard"
                            onClick={(e) => handleNavClick('/user/dashboard', e)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
                          >
                            <FolderKanban className="w-4 h-4 text-blue-500" />
                            <span>Dashboard</span>
                          </Link>

                          <Link
                            to="/user/profile"
                            onClick={(e) => handleNavClick('/user/profile', e)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>Profile</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleUserSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Customer Account</div>
                          <div className="text-[11px] text-slate-400">Sign in to track live project status</div>
                        </div>
                        <div className="py-1 space-y-1">
                          <Link
                            to="/user/login"
                            onClick={(e) => handleNavClick('/user/login', e)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
                          >
                            <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Sign In</span>
                          </Link>
                          <Link
                            to="/user/login"
                            onClick={(e) => handleNavClick('/user/login', e)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span>Create Account</span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Portal Button */}
              <Link
                to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"}
                onClick={(e) => handleNavClick(isAdminAuthenticated ? "/admin/dashboard" : "/admin/login", e)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-2 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAdminAuthenticated ? "Admin Dashboard" : "Admin Portal"}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminAuthenticated ? 'Admin' : 'Portal'}</span>
              </Link>

              <Link
                to="/request-a-quote"
                onClick={(e) => handleNavClick('/request-a-quote', e)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs xl:text-sm font-bold px-3.5 xl:px-4 py-2 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Request Quote</span>
              </Link>
            </div>

            {/* Mobile Actions: ThemeToggle, Persistent Round Avatar Icon with Dropdown, Hamburger Button */}
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              <ThemeToggle />

              {/* Persistent Round Avatar Circle with Dropdown on Mobile (Human icon if guest, initial if logged in) */}
              <div className="relative shrink-0" ref={mobileUserMenuRef}>
                <button
                  type="button"
                  onClick={() => setMobileUserDropdown((prev) => !prev)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-hidden shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs"
                  aria-label="Account Menu"
                >
                  {isUserAuthenticated ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-xs">
                      {userInitial}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Mobile Account Dropdown */}
                {mobileUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    {isUserAuthenticated ? (
                      <>
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {clientUser?.fullName || 'Client User'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {clientUser?.email}
                          </div>
                        </div>
                        <div className="py-1 space-y-1">
                          <Link
                            to="/user/dashboard"
                            onClick={(e) => {
                              setMobileUserDropdown(false);
                              handleNavClick('/user/dashboard', e);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <FolderKanban className="w-4 h-4 text-blue-500" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/user/profile"
                            onClick={(e) => {
                              setMobileUserDropdown(false);
                              handleNavClick('/user/profile', e);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>Profile</span>
                          </Link>
                        </div>
                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setMobileUserDropdown(false);
                              handleUserSignOut();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Account</div>
                          <div className="text-[11px] text-slate-400">Sign in to track enquiries</div>
                        </div>
                        <div className="py-1 space-y-1">
                          <Link
                            to="/user/login"
                            onClick={(e) => {
                              setMobileUserDropdown(false);
                              handleNavClick('/user/login', e);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <LogIn className="w-4 h-4 text-blue-500" />
                            <span>Sign In</span>
                          </Link>
                          <Link
                            to="/user/login"
                            onClick={(e) => {
                              setMobileUserDropdown(false);
                              handleNavClick('/user/login', e);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span>Create Account</span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer touch-manipulation z-50 select-none active:scale-95 transition-transform"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6 text-slate-900 dark:text-white" /> : <Menu className="w-6 h-6 text-slate-900 dark:text-white" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu (Public Navigation Only - User Profile removed as requested) */}
      {isOpen && (
        <div 
          className="fixed inset-x-0 top-20 bottom-0 z-40 lg:hidden flex flex-col bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-y-auto overscroll-contain animate-in slide-in-from-top-2 duration-150"
          style={{ height: 'calc(100dvh - 5rem)' }}
        >
          <div className="px-4 pt-3 pb-24 space-y-2.5">
            {/* 1. Home */}
            <Link
              to="/"
              onClick={(e) => handleNavClick('/', e)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            {/* 3. Quick Action: Request Quote Banner */}
            <Link
              to="/request-a-quote"
              onClick={(e) => handleNavClick('/request-a-quote', e)}
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

            {/* 5. Services Submenu Accordion Dropdown on Mobile */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span>Services</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    3 Available
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-3 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to="/services/student-project-guidance"
                    onClick={(e) => handleNavClick('/services/student-project-guidance', e)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Student Project Guidance (MCA, B.Tech)</span>
                  </Link>
                  <Link
                    to="/services/developer-technical-support"
                    onClick={(e) => handleNavClick('/services/developer-technical-support', e)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
                  >
                    <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Developer Technical Support</span>
                  </Link>
                  <Link
                    to="/services/business-enterprise-software"
                    onClick={(e) => handleNavClick('/services/business-enterprise-software', e)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Business &amp; Enterprise Software</span>
                  </Link>
                  <Link
                    to="/services"
                    onClick={(e) => handleNavClick('/services', e)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>View All Services &rarr;</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Portfolio */}
            <Link
              to="/portfolio"
              onClick={(e) => handleNavClick('/portfolio', e)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Portfolio
            </Link>

            {/* 7. Technologies */}
            <Link
              to="/technologies"
              onClick={(e) => handleNavClick('/technologies', e)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/technologies') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Technologies
            </Link>

            {/* 8. Blog */}
            <Link
              to="/blog"
              onClick={(e) => handleNavClick('/blog', e)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/blog') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Blog &amp; Articles
            </Link>

            {/* 9. About Us */}
            <Link
              to="/about"
              onClick={(e) => handleNavClick('/about', e)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/about') ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              About Us
            </Link>

            {/* 10. Contact Us */}
            <Link
              to="/contact"
              onClick={(e) => handleNavClick('/contact', e)}
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
                onClick={(e) => handleNavClick(isAdminAuthenticated ? "/admin/dashboard" : "/admin/login", e)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminAuthenticated ? 'Admin Console' : 'Admin Portal Login'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
