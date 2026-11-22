import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoIconProps {
  size?: number;
  className?: string;
}

export const BrandLogoIcon: React.FC<BrandLogoIconProps> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="brandAsBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="brandAsCyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#818CF8" />
      </linearGradient>
    </defs>
    {/* Squircle Badge */}
    <rect width="48" height="48" rx="12" fill="url(#brandAsBg)" />
    {/* A Monogram (White) */}
    <path
      d="M10 35L20 13H24L34 35H29L27 30H17L15 35H10ZM18.5 26H25.5L22 18L18.5 26Z"
      fill="#FFFFFF"
    />
    {/* S Monogram Accent */}
    <path
      d="M24 23C24 20.2 26.2 18.5 29.5 18.5C32.8 18.5 35 20.2 35 22.8H31.8C31.8 21.6 30.8 21 29.5 21C28.2 21 27.2 21.6 27.2 22.6C27.2 23.6 28 24.1 29.6 24.6L31 25C33.8 25.8 35.5 27.2 35.5 29.8C35.5 32.8 33 34.5 29.5 34.5C25.8 34.5 23.5 32.5 23.5 29.6H26.8C26.8 31 28 32 29.5 32C31 32 32.2 31.2 32.2 29.8C32.2 28.6 31.2 28 29.4 27.5L28 27C25.4 26.2 24 24.8 24 23Z"
      fill="url(#brandAsCyan)"
    />
  </svg>
);

interface BrandLogoProps {
  to?: string;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'public' | 'admin';
  showSubtitle?: boolean;
  subtitleText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  onClick,
  variant = 'public',
  showSubtitle = true,
  subtitleText = 'Low-Cost Custom Software',
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const mainTextSize =
    size === 'sm'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : 'text-base sm:text-xl';

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 ${className}`}>
      <div className="rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
        <BrandLogoIcon size={iconSize} />
      </div>
      <div className="truncate">
        <span className={`${mainTextSize} font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1`}>
          Afford
          {variant === 'admin' ? (
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">Admin</span>
          ) : (
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">Stack</span>
          )}
        </span>
        {showSubtitle && (
          <span className="hidden sm:block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-flex cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
};
