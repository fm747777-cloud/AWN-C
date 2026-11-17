import React from 'react';
import { Download, Plus, Search as SearchIcon, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export interface SearchProps {
  title?: string;
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  onAddNew?: () => void;
  addNewLabel?: string;
  onExport?: () => void;
  exportLabel?: string;
  extraControls?: React.ReactNode;
}

export const Search: React.FC<SearchProps> = ({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  showPageSizeSelector = false,
  onAddNew,
  addNewLabel,
  onExport,
  exportLabel,
  extraControls,
}) => {
  const { t } = usePortal();

  const hasSearch = typeof onSearchChange === 'function';
  const hasPageSizeInToolbar =
    showPageSizeSelector &&
    typeof onPageSizeChange === 'function' &&
    typeof pageSize === 'number';
  const hasAddNew = typeof onAddNew === 'function';
  const hasExport = typeof onExport === 'function';
  const hasTitleBlock = Boolean(title || subtitle);
  const hasExtraControls = Boolean(extraControls);

  if (
    !hasTitleBlock &&
    !hasSearch &&
    !hasPageSizeInToolbar &&
    !hasAddNew &&
    !hasExport &&
    !hasExtraControls
  ) {
    return null;
  }

  const resolvedPlaceholder =
    searchPlaceholder || t('Search records...', 'البحث في السجلات...');
  const currentSearchValue = searchValue ?? '';

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <div className="w-full min-w-0 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {hasTitleBlock ? (
        <div className="space-y-0.5 min-w-0">
          {title && (
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937] break-words">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs text-[#64748B] break-words leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <div className="hidden lg:block" />
      )}

      <div className="w-full lg:w-auto min-w-0 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-end gap-2.5">
        {hasPageSizeInToolbar && (
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <label className="text-xs text-[#64748B] whitespace-nowrap">
              {t('Rows per page:', 'عدد الصفوف في الصفحة:')}
            </label>
            <select
              dir="ltr"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label={t('Rows per page', 'عدد الصفوف في الصفحة')}
              className="h-10 sm:h-9 px-2.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] font-mono text-xs font-semibold text-[#1F2937] tabular-nums focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasSearch && (
          <form
            onSubmit={handleFormSubmit}
            role="search"
            aria-label={
              title ? `${title} — ${resolvedPlaceholder}` : resolvedPlaceholder
            }
            className="w-full sm:w-auto min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 flex-1 sm:flex-initial"
          >
            <div className="relative min-w-0 flex-1 sm:w-60 md:w-72">
              <SearchIcon className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={currentSearchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={resolvedPlaceholder}
                aria-label={resolvedPlaceholder}
                className="w-full h-10 sm:h-9 ps-9 pe-9 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
              />
              {currentSearchValue.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={t('Clear search', 'مسح البحث')}
                  className="absolute end-1.5 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded text-[#64748B] hover:text-[#1F2937] focus-visible:outline-2 focus-visible:outline-[#37848C] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="h-10 sm:h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Search', 'بحث')}
            </button>
          </form>
        )}

        {(hasExport || hasAddNew || hasExtraControls) && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {hasExtraControls && extraControls}

            {hasExport && (
              <button
                type="button"
                onClick={onExport}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-10 sm:h-9 px-3.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F1F5F9] text-[#1F2937] text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <Download className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                <span>{exportLabel || t('Export', 'تصدير')}</span>
              </button>
            )}

            {hasAddNew && (
              <button
                type="button"
                onClick={onAddNew}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-10 sm:h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>{addNewLabel || t('+ Add New', '+ إضافة جديد')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
