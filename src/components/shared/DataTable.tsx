import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef as TanStackColumnDef,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  Updater,
  createColumnHelper,
  createPaginatedRowModel,
  functionalUpdate,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { Inbox, LayoutGrid, Loader2, Table as TableIcon } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Pagination } from './Pagination';
import { Search } from './Search';

export interface DataTableColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  align?: 'start' | 'center' | 'end';
  mobileLabel?: string;
}

export const dataTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableFeatures = typeof dataTableFeatures;

/**
 * Strongly typed generic ColumnDef for `DataTable<TData>` backed by
 * the installed `@tanstack/react-table` v9 feature registry.
 */
export type ColumnDef<
  TData extends RowData,
  TValue = any
> = TanStackColumnDef<DataTableFeatures, TData, TValue>;

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

export interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  count: number;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  onExport?: () => void;
  exportLabel?: string;
  /**
   * Controls whether pagination is performed externally (`true` for pre-sliced
   * server pages) or by TanStack Table's `createPaginatedRowModel()` (`false`).
   * Defaults to `false` so client-side datasets are sliced accurately while
   * still respecting `rowCount: count` for total page calculation.
   */
  manualPagination?: boolean;
  /**
   * Optional row-selection configuration. Disabled by default unless explicitly enabled.
   */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (originalRow: TData, index: number) => string;
  /**
   * Optional row click handler for tables whose rows open a detail modal/drawer.
   * Rows are NOT clickable unless `onRowClick` is provided.
   */
  onRowClick?: (row: TData) => void;
  getRowAriaLabel?: (row: TData) => string;
  /**
   * Customizable loading & empty state messages and presentation.
   */
  loadingMessage?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  onResetSearch?: () => void;
  minTableWidthClassName?: string;
  hidePagination?: boolean;
  /**
   * Initial mobile presentation mode on narrow viewports (< 768px).
   * Users on mobile screens can also toggle between 'table' and 'cards' when rows exist.
   */
  defaultMobileView?: 'table' | 'cards';
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  count,
  loading = false,
  title,
  subtitle,
  searchPlaceholder,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  searchValue,
  onSearchChange,
  onAddNew,
  addNewLabel,
  onExport,
  exportLabel,
  manualPagination = false,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  getRowAriaLabel,
  loadingMessage,
  emptyMessage,
  emptyDescription,
  emptyIcon,
  onResetSearch,
  minTableWidthClassName = 'min-w-[680px]',
  hidePagination = false,
  defaultMobileView = 'table',
}: DataTableProps<TData>): React.ReactElement {
  const { t } = usePortal();
  const [mobileViewMode, setMobileViewMode] = useState<'table' | 'cards'>(
    defaultMobileView
  );

  const safeCount = Math.max(0, count);
  const safePageSize = Math.max(1, pageSize);
  const safePageCount =
    safeCount === 0 ? 0 : Math.ceil(safeCount / safePageSize);

  const clampedPageIndex =
    safePageCount === 0
      ? 0
      : Math.min(Math.max(0, pageIndex), safePageCount - 1);

  // Clamp/reset pageIndex if data or filter changes make current pageIndex out of range
  useEffect(() => {
    if (safePageCount === 0 && pageIndex !== 0) {
      onPageChange(0);
    } else if (safePageCount > 0 && pageIndex >= safePageCount) {
      onPageChange(Math.max(0, safePageCount - 1));
    } else if (pageIndex < 0) {
      onPageChange(0);
    }
  }, [pageIndex, safePageCount, onPageChange]);

  // Automatically prepend selection column when `enableRowSelection` is true
  // and the consumer has not provided a custom `id: 'select'` column.
  const effectiveColumns = useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableRowSelection) return columns;
    const hasExplicitSelectColumn = columns.some(
      (col) => col.id === 'select'
    );
    if (hasExplicitSelectColumn) return columns;

    const selectColumn: ColumnDef<TData, any> = {
      id: 'select',
      meta: {
        headerClassName: 'w-10 px-3 py-3 text-center whitespace-nowrap',
        cellClassName: 'w-10 px-3 py-3.5 text-center whitespace-nowrap',
        mobileLabel: t('Select', 'تحديد'),
      },
      header: ({ table: tbl }) => (
        <input
          type="checkbox"
          checked={tbl.getIsAllPageRowsSelected()}
          ref={(el) => {
            if (el) {
              el.indeterminate =
                tbl.getIsSomePageRowsSelected() &&
                !tbl.getIsAllPageRowsSelected();
            }
          }}
          onChange={tbl.getToggleAllPageRowsSelectedHandler()}
          aria-label={t('Select all rows on page', 'تحديد جميع صفوف الصفحة')}
          className="w-4 h-4 rounded border-[#E5E7EB] text-[#37848C] focus:ring-[#37848C] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          aria-label={t('Select row', 'تحديد الصف')}
          className="w-4 h-4 rounded border-[#E5E7EB] text-[#37848C] focus:ring-[#37848C] cursor-pointer"
        />
      ),
    };

    return [selectColumn, ...columns];
  }, [columns, enableRowSelection, t]);

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: clampedPageIndex,
      pageSize: safePageSize,
    }),
    [clampedPageIndex, safePageSize]
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updater: Updater<PaginationState>
  ) => {
    const next = functionalUpdate(updater, paginationState);
    if (next.pageSize !== paginationState.pageSize && onPageSizeChange) {
      onPageSizeChange(next.pageSize);
      onPageChange(0);
      return;
    }
    if (next.pageIndex !== paginationState.pageIndex) {
      onPageChange(next.pageIndex);
    }
  };

  const resolvedRowSelection = useMemo<RowSelectionState>(
    () => rowSelection ?? {},
    [rowSelection]
  );

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: effectiveColumns,
    getRowId,
    manualPagination,
    rowCount: safeCount,
    pageCount: safePageCount,
    autoResetPageIndex: false,
    enableRowSelection,
    state: {
      pagination: paginationState,
      rowSelection: resolvedRowSelection,
    },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const leafColumnCount = Math.max(
    table.getAllLeafColumns().length,
    effectiveColumns.length,
    1
  );

  const resolvedLoadingText =
    loadingMessage || t('Loading data...', 'جاري تحميل البيانات...');
  const resolvedEmptyText =
    emptyMessage || t('No records found.', 'لم يتم العثور على سجلات.');

  const isRowInteractive = typeof onRowClick === 'function';

  // Mobile view switcher (visible on < md screens when rows are present)
  const mobileViewToggle =
    !loading && rows.length > 0 ? (
      <div
        role="group"
        aria-label={t('Mobile layout view', 'طريقة العرض على الجوال')}
        className="inline-flex md:hidden items-center rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-0.5 shrink-0"
      >
        <button
          type="button"
          onClick={() => setMobileViewMode('table')}
          aria-pressed={mobileViewMode === 'table'}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded text-xs font-semibold transition-colors ${
            mobileViewMode === 'table'
              ? 'bg-white text-[#1A7373] shadow-2xs'
              : 'text-[#64748B] hover:text-[#1F2937]'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{t('Table', 'جدول')}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewMode('cards')}
          aria-pressed={mobileViewMode === 'cards'}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded text-xs font-semibold transition-colors ${
            mobileViewMode === 'cards'
              ? 'bg-white text-[#1A7373] shadow-2xs'
              : 'text-[#64748B] hover:text-[#1F2937]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
          <span>{t('Cards', 'بطاقات')}</span>
        </button>
      </div>
    ) : undefined;

  const renderEmptyState = () => (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-2 text-center">
      {emptyIcon ? (
        emptyIcon
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#64748B] flex items-center justify-center">
          <Inbox className="w-5 h-5 text-[#37848C]" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#1F2937] break-words">
        {resolvedEmptyText}
      </p>
      {emptyDescription && (
        <p className="text-xs text-[#64748B] break-words leading-relaxed">
          {emptyDescription}
        </p>
      )}
      {onResetSearch &&
      typeof searchValue === 'string' &&
      searchValue.trim().length > 0 ? (
        <div className="pt-1">
          <button
            type="button"
            onClick={onResetSearch}
            className="h-9 px-3.5 rounded-md border border-[#E5E7EB] bg-white text-xs font-semibold text-[#1A7373] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            {t('Reset Search', 'إعادة ضبط البحث')}
          </button>
        </div>
      ) : (
        clampedPageIndex > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onPageChange(0)}
              className="h-9 px-3.5 rounded-md border border-[#E5E7EB] bg-white text-xs font-semibold text-[#1A7373] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Return to Page 1', 'العودة إلى الصفحة 1')}
            </button>
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-4">
      <Search
        title={title}
        subtitle={subtitle}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        pageSize={safePageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
        onAddNew={onAddNew}
        addNewLabel={addNewLabel}
        onExport={onExport}
        exportLabel={exportLabel}
        extraControls={mobileViewToggle}
      />

      {/* Mobile Stacked Card Presentation (when toggled on < md screens) */}
      {!loading && rows.length > 0 && mobileViewMode === 'cards' && (
        <div className="md:hidden space-y-3" role="list">
          {rows.map((row) => {
            const original = row.original;
            const rowAriaLabel =
              isRowInteractive && getRowAriaLabel
                ? getRowAriaLabel(original)
                : undefined;

            return (
              <div
                key={`card-${row.id}`}
                role={isRowInteractive ? 'button' : 'listitem'}
                tabIndex={isRowInteractive ? 0 : undefined}
                aria-label={rowAriaLabel}
                onClick={
                  isRowInteractive ? () => onRowClick(original) : undefined
                }
                onKeyDown={
                  isRowInteractive
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onRowClick(original);
                        }
                      }
                    : undefined
                }
                className={`rounded-lg border border-[#E5E7EB] bg-white p-3.5 space-y-2.5 shadow-2xs ${
                  isRowInteractive
                    ? 'cursor-pointer hover:bg-[#F1F5F9]/70 focus-visible:outline-2 focus-visible:outline-[#37848C] transition-colors'
                    : ''
                }`}
              >
                {row.getAllCells().map((cell) => {
                  const colDef = cell.column.columnDef;
                  const meta = colDef.meta;
                  const label =
                    meta?.mobileLabel ??
                    (typeof colDef.header === 'string'
                      ? colDef.header
                      : cell.column.id);

                  return (
                    <div
                      key={cell.id}
                      className="flex flex-col min-[420px]:flex-row min-[420px]:items-start justify-between gap-1 min-[420px]:gap-3 border-b border-[#F1F5F9] last:border-b-0 pb-2 last:pb-0 min-w-0"
                    >
                      <span className="text-[11px] font-semibold text-[#64748B] shrink-0">
                        {label}
                      </span>
                      <div
                        dir={meta?.dir}
                        className="text-xs text-[#1F2937] min-w-0 break-words"
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Contained Horizontal-Scroll Data Table */}
      <div
        className={`w-full min-w-0 max-w-full rounded-lg border border-[#E5E7EB] bg-white overflow-x-auto overscroll-x-contain ${
          !loading && rows.length > 0 && mobileViewMode === 'cards'
            ? 'hidden md:block'
            : 'block'
        }`}
      >
        <table
          className={`w-full text-start border-collapse ${minTableWidthClassName}`}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[#E5E7EB] bg-[#F8FAFC]"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const alignClass =
                    meta?.align === 'end'
                      ? 'text-end'
                      : meta?.align === 'center'
                      ? 'text-center'
                      : 'text-start';
                  const headerClassName =
                    meta?.headerClassName ||
                    `px-3.5 sm:px-4 py-3 ${alignClass} text-xs font-semibold text-[#64748B] whitespace-nowrap`;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      className={headerClassName}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[#E5E7EB] bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={leafColumnCount}
                  className="px-4 sm:px-6 py-12 text-center"
                >
                  <div
                    role="status"
                    aria-live="polite"
                    className="inline-flex flex-col items-center justify-center gap-2.5 text-[#64748B]"
                  >
                    <Loader2 className="w-5 h-5 text-[#37848C] animate-spin" />
                    <p className="text-xs sm:text-sm font-medium text-[#1F2937]">
                      {resolvedLoadingText}
                    </p>
                  </div>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => {
                const original = row.original;
                const rowAriaLabel =
                  isRowInteractive && getRowAriaLabel
                    ? getRowAriaLabel(original)
                    : undefined;

                return (
                  <tr
                    key={row.id}
                    tabIndex={isRowInteractive ? 0 : undefined}
                    role={isRowInteractive ? 'button' : undefined}
                    aria-label={rowAriaLabel}
                    onClick={
                      isRowInteractive ? () => onRowClick(original) : undefined
                    }
                    onKeyDown={
                      isRowInteractive
                        ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onRowClick(original);
                            }
                          }
                        : undefined
                    }
                    className={
                      isRowInteractive
                        ? 'cursor-pointer hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37848C] transition-colors align-top'
                        : 'hover:bg-[#F1F5F9]/70 transition-colors align-top'
                    }
                  >
                    {row.getAllCells().map((cell) => {
                      const meta = cell.column.columnDef.meta;
                      const alignClass =
                        meta?.align === 'end'
                          ? 'text-end'
                          : meta?.align === 'center'
                          ? 'text-center'
                          : 'text-start';
                      const cellClassName =
                        meta?.cellClassName ||
                        `px-3.5 sm:px-4 py-3.5 ${alignClass} text-xs sm:text-sm text-[#1F2937] break-words`;

                      return (
                        <td
                          key={cell.id}
                          dir={meta?.dir}
                          className={cellClassName}
                        >
                          <table.FlexRender cell={cell} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={leafColumnCount}
                  className="px-4 sm:px-6 py-12 text-center"
                >
                  {renderEmptyState()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!hidePagination && (
        <Pagination
          count={safeCount}
          pageIndex={clampedPageIndex}
          pageSize={safePageSize}
          pageCount={table.getPageCount()}
          displayedRowCount={loading ? 0 : rows.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(nextPageIndex) => table.setPageIndex(nextPageIndex)}
          onPageSizeChange={
            onPageSizeChange
              ? (nextPageSize) => table.setPageSize(nextPageSize)
              : undefined
          }
        />
      )}
    </div>
  );
}
