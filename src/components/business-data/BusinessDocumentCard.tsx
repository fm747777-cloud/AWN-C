import React from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Hash,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { BusinessDocumentRecord } from '../../types/portal';
import { SEMANTIC_KPI_TONES } from '../../theme/portalDesignSystem';

interface BusinessDocumentCardProps {
  record: BusinessDocumentRecord;
  onViewDetails: (record: BusinessDocumentRecord) => void;
}

export const BusinessDocumentCard: React.FC<BusinessDocumentCardProps> = ({
  record,
  onViewDetails,
}) => {
  const { isRtl, t } = usePortal();

  const getCardTone = () => {
    if (record.status === 'Active') return SEMANTIC_KPI_TONES.green;
    if (record.status === 'Expired') return SEMANTIC_KPI_TONES.red;
    return SEMANTIC_KPI_TONES.teal;
  };

  const cardTone = getCardTone();

  const renderStatusBadge = (): React.ReactNode => {
    if (!record.status) {
      return null;
    }

    if (record.status === 'Active') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.green.badgeClass}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{t('Active', 'نشط')}</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.red.badgeClass}`}
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Expired', 'منتهي')}</span>
      </span>
    );
  };

  const isIdNa = record.idNumber === 'N/A';
  const isExpiryNa = record.expiryDate === 'N/A';

  return (
    <article
      aria-labelledby={`bdoc-title-${record.recordKey}`}
      className={`group rounded-lg border border-[#E5E7EB] bg-white hover:border-[#37848C]/60 transition-colors flex flex-col justify-between ${cardTone.topBorderClass}`}
    >
      {/* Top & Middle Content */}
      <div className="p-5 space-y-4">
        {/* Top Row: Tinted Icon Container + Document Name + Explicit Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${cardTone.iconContainerClass} ${cardTone.iconColorClass}`}
            >
              <FileText className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <h3
                id={`bdoc-title-${record.recordKey}`}
                dir="auto"
                className="text-sm sm:text-base font-bold text-[#1F2937] leading-snug break-words"
              >
                {record.name}
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {t(
                  'Business Registration Record',
                  'سجل منشأة وخدمة حكومية'
                )}
              </p>
            </div>
          </div>

          {renderStatusBadge()}
        </div>

        {/* Middle Section: Two Compact Metadata Fields (ID/Number & Expiry Date) */}
        <dl className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E7EB]/80">
          <div className="rounded-md bg-[#F8FAFC] px-3 py-2.5 border border-[#E5E7EB] space-y-1">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
              <Hash className="w-3 h-3 text-[#37848C] shrink-0" />
              <span>{t('ID/Number', 'الرقم التعريفي')}</span>
            </dt>
            <dd
              dir="ltr"
              className={`text-xs sm:text-sm font-mono tabular-nums font-semibold truncate ${
                isIdNa ? 'text-[#64748B]/75 font-normal' : 'text-[#1F2937]'
              }`}
            >
              {record.idNumber}
            </dd>
          </div>

          <div className="rounded-md bg-[#F8FAFC] px-3 py-2.5 border border-[#E5E7EB] space-y-1">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
              <Calendar className="w-3 h-3 text-[#37848C] shrink-0" />
              <span>{t('Expiry Date', 'تاريخ الانتهاء')}</span>
            </dt>
            <dd
              dir="ltr"
              className={`text-xs sm:text-sm font-mono tabular-nums font-semibold truncate ${
                isExpiryNa ? 'text-[#64748B]/75 font-normal' : 'text-[#1F2937]'
              }`}
            >
              {record.expiryDate}
            </dd>
          </div>
        </dl>
      </div>

      {/* Bottom Row: Clear View Details Action */}
      <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-end">
        <button
          type="button"
          onClick={() => onViewDetails(record)}
          aria-label={`${t('View Details', 'عرض التفاصيل')} — ${record.name}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#1A7373] hover:text-white hover:bg-[#37848C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
        >
          <span>{t('View Details', 'عرض التفاصيل')}</span>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          )}
        </button>
      </div>
    </article>
  );
};
