import React from 'react';

interface BadgeProps {
  status: string | number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const s = String(status).toLowerCase();

  let colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

  if (s === 'new' || s === '1' || s === 'submitted') {
    colorClasses = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold';
  } else if (s === 'reviewed' || s === '2') {
    colorClasses = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  } else if (s === 'quoted' || s === 'sent' || s === '3') {
    colorClasses = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold';
  } else if (s === 'accepted' || s === 'converted' || s === 'completed' || s === 'delivered' || s === 'closed' || s === 'received' || s === 'active' || s === '5' || s === '6') {
    colorClasses = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold';
  } else if (s === 'inprogress' || s === '4') {
    colorClasses = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 font-semibold';
  } else if (s === 'rejected' || s === 'cancelled' || s === 'spam' || s === 'failed' || s === '7') {
    colorClasses = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (s === 'onhold' || s === 'draft' || s === 'notstarted' || s === 'pending') {
    colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  }

  // Format label text
  let label = String(status);
  if (label === '1' || s === 'new') label = 'Submitted';
  if (label === '2' || s === 'reviewed') label = 'Reviewed';
  if (label === '3' || s === 'quoted') label = 'Quotation Ready';
  if (label === '4' && s === '4') label = 'In Progress';
  if (label === '5' && s === '5') label = 'Delivered';
  if (label === '6' || s === 'closed') label = 'Delivered / Completed';
  if (label === '7' || s === 'spam') label = 'Archived';
  if (s === 'converted') label = 'Project Active';
  if (s === 'completed' || s === 'delivered') label = 'Delivered';
  if (label === 'InProgress' || s === 'inprogress') label = 'In Progress';
  if (label === 'NotStarted' || s === 'notstarted') label = 'Not Started';
  if (label === 'OnHold' || s === 'onhold') label = 'On Hold';
  if (label === 'Accepted' || s === 'accepted') label = 'Accepted';
  if (label === 'FollowUp' || s === 'followup') label = 'Follow Up';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
