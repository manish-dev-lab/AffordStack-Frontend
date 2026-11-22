import React from 'react';
import { useCompanySettings } from '../../context/SettingsContext';

export const ShippingDeliveryPolicyPage: React.FC = () => {
  const settings = useCompanySettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Shipping &amp; Digital Delivery Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: November 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Nature of Services (Electronic Delivery Only)</h2>
          <p className="mt-2">
            {settings.name || 'AffordStack'} is a technology and software consulting platform providing digital solutions, custom software engineering, cloud architecture, and technical mentoring services.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-3 text-emerald-900 font-medium">
            We do not produce or deliver physical items. All products, code bases, technical documentation, and services offered are delivered 100% electronically/digitally. Consequently, zero physical shipping or courier fees apply.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. Modes of Digital Delivery</h2>
          <p className="mt-2">
            Deliverables are transmitted through secure electronic channels based on the engagement type:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>
              <strong>Source Code &amp; Repositories:</strong> Transferred via private GitHub / GitLab repository invites or secure ZIP archives sent to the client's verified registered email address.
            </li>
            <li>
              <strong>Milestone Deployments &amp; Live Demos:</strong> Hosted on designated staging servers or deployed directly to client infrastructure as specified in the agreed project roadmap.
            </li>
            <li>
              <strong>Project Documentation &amp; Architecture Guides:</strong> Delivered in PDF format via email and accessible through the client portal enquiry tracking dashboard.
            </li>
            <li>
              <strong>Mentoring &amp; Live Technical Support:</strong> Conducted via interactive video conferencing and screen sharing (Google Meet, Zoom, or Microsoft Teams) at pre-scheduled slots.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Estimated Delivery Timelines</h2>
          <p className="mt-2">
            Delivery timelines depend on the scope and complexity stipulated in your quotation agreement:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>
              <strong>Developer Support &amp; Bug Fixing:</strong> Typically delivered within 24 to 48 hours from engagement confirmation.
            </li>
            <li>
              <strong>Academic &amp; Student Project Milestones:</strong> Delivered in scheduled phases, typically 3 to 7 business days per milestone.
            </li>
            <li>
              <strong>Custom Enterprise Applications:</strong> Delivered according to the sprint roadmap outlined in the signed quotation (typically 1 to 4 weeks per sprint milestone).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Delivery Confirmation &amp; Verification</h2>
          <p className="mt-2">
            Upon successful transmission or deployment of each milestone deliverable, an automated electronic delivery receipt and milestone sign-off notification is dispatched to the client's registered email address.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">5. Delivery Support &amp; Enquiries</h2>
          <p className="mt-2">
            If you have not received your digital deliverables within the estimated timeframe or need access re-granted, contact our technical support desk:
          </p>
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-sm text-slate-800">
            <p><strong>Entity:</strong> {settings.name || 'AffordStack'}</p>
            <p><strong>Email:</strong> <a href={`mailto:${settings.email}`} className="text-blue-600 underline">{settings.email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${settings.phone}`} className="text-blue-600 underline">{settings.phone}</a></p>
            <p><strong>Support Desk:</strong> Available Mon - Sat, 9:00 AM - 8:00 PM IST</p>
          </div>
        </section>
      </div>
    </div>
  );
};
