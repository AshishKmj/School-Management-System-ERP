import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Students
import { AdmissionEnquiryPage } from './pages/students/AdmissionEnquiryPage';
import { AllStudentsPage } from './pages/students/AllStudentsPage';
import { NewAdmissionPage } from './pages/students/NewAdmissionPage';
import { PassedOutArchivePage } from './pages/students/PassedOutArchivePage';
import { PromotionPage } from './pages/students/PromotionPage';
import { SessionReportPage } from './pages/students/SessionReportPage';

// Fees
import { FeeStructurePage } from './pages/fees/FeeStructurePage';
import { FeeCollectionPage } from './pages/fees/FeeCollectionPage';
import { QuickFeeCollectPage } from './pages/fees/QuickFeeCollectPage';
import { WhatsAppReminderPage } from './pages/fees/WhatsAppReminderPage';
import { FeeDeletionLogPage } from './pages/fees/FeeDeletionLogPage';

// Academics
import { AttendancePage } from './pages/academics/AttendancePage';
import { AttendanceReportPage } from './pages/academics/AttendanceReportPage';
import { ExamsPage } from './pages/academics/ExamsPage';
import { MarksEntryPage } from './pages/academics/MarksEntryPage';
import { ClassResultPage } from './pages/academics/ClassResultPage';
import { SubjectsPage } from './pages/academics/SubjectsPage';
import { ClassSubjectMapPage } from './pages/academics/ClassSubjectMapPage';
import { ExamSchedulePage } from './pages/academics/ExamSchedulePage';

// Finance
import { ExpensesPage } from './pages/finance/ExpensesPage';
import { FinanceReportsPage } from './pages/finance/FinanceReportsPage';
import { IncomeVsExpensePage } from './pages/finance/IncomeVsExpensePage';

// Staff
import { StaffPage } from './pages/staff/StaffPage';
import { SalaryManagementPage } from './pages/staff/SalaryManagementPage';
import { SalaryReportPage } from './pages/staff/SalaryReportPage';

// Communication
import { NoticesPage } from './pages/communication/NoticesPage';

// Admin
import { UsersPermissionsPage } from './pages/admin/UsersPermissionsPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import { SessionsPage } from './pages/admin/SessionsPage';
import { BackupPage } from './pages/admin/BackupPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { PreferencesPage } from './pages/admin/PreferencesPage';

// Account
import { PasswordChangePage } from './pages/account/PasswordChangePage';

// Global stores
import { useAuthStore } from './store/useAuthStore';
import { useDataStore } from './store/useDataStore';
import { useAppStore } from './store/useAppStore';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { loadAllData } = useDataStore();
  const { initApp, theme } = useAppStore();
  const { loadPermissions } = useAuthStore();

  useEffect(() => {
    loadAllData();
    initApp();
    loadPermissions();
  }, []);

  useEffect(() => {
    // Apply theme attribute to html root
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Dashboard and ERP Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Students Module */}
          <Route path="/enquiries" element={<AdmissionEnquiryPage />} />
          <Route path="/students" element={<AllStudentsPage />} />
          <Route path="/students/new" element={<NewAdmissionPage />} />
          <Route path="/students/archive" element={<PassedOutArchivePage />} />
          <Route path="/students/promotion" element={<PromotionPage />} />
          <Route path="/students/session-report" element={<SessionReportPage />} />

          {/* Fees Module */}
          <Route path="/fees/structure" element={<FeeStructurePage />} />
          <Route path="/fees/collection" element={<FeeCollectionPage />} />
          <Route path="/fees/quick" element={<QuickFeeCollectPage />} />
          <Route path="/fees/reminders" element={<WhatsAppReminderPage />} />
          <Route path="/fees/whatsapp-reminder" element={<WhatsAppReminderPage />} />
          <Route path="/fees/deletion-log" element={<FeeDeletionLogPage />} />

          {/* Academics Module */}
          <Route path="/academics/attendance" element={<AttendancePage />} />
          <Route path="/academics/attendance-report" element={<AttendanceReportPage />} />
          <Route path="/academics/exams" element={<ExamsPage />} />
          <Route path="/academics/marks-entry" element={<MarksEntryPage />} />
          <Route path="/academics/class-result" element={<ClassResultPage />} />
          <Route path="/academics/subjects" element={<SubjectsPage />} />
          <Route path="/academics/class-subject-map" element={<ClassSubjectMapPage />} />
          <Route path="/academics/exam-schedule" element={<ExamSchedulePage />} />

          {/* Finance Module */}
          <Route path="/finance/expenses" element={<ExpensesPage />} />
          <Route path="/finance/reports" element={<FinanceReportsPage />} />
          <Route path="/finance/income-vs-expense" element={<IncomeVsExpensePage />} />

          {/* Staff & Payroll Module */}
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/staff/salary" element={<SalaryManagementPage />} />
          <Route path="/staff/salary-report" element={<SalaryReportPage />} />

          {/* Communication Module */}
          <Route path="/notices" element={<NoticesPage />} />

          {/* Admin & Security Module */}
          <Route path="/admin/permissions" element={<UsersPermissionsPage />} />
          <Route path="/admin/activity-log" element={<ActivityLogPage />} />
          <Route path="/admin/sessions" element={<SessionsPage />} />
          <Route path="/admin/backup" element={<BackupPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/preferences" element={<PreferencesPage />} />

          {/* Account Module */}
          <Route path="/account/password" element={<PasswordChangePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
