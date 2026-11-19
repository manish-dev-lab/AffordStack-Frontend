import React, { useEffect, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { projectApi } from '../../api/projectApi';
import type { Payment, Project } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Record Payment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectId: 0,
    amount: '',
    paymentType: 1, // 1: Advance, 2: Milestone, 3: Final, 4: AdHoc
    paymentMethod: 'Bank Transfer',
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getPayments({ page, pageSize: 10, search: search || undefined });
      setPayments(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (err: any) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getProjects({ page: 1, pageSize: 50 });
      setProjects(res.items);
    } catch (err) {
      console.error('Failed to load projects list', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchProjects();
  }, [page, search]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || Number(formData.projectId) <= 0) {
      setError('Please select a valid project');
      return;
    }
    const amountVal = parseFloat(formData.amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setError('Amount must be a valid positive number');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await paymentApi.recordPayment({
        projectId: Number(formData.projectId),
        amount: amountVal,
        paymentType: Number(formData.paymentType),
        paymentMethod: formData.paymentMethod,
        transactionReference: formData.transactionReference,
        paymentDate: formData.paymentDate,
        notes: formData.notes,
      });

      setSuccess('Payment recorded successfully!');
      setTimeout(() => {
        setModalOpen(false);
        setSuccess(null);
        setFormData({
          projectId: 0,
          amount: '',
          paymentType: 1,
          paymentMethod: 'Bank Transfer',
          transactionReference: '',
          paymentDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        fetchPayments();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const getPaymentTypeName = (type: number) => {
    switch (type) {
      case 1:
        return 'Advance Payment';
      case 2:
        return 'Milestone Payment';
      case 3:
        return 'Final Settlement';
      case 4:
        return 'Ad-Hoc / Extension';
      default:
        return 'Payment';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Payment Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track client project receipts, advances, milestone installments and settlement records.
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Record New Payment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Page Total Received</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">${totalCollected.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Transactions</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Projects Tracked</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{projects.length}</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments by transaction ref, payment method, or notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Receipt className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-700">No payment transactions found.</p>
            <p className="text-xs text-slate-400 mt-1">Record a project payment to begin tracking finances.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">ID / Date</th>
                  <th className="px-6 py-3.5">Project</th>
                  <th className="px-6 py-3.5">Type & Method</th>
                  <th className="px-6 py-3.5">Transaction Ref</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">PAY-#{p.id}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {p.projectTitle || `Project #${p.projectId}`}
                      </div>
                      {p.notes && <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{p.notes}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{getPaymentTypeName(Number(p.paymentType))}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.paymentMethod || 'Direct Transfer'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 border border-slate-200">
                        {p.transactionReference || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-600 text-base">
                        ${(p.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Showing page {page} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Project Payment">
        <form onSubmit={handleRecordPayment} className="space-y-4">
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
              Select Project *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">-- Select Project --</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.projectNumber || `PROJ-${proj.id}`} - {proj.projectTitle} ({proj.customerName || 'Client'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 1500.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Type
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Advance Payment</option>
                <option value={2}>Milestone Payment</option>
                <option value={3}>Final Settlement</option>
                <option value={4}>Ad-Hoc / Extension</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bank Transfer">Bank Wire / NEFT / IMPS</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Stripe">Stripe Checkout</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash / Cheque">Cash / Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Transaction Ref / Receipt No
            </label>
            <input
              type="text"
              placeholder="e.g. TXN-9988231 or UTR No"
              value={formData.transactionReference}
              onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Notes / Purpose
            </label>
            <textarea
              rows={2}
              placeholder="Notes on milestone delivery or payment acknowledgement..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <LoadingSpinner size="sm" />}
              Save Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
