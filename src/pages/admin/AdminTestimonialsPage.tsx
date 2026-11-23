import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import type { Testimonial } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import {
  MessageSquareQuote,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Pencil,
  Trash2
} from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    companyOrInstitution: '',
    feedback: '',
    rating: 5,
    avatarUrl: '',
    isFeatured: true,
    displayOrder: 1,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getTestimonials();
      setTestimonials(res);
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      clientName: '',
      clientRole: 'M.Tech Project Scholar',
      companyOrInstitution: 'National Institute of Technology',
      feedback: '',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      displayOrder: testimonials.length + 1,
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      clientName: t.clientName,
      clientRole: t.clientRole || '',
      companyOrInstitution: t.companyOrInstitution || '',
      feedback: t.feedback,
      rating: t.rating || 5,
      avatarUrl: t.avatarUrl || '',
      isFeatured: t.isFeatured,
      displayOrder: t.displayOrder || 1,
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await contentApi.deleteTestimonial(id);
      loadTestimonials();
    } catch (err: any) {
      alert(err.message || 'Failed to delete testimonial');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.feedback.trim()) {
      setError('Client name and review feedback are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        await contentApi.updateTestimonial(editingId, {
          clientName: formData.clientName,
          clientRole: formData.clientRole,
          companyOrInstitution: formData.companyOrInstitution,
          feedback: formData.feedback,
          rating: Number(formData.rating),
          avatarUrl: formData.avatarUrl || undefined,
          isFeatured: formData.isFeatured,
          displayOrder: Number(formData.displayOrder),
        });
        setSuccess('Testimonial updated successfully!');
      } else {
        await contentApi.createTestimonial({
          clientName: formData.clientName,
          clientRole: formData.clientRole,
          companyOrInstitution: formData.companyOrInstitution,
          feedback: formData.feedback,
          rating: Number(formData.rating),
          avatarUrl: formData.avatarUrl || undefined,
          isFeatured: formData.isFeatured,
          displayOrder: Number(formData.displayOrder),
        });
        setSuccess('Testimonial added successfully!');
      }

      setTimeout(() => {
        setModalOpen(false);
        setSuccess(null);
        loadTestimonials();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquareQuote className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            Client Reviews &amp; Testimonials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage feedback from mentored students, tech leaders and enterprise business clients.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <LoadingSpinner size="lg" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <MessageSquareQuote className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="font-medium text-slate-700 dark:text-slate-300">No testimonials published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {t.isFeatured && (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 italic line-clamp-4 mb-4">
                  "{t.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-sm">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div className="truncate">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{t.clientName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {t.clientRole} {t.companyOrInstitution && `• ${t.companyOrInstitution}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add or Edit Testimonial */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Client Testimonial" : "Add Client Testimonial"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Client / Student Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sneha Patel"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Role / Degree
              </label>
              <input
                type="text"
                placeholder="e.g. M.Tech Scholar / Senior Developer"
                value={formData.clientRole}
                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Organization / College
              </label>
              <input
                type="text"
                placeholder="e.g. National Institute of Technology"
                value={formData.companyOrInstitution}
                onChange={(e) => setFormData({ ...formData, companyOrInstitution: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Rating (1 - 5 Stars)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                <option value={3}>★★★☆☆ (3 Stars - Satisfied)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Feedback / Review Content *
            </label>
            <textarea
              rows={4}
              placeholder="Write the client's detailed testimonial..."
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isFeaturedTestimonial"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="isFeaturedTestimonial" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Display in Testimonial Carousel on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 h-10 shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <LoadingSpinner size="sm" />}
              Save Testimonial
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
