import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  CheckSquare,
  Clock,
  ListTodo,
  UserCheck,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  BusinessActivitiesPageData,
  BusinessActivitiesTabId,
  BusinessActivityDelegationRecord,
  BusinessActivityReminderRecord,
  BusinessActivityTodoRecord,
  TodosSubtabId,
} from '../types/portal';
import { TodoDetailsModal } from '../components/business-activities/TodoDetailsModal';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../theme/portalDesignSystem';
import { ColumnDef, DataTable } from '../components/shared/DataTable';

interface MainTabConfig {
  id: BusinessActivitiesTabId;
  label: string;
  icon: React.ReactNode;
}

export const BusinessActivitiesPage: React.FC = () => {
  const { isRtl, selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<BusinessActivitiesPageData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  // Default top-level tab: To-dos
  const [activeMainTab, setActiveMainTab] =
    useState<BusinessActivitiesTabId>('todos');
  // Default To-dos subtab: Pending
  const [activeTodosSubtab, setActiveTodosSubtab] =
    useState<TodosSubtabId>('pending');

  // Independent search & zero-based pagination state for Pending To-dos
  const [pendingQuery, setPendingQuery] = useState<string>('');
  const [pendingPageIndex, setPendingPageIndex] = useState<number>(0);
  const [pendingPageSize, setPendingPageSize] = useState<number>(10);

  // Independent search & zero-based pagination state for Completed To-dos
  const [completedQuery, setCompletedQuery] = useState<string>('');
  const [completedPageIndex, setCompletedPageIndex] = useState<number>(0);
  const [completedPageSize, setCompletedPageSize] = useState<number>(10);

  // Independent search & zero-based pagination state for Delegations
  const [delegationsQuery, setDelegationsQuery] = useState<string>('');
  const [delegationsPageIndex, setDelegationsPageIndex] = useState<number>(0);
  const [delegationsPageSize, setDelegationsPageSize] = useState<number>(10);

  // Independent search & zero-based pagination state for Reminders
  const [remindersQuery, setRemindersQuery] = useState<string>('');
  const [remindersPageIndex, setRemindersPageIndex] = useState<number>(0);
  const [remindersPageSize, setRemindersPageSize] = useState<number>(10);

  // Selected Completed To-do record for details modal
  const [selectedTodoForModal, setSelectedTodoForModal] =
    useState<BusinessActivityTodoRecord | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    portalService.getBusinessActivitiesData().then((data) => {
      if (active) {
        setPageData(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Filtered Pending To-dos
  const filteredPendingTodos = useMemo<BusinessActivityTodoRecord[]>(() => {
    if (!pageData) return [];
    const query = pendingQuery.trim().toLowerCase();
    if (!query) return pageData.pendingTodos;

    return pageData.pendingTodos.filter((item) => {
      return (
        item.todoCode.toLowerCase().includes(query) ||
        item.requestTitle.toLowerCase().includes(query) ||
        item.priority.toLowerCase().includes(query) ||
        item.dueDate.toLowerCase().includes(query)
      );
    });
  }, [pageData, pendingQuery]);

  // Filtered Completed To-dos
  const filteredCompletedTodos = useMemo<BusinessActivityTodoRecord[]>(() => {
    if (!pageData) return [];
    const query = completedQuery.trim().toLowerCase();
    if (!query) return pageData.completedTodos;

    return pageData.completedTodos.filter((item) => {
      return (
        item.todoCode.toLowerCase().includes(query) ||
        item.requestTitle.toLowerCase().includes(query) ||
        item.priority.toLowerCase().includes(query) ||
        item.dueDate.toLowerCase().includes(query)
      );
    });
  }, [pageData, completedQuery]);

  // Filtered Delegations
  const filteredDelegations = useMemo<
    BusinessActivityDelegationRecord[]
  >(() => {
    if (!pageData) return [];
    const query = delegationsQuery.trim().toLowerCase();
    if (!query) return pageData.delegationRecords;

    return pageData.delegationRecords.filter((item) => {
      return (
        item.delegationCode.toLowerCase().includes(query) ||
        item.delegateName.toLowerCase().includes(query) ||
        item.portal.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.startDate.toLowerCase().includes(query) ||
        item.endDate.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
    });
  }, [pageData, delegationsQuery]);

  // Filtered Reminders
  const filteredReminders = useMemo<BusinessActivityReminderRecord[]>(() => {
    if (!pageData) return [];
    const query = remindersQuery.trim().toLowerCase();
    if (!query) return pageData.reminderRecords;

    return pageData.reminderRecords.filter((item) => {
      return (
        item.reminderCode.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.reminderDate.toLowerCase().includes(query) ||
        item.reminderStatus.toLowerCase().includes(query) ||
        item.remarks.toLowerCase().includes(query)
      );
    });
  }, [pageData, remindersQuery]);

  // Strongly typed columns for To-dos (Pending & Completed share BusinessActivityTodoRecord)
  const todoColumns = useMemo<ColumnDef<BusinessActivityTodoRecord, any>[]>(
    () => [
      {
        id: 'todoCode',
        accessorKey: 'todoCode',
        header: t('To-dos Code', 'رمز المهمة'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span dir="ltr" title={row.original.todoCode}>
            {row.original.todoCode}
          </span>
        ),
      },
      {
        id: 'requestTitle',
        accessorKey: 'requestTitle',
        header: t('Request Title', 'عنوان الطلب'),
        meta: {
          dir: 'auto',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937] min-w-[200px] max-w-[340px] break-words',
        },
        cell: ({ row }) => (
          <span
            dir="auto"
            title={row.original.requestTitle}
            className="block break-words leading-relaxed"
          >
            {row.original.requestTitle}
          </span>
        ),
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: t('Priority', 'الأولوية'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-xs font-semibold"
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span>{row.original.priority}</span>
          </span>
        ),
      },
      {
        id: 'dueDate',
        accessorKey: 'dueDate',
        header: t('Due Date', 'تاريخ الاستحقاق'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
    ],
    [t]
  );

  // Strongly typed columns for Delegations (BusinessActivityDelegationRecord)
  const delegationColumns = useMemo<
    ColumnDef<BusinessActivityDelegationRecord, any>[]
  >(
    () => [
      {
        id: 'delegationCode',
        accessorKey: 'delegationCode',
        header: t('Delegation Code', 'رمز التفويض'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'delegateName',
        accessorKey: 'delegateName',
        header: t('Delegate Name', 'اسم المفوّض'),
        meta: {
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937]',
        },
      },
      {
        id: 'portal',
        accessorKey: 'portal',
        header: t('Portal', 'البوابة'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: t('Role', 'الدور'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
      {
        id: 'startDate',
        accessorKey: 'startDate',
        header: t('Start Date', 'تاريخ البدء'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'endDate',
        accessorKey: 'endDate',
        header: t('End Date', 'تاريخ الانتهاء'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('Status', 'الحالة'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
    ],
    [t]
  );

  // Strongly typed columns for Reminders (BusinessActivityReminderRecord)
  const reminderColumns = useMemo<
    ColumnDef<BusinessActivityReminderRecord, any>[]
  >(
    () => [
      {
        id: 'reminderCode',
        accessorKey: 'reminderCode',
        header: t('Reminder Code', 'رمز التذكير'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap',
        },
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: t('Title', 'العنوان'),
        meta: {
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-medium text-[#1F2937]',
        },
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: t('Description', 'الوصف'),
        meta: {
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937] max-w-xs break-words',
        },
      },
      {
        id: 'reminderDate',
        accessorKey: 'reminderDate',
        header: t('Reminder Date', 'تاريخ التذكير'),
        meta: {
          dir: 'ltr',
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap',
        },
      },
      {
        id: 'reminderStatus',
        accessorKey: 'reminderStatus',
        header: t('Reminder Status', 'حالة التذكير'),
        meta: {
          cellClassName: 'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937]',
        },
      },
      {
        id: 'remarks',
        accessorKey: 'remarks',
        header: t('Remarks', 'ملاحظات'),
        meta: {
          cellClassName:
            'px-3.5 sm:px-4 py-3.5 text-xs sm:text-sm text-[#1F2937] max-w-xs break-words',
        },
      },
    ],
    [t]
  );

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Business Activities...', 'جاري تحميل الأنشطة التجارية...')}
      </div>
    );
  }

  const mainTabs: MainTabConfig[] = [
    {
      id: 'todos',
      label: t('To-dos', 'المهام'),
      icon: <ListTodo className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'delegations',
      label: t('Delegations', 'التفويضات'),
      icon: <UserCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reminders',
      label: t('Reminders', 'التذكيرات'),
      icon: <BellRing className="w-4 h-4 shrink-0" />,
    },
  ];

  const summaryKpiCards: Array<{
    id: string;
    label: string;
    count: number;
    tone: SemanticKpiCategory;
    icon: React.ReactNode;
    onSelect: () => void;
    isActive: boolean;
  }> = [
    {
      id: 'pending-todos',
      label: t('Pending To-dos', 'مهام قيد الانتظار'),
      count: pageData.pendingSummaryCount,
      tone: 'amber',
      icon: <Clock className="w-4 h-4" />,
      onSelect: () => {
        setActiveMainTab('todos');
        setActiveTodosSubtab('pending');
      },
      isActive: activeMainTab === 'todos' && activeTodosSubtab === 'pending',
    },
    {
      id: 'completed-todos',
      label: t('Completed To-dos', 'المهام المكتملة'),
      count: pageData.completedSummaryCount,
      tone: 'green',
      icon: <CheckCircle2 className="w-4 h-4" />,
      onSelect: () => {
        setActiveMainTab('todos');
        setActiveTodosSubtab('completed');
      },
      isActive: activeMainTab === 'todos' && activeTodosSubtab === 'completed',
    },
    {
      id: 'delegations',
      label: t('Delegations', 'التفويضات'),
      count: pageData.delegationsSummaryCount,
      tone: 'blue',
      icon: <UserCheck className="w-4 h-4" />,
      onSelect: () => setActiveMainTab('delegations'),
      isActive: activeMainTab === 'delegations',
    },
    {
      id: 'reminders',
      label: t('Reminders', 'التذكيرات'),
      count: pageData.reminderRecords.length,
      tone: 'slate',
      icon: <BellRing className="w-4 h-4" />,
      onSelect: () => setActiveMainTab('reminders'),
      isActive: activeMainTab === 'reminders',
    },
  ];

  const handleMainTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void => {
    if (mainTabs.length === 0) return;

    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey) {
      event.preventDefault();
      const nextIndex = (index + 1) % mainTabs.length;
      setActiveMainTab(mainTabs[nextIndex].id);
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prevIndex = (index - 1 + mainTabs.length) % mainTabs.length;
      setActiveMainTab(mainTabs[prevIndex].id);
    }
  };

  const searchPlaceholderText = t(
    pageData.searchPlaceholder,
    'بحث في السجلات...'
  );

  // Completed To-dos total count preserves the OCR summary count (15) when unfiltered
  // so page 1 (10 rows) and page 2 (empty source explanation) remain inspectable.
  const completedEffectiveCount =
    completedQuery.trim().length > 0
      ? filteredCompletedTodos.length
      : pageData.completedSummaryCount;

  return (
    <div className="space-y-6 min-w-0">
      {/* 1. Page Header */}
      <section
        aria-labelledby="business-activities-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-2xs"
      >
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold tracking-wider text-[#1A7373]">
              {t(pageData.eyebrowEn, 'أعمالي')}
            </span>
            <span aria-hidden="true" className="text-gray-300">
              ·
            </span>
            <span className="text-[#64748B] font-medium break-words">
              {selectedCompany.name}
            </span>
          </div>

          <h1
            id="business-activities-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, pageData.pageTitleAr)}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'إدارة المهام التشغيلية والتفويضات والتذكيرات المجدولة للمنشأة.'
            )}
          </p>
        </div>
      </section>

      {/* Semantic KPI Summary Strip */}
      <section
        aria-label={t(
          'Business Activities Summary Metrics',
          'ملخص مؤشرات الأنشطة التجارية'
        )}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {summaryKpiCards.map((card) => {
          const tone = SEMANTIC_KPI_TONES[card.tone];
          return (
            <button
              key={card.id}
              type="button"
              onClick={card.onSelect}
              className={`text-start rounded-lg border border-[#E5E7EB] ${tone.topBorderClass} bg-white p-4 transition-colors hover:bg-[#F1F5F9]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                card.isActive ? 'ring-1 ring-[#37848C]/30 bg-[#F8FAFC]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="text-xs font-semibold text-[#64748B] block break-words">
                    {card.label}
                  </span>
                  <span
                    dir="ltr"
                    className={`text-2xl font-bold font-mono tabular-nums block ${tone.valueTextClass}`}
                  >
                    {card.count}
                  </span>
                </div>
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone.iconContainerClass} ${tone.iconColorClass}`}
                >
                  {card.icon}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* 2. Three Independent Main Tabs & Active Content */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs min-w-0">
        {/* Top-Level Tab Bar: To-dos | Delegations | Reminders */}
        <div
          role="tablist"
          aria-label={t(
            'Business Activities Tabs',
            'علامات تبويب الأنشطة التجارية'
          )}
          className="px-3 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {mainTabs.map((tab, index) => {
            const isSelected = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`activities-main-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`activities-main-tabpanel-${tab.id}`}
                onClick={() => setActiveMainTab(tab.id)}
                onKeyDown={(e) => handleMainTabKeyDown(e, index)}
                className={`relative inline-flex items-center gap-2 px-3 sm:px-4 py-3.5 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37848C] ${
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
              </button>
            );
          })}
        </div>

        {/* Active Main Tab Content */}
        <div className="p-3.5 sm:p-6 min-w-0">
          {/* =========================================================
              MAIN TAB 1: TO-DOS (with Pending & Completed Subtabs)
             ========================================================= */}
          {activeMainTab === 'todos' && (
            <div
              id="activities-main-tabpanel-todos"
              role="tabpanel"
              aria-labelledby="activities-main-tab-todos"
              className="space-y-5 sm:space-y-6 min-w-0"
            >
              {/* Second-Level Subtabs: Pending | Completed */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div
                  role="tablist"
                  aria-label={t(
                    'To-dos Status Subtabs',
                    'علامات تبويب حالة المهام'
                  )}
                  className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] self-start max-w-full"
                >
                  <button
                    id="todos-subtab-pending"
                    type="button"
                    role="tab"
                    aria-selected={activeTodosSubtab === 'pending'}
                    aria-controls="todos-subtabpanel-pending"
                    onClick={() => setActiveTodosSubtab('pending')}
                    className={`inline-flex items-center gap-2 min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                      activeTodosSubtab === 'pending'
                        ? 'bg-[#37848C] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#1F2937]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('Pending', 'قيد الانتظار')}</span>
                    <span
                      dir="ltr"
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                        activeTodosSubtab === 'pending'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200/70 text-[#64748B]'
                      }`}
                    >
                      {pageData.pendingSummaryCount}
                    </span>
                  </button>

                  <button
                    id="todos-subtab-completed"
                    type="button"
                    role="tab"
                    aria-selected={activeTodosSubtab === 'completed'}
                    aria-controls="todos-subtabpanel-completed"
                    onClick={() => setActiveTodosSubtab('completed')}
                    className={`inline-flex items-center gap-2 min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                      activeTodosSubtab === 'completed'
                        ? 'bg-[#37848C] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#1F2937]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('Completed', 'مكتملة')}</span>
                    <span
                      dir="ltr"
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                        activeTodosSubtab === 'completed'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200/70 text-[#64748B]'
                      }`}
                    >
                      {pageData.completedSummaryCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* SUBTAB 1: PENDING VIEW */}
              {activeTodosSubtab === 'pending' && (
                <div
                  id="todos-subtabpanel-pending"
                  role="tabpanel"
                  aria-labelledby="todos-subtab-pending"
                >
                  <DataTable<BusinessActivityTodoRecord>
                    data={filteredPendingTodos}
                    columns={todoColumns}
                    count={filteredPendingTodos.length}
                    loading={loading}
                    title={`${t('Pending To-dos', 'المهام قيد الانتظار')} (${
                      pageData.pendingSummaryCount
                    })`}
                    searchPlaceholder={searchPlaceholderText}
                    searchValue={pendingQuery}
                    onSearchChange={(val) => {
                      setPendingQuery(val);
                      setPendingPageIndex(0);
                    }}
                    pageIndex={pendingPageIndex}
                    pageSize={pendingPageSize}
                    pageSizeOptions={pageData.pageSizeOptions}
                    onPageChange={setPendingPageIndex}
                    onPageSizeChange={(nextSize) => {
                      setPendingPageSize(nextSize);
                      setPendingPageIndex(0);
                    }}
                    getRowId={(row) => row.id}
                    emptyMessage={t(
                      pageData.pendingEmptyStateText,
                      'لا توجد مهام قيد الانتظار'
                    )}
                    emptyIcon={
                      <CheckSquare className="w-6 h-6 text-[#37848C] opacity-80" />
                    }
                    minTableWidthClassName="min-w-[640px]"
                  />
                </div>
              )}

              {/* SUBTAB 2: COMPLETED VIEW */}
              {activeTodosSubtab === 'completed' && (
                <div
                  id="todos-subtabpanel-completed"
                  role="tabpanel"
                  aria-labelledby="todos-subtab-completed"
                >
                  <DataTable<BusinessActivityTodoRecord>
                    data={filteredCompletedTodos}
                    columns={todoColumns}
                    count={completedEffectiveCount}
                    loading={loading}
                    title={`${t('Completed To-dos', 'المهام المكتملة')} (${
                      pageData.completedSummaryCount
                    })`}
                    subtitle={t(
                      'Select any completed task row to view its details.',
                      'اختر أي صف مهمة مكتملة لعرض تفاصيلها.'
                    )}
                    searchPlaceholder={searchPlaceholderText}
                    searchValue={completedQuery}
                    onSearchChange={(val) => {
                      setCompletedQuery(val);
                      setCompletedPageIndex(0);
                    }}
                    pageIndex={completedPageIndex}
                    pageSize={completedPageSize}
                    pageSizeOptions={pageData.pageSizeOptions}
                    onPageChange={setCompletedPageIndex}
                    onPageSizeChange={(nextSize) => {
                      setCompletedPageSize(nextSize);
                      setCompletedPageIndex(0);
                    }}
                    getRowId={(row) => row.id}
                    onRowClick={(todo) => setSelectedTodoForModal(todo)}
                    getRowAriaLabel={(todo) =>
                      t(
                        `View details for task ${todo.todoCode}`,
                        `عرض تفاصيل المهمة ${todo.todoCode}`
                      )
                    }
                    emptyMessage={t('No items found', 'لم يتم العثور على عناصر')}
                    emptyDescription={
                      completedQuery.trim().length > 0
                        ? t(
                            `No completed records matched "${completedQuery}".`,
                            `لا توجد سجلات مكتملة تطابق "${completedQuery}".`
                          )
                        : t(
                            `Only ${pageData.completedTodos.length} records were provided in the source dataset out of the ${pageData.completedSummaryCount} summary count.`,
                            `يتوفر ${pageData.completedTodos.length} سجل في البيانات المصدرية من أصل ${pageData.completedSummaryCount}.`
                          )
                    }
                    onResetSearch={() => {
                      setCompletedQuery('');
                      setCompletedPageIndex(0);
                    }}
                    minTableWidthClassName="min-w-[640px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              MAIN TAB 2: DELEGATIONS
             ========================================================= */}
          {activeMainTab === 'delegations' && (
            <div
              id="activities-main-tabpanel-delegations"
              role="tabpanel"
              aria-labelledby="activities-main-tab-delegations"
            >
              <DataTable<BusinessActivityDelegationRecord>
                data={filteredDelegations}
                columns={delegationColumns}
                count={filteredDelegations.length}
                loading={loading}
                title={`${t('Delegations', 'التفويضات')} (${
                  pageData.delegationsSummaryCount
                })`}
                searchPlaceholder={searchPlaceholderText}
                searchValue={delegationsQuery}
                onSearchChange={(val) => {
                  setDelegationsQuery(val);
                  setDelegationsPageIndex(0);
                }}
                pageIndex={delegationsPageIndex}
                pageSize={delegationsPageSize}
                pageSizeOptions={pageData.pageSizeOptions}
                onPageChange={setDelegationsPageIndex}
                onPageSizeChange={(nextSize) => {
                  setDelegationsPageSize(nextSize);
                  setDelegationsPageIndex(0);
                }}
                getRowId={(row) => row.id}
                emptyMessage={t(
                  pageData.delegationsEmptyStateText,
                  'لم يتم العثور على عناصر'
                )}
                emptyIcon={
                  <UserCheck className="w-6 h-6 text-[#37848C] opacity-80" />
                }
                minTableWidthClassName="min-w-[740px]"
              />
            </div>
          )}

          {/* =========================================================
              MAIN TAB 3: REMINDERS
             ========================================================= */}
          {activeMainTab === 'reminders' && (
            <div
              id="activities-main-tabpanel-reminders"
              role="tabpanel"
              aria-labelledby="activities-main-tab-reminders"
            >
              <DataTable<BusinessActivityReminderRecord>
                data={filteredReminders}
                columns={reminderColumns}
                count={filteredReminders.length}
                loading={loading}
                title={t('Reminders', 'التذكيرات')}
                searchPlaceholder={searchPlaceholderText}
                searchValue={remindersQuery}
                onSearchChange={(val) => {
                  setRemindersQuery(val);
                  setRemindersPageIndex(0);
                }}
                pageIndex={remindersPageIndex}
                pageSize={remindersPageSize}
                pageSizeOptions={pageData.pageSizeOptions}
                onPageChange={setRemindersPageIndex}
                onPageSizeChange={(nextSize) => {
                  setRemindersPageSize(nextSize);
                  setRemindersPageIndex(0);
                }}
                getRowId={(row) => row.id}
                emptyMessage={t(
                  pageData.remindersEmptyStateText,
                  'لا توجد تذكيرات'
                )}
                emptyIcon={
                  <BellRing className="w-6 h-6 text-[#37848C] opacity-80" />
                }
                minTableWidthClassName="min-w-[740px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Read-Only Completed To-do Details Modal */}
      <TodoDetailsModal
        todo={selectedTodoForModal}
        onClose={() => setSelectedTodoForModal(null)}
      />
    </div>
  );
};
