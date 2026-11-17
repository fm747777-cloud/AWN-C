import React, { useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { GovernmentServiceRecord } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface ServiceDetailsModalProps {
  service: GovernmentServiceRecord | null;
  onClose: () => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  onClose,
}) => {
  const { t } = usePortal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(service),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!service) {
    return null;
  }

  const unavailableLabel: string = t(
    'Not available in source',
    'غير متوفر في المصدر'
  );

  const renderFieldValue = (value?: string, isMono?: boolean): React.ReactNode => {
    if (!value) {
      return (
        <span className="text-xs italic text-[#64748B]/75">
          {unavailableLabel}
        </span>
      );
    }
    return (
      <span
        dir={isMono ? 'ltr' : undefined}
        className={`text-sm font-medium text-[#1F2937] break-words ${
          isMono ? 'font-mono tabular-nums' : ''
        }`}
      >
        {value}
      </span>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-details-modal-title"
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
          <div>
            <h2
              id="service-details-modal-title"
              className="text-base font-bold text-[#1F2937]"
            >
              {t('Service Details', 'تفاصيل الخدمة')}
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {t(
                'View complete information about this service',
                'عرض المعلومات الكاملة لهذه الخدمة'
              )}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('Close Service Details', 'إغلاق تفاصيل الخدمة')}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Selected Service Summary Banner */}
          <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1A7373]">
                {service.category}
              </span>
              {service.status && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{service.status}</span>
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] break-words">
              {service.serviceName}
            </h3>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-[#64748B] border-b border-[#E5E7EB] pb-1.5 uppercase">
              {t('Basic Information', 'المعلومات الأساسية')}
            </h4>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('SERVICE NAME', 'اسم الخدمة')}
                </dt>
                <dd>{renderFieldValue(service.serviceName)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('SERVICE CODE', 'رمز الخدمة')}
                </dt>
                <dd>{renderFieldValue(service.serviceCode, true)}</dd>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('DESCRIPTION', 'الوصف')}
                </dt>
                <dd>{renderFieldValue(service.description)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('ID', 'المعرف')}
                </dt>
                <dd>{renderFieldValue(service.id, true)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('BOARDING TYPE', 'نوع التأهيل')}
                </dt>
                <dd>{renderFieldValue(service.boardingType, true)}</dd>
              </div>
            </dl>
          </div>

          {/* Timestamps Section */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold tracking-wider text-[#64748B] border-b border-[#E5E7EB] pb-1.5 uppercase">
              {t('Timestamps', 'الطوابع الزمنية')}
            </h4>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('CREATED AT', 'تاريخ الإنشاء')}
                </dt>
                <dd>{renderFieldValue(service.createdAt, true)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold text-[#64748B]">
                  {t('UPDATED AT', 'تاريخ التحديث')}
                </dt>
                <dd>{renderFieldValue(service.updatedAt, true)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Read-Only Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#64748B]">
            {t(
              'Read-only view — unavailable source values are left unpopulated',
              'عرض للقراءة فقط — لم يتم اختلاق القيم غير المتوفرة في المصدر'
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
