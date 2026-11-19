import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShoppingCart, Users, FolderKanban, Cloud, ShieldCheck, ArrowRight } from 'lucide-react';

export const EnterpriseDevPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-6">
            <Building2 className="w-4 h-4" /> Full-Cycle Enterprise Engineering
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl">
            Custom Business &amp; Enterprise Software Development
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Eliminate repetitive manual bottlenecks and rigid per-seat licensing. We engineer custom web applications, ERPs, CRMs, inventory managers, and multi-tenant SaaS platforms tailored to your business rules.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-a-quote?category=Enterprise%20Application%20Development"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              Start Enterprise Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              title: 'Bespoke ERP & Internal Tools',
              desc: 'Tailored operational workflows, departmental role permissions, automated PDF invoice/receipt generators, and executive analytics.',
            },
            {
              icon: ShoppingCart,
              title: 'E-Commerce & Inventory Platforms',
              desc: 'High-speed digital catalogs, multi-warehouse stock reservation, automated reordering, and integrated billing systems.',
            },
            {
              icon: Users,
              title: 'CRM & Client Portals',
              desc: 'Lead tracking, customer quotation lifecycle, proposal acceptance tokens, transaction histories, and automated email notifications.',
            },
            {
              icon: FolderKanban,
              title: 'Booking & Scheduling Engines',
              desc: 'Real-time calendar slot management, reservation processing, automated email confirmations, and cancellation policies.',
            },
            {
              icon: Cloud,
              title: 'Cloud Deployment & DevOps',
              desc: 'Docker containerization, Nginx reverse proxy configuration, automated SSL certificates, and CI/CD deployment pipelines.',
            },
            {
              icon: ShieldCheck,
              title: 'Ongoing Maintenance & Support',
              desc: 'Guaranteed SLAs, automated database backups, security patches, performance monitoring, and continuous feature expansion.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
