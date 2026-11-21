import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import type { BlogPost, BlogCategory } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  User,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminBlogPage: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    blogCategoryId: 1,
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
    authorName: 'Engineering Team',
    isPublished: true,
    tagsText: 'SoftwareArchitecture, BestPractices',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, blogPosts] = await Promise.all([
        contentApi.getBlogCategories(),
        contentApi.getBlogPosts({ categorySlug: categoryFilter || undefined }),
      ]);
      setCategories(cats);
      setPosts(blogPosts);
    } catch (err) {
      console.error('Failed to load blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      blogCategoryId: categories[0]?.id || 1,
      title: '',
      slug: '',
      summary: '',
      content: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      authorName: 'Engineering Team',
      isPublished: true,
      tagsText: 'SoftwareArchitecture, BestPractices',
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setFormData({
      blogCategoryId: p.blogCategoryId || 1,
      title: p.title,
      slug: p.slug,
      summary: p.summary || '',
      content: p.content || '',
      thumbnailUrl: p.thumbnailUrl || '',
      authorName: p.authorName || 'Engineering Team',
      isPublished: p.isPublished,
      tagsText: (p.tags || []).join(', '),
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await contentApi.deleteBlogPost(deleteId);
      showToast('Blog article deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete blog article', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (p: BlogPost) => {
    try {
      await contentApi.updateBlogPost(p.id, { isPublished: !p.isPublished });
      showToast(`Article ${!p.isPublished ? 'published' : 'moved to draft'}`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to toggle publish status', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const payload: Partial<BlogPost> = {
      blogCategoryId: Number(formData.blogCategoryId),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: formData.summary,
      content: formData.content,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      authorName: formData.authorName || 'Engineering Team',
      isPublished: formData.isPublished,
      tags: formData.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await contentApi.updateBlogPost(editingId, payload);
        setSuccess('Article updated successfully!');
      } else {
        await contentApi.createBlogPost(payload);
        setSuccess('Article created successfully!');
      }

      setTimeout(() => {
        setModalOpen(false);
        setSuccess(null);
        loadData();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.title.toLowerCase().includes(term) || (p.summary || '').toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Technical Blog &amp; Articles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish educational guides, architectural deep dives, and company technical articles.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write New Article
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No blog articles found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Article Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Published Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-md">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-md">
                        {post.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {post.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {post.authorName || 'Admin'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          post.isPublished
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {post.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete Article"
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
      </div>

      {/* Modal: Write / Edit Article */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Blog Article' : 'Write New Blog Article'}
      >
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
                Category *
              </label>
              <select
                value={formData.blogCategoryId}
                onChange={(e) => setFormData({ ...formData, blogCategoryId: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                placeholder="Engineering Team / Chief Architect"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Clean Architecture in ASP.NET Core & PostgreSQL"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="clean-architecture-aspnet-core"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Summary / Short Excerpt *
            </label>
            <textarea
              rows={2}
              placeholder="A brief teaser for the blog card and search previews..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Article Content (Markdown Supported) *
            </label>
            <textarea
              rows={8}
              placeholder="Write the article content here. You can write paragraphs, bullet points, and code snippets..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="DotNet, React, Architecture, Performance"
              value={formData.tagsText}
              onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Publish immediately on website
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
              className="px-5 h-10 shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <LoadingSpinner size="sm" />}
              {editingId ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Blog Article"
        message="Are you sure you want to permanently delete this blog article? This action cannot be undone."
        confirmText="Delete Article"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
