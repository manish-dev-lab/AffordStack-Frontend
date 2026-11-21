import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Guards
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { UserProtectedRoute } from './components/layout/UserProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { StudentGuidancePage } from './pages/public/StudentGuidancePage';
import { TechSupportPage } from './pages/public/TechSupportPage';
import { EnterpriseDevPage } from './pages/public/EnterpriseDevPage';
import { PortfolioPage } from './pages/public/PortfolioPage';
import { PortfolioDetailPage } from './pages/public/PortfolioDetailPage';
import { TechnologiesPage } from './pages/public/TechnologiesPage';
import { AboutPage } from './pages/public/AboutPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostDetailPage } from './pages/public/BlogPostDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { RequestQuotePage } from './pages/public/RequestQuotePage';
import { PublicQuoteDecisionPage } from './pages/public/PublicQuoteDecisionPage';
import { TrackEnquiryPage } from './pages/public/TrackEnquiryPage';
import { UserLoginPage } from './pages/public/UserLoginPage';
import { UserDashboardPage } from './pages/public/UserDashboardPage';
import { UserProfilePage } from './pages/public/UserProfilePage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { ScrollToTop } from './components/common/ScrollToTop';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <UserAuthProvider>
            <SettingsProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/student-project-guidance" element={<StudentGuidancePage />} />
                  <Route path="/services/developer-technical-support" element={<TechSupportPage />} />
                  <Route path="/services/business-enterprise-software" element={<EnterpriseDevPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
                  <Route path="/technologies" element={<TechnologiesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/quote" element={<RequestQuotePage />} />
                  <Route path="/request-a-quote" element={<RequestQuotePage />} />
                  <Route path="/track-enquiry" element={<TrackEnquiryPage />} />
                  <Route path="/track" element={<TrackEnquiryPage />} />
                  <Route path="/quote/:token" element={<PublicQuoteDecisionPage />} />
                  <Route path="/quote/:secureToken" element={<PublicQuoteDecisionPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Customer Auth & Account Pages */}
                  <Route path="/user/login" element={<UserLoginPage />} />
                  <Route path="/user" element={<UserProtectedRoute />}>
                    <Route index element={<Navigate to="/user/dashboard" replace />} />
                    <Route path="dashboard" element={<UserDashboardPage />} />
                    <Route path="profile" element={<UserProfilePage />} />
                  </Route>
                </Route>

                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Console Routes */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="enquiries" element={<AdminEnquiriesPage />} />
                    <Route path="customers" element={<AdminCustomersPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="quotations" element={<AdminQuotationsPage />} />
                    <Route path="projects" element={<AdminProjectsPage />} />
                    <Route path="payments" element={<AdminPaymentsPage />} />
                    <Route path="services" element={<AdminServicesPage />} />
                    <Route path="portfolio" element={<AdminPortfolioPage />} />
                    <Route path="blog" element={<AdminBlogPage />} />
                    <Route path="testimonials" element={<AdminTestimonialsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                  </Route>
                </Route>

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SettingsProvider>
        </UserAuthProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
  );
};

export default App;
