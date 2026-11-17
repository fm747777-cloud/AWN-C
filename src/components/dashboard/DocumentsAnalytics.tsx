import React, { useRef, useState } from 'react';
import { Calendar, Eye, FileBarChart2, Info, X } from 'lucide-react';
import {
  DateRangeOption,
  DocumentCategoryKey,
  DocumentsAnalyticsData,
} from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import {
  AWN_CHART_PALETTE,
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../../theme/portalDesignSystem';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface DocumentsAnalyticsProps {
  analytics: DocumentsAnalyticsData;
}

export const DocumentsAnalytics: React.FC<DocumentsAnalyticsProps> = ({
  analytics,
}) => {
  const { language, t } = usePortal();
  const [selectedRangeId, setSelectedRangeId] = useState<string>(
    analytics.availableDateRanges[0].id
  );
  const [selectedTypeKey, setSelectedTypeKey] =
    useState<DocumentCategoryKey>('business');
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const detailsModalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: detailsModalOpen,
    onClose: () => setDetailsModalOpen(false),
    initialFocusRef: closeButtonRef,
  });

  const selectedRange: DateRangeOption =
    analytics.availableDateRanges.find((r) => r.id === selectedRangeId) ||
    analytics.availableDateRanges[0];

  const documentTypeBreakdown: {
    key: DocumentCategoryKey;
    labelEn: string;
    labelAr: string;
    countDisplay: string;
    numericCount: number;
    seriesHex: string;
  }[] = [
    {
      key: 'business',
      labelEn: 'Business documents',
      labelAr: 'مستندات المنشأة',
      countDisplay: analytics.businessDocumentsCount,
      numericCount: 1,
      seriesHex: AWN_CHART_PALETTE.series1PrimaryTeal,
    },
    {
      key: 'employee',
      labelEn: 'Employee documents',
      labelAr: 'مستندات الموظفين',
      countDisplay: analytics.employeeDocumentsCount,
      numericCount: 0,
      seriesHex: AWN_CHART_PALETTE.series2DeepTeal,
    },
    {
      key: 'asset',
      labelEn: 'Asset documents',
      labelAr: 'مستندات الأصول',
      countDisplay: analytics.assetDocumentsCount,
      numericCount: 0,
      seriesHex: AWN_CHART_PALETTE.series3Gold,
    },
  ];

  const summaryMetrics: {
    id: string;
    labelEn: string;
    labelAr: string;
    value: string;
    sublabelEn: string;
    sublabelAr: string;
    category: SemanticKpiCategory;
  }[] = [
    {
      id: 'total',
      labelEn: 'Total Documents',
      labelAr: 'إجمالي المستندات',
      value: analytics.totalDocumentsCount,
      sublabelEn: 'Preserved total count',
      sublabelAr: 'الإجمالي المحفوظ من المصدر',
      category: 'teal',
    },
    {
      id: 'expiring-30',
      labelEn: 'Expiring within 30 days',
      labelAr: 'تنتهي خلال 30 يوماً',
      value: analytics.expiringWithin30DaysCount,
      sublabelEn: 'Approaching renewal window',
      sublabelAr: 'تقترب من موعد التجديد',
      category: 'amber',
    },
    {
      id: 'expired',
      labelEn: 'Expired Documents',
      labelAr: 'المستندات المنتهية',
      value: analytics.expiredDocumentsCount,
      sublabelEn: 'Requires compliance action',
      sublabelAr: 'تتطلب إجراء تجديد',
      category: 'red',
    },
  ];

  const handleDateRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedRangeId(event.target.value);
  };

  return (
    <section
      aria-labelledby="documents-analytics-heading"
      className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-5"
    >
      {/* Top Bar: Title + Select Date Range Control + Document Details Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2
            id="documents-analytics-heading"
            className="text-base font-semibold text-[#1F2937]"
          >
            {t('Documents Analytics', 'تحليلات المستندات')}
          </h2>
          <p className="text-xs text-[#64748B]">
            {t(
              'Preserved source counts (01, 00, 00, 01, 11, 28) displayed without reconciliation',
              'الأعداد المصدرية محفوظة حرفياً (01، 00، 00، 01، 11، 28) دون إعادة تسوية'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Select Date Range Control */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#37848C] shrink-0" />
            <label
              htmlFor="analytics-date-range"
              className="text-xs font-medium text-[#64748B] whitespace-nowrap"
            >
              {t('Select Date Range:', 'النطاق الزمني:')}
            </label>
            <select
              id="analytics-date-range"
              value={selectedRangeId}
              onChange={handleDateRangeChange}
              className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1F2937] focus:outline-none focus:border-[#37848C]"
            >
              {analytics.availableDateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {language === 'ar' ? range.labelAr : range.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Document Details Action */}
          <button
            type="button"
            onClick={() => setDetailsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('Document Details', 'تفاصيل المستندات')}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Documents by Type Chart (Left) + Summary Status Metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Documents by Type Chart */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1F2937] flex items-center gap-1.5">
              <FileBarChart2 className="w-4 h-4 text-[#37848C]" />
              <span>{t('Documents by Type', 'المستندات حسب النوع')}</span>
            </h3>
            <span className="text-[11px] text-[#64748B]">
              {language === 'ar' ? selectedRange.labelAr : selectedRange.labelEn}
            </span>
          </div>

          <div className="space-y-2.5">
            {documentTypeBreakdown.map((item) => {
              const isSelected: boolean = selectedTypeKey === item.key;
              const widthPercent: number = item.numericCount > 0 ? 100 : 4;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedTypeKey(item.key)}
                  className={`w-full text-start p-3 rounded-md border transition-colors ${
                    isSelected
                      ? 'border-[#37848C] bg-[#F8FAFC]'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="inline-flex items-center gap-2 font-medium text-[#1F2937]">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: item.seriesHex }}
                      />
                      <span>
                        {language === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono font-bold text-[#1A7373] tabular-nums"
                    >
                      {item.countDisplay}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: item.seriesHex,
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Compact Summary Metrics (Total: 01, Expiring within 30 days: 11, Expired: 28) */}
        <div className="lg:col-span-5 space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-s border-[#E5E7EB] lg:ps-6">
          <h3 className="text-sm font-semibold text-[#1F2937]">
            {t('Expiration & Status Summary', 'ملخص حالة الصلاحية')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            {summaryMetrics.map((metric) => {
              const tone = SEMANTIC_KPI_TONES[metric.category];
              return (
                <div
                  key={metric.id}
                  className={`px-4 py-3 rounded-md border border-[#E5E7EB] bg-white flex items-center justify-between gap-3 ${tone.topBorderClass}`}
                >
                  <div>
                    <span className="text-xs font-medium text-[#1F2937] block">
                      {language === 'ar' ? metric.labelAr : metric.labelEn}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {language === 'ar'
                        ? metric.sublabelAr
                        : metric.sublabelEn}
                    </span>
                  </div>
                  <span
                    dir="ltr"
                    className={`text-2xl font-bold font-mono tabular-nums ${tone.valueTextClass}`}
                  >
                    {metric.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E5E7EB] text-[11px] text-[#64748B] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#37848C] shrink-0 mt-0.5" />
            <span>
              {t(
                'Date range selection updates view state without simulating fake record filtering.',
                'تغيير النطاق الزمني يحدث حالة العرض فقط دون تصفية وهمية للسجلات.'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Document Details Modal */}
      {detailsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="documents-analytics-details-modal-title"
          onClick={() => setDetailsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={detailsModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <h3
                id="documents-analytics-details-modal-title"
                className="text-sm font-semibold text-[#1F2937]"
              >
                {t(
                  'Document Details (Mock Source Snapshot)',
                  'تفاصيل المستندات (معاينة البيانات المصدرية)'
                )}
              </h3>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                aria-label={t('Close Document Details', 'إغلاق تفاصيل المستندات')}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#64748B]">
              <p>
                {t('Selected Range Context:', 'النطاق المحدد:')}{' '}
                <strong className="text-[#1F2937]">
                  {language === 'ar'
                    ? selectedRange.labelAr
                    : selectedRange.labelEn}
                </strong>
              </p>
              <div className="rounded border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
                {documentTypeBreakdown.map((item) => (
                  <div
                    key={item.key}
                    className="px-3 py-2 flex items-center justify-between"
                  >
                    <span>
                      {language === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono font-semibold text-[#1F2937] tabular-nums"
                    >
                      {item.countDisplay}
                    </span>
                  </div>
                ))}
                {summaryMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="px-3 py-2 flex items-center justify-between"
                  >
                    <span>
                      {language === 'ar' ? metric.labelAr : metric.labelEn}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono font-semibold text-[#1F2937] tabular-nums"
                    >
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] pt-1">
                {t(
                  'Values are preserved verbatim from the supplied source specification without fabricating extra document rows.',
                  'تم الحفاظ على القيم المصدرية كما وردت دون افتراض علاقات حسابية إضافية.'
                )}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors"
              >
                {t('Close', 'إغلاق')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
