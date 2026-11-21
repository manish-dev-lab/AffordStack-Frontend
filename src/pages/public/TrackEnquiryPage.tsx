import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { enquiryApi } from '../../api/enquiryApi';
import { quotationApi } from '../../api/quotationApi';
import type { EnquiryTracking } from '../../types';
import { Reveal } from '../../components/common/Reveal';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  XCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  FolderKanban
} from 'lucide-react';

export const TrackEnquiryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const initialEmail = searchParams.get('email') || '';

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState<EnquiryTracking | null>(null);

  // Decision modal state
  const [decisionType, setDecisionType] = useState<'accept' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  const fetchTracking = async (ref: string, em: string) => {
    if (!ref.trim() || !em.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await enquiryApi.trackEnquiry({
        referenceNumber: ref.trim(),
        email: em.trim(),
      });
      setTracking(res);
      // Keep URL params in sync
      setSearchParams({ ref: ref.trim(), email: em.trim() }, { replace: true });
    } catch (err: unknown) {
      setTracking(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to locate enquiry with provided reference number and email. Please verify details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef && initialEmail) {
      fetchTracking(initialRef, initialEmail);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(referenceNumber, email);
  };

  const handleDecisionSubmit = async () => {
    if (!tracking?.activeQuotation?.secureToken || !decisionType) return;
    setActionLoading(true);
    setError(null);
    try {
      if (decisionType === 'accept') {
        await quotationApi.acceptPublicQuotation(tracking.activeQuotation.secureToken, remarks.trim() || undefined);
        setDecisionSuccess('Quotation Proposal Accepted! Our engineering team has been notified and will initiate project kickoff.');
      } else {
        await quotationApi.rejectPublicQuotation(tracking.activeQuotation.secureToken, remarks.trim());
        setDecisionSuccess('Proposal decision recorded. Our team will review your feedback and be in touch.');
      }
      setDecisionType(null);
      // Refresh status
      await fetchTracking(referenceNumber, email);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating proposal status');
    } finally {
      setActionLoading(false);
    }
  };

  const steps = [
    { title: 'Enquiry Received', desc: 'Requirements logged in system' },
    { title: 'Scope & Review', desc: 'Technical feasibility analyzed' },
    { title: 'Quotation Ready', desc: 'Architecture & cost proposal generated' },
    { title: 'Project Active', desc: 'Development in progress' },
    { title: 'Delivered', desc: 'Codebase, demo & docs handed over' },
  ];

  const currentStep = tracking ? Math.min(Math.max(tracking.stepIndex, 0), steps.length - 1) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <Reveal animation="fade-up" className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Clock className="w-3.5 h-3.5" /> Real-Time Service Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Track Your Project Enquiry
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Enter your unique reference number and email address to check the live progress of your project proposal and review quotation details.
          </p>
        </Reveal>

        {/* Search Card */}
        <Reveal animation="scale-up" delayMs={100}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ENQ-20261121-8F32"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm uppercase placeholder:font-sans placeholder:normal-case focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Tip: Your reference number was emailed when you submitted your quote request.
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? 'Locating Enquiry...' : 'Check Live Status'}
                </button>
              </div>
            </form>
          </div>
        </Reveal>

        {/* Error Alert */}
        {error && (
          <Reveal animation="fade-in">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to locate matching enquiry</p>
                <p className="text-xs mt-1 text-rose-700 dark:text-rose-300">{error}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Success Feedback Alert */}
        {decisionSuccess && (
          <Reveal animation="fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{decisionSuccess}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tracking Result View */}
        {tracking && (
          <div className="space-y-6">
            {/* Live Status Progress Bar */}
            <Reveal animation="fade-up">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
                      {tracking.referenceNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {tracking.projectTitle}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Submitted on {new Date(tracking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {tracking.statusDisplay}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Last updated {new Date(tracking.updatedAt || tracking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                    {steps.map((st, idx) => {
                      const isPast = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div
                          key={idx}
                          className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-3 sm:p-2 rounded-2xl transition-all ${
                            isCurrent
                              ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60'
                              : isPast
                              ? 'opacity-90'
                              : 'opacity-40'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                              isPast
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : isCurrent
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900/40 animate-pulse-subtle'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div className="text-left sm:text-center">
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {st.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Stage Description Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Current Status Note:</span>
                    <p className="mt-0.5 leading-relaxed">{tracking.statusDescription}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Project Execution & Milestones Progress */}
            {((tracking.milestones && tracking.milestones.length > 0) || tracking.progressPercentage !== undefined) && (
              <Reveal animation="fade-up" delayMs={120}>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        <FolderKanban className="w-3.5 h-3.5" /> Project Roadmap &amp; Execution
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                        {tracking.projectNumber ? `Project #${tracking.projectNumber}` : 'Sprint Development & Milestones'}
                      </h3>
                      {tracking.expectedCompletionDate && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          Target Completion: {new Date(tracking.expectedCompletionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar Badge */}
                    <div className="flex flex-col sm:items-end">
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                        {tracking.progressPercentage || 0}%
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Project Completed
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(Math.max(tracking.progressPercentage || 0, 5), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestone Item List */}
                  {tracking.milestones && tracking.milestones.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Milestone Deliverables &amp; Progress
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {tracking.milestones.map((m, idx) => (
                          <div
                            key={m.id || idx}
                            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                              m.isCompleted
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              m.isCompleted
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            }`}>
                              {m.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h5 className={`text-sm font-bold truncate ${
                                  m.isCompleted
                                    ? 'text-emerald-900 dark:text-emerald-200'
                                    : 'text-slate-900 dark:text-white'
                                }`}>
                                  {m.title}
                                </h5>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block shrink-0 ${
                                  m.isCompleted
                                    ? 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {m.isCompleted ? '✓ Completed' : `Due: ${new Date(m.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                                </span>
                              </div>
                              {m.description && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                  {m.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* Active Quotation Review & Decision Section */}
            {tracking.activeQuotation && (
              <Reveal animation="fade-up" delayMs={150}>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Official Quotation Proposal Available
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                        Quotation #{tracking.activeQuotation.quotationNumber}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Valid until {new Date(tracking.activeQuotation.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (tracking.activeQuotation?.secureToken) {
                            quotationApi.downloadPublicPdfBlob(
                              tracking.activeQuotation.secureToken,
                              tracking.activeQuotation.quotationNumber
                            );
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Scope of Work */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Scope of Work & Deliverables
                    </h4>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{tracking.activeQuotation.serviceDescription}</p>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                      {tracking.activeQuotation.deliverables}
                    </div>
                  </div>

                  {/* Line Items Table */}
                  {tracking.activeQuotation.items && tracking.activeQuotation.items.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Itemized Breakdown
                      </h4>
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="p-3">Deliverable Component</th>
                              <th className="p-3 text-center">Qty</th>
                              <th className="p-3 text-right">Unit Price</th>
                              <th className="p-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tracking.activeQuotation.items.map((it, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="p-3">
                                  <div className="font-bold text-slate-900 dark:text-white">{it.title}</div>
                                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">{it.description}</div>
                                </td>
                                <td className="p-3 text-center font-mono text-slate-700 dark:text-slate-300">{it.quantity}</td>
                                <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300">
                                  ₹{it.unitPrice.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                  ₹{it.totalPrice.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Pricing Financial Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-w-sm ml-auto space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Development Cost:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{tracking.activeQuotation.developmentCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {tracking.activeQuotation.additionalCost > 0 && (
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Additional Infrastructure:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₹{tracking.activeQuotation.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    {tracking.activeQuotation.taxAmount > 0 && (
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Tax ({tracking.activeQuotation.taxRate}%):</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ₹{tracking.activeQuotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                      <span>Total Investment:</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ₹{tracking.activeQuotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1">
                      <span>Advance Required:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{tracking.activeQuotation.advancePaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Balance on Completion:</span>
                      <span>₹{tracking.activeQuotation.remainingPaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Decision Actions Bar */}
                  {tracking.activeQuotation.status === 'Sent' || tracking.activeQuotation.status === 'Draft' ? (
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-4">
                      <button
                        onClick={() => { setDecisionType('reject'); setRemarks(''); }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Decline Proposal
                      </button>
                      <button
                        onClick={() => { setDecisionType('accept'); setRemarks(''); }}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Quotation Proposal
                      </button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                      This quotation proposal status is currently <strong className="text-slate-800 dark:text-slate-200">{String(tracking.activeQuotation.status)}</strong>.
                      {tracking.activeQuotation.responseRemarks && (
                        <p className="italic text-xs mt-1 text-slate-600 dark:text-slate-400">Remarks: "{tracking.activeQuotation.responseRemarks}"</p>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        )}

        {/* Decision Modal */}
        {decisionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {decisionType === 'accept' ? 'Accept Quotation Proposal' : 'Decline Quotation Proposal'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {decisionType === 'accept'
                  ? 'By accepting, you confirm approval of the scope and deliverables. Our engineering team will immediately initiate the project plan.'
                  : 'Please provide feedback regarding why this quotation does not fit your requirements.'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {decisionType === 'accept' ? 'Remarks or Kickoff Notes (Optional)' : 'Reason / Feedback *'}
                </label>
                <textarea
                  rows={3}
                  required={decisionType === 'reject'}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={decisionType === 'accept' ? 'Any special instructions before kickoff...' : 'Reason for declining...'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading || (decisionType === 'reject' && !remarks.trim())}
                  onClick={handleDecisionSubmit}
                  className={`h-10 shrink-0 px-6 rounded-xl text-white text-sm font-bold shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer ${
                    decisionType === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  {actionLoading ? 'Submitting...' : decisionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
