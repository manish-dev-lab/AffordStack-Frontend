import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Wrench, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Award, 
  Star, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';
import { contentApi } from '../../api/contentApi';
import type { PortfolioProject, Testimonial } from '../../types';

export const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    contentApi.getPortfolio({ featuredOnly: true }).then(setFeaturedProjects).catch(() => {});
    contentApi.getTestimonials(true).then(setTestimonials).catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-32">
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-8 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Modern Full-Stack Engineering &bull; .NET 10 LTS &bull; React &bull; PostgreSQL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
            Engineering High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">Software Solutions</span> &amp; Academic Mentoring
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From MCA &amp; B.Tech university project defense to mission-critical ASP.NET Core &amp; PostgreSQL enterprise systems and on-demand developer bug fixing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-a-quote"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Request a Custom Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base px-8 py-4 rounded-2xl border border-slate-700/80 transition-all hover:border-slate-600"
            >
              Explore All Services
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 pt-12 border-t border-slate-800/80">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Project Viva Success Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">&lt; 24h</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Quotation Turnaround</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Enterprise</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Clean Architecture Standard</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight">PostgreSQL</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Optimized Database Schemas</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE SERVICE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Core Capabilities</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Services Tailored To Your Needs
          </p>
          <p className="mt-4 text-base text-slate-600">
            Whether you are a university student preparing your final defense, a software engineer solving a stubborn bug, or an enterprise digitizing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1: Student Project Guidance */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Student Project Guidance</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Dedicated mentoring for MCA, BCA, B.Tech and M.Tech final year major &amp; minor projects. Complete guidance from conceptualization to the final external viva evaluation.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>.NET 10, C# &amp; ASP.NET Core projects</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Java, Spring Boot &amp; Microservices</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>React &amp; Full-Stack TypeScript projects</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>1-on-1 code explanation &amp; viva mock prep</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>IEEE documentation &amp; synopsis support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/services/student-project-guidance"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
              >
                Explore Student Mentoring &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 2: Developer Technical Support */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Developer Technical Support</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Senior engineering assistance for software developers. We isolate root causes, fix production bugs, optimize slow queries, and solve authentication dilemmas.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>ASP.NET Core &amp; C# debugging &amp; deadlocks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>React frontend re-renders &amp; state fixes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>PostgreSQL &amp; SQL Server query optimization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>JWT token, refresh token &amp; CORS issues</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Architecture review &amp; code optimization</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/services/developer-technical-support"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
              >
                Get Developer Support &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 3: Business & Enterprise Development */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Software</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Full-cycle bespoke web application engineering. We design custom ERP, CRM, inventory, e-commerce, and admin platforms tailored to your business rules.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ERP &amp; multi-warehouse inventory systems</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CRM &amp; sales pipeline automation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Modern e-commerce &amp; automated invoicing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Docker containerization &amp; cloud setup</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% intellectual property &amp; source code</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/services/business-software-development"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
              >
                Explore Enterprise Dev &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TECHNOLOGY STACK SHOWCASE */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">Technology Excellence</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight">Battle-Tested Technologies We Master</p>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            We build exclusively with industry-standard, high-performance tech stacks that guarantee security, maintainability, and scalability.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">
            {[
              { name: '.NET 10 LTS', desc: 'High-performance C# Web API', icon: '⚡' },
              { name: 'React 19', desc: 'Interactive TypeScript UI', icon: '⚛️' },
              { name: 'PostgreSQL', desc: 'ACID Relational Database', icon: '🐘' },
              { name: 'Spring Boot', desc: 'Enterprise Java Ecosystem', icon: '☕' },
              { name: 'Python / Django', desc: 'Data & Backend Services', icon: '🐍' },
              { name: 'Docker & Cloud', desc: 'Containerized CI/CD', icon: '🐳' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center hover:bg-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="font-bold text-white text-base">{tech.name}</div>
                <div className="text-xs text-slate-400 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/technologies"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5"
            >
              Learn about our architectural approach &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CLIENT & STUDENT PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Proof of Capability</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Case Studies &amp; Projects
            </p>
          </div>
          <Link
            to="/portfolio"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            View Complete Portfolio &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(featuredProjects.length > 0 ? featuredProjects : [
            {
              id: 1,
              title: "Enterprise ERP & Multi-Warehouse Inventory System",
              slug: "enterprise-erp-inventory-system",
              shortDescription: "A complete enterprise resource planning suite with real-time stock tracking, automated purchase orders, and PDF invoicing.",
              category: "Business & Enterprise Software Development",
              thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
              technologies: [".NET 10", "React", "PostgreSQL", "QuestPDF"],
              liveDemoUrl: "#",
              gitHubUrl: "#"
            },
            {
              id: 2,
              title: "College Campus Placement & Student Performance Tracker (M.Tech)",
              slug: "campus-placement-student-tracker",
              shortDescription: "Mentored M.Tech students through clean architecture, automated criteria filtering, and university viva evaluation.",
              category: "Student Project Guidance",
              thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
              technologies: ["ASP.NET Core", "React", "PostgreSQL", "EF Core"],
              liveDemoUrl: "#",
              gitHubUrl: "#"
            }
          ]).map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={project.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {project.category}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    <Link to={`/portfolio/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                  >
                    View Case Study &rarr;
                  </Link>

                  <div className="flex items-center gap-3">
                    {project.gitHubUrl && (
                      <a href={project.gitHubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800" title="GitHub Source">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800" title="Live Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DEVELOPMENT PROCESS */}
      <section className="bg-blue-50/60 py-20 border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700">How We Work</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              A Transparent, 4-Step Engineering Lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Requirement & Scope',
                desc: 'Submit your project requirements, college guidelines, or bug details via our quote portal.',
              },
              {
                step: '02',
                title: 'Quotation & Architecture',
                desc: 'Receive an official PDF quotation breakdown, database design, and milestone schedule.',
              },
              {
                step: '03',
                title: 'Iterative Development',
                desc: 'Regular milestone progress updates with live demos, code reviews, and transparent tracking.',
              },
              {
                step: '04',
                title: 'Handover & Viva Prep',
                desc: 'Full source code delivery, local setup assistance, documentation, and 1-on-1 viva defense.',
              },
            ].map((step) => (
              <div key={step.step} className="bg-white rounded-3xl p-7 border border-blue-100 shadow-sm relative">
                <div className="text-3xl font-black text-blue-600/20 mb-3">{step.step}</div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Client Feedback</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Students &amp; Engineering Teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(testimonials.length > 0 ? testimonials : [
            {
              id: 1,
              clientName: "Rahul Sharma",
              clientRole: "M.Tech Student",
              companyOrInstitution: "NIT Rourkela",
              feedback: "The guidance on my Spring Boot and React project was outstanding. The 1-on-1 viva coaching helped me achieve an 'A' grade with special appreciation from the external examiner!",
              rating: 5,
              projectCategory: "Student Project Guidance",
              avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
            },
            {
              id: 2,
              clientName: "Vikram Patel",
              clientRole: "Lead Backend Engineer",
              companyOrInstitution: "Fintech Solutions Ltd",
              feedback: "We had a critical PostgreSQL locking and concurrency bug right before launch. Their developer support team pinpointed the uncommitted transaction issue in 2 hours.",
              rating: 5,
              projectCategory: "Developer Technical Support",
              avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"
            },
            {
              id: 3,
              clientName: "Priya Nambiar",
              clientRole: "Operations Director",
              companyOrInstitution: "Apex Logistics Hub",
              feedback: "They developed our customized warehouse and billing system from scratch. The quotation was clear, deliverables were met ahead of schedule, and the platform has transformed our daily dispatch.",
              rating: 5,
              projectCategory: "Business & Enterprise Software Development",
              avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
            }
          ]).map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{t.feedback}"
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                  alt={t.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.clientName}</div>
                  <div className="text-xs text-slate-500">{t.clientRole} &bull; {t.companyOrInstitution}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
