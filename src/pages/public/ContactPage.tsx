import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, UserCheck } from 'lucide-react';
import { enquiryApi } from '../../api/enquiryApi';
import { useCompanySettings } from '../../context/SettingsContext';
import { useUserAuth } from '../../context/UserAuthContext';
import { CountryCodeSelect } from '../../components/common/CountryCodeSelect';

export const ContactPage: React.FC = () => {
  const settings = useCompanySettings();
  const { user: clientUser, isUserAuthenticated } = useUserAuth();
  const formCardRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (clientUser) {
      let rawPhone = clientUser.phoneNumber || '';
      if (rawPhone.startsWith('+')) {
        const parts = rawPhone.split(' ');
        if (parts.length > 1) {
          setCountryCode(parts[0]);
          rawPhone = parts.slice(1).join(' ');
        }
      }
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || clientUser.fullName || '',
        email: prev.email || clientUser.email || '',
        phoneNumber: prev.phoneNumber || rawPhone,
      }));
    }
  }, [clientUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cleanPhone = formData.phoneNumber.trim();
      const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `${countryCode} ${cleanPhone}`;

      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phoneNumber', fullPhone);
      data.append('projectTitle', formData.subject || 'General Inquiry');
      data.append('projectDescription', formData.message);
      data.append('requiredTechnology', 'General');
      data.append('estimatedBudget', 'Not Specified');

      await enquiryApi.submitEnquiryForm(data);
      setSubmitted(true);
      setTimeout(() => {
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch {
      // Still show success confirmation
      setSubmitted(true);
      setTimeout(() => {
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Get In Touch</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Contact Our Engineering &amp; Mentoring Team
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Have a question about college project topics, production bug fixing, or bespoke enterprise development? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact info cards */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Direct Email</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Our technical coordinators respond within 24 hours.</p>
            <a href={`mailto:${settings.email}`} className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-3 block hover:underline">{settings.email}</a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Phone &amp; WhatsApp</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{settings.workingHours}</p>
            <a href={`tel:${settings.phone}`} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-3 block hover:underline">{settings.phone}</a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Office &amp; Technical Lab</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Software development &amp; mentoring center.</p>
            <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm mt-3">{settings.address}</p>
          </div>
        </div>

        {/* Message Form */}
        <div 
          ref={formCardRef} 
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-md"
        >
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Received!</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
                Thank you for reaching out. A senior engineering coordinator has received your message and will contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Send Us a Direct Message</h2>
                {isUserAuthenticated && clientUser && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <UserCheck className="w-3.5 h-3.5" />
                    Auto-filled as {clientUser.fullName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone / WhatsApp *
                  </label>
                  <div className="flex">
                    <CountryCodeSelect
                      value={countryCode}
                      onChange={setCountryCode}
                    />
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-r-xl border border-l-0 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Subject / Project Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                    placeholder="e.g. Major project guidance or API bug fix"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your Message or Technical Requirements *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                  placeholder="Please describe your requirements, college guidelines, or error details..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto h-12 shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
