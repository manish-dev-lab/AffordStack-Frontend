import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  inline?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  inline = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (inline || size === 'sm') {
    return (
      <span className={`inline-flex items-center justify-center gap-2 shrink-0 ${className}`}>
        <Loader2 className={`${sizeMap[size]} animate-spin shrink-0 text-current`} />
        {text && <span>{text}</span>}
      </span>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-blue-600 shrink-0`} />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};
