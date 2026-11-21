import React from 'react';

export interface CountryCode {
  code: string;
  iso: string;
  country: string;
  flag: string;
}

export const POPULAR_COUNTRY_CODES: CountryCode[] = [
  { code: '+91', iso: 'IN', country: 'India', flag: '🇮🇳' },
  { code: '+1', iso: 'US', country: 'USA/CA', flag: '🇺🇸' },
  { code: '+44', iso: 'UK', country: 'UK', flag: '🇬🇧' },
  { code: '+61', iso: 'AU', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', iso: 'AE', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', iso: 'SG', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', iso: 'DE', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', iso: 'FR', country: 'France', flag: '🇫🇷' },
  { code: '+81', iso: 'JP', country: 'Japan', flag: '🇯🇵' },
  { code: '+966', iso: 'SA', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+60', iso: 'MY', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+64', iso: 'NZ', country: 'New Zealand', flag: '🇳🇿' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  disabled?: boolean;
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-[84px] sm:w-[94px] px-1.5 sm:px-2 py-2.5 rounded-l-xl border-r-0 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer shrink-0 truncate ${className}`}
      aria-label="Country Dialing Code"
    >
      {POPULAR_COUNTRY_CODES.map((c) => (
        <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          {c.code} {c.iso}
        </option>
      ))}
    </select>
  );
};
