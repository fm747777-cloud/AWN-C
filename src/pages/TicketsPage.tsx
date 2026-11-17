import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import { SupportTicketRecord, TicketsPageData } from '../types/portal';
import {
  CreateTicketFormPayload,
  CreateTicketModal,
} from '../components/tickets/CreateTicketModal';
import { ColumnDef, DataTable } from '../components/shared/DataTable';

export const TicketsPage: React.FC = () => {
  const { selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<TicketsPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    portalService.getTicketsData().then((data) => {
      if (active) {
        setPageData(data);
        setTickets(data.initialTickets);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const formatCurrentLocalDate = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCreateDemoTicket = (payload: CreateTicketFormPayload): void => {
    setTickets((prev) => {
      const nextIndex = prev.length + 1;
      const demoTicketId = `DEMO-TKT-${String(nextIndex).padStart(2, '0')}`;

      const newRecord: SupportTicketRecord = {
        id: `LOCAL-TICKET-${Date.now()}-${nextIndex}`,
        rowNumber: nextIndex,
        ticketId: demoTicketId,
        ticketType: payload.ticketType,
        subject: payload.subject,
        message: payload.message,
        priority: payload.priority,
        dateCreated: formatCurrentLocalDate(),
        replyStatus: '—',
        status: '—',
        closedDate: '—',
        attachmentName: payload.attachmentName,
        isLocalDemo: true,
      };

      return [...prev, newRecord];
    });

    setConfirmationMessage(
      t(
        `Local demo ticket (${payload.ticketType}) added to your session table. Note: This is temporary frontend demo data and has not been sent to a live support backend.`,
        `تمت إضافة تذكرة تجريبية محلية (${payload.ticketType}) إلى جدول الجلسة الحالية. ملاحظة: هذه بيانات تجريبية مؤقتة للواجهة الأمامية ولم يتم إرسالها إلى نظام دعم فعلي.`
      )
    );
  };

  const filteredTickets = useMemo<SupportTicketRecord[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tickets;

    return tickets.filter(
      (ticket) =>
        ticket.ticketId.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.ticketType.toLowerCase().includes(query) ||
        ticket.priority.toLowerCase().includes(query) ||
        ticket.status.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  const columns = useMemo<ColumnDef<SupportTicketRecord, any>[]>(
    () => [
      {
        id: 'rowNumber',
        accessorKey: 'rowNumber',
        header: '#',
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            className="text-xs sm:text-sm font-mono font-semibold text-[#64748B] tabular-nums"
          >
            {row.original.rowNumber}
          </span>
        ),
      },
      {
        id: 'ticketId',
        accessorKey: 'ticketId',
        header: t('Ticket ID', 'رقم التذكرة'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span
              dir="ltr"
              className="block text-xs sm:text-sm font-mono font-bold text-[#1A7373] tabular-nums"
            >
              {row.original.ticketId}
            </span>
            <span className="block text-[11px] text-[#64748B]">
              {row.original.ticketType} · {t('Local Demo', 'عرض تجريبي محلي')}
            </span>
          </div>
        ),
      },
      {
        id: 'subject',
        accessorKey: 'subject',
        header: t('Subject', 'الموضوع'),
        meta: {
          cellClassName: 'px-4 py-3.5 min-w-[200px] max-w-[320px]',
        },
        cell: ({ row }) => (
          <div className="space-y-1">
            <span
              dir="auto"
              className="block text-xs sm:text-sm font-semibold text-[#1F2937] break-words leading-relaxed"
            >
              {row.original.subject}
            </span>
            {row.original.attachmentName && (
              <span
                dir="auto"
                className="block text-[11px] text-[#64748B] truncate"
              >
                {t('Attachment:', 'مرفق:')} {row.original.attachmentName}
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: t('Priority', 'الأولوية'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span className="text-xs sm:text-sm font-semibold text-[#1F2937]">
            {row.original.priority}
          </span>
        ),
      },
      {
        id: 'dateCreated',
        accessorKey: 'dateCreated',
        header: t('Date Created', 'تاريخ الإنشاء'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span
            dir="ltr"
            className="text-xs sm:text-sm font-mono font-medium text-[#1F2937] tabular-nums"
          >
            {row.original.dateCreated}
          </span>
        ),
      },
      {
        id: 'replyStatus',
        accessorKey: 'replyStatus',
        header: t('Reply Status', 'حالة الرد'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span className="text-xs sm:text-sm text-[#64748B]">
            {row.original.replyStatus}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('Status', 'الحالة'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span className="text-xs sm:text-sm text-[#64748B]">
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'closedDate',
        accessorKey: 'closedDate',
        header: t('Closed Date', 'تاريخ الإغلاق'),
        meta: {
          cellClassName: 'px-4 py-3.5 whitespace-nowrap',
        },
        cell: ({ row }) => (
          <span className="text-xs sm:text-sm text-[#64748B]">
            {row.original.closedDate}
          </span>
        ),
      },
    ],
    [t]
  );

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Support Tickets...', 'جاري تحميل تذاكر الدعم...')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header with + New Ticket Action */}
      <section
        aria-labelledby="tickets-page-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold tracking-wider text-[#1A7373]">
              {t(pageData.eyebrowEn, 'المساعدة والدعم')}
            </span>
            <span aria-hidden="true" className="text-gray-300">
              ·
            </span>
            <span className="text-[#64748B] font-medium">
              {selectedCompany.name}
            </span>
          </div>

          <h1
            id="tickets-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitlePrefix, 'التذاكر')} ({tickets.length})
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'إدارة ومتابعة جميع تذاكر الدعم الفني والاستفسارات'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>{t('+ New Ticket', '+ تذكرة جديدة')}</span>
        </button>
      </section>

      {/* Local Demo Ticket Creation Confirmation Banner */}
      {confirmationMessage && (
        <div
          role="status"
          className="rounded-lg border border-[#37848C]/40 bg-[#37848C]/10 px-4 py-3 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2937]">
            <CheckCircle2 className="w-4 h-4 text-[#1A7373] shrink-0 mt-0.5" />
            <span>{confirmationMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setConfirmationMessage(null)}
            aria-label={t('Dismiss notification', 'إغلاق الإشعار')}
            className="p-1 rounded text-[#64748B] hover:text-[#1F2937]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Support Tickets Table powered by Generic DataTable<SupportTicketRecord> */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white p-3.5 sm:p-6 shadow-2xs min-w-0">
        <DataTable<SupportTicketRecord>
          data={filteredTickets}
          columns={columns}
          count={filteredTickets.length}
          loading={loading}
          title={`${t(pageData.pageTitlePrefix, 'التذاكر')} (${tickets.length})`}
          searchPlaceholder={t(
            'Search by Ticket ID, Subject, or Priority...',
            'البحث برقم التذكرة أو الموضوع أو الأولوية...'
          )}
          searchValue={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPageIndex(0);
          }}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPageIndex(0);
          }}
          getRowId={(row) => row.id}
          emptyMessage={t(pageData.emptyStateText, 'لم يتم العثور على تذاكر')}
          minTableWidthClassName="min-w-[860px]"
        />
      </section>

      {/* Create New Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        ticketTypeOptions={pageData.ticketTypeOptions}
        priorityOptions={pageData.priorityOptions}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTicket={handleCreateDemoTicket}
      />
    </div>
  );
};
