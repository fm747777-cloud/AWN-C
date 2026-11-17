import React, { useState } from 'react';
import { Building2, Users, Package, FileText, Info } from 'lucide-react';
import { KpiCardItem } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../../theme/portalDesignSystem';

interface DashboardKpiGridProps {
  items: KpiCardItem[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ items }) => {
  const { language, t } = usePortal();
  const [selectedKpiId, setSelectedKpiId] = useState<KpiCardItem['id'] | null>(
    null
  );

  const getKpiCategory = (id: KpiCardItem['id']): SemanticKpiCategory => {
    switch (id) {
      case 'businesses':
        return 'teal';
      case 'employees':
        return 'blue';
      case 'assets':
        return 'green';
      case 'documents':
        return 'teal';
    }
  };

  const getKpiIcon = (
    id: KpiCardItem['id'],
    iconColorClass: string
  ): React.ReactNode => {
    switch (id) {
      case 'businesses':
        return <Building2 className={`w-4 h-4 ${iconColorClass}`} />;
      case 'employees':
        return <Users className={`w-4 h-4 ${iconColorClass}`} />;
      case 'assets':
        return <Package className={`w-4 h-4 ${iconColorClass}`} />;
      case 'documents':
        return <FileText className={`w-4 h-4 ${iconColorClass}`} />;
    }
  };

  const selectedItem: KpiCardItem | undefined = items.find(
    (i) => i.id === selectedKpiId
  );

  return (
    <section
      aria-label={t('KPI Summary', 'ملخص مؤشرات الأداء الرئيسية')}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {items.map((item) => {
          const isSelected: boolean = selectedKpiId === item.id;
          const label: string =
            language === 'ar' ? item.labelAr : item.labelEn;
          const note: string =
            language === 'ar' ? item.sourceNoteAr : item.sourceNoteEn;
          const category = getKpiCategory(item.id);
          const tone = SEMANTIC_KPI_TONES[category];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSelectedKpiId((prev) => (prev === item.id ? null : item.id))
              }
              aria-pressed={isSelected}
              className={`text-start rounded-lg border px-4 py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                tone.topBorderClass
              } ${
                isSelected
                  ? 'border-[#37848C] bg-[#F8FAFC]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#64748B]">
                  {label}
                </span>
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${tone.iconContainerClass}`}
                >
                  {getKpiIcon(item.id, tone.iconColorClass)}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span
                  dir="ltr"
                  className={`text-2xl font-bold font-mono tabular-nums ${tone.valueTextClass}`}
                >
                  {item.formattedValue}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  {t('Mock Value', 'قيمة تجريبية')}
                </span>
              </div>

              <p className="mt-1.5 text-[11px] text-[#64748B] truncate">
                {note}
              </p>
            </button>
          );
        })}
      </div>

      {selectedItem && (
        <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2 min-w-0">
            <Info className="w-4 h-4 text-[#37848C] shrink-0" />
            <p className="truncate">
              <span className="font-semibold text-[#1F2937]">
                {language === 'ar'
                  ? selectedItem.labelAr
                  : selectedItem.labelEn}
                :{' '}
              </span>
              <span
                dir="ltr"
                className="font-mono font-semibold text-[#1F2937] tabular-nums"
              >
                {selectedItem.formattedValue}
              </span>
              <span>
                {' '}
                —{' '}
                {t(
                  'Centralized mock value awaiting shared backend API integration.',
                  'قيمة تجريبية محفوظة في طبقة البيانات المركزية بانتظار الربط بالخادم.'
                )}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedKpiId(null)}
            className="text-xs font-semibold text-[#1A7373] hover:underline shrink-0"
          >
            {t('Dismiss', 'إغلاق')}
          </button>
        </div>
      )}
    </section>
  );
};
