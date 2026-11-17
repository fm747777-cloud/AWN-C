import React, { useState } from 'react';
import { Download, FileBarChart2, Info } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface FilterErrors {
  company?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Parses either YYYY-MM-DD or DD-MM-YYYY into a comparable timestamp (ms).
 * Returns null if invalid.
 */
function parseDateInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // DD-MM-YYYY
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
  if (ddmmyyyy) {
    const day = Number(ddmmyyyy[1]);
    const month = Number(ddmmyyyy[2]);
    const year = Number(ddmmyyyy[3]);
    const dt = new Date(year, month - 1, day);
    if (
      dt.getFullYear() === year &&
      dt.getMonth() === month - 1 &&
      dt.getDate() === day
    ) {
      return dt.getTime();
    }
    return null;
  }

  // YYYY-MM-DD
  const yyyymmdd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (yyyymmdd) {
    const year = Number(yyyymmdd[1]);
    const month = Number(yyyymmdd[2]);
    const day = Number(yyyymmdd[3]);
    const dt = new Date(year, month - 1, day);
    if (
      dt.getFullYear() === year &&
      dt.getMonth() === month - 1 &&
      dt.getDate() === day
    ) {
      return dt.getTime();
    }
    return null;
  }

  return null;
}

export const ReportsPage: React.FC = () => {
  const { companies, selectedCompany, t } = usePortal();

  const [selectedCompanyFilter, setSelectedCompanyFilter] =
    useState<string>('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [errors, setErrors] = useState<FilterErrors>({});
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const validateFilters = (
    nextStart = startDate,
    nextEnd = endDate,
    checkRequired = false
  ): boolean => {
    const nextErrors: FilterErrors = {};

    if (checkRequired) {
      if (!selectedCompanyFilter) {
        nextErrors.company = t('Company is required.', 'المنشأة مطلوبة.');
      }
      if (!selectedActionFilter) {
        nextErrors.action = t('Action is required.', 'الإجراء مطلوب.');
      }
      if (!nextStart.trim()) {
        nextErrors.startDate = t(
          'Start Date is required.',
          'تاريخ البدء مطلوب.'
        );
      }
      if (!nextEnd.trim()) {
        nextErrors.endDate = t(
          'End Date is required.',
          'تاريخ الانتهاء مطلوب.'
        );
      }
    }

    const startMs = parseDateInput(nextStart);
    const endMs = parseDateInput(nextEnd);

    if (nextStart.trim() && startMs === null) {
      nextErrors.startDate = t(
        'Enter a valid date (DD-MM-YYYY).',
        'أدخل تاريخاً صحيحاً (DD-MM-YYYY).'
      );
    }
    if (nextEnd.trim() && endMs === null) {
      nextErrors.endDate = t(
        'Enter a valid date (DD-MM-YYYY).',
        'أدخل تاريخاً صحيحاً (DD-MM-YYYY).'
      );
    }

    if (startMs !== null && endMs !== null && endMs < startMs) {
      nextErrors.endDate = t(
        'End Date cannot be earlier than Start Date.',
        'لا يمكن أن يكون تاريخ الانتهاء قبل تاريخ البدء.'
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setExportNotice(null);
    validateFilters(val, endDate, false);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setExportNotice(null);
    validateFilters(startDate, val, false);
  };

  const handleExportClick = () => {
    const isValid = validateFilters(startDate, endDate, true);
    if (!isValid) {
      setExportNotice(null);
      return;
    }
    setExportNotice(
      t(
        'No audit trail records are available to export for the selected criteria.',
        'لا توجد سجلات مراجعة متاحة للتصدير وفق المعايير المحددة.'
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section
        aria-labelledby="reports-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1A7373]">
              {selectedCompany.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t('Reports', 'التقارير')}</span>
          </div>

          <h1
            id="reports-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t('Reports', 'التقارير')}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              'Keep track of all your generated reports in one centralized place for better organization and decision-making.',
              'تابع جميع التقارير الصادرة في مكان مركزي واحد لتحسين التنظيم ودعم اتخاذ القرار.'
            )}
          </p>
        </div>
      </section>

      {/* Audit Trails Tab & Content Card */}
      <section
        aria-label={t('Audit Trails', 'سجلات المراجعة')}
        className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs"
      >
        {/* Tab Bar */}
        <div className="px-5 pt-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-4 flex-wrap">
          <div
            role="tablist"
            aria-label={t('Reports Tabs', 'علامات تبويب التقارير')}
            className="flex gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={true}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-[#37848C] text-[#1A7373] bg-white rounded-t-md transition-colors"
            >
              {t('Audit Trails', 'سجلات المراجعة')}
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="p-5 sm:p-6 border-b border-[#E5E7EB] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {/* Company * */}
            <div className="space-y-1.5">
              <label
                htmlFor="audit-company-select"
                className="block text-xs font-semibold text-[#1F2937]"
              >
                {t('Company *', 'المنشأة *')}
              </label>
              <select
                id="audit-company-select"
                value={selectedCompanyFilter}
                onChange={(e) => {
                  setSelectedCompanyFilter(e.target.value);
                  setExportNotice(null);
                  setErrors((prev) => ({ ...prev, company: undefined }));
                }}
                className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              >
                <option value="">
                  {t('Select Company', 'اختر المنشأة')}
                </option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
              {errors.company && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Action * */}
            <div className="space-y-1.5">
              <label
                htmlFor="audit-action-select"
                className="block text-xs font-semibold text-[#1F2937]"
              >
                {t('Action *', 'الإجراء *')}
              </label>
              <select
                id="audit-action-select"
                value={selectedActionFilter}
                onChange={(e) => {
                  setSelectedActionFilter(e.target.value);
                  setExportNotice(null);
                  setErrors((prev) => ({ ...prev, action: undefined }));
                }}
                className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              >
                <option value="">{t('Select Action', 'اختر الإجراء')}</option>
              </select>
              {errors.action && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.action}
                </p>
              )}
            </div>

            {/* Start Date * */}
            <div className="space-y-1.5">
              <label
                htmlFor="audit-start-date"
                className="block text-xs font-semibold text-[#1F2937]"
              >
                {t('Start Date *', 'تاريخ البدء *')}
              </label>
              <input
                id="audit-start-date"
                type="date"
                dir="ltr"
                placeholder="DD-MM-YYYY"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
              <span className="block text-[11px] text-[#64748B]">
                DD-MM-YYYY
              </span>
              {errors.startDate && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date * */}
            <div className="space-y-1.5">
              <label
                htmlFor="audit-end-date"
                className="block text-xs font-semibold text-[#1F2937]"
              >
                {t('End Date *', 'تاريخ الانتهاء *')}
              </label>
              <input
                id="audit-end-date"
                type="date"
                dir="ltr"
                placeholder="DD-MM-YYYY"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
              <span className="block text-[11px] text-[#64748B]">
                DD-MM-YYYY
              </span>
              {errors.endDate && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.endDate}
                </p>
              )}
            </div>

            {/* Export Action */}
            <div className="space-y-1.5 lg:pt-[22px]">
              <button
                type="button"
                onClick={handleExportClick}
                className="w-full h-10 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{t('Export', 'تصدير')}</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div
              role="status"
              className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#64748B]"
            >
              <Info className="w-4 h-4 text-[#37848C] shrink-0" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Empty State */}
        <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#37848C]/10 border border-[#37848C]/20 flex items-center justify-center text-[#37848C] mb-3">
            <FileBarChart2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-[#1F2937]">
            {t('No audit trail records found.', 'لم يتم العثور على سجلات مراجعة.')}
          </p>
        </div>
      </section>
    </div>
  );
};
