import React from 'react';
import { Building2, Layers, Package, ShieldCheck, Users } from 'lucide-react';
import {
  GovernmentServiceCategoryId,
  GovernmentServiceCategoryMeta,
  GovernmentServiceRecord,
  GovernmentServicesTopView,
} from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../../theme/portalDesignSystem';

interface ServiceCategoryTabsProps {
  activeTopView: GovernmentServicesTopView;
  onSelectTopView: (view: GovernmentServicesTopView) => void;
  subscribedSourceCount: string;
  allAwnServicesSourceCount: string;
  categories: GovernmentServiceCategoryMeta[];
  services: GovernmentServiceRecord[];
  selectedCategoryId: GovernmentServiceCategoryId;
  onSelectCategory: (id: GovernmentServiceCategoryId) => void;
}

export const ServiceCategoryTabs: React.FC<ServiceCategoryTabsProps> = ({
  activeTopView,
  onSelectTopView,
  subscribedSourceCount,
  allAwnServicesSourceCount,
  categories,
  services,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { language, isRtl, t } = usePortal();

  const getCategoryTone = (
    categoryId: GovernmentServiceCategoryId
  ): SemanticKpiCategory => {
    switch (categoryId) {
      case 'business':
        return 'teal';
      case 'employee':
        return 'blue';
      case 'assets':
        return 'green';
    }
  };

  const getCategoryIcon = (
    categoryId: GovernmentServiceCategoryId
  ): React.ReactNode => {
    switch (categoryId) {
      case 'business':
        return <Building2 className="w-4 h-4 shrink-0" />;
      case 'employee':
        return <Users className="w-4 h-4 shrink-0" />;
      case 'assets':
        return <Package className="w-4 h-4 shrink-0" />;
    }
  };

  const getCategoryRecordCount = (
    categoryId: GovernmentServiceCategoryId
  ): number => {
    if (activeTopView === 'subscribed') {
      return services.filter(
        (s) => s.isSubscribed && s.categoryId === categoryId
      ).length;
    }
    return services.filter((s) => s.categoryId === categoryId).length;
  };

  const handleCategoryKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ): void => {
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey) {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % categories.length;
      onSelectCategory(categories[nextIndex].id);
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prevIndex =
        (currentIndex - 1 + categories.length) % categories.length;
      onSelectCategory(categories[prevIndex].id);
    }
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-5 space-y-4">
      {/* Level 1: Primary View Selector (Subscribed vs All AWN Services) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div
          role="tablist"
          aria-label={t(
            'Primary Service Views',
            'العرض الرئيسي للخدمات الحكومية'
          )}
          className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] self-start"
        >
          {/* Primary View 1: Subscribed */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTopView === 'subscribed'}
            onClick={() => onSelectTopView('subscribed')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0 ${
              activeTopView === 'subscribed'
                ? 'bg-[#37848C] text-white shadow-xs'
                : 'text-[#1F2937] hover:text-[#1A7373] hover:bg-[#F1F5F9]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{t('Subscribed', 'المشترك بها')}</span>
            <span
              dir="ltr"
              className={`px-1.5 py-0.5 rounded font-mono text-xs font-bold tabular-nums ${
                activeTopView === 'subscribed'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#E5E7EB] text-[#1F2937]'
              }`}
            >
              {subscribedSourceCount}
            </span>
          </button>

          {/* Primary View 2: All AWN Services */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTopView === 'all-awn-services'}
            onClick={() => onSelectTopView('all-awn-services')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0 ${
              activeTopView === 'all-awn-services'
                ? 'bg-[#37848C] text-white shadow-xs'
                : 'text-[#1F2937] hover:text-[#1A7373] hover:bg-[#F1F5F9]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>{t('All AWN Services', 'جميع خدمات عون')}</span>
            <span
              dir="ltr"
              className={`px-1.5 py-0.5 rounded font-mono text-xs font-bold tabular-nums ${
                activeTopView === 'all-awn-services'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#E5E7EB] text-[#1F2937]'
              }`}
            >
              {allAwnServicesSourceCount}
            </span>
          </button>
        </div>

        <span className="text-xs text-[#64748B]">
          {activeTopView === 'subscribed'
            ? t(
                'Viewing subscribed services by category (0 active subscriptions)',
                'عرض الخدمات المشترك بها حسب الفئة (العدد الحالي: 0)'
              )
            : t(
                'Viewing full AWN service catalog by category',
                'استعراض دليل خدمات عون الكامل حسب الفئة'
              )}
        </span>
      </div>

      {/* Level 2: Three Category Tabs inside BOTH Primary Views */}
      <div
        role="tablist"
        aria-label={t('Service Category Tabs', 'فئات الخدمات')}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {categories.map((cat, idx) => {
          const isSelected: boolean = selectedCategoryId === cat.id;
          const recordCount: number = getCategoryRecordCount(cat.id);
          const label: string =
            language === 'ar' ? cat.labelAr : cat.labelEn;
          const tone = SEMANTIC_KPI_TONES[getCategoryTone(cat.id)];

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              id={`service-tab-${cat.id}`}
              aria-selected={isSelected}
              aria-controls={`service-tabpanel-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
              className={`relative flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                tone.topBorderClass
              } ${
                isSelected
                  ? 'border-[#37848C] bg-[#F8FAFC]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#37848C] text-white'
                      : `${tone.iconContainerClass} ${tone.iconColorClass}`
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                </span>
                <div className="min-w-0">
                  <span
                    className={`block text-sm font-semibold truncate ${
                      isSelected ? 'text-[#1A7373]' : 'text-[#1F2937]'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="block text-[11px] text-[#64748B] truncate">
                    {activeTopView === 'subscribed'
                      ? t('0 subscribed', 'مشترك بها: 0')
                      : language === 'ar'
                      ? `محدد المصدر: ${cat.suppliedSelectorCount} · السجلات: ${recordCount}`
                      : `Source: ${cat.suppliedSelectorCount} · Catalog: ${recordCount}`}
                  </span>
                </div>
              </div>

              <span
                dir="ltr"
                className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold tabular-nums shrink-0 ${
                  isSelected
                    ? 'bg-[#1A7373] text-white'
                    : 'bg-[#F1F5F9] text-[#1F2937]'
                }`}
              >
                {activeTopView === 'subscribed' ? 0 : recordCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
