import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  UserCircle,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Calendar,
  Lock,
} from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError('Please provide current and new password');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully! Keep your new password secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserCircle className="w-6 h-6 text-blue-600" />
          Admin Profile & Security
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your administrative credentials and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md mb-4">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{user?.fullName || 'Super Administrator'}</h2>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {user?.role || 'SuperAdmin'}
          </span>

          <div className="w-full mt-6 space-y-3 text-left border-t border-slate-100 pt-5 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">Username:</span>
              <span className="font-semibold text-slate-800 text-xs ml-auto">{user?.username || 'admin'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">Email:</span>
              <span className="font-semibold text-slate-800 text-xs ml-auto truncate max-w-[130px]">
                {user?.email || 'admin@softwareservices.com'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs text-slate-400">Auth Method:</span>
              <span className="font-semibold text-slate-800 text-xs ml-auto">JWT Bearer</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <KeyRound className="w-5 h-5 text-blue-600" />
            Change Admin Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters, uppercase and numbers"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto h-11 shrink-0 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {submitting && <LoadingSpinner size="sm" />}
                Update Password
              </button>
            </div>
          </form>

          {/* Security Recommendations */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800">Security Best Practices:</div>
            <p>• Avoid reusing passwords across different services.</p>
            <p>• Passwords are hashed using PBKDF2 with SHA-256 and unique per-user cryptographic salts.</p>
            <p>• Tokens expire in 24 hours. You will need to re-login after password alteration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
