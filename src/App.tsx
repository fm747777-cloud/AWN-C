/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { PortalProvider, usePortal } from './context/PortalContext';
import { ClientPortalLayout } from './components/layout/ClientPortalLayout';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  }))
);
const GovernmentServicesPage = lazy(() =>
  import('./pages/GovernmentServicesPage').then((module) => ({
    default: module.GovernmentServicesPage,
  }))
);
const SubscriptionsPage = lazy(() =>
  import('./pages/SubscriptionsPage').then((module) => ({
    default: module.SubscriptionsPage,
  }))
);
const BusinessDataPage = lazy(() =>
  import('./pages/BusinessDataPage').then((module) => ({
    default: module.BusinessDataPage,
  }))
);
const BusinessActivitiesPage = lazy(() =>
  import('./pages/BusinessActivitiesPage').then((module) => ({
    default: module.BusinessActivitiesPage,
  }))
);
const AccountsPage = lazy(() =>
  import('./pages/AccountsPage').then((module) => ({
    default: module.AccountsPage,
  }))
);
const MediaPage = lazy(() =>
  import('./pages/MediaPage').then((module) => ({
    default: module.MediaPage,
  }))
);
const TrackRequestsPage = lazy(() =>
  import('./pages/TrackRequestsPage').then((module) => ({
    default: module.TrackRequestsPage,
  }))
);
const TicketsPage = lazy(() =>
  import('./pages/TicketsPage').then((module) => ({
    default: module.TicketsPage,
  }))
);
const ProfileSettingsPage = lazy(() =>
  import('./pages/ProfileSettingsPage').then((module) => ({
    default: module.ProfileSettingsPage,
  }))
);
const ReportsPage = lazy(() =>
  import('./pages/ReportsPage').then((module) => ({
    default: module.ReportsPage,
  }))
);
const ChangePasswordPage = lazy(() =>
  import('./pages/ChangePasswordPage').then((module) => ({
    default: module.ChangePasswordPage,
  }))
);

function RouteLoadingFallback() {
  const { t } = usePortal();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-[420px] rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-2xs flex flex-col items-center justify-center gap-3 text-center"
    >
      <div
        aria-hidden="true"
        className="w-7 h-7 rounded-full border-2 border-[#E5E7EB] border-t-[#37848C] animate-spin"
      />
      <p className="text-xs sm:text-sm font-medium text-[#64748B]">
        {t('Loading page content...', 'جاري تحميل محتوى الصفحة...')}
      </p>
    </div>
  );
}

interface RouteChunkErrorBoundaryProps {
  resetKey: string;
  t: (en: string, ar: string) => string;
  children: React.ReactNode;
}

interface RouteChunkErrorBoundaryState {
  hasError: boolean;
}

class RouteChunkErrorBoundary extends Component<
  RouteChunkErrorBoundaryProps,
  RouteChunkErrorBoundaryState
> {
  public state: RouteChunkErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): RouteChunkErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidUpdate(prevProps: RouteChunkErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <div
          role="alert"
          className="min-h-[420px] rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-2xs flex flex-col items-center justify-center gap-3 text-center"
        >
          <h2 className="text-base font-bold text-[#1F2937]">
            {t(
              'Unable to load this page',
              'تعذر تحميل هذه الصفحة'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md leading-relaxed">
            {t(
              'A network or module loading issue prevented this section from opening. You can retry loading the view or refresh the portal.',
              'حدثت مشكلة أثناء تحميل هذا القسم. يمكنك إعادة المحاولة أو تحديث البوابة.'
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Try Again', 'إعادة المحاولة')}
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F1F5F9] text-[#1F2937] text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Reload Portal', 'تحديث البوابة')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoginRoutePlaceholder() {
  const { restoreDemoSession, t } = usePortal();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#1F2937] px-4">
      <div className="max-w-md w-full rounded-lg border border-[#E5E7EB] bg-white p-6 space-y-4 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#1A7373]">
          {t('Demo Session Ended', 'انتهت الجلسة التجريبية')}
        </p>
        <h1 className="text-lg font-bold text-[#1F2937]">
          {t('Login Route Placeholder (/login)', 'صفحة تسجيل الدخول التجريبية (/login)')}
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
          {t(
            'Your active demo session has been cleared. The dedicated Login page is scheduled for a future implementation phase.',
            'تم إنهاء الجلسة التجريبية الحالية. سيتم توفير صفحة تسجيل الدخول الكاملة في مرحلة قادمة.'
          )}
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              restoreDemoSession();
              navigate('/dashboard', { replace: true });
            }}
            className="px-4 py-2 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            {t('Restore Demo Session', 'استعادة الجلسة التجريبية')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PortalRoutes() {
  const { isAuthenticated, t } = usePortal();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginRoutePlaceholder />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ClientPortalLayout>
      <RouteChunkErrorBoundary resetKey={location.pathname} t={t}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/government-services"
              element={<GovernmentServicesPage />}
            />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route
              path="/awn-subscriptions"
              element={<Navigate to="/subscriptions" replace />}
            />
            <Route path="/business-data" element={<BusinessDataPage />} />
            <Route
              path="/business-activities"
              element={<BusinessActivitiesPage />}
            />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/track-requests" element={<TrackRequestsPage />} />
            <Route
              path="/requests"
              element={<Navigate to="/track-requests" replace />}
            />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route
              path="/help/tickets"
              element={<Navigate to="/tickets" replace />}
            />
            <Route path="/help" element={<Navigate to="/tickets" replace />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
            <Route
              path="/profile"
              element={<Navigate to="/profile-settings" replace />}
            />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </RouteChunkErrorBoundary>
    </ClientPortalLayout>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <BrowserRouter>
        <PortalRoutes />
      </BrowserRouter>
    </PortalProvider>
  );
}

