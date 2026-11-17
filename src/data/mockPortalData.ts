import {
  AccountsPageData,
  BusinessActivitiesPageData,
  BusinessDataPageData,
  GovernmentServicesPageData,
  MediaPageData,
  PortalDashboardData,
  SubscriptionIncludedServiceItem,
  SubscriptionsPageData,
  TicketsPageData,
  TrackRequestsPageData,
} from '../types/portal';

/**
 * Centralized mock data layer for Phase 1 of the AWN Client Portal.
 * All supplied timestamps, IDs, Arabic titles, counts, and amounts are preserved
 * verbatim without fabricating relationships or silently altering source values.
 */
export const MOCK_PORTAL_DASHBOARD_DATA: PortalDashboardData = {
  user: {
    id: 'USR-WAGDI-01',
    fullName: 'Wagdi Owner zakzouk',
    firstName: 'Wagdi Owner',
    firstNameAr: '',
    lastName: 'zakzouk',
    lastNameAr: '',
    gender: 'Male',
    personalEmail: '',
    email: 'yomeb69388@dreameg.com',
    phoneNumber: '0550731158',
    nationality: 'Egypt',
    profilePhotoUrl: null,
    roleLabel: 'Account Owner (Mock Profile)',
    companyName: 'Wagdi Company',
    lastLoginTimestamp: '2026-10-25T23:13:52.667Z',
  },
  companies: [
    {
      id: 'COMP-WAGDI-01',
      name: 'Wagdi Company',
      nameAr: 'Wagdi Company',
      registrationLabel: 'Primary Entity · Mock Context',
      isDefault: true,
    },
  ],
  headerCounts: {
    notifications: 0,
    cartItems: 1,
    pendingTasks: 4,
  },
  kpis: [
    {
      id: 'businesses',
      labelEn: 'Total Businesses',
      labelAr: 'إجمالي المنشآت',
      formattedValue: '01',
      sourceNoteEn: 'Mock value · Wagdi Company entity',
      sourceNoteAr: 'قيمة تجريبية · منشأة Wagdi Company',
      isMockSample: true,
    },
    {
      id: 'employees',
      labelEn: 'Employees',
      labelAr: 'الموظفون',
      formattedValue: '00',
      sourceNoteEn: 'Mock value · Pending backend sync',
      sourceNoteAr: 'قيمة تجريبية · بانتظار ربط النظام',
      isMockSample: true,
    },
    {
      id: 'assets',
      labelEn: 'Assets',
      labelAr: 'الأصول',
      formattedValue: '00',
      sourceNoteEn: 'Mock value · Pending backend sync',
      sourceNoteAr: 'قيمة تجريبية · بانتظار ربط النظام',
      isMockSample: true,
    },
    {
      id: 'documents',
      labelEn: 'Documents',
      labelAr: 'المستندات',
      formattedValue: '01',
      sourceNoteEn: 'Mock value · Preserved from source snapshot',
      sourceNoteAr: 'قيمة تجريبية · محفوظة من البيانات المصدرية',
      isMockSample: true,
    },
  ],
  subscription: {
    planName: 'ادارة السجل التجاري باقة عادية',
    companyContext: 'Wagdi Company',
    nextBillingAmount: 'SAR 350',
    subscriptionStatus: 'Expired',
    paymentStatusEn: 'Pending Renewal (Mock State)',
    paymentStatusAr: 'بانتظار التجديد (حالة تجريبية)',
    renewalDate: '08/09/2025',
    nextBillingDate: '08/10/2025',
    dateConsistencyNoteEn:
      'Dates and amounts are preserved verbatim from supplied mock source data.',
    dateConsistencyNoteAr:
      'تم الاحتفاظ بالتواريخ والمبالغ كما وردت في البيانات المصدرية التجريبية دون تعديل.',
    monthlyHistory: [
      {
        id: 'M1',
        periodLabelEn: 'Month 01 (Sample)',
        periodLabelAr: 'شهر 01 (عينة)',
        amountSar: 1000,
        isSampleMetric: true,
      },
      {
        id: 'M2',
        periodLabelEn: 'Month 02 (Sample)',
        periodLabelAr: 'شهر 02 (عينة)',
        amountSar: 750,
        isSampleMetric: true,
      },
      {
        id: 'M3',
        periodLabelEn: 'Month 03 (Sample)',
        periodLabelAr: 'شهر 03 (عينة)',
        amountSar: 500,
        isSampleMetric: true,
      },
      {
        id: 'M4',
        periodLabelEn: 'Month 04 (Sample)',
        periodLabelAr: 'شهر 04 (عينة)',
        amountSar: 250,
        isSampleMetric: true,
      },
    ],
  },
  renewalAlerts: {
    requestIds: ['REQ418', 'REQ423', 'REQ459', 'REQ464', 'REQ465'],
    documentIds: ['DOC011', 'DOC036', 'DOC045', 'DOC046'],
    knownDocumentTitles: [
      'سجل تجاري المنشآت',
      'اشتراك التأمينات الاجتماعية للمنشآت',
    ],
    suppliedDueDates: [
      '17 September 2026',
      '20 November 2026',
      '22 September 2026',
    ],
    sampleAlertRows: [
      {
        id: 'ROW-1',
        requestId: 'REQ418',
        documentId: 'DOC011',
        documentTitle: 'سجل تجاري المنشآت',
        dueDateDisplay: '17 September 2026',
        priority: 'High',
        scheduleState: 'upcoming_sample',
        scheduleLabelEn: 'Scheduled Renewal (Sample Date)',
        scheduleLabelAr: 'موعد تجديد مجدول (تاريخ تجريبي)',
        associationStatusEn: 'Sample pairing · Unverified OCR source link',
        associationStatusAr: 'اقتران تجريبي · بيانات مصدرية غير مكتملة',
      },
      {
        id: 'ROW-2',
        requestId: 'REQ423',
        documentId: 'DOC036',
        documentTitle: 'اشتراك التأمينات الاجتماعية للمنشآت',
        dueDateDisplay: '20 November 2026',
        priority: 'High',
        scheduleState: 'upcoming_sample',
        scheduleLabelEn: 'Scheduled Renewal (Sample Date)',
        scheduleLabelAr: 'موعد تجديد مجدول (تاريخ تجريبي)',
        associationStatusEn: 'Sample pairing · Unverified OCR source link',
        associationStatusAr: 'اقتران تجريبي · بيانات مصدرية غير مكتملة',
      },
      {
        id: 'ROW-3',
        requestId: 'REQ459',
        documentId: 'DOC045',
        documentTitle: 'سجل تجاري المنشآت (Sample Reference)',
        dueDateDisplay: '22 September 2026',
        priority: 'High',
        scheduleState: 'upcoming_sample',
        scheduleLabelEn: 'Scheduled Renewal (Sample Date)',
        scheduleLabelAr: 'موعد تجديد مجدول (تاريخ تجريبي)',
        associationStatusEn: 'Sample pairing · Title/date mapping incomplete',
        associationStatusAr: 'اقتران تجريبي · ربط العنوان والتاريخ غير مكتمل',
      },
      {
        id: 'ROW-4',
        requestId: 'REQ464',
        documentId: 'DOC046',
        documentTitle: 'اشتراك التأمينات الاجتماعية للمنشآت (Sample Reference)',
        dueDateDisplay: 'Due date not linked in source',
        priority: 'High',
        scheduleState: 'unlinked_date',
        scheduleLabelEn: 'Date Unlinked in Source',
        scheduleLabelAr: 'التاريخ غير مرتبط في المصدر',
        associationStatusEn: 'Incomplete source record · Awaiting API mapping',
        associationStatusAr: 'سجل مصدري غير مكتمل · بانتظار ربط الواجهة البرمجية',
      },
      {
        id: 'ROW-5',
        requestId: 'REQ465',
        documentId: 'Unassigned in source',
        documentTitle: 'Document title not linked in source',
        dueDateDisplay: 'Due date not linked in source',
        priority: 'High',
        scheduleState: 'unlinked_date',
        scheduleLabelEn: 'Date & Doc Unlinked in Source',
        scheduleLabelAr: 'المستند والتاريخ غير مرتبطين في المصدر',
        associationStatusEn: 'Request ID preserved · Missing document & date link',
        associationStatusAr: 'معرف الطلب محفوظ · المستند والتاريخ غير مرتبطين',
      },
    ],
  },
  documentsAnalytics: {
    businessDocumentsCount: '01',
    employeeDocumentsCount: '00',
    assetDocumentsCount: '00',
    totalDocumentsCount: '01',
    expiringWithin30DaysCount: '11',
    expiredDocumentsCount: '28',
    availableDateRanges: [
      {
        id: 'source-snapshot',
        labelEn: 'Supplied Source Snapshot (Default)',
        labelAr: 'اللقطة المصدرية المزودة (الافتراضي)',
      },
      {
        id: 'last-30-days',
        labelEn: 'Last 30 Days (Preview Range)',
        labelAr: 'آخر 30 يوماً (نطاق معاينة)',
      },
      {
        id: 'q4-2026',
        labelEn: 'Q4 2026 (Preview Range)',
        labelAr: 'الربع الرابع 2026 (نطاق معاينة)',
      },
      {
        id: 'full-year-2026',
        labelEn: 'Full Year 2026 (Preview Range)',
        labelAr: 'كامل عام 2026 (نطاق معاينة)',
      },
    ],
  },
  newsTopics: [
    {
      id: 'topic-employee-compliance',
      topicTitle: 'Employee Compliances Services',
      topicTitleAr: 'خدمات امتثال الموظفين (Employee Compliances Services)',
      placeholderNoteEn:
        'Sample topic card. Headline, article body, publication date, and author metadata are intentionally omitted until official editorial content is supplied.',
      placeholderNoteAr:
        'بطاقة موضوع تجريبية. تم عدم اختلاق العنوان الفرعي أو نص المقال أو تاريخ النشر لحين تزويد المحتوى الرسمي.',
      statusLabelEn: 'Sample Topic Placeholder',
      statusLabelAr: 'عنصر نائب لموضوع تجريبي',
    },
    {
      id: 'topic-customer-opinions',
      topicTitle: 'customer opinions/testimonials',
      topicTitleAr: 'آراء وتجارب العملاء (customer opinions/testimonials)',
      placeholderNoteEn:
        'Sample topic card. Customer quotes, attributions, and dates are withheld until verified source records are provided.',
      placeholderNoteAr:
        'بطاقة موضوع تجريبية. لم تتم إضافة اقتباسات أو أسماء عملاء لحين تزويد البيانات الرسمية المعتمدة.',
      statusLabelEn: 'Sample Topic Placeholder',
      statusLabelAr: 'عنصر نائب لموضوع تجريبي',
    },
  ],
};

