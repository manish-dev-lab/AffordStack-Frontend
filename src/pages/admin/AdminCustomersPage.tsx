import React, { useEffect, useState } from 'react';
import { customerApi } from '../../api/customerApi';
import type { CustomerItem } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  Eye,
  FileSpreadsheet,
  FolderKanban,
  Inbox,
  UserCheck
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getCustomers({
        page,
        pageSize: 10,
        search: search || undefined,
      });
      setCustomers(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Customer &amp; Client Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Directory of all client records, student leads, and enterprise accounts created from enquiries.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          Total: <strong className="text-slate-900 dark:text-white">{totalCount}</strong> clients
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Clients</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Corporate / Business</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {customers.filter((c) => c.companyName && c.companyName.trim().length > 0).length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Accounts</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalCount}</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, email, phone or company name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No customer records found.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Customer profiles are automatically created when quotation enquiries are submitted.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Company / Org</th>
                  <th className="px-6 py-3.5">Activity Stats</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                          {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{c.fullName}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">CUST-#{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${c.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {c.email}
                        </a>
                      </div>
                      {c.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${c.phoneNumber}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {c.phoneNumber}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.companyName ? (
                        <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {c.companyName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">Individual Client</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Inbox className="w-3 h-3" />
                          {c.enquiriesCount} Enquiries
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <FileSpreadsheet className="w-3 h-3" />
                          {c.quotationsCount} Quotes
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <FolderKanban className="w-3 h-3" />
                          {c.projectsCount} Projects
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Showing page {page} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile - ${selectedCustomer.fullName}`}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center">
                {selectedCustomer.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCustomer.fullName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Reference: CUST-#{selectedCustomer.id}</p>
                {selectedCustomer.companyName && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCustomer.companyName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="text-xs text-slate-400 font-medium">Email Address</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href={`mailto:${selectedCustomer.email}`} className="hover:underline">
                    {selectedCustomer.email}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="text-xs text-slate-400 font-medium">Phone Number</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {selectedCustomer.phoneNumber ? (
                    <a href={`tel:${selectedCustomer.phoneNumber}`} className="hover:underline">
                      {selectedCustomer.phoneNumber}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Relationship History
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedCustomer.enquiriesCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enquiries</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{selectedCustomer.quotationsCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quotations</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedCustomer.projectsCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Projects</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Customer registered since {new Date(selectedCustomer.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
