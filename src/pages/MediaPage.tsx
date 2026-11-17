import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  HelpCircle,
  Newspaper,
  Search,
  X,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  MediaAnnouncementRecord,
  MediaFaqRecord,
  MediaPageData,
  MediaTabId,
} from '../types/portal';
import { MediaArticleDetailsModal } from '../components/media/MediaArticleDetailsModal';

interface MediaTabConfig {
  id: MediaTabId;
  label: string;
  count: number;
  icon: React.ReactNode;
}

export const MediaPage: React.FC = () => {
  const { isRtl, selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<MediaPageData | null>(null);
  // Default to News & Announcements per specification
  const [activeTab, setActiveTab] = useState<MediaTabId>('news-announcements');

  // Independent FAQ search & accordion state
  const [faqSearchInput, setFaqSearchInput] = useState<string>('');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Selected article for details drawer/modal
  const [selectedArticle, setSelectedArticle] =
    useState<MediaAnnouncementRecord | null>(null);

  useEffect(() => {
    let active = true;
    portalService.getMediaData().then((data) => {
      if (active) {
        setPageData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredFaqs = useMemo<MediaFaqRecord[]>(() => {
    if (!pageData) return [];
    const query = faqSearchQuery.trim().toLowerCase();
    if (!query) return pageData.faqs;

    return pageData.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [pageData, faqSearchQuery]);

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Media...', 'جاري تحميل المركز الإعلامي...')}
      </div>
    );
  }

  const tabs: MediaTabConfig[] = [
    {
      id: 'faqs',
      label: t(pageData.faqsTabLabelEn, 'الأسئلة الشائعة'),
      count: pageData.faqs.length,
      icon: <HelpCircle className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'news-announcements',
      label: t(pageData.newsTabLabelEn, 'الأخبار والإعلانات'),
      count: pageData.announcements.length,
      icon: <Newspaper className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void => {
    if (tabs.length === 0) return;

    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey) {
      event.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Media Page Header */}
      <section
        aria-labelledby="media-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-wider text-[#1A7373]">
              {t(pageData.eyebrowEn, 'المركز الإعلامي')}
            </span>
            <span aria-hidden="true" className="text-gray-300">
              ·
            </span>
            <span className="text-[#64748B] font-medium">
              {selectedCompany.name}
            </span>
          </div>

          <h1
            id="media-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, 'المركز الإعلامي')}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'ابقَ على اطلاع بآخر التحديثات والأخبار والإرشادات المعتمدة في بوابة عون.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Two Independent Page-Level Tabs & Active Tab Content */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
        {/* Accessible 2-Tab Bar: FAQS | News & Announcements */}
        <div
          role="tablist"
          aria-label={t('Media Navigation Tabs', 'علامات تبويب المركز الإعلامي')}
          className="px-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`media-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`media-tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37848C] ${
                  isSelected
                    ? 'border-[#37848C] text-[#1A7373] bg-white font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] font-medium'
                }`}
              >
                <span
                  className={isSelected ? 'text-[#37848C]' : 'text-[#64748B]'}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span
                  dir="ltr"
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-[#37848C]/10 text-[#1A7373] font-bold'
                      : 'text-[#64748B] bg-gray-100'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Panel */}
        <div className="p-5 sm:p-6">
          {/* =========================================================
              TAB 1: FAQS
             ========================================================= */}
          {activeTab === 'faqs' && (
            <div
              id="media-tabpanel-faqs"
              role="tabpanel"
              aria-labelledby="media-tab-faqs"
              className="space-y-5"
            >
              {/* FAQ Header + Search Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]">
                    {t(pageData.faqsTabLabelEn, 'الأسئلة الشائعة')}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {t(
                      'Search frequently asked questions and portal guidance.',
                      'ابحث في الأسئلة الشائعة والإرشادات المعتمدة.'
                    )}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFaqSearchQuery(faqSearchInput);
                  }}
                  role="search"
                  aria-label={t('Search FAQs', 'البحث في الأسئلة الشائعة')}
                  className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1 sm:w-72 md:w-80">
                    <label htmlFor="media-faqs-search-input" className="sr-only">
                      {t(
                        pageData.faqsSearchPlaceholder,
                        'البحث في الأسئلة الشائعة...'
                      )}
                    </label>
                    <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="media-faqs-search-input"
                      type="text"
                      value={faqSearchInput}
                      onChange={(e) => {
                        setFaqSearchInput(e.target.value);
                        setFaqSearchQuery(e.target.value);
                      }}
                      placeholder={t(
                        pageData.faqsSearchPlaceholder,
                        'البحث في الأسئلة الشائعة...'
                      )}
                      className="w-full h-9 ps-9 pe-8 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
                    />
                    {faqSearchInput.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFaqSearchInput('');
                          setFaqSearchQuery('');
                        }}
                        aria-label={t('Clear FAQ search', 'مسح البحث')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64748B] hover:text-[#1F2937] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* FAQ List or Empty State */}
              {filteredFaqs.length > 0 ? (
                <div className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB] bg-white">
                  {filteredFaqs.map((faq) => {
                    const isOpen = expandedFaqId === faq.id;
                    return (
                      <div key={faq.id} className="p-4 sm:p-5">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setExpandedFaqId((prev) =>
                              prev === faq.id ? null : faq.id
                            )
                          }
                          className="w-full flex items-center justify-between gap-4 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] rounded"
                        >
                          <span className="text-sm font-semibold text-[#1F2937]">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#37848C] shrink-0 transition-transform duration-150 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-3 pt-3 border-t border-[#E5E7EB] text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] text-[#64748B] flex items-center justify-center">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {t(
                        pageData.faqsEmptyStateText,
                        'لم يتم العثور على أسئلة شائعة'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 2: NEWS & ANNOUNCEMENTS
             ========================================================= */}
          {activeTab === 'news-announcements' && (
            <div
              id="media-tabpanel-news-announcements"
              role="tabpanel"
              aria-labelledby="media-tab-news-announcements"
              className="space-y-6"
            >
              {/* Featured Editorial Heading Banner */}
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-[#1A7373] font-semibold">
                    <span>{t('Featured', 'مميز')}</span>
                    <span aria-hidden="true" className="text-gray-300">
                      ·
                    </span>
                    <span className="text-[#64748B] font-medium">
                      {t('AWN Client Portal', 'بوابة عملاء عون')}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1F2937] leading-snug">
                    {t(pageData.featuredContentTitle, 'أحدث الإعلانات والتحديثات الرسمية')}
                  </h2>
                </div>

                {/* Restrained Brand Emblem Accent */}
                <div
                  aria-hidden="true"
                  className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg border border-[#E5E7EB] bg-white text-[#37848C] shrink-0"
                >
                  <Newspaper className="w-5 h-5" />
                </div>
              </div>

              {/* Announcements Editorial Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#1F2937]">
                    {t('Latest Announcements', 'أحدث الإعلانات')} (
                    {pageData.announcements.length})
                  </h3>
                </div>

                {pageData.announcements.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {pageData.announcements.map((item) => (
                      <article
                        key={item.id}
                        tabIndex={0}
                        role="button"
                        aria-label={t(
                          `Read full article: ${item.title}`,
                          `قراءة المقال كاملاً: ${item.title}`
                        )}
                        onClick={() => setSelectedArticle(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedArticle(item);
                          }
                        }}
                        className="group rounded-lg border border-[#E5E7EB] bg-white hover:border-[#37848C] hover:bg-[#F1F5F9]/60 p-5 sm:p-6 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                      >
                        <div className="flex flex-col justify-between gap-4">
                          <div className="space-y-2.5">
                            {/* Unboxed Metadata Line */}
                            <div className="flex items-center gap-2 text-xs text-[#64748B]">
                              <Calendar className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                              <time
                                dir="ltr"
                                dateTime="2025-10-18T02:00:00"
                                className="font-mono font-medium text-[#1F2937] tabular-nums"
                              >
                                {item.publishedAt}
                              </time>
                            </div>

                            {/* Clickable Announcement Title */}
                            <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937] group-hover:text-[#1A7373] transition-colors">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedArticle(item);
                                }}
                                className="text-start focus:outline-none"
                              >
                                {item.title}
                              </button>
                            </h4>

                            {/* Short Editorial Excerpt */}
                            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
                              {item.excerpt}
                            </p>
                          </div>

                          {/* Card Footer with Read Full Article Action */}
                          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedArticle(item);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1A7373] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] rounded"
                            >
                              <span>
                                {t('Read full article', 'قراءة المقال كاملاً')}
                              </span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                                  isRtl
                                    ? 'rotate-180 group-hover:-translate-x-0.5'
                                    : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {t('No announcements available', 'لا توجد إعلانات متاحة')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reusable Article Details Drawer / Modal */}
      <MediaArticleDetailsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};
