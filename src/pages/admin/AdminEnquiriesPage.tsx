import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enquiryApi } from '../../api/enquiryApi';
import type { EnquiryListItem, EnquiryDetail, EnquiryStatus } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Trash2,
  Paperclip,
  Send,
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Selected enquiry for detail view
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<number | null>(null);
  const [detail, setDetail] = useState<EnquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const navigate = useNavigate();

  const loadEnquiries = () => {
    setLoading(true);
    const sFilter = statusFilter === 'All' ? undefined : (statusFilter as EnquiryStatus);
    enquiryApi.getAdminEnquiries({
      page,
      pageSize: 10,
      status: sFilter,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setEnquiries(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEnquiries();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadEnquiries();
  };

  const handleOpenDetail = (id: number) => {
    setSelectedEnquiryId(id);
    setDetailLoading(true);
    enquiryApi.getAdminEnquiryById(id)
      .then(setDetail)
      .catch((err) => alert(err.message))
      .finally(() => setDetailLoading(false));
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiryId) return;
    try {
      await enquiryApi.updateStatus(selectedEnquiryId, newStatus, `Status updated to ${newStatus}`);
      if (detail) setDetail({ ...detail, status: newStatus });
      loadEnquiries();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryId || !newNote.trim()) return;
    setNoteSubmitting(true);
    try {
      await enquiryApi.addNote(selectedEnquiryId, newNote.trim());
      setNewNote('');
      // Reload detail notes
      const updated = await enquiryApi.getAdminEnquiryById(selectedEnquiryId);
      setDetail(updated);
      loadEnquiries();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error adding note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete enquiry #${id}?`)) return;
    try {
      await enquiryApi.deleteEnquiry(id);
      loadEnquiries();
      if (selectedEnquiryId === id) setSelectedEnquiryId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting enquiry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Enquiry Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review customer project requests, update statuses, and create quotation proposals.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          Total: <strong className="text-slate-900 dark:text-white">{totalCount}</strong> enquiries
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
            placeholder="Search by customer, email, title, or reference..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New (Unreviewed)</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Quoted">Quoted</option>
            <option value="FollowUp">Follow-up</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
            <option value="Spam">Spam</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading enquiries from database..." className="py-20" />
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No enquiries matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Category &amp; Tech</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {e.referenceNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{e.customerName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{e.customerEmail}</div>
                      <div className="text-xs text-slate-400">{e.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {e.projectTitle}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{e.serviceCategoryName}</span>
                      <div className="text-slate-400">{e.requiredTechnology}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {e.estimatedBudget}
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={e.status} />
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(e.id)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/quotations?createForEnquiry=${e.id}`)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Create Quotation"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Page {page} of {Math.ceil(totalCount / 10) || 1}</div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              disabled={page >= Math.ceil(totalCount / 10)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedEnquiryId}
        onClose={() => setSelectedEnquiryId(null)}
        title={`Enquiry #${detail?.referenceNumber || ''}`}
        maxWidth="2xl"
      >
        {detailLoading || !detail ? (
          <LoadingSpinner size="md" text="Loading details..." className="py-12" />
        ) : (
          <div className="space-y-6">
            {/* Status change header */}
            <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Current Status:</span>
                <Badge status={detail.status} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Update:</span>
                <select
                  value={String(detail.status)}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="New">1. New (Enquiry Received)</option>
                  <option value="Reviewed">2. Reviewed (Under Technical Review)</option>
                  <option value="Quoted">3. Quoted (Quotation Ready)</option>
                  <option value="FollowUp">Follow Up (Clarification &amp; Scope)</option>
                  <option value="Converted">4. Converted (Project Active)</option>
                  <option value="Closed">5. Delivered (Handed Over / Completed)</option>
                  <option value="Spam">Spam (Archived)</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block font-bold uppercase">Customer</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{detail.customerName}</span>
                <div className="text-slate-600 dark:text-slate-300 mt-0.5">{detail.customerEmail}</div>
                <div className="text-slate-600 dark:text-slate-300">{detail.customerPhone}</div>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block font-bold uppercase">Company / College</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{detail.companyName || 'Not specified'}</span>
                <span className="text-slate-400 dark:text-slate-400 block font-bold uppercase mt-2">Budget &amp; Target</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{detail.estimatedBudget}</span>
              </div>
            </div>

            {/* Project Scope */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1">Project Title</h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{detail.projectTitle}</p>

              <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider mt-4 mb-1">Requirement Details</h3>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed max-h-40 overflow-y-auto">
                {detail.projectDescription}
              </div>

              {detail.additionalRequirements && (
                <div className="mt-3">
                  <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-1">Additional Notes</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {detail.additionalRequirements}
                  </p>
                </div>
              )}
            </div>

            {/* Attachments */}
            {detail.attachments && detail.attachments.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" /> Attachments ({detail.attachments.length})
                </h3>
                <div className="space-y-1.5">
                  {detail.attachments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{a.originalFileName}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-mono">{(a.fileSizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Notes History */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Internal Notes Thread
              </h3>

              {detail.notes && detail.notes.length > 0 ? (
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {detail.notes.map((note) => (
                    <div key={note.id} className="p-2.5 bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-xl text-xs space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>{note.authorName || 'Admin'}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{note.noteContent}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write an internal note..."
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={noteSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Add Note
                </button>
              </form>
            </div>

            {/* Modal Bottom Actions */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleDelete(detail.id)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 py-2 cursor-pointer"
                >
                  Delete Enquiry
                </button>
                {detail.status === 'New' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Reviewed')}
                    className="text-xs font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                  >
                    Mark Reviewed
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiryId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const enquiryId = detail.id;
                    setSelectedEnquiryId(null);
                    navigate(`/admin/quotations?createForEnquiry=${enquiryId}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Create Quotation Proposal
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
