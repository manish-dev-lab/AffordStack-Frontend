import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { enquiryApi } from '../../api/enquiryApi';
import { 
  FileText, 
  Send, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  FileSpreadsheet, 
  Clock, 
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(6, 'Please enter a valid phone number'),
  companyName: z.string().optional(),
  serviceCategoryName: z.string().min(1, 'Please select a service category'),
  requiredTechnology: z.string().min(1, 'Please select or type your required technology'),
  projectTitle: z.string().min(4, 'Project title must be at least 4 characters'),
  projectDescription: z.string().min(15, 'Please provide more details (at least 15 characters)'),
  estimatedBudget: z.string().min(1, 'Please select an estimated budget range'),
  expectedCompletionDate: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillCategory = searchParams.get('category') || '';
  const prefillService = searchParams.get('service') || '';

  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    referenceNumber: string;
    message: string;
    customerEmail: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceCategoryName: prefillCategory || 'Student Project Guidance',
      projectTitle: prefillService ? `Guidance on ${prefillService}` : '',
      requiredTechnology: '.NET 10 / ASP.NET Core & React',
      estimatedBudget: '₹25,000 - ₹50,000',
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phoneNumber);
      if (values.companyName) formData.append('companyName', values.companyName);
      formData.append('serviceCategoryName', values.serviceCategoryName);
      formData.append('requiredTechnology', values.requiredTechnology);
      formData.append('projectTitle', values.projectTitle);
      formData.append('projectDescription', values.projectDescription);
      formData.append('estimatedBudget', values.estimatedBudget);
      if (values.expectedCompletionDate) {
        formData.append('expectedCompletionDate', values.expectedCompletionDate);
      }
      if (values.additionalRequirements) {
        formData.append('additionalRequirements', values.additionalRequirements);
      }
      if (fileAttachment) {
        formData.append('attachment', fileAttachment);
      }

      const res = await enquiryApi.submitEnquiryForm(formData);
      setConfirmation({
        referenceNumber: res.referenceNumber,
        message: res.message,
        customerEmail: values.email,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while submitting your quotation. Please try again.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit.');
        return;
      }
      setFileAttachment(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> No Account Required &bull; 100% Confidential
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Request a Project Quotation &amp; Roadmap
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Submit your requirements below. Our technical architects will analyze your project scope and provide an itemized PDF quotation within 24 hours.
        </p>
      </div>

      {/* Confirmation View */}
      {confirmation ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Quotation Request Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Enquiry Reference #{confirmation.referenceNumber}
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              We have dispatched an automated confirmation email to{' '}
              <strong className="text-slate-900">{confirmation.customerEmail}</strong> with your unique tracking reference.
            </p>
          </div>

          {/* Next steps breakdown */}
          <div className="bg-slate-50 rounded-2xl p-6 text-left max-w-xl mx-auto border border-slate-200/70 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> What happens next?
            </h3>
            <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-600">
              <li>Our senior architects review your project specifications and technical scope.</li>
              <li>An official, itemized PDF quotation breakdown will be generated and emailed to you.</li>
              <li>You can review the deliverables, costs, and accept or reject the proposal with one click.</li>
            </ol>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setConfirmation(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Submit Another Quotation Request
            </button>
            <Link
              to="/"
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        /* Quotation Form */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl">
          {submitError && (
            <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Section 1: Contact Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Your Contact Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">We will send your quotation proposal and updates to these details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                    placeholder="e.g. Rahul Sharma"
                  />
                  {errors.fullName && <p className="text-rose-600 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                    placeholder="e.g. rahul@example.com"
                  />
                  {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phoneNumber')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      errors.phoneNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phoneNumber && <p className="text-rose-600 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Company / College Name (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('companyName')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="e.g. NIT Rourkela or Acme Tech"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Project Specifications */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Service Category &amp; Technology Requirements
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Service Category *
                  </label>
                  <select
                    {...register('serviceCategoryName')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Student Project Guidance">Student Project Guidance (B.Tech / MCA)</option>
                    <option value=".NET Development">.NET Development</option>
                    <option value="Java / Spring Boot Development">Java / Spring Boot Development</option>
                    <option value="React Development">React Development</option>
                    <option value="Full-Stack Application Development">Full-Stack Application Development</option>
                    <option value="Bug Fixing">Bug Fixing &amp; Developer Support</option>
                    <option value="API Development">API Development &amp; Integrations</option>
                    <option value="Database Development">Database Development &amp; Optimization</option>
                    <option value="E-commerce Development">E-commerce Development</option>
                    <option value="Business Website Development">Business Website Development</option>
                    <option value="Enterprise Application Development">Enterprise Application Development (ERP/CRM)</option>
                    <option value="Other">Other Custom Requirement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Required Technology *
                  </label>
                  <select
                    {...register('requiredTechnology')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value=".NET 10 / ASP.NET Core & React">.NET 10 / ASP.NET Core &amp; React (Recommended)</option>
                    <option value="Java 21 / Spring Boot & React">Java 21 / Spring Boot &amp; React</option>
                    <option value="Full-Stack React, Node.js & TypeScript">Full-Stack React, Node.js &amp; TypeScript</option>
                    <option value="Python / Django & PostgreSQL">Python / Django &amp; PostgreSQL</option>
                    <option value="PostgreSQL / SQL Server Database Only">PostgreSQL / SQL Server Database Only</option>
                    <option value="Other Technology Stack">Other Technology Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project Title / Summary *
                </label>
                <input
                  type="text"
                  {...register('projectTitle')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.projectTitle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Major Project: Hospital Telemedicine System with Video & Payments"
                />
                {errors.projectTitle && <p className="text-rose-600 text-xs mt-1">{errors.projectTitle.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project Description &amp; Detailed Deliverables *
                </label>
                <textarea
                  rows={5}
                  {...register('projectDescription')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.projectDescription ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  placeholder="Detail your requirements, modules needed, college guidelines, or specific bugs to resolve..."
                />
                {errors.projectDescription && (
                  <p className="text-rose-600 text-xs mt-1">{errors.projectDescription.message}</p>
                )}
              </div>
            </div>

            {/* Section 3: Budget, Schedule & Files */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Budget, Timeline &amp; Supplementary Files
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Budget *
                  </label>
                  <select
                    {...register('estimatedBudget')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Academic Project (< ₹15,000)">Academic Project (&lt; ₹15,000)</option>
                    <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                    <option value="₹30,000 - ₹60,000">₹30,000 - ₹60,000</option>
                    <option value="₹60,000 - ₹1,20,000">₹60,000 - ₹1,20,000</option>
                    <option value="Enterprise Custom (₹1,50,000+)">Enterprise Custom (₹1,50,000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Expected Completion Date
                  </label>
                  <input
                    type="date"
                    {...register('expectedCompletionDate')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Attach Specification / Problem Statement / Synopsis (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    accept=".pdf,.zip,.rar,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-semibold text-slate-800">
                      {fileAttachment ? fileAttachment.name : 'Click to select or drag and drop file'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PDF, ZIP, DOCX, PNG, JPG (Max 20MB)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Additional Notes or Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  {...register('additionalRequirements')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Any particular university constraints, examiner requests, or deployment instructions..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base px-8 rounded-2xl shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2.5 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                ) : (
                  <Send className="w-5 h-5 shrink-0" />
                )}
                <span>{isSubmitting ? 'Submitting & Generating Reference...' : 'Submit Quotation Request'}</span>
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                By submitting this form, an enquiry reference will be generated and confirmation emailed automatically.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
