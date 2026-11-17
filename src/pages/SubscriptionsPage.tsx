import React, { useEffect, useState } from 'react';
import { CreditCard, Info } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import { SubscriptionsPageData } from '../types/portal';
import { SubscriptionPackageCard } from '../components/subscriptions/SubscriptionPackageCard';

export const SubscriptionsPage: React.FC = () => {
  const { selectedCompany, t } = usePortal();
  const [pageData, setPageData] = useState<SubscriptionsPageData | null>(null);

  useEffect(() => {
    let active = true;
    portalService.getSubscriptionsData().then((data) => {
      if (active) {
        setPageData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Subscriptions...', 'جاري تحميل الاشتراكات...')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section
        aria-labelledby="subscriptions-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1A7373]">
              {selectedCompany.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t(pageData.pageTitleEn, pageData.pageTitleAr)}</span>
          </div>

          <h1
            id="subscriptions-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, pageData.pageTitleAr)}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'استعرض باقات الاشتراك الحالية والمزايا المشمولة وخيارات الترقية لمنشأتك.'
            )}
          </p>
        </div>
      </section>

      {/* Your Subscription Packages Section */}
      <section
        aria-labelledby="subscription-packages-section-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-6 shadow-2xs"
      >
        {/* Section Heading & Description */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#37848C] shrink-0" />
              <h2
                id="subscription-packages-section-heading"
                className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]"
              >
                {t(pageData.sectionTitleEn, 'باقات الاشتراك المتاحة')}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
              {t(
                pageData.sectionDescriptionEn,
                'اختر باقة الاشتراك المناسبة لاحتياجات منشأتك التشغيلية والحكومية.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] shrink-0">
            <span
              dir="ltr"
              className="font-mono font-semibold text-[#1A7373] tabular-nums"
            >
              0{pageData.packages.length}
            </span>
            <span>{t('Demo Packages', 'باقات مسجلة (عرض تجريبي)')}</span>
          </div>
        </div>

        {/* Two Demo Package Cards: Side by side on wide screens, stacked on narrow screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pageData.packages.map((pkg) => (
            <SubscriptionPackageCard key={pkg.mockId} pkg={pkg} />
          ))}
        </div>

        {/* Quiet Demo Data Integrity Note */}
        <div className="pt-2 border-t border-[#E5E7EB]/70 flex items-start gap-2 text-[11px] text-[#64748B]">
          <Info className="w-3.5 h-3.5 text-[#37848C] shrink-0 mt-0.5" />
          <p>{t(pageData.dataIntegrityNoteEn, pageData.dataIntegrityNoteAr)}</p>
        </div>
      </section>
    </div>
  );
};
