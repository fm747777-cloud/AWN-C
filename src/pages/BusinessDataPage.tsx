import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderSearch,
  Package,
  Search,
  Users,
  X,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { portalService } from '../services/portalService';
import {
  BusinessAssetRecord,
  BusinessDataPageData,
  BusinessDataTabId,
  BusinessDocumentRecord,
  BusinessEmployeeRecord,
  StructuredDocumentRecord,
} from '../types/portal';
import { BusinessDocumentCard } from '../components/business-data/BusinessDocumentCard';
import { BusinessDocumentDetailsModal } from '../components/business-data/BusinessDocumentDetailsModal';
import {
  SEMANTIC_KPI_TONES,
  SemanticKpiCategory,
} from '../theme/portalDesignSystem';

interface TabConfig {
  id: BusinessDataTabId;
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: SemanticKpiCategory;
  subtitle: string;
}

export const BusinessDataPage: React.FC = () => {
  const { isRtl, selectedCompany, t } = usePortal();

  const [pageData, setPageData] = useState<BusinessDataPageData | null>(null);
  // Default to Documents tab as specified
  const [activeTab, setActiveTab] = useState<BusinessDataTabId>('documents');

  // Independent search states per tab
  const [businessInput, setBusinessInput] = useState<string>('');
  const [businessQuery, setBusinessQuery] = useState<string>('');

  const [documentsInput, setDocumentsInput] = useState<string>('');
  const [documentsQuery, setDocumentsQuery] = useState<string>('');
  const [documentsPage, setDocumentsPage] = useState<number>(1);
  const [documentsPageSize, setDocumentsPageSize] = useState<number>(10);

  const [employeesInput, setEmployeesInput] = useState<string>('');
  const [employeesQuery, setEmployeesQuery] = useState<string>('');

  const [assetsInput, setAssetsInput] = useState<string>('');
  const [assetsQuery, setAssetsQuery] = useState<string>('');

  const [selectedRecordForModal, setSelectedRecordForModal] =
    useState<BusinessDocumentRecord | null>(null);
  const [selectedStructuredDocForModal, setSelectedStructuredDocForModal] =
    useState<StructuredDocumentRecord | null>(null);

  useEffect(() => {
    let active = true;
    portalService.getBusinessData().then((data) => {
      if (active) {
        setPageData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 1. Filtered Business records
  const filteredBusinessRecords = useMemo<BusinessDocumentRecord[]>(() => {
    if (!pageData) return [];
    const query = businessQuery.trim().toLowerCase();
    if (!query) return pageData.businessRecords;

    return pageData.businessRecords.filter((rec) => {
      const nameMatch = rec.name.toLowerCase().includes(query);
      const idMatch = rec.idNumber.toLowerCase().includes(query);
      const statusMatch = rec.status
        ? rec.status.toLowerCase().includes(query)
        : false;
      const expiryMatch = rec.expiryDate.toLowerCase().includes(query);
      return nameMatch || idMatch || statusMatch || expiryMatch;
    });
  }, [pageData, businessQuery]);

  // 2. Filtered Documents table records
  const filteredDocumentRecords = useMemo<StructuredDocumentRecord[]>(() => {
    if (!pageData) return [];
    const query = documentsQuery.trim().toLowerCase();
    if (!query) return pageData.documentRecords;

    return pageData.documentRecords.filter((doc) => {
      return (
        doc.documentCode.toLowerCase().includes(query) ||
        doc.documentRelatedTo.toLowerCase().includes(query) ||
        doc.documentName.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        doc.documentCategory.toLowerCase().includes(query) ||
        doc.entityName.toLowerCase().includes(query) ||
        doc.businessEntity.toLowerCase().includes(query) ||
        doc.dateExpiry.toLowerCase().includes(query) ||
        doc.daysLeft.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query)
      );
    });
  }, [pageData, documentsQuery]);

  // 3. Filtered Employees table records
  const filteredEmployeeRecords = useMemo<BusinessEmployeeRecord[]>(() => {
    if (!pageData) return [];
    const query = employeesQuery.trim().toLowerCase();
    if (!query) return pageData.employeeRecords;

    return pageData.employeeRecords.filter((emp) => {
      return (
        emp.employeeName.toLowerCase().includes(query) ||
        emp.phoneNumber.toLowerCase().includes(query) ||
        emp.jobTitle.toLowerCase().includes(query) ||
        emp.gender.toLowerCase().includes(query) ||
        emp.citizenship.toLowerCase().includes(query) ||
        emp.nationality.toLowerCase().includes(query) ||
        emp.status.toLowerCase().includes(query)
      );
    });
  }, [pageData, employeesQuery]);

  // 4. Filtered Assets table records
  const filteredAssetRecords = useMemo<BusinessAssetRecord[]>(() => {
    if (!pageData) return [];
    const query = assetsQuery.trim().toLowerCase();
    if (!query) return pageData.assetRecords;

    return pageData.assetRecords.filter((asset) => {
      return (
        asset.assetCode.toLowerCase().includes(query) ||
        asset.assetName.toLowerCase().includes(query) ||
        asset.assetCategory.toLowerCase().includes(query) ||
        asset.assignedTo.toLowerCase().includes(query) ||
        asset.department.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.assignedDate.toLowerCase().includes(query) ||
        asset.status.toLowerCase().includes(query)
      );
    });
  }, [pageData, assetsQuery]);

  if (!pageData) {
    return (
      <div className="py-12 text-center text-sm text-[#64748B]">
        {t('Loading Business Data...', 'جاري تحميل بيانات المنشأة...')}
      </div>
    );
  }

  const tabs: TabConfig[] = [
    {
      id: 'business',
      label: t('Business', 'المنشآت'),
      count: pageData.businessRecords.length,
      icon: <Building2 className="w-4 h-4 shrink-0" />,
      tone: 'teal',
      subtitle: t('Registered business entities', 'المنشآت المسجلة'),
    },
    {
      id: 'documents',
      label: t('Documents', 'المستندات'),
      count: pageData.documentRecords.length,
      icon: <FileText className="w-4 h-4 shrink-0" />,
      tone: 'teal',
      subtitle: t('Active official records', 'السجلات والوثائق الرسمية'),
    },
    {
      id: 'employees',
      label: t('Employees', 'الموظفون'),
      count: pageData.employeeRecords.length,
      icon: <Users className="w-4 h-4 shrink-0" />,
      tone: 'blue',
      subtitle: t('Workforce & personnel', 'القوى العاملة والموظفون'),
    },
    {
      id: 'assets',
      label: t('Assets', 'الأصول'),
      count: pageData.assetRecords.length,
      icon: <Package className="w-4 h-4 shrink-0" />,
      tone: 'green',
      subtitle: t('Company operational assets', 'الأصول التشغيلية للمنشأة'),
    },
  ];

  const documentsColumnHeaders: readonly string[] = [
    t('Document Code', 'رمز المستند'),
    t('Document Related To', 'مرتبط بـ'),
    t('Document Name', 'اسم المستند'),
    t('Document Type', 'نوع المستند'),
    t('Document Category', 'فئة المستند'),
    t('Entity Name', 'اسم الجهة'),
    t('Business Entity', 'المنشأة التجارية'),
    t('Date Expiry', 'تاريخ الانتهاء'),
    t('Days Left', 'الأيام المتبقية'),
    t('Status', 'الحالة'),
  ];

  const employeesColumnHeaders: readonly string[] = [
    t('Employee Name', 'اسم الموظف'),
    t('Phone Number', 'رقم الهاتف'),
    t('Job Title', 'المسمى الوظيفي'),
    t('Gender', 'الجنس'),
    t('Citizenship', 'المواطنة'),
    t('Nationality', 'الجنسية'),
    t('Status', 'الحالة'),
  ];

  const assetsColumnHeaders: readonly string[] = [
    t('Asset Code', 'رمز الأصل'),
    t('Asset Name', 'اسم الأصل'),
    t('Asset Category', 'فئة الأصل'),
    t('Assigned To', 'مخصص لـ'),
    t('Department', 'القسم'),
    t('Serial Number', 'الرقم التسلسلي'),
    t('Assigned Date', 'تاريخ التخصيص'),
    t('Status', 'الحالة'),
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

  // Pagination calculation for Documents tab
  const documentsTotalPages = Math.max(
    1,
    Math.ceil(filteredDocumentRecords.length / documentsPageSize)
  );
  const safeDocumentsPage = Math.min(documentsPage, documentsTotalPages);
  const paginatedDocuments = filteredDocumentRecords.slice(
    (safeDocumentsPage - 1) * documentsPageSize,
    safeDocumentsPage * documentsPageSize
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <section
        aria-labelledby="business-data-page-heading"
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
            id="business-data-page-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(pageData.pageTitleEn, pageData.pageTitleAr)}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            {t(
              pageData.pageDescriptionEn,
              'إدارة وتنظيم جميع بيانات المنشأة والمستندات الرسمية وسجلات الموظفين والأصول من مكان واحد.'
            )}
          </p>
        </div>
      </section>

      {/* Semantic KPI Summary Strip */}
      <section
        aria-label={t(
          'Business Data Summary Metrics',
          'ملخص مؤشرات بيانات المنشأة'
        )}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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

      {/* 2. Four Independent Page-Level Tabs & Active Tab Content */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
        {/* Accessible 4-Tab Bar: Business | Documents | Employees | Assets */}
        <div
          role="tablist"
          aria-label={t(
            'Business Data Navigation Tabs',
            'علامات تبويب بيانات المنشأة'
          )}
          className="px-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`business-data-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`business-data-tabpanel-${tab.id}`}
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
        <div className="p-5 sm:p-6">
          {/* =========================================================
              TAB 1: BUSINESS
             ========================================================= */}
          {activeTab === 'business' && (
            <div
              id="business-data-tabpanel-business"
              role="tabpanel"
              aria-labelledby="business-data-tab-business"
              className="space-y-6"
            >
              {/* Business Overview & Search Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]">
                    {t(pageData.businessSectionTitleEn, 'نظرة عامة على المنشآت')}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B]">
                    {t(
                      pageData.businessSectionSubtitleEn,
                      'إدارة وتفقد المنشآت المسجلة ووثائقها.'
                    )}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBusinessQuery(businessInput);
                  }}
                  role="search"
                  aria-label={t('Search businesses', 'البحث في المنشآت')}
                  className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1 sm:w-72 md:w-80">
                    <label htmlFor="business-tab-search" className="sr-only">
                      {t(
                        pageData.businessSearchPlaceholder,
                        'البحث في المنشآت...'
                      )}
                    </label>
                    <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="business-tab-search"
                      type="text"
                      value={businessInput}
                      onChange={(e) => {
                        setBusinessInput(e.target.value);
                        setBusinessQuery(e.target.value);
                      }}
                      placeholder={t(
                        pageData.businessSearchPlaceholder,
                        'البحث في المنشآت...'
                      )}
                      className="w-full h-9 ps-9 pe-8 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
                    />
                    {businessInput.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setBusinessInput('');
                          setBusinessQuery('');
                        }}
                        aria-label={t('Clear business search', 'مسح البحث')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64748B] hover:text-[#1F2937] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  >
                    {t('Search', 'بحث')}
                  </button>
                </form>
              </div>

              {/* Business Cards Grid */}
              {filteredBusinessRecords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredBusinessRecords.map((record) => (
                    <BusinessDocumentCard
                      key={record.recordKey}
                      record={record}
                      onViewDetails={(selected) =>
                        setSelectedRecordForModal(selected)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 px-4 rounded-lg border border-dashed border-[#E5E7EB] bg-[#F8FAFC] text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center mx-auto">
                    <FolderSearch className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-sm font-bold text-[#1F2937]">
                      {t('No businesses found', 'لم يتم العثور على منشآت')}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {t(
                        `No business records matched "${businessQuery}".`,
                        `لا توجد سجلات منشآت تطابق "${businessQuery}".`
                      )}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessInput('');
                        setBusinessQuery('');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F1F5F9] text-xs font-semibold text-[#1A7373] transition-colors"
                    >
                      <span>{t('Reset Search', 'إعادة ضبط البحث')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 2: DOCUMENTS (Structured 10-Column Table + Pagination)
             ========================================================= */}
          {activeTab === 'documents' && (
            <div
              id="business-data-tabpanel-documents"
              role="tabpanel"
              aria-labelledby="business-data-tab-documents"
              className="space-y-5"
            >
              {/* Documents Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]">
                    {t('Documents', 'المستندات')}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {t(
                      'Structured company document records and expiration tracking.',
                      'سجلات مستندات المنشأة المنظمة ومتابعة تواريخ الانتهاء.'
                    )}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDocumentsQuery(documentsInput);
                    setDocumentsPage(1);
                  }}
                  role="search"
                  aria-label={t('Search documents', 'البحث في المستندات')}
                  className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1 sm:w-72 md:w-80">
                    <label htmlFor="documents-tab-search" className="sr-only">
                      {t(
                        pageData.documentsSearchPlaceholder,
                        'البحث في المستندات...'
                      )}
                    </label>
                    <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="documents-tab-search"
                      type="text"
                      value={documentsInput}
                      onChange={(e) => {
                        setDocumentsInput(e.target.value);
                        setDocumentsQuery(e.target.value);
                        setDocumentsPage(1);
                      }}
                      placeholder={t(
                        pageData.documentsSearchPlaceholder,
                        'البحث في المستندات...'
                      )}
                      className="w-full h-9 ps-9 pe-8 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
                    />
                    {documentsInput.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentsInput('');
                          setDocumentsQuery('');
                          setDocumentsPage(1);
                        }}
                        aria-label={t('Clear documents search', 'مسح البحث')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64748B] hover:text-[#1F2937] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  >
                    {t('Search', 'بحث')}
                  </button>
                </form>
              </div>

              {/* 10-Column Data Table */}
              <div className="rounded-lg border border-[#E5E7EB] overflow-x-auto">
                <table className="w-full text-start border-collapse min-w-[980px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                      {documentsColumnHeaders.map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-3.5 py-3 text-start text-xs font-semibold text-[#64748B] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => (
                        <tr
                          key={doc.id}
                          tabIndex={0}
                          role="button"
                          aria-label={t(
                            `View document details for ${doc.documentCode} ${doc.documentName}`,
                            `عرض تفاصيل المستند ${doc.documentCode} ${doc.documentName}`
                          )}
                          onClick={() => setSelectedStructuredDocForModal(doc)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedStructuredDocForModal(doc);
                            }
                          }}
                          className="cursor-pointer hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37848C] transition-colors"
                        >
                          {/* 1. Document Code */}
                          <td
                            dir="ltr"
                            className="px-3.5 py-3.5 text-xs sm:text-sm font-mono font-semibold text-[#1A7373] tabular-nums whitespace-nowrap"
                          >
                            {doc.documentCode}
                          </td>

                          {/* 2. Document Related To */}
                          <td className="px-3.5 py-3.5 text-xs sm:text-sm text-[#1F2937] whitespace-nowrap">
                            {doc.documentRelatedTo}
                          </td>

                          {/* 3. Document Name */}
                          <td
                            dir="auto"
                            className="px-3.5 py-3.5 text-xs sm:text-sm font-semibold text-[#1F2937]"
                          >
                            {doc.documentName}
                          </td>

                          {/* 4. Document Type */}
                          <td
                            dir="auto"
                            className="px-3.5 py-3.5 text-xs sm:text-sm text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.documentType}
                          </td>

                          {/* 5. Document Category */}
                          <td
                            dir="auto"
                            className="px-3.5 py-3.5 text-xs sm:text-sm text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.documentCategory}
                          </td>

                          {/* 6. Entity Name */}
                          <td
                            dir="auto"
                            className="px-3.5 py-3.5 text-xs sm:text-sm text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.entityName}
                          </td>

                          {/* 7. Business Entity */}
                          <td
                            dir="auto"
                            className="px-3.5 py-3.5 text-xs sm:text-sm text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.businessEntity}
                          </td>

                          {/* 8. Date Expiry */}
                          <td
                            dir="ltr"
                            className="px-3.5 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.dateExpiry}
                          </td>

                          {/* 9. Days Left */}
                          <td
                            dir="ltr"
                            className="px-3.5 py-3.5 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937] whitespace-nowrap"
                          >
                            {doc.daysLeft}
                          </td>

                          {/* 10. Status */}
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            <span
                              dir="ltr"
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#16A34A]/25 bg-[#16A34A]/10 text-[#16A34A] text-xs font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{doc.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={documentsColumnHeaders.length}
                          className="px-4 py-10 text-center"
                        >
                          <div className="space-y-2 max-w-md mx-auto">
                            <p className="text-sm font-semibold text-[#1F2937]">
                              {t(
                                'No matching documents found',
                                'لم يتم العثور على مستندات مطابقة'
                              )}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {t(
                                `No document records matched "${documentsQuery}".`,
                                `لا توجد سجلات مستندات تطابق "${documentsQuery}".`
                              )}
                            </p>
                            {documentsQuery.trim().length > 0 && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDocumentsInput('');
                                    setDocumentsQuery('');
                                    setDocumentsPage(1);
                                  }}
                                  className="px-3 py-1.5 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#1A7373] hover:bg-[#F1F5F9] transition-colors"
                                >
                                  {t('Reset Search', 'إعادة ضبط البحث')}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Documents Pagination Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="documents-page-size-select"
                    className="text-xs text-[#64748B]"
                  >
                    {t('Rows per page:', 'عدد الصفوف في الصفحة:')}
                  </label>
                  <select
                    id="documents-page-size-select"
                    dir="ltr"
                    value={documentsPageSize}
                    onChange={(e) => {
                      setDocumentsPageSize(Number(e.target.value));
                      setDocumentsPage(1);
                    }}
                    className="h-8 px-2.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] font-mono text-xs font-semibold text-[#1F2937] tabular-nums focus:outline-none focus:border-[#37848C]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={safeDocumentsPage <= 1}
                    onClick={() =>
                      setDocumentsPage((prev) => Math.max(1, prev - 1))
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#E5E7EB] text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                  >
                    {isRtl ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                    <span>{t('Previous', 'السابق')}</span>
                  </button>

                  <span
                    dir="ltr"
                    aria-current="page"
                    className="px-3 py-1.5 rounded-md border border-[#37848C]/40 bg-[#37848C]/10 font-mono text-xs font-bold text-[#1A7373] tabular-nums"
                  >
                    {safeDocumentsPage}
                  </span>

                  <button
                    type="button"
                    disabled={safeDocumentsPage >= documentsTotalPages}
                    onClick={() =>
                      setDocumentsPage((prev) =>
                        Math.min(documentsTotalPages, prev + 1)
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#E5E7EB] text-xs font-medium text-[#1F2937] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t('Next', 'التالي')}</span>
                    {isRtl ? (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: EMPLOYEES (Structured 7-Column Table + Empty State)
             ========================================================= */}
          {activeTab === 'employees' && (
            <div
              id="business-data-tabpanel-employees"
              role="tabpanel"
              aria-labelledby="business-data-tab-employees"
              className="space-y-5"
            >
              {/* Employees Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]">
                    {t('Employees', 'الموظفون')}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {t(
                      'Registered personnel and workforce records linked to this entity.',
                      'سجلات الموظفين والقوى العاملة المرتبطة بهذه المنشأة.'
                    )}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmployeesQuery(employeesInput);
                  }}
                  role="search"
                  aria-label={t('Search employees', 'البحث في الموظفين')}
                  className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1 sm:w-72 md:w-80">
                    <label htmlFor="employees-tab-search" className="sr-only">
                      {t(
                        pageData.employeesSearchPlaceholder,
                        'البحث في الموظفين...'
                      )}
                    </label>
                    <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="employees-tab-search"
                      type="text"
                      value={employeesInput}
                      onChange={(e) => {
                        setEmployeesInput(e.target.value);
                        setEmployeesQuery(e.target.value);
                      }}
                      placeholder={t(
                        pageData.employeesSearchPlaceholder,
                        'البحث في الموظفين...'
                      )}
                      className="w-full h-9 ps-9 pe-8 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
                    />
                    {employeesInput.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmployeesInput('');
                          setEmployeesQuery('');
                        }}
                        aria-label={t('Clear employees search', 'مسح البحث')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64748B] hover:text-[#1F2937] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  >
                    {t('Search', 'بحث')}
                  </button>
                </form>
              </div>

              {/* 7-Column Employees Table */}
              <div className="rounded-lg border border-[#E5E7EB] overflow-x-auto">
                <table className="w-full text-start border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                      {employeesColumnHeaders.map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-4 py-3 text-start text-xs font-semibold text-[#64748B] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {filteredEmployeeRecords.length > 0 ? (
                      filteredEmployeeRecords.map((emp) => (
                        <tr key={emp.id}>
                          <td className="px-4 py-3 text-xs sm:text-sm font-medium text-[#1F2937]">
                            {emp.employeeName}
                          </td>
                          <td
                            dir="ltr"
                            className="px-4 py-3 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937]"
                          >
                            {emp.phoneNumber}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {emp.jobTitle}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {emp.gender}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {emp.citizenship}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {emp.nationality}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {emp.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={employeesColumnHeaders.length}
                          className="px-4 py-10 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-6 h-6 text-[#37848C] opacity-80" />
                            <p className="text-sm font-semibold text-[#1F2937]">
                              {t(
                                'No employees found',
                                'لم يتم العثور على موظفين'
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: ASSETS (Structured 8-Column Table + Empty State)
             ========================================================= */}
          {activeTab === 'assets' && (
            <div
              id="business-data-tabpanel-assets"
              role="tabpanel"
              aria-labelledby="business-data-tab-assets"
              className="space-y-5"
            >
              {/* Assets Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]">
                    {t('Assets', 'الأصول')}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {t(
                      'Company vehicles, hardware, and operational assets inventory.',
                      'سجل مركبات المنشأة والأجهزة والأصول التشغيلية.'
                    )}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAssetsQuery(assetsInput);
                  }}
                  role="search"
                  aria-label={t('Search assets', 'البحث في الأصول')}
                  className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1 sm:w-72 md:w-80">
                    <label htmlFor="assets-tab-search" className="sr-only">
                      {t(
                        pageData.assetsSearchPlaceholder,
                        'البحث في الأصول...'
                      )}
                    </label>
                    <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="assets-tab-search"
                      type="text"
                      value={assetsInput}
                      onChange={(e) => {
                        setAssetsInput(e.target.value);
                        setAssetsQuery(e.target.value);
                      }}
                      placeholder={t(
                        pageData.assetsSearchPlaceholder,
                        'البحث في الأصول...'
                      )}
                      className="w-full h-9 ps-9 pe-8 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:border-[#37848C] transition-colors"
                    />
                    {assetsInput.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setAssetsInput('');
                          setAssetsQuery('');
                        }}
                        aria-label={t('Clear assets search', 'مسح البحث')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64748B] hover:text-[#1F2937] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
                  >
                    {t('Search', 'بحث')}
                  </button>
                </form>
              </div>

              {/* 8-Column Assets Table */}
              <div className="rounded-lg border border-[#E5E7EB] overflow-x-auto">
                <table className="w-full text-start border-collapse min-w-[820px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                      {assetsColumnHeaders.map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-4 py-3 text-start text-xs font-semibold text-[#64748B] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {filteredAssetRecords.length > 0 ? (
                      filteredAssetRecords.map((asset) => (
                        <tr key={asset.id}>
                          <td
                            dir="ltr"
                            className="px-4 py-3 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937]"
                          >
                            {asset.assetCode}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm font-medium text-[#1F2937]">
                            {asset.assetName}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {asset.assetCategory}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {asset.assignedTo}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {asset.department}
                          </td>
                          <td
                            dir="ltr"
                            className="px-4 py-3 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937]"
                          >
                            {asset.serialNumber}
                          </td>
                          <td
                            dir="ltr"
                            className="px-4 py-3 text-xs sm:text-sm font-mono tabular-nums text-[#1F2937]"
                          >
                            {asset.assignedDate}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-[#1F2937]">
                            {asset.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={assetsColumnHeaders.length}
                          className="px-4 py-10 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package className="w-6 h-6 text-[#37848C] opacity-80" />
                            <p className="text-sm font-semibold text-[#1F2937]">
                              {t('No assets found', 'لم يتم العثور على أصول')}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Read-Only View Details Modal for Business Tab Cards & Documents Tab Table Rows */}
      <BusinessDocumentDetailsModal
        record={selectedRecordForModal}
        structuredDocument={selectedStructuredDocForModal}
        onClose={() => {
          setSelectedRecordForModal(null);
          setSelectedStructuredDocForModal(null);
        }}
      />
    </div>
  );
};
