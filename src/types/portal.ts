export type Language = 'en' | 'ar';
export type ThemeMode = 'light';

export interface CompanyOption {
  id: string;
  name: string;
  nameAr: string;
  registrationLabel: string;
  isDefault?: boolean;
}

export interface PortalUserProfile {
  id: string;
  fullName: string;
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  gender: 'Male' | 'Female';
  personalEmail: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  profilePhotoUrl: string | null;
  profilePhotoName?: string;
  roleLabel: string;
  companyName: string;
  lastLoginTimestamp: string;
}

export interface KpiCardItem {
  id: 'businesses' | 'employees' | 'assets' | 'documents';
  labelEn: string;
  labelAr: string;
  formattedValue: string;
  sourceNoteEn: string;
  sourceNoteAr: string;
  isMockSample: boolean;
}

export interface MonthlyPaymentBar {
  id: string;
  periodLabelEn: string;
  periodLabelAr: string;
  amountSar: number;
  isSampleMetric: boolean;
}

export interface SubscriptionOverviewData {
  planName: string;
  companyContext: string;
  nextBillingAmount: string;
  subscriptionStatus: 'Expired';
  paymentStatusEn: string;
  paymentStatusAr: string;
  renewalDate: string;
  nextBillingDate: string;
  dateConsistencyNoteEn: string;
  dateConsistencyNoteAr: string;
  monthlyHistory: MonthlyPaymentBar[];
}

export type RenewalScheduleState = 'upcoming_sample' | 'unlinked_date';

export interface RenewalTaskItem {
  id: string;
  requestId: string;
  documentId: string;
  documentTitle: string;
  dueDateDisplay: string;
  priority: 'High';
  scheduleState: RenewalScheduleState;
  scheduleLabelEn: string;
  scheduleLabelAr: string;
  associationStatusEn: string;
  associationStatusAr: string;
}

export interface RenewalAlertCatalog {
  requestIds: string[];
  documentIds: string[];
  knownDocumentTitles: string[];
  suppliedDueDates: string[];
  sampleAlertRows: RenewalTaskItem[];
}

export type DocumentCategoryKey = 'business' | 'employee' | 'asset';

export interface DateRangeOption {
  id: string;
  labelEn: string;
  labelAr: string;
}

export interface DocumentsAnalyticsData {
  businessDocumentsCount: string;
  employeeDocumentsCount: string;
  assetDocumentsCount: string;
  totalDocumentsCount: string;
  expiringWithin30DaysCount: string;
  expiredDocumentsCount: string;
  availableDateRanges: DateRangeOption[];
}

export interface NewsAnnouncementTopic {
  id: string;
  topicTitle: string;
  topicTitleAr: string;
  placeholderNoteEn: string;
  placeholderNoteAr: string;
  statusLabelEn: string;
  statusLabelAr: string;
}

export interface HeaderSubmenuItem {
  id:
    | 'government-services-catalog'
    | 'awn-subscriptions'
    | 'business-data'
    | 'business-activities'
    | 'accounts';
  labelEn: string;
  labelAr: string;
  routePath?: string;
  isImplemented?: boolean;
}

export interface HeaderNavigationItem {
  id: 'dashboard' | 'government-services' | 'my-business' | 'media';
  labelEn: string;
  labelAr: string;
  routePath?: string;
  isActive: boolean;
  hasSubmenuIndicator: boolean;
  isImplemented: boolean;
  submenuItems?: HeaderSubmenuItem[];
}

export type GovernmentServicesTopView = 'subscribed' | 'all-awn-services';

export type GovernmentServiceCategoryId = 'business' | 'employee' | 'assets';

export type GovernmentServiceSpecificCategory =
  | 'Business Services'
  | 'Employee Services'
  | 'Assets Services';

export interface GovernmentServiceCategoryMeta {
  id: GovernmentServiceCategoryId;
  labelEn: string;
  labelAr: string;
  suppliedSelectorCount: string;
  catalogHeadingCount: number;
}

