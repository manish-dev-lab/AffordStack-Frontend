import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../api/contentApi';
import type { ServiceCategory } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { GraduationCap, Wrench, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getServiceCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('student')) return <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
    if (slug.includes('developer') || slug.includes('support')) return <Wrench className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
    return <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading service catalog..." className="min-h-[50vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Enterprise &amp; Academic Expertise</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Specialized Software Engineering Services
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          We categorize our technical services into three dedicated divisions to provide tailored depth, industry-grade architectures, and dedicated guidance.
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-24">
        {categories.map((cat, idx) => (
          <section key={cat.id} id={cat.slug} className="scroll-mt-24">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {idx + 1}. {cat.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{cat.description}</p>
                </div>
              </div>

              <Link
                to={`/services/${cat.slug}`}
                className="shrink-0 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5"
              >
                Learn More About Division &rarr;
              </Link>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1 hover:border-blue-500/40"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Key Features</div>
                        {service.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technologies tags */}
                    {service.technologies && service.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {service.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 text-xs px-2.5 py-0.5 rounded-md font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      to={`/request-a-quote?category=${encodeURIComponent(cat.name)}&service=${encodeURIComponent(service.title)}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      Request Quote
                    </Link>

                    <Link
                      to={`/services/${cat.slug}`}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
