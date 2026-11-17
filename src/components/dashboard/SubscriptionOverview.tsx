import React, { useRef, useState } from 'react';
import { AlertCircle, CreditCard, X } from 'lucide-react';
import { SubscriptionOverviewData } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { PaymentHistoryChart } from './PaymentHistoryChart';
import { SEMANTIC_KPI_TONES } from '../../theme/portalDesignSystem';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface SubscriptionOverviewProps {
  subscription: SubscriptionOverviewData;
}

type ModalMode = null | 'payment-details' | 'deactivate-preview';

export const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  subscription,
}) => {
  const { language, selectedCompany, t } = usePortal();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: modalMode !== null,
    onClose: () => setModalMode(null),
    initialFocusRef: closeButtonRef,
  });

  const expiredTone = SEMANTIC_KPI_TONES.red;
  const tealTone = SEMANTIC_KPI_TONES.teal;
  const slateTone = SEMANTIC_KPI_TONES.slate;

  return (
    <section
      aria-labelledby="subscription-heading"
      className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2
            id="subscription-heading"
            className="text-base font-semibold text-[#1F2937]"
          >
            {t('Subscription & Payments', 'الاشتراك والمدفوعات')}
          </h2>
          <p className="text-xs text-[#64748B]">
            {t(
              `Selected company context: ${selectedCompany.name}`,
              `المنشأة المحددة: ${selectedCompany.name}`
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModalMode('payment-details')}
            className="px-3.5 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            {t('Payment Details', 'تفاصيل الدفع')}
          </button>
          <button
            type="button"
            onClick={() => setModalMode('deactivate-preview')}
            className="px-3.5 py-2 text-xs font-semibold rounded-md border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            {t('Deactivate Subscription', 'إلغاء تفعيل الاشتراك')}
          </button>
        </div>
      </div>

      {/* Two-Column Split: Plan & Dates Summary vs Monthly Payment Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Subscription Hierarchy */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Plan & Restrained Expired Status */}
          <div
            className={`p-3.5 rounded-md border border-[#E5E7EB] bg-white space-y-2.5 ${expiredTone.topBorderClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-medium text-[#64748B] block">
                  {t('Current Subscription Plan', 'الباقة الحالية')}
                </span>
                <p className="mt-0.5 text-sm sm:text-base font-bold text-[#1F2937]">
                  {subscription.planName}
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${expiredTone.badgeClass}`}
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {subscription.subscriptionStatus}
                  {language === 'ar' ? ' · منتهي' : ''}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">
                {t('Payment Status:', 'حالة الدفع:')}
              </span>
              <span className="font-semibold text-[#1F2937]">
                {language === 'ar'
                  ? subscription.paymentStatusAr
                  : subscription.paymentStatusEn}
              </span>
            </div>
          </div>

          {/* 2 & 3. Next Billing Amount (SAR 350) + Renewal & Next Billing Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`p-3 rounded-md border border-[#E5E7EB] bg-white ${tealTone.topBorderClass}`}
            >
              <span className="text-[11px] text-[#64748B] block">
                {t('Next Billing', 'المبلغ القادم')}
              </span>
              <span
                dir="ltr"
                className="mt-1 block font-mono text-base font-bold text-[#1A7373] tabular-nums"
              >
                {subscription.nextBillingAmount}
              </span>
            </div>

            <div
              className={`p-3 rounded-md border border-[#E5E7EB] bg-white ${slateTone.topBorderClass}`}
            >
              <span className="text-[11px] text-[#64748B] block">
                {t('Renewal Date', 'تاريخ التجديد')}
              </span>
              <span
                dir="ltr"
                className="mt-1 block font-mono text-xs sm:text-sm font-semibold text-[#1F2937] tabular-nums"
              >
                {subscription.renewalDate}
              </span>
            </div>

            <div
              className={`p-3 rounded-md border border-[#E5E7EB] bg-white ${slateTone.topBorderClass}`}
            >
              <span className="text-[11px] text-[#64748B] block">
                {t('Next Billing Date', 'الفوترة القادمة')}
              </span>
              <span
                dir="ltr"
                className="mt-1 block font-mono text-xs sm:text-sm font-semibold text-[#1F2937] tabular-nums"
              >
                {subscription.nextBillingDate}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#64748B]">
            {language === 'ar'
              ? subscription.dateConsistencyNoteAr
              : subscription.dateConsistencyNoteEn}
          </p>
        </div>

        {/* 4. Right: Payment History Chart */}
        <div className="lg:col-span-7 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-s border-[#E5E7EB] lg:ps-6">
          <PaymentHistoryChart data={subscription.monthlyHistory} />
        </div>
      </div>

      {/* Non-Destructive Mock Action Modal / Drawer */}
      {modalMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-overview-modal-title"
          onClick={() => setModalMode(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#37848C]" />
                <h3
                  id="subscription-overview-modal-title"
                  className="text-sm font-semibold text-[#1F2937]"
                >
                  {modalMode === 'payment-details'
                    ? t(
                        'Payment Details (Mock Source View)',
                        'تفاصيل الدفع والاشتراك (معاينة تجريبية)'
                      )
                    : t(
                        'Deactivate Subscription (Mock Preview Only)',
                        'إلغاء تفعيل الاشتراك (معاينة غير تنفيذية)'
                      )}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setModalMode(null)}
                aria-label={t('Close Subscription Modal', 'إغلاق نافذة الاشتراك')}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalMode === 'payment-details' ? (
              <div className="space-y-2.5 text-xs text-[#64748B]">
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span>{t('Current Plan:', 'الباقة:')}</span>
                  <span className="font-semibold text-[#1F2937]">
                    {subscription.planName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span>{t('Next Billing Amount:', 'المبلغ القادم:')}</span>
                  <span
                    dir="ltr"
                    className="font-mono font-semibold text-[#1F2937] tabular-nums"
                  >
                    {subscription.nextBillingAmount}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span>{t('Subscription Status:', 'حالة الاشتراك:')}</span>
                  <span className="font-semibold text-[#DC2626]">
                    {subscription.subscriptionStatus}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span>{t('Renewal Date:', 'تاريخ التجديد:')}</span>
                  <span
                    dir="ltr"
                    className="font-mono text-[#1F2937] tabular-nums"
                  >
                    {subscription.renewalDate}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span>
                    {t('Next Billing Date:', 'تاريخ الفوترة القادم:')}
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono text-[#1F2937] tabular-nums"
                  >
                    {subscription.nextBillingDate}
                  </span>
                </div>
                <p className="pt-1 text-[11px]">
                  {t(
                    'Note: No additional invoices or payment transactions have been fabricated. Live payment gateway integration belongs to a future phase.',
                    'ملاحظة: لم تتم إضافة فواتير أو معاملات دفع غير موثقة. بوابة الدفع الحقيقية ستتوفر في مرحلة لاحقة.'
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#64748B]">
                <p>
                  {t(
                    'This control is a non-destructive mock preview for Phase 1. No real subscription cancellation or backend state change is performed.',
                    'هذا الإجراء مخصص للعرض التجريبي فقط في المرحلة الأولى. لن يتم إجراء أي إلغاء حقيقي أو تعديل على حالة الاشتراك.'
                  )}
                </p>
                <div className="p-3 rounded bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937]">
                  <p className="font-semibold">{subscription.planName}</p>
                  <p dir="ltr" className="font-mono text-[11px] mt-1 tabular-nums">
                    Status: {subscription.subscriptionStatus} ·{' '}
                    {subscription.nextBillingAmount}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors"
              >
                {t('Close Preview', 'إغلاق المعاينة')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
