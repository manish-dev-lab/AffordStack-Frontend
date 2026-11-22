import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { userAuthApi } from '../../api/userAuthApi';
import { Reveal } from '../../components/common/Reveal';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  X,
  FileText,
  Lock,
  LogOut,
  FolderKanban,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, updateUser, setAuthSession, logout, refreshProfile } = useUserAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const alertRef = useRef<HTMLDivElement>(null);

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Email Change Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailStep, setEmailStep] = useState<'request' | 'verify'>('request');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [confirmingEmailChange, setConfirmingEmailChange] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Change Password State
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Feedback State
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber(user.phoneNumber || '');
      setCompanyName(user.companyName || '');
    }
  }, [user]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Scroll to alert when set
  useEffect(() => {
    if (statusMessage) {
      alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [statusMessage]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full Name is required.' });
      return;
    }

    setSavingProfile(true);
    setStatusMessage(null);
    try {
      const updated = await userAuthApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        companyName: companyName.trim() || undefined,
      });
      updateUser(updated);
      setIsEditingProfile(false);
      setStatusMessage({ type: 'success', text: 'Your profile information has been successfully updated.' });
      showToast({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setStatusMessage({ type: 'error', text: msg });
      showToast({ type: 'error', message: msg });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRequestEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid new email address.' });
      return;
    }
    if (newEmail.trim().toLowerCase() === user?.email.toLowerCase()) {
      setStatusMessage({ type: 'error', text: 'The new email must be different from your current email.' });
      return;
    }

    setSendingEmailOtp(true);
    setStatusMessage(null);
    try {
      await userAuthApi.requestEmailChangeOtp(newEmail.trim());
      setEmailStep('verify');
      setResendCooldown(60);
      showToast({ type: 'info', message: 'Verification code sent to your new email.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification code';
      setStatusMessage({ type: 'error', text: msg });
      showToast({ type: 'error', message: msg });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp.trim() || emailOtp.trim().length < 6) {
      setStatusMessage({ type: 'error', text: 'Please enter the 6-digit verification code.' });
      return;
    }

    setConfirmingEmailChange(true);
    setStatusMessage(null);
    try {
      const authRes = await userAuthApi.confirmEmailChange(newEmail.trim(), emailOtp.trim());
      setAuthSession(authRes);
      setShowEmailModal(false);
      setEmailStep('request');
      setNewEmail('');
      setEmailOtp('');
      setStatusMessage({
        type: 'success',
        text: 'Your email address has been successfully updated across all projects, enquiries, and account records.',
      });
      showToast({ type: 'success', message: 'Email updated successfully!' });
      refreshProfile();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired verification code';
      setStatusMessage({ type: 'error', text: msg });
      showToast({ type: 'error', message: msg });
    } finally {
      setConfirmingEmailChange(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setChangingPassword(true);
    setStatusMessage(null);
    try {
      await userAuthApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordSection(false);
      setStatusMessage({ type: 'success', text: 'Your password has been changed successfully.' });
      showToast({ type: 'success', message: 'Password updated successfully' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      setStatusMessage({ type: 'error', text: msg });
      showToast({ type: 'error', message: msg });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Status Message Banner with Ref for Auto-Scroll */}
        {statusMessage && (
          <div
            ref={alertRef}
            className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-medium flex-1">{statusMessage.text}</div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profile Card Header */}
        <Reveal animation="fade-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-md shadow-blue-500/25">
                  {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {user?.fullName || 'Client Profile'}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your client contact profile, email address, and security preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Personal &amp; Organization Details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Used for formal quotations, project proposals, and delivery notifications.
                  </p>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Details
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      if (user) {
                        setFullName(user.fullName || '');
                        setPhoneNumber(user.phoneNumber || '');
                        setCompanyName(user.companyName || '');
                      }
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-1.5"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full legal name"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          inputMode="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Company / College Name (Optional)
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Tech Solutions / NIT Rourkela"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                        </>
                      ) : (
                        'Save Profile Details'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {user?.fullName || 'Not specified'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {user?.phoneNumber || 'Not specified'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company / College</span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {user?.companyName || 'Not specified'}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Email Section (With OTP Change Flow) */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {user?.email}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active &amp; Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        All quotation proposals, invoice receipts, and project milestone updates are sent to this address.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailModal(true);
                      setEmailStep('request');
                      setNewEmail('');
                      setEmailOtp('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Change Email Address
                  </button>
                </div>
              </div>

              {/* Security & Password Section */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Account Security
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Protect your account with a secure password.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> {showPasswordSection ? 'Hide Form' : 'Change Password'}
                  </button>
                </div>

                {showPasswordSection && (
                  <form onSubmit={handleChangePassword} className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-hidden"
                            aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-hidden"
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Re-type new password"
                            className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-hidden"
                            aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {changingPassword ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating Password...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Change Email OTP Verification Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Change Account Email
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Step {emailStep === 'request' ? '1: Enter New Email' : '2: Verify OTP Code'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {emailStep === 'request' ? (
                <form onSubmit={handleRequestEmailOtp} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-200">
                    A 6-digit verification code will be sent to the new email address. Once confirmed, all your active enquiries, projects, and proposals will sync automatically to the new email.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      New Email Address *
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingEmailOtp}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {sendingEmailOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending Code...
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmEmailChange} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-200">
                    We sent a 6-digit verification code to <strong>{newEmail}</strong>. Please enter the code below:
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.5em] text-xl font-bold font-mono px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || sendingEmailOtp}
                      onClick={handleRequestEmailOtp}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${sendingEmailOtp ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Verification Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmailStep('request')}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={confirmingEmailChange || emailOtp.length < 6}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {confirmingEmailChange ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                        </>
                      ) : (
                        'Confirm & Update Email'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
