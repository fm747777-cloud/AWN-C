import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CalendarCheck,
  FileEdit,
  FileQuestion,
  Eye,
  X,
} from 'lucide-react';
import {
  RenewalAlertCatalog,
  RenewalScheduleState,
  RenewalTaskItem,
} from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface RenewalAlertsProps {
  catalog: RenewalAlertCatalog;
}

type FilterMode = 'all' | RenewalScheduleState;

export const RenewalAlerts: React.FC<RenewalAlertsProps> = ({ catalog }) => {
  const { language, t } = usePortal();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState<boolean>(false);
  const [mockDraftNote, setMockDraftNote] = useState<string>('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const selectedRow: RenewalTaskItem | undefined =
    catalog.sampleAlertRows.find((r) => r.id === selectedRowId);

  const fillDetailsCloseButtonRef = useRef<HTMLButtonElement>(null);
  const viewAllCloseButtonRef = useRef<HTMLButtonElement>(null);

  const fillDetailsModalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(selectedRow),
    onClose: () => setSelectedRowId(null),
    initialFocusRef: fillDetailsCloseButtonRef,
  });

  const viewAllModalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: viewAllOpen,
    onClose: () => setViewAllOpen(false),
    initialFocusRef: viewAllCloseButtonRef,
  });

  const filteredRows: RenewalTaskItem[] = catalog.sampleAlertRows.filter(
    (row) => (filterMode === 'all' ? true : row.scheduleState === filterMode)
  );

  return (
    <section
      aria-labelledby="renewal-alerts-heading"
      className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-4"
    >
      {/* Header & Interactive Task Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2
            id="renewal-alerts-heading"
            className="text-base font-semibold text-[#1F2937]"
          >
            {t('Renewal Tasks & Alerts', 'مهام وتنبيهات تجديد المستندات')}
          </h2>
          <p className="text-xs text-[#64748B]">
            {t(
              'Preserved OCR source records — incomplete associations between IDs, documents, and dates are explicitly labeled',
              'البيانات المصدرية تحتوي على ارتباطات غير مكتملة — تم تمييز السجلات المجدولة وغير المرتبطة بوضوح'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Interactive Filter Tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-md bg-[#F8FAFC] border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'all'
                  ? 'bg-white text-[#1A7373] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#1F2937]'
              }`}
            >
              {t('All Tasks (5)', 'الكل (5)')}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('upcoming_sample')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'upcoming_sample'
                  ? 'bg-white text-[#1A7373] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#1F2937]'
              }`}
            >
              {t('Scheduled Date (3)', 'بتاريخ مجدول (3)')}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unlinked_date')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'unlinked_date'
                  ? 'bg-white text-[#1A7373] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#1F2937]'
              }`}
            >
              {t('Unlinked Date (2)', 'تاريخ غير مرتبط (2)')}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setViewAllOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-[#E5E7EB] bg-white text-[#1A7373] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#37848C]" />
            <span>{t('View All', 'عرض الكل')}</span>
          </button>
        </div>
      </div>

      {/* Preserved Source Identifiers Inventory Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#F8FAFC] p-3 rounded-md border border-[#E5E7EB]">
        <div>
          <span className="font-semibold text-[#1F2937] block mb-0.5">
            {t('Supplied Request IDs:', 'معرفات الطلبات المزودة:')}
          </span>
          <p dir="ltr" className="font-mono text-[#64748B] tabular-nums">
            {catalog.requestIds.join(' · ')}
          </p>
        </div>

        <div>
          <span className="font-semibold text-[#1F2937] block mb-0.5">
            {t('Supplied Document IDs:', 'معرفات المستندات المزودة:')}
          </span>
          <p dir="ltr" className="font-mono text-[#64748B] tabular-nums">
            {catalog.documentIds.join(' · ')}
          </p>
        </div>

        <div>
          <span className="font-semibold text-[#1F2937] block mb-0.5">
            {t('Known Document Examples:', 'أمثلة المستندات المعروفة:')}
          </span>
          <p className="text-[#64748B]">
            {catalog.knownDocumentTitles.join(' · ')}
          </p>
        </div>

        <div>
          <span className="font-semibold text-[#1F2937] block mb-0.5">
            {t('Supplied Due-Date Examples:', 'تواريخ الاستحقاق المزودة:')}
          </span>
          <p dir="ltr" className="font-mono text-[#64748B] tabular-nums">
            {catalog.suppliedDueDates.join(' · ')}
          </p>
        </div>
      </div>

      {/* Compact Enterprise Task-List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-[#64748B]">
              <th className="py-2.5 pe-3 font-semibold text-start whitespace-nowrap">
                {t('Request ID', 'معرف الطلب')}
              </th>
              <th className="py-2.5 px-3 font-semibold text-start whitespace-nowrap">
                {t('Document ID', 'معرف المستند')}
              </th>
              <th className="py-2.5 px-3 font-semibold text-start">
                {t('Document & Source Association', 'المستند وحالة الربط')}
              </th>
              <th className="py-2.5 px-3 font-semibold text-start whitespace-nowrap">
                {t('Due Date & Status', 'تاريخ الاستحقاق والحالة')}
              </th>
              <th className="py-2.5 px-3 font-semibold text-start whitespace-nowrap">
                {t('Priority', 'الأولوية')}
              </th>
              <th className="py-2.5 ps-3 font-semibold text-end whitespace-nowrap">
                {t('Action', 'الإجراء')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#F1F5F9] transition-colors"
              >
                <td
                  dir="ltr"
                  className="py-3 pe-3 font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap"
                >
                  {row.requestId}
                </td>
                <td
                  dir="ltr"
                  className="py-3 px-3 font-mono text-[#1F2937] tabular-nums whitespace-nowrap"
                >
                  {row.documentId}
                </td>
                <td className="py-3 px-3">
                  <p className="font-medium text-[#1F2937]">
                    {row.documentTitle}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {language === 'ar'
                      ? row.associationStatusAr
                      : row.associationStatusEn}
                  </p>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <p
                    dir="ltr"
                    className="font-mono font-medium text-[#1F2937] tabular-nums"
                  >
                    {row.dueDateDisplay}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                    {row.scheduleState === 'upcoming_sample' ? (
                      <CalendarCheck className="w-3 h-3 text-[#37848C] shrink-0" />
                    ) : (
                      <FileQuestion className="w-3 h-3 text-[#D97706] shrink-0" />
                    )}
                    <span>
                      {language === 'ar'
                        ? row.scheduleLabelAr
                        : row.scheduleLabelEn}
                    </span>
                  </p>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#D97706]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {row.priority}
                      {language === 'ar' ? ' (عالية)' : ''}
                    </span>
                  </span>
                </td>
                <td className="py-3 ps-3 text-end whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowId(row.id);
                      setMockDraftNote('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>{t('Fill Details', 'تعبئة التفاصيل')}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fill Details Mock Panel / Modal */}
      {selectedRow && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="renewal-fill-details-modal-title"
          onClick={() => setSelectedRowId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={fillDetailsModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3
                  id="renewal-fill-details-modal-title"
                  className="text-sm font-semibold text-[#1F2937]"
                >
                  {t(
                    `Fill Details — ${selectedRow.requestId} (Mock Form Preview)`,
                    `تعبئة التفاصيل — ${selectedRow.requestId} (نموذج تجريبي)`
                  )}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {t(
                    'Sample/incomplete source record — no backend submission is performed',
                    'بيانات تجريبية غير مكتملة — لا يتم إرسال أي بيانات لخادم خارجي'
                  )}
                </p>
              </div>
              <button
                ref={fillDetailsCloseButtonRef}
                type="button"
                onClick={() => setSelectedRowId(null)}
                aria-label={t('Close Fill Details', 'إغلاق تعبئة التفاصيل')}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAFC] border border-[#E5E7EB] p-3 rounded-md">
              <div>
                <span className="text-[#64748B] block">
                  {t('Request ID', 'معرف الطلب')}
                </span>
                <span
                  dir="ltr"
                  className="font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRow.requestId}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">
                  {t('Document ID (Sample)', 'معرف المستند (نموذجي)')}
                </span>
                <span
                  dir="ltr"
                  className="font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRow.documentId}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#64748B] block">
                  {t('Sample Document Reference:', 'المستند المعروض:')}
                </span>
                <span className="font-semibold text-[#1F2937]">
                  {selectedRow.documentTitle}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">
                  {t('Sample Due Date:', 'تاريخ الاستحقاق (مثال):')}
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-[#1F2937] tabular-nums"
                >
                  {selectedRow.dueDateDisplay}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">
                  {t('Priority:', 'الأولوية:')}
                </span>
                <span className="font-semibold text-[#D97706]">
                  {selectedRow.priority}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="mock-renewal-note"
                className="block text-xs font-medium text-[#1F2937]"
              >
                {t(
                  'Local Sample Notes (UI Preview Only):',
                  'ملاحظات تجريبية محلية (معاينة واجهة المستخدم فقط):'
                )}
              </label>
              <textarea
                id="mock-renewal-note"
                rows={2}
                value={mockDraftNote}
                onChange={(e) => setMockDraftNote(e.target.value)}
                placeholder={t(
                  'Enter sample note to test form input...',
                  'أدخل ملاحظة تجريبية لاختبار الحقل...'
                )}
                className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRowId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors"
              >
                {t('Close Mock Panel', 'إغلاق المعاينة')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Non-Destructive Modal */}
      {viewAllOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="renewal-view-all-modal-title"
          onClick={() => setViewAllOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={viewAllModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <h3
                id="renewal-view-all-modal-title"
                className="text-sm font-semibold text-[#1F2937]"
              >
                {t(
                  'All Supplied Renewal Items (Phase 1 Preview)',
                  'معاينة جميع عناصر التجديد المزودة (المرحلة الأولى)'
                )}
              </h3>
              <button
                ref={viewAllCloseButtonRef}
                type="button"
                onClick={() => setViewAllOpen(false)}
                aria-label={t(
                  'Close Renewal Items Preview',
                  'إغلاق معاينة عناصر التجديد'
                )}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#64748B] space-y-3">
              <p>
                {t(
                  'Dedicated destination page is not yet specified for Phase 1. Below is the complete inventory of supplied source identifiers:',
                  'لم يتم الانتقال إلى صفحة خارجية غير موثقة. فيما يلي كامل المعرفات والبيانات المزودة في المصدر:'
                )}
              </p>
              <div className="space-y-2 p-3 rounded bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937]">
                <p dir="ltr" className="font-mono tabular-nums">
                  <strong>Request IDs:</strong> {catalog.requestIds.join(', ')}
                </p>
                <p dir="ltr" className="font-mono tabular-nums">
                  <strong>Document IDs:</strong> {catalog.documentIds.join(', ')}
                </p>
                <p>
                  <strong>Documents:</strong>{' '}
                  {catalog.knownDocumentTitles.join(' | ')}
                </p>
                <p dir="ltr" className="font-mono tabular-nums">
                  <strong>Due Dates:</strong>{' '}
                  {catalog.suppliedDueDates.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewAllOpen(false)}
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
