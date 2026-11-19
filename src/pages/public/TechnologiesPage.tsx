import React from 'react';
import { Link } from 'react-router-dom';
import { Code, CheckCircle2, ArrowRight } from 'lucide-react';

export const TechnologiesPage: React.FC = () => {
  const stack = [
    {
      category: 'Backend & Cloud APIs',
      technologies: [
        { name: 'ASP.NET Core (.NET 10 LTS)', level: 'Primary Backend', desc: 'High-performance compiled Web APIs with Minimal APIs, Controllers, and async pipelines.' },
        { name: 'C# 13', level: 'Language', desc: 'Modern, strongly typed object-oriented language with pattern matching and memory safety.' },
        { name: 'Entity Framework Core 10', level: 'ORM & Query Engine', desc: 'Compiled queries, migration management, and optimized relational mapping.' },
        { name: 'Java 21 & Spring Boot 3', level: 'Enterprise Java', desc: 'Spring Security, JPA, Spring Data, and scalable microservice APIs.' },
        { name: 'Python & Django REST', level: 'Analytics & Web', desc: 'Rapid prototyping, data manipulation with Pandas, and Django ORM.' },
      ],
    },
    {
      category: 'Frontend & Interactive UI',
      technologies: [
        { name: 'React 19', level: 'Primary Frontend', desc: 'Component architecture, concurrent rendering, and clean UI hooks.' },
        { name: 'TypeScript', level: 'Static Typing', desc: 'Strict interface contracts matching backend DTOs to eliminate runtime bugs.' },
        { name: 'Tailwind CSS v4', level: 'Design System', desc: 'Utility-first responsive styling with zero runtime CSS overhead.' },
        { name: 'Vite', level: 'Build Tooling', desc: 'Instant hot module replacement (HMR) and optimized Rollup tree-shaking.' },
        { name: 'Recharts', level: 'Data Visualizations', desc: 'Interactive SVG analytics charts for executive dashboard reporting.' },
      ],
    },
    {
      category: 'Database & Persistent Storage',
      technologies: [
        { name: 'PostgreSQL', level: 'Primary Relational DB', desc: 'ACID transactional integrity, JSONB support, composite indexing, and pgAdmin compatibility.' },
        { name: 'SQL Server', level: 'Enterprise DB', desc: 'T-SQL stored procedures, execution plan tuning, and enterprise failover.' },
        { name: 'MySQL', level: 'Open-Source Relational', desc: 'Standard relational schemas for open-source and legacy web apps.' },
        { name: 'Redis', level: 'Caching & Session', desc: 'In-memory key-value caching for flash-scale read throughput.' },
      ],
    },
    {
      category: 'DevOps & Tooling',
      technologies: [
        { name: 'Docker & Docker Compose', level: 'Containerization', desc: 'Reproducible local dev setups and containerized production cloud images.' },
        { name: 'QuestPDF', level: 'Document Generation', desc: 'Fluent C# vector engine producing pixel-perfect PDF quotations and invoices.' },
        { name: 'MailKit & MimeKit', level: 'Email Reliability', desc: 'Robust SMTP dispatch, HTML templates, and transactional outbox pattern.' },
        { name: 'Swagger / OpenAPI 3', level: 'Contract Documentation', desc: 'Interactive API playground and schema documentation.' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Architectural Standards</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
          Technology Stack &amp; Architecture
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          We adhere to modern Clean Architecture and SOLID design principles, guaranteeing maintainable, secure, and easily testable software systems.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {stack.map((group) => (
          <div key={group.category} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-3 flex items-center gap-2.5">
              <Code className="w-5 h-5 text-blue-600" />
              {group.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.technologies.map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Need a project built in one of these stacks?</h3>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          We configure the repository, database schema, CI/CD, and architecture tailored to your specific requirements.
        </p>
        <div className="pt-2">
          <Link
            to="/request-a-quote"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg"
          >
            Request Project Architecture &amp; Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
