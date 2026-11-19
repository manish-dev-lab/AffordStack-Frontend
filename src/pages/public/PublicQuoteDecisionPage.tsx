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
  AlertCircle
} from 'lucide-react';

export const PublicQuoteDecisionPage: React.FC = () => {
  const { secureToken } = useParams<{ secureToken: string }>();
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
      alert(err instanceof Error ? err.message : 'Error submitting decision');
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
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Quotation Link Not Found</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto">{error || 'This link may have expired or is invalid.'}</p>
        <div className="pt-4">
          <Link to="/" className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl">
            Return to Homepage
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
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Quotation Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Proposal</span>
              <Badge status={quotation.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quotation #{quotation.quotationNumber}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Prepared for {quotation.customerName} {quotation.companyName && `(${quotation.companyName})`}</p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href={downloadPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </div>
        </div>

        {/* Project Scope & Deliverables */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Service Description</h2>
            <div className="text-base font-semibold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {quotation.serviceDescription}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scope &amp; Deliverables</h2>
            <div className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed">
              {quotation.deliverables}
            </div>
          </div>

          {/* Items breakdown if present */}
          {quotation.items && quotation.items.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Itemized Deliverables</h2>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="p-3.5">Deliverable</th>
                      <th className="p-3.5 text-center">Qty</th>
                      <th className="p-3.5 text-right">Unit Price</th>
                      <th className="p-3.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotation.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                          {item.description && <div className="text-xs text-slate-500">{item.description}</div>}
                        </td>
                        <td className="p-3.5 text-center">{item.quantity}</td>
                        <td className="p-3.5 text-right">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3.5 text-right font-semibold">₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Terms Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timelines &amp; Validity</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Expected Delivery: <strong>{new Date(quotation.expectedDeliveryDate).toLocaleDateString()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Offer Valid Until: <strong>{new Date(quotation.validUntil).toLocaleDateString()}</strong></span>
              </div>
            </div>

            {quotation.termsAndConditions && (
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Terms &amp; Payment Milestones</div>
                <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {quotation.termsAndConditions}
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Financial Breakdown</h2>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Development Cost:</span>
              <span className="font-semibold text-slate-900">₹{quotation.developmentCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {quotation.additionalCost > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Additional Infrastructure:</span>
                <span className="font-semibold text-slate-900">₹{quotation.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {quotation.taxAmount > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax ({quotation.taxRate}%):</span>
                <span className="font-semibold text-slate-900">₹{quotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Investment:</span>
              <span className="text-blue-600">₹{quotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-800">
              <span>Advance Payment Required:</span>
              <span className="text-emerald-700">₹{quotation.advancePaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Balance Upon Delivery:</span>
              <span>₹{quotation.remainingPaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Decision Actions Bar */}
        {!isResponded ? (
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              onClick={() => { setDecisionType('reject'); setRemarks(''); }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Decline Proposal
            </button>
            <button
              onClick={() => { setDecisionType('accept'); setRemarks(''); }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Quotation Proposal
            </button>
          </div>
        ) : (
          <div className="pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            This quotation proposal has already been marked as <strong>{String(quotation.status)}</strong>.
            {quotation.responseRemarks && <p className="italic text-xs mt-1">Remarks: "{quotation.responseRemarks}"</p>}
          </div>
        )}
      </div>

      {/* Decision Dialog Modal */}
      {decisionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900">
              {decisionType === 'accept' ? 'Accept Quotation Proposal' : 'Decline Quotation Proposal'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {decisionType === 'accept'
                ? 'By accepting, you confirm approval of the scope and deliverables. Our engineering team will immediately initiate the project plan.'
                : 'Please provide any feedback or constraints regarding why this quotation does not fit your requirements.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {decisionType === 'accept' ? 'Remarks or Kickoff Notes (Optional)' : 'Reason / Feedback *'}
              </label>
              <textarea
                rows={3}
                required={decisionType === 'reject'}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={decisionType === 'accept' ? 'Any special instructions before kickoff...' : 'Reason for declining...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDecisionType(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || (decisionType === 'reject' && !remarks.trim())}
                onClick={handleDecisionSubmit}
                className={`px-6 py-2 rounded-xl text-white text-sm font-bold shadow-md disabled:opacity-50 ${
                  decisionType === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionLoading ? 'Submitting...' : decisionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
