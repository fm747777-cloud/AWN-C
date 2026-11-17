import React, { useState } from 'react';
import { MonthlyPaymentBar } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { AWN_CHART_SERIES_COLORS } from '../../theme/portalDesignSystem';

interface PaymentHistoryChartProps {
  data: MonthlyPaymentBar[];
}

export const PaymentHistoryChart: React.FC<PaymentHistoryChartProps> = ({
  data,
}) => {
  const { language, t } = usePortal();
  const [selectedBarId, setSelectedBarId] = useState<string>(
    data[0]?.id || 'M1'
  );

  const maxAmount = Math.max(...data.map((d) => d.amountSar), 1000);
  const yAxisTicks = [1000, 750, 500, 250];
  const selectedBar = data.find((d) => d.id === selectedBarId) || data[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#1F2937]">
            {t(
              'Payment History — Monthly Categories (Mock Data)',
              'سجل المدفوعات الشهري (بيانات تجريبية)'
            )}
          </h3>
          <p className="text-xs text-[#64748B]">
            {t(
              'Neutral sequential month labels with supplied sample values (1000, 750, 500, 250)',
              'الفئات الشهرية تستخدم تسميات تسلسلية محايدة مع القيم المزودة (1000، 750، 500، 250)'
            )}
          </p>
        </div>
        {selectedBar && (
          <div className="text-xs text-[#64748B]">
            <span>
              {language === 'ar'
                ? selectedBar.periodLabelAr
                : selectedBar.periodLabelEn}
              :{' '}
            </span>
            <span
              dir="ltr"
              className="font-mono font-semibold text-[#1A7373] tabular-nums"
            >
              SAR {selectedBar.amountSar}
            </span>
          </div>
        )}
      </div>

      {/* Color Legend Strip */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B] pt-1">
        {data.map((bar, index) => {
          const seriesColor =
            AWN_CHART_SERIES_COLORS[index % AWN_CHART_SERIES_COLORS.length];
          const label =
            language === 'ar' ? bar.periodLabelAr : bar.periodLabelEn;
          const isSelected = bar.id === selectedBarId;
          return (
            <button
              key={bar.id}
              type="button"
              onClick={() => setSelectedBarId(bar.id)}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
                isSelected
                  ? 'border-[#37848C] bg-[#F8FAFC] text-[#1F2937] font-semibold'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F1F5F9]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: seriesColor }}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Bar Chart Container */}
      <div className="pt-2 pb-1">
        <div className="grid grid-cols-[48px_1fr] gap-3 items-end">
          {/* Y-Axis Scale Labels (1000, 750, 500, 250) */}
          <div
            dir="ltr"
            className="h-44 flex flex-col justify-between text-end pr-1 font-mono text-[11px] text-[#64748B] tabular-nums"
          >
            {yAxisTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          {/* Bars Grid */}
          <div className="h-44 border-b border-s border-[#E5E7EB] bg-[#F8FAFC]/50 px-3 sm:px-6 flex items-end justify-around gap-3 sm:gap-6">
            {data.map((bar, index) => {
              const heightPercent = Math.round(
                (bar.amountSar / maxAmount) * 100
              );
              const isSelected = bar.id === selectedBarId;
              const label =
                language === 'ar' ? bar.periodLabelAr : bar.periodLabelEn;
              const seriesColor =
                AWN_CHART_SERIES_COLORS[index % AWN_CHART_SERIES_COLORS.length];

              return (
                <button
                  key={bar.id}
                  type="button"
                  onClick={() => setSelectedBarId(bar.id)}
                  className="group flex-1 h-full flex flex-col justify-end items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  aria-label={`${label}: SAR ${bar.amountSar}`}
                >
                  <span
                    dir="ltr"
                    className={`mb-1.5 font-mono text-[11px] font-semibold tabular-nums ${
                      isSelected ? 'text-[#1F2937]' : 'text-[#64748B]'
                    }`}
                  >
                    {bar.amountSar}
                  </span>
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: seriesColor,
                      opacity: isSelected ? 1 : 0.82,
                    }}
                    className={`w-full max-w-[48px] rounded-t-md transition-all group-hover:opacity-100 ${
                      isSelected ? 'ring-2 ring-[#1F2937]/20' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-[48px_1fr] gap-3 mt-2">
          <div />
          <div className="px-3 sm:px-6 flex items-center justify-around gap-3 sm:gap-6">
            {data.map((bar) => {
              const label =
                language === 'ar' ? bar.periodLabelAr : bar.periodLabelEn;
              return (
                <span
                  key={bar.id}
                  className="flex-1 text-center text-[11px] font-medium text-[#1F2937] truncate"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
