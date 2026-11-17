import React, { useRef } from 'react';
import { Calendar, Newspaper, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { MediaAnnouncementRecord } from '../../types/portal';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface MediaArticleDetailsModalProps {
  article: MediaAnnouncementRecord | null;
  onClose: () => void;
}

export const MediaArticleDetailsModal: React.FC<
  MediaArticleDetailsModalProps
> = ({ article, onClose }) => {
  const { t } = usePortal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(article),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!article) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-article-details-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center sm:items-stretch justify-center sm:justify-end bg-black/55 p-4 sm:p-0 overflow-y-auto"
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg sm:max-w-xl sm:h-full rounded-lg sm:rounded-none border sm:border-y-0 sm:border-e-0 sm:border-s border-[#E5E7EB] bg-white shadow-2xl flex flex-col justify-between overflow-hidden my-auto sm:my-0"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-[#E5E7EB] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Newspaper className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
            <span className="font-semibold text-[#1A7373]">
              {t('News & Announcements', 'الأخبار والإعلانات')}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('Close article', 'إغلاق المقال')}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Editorial Article Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="space-y-2.5 pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
              <time
                dir="ltr"
                dateTime="2025-10-18T02:00:00"
                className="font-mono font-medium text-[#1F2937] tabular-nums"
              >
                {article.publishedAt}
              </time>
            </div>

            <h2
              id="media-article-details-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-[#1F2937] leading-snug"
            >
              {article.title}
            </h2>
          </div>

          {/* Full Announcement Body */}
          <div className="prose max-w-none">
            <p className="text-sm sm:text-[15px] text-[#1F2937] leading-relaxed whitespace-pre-line">
              {article.body}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            {t('Close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
};
