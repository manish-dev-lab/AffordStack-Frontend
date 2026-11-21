import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { configurationApi } from '../../api/configurationApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useCompanySettings } from '../../context/SettingsContext';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Server,
  Key,
  Bell,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Lock
} from 'lucide-react';
import type { TokenConfig, EmailConfig, WebsiteConfig } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { refreshSettings } = useCompanySettings();
  const [activeTab, setActiveTab] = useState<'system' | 'company'>('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // System Configurations state
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    tokenTimeoutMinutes: 60,
    refreshTokenDays: 7,
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    emailsEnabled: true,
    sendCustomerNotifications: true,
    sendAdminNotifications: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    username: 'softwareservices2001@gmail.com',
    password: '••••••••',
    fromEmail: 'softwareservices2001@gmail.com',
    fromName: 'Software Services',
    adminNotificationEmail: 'softwareservices2001@gmail.com',
    enableSsl: true,
  });

  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
    siteName: 'Software Services Platform',
    supportEmail: 'manishkiran8464@gmail.com',
    supportPhone: '+91 8464992957',
    contactAddress: 'Rc puram Hyd',
    maintenanceMode: false,
  });

  // Company / Contact settings
  const [companySettings, setCompanySettings] = useState({
    'Company:Name': 'Soft Solutions',
    'Company:Email': 'manishkiran8464@gmail.com',
    'Company:Phone': '+91 8464992957',
    'Company:Address': 'Rc puram Hyd',
    'Company:WorkingHours': 'Mon - Sat: 9:00 AM - 8:00 PM IST',
    'Company:WhatsApp': '+91 8464992957',
    'Finance:Currency': 'INR (₹)',
    'Finance:DefaultTaxPercent': '18',
    'Quotation:DefaultValidityDays': '10',
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [tCfg, eCfg, wCfg, cSettings] = await Promise.all([
        configurationApi.getTokenConfig().catch(() => ({ tokenTimeoutMinutes: 60, refreshTokenDays: 7 })),
        configurationApi.getEmailConfig().catch(() => ({
          emailsEnabled: true,
          sendCustomerNotifications: true,
          sendAdminNotifications: true,
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          username: '',
          fromEmail: '',
          fromName: 'Software Services',
          adminNotificationEmail: '',
          enableSsl: true,
        })),
        configurationApi.getWebsiteConfig().catch(() => ({
          siteName: 'Software Services Platform',
          supportEmail: '',
          supportPhone: '',
          contactAddress: '',
          maintenanceMode: false,
        })),
        contentApi.getSettings().catch(() => ({})),
      ]);

      setTokenConfig(tCfg);
      setEmailConfig(eCfg);
      setWebsiteConfig(wCfg);

      setCompanySettings((prev) => ({
        ...prev,
        ...cSettings,
      }));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveSystemConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await configurationApi.updateBatch({
        TokenConfig: JSON.stringify(tokenConfig),
        EmailConfig: JSON.stringify(emailConfig),
        WebsiteConfig: JSON.stringify(websiteConfig),
      });

      setSuccessMsg('System security, token, and email configurations updated in database successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating system configurations');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await contentApi.updateSettingsBatch(companySettings);
      await refreshSettings();
      setSuccessMsg('Website and company settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating company settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-blue-600" />
            Website &amp; System Configurations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure dynamic database settings, JWT session durations, email notification toggles, and company coordinates.
          </p>
        </div>

        {/* Tab switch pills */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System &amp; Email Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'company'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Company &amp; General
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" text="Loading system configurations..." className="py-20" />
      ) : activeTab === 'system' ? (
        /* SYSTEM & EMAIL SECURITY TAB */
        <form onSubmit={handleSaveSystemConfigs} className="space-y-6">
          {/* Card 1: Email Notification Controls */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Email Dispatch &amp; Notification Toggles
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Control outbound customer and administrative emails in real-time without restarting the server.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Master Email Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Master Email Sending Switch
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                      emailConfig.emailsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {emailConfig.emailsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    When turned off, all outbound emails are completely paused and safely skipped.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailConfig({ ...emailConfig, emailsEnabled: !emailConfig.emailsEnabled })}
                  className="cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {emailConfig.emailsEnabled ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Customer Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Send Customer Acknowledgement Emails
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Automatically dispatch reference number and confirmation to customers when they submit an enquiry.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailConfig({ ...emailConfig, sendCustomerNotifications: !emailConfig.sendCustomerNotifications })}
                  className="cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {emailConfig.sendCustomerNotifications ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Admin Alerts Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Send Admin Real-Time Alert Emails
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Notify administrators whenever a new quotation enquiry or proposal acceptance is received.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailConfig({ ...emailConfig, sendAdminNotifications: !emailConfig.sendAdminNotifications })}
                  className="cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {emailConfig.sendAdminNotifications ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* SMTP Host and Credentials */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                SMTP Mail Server Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Admin Notification Email
                  </label>
                  <input
                    type="email"
                    value={emailConfig.adminNotificationEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, adminNotificationEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: JWT Session & Token Lifespan */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  JWT Session Management &amp; Timeout
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure session duration for logged-in administrators and customer accounts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Session Token Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="10080"
                  required
                  value={tokenConfig.tokenTimeoutMinutes}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, tokenTimeoutMinutes: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  e.g., 60 = 1 hour session, 1440 = 24 hours. Users will remain logged in during this interval.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Refresh Token Validity (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={tokenConfig.refreshTokenDays}
                  onChange={(e) => setTokenConfig({ ...tokenConfig, refreshTokenDays: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Controls persistent remember-me expiration duration.
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Operational & Maintenance Mode */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Maintenance Mode
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows administrators to perform system maintenance while displaying a friendly status notice.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWebsiteConfig({ ...websiteConfig, maintenanceMode: !websiteConfig.maintenanceMode })}
                className="cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
              >
                {websiteConfig.maintenanceMode ? (
                  <ToggleRight className="w-10 h-10 text-rose-600" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
              <span>{saving ? 'Saving Configurations...' : 'Save System Configurations'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* COMPANY & GENERAL TAB */
        <form onSubmit={handleSaveCompanySettings} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Company Contact &amp; Public Channels
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Displayed on website navbar, footer, PDF quotations, and customer correspondence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Trading Name
                </label>
                <input
                  type="text"
                  required
                  value={companySettings['Company:Name']}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:Name': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Public Inquiries Email
                </label>
                <input
                  type="email"
                  required
                  value={companySettings['Company:Email']}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:Email': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={companySettings['Company:Phone']}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:Phone': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Support
                </label>
                <input
                  type="text"
                  value={companySettings['Company:WhatsApp']}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:WhatsApp': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={companySettings['Company:WorkingHours'] || ''}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:WorkingHours': e.target.value })}
                  placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM IST"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Physical / Lab Address
                </label>
                <input
                  type="text"
                  value={companySettings['Company:Address']}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Company:Address': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card: Financial Currency, Tax & Quotation Settings */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Currency, Tax &amp; Quotation Defaults
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Default currency format, tax rates, and validity periods across all generated quotations and PDF documents.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Platform Base Currency *
                </label>
                <select
                  value={companySettings['Finance:Currency'] || 'INR (₹)'}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Finance:Currency': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  <option value="INR (₹)">INR - Indian Rupee (₹)</option>
                  <option value="USD ($)">USD - US Dollar ($)</option>
                  <option value="EUR (€)">EUR - Euro (€)</option>
                  <option value="GBP (£)">GBP - British Pound (£)</option>
                  <option value="AED (AED)">AED - UAE Dirham (AED)</option>
                  <option value="SGD (S$)">SGD - Singapore Dollar (S$)</option>
                  <option value="AUD (A$)">AUD - Australian Dollar (A$)</option>
                  <option value="CAD (C$)">CAD - Canadian Dollar (C$)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used in live quotes, invoices, and website pricing.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Default Tax / GST Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={companySettings['Finance:DefaultTaxPercent'] || '18'}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Finance:DefaultTaxPercent': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Standard tax percentage applied when creating proposals.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Quotation Validity (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={companySettings['Quotation:DefaultValidityDays'] || '10'}
                  onChange={(e) => setCompanySettings({ ...companySettings, 'Quotation:DefaultValidityDays': e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Number of days before an issued quotation proposal expires.
                </span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
              <span>{saving ? 'Saving Settings...' : 'Save Company Coordinates'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
