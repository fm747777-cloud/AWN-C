import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  TrackRequestRecord,
  TrackRequestsPageData,
  TrackRequestsTabId,
} from '../types/portal';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../theme/portalDesignSystem';
import { ColumnDef, DataTable } from '../components/shared/DataTable';

interface TrackTabConfig {
  id: TrackRequestsTabId;
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: SemanticKpiCategory;
  subtitle: string;
}

export const TrackRequestsPage: React.FC = () => {
  const { isRtl, selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<TrackRequestsPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TrackRequestsTabId>('pending');

  // Controlled search & zero-based pagination states (reset when switching tabs)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    let active = true;
    setLoading(true);
    portalService.getTrackRequestsData().then((data) => {
      if (active) {
        setPageData(data);
        setPageSize(data.pageSize || 10);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleTabSelect = (nextTab: TrackRequestsTabId): void => {
    setActiveTab(nextTab);
    setSearchQuery('');
    setPageIndex(0);
  };

  const activeDataset = useMemo<TrackRequestRecord[]>(() => {
    if (!pageData) return [];
    if (activeTab === 'pending') return pageData.pendingRequests;
    if (activeTab === 'completed') return pageData.completedRequests;
    return pageData.rejectedRequests;
  }, [pageData, activeTab]);

  const filteredRequests = useMemo<TrackRequestRecord[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeDataset;

    return activeDataset.filter((record) =>
      record.code.toLowerCase().includes(query)
    );
  }, [activeDataset, searchQuery]);

  const columns = useMemo<ColumnDef<TrackRequestRecord, any>[]>(
    () => [
      {
        id: 'code',
        accessorKey: 'code',
        header: t('Code', 'رمز الطلب'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            title={row.original.code}
            className="text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
          >
            {row.original.code}
          </span>
        ),
      },
      {
        id: 'service',
        accessorKey: 'service',
        header: t('Service', 'الخدمة'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 min-w-[200px] max-w-[280px]',
        },
        cell: ({ row }) => (
          <span
            dir="auto"
            title={row.original.service}
            className="block text-xs sm:text-sm font-semibold text-[#1F2937] break-words leading-relaxed"
          >
            {row.original.service}
          </span>
        ),
      },
      {
        id: 'serviceType',
        accessorKey: 'serviceType',
        header: t('Service Type', 'نوع الخدمة'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 min-w-[180px] max-w-[260px]',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            title={row.original.serviceType}
            className="block text-xs sm:text-sm font-mono text-[#1F2937] break-all leading-relaxed"
          >
            {row.original.serviceType}
          </span>
        ),
      },
      {
        id: 'requestedDate',
        accessorKey: 'requestedDate',
        header: t('Requested Date', 'تاريخ الطلب'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            className="text-xs sm:text-sm font-mono font-medium text-[#1F2937] tabular-nums"
          >
            {row.original.requestedDate}
          </span>
        ),
      },
      {
        id: 'pendingWith',
        accessorKey: 'pendingWith',
        header: t('Pending With', 'معلّق لدى'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span className="text-xs sm:text-sm font-medium text-[#1F2937]">
            {row.original.pendingWith}
          </span>
        ),
      },
      {
        id: 'actionRequired',
        accessorKey: 'actionRequired',
        header: t('Action Required', 'الإجراء المطلوب'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 min-w-[260px] max-w-[400px]',
        },
        cell: ({ row }) => (
          <span
            dir="auto"
            title={row.original.actionRequired}
            className="block text-xs sm:text-sm text-[#1F2937] break-words leading-relaxed"
          >
            {row.original.actionRequired}
          </span>
        ),
      },
    ],
    [t]
  );

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Track Requests...', 'جاري تحميل متابعة الطلبات...')}
      </div>
    );
  }

  const tabs: TrackTabConfig[] = [
    {
      id: 'pending',
      label: t('Pending', 'قيد الانتظار'),
      count: pageData.pendingRequests.length,
      icon: <Clock className="w-4 h-4 shrink-0" />,
      tone: 'amber',
      subtitle: t('Awaiting processing or action', 'بانتظار المعالجة أو الإجراء'),
    },
    {
      id: 'completed',
      label: t('Completed', 'مكتملة'),
      count: pageData.completedRequests.length,
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
      tone: 'green',
      subtitle: t('Successfully finalized requests', 'الطلبات المنجزة بنجاح'),
    },
    {
      id: 'rejected',
      label: t('Rejected', 'مرفوضة'),
      count: pageData.rejectedRequests.length,
      icon: <XCircle className="w-4 h-4 shrink-0" />,
      tone: 'red',
      subtitle: t('Returned or declined requests', 'الطلبات المرفوضة أو المعادة'),
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
      handleTabSelect(tabs[nextIndex].id);
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      handleTabSelect(tabs[prevIndex].id);
    }
  };

  const sectionHeading: string =
    activeTab === 'pending'
      ? t(
          pageData.pendingSectionHeading,
          `الطلبات قيد الانتظار (${pageData.pendingRequests.length})`
        )
      : activeTab === 'completed'
      ? t(
          pageData.completedSectionHeading,
          `الطلبات المكتملة (${pageData.completedRequests.length})`
        )
      : t(
          pageData.rejectedSectionHeading,
          `الطلبات المرفوضة (${pageData.rejectedRequests.length})`
        );

  const emptyStateMessage: string =
    activeTab === 'pending'
      ? t(pageData.pendingEmptyStateText, 'لا توجد طلبات قيد الانتظار')
      : activeTab === 'completed'
      ? t(pageData.completedEmptyStateText, 'لا توجد طلبات مكتملة')
      : t(pageData.rejectedEmptyStateText, 'لا توجد طلبات مرفوضة');

  const searchPlaceholderText = t(
    pageData.searchPlaceholder,
    'البحث برقم الطلب...'
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <section
        aria-labelledby="track-requests-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-wider text-[#1A7373]">
              {t(pageData.eyebrowEn, 'متابعة الطلبات')}
            </span>
            <span aria-hidden="true" className="text-gray-300">
              ·
            </span>
            <span className="text-[#64748B] font-medium">
              {selectedCompany.name}
            </span>
          </div>

          <h1
            id="track-requests-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, 'متابعة الطلبات')}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'تابع جميع طلباتك في مكان واحد — سواء كانت قيد الانتظار أو قيد التنفيذ أو مكتملة. اطلع بسهولة على مراحل كل طلب وحالته الحالية.'
            )}
          </p>
        </div>
      </section>

      {/* Semantic Status Summary Cards */}
      <section
        aria-label={t('Request Status Summary', 'ملخص حالات الطلبات')}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {tabs.map((tab) => {
          const toneConfig = SEMANTIC_KPI_TONES[tab.tone];
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={`summary-${tab.id}`}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`text-start rounded-lg border border-[#E5E7EB] ${toneConfig.topBorderClass} bg-white p-4 transition-colors hover:bg-[#F1F5F9]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
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
                    className={`text-2xl font-bold font-mono tabular-nums block ${toneConfig.valueTextClass}`}
                  >
                    {tab.count}
                  </span>
                </div>
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${toneConfig.iconContainerClass} ${toneConfig.iconColorClass}`}
                >
                  {tab.icon}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#64748B]">{tab.subtitle}</p>
            </button>
          );
        })}
      </section>

      {/* 2. Three Independent Tabs & Active Tab Content */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
        {/* Accessible 3-Tab Bar: Pending | Completed | Rejected */}
        <div
          role="tablist"
          aria-label={t('Track Requests Status Tabs', 'علامات تبويب حالة الطلبات')}
          className="px-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            const toneConfig = SEMANTIC_KPI_TONES[tab.tone];
            return (
              <button
                key={tab.id}
                id={`track-requests-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`track-requests-tabpanel-${tab.id}`}
                onClick={() => handleTabSelect(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37848C] ${
                  isSelected
                    ? 'border-[#37848C] text-[#1A7373] bg-white font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] font-medium'
                }`}
              >
                <span
                  className={
                    isSelected ? toneConfig.iconColorClass : 'text-[#64748B]'
                  }
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span
                  dir="ltr"
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected
                      ? `${toneConfig.badgeClass} font-bold`
                      : 'text-[#64748B] bg-gray-100'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel using Generic DataTable<TrackRequestRecord> */}
        <div
          id={`track-requests-tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`track-requests-tab-${activeTab}`}
          className="p-3.5 sm:p-6 min-w-0"
        >
          <DataTable<TrackRequestRecord>
            data={filteredRequests}
            columns={columns}
            count={filteredRequests.length}
            loading={loading}
            title={sectionHeading}
            searchPlaceholder={searchPlaceholderText}
            searchValue={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setPageIndex(0);
            }}
            onResetSearch={() => setSearchQuery('')}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            onPageSizeChange={(nextSize) => {
              setPageSize(nextSize);
              setPageIndex(0);
            }}
            getRowId={(row) => row.id}
            emptyMessage={emptyStateMessage}
            minTableWidthClassName="min-w-[880px]"
          />
        </div>
      </section>
    </div>
  );
};
