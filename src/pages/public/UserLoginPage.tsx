import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { userAuthApi } from '../../api/userAuthApi';
import { useToast } from '../../context/ToastContext';
import { Reveal } from '../../components/common/Reveal';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Code,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const UserLoginPage: React.FC = () => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [regStep, setRegStep] = useState<'details' | 'otp'>('details');
  const { login, register, isUserAuthenticated } = useUserAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [otp, setOtp] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [serverErrorPopup, setServerErrorPopup] = useState<string | null>(null);

  const redirectPath = (location.state as { from?: string })?.from || '/user/dashboard';

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isUserAuthenticated, navigate, redirectPath]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle switching tabs
  const handleTabChange = (newTab: 'signin' | 'register') => {
    setTab(newTab);
    setError(null);
    setServerErrorPopup(null);
    if (newTab === 'register') {
      setRegStep('details');
    }
  };

  // Step 1: Request OTP for new registration
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerErrorPopup(null);

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSendingOtp(true);
    try {
      await userAuthApi.sendRegistrationOtp({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
      });
      setRegStep('otp');
      setResendCooldown(60);
      showToast({
        type: 'success',
        title: 'Verification Code Sent',
        message: `A 6-digit OTP has been sent to ${email.trim()}. Please check your inbox.`,
      });
    } catch (err: unknown) {
      const apiErr = err as { isServerError?: boolean; message?: string };
      if (apiErr?.isServerError) {
        setServerErrorPopup('Unable to connect to the authentication server. Please try again in a few moments.');
      } else {
        setError(apiErr?.message || (err instanceof Error ? err.message : 'Failed to send verification code.'));
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || sendingOtp) return;
    setSendingOtp(true);
    setError(null);
    try {
      await userAuthApi.sendRegistrationOtp({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
      });
      setResendCooldown(60);
      showToast({
        type: 'info',
        title: 'New Code Sent',
        message: 'A fresh 6-digit verification code has been dispatched to your email.',
      });
    } catch (err: unknown) {
      const apiErr = err as { isServerError?: boolean; message?: string };
      setError(apiErr?.message || 'Unable to resend verification code.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Complete Registration with OTP
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);
    setServerErrorPopup(null);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        companyName: companyName.trim() || undefined,
        password,
        otp: otp.trim(),
      });
      showToast({
        type: 'success',
        title: 'Account Created',
        message: 'Welcome! Your customer account has been created and verified successfully.',
      });
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { isServerError?: boolean; message?: string };
      if (apiErr?.isServerError) {
        setServerErrorPopup('Something went wrong while completing registration. Please try again shortly.');
      } else {
        setError(apiErr?.message || (err instanceof Error ? err.message : 'Registration failed. Please check your OTP.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign In submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setServerErrorPopup(null);

    try {
      await login({ email: email.trim().toLowerCase(), password });
      showToast({
        type: 'success',
        title: 'Welcome Back',
        message: 'You have signed in to your customer portal successfully.',
      });
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { isServerError?: boolean; message?: string };
      if (apiErr?.isServerError) {
        setServerErrorPopup('Something went wrong while connecting to the server. Please try again shortly.');
      } else {
        setError(apiErr?.message || (err instanceof Error ? err.message : 'Invalid email or password. Please verify your credentials.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Code className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Software<span className="text-blue-600 dark:text-blue-400">Services</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {tab === 'signin'
            ? 'Sign In to Your Customer Account'
            : regStep === 'details'
            ? 'Create Your Customer Account'
            : 'Verify Your Email Address'}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {tab === 'signin'
            ? 'Access your submitted project enquiries, proposals, and quotation history.'
            : regStep === 'details'
            ? 'Register to manage your project enquiries and receive live architectural updates.'
            : `Enter the 6-digit verification code sent to ${email}`}
        </p>

        {/* Tab switch pills (only in signin or details step) */}
        {regStep === 'details' && (
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleTabChange('signin')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Reveal animation="scale-up" durationMs={400}>
          <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200/80 dark:border-slate-800">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB: SIGN IN */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                    <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: REGISTER - STEP 1 (DETAILS) */}
            {tab === 'register' && regStep === 'details' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      autoComplete="name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Company / College Name (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Innovate Solutions / NIT"
                      autoComplete="organization"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {sendingOtp && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                    <span>{sendingOtp ? 'Sending Verification Code...' : 'Continue & Verify Email'}</span>
                    {!sendingOtp && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: REGISTER - STEP 2 (OTP VERIFICATION) */}
            {tab === 'register' && regStep === 'otp' && (
              <form onSubmit={handleCompleteRegistration} className="space-y-5">
                <div className="text-center pb-1">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-xs">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a 6-digit confirmation code to:
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                    {email}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <p className="mt-2 text-[11px] text-slate-400 text-center">
                    Valid for 10 minutes. Check your spam folder if not in inbox.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                    <span>{loading ? 'Verifying & Creating Account...' : 'Verify & Complete Registration'}</span>
                    {!loading && <ShieldCheck className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => { setRegStep('details'); setError(null); }}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || sendingOtp}
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${sendingOtp ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              <span>Account creation is 100% optional. You can also </span>
              <Link to="/request-a-quote" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                submit a quote as a guest
              </Link>
              <span> or </span>
              <Link to="/track-enquiry" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                track with reference number
              </Link>.
            </div>
          </div>
        </Reveal>
      </div>

      {/* Server Error Popup Modal */}
      {serverErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Something Went Wrong</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {serverErrorPopup}
              </p>
            </div>
            <button
              onClick={() => setServerErrorPopup(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-500/25"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};