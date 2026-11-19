import React from 'react';

interface BadgeProps {
  status: string | number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const s = String(status).toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-800 border-slate-200';

  if (s === 'new' || s === '1') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
  } else if (s === 'reviewed' || s === '2') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (s === 'quoted' || s === 'sent') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
  } else if (s === 'accepted' || s === 'completed' || s === 'received' || s === 'active') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
  } else if (s === 'inprogress') {
    colorClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold';
  } else if (s === 'rejected' || s === 'cancelled' || s === 'spam' || s === 'failed') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'onhold' || s === 'draft' || s === 'notstarted' || s === 'pending') {
    colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  }

  // Format label text
  let label = String(status);
  if (label === '1' && s === '1') label = 'New';
  if (label === '2' && s === '2') label = 'Reviewed';
  if (label === '3' && s === '3') label = 'Quoted';
  if (label === 'InProgress') label = 'In Progress';
  if (label === 'NotStarted') label = 'Not Started';
  if (label === 'OnHold') label = 'On Hold';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
