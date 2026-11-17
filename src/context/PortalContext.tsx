import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MOCK_PORTAL_DASHBOARD_DATA } from '../data/mockPortalData';
import {
  CompanyOption,
  Language,
  PortalUserProfile,
} from '../types/portal';

interface PortalContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  selectedCompany: CompanyOption;
  setSelectedCompanyId: (id: string) => void;
  companies: CompanyOption[];
  userProfile: PortalUserProfile;
  updateUserProfile: (updated: Partial<PortalUserProfile>) => void;
  isAuthenticated: boolean;
  logoutDemoSession: () => void;
  restoreDemoSession: () => void;
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    MOCK_PORTAL_DASHBOARD_DATA.companies[0].id
  );
  const [userProfile, setUserProfile] = useState<PortalUserProfile>(
    MOCK_PORTAL_DASHBOARD_DATA.user
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const isRtl = language === 'ar';

  useEffect(() => {
    const rootEl = document.documentElement;
    rootEl.lang = language;
    rootEl.dir = isRtl ? 'rtl' : 'ltr';
    // Enforce light-only theme regardless of OS or saved preferences
    rootEl.classList.remove('dark');
    rootEl.style.colorScheme = 'light';
  }, [language, isRtl]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const t = useCallback(
    (en: string, ar: string): string => {
      return language === 'ar' ? ar : en;
    },
    [language]
  );

  const updateUserProfile = (updated: Partial<PortalUserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      const combinedName = `${next.firstName} ${next.lastName}`.trim();
      return {
        ...next,
        fullName: combinedName || prev.fullName,
      };
    });
  };

  const logoutDemoSession = () => {
    setIsAuthenticated(false);
  };

  const restoreDemoSession = () => {
    setIsAuthenticated(true);
  };

  const selectedCompany =
    MOCK_PORTAL_DASHBOARD_DATA.companies.find(
      (c) => c.id === selectedCompanyId
    ) || MOCK_PORTAL_DASHBOARD_DATA.companies[0];

  return (
    <PortalContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRtl,
        t,
        selectedCompany,
        setSelectedCompanyId,
        companies: MOCK_PORTAL_DASHBOARD_DATA.companies,
        userProfile,
        updateUserProfile,
        isAuthenticated,
        logoutDemoSession,
        restoreDemoSession,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextValue => {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return ctx;
};
