import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { useSettings } from '../../context/SettingsContext';
import { AlertTriangle } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {settings.isUnderMaintenance && (
        <div className="sticky top-0 z-[60] bg-amber-500 dark:bg-amber-600 text-slate-950 font-semibold px-4 py-2 text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
          <span>Notice: Platform maintenance is currently underway. Public submissions and account services may be limited.</span>
        </div>
      )}
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
