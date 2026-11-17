import React, { useRef } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  Hash,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import {
  BusinessDocumentRecord,
  StructuredDocumentRecord,
} from '../../types/portal';
import { SEMANTIC_KPI_TONES } from '../../theme/portalDesignSystem';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface BusinessDocumentDetailsModalProps {
  record?: BusinessDocumentRecord | null;
  structuredDocument?: StructuredDocumentRecord | null;
  onClose: () => void;
}

export const BusinessDocumentDetailsModal: React.FC<
  BusinessDocumentDetailsModalProps
> = ({ record, structuredDocument, onClose }) => {
  const { t } = usePortal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = Boolean(record || structuredDocument);
  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-document-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-lg border border-[#E5E7EB] bg-white shadow-xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#E5E7EB]">
          <div className="space-y-0.5">
            {structuredDocument && (
              <div className="flex items-center gap-2">
                <span
                  dir="ltr"
                  className="text-xs font-mono font-bold text-[#1A7373] tabular-nums"
                >
                  {structuredDocument.documentCode}
                </span>
                <span aria-hidden="true" className="text-gray-300">
                  ·
                </span>
                <span className="text-[11px] font-medium text-[#64748B]">
                  {structuredDocument.documentRelatedTo}
                </span>
              </div>
            )}
            {record && (
              <p className="text-[11px] font-semibold tracking-wider text-[#1A7373] uppercase">
                {t('Business Document', 'مستند المنشأة')}
              </p>
            )}
            <h2
              id="business-document-modal-title"
              className="text-base font-bold text-[#1F2937]"
            >
              {t('Document Details', 'تفاصيل المستند')}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('Close Document Details', 'إغلاق تفاصيل المستند')}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Structured Document Record (from Documents Tab) */}
        {structuredDocument && (
          <div className="p-5 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Main Heading Banner: Document Name + Status Badge + Visually Distinct Document Code */}
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      dir="ltr"
                      className="px-2 py-0.5 rounded bg-[#37848C]/10 font-mono text-xs font-bold text-[#1A7373] tabular-nums"
                    >
                      {structuredDocument.documentCode}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {t('Document Name', 'اسم المستند')}
                    </span>
                  </div>
                  <h3
                    dir="auto"
                    className="text-base sm:text-lg font-bold text-[#1F2937] break-words"
                  >
                    {structuredDocument.documentName}
                  </h3>
                </div>
              </div>

              {structuredDocument.status === 'Active' ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.green.badgeClass}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('Active', 'نشط')}</span>
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.red.badgeClass}`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{structuredDocument.status}</span>
                </span>
              )}
            </div>

            {/* Section 1: Document Information */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                {t('Document Information', 'معلومات المستند')}
              </h4>
              <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    <Hash className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Document Code', 'رمز المستند')}</span>
                  </dt>
                  <dd
                    dir="ltr"
                    className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
                  >
                    {structuredDocument.documentCode}
                  </dd>
                </div>

                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    <FileText className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Document Name', 'اسم المستند')}</span>
                  </dt>
                  <dd
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                  >
                    {structuredDocument.documentName}
                  </dd>
                </div>

                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    <FolderOpen className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Document Type', 'نوع المستند')}</span>
                  </dt>
                  <dd
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                  >
                    {structuredDocument.documentType}
                  </dd>
                </div>

                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    <FolderOpen className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Document Category', 'فئة المستند')}</span>
                  </dt>
                  <dd
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                  >
                    {structuredDocument.documentCategory}
                  </dd>
                </div>

                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    <Building2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Document Related To', 'مرتبط بـ')}</span>
                  </dt>
                  <dd
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                  >
                    {structuredDocument.documentRelatedTo}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section 2: Related Entities */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                {t('Related Entities', 'الجهات المرتبطة')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
                    <Building2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Entity Name', 'اسم الجهة')}</span>
                  </span>
                  <p
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937]"
                  >
                    {structuredDocument.entityName}
                  </p>
                </div>

                <div className="p-3.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
                    <Building2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Business Entity', 'المنشأة التجارية')}</span>
                  </span>
                  <p
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#1F2937]"
                  >
                    {structuredDocument.businessEntity}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Compact Date & Expiry Section */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                {t('Expiry & Validity', 'الصلاحية وتاريخ الانتهاء')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Date Expiry', 'تاريخ الانتهاء')}</span>
                  </span>
                  <p
                    dir="ltr"
                    className="text-xs sm:text-sm font-mono font-bold text-[#1F2937] tabular-nums"
                  >
                    {structuredDocument.dateExpiry}
                  </p>
                </div>

                <div className="p-3.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                    <span>{t('Days Left', 'الأيام المتبقية')}</span>
                  </span>
                  <p
                    dir="ltr"
                    className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
                  >
                    {structuredDocument.daysLeft}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: Business Card Record (from Business Tab) */}
        {record && !structuredDocument && (
          <div className="p-5 space-y-5">
            {/* Selected Record Banner */}
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#64748B]">
                    {t('Document / Service Name', 'اسم السجل / الخدمة')}
                  </span>
                  <h3
                    dir="auto"
                    className="text-base sm:text-lg font-bold text-[#1F2937] break-words"
                  >
                    {record.name}
                  </h3>
                </div>
              </div>

              {record.status === 'Active' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.green.badgeClass}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('Active', 'نشط')}</span>
                </span>
              )}

              {record.status === 'Expired' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.red.badgeClass}`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('Expired', 'منتهي')}</span>
                </span>
              )}
            </div>

            {/* Clearly Labeled Information Rows */}
            <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <FileText className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Document Name', 'اسم المستند')}</span>
                </dt>
                <dd
                  dir="auto"
                  className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                >
                  {record.name}
                </dd>
              </div>

              {record.status && (
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                    {record.status === 'Active' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    )}
                    <span>{t('Status', 'الحالة')}</span>
                  </dt>
                  <dd
                    className={`text-xs sm:text-sm font-semibold ${
                      record.status === 'Active'
                        ? 'text-[#16A34A]'
                        : 'text-[#DC2626]'
                    }`}
                  >
                    {record.status === 'Active'
                      ? t('Active', 'نشط')
                      : t('Expired', 'منتهي')}
                  </dd>
                </div>
              )}

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Hash className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('ID/Number', 'الرقم التعريفي')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className={`text-xs sm:text-sm font-mono tabular-nums font-semibold ${
                    record.idNumber === 'N/A'
                      ? 'text-[#64748B]/75 font-normal'
                      : 'text-[#1F2937]'
                  }`}
                >
                  {record.idNumber}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Expiry Date', 'تاريخ الانتهاء')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className={`text-xs sm:text-sm font-mono tabular-nums font-semibold ${
                    record.expiryDate === 'N/A'
                      ? 'text-[#64748B]/75 font-normal'
                      : 'text-[#1F2937]'
                  }`}
                >
                  {record.expiryDate}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Read-Only Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#64748B]">
            {t(
              'Read-only record view',
              'عرض للقراءة فقط — القيم المعروضة مطابقة للبيانات المصدرية'
            )}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            {t('Close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
};