/**
 * Centralized mock data for Phase 2: Government Services.
 * Preserves the supplied Subscribed count ("00"), All AWN Services source count ("01"),
 * category selector counts ("0", "0", "0"), catalog heading counts (1, 2, 1),
 * and the exact four service catalog records without inventing missing IDs, codes,
 * statuses, or timestamps.
 */
export const MOCK_GOVERNMENT_SERVICES_DATA: GovernmentServicesPageData = {
  pageTitleEn: 'Government Services',
  pageTitleAr: 'الخدمات الحكومية',
  descriptionEn:
    'Manage your teams, track subscriptions, support customers, and drive productivity - all from one central place.',
  descriptionAr:
    'إدارة فرق العمل، متابعة الاشتراكات، دعم العملاء، وتعزيز الإنتاجية — كل ذلك من مكان مركزي واحد.',
  subscribedCount: '00',
  allAwnServicesSourceCount: '01',
  sourceCountDiscrepancyNoteEn:
    'Source summary counts (Subscribed: 00, All AWN Services: 01, Category selectors: 0) are preserved separately from the 4 cataloged service records (1 Business, 2 Employee, 1 Assets).',
  sourceCountDiscrepancyNoteAr:
    'تم الاحتفاظ بأعداد الملخص المصدرية (المشترك بها: 00، جميع خدمات AWN: 01، محددات الفئات: 0) بشكل منفصل عن سجلات الدليل الأربعة (1 أعمال، 2 موظفين، 1 أصول).',
  categories: [
    {
      id: 'business',
      labelEn: 'Business Services',
      labelAr: 'خدمات الأعمال',
      suppliedSelectorCount: '0',
      catalogHeadingCount: 1,
    },
    {
      id: 'employee',
      labelEn: 'Employee Services',
      labelAr: 'خدمات الموظفين',
      suppliedSelectorCount: '0',
      catalogHeadingCount: 2,
    },
    {
      id: 'assets',
      labelEn: 'Assets Services',
      labelAr: 'خدمات الأصول',
      suppliedSelectorCount: '0',
      catalogHeadingCount: 1,
    },
  ],
  services: [
    {
      catalogKey: 'SVC-BUS-01',
      serviceName: 'Business OnBoarding',
      description:
        'Handles the end-to-end onboarding process of new businesses',
      category: 'Business Services',
      categoryId: 'business',
      isSubscribed: false,
    },
    {
      catalogKey: 'SVC-EMP-01',
      serviceName: 'إنهاء عقد عمل الموظف',
      description:
        'خدمة تُمكّن المنشأة أو الموظف من إنهاء عقد العمل المسجل في منصة قوى سواء بانتهاء المدة أو الإنهاء المبكر، مع توثيق حالة العقد في النظام بما يتوافق مع نظام العمل',
      category: 'Employee Services',
      categoryId: 'employee',
      isSubscribed: false,
    },
    {
      catalogKey: 'SVC-EMP-02',
      serviceName: 'Employee OnBoarding',
      description: 'Manages the recruitment and onboarding of employees',
      category: 'Employee Services',
      categoryId: 'employee',
      isSubscribed: false,
    },
    {
      catalogKey: 'SVC-AST-01',
      serviceName: 'Asset OnBoarding',
      serviceCode: 'SGR003',
      description:
        'Facilitates the registration and tracking of physical or digital assets',
      category: 'Assets Services',
      categoryId: 'assets',
      isSubscribed: false,
      status: 'Active',
      boardingType: 'asset',
    },
  ],
};