export interface GovernmentServiceRecord {
  catalogKey: string;
  serviceName: string;
  description: string;
  category: GovernmentServiceSpecificCategory;
  categoryId: GovernmentServiceCategoryId;
  isSubscribed: boolean;
  serviceCode?: string;
  status?: 'Active';
  boardingType?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GovernmentServicesPageData {
  pageTitleEn: string;
  pageTitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  subscribedCount: string;
  allAwnServicesSourceCount: string;
  sourceCountDiscrepancyNoteEn: string;
  sourceCountDiscrepancyNoteAr: string;
  categories: GovernmentServiceCategoryMeta[];
  services: GovernmentServiceRecord[];
}

export interface SubscriptionIncludedServiceItem {
  id: string;
  serviceTitle: string;
  languageHint: 'en' | 'ar';
}

export interface DemoSubscriptionPackageRecord {
  mockId: string;
  instanceOrder: 1 | 2;
  packageName: string;
  status: 'Expired';
  priceDisplay: '350 SAR';
  durationDisplay: '1 Month';
  includedServicesHeading: 'Include Services';
  includedServices: SubscriptionIncludedServiceItem[];
  isDemoRecord: true;
}

export interface SubscriptionsPageData {
  pageTitleEn: string;
  pageTitleAr: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  sectionTitleEn: string;
  sectionTitleAr: string;
  sectionDescriptionEn: string;
  sectionDescriptionAr: string;
  packages: DemoSubscriptionPackageRecord[];
  preservedEmptyGroupPhrase: 'No services in this group';
  dataIntegrityNoteEn: string;
  dataIntegrityNoteAr: string;
}

export type BusinessDataTabId =
  | 'business'
  | 'documents'
  | 'employees'
  | 'assets';

export type BusinessDocumentStatus = 'Active' | 'Expired';

export interface BusinessDocumentRecord {
  recordKey: string;
  name: string;
  status?: BusinessDocumentStatus;
  idNumber: string;
  expiryDate: string;
}

export interface StructuredDocumentRecord {
  id: string;
  documentCode: 'DOC011' | string;
  documentRelatedTo: string;
  documentName: string;
  documentType: string;
  documentCategory: string;
  entityName: string;
  businessEntity: string;
  dateExpiry: string;
  daysLeft: string;
  status: BusinessDocumentStatus;
}

export interface BusinessEmployeeRecord {
  id: string;
  employeeName: string;
  phoneNumber: string;
  jobTitle: string;
  gender: string;
  citizenship: string;
  nationality: string;
  status: string;
}

export interface BusinessAssetRecord {
  id: string;
  assetCode: string;
  assetName: string;
  assetCategory: string;
  assignedTo: string;
  department: string;
  serialNumber: string;
  assignedDate: string;
  status: string;
}

export interface BusinessDataPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitleEn: string;
  pageTitleAr: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  businessSectionTitleEn: string;
  businessSectionTitleAr: string;
  businessSectionSubtitleEn: string;
  businessSectionSubtitleAr: string;
  businessSearchPlaceholder: string;
  documentsSearchPlaceholder: string;
  employeesSearchPlaceholder: string;
  assetsSearchPlaceholder: string;
  businessRecords: BusinessDocumentRecord[];
  documentRecords: StructuredDocumentRecord[];
  employeeRecords: BusinessEmployeeRecord[];
  assetRecords: BusinessAssetRecord[];
}

export type BusinessActivitiesTabId = 'todos' | 'delegations' | 'reminders';

export type TodosSubtabId = 'pending' | 'completed';

export interface BusinessActivityTodoRecord {
  id: string;
  todoCode: string;
  requestTitle: string;
  priority: 'High';
  dueDate: string;
  description?: string;
}

export interface BusinessActivityDelegationRecord {
  id: string;
  delegationCode: string;
  delegateName: string;
  portal: string;
  role: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface BusinessActivityReminderRecord {
  id: string;
  reminderCode: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderStatus: string;
  remarks: string;
}

export interface BusinessActivitiesPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitleEn: string;
  pageTitleAr: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  pendingSummaryCount: number;
  completedSummaryCount: number;
  delegationsSummaryCount: number;
  searchPlaceholder: string;
  pendingEmptyStateText: string;
  delegationsEmptyStateText: string;
  remindersEmptyStateText: string;
  pendingTodos: BusinessActivityTodoRecord[];
  completedTodos: BusinessActivityTodoRecord[];
  delegationRecords: BusinessActivityDelegationRecord[];
  reminderRecords: BusinessActivityReminderRecord[];
  preservedTruncatedSourceNote: string;
  pageSizeOptions: number[];
}

