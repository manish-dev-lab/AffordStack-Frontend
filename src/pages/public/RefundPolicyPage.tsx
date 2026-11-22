import React from 'react';
import { useCompanySettings } from '../../context/SettingsContext';

export const RefundPolicyPage: React.FC = () => {
  const settings = useCompanySettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: November 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Scope of Policy</h2>
          <p className="mt-2">
            This Cancellation and Refund Policy applies to all services provided by {settings.name || 'AffordStack'},
            including custom software development, technical bug resolution, enterprise architecture consulting, and student academic project guidance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. Cancellation Policy</h2>
          <p className="mt-2">
            Clients may request cancellation of a service or project engagement under the following conditions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>
              <strong>Initial Cancellation Window:</strong> Cancellation requests submitted within 24 hours of quotation approval or advance payment, prior to sprint initiation, are eligible for a 100% full refund (minus any standard payment gateway processing fees).
            </li>
            <li>
              <strong>Active Milestone Cancellation:</strong> Once development or technical consultation has commenced, clients may cancel subsequent uninitiated project phases or milestones at any point by providing written notice via email to <a href={`mailto:${settings.email}`} className="text-blue-600 underline">{settings.email}</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Milestone-Based Refund Policy</h2>
          <p className="mt-2">
            Because software engineering, system architecture, and mentoring involve custom professional effort:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>
              <strong>Completed &amp; Approved Milestones:</strong> Any milestone deliverable that has been reviewed, demonstrated, and accepted by the client is non-refundable.
            </li>
            <li>
              <strong>In-Progress Work:</strong> If a project is discontinued midway through an active phase, a fair prorated refund will be calculated based on verifiable deliverables completed up to the cancellation notice.
            </li>
            <li>
              <strong>Service Defect Rectification:</strong> If a delivered component fails to meet the itemized specifications defined in the accepted quotation, our engineering team provides free corrective bug fixing during the standard 30-day warranty window. If we are unable to rectify the technical defect, a full refund for that milestone will be promptly issued.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Refund Processing Timeline</h2>
          <p className="mt-2">
            Once a refund request is reviewed and approved by our billing department:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3 text-blue-900 font-medium">
            Approved refunds will be processed and credited back to the customer's original payment method (Credit/Debit Card, Net Banking, UPI, or Bank Account) within <strong>5 to 7 business days</strong>.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">5. Contact for Refund &amp; Billing Inquiries</h2>
          <p className="mt-2">
            To submit a cancellation or refund request, please reach out with your quotation number or transaction reference to:
          </p>
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-sm text-slate-800">
            <p><strong>Entity:</strong> {settings.name || 'AffordStack'}</p>
            <p><strong>Email:</strong> <a href={`mailto:${settings.email}`} className="text-blue-600 underline">{settings.email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${settings.phone}`} className="text-blue-600 underline">{settings.phone}</a></p>
            <p><strong>Address:</strong> {settings.address || 'Hyderabad, Telangana, India'}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
