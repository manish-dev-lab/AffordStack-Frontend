import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Terms and Conditions</h1>
      <p className="text-sm text-slate-500">Last updated: November 2026</p>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Quotations and Service Agreements</h2>
          <p className="mt-2">
            All quotations generated through our platform reflect an itemized project scope, deliverables, and financial terms. A formal contract is established once a quotation proposal is accepted by the client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. Payment Milestones</h2>
          <p className="mt-2">
            Standard development projects require a 40% advance payment to initiate development and sprint planning. Remaining milestone payments are structured according to agreed project phases and final delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Academic Mentoring Ethics</h2>
          <p className="mt-2">
            For student projects, our mentoring focuses on architectural coaching, technical understanding, code explanation, and viva defense. Students are encouraged to actively engage in the learning process to defend their projects successfully.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Source Code Ownership</h2>
          <p className="mt-2">
            Upon receipt of final agreed payment, complete source code, database scripts, and project assets are fully transferred to the client with unrestricted ownership rights.
          </p>
        </section>
      </div>
    </div>
  );
};
