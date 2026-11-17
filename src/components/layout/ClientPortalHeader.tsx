import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckSquare,
  ChevronDown,
  FileBarChart2,
  FileText,
  Globe,
  HelpCircle,
  KeyRound,
  LogOut,
  Menu,
  PackagePlus,
  Settings,
  ShieldCheck,
  ShoppingCart,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '../../context/PortalContext';
import { MOCK_PORTAL_DASHBOARD_DATA } from '../../data/mockPortalData';
import { HeaderNavigationItem, HeaderSubmenuItem } from '../../types/portal';
import { BrandLogo } from './BrandLogo';
import { CompanySelector } from './CompanySelector';

type ActivePopover =
  | null
  | 'nav-notice'
  | 'tasks'
  | 'notifications'
  | 'help'
  | 'cart'
  | 'profile';

export const ClientPortalHeader: React.FC = () => {
  const {
    language,
    toggleLanguage,
    t,
    userProfile,
    logoutDemoSession,
  } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();

  const [activePopover, setActivePopover] = useState<ActivePopover>(null);
  const [deferredNavTitle, setDeferredNavTitle] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownNavId, setOpenDropdownNavId] = useState<string | null>(
    null
  );

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActivePopover(null);
        setOpenDropdownNavId(null);
      }
    };
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setActivePopover(null);
        setOpenDropdownNavId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const { headerCounts, renewalAlerts } = MOCK_PORTAL_DASHBOARD_DATA;

  const isDashboardActive: boolean =
    location.pathname === '/dashboard' || location.pathname === '/';
  const isGovernmentServicesActive: boolean =
    location.pathname.startsWith('/government-services') ||
    location.pathname.startsWith('/subscriptions') ||
    location.pathname.startsWith('/awn-subscriptions');
  const isMyBusinessActive: boolean =
    location.pathname.startsWith('/business-data') ||
    location.pathname.startsWith('/business-activities') ||
    location.pathname.startsWith('/accounts');
  const isTrackRequestsActive: boolean =
    location.pathname.startsWith('/track-requests') ||
    location.pathname.startsWith('/requests');
  const isMediaActive: boolean = location.pathname.startsWith('/media');
  const isTicketsActive: boolean =
    location.pathname.startsWith('/tickets') ||
    location.pathname.startsWith('/help');

  const navItems: HeaderNavigationItem[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelAr: 'لوحة التحكم',
      routePath: '/dashboard',
      isActive: isDashboardActive,
      hasSubmenuIndicator: false,
      isImplemented: true,
    },
    {
      id: 'government-services',
      labelEn: 'Government Services',
      labelAr: 'الخدمات الحكومية',
      isActive: isGovernmentServicesActive,
      hasSubmenuIndicator: true,
      isImplemented: true,
      submenuItems: [
        {
          id: 'government-services-catalog',
          labelEn: 'Government Services',
          labelAr: 'الخدمات الحكومية',
          routePath: '/government-services',
          isImplemented: true,
        },
        {
          id: 'awn-subscriptions',
          labelEn: 'AWN Subscriptions',
          labelAr: 'اشتراكات عون',
          routePath: '/subscriptions',
          isImplemented: true,
        },
      ],
    },
    {
      id: 'my-business',
      labelEn: 'My Business',
      labelAr: 'أعمالي',
      isActive: isMyBusinessActive,
      hasSubmenuIndicator: true,
      isImplemented: true,
      submenuItems: [
        {
          id: 'business-data',
          labelEn: 'Business Data',
          labelAr: 'بيانات المنشأة',
          routePath: '/business-data',
          isImplemented: true,
        },
        {
          id: 'business-activities',
          labelEn: 'Business Activities',
          labelAr: 'الأنشطة التجارية',
          routePath: '/business-activities',
          isImplemented: true,
        },
        {
          id: 'accounts',
          labelEn: 'Accounts',
          labelAr: 'الحسابات',
          routePath: '/accounts',
          isImplemented: true,
        },
      ],
    },
    {
      id: 'media',
      labelEn: 'Media',
      labelAr: 'المركز الإعلامي',
      routePath: '/media',
      isActive: isMediaActive,
      hasSubmenuIndicator: false,
      isImplemented: true,
    },
  ];

  const handleNavClick = (item: HeaderNavigationItem): void => {
    if (item.submenuItems && item.submenuItems.length > 0) {
      setActivePopover(null);
      setOpenDropdownNavId((prev) => (prev === item.id ? null : item.id));
      return;
    }

    setOpenDropdownNavId(null);
    if (item.isImplemented && item.routePath) {
      setActivePopover(null);
      setMobileMenuOpen(false);
      navigate(item.routePath);
    } else {
      setDeferredNavTitle(language === 'ar' ? item.labelAr : item.labelEn);
      setActivePopover('nav-notice');
    }
  };

  const handleSubmenuSelect = (sub: HeaderSubmenuItem): void => {
    setOpenDropdownNavId(null);
    if (sub.isImplemented !== false && sub.routePath) {
      setActivePopover(null);
      setMobileMenuOpen(false);
      navigate(sub.routePath);
    } else {
      setMobileMenuOpen(false);
      setDeferredNavTitle(language === 'ar' ? sub.labelAr : sub.labelEn);
      setActivePopover('nav-notice');
    }
  };

  const togglePopover = (target: ActivePopover): void => {
    setOpenDropdownNavId(null);
    setActivePopover((prev) => (prev === target ? null : target));
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white transition-colors"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Zone: Official Brand Logo + Primary Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label={t('Go to Dashboard', 'الانتقال إلى لوحة التحكم')}
            className="inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] rounded-md shrink-0"
          >
            <BrandLogo />
          </button>

          <nav
            aria-label={t('Primary Navigation', 'التنقل الرئيسي')}
            className="hidden lg:flex items-center gap-1"
          >
            {navItems.map((item) => {
              const label: string =
                language === 'ar' ? item.labelAr : item.labelEn;
              const isDropdownOpen: boolean = openDropdownNavId === item.id;

              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    aria-current={item.isActive ? 'page' : undefined}
                    aria-expanded={
                      item.submenuItems ? isDropdownOpen : undefined
                    }
                    aria-haspopup={item.submenuItems ? 'menu' : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                      item.isActive
                        ? 'text-[#1A7373] bg-[#37848C]/10 font-semibold'
                        : 'text-[#1F2937] hover:text-[#1A7373] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span>{label}</span>
                    {item.hasSubmenuIndicator && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-75 shrink-0 transition-transform duration-150 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.submenuItems && isDropdownOpen && (
                    <div
                      role="menu"
                      aria-label={label}
                      className="absolute start-0 mt-1.5 w-60 rounded-md border border-[#E5E7EB] bg-white shadow-lg py-1.5 z-50"
                    >
                      {item.submenuItems.map((sub) => {
                        const isSubActive: boolean = Boolean(
                          sub.routePath && location.pathname === sub.routePath
                        );
                        const subLabel: string =
                          language === 'ar' ? sub.labelAr : sub.labelEn;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            role="menuitem"
                            onClick={() => handleSubmenuSelect(sub)}
                            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-start transition-colors ${
                              isSubActive
                                ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                                : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            <span>{subLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Zone: Header Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Company Selector (Desktop & Tablet) */}
          <div className="hidden sm:block">
            <CompanySelector />
          </div>

          {/* Task / Action Icon (Checkmark Dropdown with Track Requests) */}
          <button
            type="button"
            onClick={() => togglePopover('tasks')}
            aria-label={t('Tasks and Actions', 'المهام والإجراءات')}
            aria-expanded={activePopover === 'tasks'}
            aria-haspopup="menu"
            title={t('Tasks & Actions', 'المهام والإجراءات')}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
              activePopover === 'tasks' || isTrackRequestsActive
                ? 'border-[#37848C] bg-[#37848C]/10 text-[#1A7373]'
                : 'border-[#E5E7EB] text-[#1F2937] hover:bg-[#F1F5F9]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
          </button>

          {/* Notifications Icon & Anchored Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => togglePopover('notifications')}
              aria-label={t('Notifications', 'الإشعارات')}
              aria-expanded={activePopover === 'notifications'}
              aria-haspopup="true"
              aria-controls="awn-notifications-dropdown"
              title={t('Notifications', 'الإشعارات')}
              className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                activePopover === 'notifications'
                  ? 'border-[#37848C] bg-[#37848C]/10 text-[#1A7373]'
                  : 'border-[#E5E7EB] text-[#1F2937] hover:bg-[#F1F5F9]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {headerCounts.notifications > 0 && (
                <span
                  dir="ltr"
                  className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#37848C] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums"
                >
                  {String(headerCounts.notifications)}
                </span>
              )}
            </button>

            {activePopover === 'notifications' && (
              <div
                id="awn-notifications-dropdown"
                role="region"
                aria-label={t('Notifications', 'الإشعارات')}
                className="absolute end-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-[#E5E7EB] bg-white shadow-lg z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
                  <h3 className="text-sm font-semibold text-[#1F2937]">
                    {t('Notifications', 'الإشعارات')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="inline-flex items-center justify-center w-6 h-6 rounded text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors"
                    aria-label={t('Close Notifications', 'إغلاق الإشعارات')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-11 h-11 rounded-full bg-[#37848C]/10 border border-[#37848C]/20 flex items-center justify-center text-[#37848C] mb-3">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-[#1F2937]">
                    {t('No Notifications Found', 'لا توجد إشعارات')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Shopping / Cart Icon with Count (Latin numerals) */}
          <button
            type="button"
            onClick={() => togglePopover('cart')}
            aria-label={t('Service Cart', 'سلة الخدمات')}
            aria-expanded={activePopover === 'cart'}
            aria-haspopup="dialog"
            aria-controls="awn-service-cart-panel"
            title={t('Service Cart', 'سلة الخدمات')}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
              activePopover === 'cart'
                ? 'border-[#37848C] bg-[#37848C]/10 text-[#1A7373]'
                : 'border-[#E5E7EB] text-[#1F2937] hover:bg-[#F1F5F9]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span
              dir="ltr"
              className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#BF9A56] text-[#1F2937] text-[10px] font-bold flex items-center justify-center tabular-nums"
            >
              {String(headerCounts.cartItems)}
            </span>
          </button>

          {/* Help Entry -> Tickets Dropdown */}
          <button
            type="button"
            onClick={() => togglePopover('help')}
            aria-label={t('Help', 'المساعدة')}
            aria-expanded={activePopover === 'help'}
            aria-haspopup="menu"
            title={t('Help', 'المساعدة')}
            className={`hidden sm:inline-flex items-center justify-center gap-1 px-2.5 h-9 rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
              activePopover === 'help' || isTicketsActive
                ? 'border-[#37848C] bg-[#37848C]/10 text-[#1A7373] font-semibold'
                : 'border-[#E5E7EB] text-[#1F2937] hover:bg-[#F1F5F9]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#37848C] shrink-0" />
            <span className="text-xs font-medium">
              {t('Help', 'المساعدة')}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-75 shrink-0 transition-transform duration-150 ${
                activePopover === 'help' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Language Switcher (AR / EN + RTL/LTR) */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('التبديل إلى العربية', 'Switch to English')}
            title={t('التبديل إلى العربية', 'Switch to English')}
            className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-[#37848C]" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* User Profile / Avatar Menu */}
          <button
            type="button"
            onClick={() => togglePopover('profile')}
            aria-label={t('User Profile Menu', 'ملف المستخدم')}
            aria-expanded={activePopover === 'profile'}
            aria-haspopup="menu"
            className={`inline-flex items-center gap-2 ps-1.5 pe-2.5 h-9 rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] shrink-0 ${
              activePopover === 'profile'
                ? 'border-[#37848C] bg-[#37848C]/10'
                : 'border-[#E5E7EB] hover:bg-[#F1F5F9]'
            }`}
          >
            {userProfile.profilePhotoUrl ? (
              <img
                src={userProfile.profilePhotoUrl}
                alt={userProfile.fullName}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="w-6 h-6 rounded-full bg-[#1A7373] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                WZ
              </span>
            )}
            <span className="hidden xl:inline text-xs font-medium text-[#1F2937] max-w-[140px] truncate">
              {userProfile.fullName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-150 ${
                activePopover === 'profile' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t('Toggle Navigation Menu', 'القائمة')}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F1F5F9]"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Contextual Popovers for Header Controls */}
      {activePopover && activePopover !== 'notifications' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            id={activePopover === 'cart' ? 'awn-service-cart-panel' : undefined}
            role={activePopover === 'cart' ? 'dialog' : undefined}
            aria-label={
              activePopover === 'cart'
                ? t('Service Cart (Mock Preview)', 'سلة الخدمات (معاينة تجريبية)')
                : undefined
            }
            className={`absolute end-4 sm:end-6 lg:end-8 top-1 rounded-lg border border-[#E5E7EB] bg-white shadow-xl p-4 sm:p-5 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto ${
              activePopover === 'cart'
                ? 'w-[calc(100vw-2rem)] sm:w-[540px] lg:w-[760px]'
                : 'w-80 sm:w-96'
            }`}
          >
            <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[#E5E7EB]">
              <h3 className="text-xs font-semibold text-[#1F2937]">
                {activePopover === 'nav-notice' &&
                  t(
                    `${deferredNavTitle} (Upcoming Phase)`,
                    `قسم "${deferredNavTitle}" (مرحلة قادمة)`
                  )}
                {activePopover === 'tasks' &&
                  t(
                    'Tasks & Renewal Queue (Mock Preview)',
                    'المهام والتنبيهات (معاينة تجريبية)'
                  )}
                {activePopover === 'cart' &&
                  t(
                    'Service Cart (Mock Preview)',
                    'سلة الخدمات (معاينة تجريبية)'
                  )}
                {activePopover === 'help' &&
                  t(
                    'Client Portal Help & Support',
                    'مركز المساعدة والدعم'
                  )}
                {activePopover === 'profile' &&
                  t(
                    'Account Profile (Mock Context)',
                    'بيانات الحساب (بيانات تجريبية)'
                  )}
              </h3>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="inline-flex items-center justify-center w-6 h-6 rounded text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors"
                aria-label={t('Close', 'إغلاق')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 text-xs text-[#64748B] space-y-2">
              {activePopover === 'nav-notice' && (
                <p>
                  {t(
                    'Currently active portal pages are Dashboard, Government Services, Subscriptions, and Business Data. This destination is scheduled for an upcoming phase.',
                    'الأقسام المفعلة حالياً هي "لوحة التحكم" و"الخدمات الحكومية" و"اشتراكات عون" و"بيانات المنشأة". سيتم تفعيل هذه الصفحة في مرحلة قادمة.'
                  )}
                </p>
              )}

              {activePopover === 'tasks' && (
                <div
                  role="menu"
                  aria-label={t('Tasks & Actions Menu', 'قائمة المهام والإجراءات')}
                  className="space-y-3"
                >
                  {/* Track Requests Menu Item inside Checkmark Dropdown */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActivePopover(null);
                      setMobileMenuOpen(false);
                      navigate('/track-requests');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-start transition-colors ${
                      isTrackRequestsActive
                        ? 'bg-[#37848C]/10 text-[#1A7373]'
                        : 'bg-[#F8FAFC] text-[#1F2937] hover:bg-[#37848C]/10 hover:text-[#1A7373]'
                    }`}
                  >
                    <span>
                      {t('Track Requests', 'متابعة الطلبات')}
                    </span>
                    <span className="text-[11px] font-normal text-[#64748B]">
                      {t('Requests', 'الطلبات')}
                    </span>
                  </button>

                  {/* Preserved Tasks & Renewal Queue (Mock Preview) */}
                  <div className="pt-2.5 border-t border-[#E5E7EB] space-y-2">
                    <p>
                      {t(
                        'Cataloged request IDs tracked on the Dashboard:',
                        'معرفات الطلبات المسجلة للمتابعة في لوحة التحكم:'
                      )}
                    </p>
                    <div
                      dir="ltr"
                      className="flex flex-wrap gap-1.5 font-mono text-[11px] text-[#1F2937] tabular-nums"
                    >
                      {renewalAlerts.requestIds.map((reqId) => (
                        <span
                          key={reqId}
                          className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E5E7EB]"
                        >
                          {reqId}
                        </span>
                      ))}
                    </div>
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePopover(null);
                          setMobileMenuOpen(false);
                          navigate('/track-requests');
                        }}
                        className="w-full h-8 px-3 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs font-semibold transition-colors"
                      >
                        {t('Open Track Requests', 'عرض صفحة متابعة الطلبات')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePopover === 'cart' && (
                <div className="space-y-4">
                  {/* Top Enterprise Security & Cart Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          dir="ltr"
                          className="text-[10px] font-bold tracking-widest uppercase text-[#1A7373]"
                        >
                          AWNENTERPRISE
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#16A34A]/10 border border-[#16A34A]/25 text-[10px] font-bold tracking-wider uppercase text-[#16A34A]">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>{t('SYSTEM SECURED', 'النظام مؤمّن')}</span>
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-[#1F2937]">
                        {t('Shopping Cart', 'سلة الخدمات')}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        {t(
                          '0 items ready for provisioning',
                          '0 عناصر جاهزة للتفعيل'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Two-Column Cart Content + Order Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column: Empty Cart State & Add More Packages */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                      <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-5 py-8 flex flex-col items-center justify-center text-center">
                        <div className="w-11 h-11 rounded-full bg-[#37848C]/10 border border-[#37848C]/20 flex items-center justify-center text-[#37848C] mb-3">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold tracking-wider uppercase text-[#1F2937]">
                          {t('YOUR CART IS EMPTY', 'سلة الخدمات فارغة')}
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          {t(
                            'Add some items to get started',
                            'أضف باقات أو خدمات للبدء'
                          )}
                        </p>
                      </div>

                      {/* Add More Packages Card */}
                      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-md bg-[#BF9A56]/15 text-[#BF9A56] flex items-center justify-center shrink-0">
                            <PackagePlus className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">
                              {t('Add More Packages', 'إضافة المزيد من الباقات')}
                            </p>
                            <p className="text-[11px] text-[#64748B]">
                              {t(
                                '2 plans available to enroll',
                                'باقتان متاحتان للاشتراك'
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActivePopover(null);
                            setMobileMenuOpen(false);
                            navigate('/subscriptions');
                          }}
                          className="px-3 py-1.5 rounded-md border border-[#37848C]/40 text-[#1A7373] hover:bg-[#37848C]/10 text-xs font-semibold transition-colors shrink-0"
                        >
                          {t('Browse Plans', 'استعراض الباقات')}
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold tracking-wider uppercase text-[#1F2937] pb-2 border-b border-[#E5E7EB]">
                          {t('ORDER SUMMARY', 'ملخص الطلب')}
                        </h5>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>{t('Subtotal', 'المجموع الفرعي')}</span>
                            <span
                              dir="ltr"
                              className="font-mono font-medium text-[#1F2937] tabular-nums"
                            >
                              SAR 0.00
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>{t('Discount (0%)', 'الخصم (0%)')}</span>
                            <span
                              dir="ltr"
                              className="font-mono font-medium text-[#1F2937] tabular-nums"
                            >
                              SAR 0.00
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>{t('VAT (0%)', 'ضريبة القيمة المضافة (0%)')}</span>
                            <span
                              dir="ltr"
                              className="font-mono font-medium text-[#1F2937] tabular-nums"
                            >
                              SAR 0.00
                            </span>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between">
                          <span className="text-xs font-bold tracking-wider uppercase text-[#1F2937]">
                            {t('TOTAL AMOUNT', 'الإجمالي المستحق')}
                          </span>
                          <span
                            dir="ltr"
                            className="text-sm font-bold font-mono text-[#1A7373] tabular-nums"
                          >
                            SAR 0.00
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <button
                          type="button"
                          disabled
                          className="w-full h-9 px-3 rounded-md bg-[#37848C] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 opacity-60 cursor-not-allowed"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>{t('Generate Invoice', 'إصدار الفاتورة')}</span>
                        </button>

                        <div className="rounded-md bg-white border border-[#E5E7EB] p-2.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#1A7373]">
                            <Zap className="w-3 h-3 text-[#BF9A56] shrink-0" />
                            <span>
                              {t('INSTANT PROVISIONING', 'تفعيل فوري')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] leading-relaxed">
                            {t(
                              'Your invoice will be created and shared for further processing.',
                              'سيتم إنشاء الفاتورة ومشاركتها لاستكمال إجراءات المعالجة.'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePopover === 'help' && (
                <div
                  role="menu"
                  aria-label={t('Help Menu', 'قائمة المساعدة')}
                  className="space-y-2"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActivePopover(null);
                      setMobileMenuOpen(false);
                      navigate('/tickets');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-start transition-colors ${
                      isTicketsActive
                        ? 'bg-[#37848C]/10 text-[#1A7373]'
                        : 'bg-[#F8FAFC] text-[#1F2937] hover:bg-[#37848C]/10 hover:text-[#1A7373]'
                    }`}
                  >
                    <span>{t('Tickets', 'تذاكر الدعم')}</span>
                    <span className="text-[11px] font-normal text-[#64748B]">
                      {t('Support Tickets', 'إدارة التذاكر')}
                    </span>
                  </button>
                  <p className="text-[11px] text-[#64748B]">
                    {t(
                      'Manage and track all support tickets in one place.',
                      'إدارة ومتابعة جميع تذاكر الدعم الفني الخاصة بمنشأتك.'
                    )}
                  </p>
                </div>
              )}

              {activePopover === 'profile' && (
                <div className="space-y-3">
                  {/* Profile Identity Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
                    {userProfile.profilePhotoUrl ? (
                      <img
                        src={userProfile.profilePhotoUrl}
                        alt={userProfile.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#37848C]/10 border border-[#37848C]/20 flex items-center justify-center text-[#37848C] shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F2937] truncate">
                        {userProfile.fullName}
                      </p>
                      <p
                        dir="ltr"
                        className="text-[11px] text-[#64748B] truncate"
                      >
                        {userProfile.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Menu Items in Exact Order */}
                  <div
                    role="menu"
                    aria-label={t('Account Profile Menu', 'قائمة الحساب الشخصي')}
                    className="space-y-1"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActivePopover(null);
                        setMobileMenuOpen(false);
                        navigate('/profile-settings');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-start transition-colors ${
                        location.pathname.startsWith('/profile')
                          ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                          : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                      <span>
                        {t('Profile Settings', 'إعدادات الملف الشخصي')}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActivePopover(null);
                        setMobileMenuOpen(false);
                        navigate('/reports');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-start transition-colors ${
                        location.pathname.startsWith('/reports')
                          ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                          : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <FileBarChart2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                      <span>{t('Reports', 'التقارير')}</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActivePopover(null);
                        setMobileMenuOpen(false);
                        navigate('/change-password');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-start transition-colors ${
                        location.pathname.startsWith('/change-password')
                          ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                          : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
                      <span>{t('Change Password', 'تغيير كلمة المرور')}</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-[#E5E7EB]">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActivePopover(null);
                          setMobileMenuOpen(false);
                          logoutDemoSession();
                          navigate('/login', { replace: true });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-[#DC2626] hover:bg-red-50 text-start transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>{t('Logout', 'تسجيل الخروج')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-3">
          <div className="sm:hidden pb-2 border-b border-[#E5E7EB]">
            <CompanySelector />
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const label = language === 'ar' ? item.labelAr : item.labelEn;
              const isDropdownOpen: boolean = openDropdownNavId === item.id;
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                      item.isActive
                        ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                        : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span>{label}</span>
                    {item.hasSubmenuIndicator && (
                      <ChevronDown
                        className={`w-4 h-4 opacity-75 transition-transform duration-150 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.submenuItems && isDropdownOpen && (
                    <div className="ps-4 space-y-1">
                      {item.submenuItems.map((sub) => {
                        const isSubActive: boolean = Boolean(
                          sub.routePath && location.pathname === sub.routePath
                        );
                        const subLabel: string =
                          language === 'ar' ? sub.labelAr : sub.labelEn;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSubmenuSelect(sub)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md text-start ${
                              isSubActive
                                ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                                : 'text-[#64748B] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            <span>{subLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Help -> Tickets Entry */}
            <button
              type="button"
              onClick={() => {
                setActivePopover(null);
                setMobileMenuOpen(false);
                navigate('/tickets');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                isTicketsActive
                  ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                  : 'text-[#1F2937] hover:bg-[#F1F5F9]'
              }`}
            >
              <span>
                {t('Help · Tickets', 'المساعدة · تذاكر الدعم')}
              </span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
