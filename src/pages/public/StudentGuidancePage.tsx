import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle2, Award, BookOpen, Terminal, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export const StudentGuidancePage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-6">
            <GraduationCap className="w-4 h-4" /> Academic Engineering Excellence
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl text-white">
            Major &amp; Minor College Project Guidance for MCA, BCA, B.Tech &amp; M.Tech
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Stop worrying about your final year project. We mentor you from ground zero: clean architecture design, database modeling, source code walkthroughs, IEEE documentation, and local setup guide to ensure top evaluations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-a-quote?category=Student%20Project%20Guidance"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              Get Guidance on Your Topic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Topics & Stacks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Technology Focus Areas</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Projects Across Popular Technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '.NET & C# Projects',
              desc: 'ASP.NET Core Web API, Entity Framework, SQL Server & PostgreSQL, JWT authentication, and clean architecture.',
              tech: ['.NET 10', 'C#', 'Web API', 'EF Core'],
            },
            {
              title: 'Java & Spring Boot',
              desc: 'Spring Boot 3, Spring Security, Hibernate ORM, REST API design, Microservices, and Angular/React UI.',
              tech: ['Java 21', 'Spring Boot', 'Hibernate', 'REST'],
            },
            {
              title: 'React & Full-Stack',
              desc: 'React 19, TypeScript, Tailwind CSS, Node.js or .NET backend, state management, and cloud deployment.',
              tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            },
            {
              title: 'Python & Django',
              desc: 'Django MVC, Django REST framework, data analytics dashboards, authentication, and SQLite/PostgreSQL.',
              tech: ['Python', 'Django', 'DRF', 'Analytics'],
            },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between hover:border-blue-500/40 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {item.tech.map((t) => (
                  <span key={t} className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 text-xs px-2 py-0.5 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comprehensive Assistance Highlights */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Complete Academic Lifecycle</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What Is Included In Every Mentoring Package
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Setup &amp; Execution</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Step-by-step local workstation installation, database script execution, SDK setup, and running the project smoothly on your personal laptop.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Source Code Walkthrough</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Line-by-line explanation of controllers, services, database models, algorithms, and frontend components so you understand every part of the application.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Setup &amp; Run Guide</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Step-by-step local machine setup, environment configuration, database seeding, dependency installation, and running instructions so your project executes seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Have an upcoming project review or synopsis deadline?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
          Send us your topic, college guidelines, or problem statement. We will formulate the complete architectural roadmap.
        </p>
        <div className="mt-8">
          <Link
            to="/request-a-quote?category=Student%20Project%20Guidance"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Submit Project Topic for Quote
          </Link>
        </div>
      </section>
    </div>
  );
};
