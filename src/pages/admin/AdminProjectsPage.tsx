import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import type { Project, ProjectStatus, ProjectMilestone } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Selected project for details/update modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editStatus, setEditStatus] = useState<ProjectStatus>('InProgress');
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editDeveloper, setEditDeveloper] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // New Milestone modal
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [milestoneAmount, setMilestoneAmount] = useState<number>(0);

  const navigate = useNavigate();

  const loadProjects = () => {
    setLoading(true);
    const sFilter = statusFilter === 'All' ? undefined : (statusFilter as ProjectStatus);
    projectApi.getProjects({
      page,
      pageSize: 10,
      status: sFilter,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setProjects(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, [page, statusFilter]);

  const handleOpenEdit = (p: Project) => {
    setSelectedProject(p);
    setEditStatus(p.status as ProjectStatus);
    setEditProgress(p.progressPercentage);
    setEditDeveloper(p.assignedDeveloper || '');
    setEditNotes(p.internalNotes || '');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSaving(true);
    try {
      await projectApi.updateProject(selectedProject.id, {
        projectTitle: selectedProject.projectTitle,
        description: selectedProject.description,
        expectedCompletionDate: selectedProject.expectedCompletionDate,
        agreedAmount: selectedProject.agreedAmount,
        status: editStatus,
        progressPercentage: Number(editProgress),
        assignedDeveloper: editDeveloper.trim() || undefined,
        internalNotes: editNotes.trim() || undefined,
      });
      setSelectedProject(null);
      loadProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating project');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMilestone = async (mId: number, currentCompleted: boolean) => {
    try {
      await projectApi.updateMilestoneStatus(mId, !currentCompleted);
      if (selectedProject) {
        const refreshed = await projectApi.getProjectById(selectedProject.id);
        setSelectedProject(refreshed);
      }
      loadProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating milestone');
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !milestoneTitle.trim()) return;
    try {
      await projectApi.addMilestone(selectedProject.id, {
        title: milestoneTitle.trim(),
        description: milestoneDesc.trim(),
        dueDate: milestoneDate ? new Date(milestoneDate).toISOString() : new Date().toISOString(),
        amount: Number(milestoneAmount) || 0,
      });
      setMilestoneTitle('');
      setMilestoneDesc('');
      setMilestoneAmount(0);
      const refreshed = await projectApi.getProjectById(selectedProject.id);
      setSelectedProject(refreshed);
      loadProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error adding milestone');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track client development sprints, milestones, developer allocations, and progress delivery.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          Total: <strong className="text-slate-900 dark:text-white">{totalCount}</strong> projects
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadProjects()}
            placeholder="Search by project number, title, or client..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="NotStarted">Not Started</option>
            <option value="InProgress">In Progress</option>
            <option value="OnHold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading active projects..." className="py-20" />
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm">
            No projects found. When a customer accepts a quotation, a project is automatically created here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Project #</th>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Financials</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.projectNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.projectTitle}</div>
                      {p.assignedDeveloper && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" /> {p.assignedDeveloper}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{p.customerName}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{p.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4 w-44">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        <span>{p.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${p.progressPercentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-700 dark:text-slate-300">
                      <div>Agreed: <strong>₹{p.agreedAmount.toLocaleString()}</strong></div>
                      <div className="text-emerald-700 dark:text-emerald-400">Paid: ₹{p.totalPaid.toLocaleString()}</div>
                      {p.outstandingBalance > 0 && (
                        <div className="text-amber-600 dark:text-amber-400 font-semibold">Bal: ₹{p.outstandingBalance.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Manage &amp; Milestones
                      </button>
                      <button
                        onClick={() => navigate(`/admin/payments?recordForProject=${p.id}`)}
                        className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                        title="Record Payment"
                      >
                        + Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Management Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={`Project #${selectedProject?.projectNumber || ''}`}
        maxWidth="2xl"
      >
        {selectedProject && (
          <div className="space-y-6">
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Project Status
                  </label>
                  <select
                    value={String(editStatus)}
                    onChange={(e) => {
                      const newStatus = e.target.value as ProjectStatus;
                      setEditStatus(newStatus);
                      if (newStatus === 'Completed') {
                        setEditProgress(100);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="NotStarted">Not Started</option>
                    <option value="InProgress">4. In Progress (Active Development)</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Completed">5. Delivered (Codebase, Demo &amp; Docs Handed Over)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Progress Percentage: {editProgress}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Lead Developer
                </label>
                <input
                  type="text"
                  value={editDeveloper}
                  onChange={(e) => setEditDeveloper(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Internal Engineering Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Sprint notes, blockers, or repository links..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Project Details'}
                </button>
              </div>
            </form>

            {/* Milestones Section */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Project Milestones &amp; Handover Checklist
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedProject.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={m.isCompleted}
                        onChange={() => handleToggleMilestone(m.id, m.isCompleted)}
                        className="w-4 h-4 rounded-md text-emerald-600 accent-emerald-600 cursor-pointer"
                      />
                      <div>
                        <div className={`font-bold ${m.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {m.title}
                        </div>
                        {m.description && <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.description}</div>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">₹{m.amount.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">Due: {new Date(m.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Milestone Subform */}
              <form onSubmit={handleAddMilestone} className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Milestone</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Milestone Title"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={milestoneAmount || ''}
                    onChange={(e) => setMilestoneAmount(Number(e.target.value))}
                    className="col-span-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={milestoneDate}
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    className="col-span-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description / deliverables"
                    value={milestoneDesc}
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  Add Milestone
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
