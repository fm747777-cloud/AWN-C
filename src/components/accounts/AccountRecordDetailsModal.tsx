import React, { useRef } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  FileSignature,
  FileText,
  Hash,
  Mail,
  Phone,
  Receipt,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { SelectedAccountRecord } from '../../types/portal';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface AccountRecordDetailsModalProps {
  selectedRecord: SelectedAccountRecord | null;
  onClose: () => void;
}

export const AccountRecordDetailsModal: React.FC<
  AccountRecordDetailsModalProps
> = ({ selectedRecord, onClose }) => {
  const { t } = usePortal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(selectedRecord),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!selectedRecord) {
    return null;
  }

  const getHeaderMeta = (): { code: string; title: string; subtitle: string } => {
    if (selectedRecord.type === 'quotation') {
      return {
        code: selectedRecord.data.quotationCode,
        title: t('Quotation Details', 'تفاصيل عرض السعر'),
        subtitle: t('Accounts / Quotations', 'الحسابات / عروض الأسعار'),
      };
    }
    if (selectedRecord.type === 'contract') {
      return {
        code: selectedRecord.data.contractCode,
        title: t('Contract Details', 'تفاصيل العقد'),
        subtitle: t('Accounts / Contracts', 'الحسابات / العقود'),
      };
    }
    return {
      code: selectedRecord.data.invoiceCode,
      title: t('Invoice Details', 'تفاصيل الفاتورة'),
      subtitle: t('Accounts / Invoices', 'الحسابات / الفواتير'),
    };
  };

  const headerMeta = getHeaderMeta();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-record-details-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-[#E5E7EB] bg-white shadow-xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#E5E7EB]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                dir="ltr"
                className="text-xs font-mono font-bold text-[#1A7373] tabular-nums"
              >
                {headerMeta.code}
              </span>
              <span aria-hidden="true" className="text-gray-300">
                ·
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                {headerMeta.subtitle}
              </span>
            </div>
            <h2
              id="account-record-details-modal-title"
              className="text-base font-bold text-[#1F2937]"
            >
              {headerMeta.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('Close', 'إغلاق')}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. QUOTATION DETAILS BODY */}
        {selectedRecord.type === 'quotation' && (
          <div className="p-5 space-y-5">
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[11px] text-[#64748B]">
                    {t('Subscriptions', 'الاشتراكات')}
                  </span>
                  <h3
                    dir="auto"
                    className="text-sm sm:text-base font-bold text-[#1F2937] break-words"
                  >
                    {selectedRecord.data.subscriptions}
                  </h3>
                </div>
              </div>

              <span
                dir="ltr"
                className="text-base sm:text-lg font-mono font-bold text-[#1A7373] tabular-nums shrink-0"
              >
                {selectedRecord.data.amount}
              </span>
            </div>

            <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Hash className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Quotation Code', 'رمز عرض السعر')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
                >
                  {selectedRecord.data.quotationCode}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <CreditCard className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Amount', 'المبلغ')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.amount}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <FileText className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Subscriptions', 'الاشتراكات')}</span>
                </dt>
                <dd
                  dir="auto"
                  className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                >
                  {selectedRecord.data.subscriptions}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Quotation Date', 'تاريخ عرض السعر')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.quotationDate}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* 2. CONTRACT DETAILS BODY */}
        {selectedRecord.type === 'contract' && (
          <div className="p-5 space-y-5">
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[11px] text-[#64748B]">
                    {t('Contract Code', 'رمز العقد')}
                  </span>
                  <h3
                    dir="ltr"
                    className="text-base sm:text-lg font-mono font-bold text-[#1F2937] tabular-nums"
                  >
                    {selectedRecord.data.contractCode}
                  </h3>
                </div>
              </div>

              <span
                dir="ltr"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E5E7EB] bg-white text-xs font-mono font-semibold text-[#1A7373] tabular-nums"
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{selectedRecord.data.contractTerm}</span>
              </span>
            </div>

            <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Hash className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Contract Code', 'رمز العقد')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
                >
                  {selectedRecord.data.contractCode}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Mail className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Email Address', 'البريد الإلكتروني')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-medium text-[#1F2937] break-all"
                >
                  {selectedRecord.data.emailAddress}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Phone className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Contact Number', 'رقم التواصل')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.contactNumber}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Start Date', 'تاريخ البدء')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.startDate}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('End Date', 'تاريخ الانتهاء')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.endDate}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                  <span>{t('Contract Term', 'مدة العقد')}</span>
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-semibold text-[#1F2937]"
                >
                  {selectedRecord.data.contractTerm}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* 3. INVOICE DETAILS BODY */}
        {selectedRecord.type === 'invoice' && (
          <div className="p-5 space-y-5">
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center shrink-0 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[11px] text-[#64748B]">
                    {t('Subscriptions', 'الاشتراكات')}
                  </span>
                  <h3
                    dir="auto"
                    className="text-sm sm:text-base font-bold text-[#1F2937] break-words"
                  >
                    {selectedRecord.data.subscriptions}
                  </h3>
                </div>
              </div>

              <span
                dir="ltr"
                className="text-base sm:text-lg font-mono font-bold text-[#1A7373] tabular-nums shrink-0"
              >
                {selectedRecord.data.amount}
              </span>
            </div>

            <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Invoice Code', 'رمز الفاتورة')}
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
                >
                  {selectedRecord.data.invoiceCode}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Amount', 'المبلغ')}
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.amount}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Subscriptions', 'الاشتراكات')}
                </dt>
                <dd
                  dir="auto"
                  className="text-xs sm:text-sm font-semibold text-[#1F2937] text-end"
                >
                  {selectedRecord.data.subscriptions}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Invoice Date', 'تاريخ الفاتورة')}
                </dt>
                <dd
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
                >
                  {selectedRecord.data.invoiceDate}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Invoice Creation Type', 'نوع إنشاء الفاتورة')}
                </dt>
                <dd className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                  {selectedRecord.data.invoiceCreationType}
                </dd>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[#64748B]">
                  {t('Invoice Status', 'حالة الفاتورة')}
                </dt>
                <dd className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                  {selectedRecord.data.invoiceStatus}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Read-Only Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#64748B]">
            {t(
              'Read-only record details',
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
