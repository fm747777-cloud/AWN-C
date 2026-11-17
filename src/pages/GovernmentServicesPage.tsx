import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  GovernmentServiceCategoryId,
  GovernmentServiceRecord,
  GovernmentServicesPageData,
  GovernmentServicesTopView,
} from '../types/portal';
import { ServiceCategoryTabs } from '../components/government-services/ServiceCategoryTabs';
import { ServiceCatalog } from '../components/government-services/ServiceCatalog';
import { ServiceDetailsModal } from '../components/government-services/ServiceDetailsModal';

export const GovernmentServicesPage: React.FC = () => {
  const { selectedCompany, t } = usePortal();
  const location = useLocation();

  const [pageData, setPageData] = useState<GovernmentServicesPageData | null>(
    null
  );
  // Default state: Primary view = All AWN Services, Category = Business Services ('business')
  const [activeTopView, setActiveTopView] =
    useState<GovernmentServicesTopView>('all-awn-services');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<GovernmentServiceCategoryId>('business');
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<GovernmentServiceRecord | null>(null);

  useEffect(() => {
    let active = true;
    portalService.getGovernmentServicesData().then((data) => {
      if (active) {
        setPageData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/government-services') {
      setActiveTopView('all-awn-services');
      setSelectedCategoryId('business');
    }
  }, [location.pathname, location.key]);

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t(
          'Loading Government Services...',
          'جاري تحميل الخدمات الحكومية...'
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Page Header */}
      <section
        aria-labelledby="gov-services-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-4 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1A7373]">
              {selectedCompany.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t(pageData.pageTitleEn, pageData.pageTitleAr)}</span>
          </div>

          <h1
            id="gov-services-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, pageData.pageTitleAr)}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B]">
            {t(
              pageData.descriptionEn,
              'استعرض وأدر الخدمات الحكومية والبلدية وخدمات الموارد البشرية المعتمدة لمنشأتك.'
            )}
          </p>
        </div>
      </section>

      {/* Two-Level Navigation: Primary View (Subscribed vs All AWN Services) + 3 Category Tabs */}
      <ServiceCategoryTabs
        activeTopView={activeTopView}
        onSelectTopView={setActiveTopView}
        subscribedSourceCount={pageData.subscribedCount}
        allAwnServicesSourceCount={pageData.allAwnServicesSourceCount}
        categories={pageData.categories}
        services={pageData.services}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Selected Category Content Panel */}
      <ServiceCatalog
        activeTopView={activeTopView}
        categories={pageData.categories}
        services={pageData.services}
        selectedCategoryId={selectedCategoryId}
        onViewDetails={(service) => setSelectedServiceForModal(service)}
      />

      {/* Read-Only Service Details Modal */}
      <ServiceDetailsModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
      />
    </div>
  );
};
