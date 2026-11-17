import React from 'react';
import { ClientPortalHeader } from './ClientPortalHeader';
import { usePortal } from '../../context/PortalContext';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export const ClientPortalLayout: React.FC<ClientPortalLayoutProps> = ({
  children,
}) => {
  const { t } = usePortal();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F8FAFC] text-[#1F2937]">
      <ClientPortalHeader />
      <main className="flex-1 w-full min-w-0 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-[#E5E7EB] bg-white py-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start text-xs text-[#64748B]">
          <span className="break-words">
            {t(
              'AWN Client Portal — Enterprise Business & Government Services',
              'بوابة عملاء عون — خدمات الأعمال والخدمات الحكومية'
            )}
          </span>
          <span dir="ltr" className="tabular-nums break-words">
            AWN Enterprise Identity · #37848C · #1A7373 · #BF9A56
          </span>
        </div>
      </footer>
    </div>
  );
};
