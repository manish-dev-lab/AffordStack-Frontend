import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
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
  Info,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formFields, setFormFields] = useState({
    'Company:Name': 'Your Business Name',
    'Company:Email': 'your-email@example.com',
    'Company:Phone': '+91XXXXXXXXXX',
    'Company:Address': 'Tech Park, Bangalore / Hyderabad, India',
    'Company:WorkingHours': 'Mon - Sat: 9:00 AM - 8:00 PM IST',
    'Company:WhatsApp': '+91XXXXXXXXXX',
    'Finance:Currency': 'USD ($)',
    'Finance:DefaultTaxPercent': '18',
    'Quotation:DefaultValidityDays': '15',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getSettings();
      setSettings(res);
      setFormFields((prev) => ({
        ...prev,
        ...res,
      }));
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveIndividual = async (key: string, value: string) => {
    try {
      setSavingKey(key);
      setErrorMsg(null);
      await contentApi.updateSetting(key, value);
      setSuccessMsg(`Setting '${key}' saved successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to update ${key}`);
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingKey('ALL');
      setErrorMsg(null);
      for (const [k, v] of Object.entries(formFields)) {
        await contentApi.updateSetting(k, v);
      }
      setSuccessMsg('All configuration settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
      loadSettings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-slate-700" />
            Website & Company Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure business contact coordinates, quotation policies, and system parameters.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={savingKey === 'ALL'}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:opacity-50 transition-colors"
        >
          {savingKey === 'ALL' ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="w-5 h-5 text-blue-600" />
                Business Identity & Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formFields['Company:Name']}
                    onChange={(e) => setFormFields({ ...formFields, 'Company:Name': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Support / Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={formFields['Company:Email']}
                    onChange={(e) => setFormFields({ ...formFields, 'Company:Email': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formFields['Company:Phone']}
                    onChange={(e) => setFormFields({ ...formFields, 'Company:Phone': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={formFields['Company:WhatsApp']}
                    onChange={(e) => setFormFields({ ...formFields, 'Company:WhatsApp': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Office Address / Location
                </label>
                <input
                  type="text"
                  value={formFields['Company:Address']}
                  onChange={(e) => setFormFields({ ...formFields, 'Company:Address': e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={formFields['Company:WorkingHours']}
                  onChange={(e) => setFormFields({ ...formFields, 'Company:WorkingHours': e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Financial & Quotation Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Quotation & Billing Policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Currency Display
                  </label>
                  <select
                    value={formFields['Finance:Currency']}
                    onChange={(e) => setFormFields({ ...formFields, 'Finance:Currency': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Default Tax / GST (%)
                  </label>
                  <input
                    type="number"
                    value={formFields['Finance:DefaultTaxPercent']}
                    onChange={(e) => setFormFields({ ...formFields, 'Finance:DefaultTaxPercent': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quote Validity (Days)
                  </label>
                  <input
                    type="number"
                    value={formFields['Quotation:DefaultValidityDays']}
                    onChange={(e) => setFormFields({ ...formFields, 'Quotation:DefaultValidityDays': e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            {/* SMTP Guide Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <Server className="w-5 h-5" />
                SMTP & Outbox Architecture
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The platform uses a resilient transactional email outbox mechanism. Emails are persisted to the database and processed asynchronously via <code className="text-blue-300">EmailOutboxProcessor</code> background worker.
              </p>
              <div className="bg-slate-800/80 rounded-lg p-3 text-xs space-y-2 border border-slate-700">
                <div className="flex justify-between text-slate-400">
                  <span>Provider:</span>
                  <span className="font-mono text-white">MailKit / SMTP</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fallback:</span>
                  <span className="font-mono text-emerald-400">Active (Logs if unavail)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Default Host:</span>
                  <span className="font-mono text-white">smtp.gmail.com (587)</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                * To activate live mail delivery, configure <code className="text-slate-300">SmtpSettings</code> in <code className="text-slate-300">appsettings.json</code>.
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Info className="w-4 h-4 text-blue-600" />
                Production Readiness Tip
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                All changes to company phone, address, and email immediately update across the public contact page, footer, header, and quotation proposal documents.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
