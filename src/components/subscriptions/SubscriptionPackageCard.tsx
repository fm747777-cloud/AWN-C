import React from 'react';
import { Check, Clock, AlertCircle, PackageCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DemoSubscriptionPackageRecord } from '../../types/portal';
import { SEMANTIC_KPI_TONES } from '../../theme/portalDesignSystem';

interface SubscriptionPackageCardProps {
  pkg: DemoSubscriptionPackageRecord;
}

export const SubscriptionPackageCard: React.FC<SubscriptionPackageCardProps> = ({
  pkg,
}) => {
  const { t } = usePortal();

  const expiredTone = SEMANTIC_KPI_TONES.red;

  return (
    <article
      aria-labelledby={`pkg-title-${pkg.mockId}`}
      className={`rounded-lg border border-[#E5E7EB] bg-white flex flex-col justify-between transition-colors hover:border-[#37848C]/40 ${expiredTone.topBorderClass}`}
    >
      {/* Top Section: Header, Status, Price & Duration */}
      <div className="p-5 sm:p-6 border-b border-[#E5E7EB] space-y-4">
        {/* Top Metadata Row: Demo Instance Context & Restrained Expired Status */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <PackageCheck className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
            <span>
              {t(
                `Demo Package Record #${pkg.instanceOrder}`,
                `سجل باقة تجريبي #${pkg.instanceOrder}`
              )}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${expiredTone.badgeClass}`}
            aria-label={`Subscription status: ${pkg.status}`}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span dir="ltr">{pkg.status}</span>
          </div>
        </div>

        {/* Package Title */}
        <div className="space-y-1">
          <h3
            id={`pkg-title-${pkg.mockId}`}
            dir="auto"
            className="text-base sm:text-lg font-bold text-[#1F2937] leading-snug"
          >
            {pkg.packageName}
          </h3>
        </div>

        {/* Price and Duration Block */}
        <div className="pt-1 flex items-baseline justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span
              dir="ltr"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A7373] tabular-nums"
            >
              {pkg.priceDisplay}
            </span>
            <span aria-hidden="true" className="text-sm text-[#64748B]">
              /
            </span>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#64748B] tabular-nums"
            >
              <Clock className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
              <span>{pkg.durationDisplay}</span>
            </span>
          </div>

          <span className="text-[11px] text-[#64748B]">
            {t(
              `Duration: ${pkg.durationDisplay} · Status: ${pkg.status}`,
              `المدة: ${pkg.durationDisplay} · الحالة: ${pkg.status}`
            )}
          </span>
        </div>
      </div>

      {/* Bottom Section: Included Services List */}
      <div className="p-5 sm:p-6 bg-[#F8FAFC]/60 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-[#1A7373] tracking-tight">
              {t('Included Services', 'الخدمات المتضمنة')}
            </h4>
            <span
              dir="ltr"
              className="text-[11px] font-mono tabular-nums text-[#64748B]"
            >
              {pkg.includedServices.length}{' '}
              {t('included', 'خدمات متضمنة')}
            </span>
          </div>

          <ul
            aria-label={`${pkg.includedServicesHeading} for ${pkg.packageName}`}
            className="divide-y divide-[#E5E7EB]/80 border border-[#E5E7EB] rounded-md bg-white"
          >
            {pkg.includedServices.map((service, index) => (
              <li
                key={`${pkg.mockId}-${service.id}`}
                className="px-3.5 py-2.5 flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2937]"
              >
                <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span
                  dir="auto"
                  className="flex-1 leading-relaxed font-medium text-start"
                >
                  {service.serviceTitle}
                </span>
                <span
                  dir="ltr"
                  className="text-[11px] font-mono tabular-nums text-[#64748B] shrink-0"
                >
                  0{index + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};
