import React, { useRef } from 'react';
import {
  AlertCircle,
  Calendar,
  FileText,
  Hash,
  ListTodo,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { BusinessActivityTodoRecord } from '../../types/portal';
import { SEMANTIC_KPI_TONES } from '../../theme/portalDesignSystem';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface TodoDetailsModalProps {
  todo: BusinessActivityTodoRecord | null;
  onClose: () => void;
}

export const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
  todo,
  onClose,
}) => {
  const { t } = usePortal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(todo),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!todo) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="todo-details-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-[#E5E7EB] bg-white shadow-xl overflow-hidden my-auto"
      >
        {/* 1. Header with To-do Details, Selected Task Code, and Close Control */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#E5E7EB]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                dir="ltr"
                className="text-xs font-mono font-bold text-[#1A7373] tabular-nums"
              >
                {todo.todoCode}
              </span>
              <span aria-hidden="true" className="text-gray-300">
                ·
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                {t('Business Activities / To-dos', 'الأنشطة التجارية / المهام')}
              </span>
            </div>
            <h2
              id="todo-details-modal-title"
              className="text-base font-bold text-[#1F2937]"
            >
              {t('To-do Details', 'تفاصيل المهمة')}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('Close To-do Details', 'إغلاق تفاصيل المهمة')}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* 2. Request Title & Priority Banner */}
          <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A7373]">
                <ListTodo className="w-3.5 h-3.5 shrink-0" />
                <span>{t('Request Title', 'عنوان الطلب')}</span>
              </div>

              <span
                dir="ltr"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold shrink-0 ${SEMANTIC_KPI_TONES.amber.badgeClass}`}
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{todo.priority}</span>
              </span>
            </div>

            <h3
              dir="auto"
              className="text-sm sm:text-base font-bold text-[#1F2937] leading-relaxed break-words"
            >
              {todo.requestTitle}
            </h3>
          </div>

          {/* 3. Structured Information Section */}
          <dl className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md bg-white">
            <div className="px-4 py-3 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                <Hash className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                <span>{t('To-dos Code', 'رمز المهمة')}</span>
              </dt>
              <dd
                dir="ltr"
                className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
              >
                {todo.todoCode}
              </dd>
            </div>

            <div className="px-4 py-3 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                <span>{t('Priority', 'الأولوية')}</span>
              </dt>
              <dd
                dir="ltr"
                className="text-xs sm:text-sm font-semibold text-[#D97706]"
              >
                {todo.priority}
              </dd>
            </div>

            <div className="px-4 py-3 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                <span>{t('Due Date', 'تاريخ الاستحقاق')}</span>
              </dt>
              <dd
                dir="ltr"
                className="text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums"
              >
                {todo.dueDate}
              </dd>
            </div>
          </dl>

          {/* 4. Optional Description Section (rendered only when a description exists in the record) */}
          {todo.description && (
            <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                <FileText className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                <span>{t('Description', 'الوصف')}</span>
              </div>
              <p
                dir="auto"
                className="text-xs sm:text-sm text-[#1F2937] leading-relaxed break-words"
              >
                {todo.description}
              </p>
            </div>
          )}
        </div>

        {/* Read-Only Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#64748B]">
            {t('Read-only task details', 'عرض للقراءة فقط — سجل مهمة مكتملة')}
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
