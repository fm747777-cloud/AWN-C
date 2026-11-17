import React, { useEffect, useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import { PortalDashboardData } from '../types/portal';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { DashboardKpiGrid } from '../components/dashboard/DashboardKpiGrid';
import { SubscriptionOverview } from '../components/dashboard/SubscriptionOverview';
import { RenewalAlerts } from '../components/dashboard/RenewalAlerts';
import { DocumentsAnalytics } from '../components/dashboard/DocumentsAnalytics';
import { NewsAnnouncements } from '../components/dashboard/NewsAnnouncements';

export const DashboardPage: React.FC = () => {
  const { selectedCompany, t } = usePortal();
  const [dashboardData, setDashboardData] =
    useState<PortalDashboardData | null>(null);

  useEffect(() => {
    let active = true;
    portalService.getDashboardData(selectedCompany.id).then((data) => {
      if (active) {
        setDashboardData(data);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedCompany.id]);

  if (!dashboardData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Dashboard...', 'جاري تحميل لوحة التحكم...')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeSection user={dashboardData.user} />
      <DashboardKpiGrid items={dashboardData.kpis} />
      <SubscriptionOverview subscription={dashboardData.subscription} />
      <RenewalAlerts catalog={dashboardData.renewalAlerts} />
      <DocumentsAnalytics analytics={dashboardData.documentsAnalytics} />
      <NewsAnnouncements topics={dashboardData.newsTopics} />
    </div>
  );
};
