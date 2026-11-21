import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { enquiryApi } from '../../api/enquiryApi';
import { useUserAuth } from '../../context/UserAuthContext';
import { CountryCodeSelect } from '../../components/common/CountryCodeSelect';
import { 
  FileText, 
  Send, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  AlertCircle,
  Loader2,
  Search,
  UserCheck
} from 'lucide-react';
import { Reveal } from '../../components/common/Reveal';

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
  customBudgetAmount: z.string().optional(),
  expectedCompletionDate: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillCategory = searchParams.get('category') || '';
  const prefillService = searchParams.get('service') || '';
  const { user: clientUser, isUserAuthenticated } = useUserAuth();
  const alertRef = useRef<HTMLDivElement>(null);

  const [countryCode, setCountryCode] = useState('+91');
  const [isCustomBudget, setIsCustomBudget] = useState(false);
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      serviceCategoryName: prefillCategory || 'Student Project Guidance',
      projectTitle: prefillService ? `Guidance on ${prefillService}` : '',
      requiredTechnology: '.NET 10 / ASP.NET Core & React',
      estimatedBudget: '₹25,000 - ₹50,000',
      customBudgetAmount: '',
    },
  });

  // Auto-fill logged-in customer profile information
  useEffect(() => {
    if (clientUser) {
      if (clientUser.fullName) setValue('fullName', clientUser.fullName);
      if (clientUser.email) setValue('email', clientUser.email);
      if (clientUser.companyName) setValue('companyName', clientUser.companyName);
      if (clientUser.phoneNumber) {
        // Parse country code if present
        const phone = clientUser.phoneNumber.trim();
        if (phone.startsWith('+')) {
          const parts = phone.split(' ');
          if (parts.length > 1) {
            setCountryCode(parts[0]);
            setValue('phoneNumber', parts.slice(1).join(' '));
          } else {
            setValue('phoneNumber', phone);
          }
        } else {
          setValue('phoneNumber', phone);
        }
      }
    }
  }, [clientUser, setValue]);

  // Watch budget dropdown to toggle custom price input
  const selectedBudget = watch('estimatedBudget');
  useEffect(() => {
    if (selectedBudget === 'Custom Budget') {
      setIsCustomBudget(true);
    } else {
      setIsCustomBudget(false);
    }
  }, [selectedBudget]);

  // Scroll to top when confirmation is shown
  useEffect(() => {
    if (confirmation) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [confirmation]);

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fullPhone = values.phoneNumber.trim().startsWith('+')
        ? values.phoneNumber.trim()
        : `${countryCode} ${values.phoneNumber.trim()}`;

      const finalBudget = isCustomBudget && values.customBudgetAmount?.trim()
        ? `Custom: ${values.customBudgetAmount.trim()}`
        : values.estimatedBudget;

      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('phoneNumber', fullPhone);
      if (values.companyName) formData.append('companyName', values.companyName);
      formData.append('serviceCategoryName', values.serviceCategoryName);
      formData.append('requiredTechnology', values.requiredTechnology);
      formData.append('projectTitle', values.projectTitle);
      formData.append('projectDescription', values.projectDescription);
      formData.append('estimatedBudget', finalBudget);
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
      setTimeout(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while submitting your quotation. Please try again.';
      setSubmitError(errorMsg);
      setTimeout(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setSubmitError('File size exceeds the 20MB limit. Please upload a smaller file or send code via repository link.');
        setTimeout(() => {
          alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
        return;
      }
      setFileAttachment(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 transition-colors duration-200">
      {/* Header */}
      <Reveal animation="fade-up" className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> No Account Required &bull; 100% Confidential
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Request a Project Quotation &amp; Roadmap
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Submit your requirements below. Our technical architects will analyze your project scope and provide an itemized PDF quotation within 24 hours.
        </p>
      </Reveal>

      {/* Confirmation View */}
      {confirmation ? (
        <Reveal animation="scale-up">
          <div ref={alertRef} className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                Quotation Request Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                Enquiry Reference #{confirmation.referenceNumber}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                We have dispatched an automated confirmation email to{' '}
                <strong className="text-slate-900 dark:text-white">{confirmation.customerEmail}</strong> with your unique tracking reference.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left max-w-lg mx-auto space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Next Engineering Steps:
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li>Senior architect reviews architecture, modules &amp; timeline (4-12 hours).</li>
                <li>You will receive an official PDF quotation and interactive proposal by email.</li>
                <li>You can track the live technical review status at any time using your reference number.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={`/track-enquiry?ref=${confirmation.referenceNumber}&email=${encodeURIComponent(confirmation.customerEmail)}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Track Status Live
              </Link>
              <button
                type="button"
                onClick={() => {
                  setConfirmation(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        </Reveal>
      ) : (
        /* Form View */
        <Reveal animation="fade-up" delayMs={50}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-8">
            {isUserAuthenticated && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Logged in as <strong>{clientUser?.fullName}</strong> ({clientUser?.email}). Your account contact coordinates have been auto-filled.
                </span>
              </div>
            )}

            {submitError && (
              <div ref={alertRef} className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Section 1: Contact Information */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Your Contact Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We will send your quotation proposal and updates to these details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                      }`}
                      placeholder="e.g. Rahul Sharma"
                    />
                    {errors.fullName && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      {...register('email')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                        errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                      }`}
                      placeholder="e.g. rahul@example.com"
                    />
                    {errors.email && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="flex">
                      <CountryCodeSelect
                        value={countryCode}
                        onChange={setCountryCode}
                      />
                      <input
                        type="tel"
                        inputMode="tel"
                        {...register('phoneNumber')}
                        className={`w-full px-4 py-3 rounded-r-xl border border-l-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                          errors.phoneNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                        }`}
                        placeholder="98765 43210"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Company / College Name (Optional)
                    </label>
                    <input
                      type="text"
                      {...register('companyName')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      placeholder="e.g. NIT Rourkela / Infosys Ltd."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Project Scope & Technical Stack */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Service Category &amp; Project Requirements
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specify what type of assistance you require from our engineering group.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Service Category *
                    </label>
                    <select
                      {...register('serviceCategoryName')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Student Project Guidance">Student Project Guidance (Major/Minor/M.Tech)</option>
                      <option value="Developer Technical Support">Developer Technical Support (Bug Fixing, DB Tuning)</option>
                      <option value="Business & Enterprise Software">Business &amp; Enterprise Software (Custom SaaS, ERP)</option>
                      <option value="Cloud & DevOps Engineering">Cloud &amp; DevOps Engineering (Docker, CI/CD, AWS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Target Technology Stack *
                    </label>
                    <select
                      {...register('requiredTechnology')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Project Title / Summary *
                  </label>
                  <input
                    type="text"
                    {...register('projectTitle')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      errors.projectTitle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                    }`}
                    placeholder="e.g. Major Project: Hospital Telemedicine System with Video & Payments"
                  />
                  {errors.projectTitle && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.projectTitle.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Project Description &amp; Detailed Deliverables *
                  </label>
                  <textarea
                    rows={5}
                    {...register('projectDescription')}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      errors.projectDescription ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'
                    }`}
                    placeholder="Detail your requirements, modules needed, college guidelines, or specific bugs to resolve..."
                  />
                  {errors.projectDescription && (
                    <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.projectDescription.message}</p>
                  )}
                </div>
              </div>

              {/* Section 3: Budget, Schedule & Files */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Budget, Timeline &amp; Supplementary Files
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Estimated Budget Range *
                    </label>
                    <select
                      {...register('estimatedBudget')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Academic Project (< ₹15,000)">Academic Project (&lt; ₹15,000)</option>
                      <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                      <option value="₹30,000 - ₹60,000">₹30,000 - ₹60,000</option>
                      <option value="₹60,000 - ₹1,20,000">₹60,000 - ₹1,20,000</option>
                      <option value="Enterprise Custom (₹1,50,000+)">Enterprise Custom (₹1,50,000+)</option>
                      <option value="Custom Budget">Custom Budget (Specify your own price)</option>
                    </select>

                    {/* Custom Budget Amount Input */}
                    {isCustomBudget && (
                      <div className="mt-3 animate-in fade-in duration-150">
                        <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                          Type Your Custom Budget *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          {...register('customBudgetAmount')}
                          placeholder="Enter your estimated project budget (e.g. ₹50,000)"
                          className="w-full px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/40 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Expected Completion Date
                    </label>
                    <input
                      type="date"
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      {...register('expectedCompletionDate')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
                    />
                  </div>
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Attach Specification / Problem Statement / Synopsis (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.zip,.rar,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer block">
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        Upload architecture document or code zip
                      </span>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP, PNG up to 20MB</p>
                    </label>
                    {fileAttachment && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900">
                        <FileText className="w-4 h-4" />
                        <span>{fileAttachment.name} ({(fileAttachment.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <button
                          type="button"
                          onClick={() => setFileAttachment(null)}
                          className="text-rose-500 hover:text-rose-700 ml-2 font-bold cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Additional Requirements or Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={4}
                    {...register('additionalRequirements')}
                    className="w-full min-h-[125px] p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Mention specific framework versions, database requirements, or presentation slides needed..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  By submitting, you will receive an automated tracking code. No upfront payment required.
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Submitting Specification...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Official Quotation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}
    </div>
  );
};
