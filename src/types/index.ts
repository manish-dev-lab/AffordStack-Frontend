// Common API Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Auth
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AdminUser;
}

// Services
export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
  services: ServiceItem[];
}

export interface ServiceItem {
  id: number;
  serviceCategoryId: number;
  serviceCategoryName?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  technologies: string[];
  benefits: string[];
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

// Portfolio
export interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  thumbnailUrl?: string;
  liveDemoUrl?: string;
  gitHubUrl?: string;
  technologies: string[];
  features: string[];
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

// Blog
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  blogCategoryId?: number;
  categoryName?: string;
  thumbnailUrl?: string;
  authorName: string;
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  tags: string[];
  createdAt: string;
}

// Testimonials
export interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  companyOrInstitution: string;
  feedback: string;
  rating: number;
  avatarUrl?: string;
  projectCategory?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

// Enquiries
export type EnquiryStatus = 'New' | 'Reviewed' | 'Quoted' | 'FollowUp' | 'Converted' | 'Closed' | 'Spam';

export interface EnquiryListItem {
  id: number;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  serviceCategoryName?: string;
  requiredTechnology: string;
  projectTitle: string;
  estimatedBudget: string;
  status: EnquiryStatus | number;
  createdAt: string;
  notesCount: number;
  quotationsCount: number;
}

export interface EnquiryDetail {
  id: number;
  referenceNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  serviceCategoryId?: number;
  serviceCategoryName?: string;
  requiredTechnology: string;
  projectTitle: string;
  projectDescription: string;
  estimatedBudget: string;
  expectedCompletionDate?: string;
  additionalRequirements?: string;
  status: EnquiryStatus | number;
  createdAt: string;
  attachments: EnquiryAttachment[];
  notes: EnquiryNote[];
}

export interface EnquiryAttachment {
  id: number;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface EnquiryNote {
  id: number;
  authorName?: string;
  noteContent: string;
  createdAt: string;
}

// Quotations
export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired' | 'Cancelled';

export interface QuotationItem {
  id?: number;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: number;
  quotationNumber: string;
  enquiryId: number;
  enquiryReferenceNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  serviceDescription: string;
  deliverables: string;
  developmentCost: number;
  additionalCost: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  advancePaymentAmount: number;
  remainingPaymentAmount: number;
  expectedDeliveryDate: string;
  validityDays: number;
  validUntil: string;
  termsAndConditions: string;
  status: QuotationStatus | number;
  secureToken: string;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  responseRemarks?: string;
  createdAt: string;
  items: QuotationItem[];
  projectId?: number;
}

export interface PublicQuotation {
  quotationNumber: string;
  secureToken: string;
  customerName: string;
  companyName?: string;
  serviceDescription: string;
  deliverables: string;
  developmentCost: number;
  additionalCost: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  advancePaymentAmount: number;
  remainingPaymentAmount: number;
  expectedDeliveryDate: string;
  validUntil: string;
  termsAndConditions: string;
  status: QuotationStatus | number;
  respondedAt?: string;
  responseRemarks?: string;
  items: QuotationItem[];
}

export interface EnquiryTracking {
  id: number;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  projectTitle: string;
  projectDescription: string;
  serviceCategoryName?: string;
  requiredTechnology: string;
  estimatedBudget: string;
  status: EnquiryStatus | number;
  statusDisplay: string;
  statusDescription: string;
  stepIndex: number;
  createdAt: string;
  updatedAt?: string;
  activeQuotation?: PublicQuotation;
}

// Projects
export type ProjectStatus = 'NotStarted' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';

export interface ProjectMilestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  amount: number;
}

export interface Project {
  id: number;
  projectNumber: string;
  quotationId?: number;
  quotationNumber?: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectTitle: string;
  description: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  agreedAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  status: ProjectStatus | number;
  progressPercentage: number;
  assignedDeveloper?: string;
  internalNotes?: string;
  createdAt: string;
  milestones: ProjectMilestone[];
}

// Payments
export type PaymentType = 'Advance' | 'Milestone' | 'Final' | 'Additional';
export type PaymentStatus = 'Pending' | 'Received' | 'Refunded';

export interface Payment {
  id: number;
  projectId: number;
  projectNumber: string;
  projectTitle: string;
  customerId: number;
  customerName: string;
  paymentType: PaymentType | number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  status: PaymentStatus | number;
  notes?: string;
  createdAt: string;
}

// Customers
export interface CustomerItem {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  enquiriesCount: number;
  quotationsCount: number;
  projectsCount: number;
  createdAt: string;
}

// Dashboard
export interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  pendingQuotations: number;
  acceptedQuotations: number;
  rejectedQuotations: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenueRecorded: number;
  pendingPayments: number;
  monthlyEnquiries: { month: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  serviceCategoryDistribution: { categoryName: string; count: number }[];
  projectStatusDistribution: { status: string; count: number }[];
}

// User Accounts & Customer Portal
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  totalEnquiries: number;
  activeQuotations: number;
  activeProjects: number;
}

export interface UserLoginResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}

export interface UserEnquirySummary {
  id: number;
  referenceNumber: string;
  projectTitle: string;
  projectDescription: string;
  requiredTechnology: string;
  estimatedBudget: string;
  status: EnquiryStatus | number;
  statusDisplay: string;
  createdAt: string;
  quotationNumber?: string;
  quotationSecureToken?: string;
  quotationAmount?: number;
  quotationStatus?: QuotationStatus | number;
}

export interface AdminUserAccount {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  enquiriesCount: number;
  quotationsCount: number;
}

// System Configurations
export interface TokenConfig {
  tokenTimeoutMinutes: number;
  refreshTokenDays: number;
}

export interface EmailConfig {
  emailsEnabled: boolean;
  sendCustomerNotifications: boolean;
  sendAdminNotifications: boolean;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  adminNotificationEmail: string;
  enableSsl: boolean;
}

export interface WebsiteConfig {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  contactAddress: string;
  maintenanceMode: boolean;
}

export interface AppConfigItem {
  key: string;
  value: string;
  description?: string;
  updatedAt?: string;
}
