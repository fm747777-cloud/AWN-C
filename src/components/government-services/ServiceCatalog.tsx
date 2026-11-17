import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSearch,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  GovernmentServiceCategoryId,
  GovernmentServiceCategoryMeta,
  GovernmentServiceRecord,
  GovernmentServicesTopView,
} from '../../types/portal';
import { usePortal } from '../../context/PortalContext';

interface ServiceCatalogProps {
  activeTopView: GovernmentServicesTopView;
  categories: GovernmentServiceCategoryMeta[];
  services: GovernmentServiceRecord[];
  selectedCategoryId: GovernmentServiceCategoryId;
  onViewDetails: (service: GovernmentServiceRecord) => void;
}

const PAGE_SIZE = 10;

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  activeTopView,
  categories,
  services,
  selectedCategoryId,
  onViewDetails,
}) => {
  const { language, isRtl, t } = usePortal();
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setSearchInput('');
    setAppliedQuery('');
    setCurrentPage(1);
  }, [activeTopView, selectedCategoryId]);

  const activeCategoryMeta: GovernmentServiceCategoryMeta =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const categoryPool: GovernmentServiceRecord[] =
    activeTopView === 'subscribed'
      ? services.filter(
          (s) => s.isSubscribed && s.categoryId === selectedCategoryId
        )
      : services.filter((s) => s.categoryId === selectedCategoryId);

  const normalizedQuery: string = appliedQuery.trim().toLowerCase();

  const matchingServices: GovernmentServiceRecord[] = categoryPool.filter(
    (service) => {
      if (!normalizedQuery) {
        return true;
      }
      const nameMatch: boolean = service.serviceName
        .toLowerCase()
        .includes(normalizedQuery);
      const descMatch: boolean = service.description
        .toLowerCase()
        .includes(normalizedQuery);
      const codeMatch: boolean = service.serviceCode
        ? service.serviceCode.toLowerCase().includes(normalizedQuery)
        : false;
      return nameMatch || descMatch || codeMatch;
    }
  );

  const totalPages: number = Math.max(
    1,
    Math.ceil(matchingServices.length / PAGE_SIZE)
  );
  const safeCurrentPage: number = Math.min(currentPage, totalPages);
  const startIndex: number = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedServices: GovernmentServiceRecord[] = matchingServices.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setAppliedQuery(searchInput);
    setCurrentPage(1);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nextValue: string = event.target.value;
    setSearchInput(nextValue);
    setAppliedQuery(nextValue);
    setCurrentPage(1);
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setAppliedQuery('');
    setCurrentPage(1);
  };

  const getDynamicCategoryHeading = (): string => {
    if (activeTopView === 'subscribed') {
      return language === 'ar'
        ? activeCategoryMeta.labelAr
        : activeCategoryMeta.labelEn;
    }
    if (language === 'ar') {
      return `جميع ${activeCategoryMeta.labelAr} (${categoryPool.length})`;
    }
    return `All ${activeCategoryMeta.labelEn} (${categoryPool.length})`;
  };

  return (
    <section
      id={`service-tabpanel-${selectedCategoryId}`}
      role="tabpanel"
      aria-labelledby={`service-tab-${selectedCategoryId}`}
      className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-5"
    >
      {/* Top Bar: Dynamic Selected Category Heading + Count + Search Service Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#1F2937]">
              {getDynamicCategoryHeading()}
            </h2>
            {activeTopView === 'subscribed' && (
              <span
                dir="ltr"
                className="px-2.5 py-0.5 rounded-md bg-[#37848C]/10 font-mono text-xs font-bold text-[#1A7373] tabular-nums"
              >
                {categoryPool.length}
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B]">
            {activeTopView === 'subscribed'
              ? language === 'ar'
                ? `الخدمات المشترك بها في فئة ${activeCategoryMeta.labelAr}: ${categoryPool.length}`
                : `${categoryPool.length} subscribed services in ${activeCategoryMeta.labelEn}`
              : language === 'ar'
              ? `عدد السجلات المصدرية في هذه الفئة: ${categoryPool.length}`
              : `Source record count: ${categoryPool.length}`}
          </p>
        </div>

        {/* Search Service Input + Search Button */}
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder={t('Search Service', 'ابحث عن خدمة...')}
              aria-label={t('Search Service', 'ابحث عن خدمة')}
              className="w-full rounded-md border border-[#E5E7EB] bg-white ps-9 pe-8 py-2 text-xs text-[#1F2937] placeholder:text-[#64748B]/75 focus:outline-none focus:border-[#37848C]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label={t('Clear search', 'مسح البحث')}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1F2937]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            {t('Search', 'بحث')}
          </button>
        </form>
      </div>

      {/* Selected Category Content Area */}
      {paginatedServices.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-md border border-dashed border-[#E5E7EB] bg-[#F8FAFC] space-y-2.5">
          {activeTopView === 'subscribed' ? (
            <ShieldCheck className="w-8 h-8 text-[#37848C] mx-auto opacity-80" />
          ) : (
            <FileSearch className="w-8 h-8 text-[#37848C] mx-auto opacity-80" />
          )}

          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#1F2937]">
              {t('No data found', 'لا توجد بيانات')}
            </p>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              {activeTopView === 'subscribed'
                ? language === 'ar'
                  ? `يوجد حالياً 0 خدمات مشترك بها ضمن فئة ${activeCategoryMeta.labelAr}.`
                  : `There are currently 0 subscribed services in ${activeCategoryMeta.labelEn}.`
                : t(
                    'No services in this category match your search query.',
                    'لم يتم العثور على خدمات تطابق عبارة البحث المدخلة في هذه الفئة.'
                  )}
            </p>
          </div>

          {appliedQuery && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-[#E5E7EB] bg-white text-[#1A7373] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('Reset Search', 'إعادة تعيين البحث')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedServices.map((service) => (
            <article
              key={service.catalogKey}
              className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]/60 p-5 flex flex-col justify-between gap-4 hover:border-[#37848C]/60 transition-colors"
            >
              <div className="space-y-2.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                  <span className="font-medium text-[#1A7373]">
                    {service.category}
                  </span>

                  {service.serviceCode && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span
                        dir="ltr"
                        className="font-mono font-semibold text-[#1F2937] tabular-nums"
                      >
                        {service.serviceCode}
                      </span>
                    </>
                  )}

                  {service.status && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{service.status}</span>
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#1F2937] break-words">
                  {service.serviceName}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed break-words">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#64748B]">
                  {service.boardingType
                    ? `${t('Boarding type:', 'نوع التأهيل:')} ${
                        service.boardingType
                      }`
                    : t('Cataloged service record', 'سجل خدمة معتمد في الدليل')}
                </span>

                <button
                  type="button"
                  onClick={() => onViewDetails(service)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('View Details', 'عرض التفاصيل')}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Bar: Previous, Current Page, Page-Size 10, Next */}
      <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <span>{t('Items per page:', 'عدد العناصر في الصفحة:')}</span>
          <span
            dir="ltr"
            className="px-2 py-0.5 rounded border border-[#E5E7EB] bg-[#F8FAFC] font-mono font-semibold text-[#1F2937] tabular-nums"
          >
            {PAGE_SIZE}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
          >
            {isRtl ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
            <span>{t('Previous', 'السابق')}</span>
          </button>

          <span
            dir="ltr"
            className="px-3 py-1.5 rounded-md border border-[#37848C]/40 bg-[#37848C]/10 font-mono text-xs font-bold text-[#1A7373] tabular-nums"
          >
            {safeCurrentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safeCurrentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t('Next', 'التالي')}</span>
            {isRtl ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
