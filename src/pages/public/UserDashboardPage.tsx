import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { userAuthApi } from '../../api/userAuthApi';
import { paymentApi } from '../../api/paymentApi';
import { openCashfreeCheckout } from '../../utils/cashfree';
import type { UserEnquirySummary, ProjectMilestone, CustomerPayment } from '../../types';
import { Reveal } from '../../components/common/Reveal';
import { Badge } from '../../components/common/Badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Search,
  User,
  LogOut,
  FolderKanban,
  FileSpreadsheet,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  Receipt,
  Download,
  ShieldCheck,
  Printer,
  X,
  Lock
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, logout, refreshProfile } = useUserAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'projects' | 'payments'>('projects');
  const [enquiries, setEnquiries] = useState<UserEnquirySummary[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Milestone payment state
  const [payingMilestone, setPayingMilestone] = useState<ProjectMilestone | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerPayment | null>(null);

  const loadData = () => {
    setLoading(true);
    userAuthApi.getMyEnquiries()
      .then(setEnquiries)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load your enquiries'))
      .finally(() => setLoading(false));

    refreshProfile();
  };

  const loadPayments = () => {
    setLoadingPayments(true);
    paymentApi.getMyPayments()
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoadingPayments(false));
  };

  useEffect(() => {
    loadData();
    loadPayments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  const handlePayMilestoneClick = (milestone: ProjectMilestone) => {
    setPayingMilestone(milestone);
    setPaymentError(null);
    setPaymentSuccess(null);
  };

  const handleConfirmMilestonePayment = async () => {
    if (!payingMilestone) return;
    setIsProcessingPayment(true);
    setPaymentError(null);
    try {
      const order = await paymentApi.createMilestoneOrder(payingMilestone.id);
      if (!order.paymentSessionId) {
        throw new Error('Cashfree payment session ID not returned.');
      }

      await openCashfreeCheckout({
        paymentSessionId: order.paymentSessionId,
        environment: order.environment,
        redirectTarget: '_modal'
      });

      // Verify payment on backend
      const verifyRes = await paymentApi.verifyPayment(order.orderId);
      if (verifyRes.success) {
        setPaymentSuccess(`Payment of ₹${verifyRes.amount.toLocaleString('en-IN')} for '${payingMilestone.title}' successfully verified!`);
        setPayingMilestone(null);
        loadData();
        loadPayments();
      } else {
        setPaymentError(`Payment status: ${verifyRes.message || 'Payment not completed.'}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing Cashfree checkout';
      setPaymentError(msg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <Reveal animation="fade-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-extrabold shadow-md shadow-blue-500/25">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Customer Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Welcome back, {user?.fullName || 'Valued Client'}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/user/profile"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link
                to="/request-a-quote"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Enquiry
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </Reveal>

        {/* Global Feedback Banner */}
        {paymentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{paymentSuccess}</span>
            </div>
            <button onClick={() => setPaymentSuccess(null)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Reveal animation="fade-up" delayMs={50}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {enquiries.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Submitted project requirements</p>
            </div>
          </Reveal>

          <Reveal animation="fade-up" delayMs={100}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Quotations</span>
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {enquiries.filter(e => e.quotationNumber).length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Proposals generated &amp; ready</p>
            </div>
          </Reveal>

          <Reveal animation="fade-up" delayMs={150}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Payments Recorded</span>
                <Receipt className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {payments.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Cashfree transaction receipts</p>
            </div>
          </Reveal>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Enquiries &amp; Projects
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Payment Receipts &amp; Invoices ({payments.length})
          </button>
        </div>

        {/* TAB 1: ENQUIRIES & PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Active Projects & Development Milestones Cards */}
            {enquiries.some(e => (e.milestones && e.milestones.length > 0) || e.progressPercentage !== undefined || e.projectNumber) && (
              <Reveal animation="fade-up" delayMs={180}>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        <FolderKanban className="w-3.5 h-3.5" /> Active Projects &amp; Live Roadmaps
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                        Ongoing Project Execution &amp; Milestones
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enquiries
                      .filter(e => (e.milestones && e.milestones.length > 0) || e.progressPercentage !== undefined || e.projectNumber)
                      .map(enq => (
                        <div
                          key={enq.id}
                          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-4"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {enq.projectNumber || enq.referenceNumber}
                                </span>
                                <Badge status={enq.effectiveStatus || (enq.projectStatus ? String(enq.projectStatus) : (enq.quotationStatus === 'Accepted' ? 'Accepted' : enq.status))} />
                              </div>
                              <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1 line-clamp-1">
                                {enq.projectTitle}
                              </h3>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                {enq.progressPercentage || 0}%
                              </span>
                              <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Completed
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(Math.max(enq.progressPercentage || 0, 5), 100)}%` }}
                            />
                          </div>

                          {/* Milestones list with Cashfree Payment Integration */}
                          {enq.milestones && enq.milestones.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Milestones &amp; Payments ({enq.milestones.filter(m => m.isCompleted).length}/{enq.milestones.length})
                              </span>
                              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {enq.milestones.map((m, idx) => (
                                  <div
                                    key={m.id || idx}
                                    className={`p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
                                      m.isCompleted
                                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {m.isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      ) : (
                                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                      )}
                                      <div className="truncate">
                                        <span className="font-semibold block truncate">{m.title}</span>
                                        <span className="text-[10px] text-slate-400 block">
                                          Due: {new Date(m.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Financial Milestone Payment Action */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                      {m.amount > 0 && (
                                        <>
                                          {m.isPaid ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                              Paid ₹{m.amount.toLocaleString('en-IN')}
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => handlePayMilestoneClick(m)}
                                              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                                            >
                                              <CreditCard className="w-3 h-3" />
                                              Pay ₹{m.amount.toLocaleString('en-IN')}
                                            </button>
                                          )}
                                        </>
                                      )}

                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                        m.isCompleted
                                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                      }`}>
                                        {m.isCompleted ? 'Done' : 'In Progress'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between text-xs">
                            {enq.expectedCompletionDate && (
                              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                Target: {new Date(enq.expectedCompletionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                            <Link
                              to={`/track-enquiry?ref=${enq.referenceNumber}&email=${encodeURIComponent(user?.email || '')}`}
                              className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 ml-auto"
                            >
                              Detailed Tracker &rarr;
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Enquiries & Quotations Table Section */}
            <Reveal animation="fade-up" delayMs={200}>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      My Enquiries &amp; Quotations History
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Track status, review formal proposals, and inspect deliverables.
                    </p>
                  </div>
                  <Link
                    to="/track-enquiry"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" /> Public Tracker
                  </Link>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span className="text-xs font-medium">Retrieving your project records...</span>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-rose-600 text-xs font-medium">
                    {error}
                  </div>
                ) : enquiries.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No project enquiries found</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                        You haven't submitted any quotation requests yet. Request your first instant roadmap today!
                      </p>
                    </div>
                    <Link
                      to="/request-a-quote"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                    >
                      <Plus className="w-4 h-4" /> Request a Custom Quote
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 uppercase font-bold text-[11px] tracking-wider">
                        <tr>
                          <th className="p-4">Reference #</th>
                          <th className="p-4">Project Title</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Quotation &amp; Advance</th>
                          <th className="p-4">Date Submitted</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {enq.referenceNumber}
                            </td>
                            <td className="p-4 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {enq.projectTitle}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                {enq.requiredTechnology} &bull; {enq.estimatedBudget}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge status={enq.effectiveStatus || (enq.projectStatus ? String(enq.projectStatus) : (enq.quotationStatus === 'Accepted' ? 'Accepted' : enq.status))} />
                            </td>
                            <td className="p-4">
                              {enq.quotationNumber ? (
                                <div>
                                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                                    #{enq.quotationNumber}
                                  </span>
                                  {enq.quotationAmount && (
                                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                      ₹{enq.quotationAmount.toLocaleString('en-IN')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">In preparation</span>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap text-slate-500">
                              {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                              <Link
                                to={`/track-enquiry?ref=${enq.referenceNumber}&email=${encodeURIComponent(user?.email || '')}`}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                              >
                                Track <ArrowRight className="w-3 h-3" />
                              </Link>

                              {enq.quotationSecureToken && (
                                <Link
                                  to={`/quote/${enq.quotationSecureToken}`}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs inline-flex items-center gap-1"
                                >
                                  View Proposal <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        )}

        {/* TAB 2: PAYMENT RECEIPTS & INVOICES */}
        {activeTab === 'payments' && (
          <Reveal animation="fade-up">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    Transaction Receipts &amp; Cashfree Records
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official digital receipts for advance and milestone payments.
                  </p>
                </div>
              </div>

              {loadingPayments ? (
                <div className="p-12 text-center text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                  <span className="text-xs font-medium">Fetching payment records...</span>
                </div>
              ) : payments.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No payment records found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Payments will appear here automatically upon completing advance or milestone transactions via Cashfree.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 uppercase font-bold text-[11px] tracking-wider">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Reference / Order ID</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Gateway Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 whitespace-nowrap text-slate-500 font-medium">
                            {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.cashfreeOrderId || p.transactionReference || `#PAY-${p.id}`}
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {p.projectTitle || (p.quotationNumber ? `Quotation #${p.quotationNumber}` : 'Custom Software Service')}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {p.notes || String(p.paymentType)}
                            </div>
                          </td>
                          <td className="p-4 font-black text-slate-900 dark:text-white whitespace-nowrap">
                            ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              <CreditCard className="w-3.5 h-3.5 text-blue-500" /> {p.paymentMethod || 'Cashfree Gateway'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedReceipt(p)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Receipt className="w-3.5 h-3.5" /> View Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>

      {/* MILESTONE CASHFREE PAYMENT MODAL */}
      {payingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pay Project Milestone
                </h3>
              </div>
              <button
                onClick={() => setPayingMilestone(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Milestone Deliverable
              </span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {payingMilestone.title}
              </div>
              {payingMilestone.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {payingMilestone.description}
                </p>
              )}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Amount Due:</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  ₹{payingMilestone.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {paymentError}
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              100% Encrypted &amp; Secure via Cashfree Gateway (UPI, Cards, NetBanking).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayingMilestone(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmMilestonePayment}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Opening Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Pay ₹{payingMilestone.amount.toLocaleString('en-IN')} with Cashfree
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE DIGITAL PAYMENT RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  AffordStack Official Receipt
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Payment Confirmation
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction Reference</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedReceipt.cashfreeOrderId || selectedReceipt.transactionReference || `#PAY-${selectedReceipt.id}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedReceipt.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {user?.fullName || selectedReceipt.customerName || 'Valued Client'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedReceipt.paymentMethod || 'Cashfree PG'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Description:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                    {selectedReceipt.notes || selectedReceipt.projectTitle || 'Milestone / Advance Payment'}
                  </span>
                </div>
                {selectedReceipt.projectNumber && (
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Project Number:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedReceipt.projectNumber}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payment Received &amp; Verified
                </span>
                <span className="font-mono text-[10px]">CASHFREE-VERIFIED</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
