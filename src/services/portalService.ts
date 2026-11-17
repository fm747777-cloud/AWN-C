import {
  MOCK_ACCOUNTS_PAGE_DATA,
  MOCK_BUSINESS_ACTIVITIES_PAGE_DATA,
  MOCK_BUSINESS_DATA_PAGE_DATA,
  MOCK_GOVERNMENT_SERVICES_DATA,
  MOCK_MEDIA_PAGE_DATA,
  MOCK_PORTAL_DASHBOARD_DATA,
  MOCK_SUBSCRIPTIONS_PAGE_DATA,
  MOCK_TICKETS_PAGE_DATA,
  MOCK_TRACK_REQUESTS_PAGE_DATA,
} from '../data/mockPortalData';
import {
  AccountsPageData,
  BusinessActivitiesPageData,
  BusinessDataPageData,
  GovernmentServicesPageData,
  MediaPageData,
  PortalDashboardData,
  SubscriptionsPageData,
  TicketsPageData,
  TrackRequestsPageData,
} from '../types/portal';

/**
 * Frontend service abstraction layer for the AWN Client Portal.
 * In future phases, these methods will connect to the shared AWN backend API.
 * Currently returns isolated mock data with zero external network calls.
 */
export const portalService = {
  async getDashboardData(companyId?: string): Promise<PortalDashboardData> {
    // Preserve selected company context while returning centralized mock data
    const selectedCompany =
      MOCK_PORTAL_DASHBOARD_DATA.companies.find((c) => c.id === companyId) ||
      MOCK_PORTAL_DASHBOARD_DATA.companies[0];

    return Promise.resolve({
      ...MOCK_PORTAL_DASHBOARD_DATA,
      user: {
        ...MOCK_PORTAL_DASHBOARD_DATA.user,
        companyName: selectedCompany.name,
      },
      subscription: {
        ...MOCK_PORTAL_DASHBOARD_DATA.subscription,
        companyContext: selectedCompany.name,
      },
    });
  },

  async getGovernmentServicesData(): Promise<GovernmentServicesPageData> {
    return Promise.resolve(MOCK_GOVERNMENT_SERVICES_DATA);
  },

  async getSubscriptionsData(): Promise<SubscriptionsPageData> {
    return Promise.resolve(MOCK_SUBSCRIPTIONS_PAGE_DATA);
  },

  async getBusinessData(): Promise<BusinessDataPageData> {
    return Promise.resolve(MOCK_BUSINESS_DATA_PAGE_DATA);
  },

  async getBusinessActivitiesData(): Promise<BusinessActivitiesPageData> {
    return Promise.resolve(MOCK_BUSINESS_ACTIVITIES_PAGE_DATA);
  },

  async getAccountsData(): Promise<AccountsPageData> {
    return Promise.resolve(MOCK_ACCOUNTS_PAGE_DATA);
  },

  async getMediaData(): Promise<MediaPageData> {
    return Promise.resolve(MOCK_MEDIA_PAGE_DATA);
  },

  async getTrackRequestsData(): Promise<TrackRequestsPageData> {
    return Promise.resolve(MOCK_TRACK_REQUESTS_PAGE_DATA);
  },

  async getTicketsData(): Promise<TicketsPageData> {
    return Promise.resolve(MOCK_TICKETS_PAGE_DATA);
  },
};







