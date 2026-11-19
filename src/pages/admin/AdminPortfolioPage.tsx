import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import type { PortfolioProject } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';

export const AdminPortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Enterprise Applications',
    shortDescription: '',
    fullDescription: '',
    thumbnailUrl: '',
    liveDemoUrl: '',
    githubUrl: '',
    clientName: '',
    isFeatured: true,
    displayOrder: 1,
    technologiesText: '',
    featuresText: '',
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getPortfolio({ category: categoryFilter || undefined });
      setProjects(res);
    } catch (err) {
      console.error('Failed to load portfolio items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [categoryFilter]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Enterprise Applications',
      shortDescription: '',
      fullDescription: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      liveDemoUrl: '',
      githubUrl: '',
      clientName: '',
      isFeatured: true,
      displayOrder: projects.length + 1,
      technologiesText: 'React, ASP.NET Core, PostgreSQL, Tailwind CSS',
      featuresText: 'Clean Architecture\nJWT Security & RBAC\nInteractive Analytics Dashboard',
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PortfolioProject) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      shortDescription: p.shortDescription || '',
      fullDescription: p.detailedDescription || '',
      thumbnailUrl: p.thumbnailUrl || '',
      liveDemoUrl: p.liveDemoUrl || '',
      githubUrl: p.gitHubUrl || '',
      clientName: '',
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder,
      technologiesText: (p.technologies || []).join(', '),
      featuresText: (p.features || []).join('\n'),
    });
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await contentApi.deletePortfolio(id);
      loadProjects();
    } catch (err) {
      alert('Failed to delete portfolio project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const payload: Partial<PortfolioProject> = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.category,
      shortDescription: formData.shortDescription,
      detailedDescription: formData.fullDescription,
      thumbnailUrl: formData.thumbnailUrl,
      liveDemoUrl: formData.liveDemoUrl || undefined,
      gitHubUrl: formData.githubUrl || undefined,
      isFeatured: formData.isFeatured,
      displayOrder: Number(formData.displayOrder),
      technologies: formData.technologiesText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      features: formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await contentApi.updatePortfolio(editingId, payload);
        setSuccess('Portfolio item updated!');
      } else {
        await contentApi.createPortfolio(payload);
        setSuccess('Portfolio item created!');
      }

      setTimeout(() => {
        setModalOpen(false);
        setSuccess(null);
        loadProjects();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save portfolio project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.title.toLowerCase().includes(term) || (p.shortDescription || '').toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-600" />
            Portfolio Showcase Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showcase your completed student projects, enterprise solutions, and developer troubleshooting work.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Portfolio Project
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, client or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Student Project Guidance">Student Projects</option>
          <option value="Developer Technical Support">Developer Support</option>
          <option value="Business and Enterprise Software">Enterprise Solutions</option>
        </select>
      </div>

      {/* Projects Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Layers className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-700">No portfolio projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Thumbnail */}
                <div className="h-44 bg-slate-100 relative overflow-hidden group">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  {p.isFeatured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-500/95 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-xs">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.shortDescription}</p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {(p.technologies || []).slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {p.liveDemoUrl && (
                        <a
                          href={p.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {p.gitHubUrl && (
                        <a
                          href={p.gitHubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-900 rounded"
                          title="Source Code"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Project */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Student Project Guidance">Student Project Guidance</option>
                <option value="Developer Technical Support">Developer Technical Support</option>
                <option value="Business and Enterprise Software">Business and Enterprise Software</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Healthcare Patient Record Management"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                placeholder="healthcare-patient-record-system"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Client / Student Name
              </label>
              <input
                type="text"
                placeholder="e.g. MedTech Global / M.Tech Scholar"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Live Demo URL
              </label>
              <input
                type="url"
                placeholder="https://demo.example.com"
                value={formData.liveDemoUrl}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description *
            </label>
            <input
              type="text"
              placeholder="Concise summary for project preview card"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Technologies Used (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="ASP.NET Core, React, TypeScript, PostgreSQL, Tailwind"
              value={formData.technologiesText}
              onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Features (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="Role-based access control&#10;Real-time WebSocket alerts&#10;Automated PDF reports"
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="portfolioFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
            />
            <label htmlFor="portfolioFeatured" className="text-sm font-medium text-slate-700">
              Display in Featured Showcase on Homepage
            </label>
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <LoadingSpinner size="sm" />}
              {editingId ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
