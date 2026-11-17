import React, { useEffect, useMemo, useState } from 'react';
import { FileSignature, FileText, Receipt } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  AccountContractRecord,
  AccountInvoiceRecord,
  AccountQuotationRecord,
  AccountsPageData,
  AccountsTabId,
  SelectedAccountRecord,
} from '../types/portal';
import { AccountRecordDetailsModal } from '../components/accounts/AccountRecordDetailsModal';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../theme/portalDesignSystem';
import { ColumnDef, DataTable } from '../components/shared/DataTable';

interface TabConfig {
  id: AccountsTabId;
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: SemanticKpiCategory;
  subtitle: string;
}

export const AccountsPage: React.FC = () => {
  const { isRtl, selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<AccountsPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Default to Quotations tab
  const [activeTab, setActiveTab] = useState<AccountsTabId>('quotations');

  // Independent search & zero-based pagination state for Quotations
  const [quotationsQuery, setQuotationsQuery] = useState<string>('');
  const [quotationsPageIndex, setQuotationsPageIndex] = useState<number>(0);
  const [quotationsPageSize, setQuotationsPageSize] = useState<number>(10);

  // Independent search & zero-based pagination state for Contracts
  const [contractsQuery, setContractsQuery] = useState<string>('');
  const [contractsPageIndex, setContractsPageIndex] = useState<number>(0);
  const [contractsPageSize, setContractsPageSize] = useState<number>(10);

  // Independent search & zero-based pagination state for Invoices
  const [invoicesQuery, setInvoicesQuery] = useState<string>('');
  const [invoicesPageIndex, setInvoicesPageIndex] = useState<number>(0);
  const [invoicesPageSize, setInvoicesPageSize] = useState<number>(10);

  // Selected record for details modal
  const [selectedRecordForModal, setSelectedRecordForModal] =
    useState<SelectedAccountRecord | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    portalService.getAccountsData().then((data) => {
      if (active) {
        setPageData(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 1. Filtered Quotations
  const filteredQuotations = useMemo<AccountQuotationRecord[]>(() => {
    if (!pageData) return [];
    const query = quotationsQuery.trim().toLowerCase();
    if (!query) return pageData.quotations;

    return pageData.quotations.filter((item) => {
      return (
        item.quotationCode.toLowerCase().includes(query) ||
        item.amount.toLowerCase().includes(query) ||
        item.subscriptions.toLowerCase().includes(query) ||
        item.quotationDate.toLowerCase().includes(query)
      );
    });
  }, [pageData, quotationsQuery]);

  // 2. Filtered Contracts
  const filteredContracts = useMemo<AccountContractRecord[]>(() => {
    if (!pageData) return [];
    const query = contractsQuery.trim().toLowerCase();
    if (!query) return pageData.contracts;

    return pageData.contracts.filter((item) => {
      return (
        item.contractCode.toLowerCase().includes(query) ||
        item.emailAddress.toLowerCase().includes(query) ||
        item.contactNumber.toLowerCase().includes(query) ||
        item.startDate.toLowerCase().includes(query) ||
        item.endDate.toLowerCase().includes(query) ||
        item.contractTerm.toLowerCase().includes(query)
      );
    });
  }, [pageData, contractsQuery]);

  // 3. Filtered Invoices
  const filteredInvoices = useMemo<AccountInvoiceRecord[]>(() => {
    if (!pageData) return [];
    const query = invoicesQuery.trim().toLowerCase();
    if (!query) return pageData.invoices;

    return pageData.invoices.filter((item) => {
      return (
        item.invoiceCode.toLowerCase().includes(query) ||
        item.amount.toLowerCase().includes(query) ||
        item.subscriptions.toLowerCase().includes(query) ||
        item.invoiceDate.toLowerCase().includes(query) ||
        item.invoiceCreationType.toLowerCase().includes(query) ||
        item.invoiceStatus.toLowerCase().includes(query)
      );
    });
  }, [pageData, invoicesQuery]);

  // Strongly typed columns for Quotations (AccountQuotationRecord)
  const quotationsColumns = useMemo<ColumnDef<AccountQuotationRecord, any>[]>(
    () => [
      {
        id: 'quotationCode',
        accessorKey: 'quotationCode',
        header: t('Quotation Code', 'رمز عرض السعر'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: t('Amount', 'المبلغ'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'subscriptions',
        accessorKey: 'subscriptions',
        header: t('Subscriptions', 'الاشتراكات'),
        meta: {
          dir: 'auto',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937]',
        },
      },
      {
        id: 'quotationDate',
        accessorKey: 'quotationDate',
        header: t('Quotation Date', 'تاريخ عرض السعر'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
    ],
    [t]
  );

  // Strongly typed columns for Contracts (AccountContractRecord)
  const contractsColumns = useMemo<ColumnDef<AccountContractRecord, any>[]>(
    () => [
      {
        id: 'contractCode',
        accessorKey: 'contractCode',
        header: t('Contract Code', 'رمز العقد'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'emailAddress',
        accessorKey: 'emailAddress',
        header: t('Email Address', 'البريد الإلكتروني'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'contactNumber',
        accessorKey: 'contactNumber',
        header: t('Contact Number', 'رقم التواصل'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'startDate',
        accessorKey: 'startDate',
        header: t('Start Date', 'تاريخ البدء'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'endDate',
        accessorKey: 'endDate',
        header: t('End Date', 'تاريخ الانتهاء'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'contractTerm',
        accessorKey: 'contractTerm',
        header: t('Contract Term', 'مدة العقد'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937] whitespace-nowrap',
        },
      },
    ],
    [t]
  );

  // Strongly typed columns for Invoices (AccountInvoiceRecord)
  const invoicesColumns = useMemo<ColumnDef<AccountInvoiceRecord, any>[]>(
    () => [
      {
        id: 'invoiceCode',
        accessorKey: 'invoiceCode',
        header: t('Invoice Code', 'رمز الفاتورة'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: t('Amount', 'المبلغ'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1F2937] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'subscriptions',
        accessorKey: 'subscriptions',
        header: t('Subscriptions', 'الاشتراكات'),
        meta: {
          dir: 'auto',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937]',
        },
      },
      {
        id: 'invoiceDate',
        accessorKey: 'invoiceDate',
        header: t('Invoice Date', 'تاريخ الفاتورة'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'invoiceCreationType',
        accessorKey: 'invoiceCreationType',
        header: t('Invoice Creation Type', 'نوع إنشاء الفاتورة'),
        meta: {
          cellClassName: 'px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
      {
        id: 'invoiceStatus',
        accessorKey: 'invoiceStatus',
        header: t('Invoice Status', 'حالة الفاتورة'),
        meta: {
          cellClassName: 'px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
    ],
    [t]
  );

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Accounts...', 'جاري تحميل الحسابات...')}
      </div>
    );
  }

  const tabs: TabConfig[] = [
    {
      id: 'quotations',
      label: t('Quotations', 'عروض الأسعار'),
      count: pageData.quotationsSummaryCount,
      icon: <FileText className="w-4 h-4 shrink-0" />,
      tone: 'blue',
      subtitle: t('Issued commercial quotations', 'عروض الأسعار التجارية الصادرة'),
    },
    {
      id: 'contracts',
      label: t('Contracts', 'العقود'),
      count: pageData.contractsSummaryCount,
      icon: <FileSignature className="w-4 h-4 shrink-0" />,
      tone: 'green',
      subtitle: t('Active service agreements', 'اتفاقيات وعقود الخدمة المعتمدة'),
    },
    {
      id: 'invoices',
      label: t('Invoices', 'الفواتير'),
      count: pageData.invoicesSummaryCount,
      icon: <Receipt className="w-4 h-4 shrink-0" />,
      tone: 'slate',
      subtitle: t('Billing & invoice statements', 'كشوف الفوترة والمطالبات المالية'),
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
      {/* 1. Page Header */}
      <section
        aria-labelledby="accounts-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-wider text-[#1A7373]">
              {t(pageData.eyebrowEn, 'أعمالي')}
            </span>
            <span aria-hidden="true" className="text-gray-300">
              ·
            </span>
            <span className="text-[#64748B] font-medium">
              {selectedCompany.name}
            </span>
          </div>

          <h1
            id="accounts-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, pageData.pageTitleAr)}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageSubtitleEn,
              'إدارة جميع عروض الأسعار والعقود والفواتير الخاصة بالمنشأة.'
            )}
          </p>
        </div>
      </section>

      {/* Semantic KPI Summary Strip */}
      <section
        aria-label={t('Accounts Summary Metrics', 'ملخص مؤشرات الحسابات')}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {tabs.map((tab) => {
          const tone = SEMANTIC_KPI_TONES[tab.tone];
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={`summary-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`text-start rounded-lg border border-[#E5E7EB] ${tone.topBorderClass} bg-white p-4 transition-colors hover:bg-[#F1F5F9]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                isSelected ? 'ring-1 ring-[#37848C]/30 bg-[#F8FAFC]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#64748B] block">
                    {tab.label}
                  </span>
                  <span
                    dir="ltr"
                    className={`text-2xl font-bold font-mono tabular-nums block ${tone.valueTextClass}`}
                  >
                    {tab.count}
                  </span>
                </div>
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone.iconContainerClass} ${tone.iconColorClass}`}
                >
                  {tab.icon}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#64748B]">{tab.subtitle}</p>
            </button>
          );
        })}
      </section>

      {/* 2. Three Independent Page-Level Tabs & Active Tab Content */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
        {/* Accessible 3-Tab Bar: Quotations | Contracts | Invoices */}
        <div
          role="tablist"
          aria-label={t('Accounts Navigation Tabs', 'علامات تبويب الحسابات')}
          className="px-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`accounts-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`accounts-tabpanel-${tab.id}`}
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

        {/* Active Tab Panel */}
        <div className="p-3.5 sm:p-6 min-w-0">
          {/* =========================================================
              TAB 1: QUOTATIONS
             ========================================================= */}
          {activeTab === 'quotations' && (
            <div
              id="accounts-tabpanel-quotations"
              role="tabpanel"
              aria-labelledby="accounts-tab-quotations"
            >
              <DataTable<AccountQuotationRecord>
                data={filteredQuotations}
                columns={quotationsColumns}
                count={filteredQuotations.length}
                loading={loading}
                title={`${t('Quotations', 'عروض الأسعار')} (${
                  pageData.quotationsSummaryCount
                })`}
                subtitle={t(
                  'Select a quotation row to inspect its details.',
                  'اختر أي صف عرض سعر لعرض تفاصيله.'
                )}
                searchPlaceholder={t(
                  pageData.quotationsSearchPlaceholder,
                  'البحث في عروض الأسعار...'
                )}
                searchValue={quotationsQuery}
                onSearchChange={(val) => {
                  setQuotationsQuery(val);
                  setQuotationsPageIndex(0);
                }}
                pageIndex={quotationsPageIndex}
                pageSize={quotationsPageSize}
                pageSizeOptions={pageData.pageSizeOptions}
                onPageChange={setQuotationsPageIndex}
                onPageSizeChange={(nextSize) => {
                  setQuotationsPageSize(nextSize);
                  setQuotationsPageIndex(0);
                }}
                getRowId={(row) => row.id}
                onRowClick={(quo) =>
                  setSelectedRecordForModal({
                    type: 'quotation',
                    data: quo,
                  })
                }
                getRowAriaLabel={(quo) =>
                  t(
                    `View quotation details for ${quo.quotationCode}`,
                    `عرض تفاصيل عرض السعر ${quo.quotationCode}`
                  )
                }
                emptyMessage={t(
                  'No matching quotations found',
                  'لم يتم العثور على عروض أسعار مطابقة'
                )}
                emptyDescription={
                  quotationsQuery.trim().length > 0
                    ? t(
                        `No quotation records matched "${quotationsQuery}".`,
                        `لا توجد سجلات عروض أسعار تطابق "${quotationsQuery}".`
                      )
                    : undefined
                }
                onResetSearch={() => {
                  setQuotationsQuery('');
                  setQuotationsPageIndex(0);
                }}
                minTableWidthClassName="min-w-[640px]"
              />
            </div>
          )}

          {/* =========================================================
              TAB 2: CONTRACTS
             ========================================================= */}
          {activeTab === 'contracts' && (
            <div
              id="accounts-tabpanel-contracts"
              role="tabpanel"
              aria-labelledby="accounts-tab-contracts"
            >
              <DataTable<AccountContractRecord>
                data={filteredContracts}
                columns={contractsColumns}
                count={filteredContracts.length}
                loading={loading}
                title={`${t('Contracts', 'العقود')} (${
                  pageData.contractsSummaryCount
                })`}
                subtitle={t(
                  'Select a contract row to inspect its details.',
                  'اختر أي صف عقد لعرض تفاصيله.'
                )}
                searchPlaceholder={t(
                  pageData.contractsSearchPlaceholder,
                  'البحث في العقود...'
                )}
                searchValue={contractsQuery}
                onSearchChange={(val) => {
                  setContractsQuery(val);
                  setContractsPageIndex(0);
                }}
                pageIndex={contractsPageIndex}
                pageSize={contractsPageSize}
                pageSizeOptions={pageData.pageSizeOptions}
                onPageChange={setContractsPageIndex}
                onPageSizeChange={(nextSize) => {
                  setContractsPageSize(nextSize);
                  setContractsPageIndex(0);
                }}
                getRowId={(row) => row.id}
                onRowClick={(cont) =>
                  setSelectedRecordForModal({
                    type: 'contract',
                    data: cont,
                  })
                }
                getRowAriaLabel={(cont) =>
                  t(
                    `View contract details for ${cont.contractCode}`,
                    `عرض تفاصيل العقد ${cont.contractCode}`
                  )
                }
                emptyMessage={t(
                  'No matching contracts found',
                  'لم يتم العثور على عقود مطابقة'
                )}
                emptyDescription={
                  contractsQuery.trim().length > 0
                    ? t(
                        `No contract records matched "${contractsQuery}".`,
                        `لا توجد سجلات عقود تطابق "${contractsQuery}".`
                      )
                    : undefined
                }
                onResetSearch={() => {
                  setContractsQuery('');
                  setContractsPageIndex(0);
                }}
                minTableWidthClassName="min-w-[760px]"
              />
            </div>
          )}

          {/* =========================================================
              TAB 3: INVOICES
             ========================================================= */}
          {activeTab === 'invoices' && (
            <div
              id="accounts-tabpanel-invoices"
              role="tabpanel"
              aria-labelledby="accounts-tab-invoices"
            >
              <DataTable<AccountInvoiceRecord>
                data={filteredInvoices}
                columns={invoicesColumns}
                count={filteredInvoices.length}
                loading={loading}
                title={`${t('Invoices', 'الفواتير')} (${
                  pageData.invoicesSummaryCount
                })`}
                searchPlaceholder={t(
                  pageData.invoicesSearchPlaceholder,
                  'البحث في الفواتير...'
                )}
                searchValue={invoicesQuery}
                onSearchChange={(val) => {
                  setInvoicesQuery(val);
                  setInvoicesPageIndex(0);
                }}
                pageIndex={invoicesPageIndex}
                pageSize={invoicesPageSize}
                pageSizeOptions={pageData.pageSizeOptions}
                onPageChange={setInvoicesPageIndex}
                onPageSizeChange={(nextSize) => {
                  setInvoicesPageSize(nextSize);
                  setInvoicesPageIndex(0);
                }}
                getRowId={(row) => row.id}
                onRowClick={(inv) =>
                  setSelectedRecordForModal({
                    type: 'invoice',
                    data: inv,
                  })
                }
                getRowAriaLabel={(inv) =>
                  t(
                    `View invoice details for ${inv.invoiceCode}`,
                    `عرض تفاصيل الفاتورة ${inv.invoiceCode}`
                  )
                }
                emptyMessage={t(
                  pageData.invoicesEmptyStateText,
                  'لا توجد فواتير'
                )}
                emptyIcon={
                  <Receipt className="w-6 h-6 text-[#37848C] opacity-80" />
                }
                minTableWidthClassName="min-w-[740px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Read-Only Account Record Details Modal (Quotation, Contract, Invoice) */}
      <AccountRecordDetailsModal
        selectedRecord={selectedRecordForModal}
        onClose={() => setSelectedRecordForModal(null)}
      />
    </div>
  );
};
