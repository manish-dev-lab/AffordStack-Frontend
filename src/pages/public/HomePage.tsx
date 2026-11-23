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
  Search,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';
import { contentApi } from '../../api/contentApi';
import type { PortfolioProject, Testimonial } from '../../types';
import { Reveal } from '../../components/common/Reveal';
import { MovingBanner } from '../../components/common/MovingBanner';
import { HeroBannerCarousel } from '../../components/home/HeroBannerCarousel';

export const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    contentApi.getPortfolio({ featuredOnly: true }).then(setFeaturedProjects).catch(() => {});
    contentApi.getTestimonials(true).then(setTestimonials).catch(() => {});
  }, []);

  return (
    <div className="pb-24 overflow-x-hidden transition-colors duration-200">
      {/* 1. AMAZON-STYLE AUTO-SCROLLING HERO BANNER CAROUSEL (Edge-to-Edge) */}
      <HeroBannerCarousel />

      {/* LIVE MOVING MARQUEE TICKER (Connected flush to Hero Banner with 0 gap) */}
      <MovingBanner />

      <div className="space-y-16 sm:space-y-24 mt-12 sm:mt-16">
        {/* 2. THREE CORE SERVICE PILLARS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Our Core Capabilities</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comprehensive Services Tailored To Your Needs
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Whether you are an aspiring student building your minor or major project, a software engineer solving a stubborn bug, or a business launching a low-cost website.
            </p>
          </Reveal>

          {/* Responsive Layout: Smooth Horizontal Scroll on Mobile, Grid on Tablet/Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-8">
            {/* Pillar 1: Student Project Guidance */}
            <div className="w-[85vw] sm:w-auto shrink-0 snap-center sm:shrink">
              <Reveal animation="slide-left" delayMs={100} className="h-full">
                <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all flex flex-col justify-between group hover:-translate-y-1">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Student Project Guidance</h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Dedicated mentoring for MCA, BCA, B.Tech and M.Tech final year major &amp; minor projects. Complete guidance from conceptualization to full code delivery, project documentation, and local setup.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>.NET 10, C# &amp; ASP.NET Core projects</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Java, Spring Boot &amp; Microservices</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>React &amp; Full-Stack TypeScript projects</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>1-on-1 code explanation &amp; setup walkthrough</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>IEEE documentation &amp; synopsis support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/services/student-project-guidance"
                      className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                    >
                      Explore Student Mentoring &rarr;
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Pillar 2: Developer Technical Support */}
            <div className="w-[85vw] sm:w-auto shrink-0 snap-center sm:shrink">
              <Reveal animation="fade-up" delayMs={200} className="h-full">
                <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group hover:-translate-y-1">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Developer Technical Support</h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Senior engineering assistance for software developers. We isolate root causes, fix production bugs, optimize slow queries, and solve authentication dilemmas with milestone billing.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>ASP.NET Core &amp; C# debugging &amp; deadlocks</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>React frontend re-renders &amp; state fixes</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>PostgreSQL &amp; SQL Server query optimization</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>JWT token, refresh token &amp; CORS issues</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Architecture review &amp; code optimization</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/services/developer-technical-support"
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                    >
                      Get Developer Support &rarr;
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Pillar 3: Business & Enterprise Development */}
            <div className="w-[85vw] sm:w-auto shrink-0 snap-center sm:shrink">
              <Reveal animation="slide-right" delayMs={300} className="h-full">
                <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group hover:-translate-y-1">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Low-Cost Business Websites &amp; Software</h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Affordable, high-quality bespoke software and websites. We empower startups, local enterprises, and businesses to launch custom platforms at affordable low budget.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Low-cost business websites &amp; custom portals</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>ERP &amp; inventory management systems</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>CRM &amp; automated customer billing platforms</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Docker containerization &amp; cloud deployment</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>100% intellectual property &amp; full source code</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/services/business-enterprise-software"
                      className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                    >
                      Explore Business Solutions &rarr;
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

      {/* 3. TECHNOLOGY STACK SHOWCASE */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal animation="fade-up">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">Technology Excellence</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">Battle-Tested Technologies We Master</p>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
              We build exclusively with industry-standard, high-performance tech stacks that guarantee security, maintainability, and scalability.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">
            {[
              { name: '.NET 10 LTS', desc: 'High-performance C# Web API', icon: '⚡' },
              { name: 'React 19', desc: 'Interactive TypeScript UI', icon: '⚛️' },
              { name: 'PostgreSQL', desc: 'ACID Relational Database', icon: '🐘' },
              { name: 'Spring Boot', desc: 'Enterprise Java Ecosystem', icon: '☕' },
              { name: 'Python / Django', desc: 'Data & Backend Services', icon: '🐍' },
              { name: 'Docker & Cloud', desc: 'Containerized CI/CD', icon: '🐳' },
            ].map((tech, idx) => (
              <Reveal key={tech.name} animation="scale-up" delayMs={idx * 75}>
                <div className="h-full bg-slate-800/60 dark:bg-slate-900/80 border border-slate-700/60 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                  <div className="text-3xl mb-3">{tech.icon}</div>
                  <div className="font-bold text-white text-base">{tech.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{tech.desc}</div>
                </div>
              </Reveal>
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
          <Reveal animation="fade-up" className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Proof of Capability</h2>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Case Studies &amp; Projects
              </p>
            </div>
            <Link
              to="/portfolio"
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5"
            >
              View Complete Portfolio &rarr;
            </Link>
          </Reveal>

          {/* Responsive Layout: Smooth Horizontal Scroll on Mobile, Grid on Tablet/Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-8">
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
                shortDescription: "Mentored M.Tech students through clean architecture, automated criteria filtering, and university project demonstration & code walkthrough.",
                category: "Student Project Guidance",
                thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
                technologies: ["ASP.NET Core", "React", "PostgreSQL", "EF Core"],
                liveDemoUrl: "#",
                gitHubUrl: "#"
              }
            ]).map((project, idx) => (
              <div key={project.id} className="w-[85vw] sm:w-auto shrink-0 snap-center sm:shrink">
                <Reveal animation={idx % 2 === 0 ? 'slide-left' : 'slide-right'} delayMs={idx * 100} className="h-full">
                  <div className="h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all group flex flex-col">
                    <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={project.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link to={`/portfolio/${project.slug}`}>{project.title}</Link>
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {project.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <Link
                          to={`/portfolio/${project.slug}`}
                          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5"
                        >
                          View Case Study &rarr;
                        </Link>

                        <div className="flex items-center gap-3">
                          {project.gitHubUrl && (
                            <a href={project.gitHubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white" title="GitHub Source">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveDemoUrl && (
                            <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Live Preview">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* 5. DEVELOPMENT PROCESS */}
        <section className="bg-blue-50/70 dark:bg-slate-900/60 py-16 sm:py-20 border-y border-blue-100/70 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">How We Work</h2>
              <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                A Transparent, 4-Step Engineering Lifecycle
              </p>
            </Reveal>

            {/* Responsive Layout: Smooth Horizontal Scroll on Mobile, Grid on Tablet/Desktop */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-8">
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
                  title: 'Handover & Project Setup',
                  desc: 'Full source code delivery, local setup assistance, documentation, and 1-on-1 code walkthrough.',
                },
              ].map((step, idx) => (
                <div key={step.step} className="w-[74vw] sm:w-auto shrink-0 snap-center sm:shrink">
                  <Reveal animation="fade-up" delayMs={idx * 100} className="h-full">
                    <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-blue-100 dark:border-slate-800 shadow-sm relative hover:border-blue-400 transition-colors">
                      <div className="text-3xl font-black text-blue-600/20 dark:text-blue-400/20 mb-3">{step.step}</div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Client Feedback</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted by Students &amp; Engineering Teams
            </p>
          </Reveal>

          {/* Responsive Layout: Smooth Horizontal Scroll on Mobile, Grid on Tablet/Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-8">
            {(testimonials.length > 0 ? testimonials : [
              {
                id: 1,
                clientName: "Rahul Sharma",
                clientRole: "M.Tech Student",
                companyOrInstitution: "NIT Rourkela",
                feedback: "The guidance on my Spring Boot and React project was outstanding. The 1-on-1 code walkthrough and documentation helped me achieve an 'A' grade with special appreciation from my department!",
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
            ]).map((t, idx) => (
              <div key={t.id} className="w-[84vw] sm:w-auto shrink-0 snap-center sm:shrink">
                <Reveal animation="fade-up" delayMs={idx * 120} className="h-full">
                  <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between hover:border-blue-400 transition-colors">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-4">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed">
                        "{t.feedback}"
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={t.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{t.clientName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t.clientRole} &bull; {t.companyOrInstitution}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
