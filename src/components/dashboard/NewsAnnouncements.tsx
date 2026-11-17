import React, { useRef, useState } from 'react';
import { Newspaper, Eye, X } from 'lucide-react';
import { NewsAnnouncementTopic } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

interface NewsAnnouncementsProps {
  topics: NewsAnnouncementTopic[];
}

export const NewsAnnouncements: React.FC<NewsAnnouncementsProps> = ({
  topics,
}) => {
  const { language, t } = usePortal();
  const [previewTopic, setPreviewTopic] =
    useState<NewsAnnouncementTopic | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const previewCloseButtonRef = useRef<HTMLButtonElement>(null);
  const viewAllCloseButtonRef = useRef<HTMLButtonElement>(null);

  const previewModalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: Boolean(previewTopic),
    onClose: () => setPreviewTopic(null),
    initialFocusRef: previewCloseButtonRef,
  });

  const viewAllModalRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: viewAllOpen,
    onClose: () => setViewAllOpen(false),
    initialFocusRef: viewAllCloseButtonRef,
  });

  return (
    <section
      aria-labelledby="news-announcements-heading"
      className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2
            id="news-announcements-heading"
            className="text-base font-semibold text-[#1F2937]"
          >
            {t('News & Announcements', 'الأخبار والإعلانات')}
          </h2>
          <p className="text-xs text-[#64748B]">
            {t(
              'Restrained sample topic placeholders — no fabricated headlines, article bodies, dates, or authors',
              'عناصر نائبة للموضوعات المتوفرة فقط — لم يتم اختلاق مقالات أو تواريخ نشر أو مؤلفين'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewAllOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md border border-[#E5E7EB] bg-white text-[#1A7373] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-[#37848C]" />
          <span>{t('View All', 'عرض الكل')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#1A7373]">
                  <Newspaper className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? topic.statusLabelAr
                      : topic.statusLabelEn}
                  </span>
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#1F2937]">
                {language === 'ar' ? topic.topicTitleAr : topic.topicTitle}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed">
                {language === 'ar'
                  ? topic.placeholderNoteAr
                  : topic.placeholderNoteEn}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {t(
                  'Sample Content Placeholder',
                  'محتوى تجريبي (بانتظار النصوص الرسمية)'
                )}
              </span>
              <button
                type="button"
                onClick={() => setPreviewTopic(topic)}
                className="text-xs font-semibold text-[#1A7373] hover:underline"
              >
                {t('Inspect Placeholder', 'معاينة الحالة')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Topic Placeholder Inspection Modal */}
      {previewTopic && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-topic-preview-modal-title"
          onClick={() => setPreviewTopic(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={previewModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <h3
                id="news-topic-preview-modal-title"
                className="text-sm font-semibold text-[#1F2937]"
              >
                {language === 'ar'
                  ? previewTopic.topicTitleAr
                  : previewTopic.topicTitle}
              </h3>
              <button
                ref={previewCloseButtonRef}
                type="button"
                onClick={() => setPreviewTopic(null)}
                aria-label={t('Close Topic Preview', 'إغلاق معاينة الموضوع')}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {language === 'ar'
                ? previewTopic.placeholderNoteAr
                : previewTopic.placeholderNoteEn}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewTopic(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors"
              >
                {t('Close', 'إغلاق')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {viewAllOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-view-all-modal-title"
          onClick={() => setViewAllOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            ref={viewAllModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <h3
                id="news-view-all-modal-title"
                className="text-sm font-semibold text-[#1F2937]"
              >
                {t(
                  'News & Announcements (Phase 1 Preview)',
                  'الأخبار والإعلانات (معاينة المرحلة الأولى)'
                )}
              </h3>
              <button
                ref={viewAllCloseButtonRef}
                type="button"
                onClick={() => setViewAllOpen(false)}
                aria-label={t(
                  'Close News & Announcements Preview',
                  'إغلاق معاينة الأخبار والإعلانات'
                )}
                className="text-[#64748B] hover:text-[#1F2937] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[#64748B] space-y-2">
              <p>
                {t(
                  'Supplied topics in source specification:',
                  'الموضوعات المزودة حالياً في المصدر:'
                )}
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#1F2937] font-medium">
                {topics.map((topicItem) => (
                  <li key={topicItem.id}>
                    {language === 'ar'
                      ? topicItem.topicTitleAr
                      : topicItem.topicTitle}
                  </li>
                ))}
              </ul>
              <p className="pt-1">
                {t(
                  'Full editorial content and dedicated archive view will be supplied in a future phase.',
                  'سيتم تزويد المحتوى التحريري الكامل في مرحلة لاحقة.'
                )}
              </p>
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
