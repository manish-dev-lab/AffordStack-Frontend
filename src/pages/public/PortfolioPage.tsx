import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../api/contentApi';
import type { PortfolioProject } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Student Project Guidance',
    'Developer Technical Support',
    'Business & Enterprise Software Development',
  ];

  useEffect(() => {
    setLoading(true);
    contentApi.getPortfolio({ category: selectedCategory })
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Track Record of Success</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Featured Engineering Portfolio
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Browse real software applications, academic project mentoring case studies, and performance engineering projects delivered across our tech stack.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading portfolio projects..." className="min-h-[40vh]" />
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No projects currently found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col group hover:-translate-y-1 hover:border-blue-500/40"
            >
              <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={p.thumbnailUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3.5 left-3.5 bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {p.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link to={`/portfolio/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {p.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {p.technologies?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-slate-200/60 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/portfolio/${p.slug}`}
                    className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-3">
                    {p.gitHubUrl && (
                      <a href={p.gitHubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white" title="GitHub">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {p.liveDemoUrl && (
                      <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Live Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
