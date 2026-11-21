import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentApi } from '../../api/contentApi';
import type { PortfolioProject } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowLeft, ExternalLink, CheckCircle2, Calendar } from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    contentApi.getPortfolioBySlug(slug)
      .then(setProject)
      .catch((err) => setError(err.message || 'Project not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading case study..." className="min-h-[50vh]" />;
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Project Not Found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{error || 'The requested project could not be found.'}</p>
        <Link to="/portfolio" className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* Back button */}
      <div>
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>

      {/* Hero header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
          {project.category}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Live Demonstration
            </a>
          )}
          {project.gitHubUrl && (
            <a
              href={project.gitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors border border-slate-700"
            >
              <GithubIcon className="w-4 h-4" /> GitHub Repository
            </a>
          )}
          <Link
            to={`/request-a-quote?service=${encodeURIComponent(project.title)}`}
            className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Request Similar Project
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {project.thumbnailUrl && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 aspect-video max-h-[500px]">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Grid: Detailed Overview & Architecture Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Detailed Case Study</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {project.detailedDescription}
            </div>
          </div>

          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Architectural Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Tech Stack Applied</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200/60 dark:border-blue-900"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Active Project'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
