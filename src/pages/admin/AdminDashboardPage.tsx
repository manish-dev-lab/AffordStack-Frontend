import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import type { DashboardStats } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Inbox,
  Clock,
  FileCheck2,
  FolderKanban,
  CheckCircle,
  Coins,
  CreditCard,
  TrendingUp,
  XCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(setStats)
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading real-time platform metrics..." className="min-h-[50vh]" />;
  }

  const s = stats || {
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingQuotations: 0,
    acceptedQuotations: 0,
    rejectedQuotations: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenueRecorded: 0,
    pendingPayments: 0,
    monthlyEnquiries: [],
    monthlyRevenue: [],
    serviceCategoryDistribution: [],
    projectStatusDistribution: [],
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Executive Analytics &amp; Operations Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics compiled dynamically from PostgreSQL database.
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Enquiries */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Total Enquiries</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{s.totalEnquiries}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">{s.newEnquiries} New / Unreviewed</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Quotations Pipeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Accepted Quotes</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{s.acceptedQuotations}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.pendingQuotations} Pending &bull; {s.rejectedQuotations} Declined</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Active Projects</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{s.activeProjects}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{s.completedProjects} Completed</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Revenue Recorded */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Revenue Recorded</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{s.totalRevenueRecorded.toLocaleString('en-IN')}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">₹{s.pendingPayments.toLocaleString('en-IN')} Outstanding</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Monthly Enquiries & Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Enquiries Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Monthly Enquiries Trend
            </h2>
            <span className="text-xs text-slate-400">Last 6 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.monthlyEnquiries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Enquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Monthly Revenue Collected (₹)
            </h2>
            <span className="text-xs text-slate-400">Last 6 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Service Categories & Project Statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Enquiries by Service Category</h2>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {s.serviceCategoryDistribution.length === 0 ? (
              <p className="text-xs text-slate-400">No category data recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={s.serviceCategoryDistribution}
                    dataKey="count"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label={((entry: any) => `${entry.categoryName || ''}: ${entry.count || 0}`) as any}
                    fontSize={11}
                  >
                    {s.serviceCategoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Projects by Execution Status</h2>
            <span className="text-xs text-slate-400">Live Projects</span>
          </div>

          <div className="h-64 w-full">
            {s.projectStatusDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No active projects recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.projectStatusDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="status" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
