import React, { useEffect, useState } from 'react';
import { adminUsersApi } from '../../api/adminUsersApi';
import type { AdminUserAccount, UserEnquirySummary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Loader2,
  AlertTriangle,
  UserX,
  UserCheck
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserAccount | null>(null);
  const [userEnquiries, setUserEnquiries] = useState<UserEnquirySummary[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Confirmation Modal for Terminate / Activate
  const [confirmTarget, setConfirmTarget] = useState<{
    user: AdminUserAccount;
    action: 'deactivate' | 'activate';
  } | null>(null);

  const loadUsers = () => {
    setLoading(true);
    adminUsersApi.getAdminUsers({
      page,
      pageSize: 10,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setUsers(res.items || []);
        setTotalCount(res.totalCount || 0);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        setUsers([]);
        setTotalCount(0);
        showToast({
          type: 'error',
          title: 'Error Loading Users',
          message: err?.message || 'Unable to retrieve customer accounts.',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleOpenDetail = (u: AdminUserAccount) => {
    setSelectedUser(u);
    setModalLoading(true);
    adminUsersApi.getAdminUserEnquiries(u.id)
      .then(setUserEnquiries)
      .catch((err) => {
        showToast({
          type: 'error',
          title: 'Error',
          message: err?.message || 'Failed to load user enquiries.',
        });
      })
      .finally(() => setModalLoading(false));
  };

  const executeToggleStatus = async () => {
    if (!confirmTarget) return;
    const { user: u, action } = confirmTarget;
    setTogglingId(u.id);

    try {
      const newStatus = await adminUsersApi.toggleUserStatus(u.id);
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, isActive: newStatus } : item)));

      if (selectedUser?.id === u.id) {
        setSelectedUser({ ...selectedUser, isActive: newStatus });
      }

      showToast({
        type: newStatus ? 'success' : 'warning',
        title: newStatus ? 'Account Activated' : 'Account Terminated / Deactivated',
        message: `${u.fullName}'s account is now ${newStatus ? 'active and allowed to sign in.' : 'deactivated and blocked from signing in.'}`,
      });
      setConfirmTarget(null);
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Action Failed',
        message: err instanceof Error ? err.message : 'Error updating user status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            Registered Customer Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage customer accounts, inspect enquiry histories, and manage login authorization / account status.
          </p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          Total Customers: <strong className="text-slate-900 dark:text-white font-mono text-sm">{totalCount}</strong>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
                adminUsersApi.getAdminUsers({ page: 1, pageSize: 10 }).then((r) => {
                  setUsers(r.items || []);
                  setTotalCount(r.totalCount || 0);
                });
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table / Mobile Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading customer accounts..." className="py-20" />
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {search ? 'No Matching Accounts' : 'No Customer Accounts Registered Yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {search
                ? `No user accounts found matching "${search}". Please try a different query.`
                : 'When customers register on the website or mobile app to manage their project enquiries, their accounts will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User Account</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Company / College</th>
                  <th className="py-3.5 px-4 text-center">Enquiries</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono">{u.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {u.companyName || <span className="text-slate-400 italic">Individual</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {u.enquiriesCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> Terminated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-900"
                        title="View Profile & Enquiries"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {u.isActive ? (
                        <button
                          onClick={() => setConfirmTarget({ user: u, action: 'deactivate' })}
                          disabled={togglingId === u.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer border border-rose-200/80 dark:border-rose-900/60"
                          title="Terminate / Deactivate user account"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Terminate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmTarget({ user: u, action: 'activate' })}
                          disabled={togglingId === u.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors cursor-pointer border border-emerald-200/80 dark:border-emerald-900/60"
                          title="Reactivate user account"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Reactivate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalCount > 10 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>Page {page} of {Math.ceil(totalCount / 10) || 1}</div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= Math.ceil(totalCount / 10)}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Account Status Change */}
      <Modal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        title={confirmTarget?.action === 'deactivate' ? 'Terminate Account Access?' : 'Reactivate User Account?'}
        maxWidth="md"
      >
        {confirmTarget && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
              confirmTarget.action === 'deactivate'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
            }`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${confirmTarget.action === 'deactivate' ? 'text-rose-600' : 'text-emerald-600'}`} />
              <div className="text-xs">
                {confirmTarget.action === 'deactivate' ? (
                  <>
                    Are you sure you want to terminate/deactivate the customer account for{' '}
                    <strong className="font-bold">{confirmTarget.user.fullName}</strong> ({confirmTarget.user.email})?
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      They will be immediately barred from logging into the portal. Their past enquiries and records will remain safely preserved in the database.
                    </p>
                  </>
                ) : (
                  <>
                    Are you sure you want to restore and reactivate the customer account for{' '}
                    <strong className="font-bold">{confirmTarget.user.fullName}</strong> ({confirmTarget.user.email})?
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      The user will regain login access to track their enquiries and manage project proposals.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeToggleStatus}
                disabled={togglingId === confirmTarget.user.id}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  confirmTarget.action === 'deactivate'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                }`}
              >
                {togglingId === confirmTarget.user.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmTarget.action === 'deactivate' ? 'Confirm Deactivation' : 'Confirm Reactivation'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* User Detail & Enquiries Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Customer Account: ${selectedUser?.fullName || ''}`}
        maxWidth="4xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Email</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block font-mono">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{selectedUser.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Company / College</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedUser.companyName || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Status</span>
                <span className={selectedUser.isActive ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {selectedUser.isActive ? 'Active' : 'Terminated / Inactive'}
                </span>
              </div>
            </div>

            {/* Account Status & Action Card */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              selectedUser.isActive
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedUser.isActive
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300'
                }`}>
                  {selectedUser.isActive ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedUser.isActive ? 'Account is Currently Active' : 'Account is Deactivated / Terminated'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedUser.isActive
                      ? 'The user can log into their customer dashboard to view proposals and past enquiries.'
                      : 'The user is locked out from logging in. Any login attempt will be rejected with an account deactivation notice.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmTarget({ user: selectedUser, action: selectedUser.isActive ? 'deactivate' : 'activate' })}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs ${
                  selectedUser.isActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedUser.isActive ? 'Terminate Account Access' : 'Reactivate User Account'}
              </button>
            </div>

            {/* User's Enquiries & Proposals */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                <span>Enquiries &amp; Quotations ({userEnquiries.length})</span>
                <span className="text-xs text-slate-400 font-normal">Past requests submitted by this account</span>
              </h3>

              {modalLoading ? (
                <LoadingSpinner size="sm" text="Loading enquiries..." className="py-8" />
              ) : userEnquiries.length === 0 ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                  No enquiries linked to this user yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {userEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {enq.projectNumber || enq.referenceNumber}
                        </span>
                        <Badge status={enq.effectiveStatus || (enq.projectStatus ? String(enq.projectStatus) : (enq.quotationStatus === 'Accepted' ? 'Accepted' : enq.status))} />
                      </div>

                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {enq.projectTitle}
                      </div>

                      <div className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">
                        {enq.projectDescription}
                      </div>

                      {enq.projectNumber && (
                        <div className="space-y-1 py-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">Progress</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{enq.progressPercentage || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                              style={{ width: `${Math.min(Math.max(enq.progressPercentage || 0, 5), 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          Tech: {enq.requiredTechnology} &bull; Budget: {enq.estimatedBudget}
                        </span>

                        {enq.quotationNumber ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            Quote #{enq.quotationNumber} ({enq.quotationAmount ? `₹${enq.quotationAmount.toLocaleString()}` : ''})
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">No quotation yet</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};