export type AccountsTabId = 'quotations' | 'contracts' | 'invoices';

export interface AccountQuotationRecord {
  id: string;
  quotationCode: string;
  amount: string;
  subscriptions: string;
  quotationDate: string;
}

export interface AccountContractRecord {
  id: string;
  contractCode: string;
  emailAddress: string;
  contactNumber: string;
  startDate: string;
  endDate: string;
  contractTerm: string;
}

export interface AccountInvoiceRecord {
  id: string;
  invoiceCode: string;
  amount: string;
  subscriptions: string;
  invoiceDate: string;
  invoiceCreationType: string;
  invoiceStatus: string;
}

export type SelectedAccountRecord =
  | { type: 'quotation'; data: AccountQuotationRecord }
  | { type: 'contract'; data: AccountContractRecord }
  | { type: 'invoice'; data: AccountInvoiceRecord };

export interface AccountsPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitleEn: string;
  pageTitleAr: string;
  pageSubtitleEn: string;
  pageSubtitleAr: string;
  quotationsSummaryCount: number;
  contractsSummaryCount: number;
  invoicesSummaryCount: number;
  quotationsSearchPlaceholder: string;
  contractsSearchPlaceholder: string;
  invoicesSearchPlaceholder: string;
  invoicesEmptyStateText: string;
  quotations: AccountQuotationRecord[];
  contracts: AccountContractRecord[];
  invoices: AccountInvoiceRecord[];
  pageSizeOptions: number[];
}

export type MediaTabId = 'faqs' | 'news-announcements';

export interface MediaFaqRecord {
  id: string;
  question: string;
  answer: string;
}

export interface MediaAnnouncementRecord {
  id: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  body: string;
}

export interface MediaPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitleEn: string;
  pageTitleAr: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  faqsTabLabelEn: string;
  faqsTabLabelAr: string;
  newsTabLabelEn: string;
  newsTabLabelAr: string;
  faqsSearchPlaceholder: string;
  faqsEmptyStateText: string;
  featuredContentTitle: string;
  featuredContentBody?: string;
  announcements: MediaAnnouncementRecord[];
  faqs: MediaFaqRecord[];
}

export type TrackRequestsTabId = 'pending' | 'completed' | 'rejected';

export interface TrackRequestRecord {
  id: string;
  code: string;
  service: string;
  serviceType: string;
  requestedDate: string;
  pendingWith: string;
  actionRequired: string;
}

export interface TrackRequestsPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitleEn: string;
  pageTitleAr: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  searchPlaceholder: string;
  pendingSectionHeading: string;
  completedSectionHeading: string;
  rejectedSectionHeading: string;
  pendingEmptyStateText: string;
  completedEmptyStateText: string;
  rejectedEmptyStateText: string;
  pendingRequests: TrackRequestRecord[];
  completedRequests: TrackRequestRecord[];
  rejectedRequests: TrackRequestRecord[];
  pageSize: number;
}

export type TicketTypeOption = 'Testing' | 'Technical Support';

export type TicketPriorityOption = 'High' | 'Medium' | 'Low';

export interface SupportTicketRecord {
  id: string;
  rowNumber: number;
  ticketId: string;
  ticketType: TicketTypeOption;
  subject: string;
  message: string;
  priority: TicketPriorityOption;
  dateCreated: string;
  replyStatus: string;
  status: string;
  closedDate: string;
  attachmentName?: string;
  isLocalDemo: true;
}

export interface TicketsPageData {
  eyebrowEn: string;
  eyebrowAr: string;
  pageTitlePrefix: string;
  pageDescriptionEn: string;
  pageDescriptionAr: string;
  emptyStateText: string;
  ticketTypeOptions: TicketTypeOption[];
  priorityOptions: TicketPriorityOption[];
  initialTickets: SupportTicketRecord[];
}

export interface PortalDashboardData {
  user: PortalUserProfile;
  companies: CompanyOption[];
  headerCounts: {
    notifications: number;
    cartItems: number;
    pendingTasks: number;
  };
  kpis: KpiCardItem[];
  subscription: SubscriptionOverviewData;
  renewalAlerts: RenewalAlertCatalog;
  documentsAnalytics: DocumentsAnalyticsData;
  newsTopics: NewsAnnouncementTopic[];
}





