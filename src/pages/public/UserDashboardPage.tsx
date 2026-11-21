import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { userAuthApi } from '../../api/userAuthApi';
import type { UserEnquirySummary } from '../../types';
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
  Calendar
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, logout, refreshProfile } = useUserAuth();
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState<UserEnquirySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    userAuthApi.getMyEnquiries()
      .then(setEnquiries)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load your enquiries'))
      .finally(() => setLoading(false));

    refreshProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/user/login');
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user?.email} &bull; {user?.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                <span className="text-xs font-bold uppercase tracking-wider">Projects Underway</span>
                <FolderKanban className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {enquiries.filter(e => String(e.status) === 'Converted').length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Under active engineering</p>
            </div>
          </Reveal>
        </div>

        {/* Active Projects & Development Milestones Cards */}
        {enquiries.some(e => (e.milestones && e.milestones.length > 0) || e.progressPercentage !== undefined) && (
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
                  .filter(e => (e.milestones && e.milestones.length > 0) || e.progressPercentage !== undefined)
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
                            <Badge status={enq.status} />
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

                      {/* Milestones list */}
                      {enq.milestones && enq.milestones.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Milestones Checklist ({enq.milestones.filter(m => m.isCompleted).length}/{enq.milestones.length})
                          </span>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {enq.milestones.map((m, idx) => (
                              <div
                                key={m.id || idx}
                                className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border ${
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
                                  <span className="font-semibold truncate">{m.title}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  m.isCompleted
                                    ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {m.isCompleted ? 'Done' : new Date(m.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
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

        {/* Enquiries Table Section */}
        <Reveal animation="fade-up" delayMs={200}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  My Enquiries &amp; Quotations History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track progress, review quotation proposals, and accept project roadmaps.
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
                      <th className="p-4">Quotation</th>
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
                          <Badge status={enq.status} />
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
                          {/* Live Track link */}
                          <Link
                            to={`/track-enquiry?ref=${enq.referenceNumber}&email=${encodeURIComponent(user?.email || '')}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                          >
                            Track <ArrowRight className="w-3 h-3" />
                          </Link>

                          {/* Proposal decision if quotation exists */}
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
    </div>
  );
};