/**
 * Deduplicated list of the five supplied included service entries per demo package.
 */
const DEMO_PACKAGE_INCLUDED_SERVICES: SubscriptionIncludedServiceItem[] = [
  {
    id: 'INC-SVC-01',
    serviceTitle: 'this is for high cost of CR',
    languageHint: 'en',
  },
  {
    id: 'INC-SVC-02',
    serviceTitle: 'Business OnBoarding',
    languageHint: 'en',
  },
  {
    id: 'INC-SVC-03',
    serviceTitle: 'اشتراك الشركة في مقيم',
    languageHint: 'ar',
  },
  {
    id: 'INC-SVC-04',
    serviceTitle: 'إصدار الترخيص الصناعي',
    languageHint: 'ar',
  },
  {
    id: 'INC-SVC-05',
    serviceTitle: 'إصدار ترخيص الدفاع المدني سلامة',
    languageHint: 'ar',
  },
];

/**
 * Centralized mock data for the Subscriptions page (/subscriptions).
 * Preserves the two supplied demo package entries verbatim without inventing
 * real subscription IDs, renewal dates, billing transactions, or undocumented service groups.
 */
export const MOCK_SUBSCRIPTIONS_PAGE_DATA: SubscriptionsPageData = {
  pageTitleEn: 'Subscriptions',
  pageTitleAr: 'الاشتراكات (Subscriptions)',
  pageDescriptionEn:
    'View and manage all details related to your business in one place. Stay updated on your profile, registrations, subscriptions, and more.',
  pageDescriptionAr:
    'عرض وإدارة جميع التفاصيل المتعلقة بمنشأتك في مكان واحد. ابقَ على اطلاع بملفك التعريفي والتسجيلات والاشتراكات والمزيد.',
  sectionTitleEn: 'Your Subscription Packages',
  sectionTitleAr: 'باقات الاشتراك الخاصة بك (Your Subscription Packages)',
  sectionDescriptionEn:
    'View and manage your current subscription plans. Check features, validity, and upgrade options to get the most out of your services.',
  sectionDescriptionAr:
    'عرض وإدارة خطط الاشتراك الحالية الخاصة بك. تحقق من المزايا والصلاحية وخيارات الترقية لتحقيق أقصى استفادة من خدماتك.',
  packages: [
    {
      mockId: 'DEMO-SUB-PKG-01',
      instanceOrder: 1,
      packageName: 'ادارة السجل التجاري باقة عادية',
      status: 'Expired',
      priceDisplay: '350 SAR',
      durationDisplay: '1 Month',
      includedServicesHeading: 'Include Services',
      includedServices: DEMO_PACKAGE_INCLUDED_SERVICES,
      isDemoRecord: true,
    },
    {
      mockId: 'DEMO-SUB-PKG-02',
      instanceOrder: 2,
      packageName: 'ادارة السجل التجاري باقة عادية',
      status: 'Expired',
      priceDisplay: '350 SAR',
      durationDisplay: '1 Month',
      includedServicesHeading: 'Include Services',
      includedServices: DEMO_PACKAGE_INCLUDED_SERVICES,
      isDemoRecord: true,
    },
  ],
  preservedEmptyGroupPhrase: 'No services in this group',
  dataIntegrityNoteEn:
    'Demo dataset only. The two supplied package records and their five included services are rendered verbatim awaiting live backend subscription API integration.',
  dataIntegrityNoteAr:
    'بيانات عرض تجريبية فقط. يتم عرض سجلّي الباقة المزودين والخدمات الخمس المتضمنة كما وردت في المصدر لحين الربط مع الواجهة البرمجية للاشتراكات.',
};

