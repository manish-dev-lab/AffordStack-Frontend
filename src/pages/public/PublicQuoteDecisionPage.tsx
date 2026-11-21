import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quotationApi } from '../../api/quotationApi';
import type { PublicQuotation } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const PublicQuoteDecisionPage: React.FC = () => {
  const params = useParams<{ secureToken?: string; token?: string }>();
  const secureToken = params.secureToken || params.token || '';
  const [quotation, setQuotation] = useState<PublicQuotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decision Modal States
  const [decisionType, setDecisionType] = useState<'accept' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!secureToken) return;
    setLoading(true);
    quotationApi.getPublicQuotation(secureToken)
      .then(setQuotation)
      .catch((err) => setError(err.message || 'Quotation not found or link has expired.'))
      .finally(() => setLoading(false));
  }, [secureToken]);

  const handleDecisionSubmit = async () => {
    if (!secureToken || !decisionType) return;
    setActionLoading(true);
    try {
      if (decisionType === 'accept') {
        await quotationApi.acceptPublicQuotation(secureToken, remarks);
        setActionSuccess('Quotation accepted successfully! Our project team has been notified and project setup has started.');
        setQuotation((prev) => prev ? { ...prev, status: 'Accepted', responseRemarks: remarks } : null);
      } else {
        await quotationApi.rejectPublicQuotation(secureToken, remarks);
        setActionSuccess('You have declined this quotation proposal. Your remarks have been sent to our team.');
        setQuotation((prev) => prev ? { ...prev, status: 'Rejected', responseRemarks: remarks } : null);
      }
      setDecisionType(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting decision');
    } finally {
      setActionLoading(false);
    }
  };

  const downloadPdfUrl = secureToken 
    ? `${import.meta.env.VITE_API_BASE_URL || '/api'}/public/quotations/${secureToken}/pdf`
    : '#';

  if (loading) {
    return <LoadingSpinner size="lg" text="Retrieving secure quotation proposal..." className="min-h-[50vh]" />;
  }

  if (error || !quotation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quotation Link Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">{error || 'This link may have expired or is invalid.'}</p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all">
            Return to Homepage
          </Link>
          <Link to="/track-enquiry" className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold px-6 py-2.5 rounded-xl transition-all">
            Track Enquiry
          </Link>
        </div>
      </div>
    );
  }

  const isResponded = quotation.status === 'Accepted' || quotation.status === 'Rejected' || quotation.status === 4 || quotation.status === 5;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      {/* Action banner if already responded */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Quotation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Proposal</span>
              <Badge status={quotation.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Quotation #{quotation.quotationNumber}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Prepared for {quotation.customerName} {quotation.companyName && `(${quotation.companyName})`}</p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (secureToken) {
                  quotationApi.downloadPublicPdfBlob(secureToken, quotation.quotationNumber);
                }
              }}
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Project Scope & Deliverables */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Service Description</h2>
            <div className="text-base font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {quotation.serviceDescription}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scope &amp; Deliverables</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
              {quotation.deliverables}
            </div>
          </div>

          {/* Items breakdown if present */}
          {quotation.items && quotation.items.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Itemized Deliverables</h2>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 sm:hidden font-medium">
                  &larr; Swipe horizontally &rarr;
                </span>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto touch-pan-x overscroll-contain shadow-xs">
                <table className="w-full text-left text-sm min-w-[560px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    <tr>
                      <th className="p-3.5 min-w-[220px]">Deliverable</th>
                      <th className="p-3.5 text-center min-w-[60px]">Qty</th>
                      <th className="p-3.5 text-right min-w-[120px]">Unit Price</th>
                      <th className="p-3.5 text-right min-w-[120px]">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {quotation.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.title}</div>
                          {item.description && <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>}
                        </td>
                        <td className="p-3.5 text-center text-slate-700 dark:text-slate-300">{item.quantity}</td>
                        <td className="p-3.5 text-right text-slate-700 dark:text-slate-300">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3.5 text-right font-semibold text-slate-900 dark:text-white">₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Terms Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timelines &amp; Validity</h2>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Expected Delivery: <strong className="text-slate-900 dark:text-white">{new Date(quotation.expectedDeliveryDate).toLocaleDateString()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Offer Valid Until: <strong className="text-slate-900 dark:text-white">{new Date(quotation.validUntil).toLocaleDateString()}</strong></span>
              </div>
            </div>

            {quotation.termsAndConditions && (
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Terms &amp; Payment Milestones</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {quotation.termsAndConditions}
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Financial Breakdown</h2>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Development Cost:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{quotation.developmentCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {quotation.additionalCost > 0 && (
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Additional Infrastructure:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{quotation.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {quotation.taxAmount > 0 && (
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Tax ({quotation.taxRate}%):</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{quotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
              <span>Total Investment:</span>
              <span className="text-blue-600 dark:text-blue-400">₹{quotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Advance Payable:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{quotation.advancePaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Remaining Balance:</span>
              <span>₹{quotation.remainingPaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Decision Actions Bar */}
        {!isResponded ? (
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
            This quotation proposal has already been marked as <strong className="text-slate-800 dark:text-slate-200">{String(quotation.status)}</strong>.
            {quotation.responseRemarks && <p className="italic text-xs mt-1 text-slate-600 dark:text-slate-400">Remarks: "{quotation.responseRemarks}"</p>}
          </div>
        )}
      </div>

      {/* Decision Dialog Modal */}
      {decisionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {decisionType === 'accept' ? 'Accept Quotation Proposal' : 'Decline Quotation Proposal'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {decisionType === 'accept'
                ? 'By accepting, you confirm approval of the scope and deliverables. Our engineering team will immediately initiate the project plan.'
                : 'Please provide any feedback or constraints regarding why this quotation does not fit your requirements.'}
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
  );
};
