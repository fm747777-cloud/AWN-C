import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export interface PaginationProps {
  count: number;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  displayedRowCount?: number;
  pageSizeOptions?: readonly number[];
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  count,
  pageIndex,
  pageSize,
  pageCount,
  displayedRowCount,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
}) => {
  const { isRtl, t } = usePortal();

  const safeCount = Math.max(0, count);
  const safePageSize = Math.max(1, pageSize);
  const resolvedPageCount =
    safeCount === 0
      ? 0
      : Math.max(1, pageCount || Math.ceil(safeCount / safePageSize));

  const clampedPageIndex =
    resolvedPageCount === 0
      ? 0
      : Math.min(Math.max(0, pageIndex), resolvedPageCount - 1);

  const canPreviousPage = resolvedPageCount > 0 && clampedPageIndex > 0;
  const canNextPage =
    resolvedPageCount > 0 && clampedPageIndex < resolvedPageCount - 1;

  const displayPageNumber = resolvedPageCount === 0 ? 1 : clampedPageIndex + 1;

  const currentShownCount =
    typeof displayedRowCount === 'number'
      ? displayedRowCount
      : safeCount === 0
      ? 0
      : Math.max(
          0,
          Math.min(safePageSize, safeCount - clampedPageIndex * safePageSize)
        );

  // Build compact visible page numbers (up to 5 pages centered around active page)
  const visiblePageNumbers = useMemo<number[]>(() => {
    if (resolvedPageCount <= 1) {
      return [1];
    }
    const maxButtons = 5;
    let startPage = Math.max(
      1,
      displayPageNumber - Math.floor(maxButtons / 2)
    );
    let endPage = startPage + maxButtons - 1;
    if (endPage > resolvedPageCount) {
      endPage = resolvedPageCount;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    const pages: number[] = [];
    for (let p = startPage; p <= endPage; p += 1) {
      pages.push(p);
    }
    return pages;
  }, [resolvedPageCount, displayPageNumber]);

  return (
    <div className="w-full min-w-0 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E5E7EB] text-xs text-[#64748B]">
      <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-start gap-x-4 gap-y-2">
        {typeof onPageSizeChange === 'function' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#64748B] whitespace-nowrap">
              {t('Rows per page:', 'عدد الصفوف في الصفحة:')}
            </label>
            <select
              dir="ltr"
              value={safePageSize}
              onChange={(e) => {
                const nextSize = Number(e.target.value);
                onPageSizeChange(nextSize);
              }}
              aria-label={t('Rows per page', 'عدد الصفوف في الصفحة')}
              className="h-10 sm:h-8 px-2.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] font-mono text-xs font-semibold text-[#1F2937] tabular-nums focus:bg-white focus:outline-none focus:border-[#37848C]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-xs text-[#64748B] whitespace-nowrap">
          {t('Showing', 'عرض')}{' '}
          <span
            dir="ltr"
            className="font-mono font-semibold text-[#1F2937] tabular-nums"
          >
            {currentShownCount}
          </span>{' '}
          {t('of', 'من أصل')}{' '}
          <span
            dir="ltr"
            className="font-mono font-semibold text-[#1F2937] tabular-nums"
          >
            {safeCount}
          </span>
        </p>
      </div>

      <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={!canPreviousPage}
          onClick={() => {
            if (canPreviousPage) {
              onPageChange(clampedPageIndex - 1);
            }
          }}
          aria-label={t('Previous page', 'الصفحة السابقة')}
          className="inline-flex items-center justify-center gap-1 h-10 sm:h-8 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
        >
          {isRtl ? (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{t('Previous', 'السابق')}</span>
        </button>

        <div className="flex items-center gap-1">
          {visiblePageNumbers.map((pageNum) => {
            const isCurrent = displayPageNumber === pageNum;
            const isInteractive = resolvedPageCount > 1;

            if (!isInteractive) {
              return (
                <span
                  key={pageNum}
                  dir="ltr"
                  aria-current="page"
                  className="inline-flex items-center justify-center min-w-[40px] sm:min-w-[32px] h-10 sm:h-8 px-2.5 rounded-md border border-[#37848C]/40 bg-[#37848C]/10 text-[#1A7373] text-xs font-mono font-bold tabular-nums"
                >
                  {pageNum}
                </span>
              );
            }

            return (
              <button
                key={pageNum}
                type="button"
                dir="ltr"
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={t(`Page ${pageNum}`, `الصفحة ${pageNum}`)}
                onClick={() => onPageChange(pageNum - 1)}
                className={`inline-flex items-center justify-center min-w-[40px] sm:min-w-[32px] h-10 sm:h-8 px-2.5 rounded-md border font-mono text-xs font-bold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                  isCurrent
                    ? 'border-[#37848C] bg-[#37848C] text-white'
                    : 'border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F1F5F9]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canNextPage}
          onClick={() => {
            if (canNextPage) {
              onPageChange(clampedPageIndex + 1);
            }
          }}
          aria-label={t('Next page', 'الصفحة التالية')}
          className="inline-flex items-center justify-center gap-1 h-10 sm:h-8 px-3 rounded-md border border-[#E5E7EB] bg-white text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
        >
          <span>{t('Next', 'التالي')}</span>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
};