/**
 * Centralized mock data for the Business Data page (/business-data).
 * Separates Business records, the structured Documents table record (DOC011),
 * Employees (empty), and Assets (empty) without fabricating unprovided records.
 */
export const MOCK_BUSINESS_DATA_PAGE_DATA: BusinessDataPageData = {
  eyebrowEn: 'MY BUSINESS',
  eyebrowAr: 'أعمالي · MY BUSINESS',
  pageTitleEn: 'Business Data',
  pageTitleAr: 'بيانات المنشأة (Business Data)',
  pageDescriptionEn:
    'View and manage all details related to your business in one place. Stay updated on your profile, registrations, subscriptions, and more.',
  pageDescriptionAr:
    'عرض وإدارة جميع التفاصيل المتعلقة بمنشأتك في مكان واحد. ابقَ على اطلاع بملفك التعريفي والتسجيلات والاشتراكات والمزيد.',
  businessSectionTitleEn: 'Business Registrations & Services',
  businessSectionTitleAr: 'تسجيلات وخدمات المنشأة',
  businessSectionSubtitleEn:
    'Review your business registrations and related service records.',
  businessSectionSubtitleAr:
    'راجع تسجيلات منشأتك وسجلات الخدمات المرتبطة بها.',
  businessSearchPlaceholder: 'Search businesses ...',
  documentsSearchPlaceholder: 'Search documents ...',
  employeesSearchPlaceholder: 'Search employees ...',
  assetsSearchPlaceholder: 'Search assets ...',
  businessRecords: [
    {
      recordKey: 'BDOC-01',
      name: 'CR Registration',
      status: 'Active',
      idNumber: 'DOC011',
      expiryDate: '20/11/2026',
    },
    {
      recordKey: 'BDOC-02',
      name: 'Muqeem',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
    {
      recordKey: 'BDOC-03',
      name: 'Mudad',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
    {
      recordKey: 'BDOC-04',
      name: 'Absher',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
    {
      recordKey: 'BDOC-05',
      name: 'GOSI',
      status: 'Expired',
      idNumber: 'DOC047',
      expiryDate: '22/09/2026',
    },
    {
      recordKey: 'BDOC-06',
      name: 'Ministry of Investment',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
    {
      recordKey: 'BDOC-07',
      name: 'QIWA',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
    {
      recordKey: 'BDOC-08',
      name: 'SPL',
      idNumber: 'N/A',
      expiryDate: 'N/A',
    },
  ],
  documentRecords: [
    {
      id: 'DOC-ROW-01',
      documentCode: 'DOC011',
      documentRelatedTo: 'Company',
      documentName: 'Wagdi Company-Commercial Registration',
      documentType: 'سجل تجارى المنشات',
      documentCategory: 'منشات',
      entityName: 'Wagdi Company',
      businessEntity: 'Wagdi Company',
      dateExpiry: '2026-11-20',
      daysLeft: '25 days',
      status: 'Active',
    },
  ],
  employeeRecords: [],
  assetRecords: [],
};

/**
 * Centralized mock data for the Business Activities page (/business-activities).
 * Preserves the Pending To-dos (0) summary, Completed To-dos (13) summary, and the
 * exact 10 supplied completed records without fabricating the 3 unprovided records.
 */
export const MOCK_BUSINESS_ACTIVITIES_PAGE_DATA: BusinessActivitiesPageData = {
  eyebrowEn: 'MY BUSINESS',
  eyebrowAr: 'أعمالي · MY BUSINESS',
  pageTitleEn: 'Business Activities',
  pageTitleAr: 'الأنشطة التجارية (Business Activities)',
  pageDescriptionEn:
    'View and manage all details related to your business in one place. Stay updated on your profile, registrations, subscriptions, and more.',
  pageDescriptionAr:
    'عرض وإدارة جميع التفاصيل المتعلقة بمنشأتك في مكان واحد. ابقَ على اطلاع بملفك التعريفي والتسجيلات والاشتراكات والمزيد.',
  pendingSummaryCount: 0,
  completedSummaryCount: 13,
  delegationsSummaryCount: 0,
  searchPlaceholder: 'Search',
  pendingEmptyStateText: 'No items found',
  delegationsEmptyStateText: 'No delegations found',
  remindersEmptyStateText: 'No reminders found',
  pendingTodos: [],
  completedTodos: [
    {
      id: 'TODO-COMP-01',
      todoCode: 'REQ468',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '21-09-2026',
    },
    {
      id: 'TODO-COMP-02',
      todoCode: 'REQ465',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '21-09-2026',
    },
    {
      id: 'TODO-COMP-03',
      todoCode: 'REQ464',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '21-09-2026',
    },
    {
      id: 'TODO-COMP-04',
      todoCode: 'REQ459',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '21-09-2026',
    },
    {
      id: 'TODO-COMP-05',
      todoCode: 'REQ458',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '20-09-2026',
    },
    {
      id: 'TODO-COMP-06',
      todoCode: 'REQ447',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '16-09-2026',
    },
    {
      id: 'TODO-COMP-07',
      todoCode: 'REQ446',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '16-09-2026',
    },
    {
      id: 'TODO-COMP-08',
      todoCode: 'REQ445',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '16-09-2026',
    },
    {
      id: 'TODO-COMP-09',
      todoCode: 'REQ442',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '16-09-2026',
    },
    {
      id: 'TODO-COMP-10',
      todoCode: 'REQ438',
      requestTitle:
        'Wagdi Company-GOSI Subscription (اشتراك التامينات الاجتماعية للمنشات) Renewal Required',
      priority: 'High',
      dueDate: '16-09-2026',
    },
  ],
  delegationRecords: [],
  reminderRecords: [],
  preservedTruncatedSourceNote: 'The اشتراك التامينات...',
  pageSizeOptions: [10, 20, 30, 50, 100, 500],
};

/**
 * Centralized mock data for the Accounts page (/accounts).
 * Preserves the exact supplied Quotation (AWNQUO056), Contract (AWNCONT050),
 * original incomplete OCR date strings ("12026/10/", "82026/9/", "82025/10/"),
 * and empty Invoices (0) without fabricating missing dates or records.
 */
export const MOCK_ACCOUNTS_PAGE_DATA: AccountsPageData = {
  eyebrowEn: 'MY BUSINESS',
  eyebrowAr: 'أعمالي · MY BUSINESS',
  pageTitleEn: 'Accounts',
  pageTitleAr: 'الحسابات (Accounts)',
  pageSubtitleEn:
    'Manage your quotations, contracts, and invoices in one place.',
  pageSubtitleAr: 'إدارة عروض الأسعار والعقود والفواتير الخاصة بك في مكان واحد.',
  quotationsSummaryCount: 1,
  contractsSummaryCount: 1,
  invoicesSummaryCount: 0,
  quotationsSearchPlaceholder: 'Search quotations ...',
  contractsSearchPlaceholder: 'Search contracts ...',
  invoicesSearchPlaceholder: 'Search invoices ...',
  invoicesEmptyStateText: 'No data available',
  quotations: [
    {
      id: 'QUO-ROW-01',
      quotationCode: 'AWNQUO056',
      amount: '402.50 SAR',
      subscriptions: 'ادارة السجل التجاري باقة عادية',
      quotationDate: '12026/10/',
    },
  ],
  contracts: [
    {
      id: 'CONT-ROW-01',
      contractCode: 'AWNCONT050',
      emailAddress: 'karlm.wagdi@awn.sa',
      contactNumber: '+966550731158',
      startDate: '82026/9/',
      endDate: '82025/10/',
      contractTerm: '6 months',
    },
  ],
  invoices: [],
  pageSizeOptions: [10, 20, 30, 50, 100],
};

/**
 * Centralized mock data for the Media page (/media).
 * Preserves the exact supplied featured heading, scheduled maintenance announcement,
 * and empty FAQs dataset without fabricating extra articles, FAQs, or metadata.
 */
export const MOCK_MEDIA_PAGE_DATA: MediaPageData = {
  eyebrowEn: 'AWN MEDIA CENTER',
  eyebrowAr: 'المركز الإعلامي · AWN MEDIA CENTER',
  pageTitleEn: 'Media',
  pageTitleAr: 'المركز الإعلامي (Media)',
  pageDescriptionEn:
    'Stay informed with the latest news, announcements, and frequently asked questions. Access important updates and find answers to common queries.',
  pageDescriptionAr:
    'ابقَ على اطلاع بأحدث الأخبار والإعلانات والأسئلة الشائعة. اطّلع على التحديثات المهمة واعثر على إجابات للاستفسارات المتكررة.',
  faqsTabLabelEn: 'FAQS',
  faqsTabLabelAr: 'FAQS',
  newsTabLabelEn: 'News & Announcements',
  newsTabLabelAr: 'News & Announcements',
  faqsSearchPlaceholder: 'Search ...',
  faqsEmptyStateText: 'No FAQs found',
  featuredContentTitle: 'Unlock the Full Potential of Your Business with AWN',
  announcements: [
    {
      id: 'MEDIA-ANN-01',
      title: 'AWN Platform Maintenance Scheduled',
      publishedAt: '18-10-2025, 02:00 AM',
      excerpt:
        'AWN will undergo scheduled platform maintenance on 18th October 2025 at 02:00 AM. During this period, all system functionalities may be temporarily unavailable.',
      body: 'AWN will undergo scheduled platform maintenance on 18th October 2025 at 02:00 AM. During this period, all system functionalities may be temporarily unavailable. This maintenance is part of our ongoing efforts to enhance system performance, improve security, and deploy new features. Regular updates will be provided on the AWN dashboard and through email notifications. We apologize for any inconvenience and appreciate your understanding as we work to improve your experience.',
    },
  ],
  faqs: [],
};

/**
 * Centralized mock data for the Track Requests page (/track-requests).
 * Preserves the exact three Pending records (including UUID serviceType on REQ439-1),
 * Completed (0), and Rejected (0) without fabricating extra request stages, owners, or actions.
 */
export const MOCK_TRACK_REQUESTS_PAGE_DATA: TrackRequestsPageData = {
  eyebrowEn: 'REQUEST MANAGEMENT',
  eyebrowAr: 'متابعة الطلبات · REQUEST MANAGEMENT',
  pageTitleEn: 'Track Requests',
  pageTitleAr: 'متابعة الطلبات (Track Requests)',
  pageDescriptionEn:
    'Track all of your requests in one place - whether pending, in progress, or completed. Easily view the stages and current status of every request.',
  pageDescriptionAr:
    'تابع جميع طلباتك في مكان واحد — سواء كانت قيد الانتظار أو قيد التنفيذ أو مكتملة. اطّلع بسهولة على مراحل وحالة كل طلب.',
  searchPlaceholder: 'Search by ID ...',
  pendingSectionHeading: 'Pending Request (3)',
  completedSectionHeading: 'Completed Request (0)',
  rejectedSectionHeading: 'Rejected Requests (0)',
  pendingEmptyStateText: 'No pending requests found',
  completedEmptyStateText: 'No completed requests found',
  rejectedEmptyStateText: 'No rejected requests found',
  pendingRequests: [
    {
      id: 'TRK-REQ-01',
      code: 'REQ439-1',
      service: 'تحديث بيانات المنشأة في التأمينات الاجتماعية',
      serviceType: '6775e5d0-21d0-11f1-bf0e-23caeb22a189',
      requestedDate: '16/09/2026',
      pendingWith: 'Assigned',
      actionRequired:
        'Sub-request has been created for the Wagdi Company-GOSI Subscription (اشتراك التأمينات الاجتماعية للمنشآت) Renewal Required onboarding.',
    },
    {
      id: 'TRK-REQ-02',
      code: 'REQ400',
      service: 'Business - Business OnBoarding',
      serviceType: 'Business',
      requestedDate: '14/09/2026',
      pendingWith: 'Assigned',
      actionRequired: 'Review Required',
    },
    {
      id: 'TRK-REQ-03',
      code: 'REQ393',
      service: 'Business - Business OnBoarding',
      serviceType: 'Business',
      requestedDate: '13/09/2026',
      pendingWith: 'Assigned',
      actionRequired: 'Review Required',
    },
  ],
  completedRequests: [],
  rejectedRequests: [],
  pageSize: 10,
};

/**
 * Centralized mock data for Help -> Tickets (/tickets).
 * Starts with 0 initial ticket records ("No data available") and preserves
 * the exact Ticket Type and Priority options without fabricating backend tickets.
 */
export const MOCK_TICKETS_PAGE_DATA: TicketsPageData = {
  eyebrowEn: 'HELP & SUPPORT',
  eyebrowAr: 'المساعدة والدعم · HELP & SUPPORT',
  pageTitlePrefix: 'Tickets',
  pageDescriptionEn: 'Manage and track all support tickets',
  pageDescriptionAr: 'إدارة ومتابعة جميع تذاكر الدعم الفني',
  emptyStateText: 'No data available',
  ticketTypeOptions: ['Testing', 'Technical Support'],
  priorityOptions: ['High', 'Medium', 'Low'],
  initialTickets: [],
};








