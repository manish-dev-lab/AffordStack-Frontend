import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: November 2026</p>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2">
            When you submit a quotation enquiry or contact our team, we collect your name, email address, phone number, company/college name, and any uploaded requirement files or project descriptions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use this information exclusively to evaluate technical project feasibility, generate customized quotations, provide project updates, and correspond regarding requested software mentoring or support services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Non-Disclosure &amp; Code Privacy</h2>
          <p className="mt-2">
            All submitted project briefs, academic topics, source code samples, and business ideas are treated with strict confidentiality. We do not sell, rent, or distribute client specifications to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Data Security</h2>
          <p className="mt-2">
            We employ industry-standard encryption, parameterized PostgreSQL database access, and secure JWT-protected administrative endpoints to safeguard customer data.
          </p>
        </section>
      </div>
    </div>
  );
};
