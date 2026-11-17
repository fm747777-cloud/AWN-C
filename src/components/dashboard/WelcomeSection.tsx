import React from 'react';
import { Clock, Building2 } from 'lucide-react';
import { PortalUserProfile } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';

interface WelcomeSectionProps {
  user: PortalUserProfile;
}

/**
 * Formats the supplied mock ISO timestamp (2026-10-25T23:13:52.667Z)
 * into a human-readable string using Latin numerals consistently.
 */
function formatMockTimestampLatin(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${formatter.format(parsed)} UTC`;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const { selectedCompany, t } = usePortal();
  const formattedTimestamp: string = formatMockTimestampLatin(
    user.lastLoginTimestamp
  );

  return (
    <section
      aria-labelledby="welcome-heading"
      className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-4 sm:px-6 sm:py-5"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1A7373]">
              <Building2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
              <span>{selectedCompany.name}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t('Account & Entity Summary', 'ملخص الحساب والمنشأة')}
            </span>
          </div>

          <h1
            id="welcome-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-[#1F2937]"
          >
            {t(`Welcome, ${user.fullName}`, `مرحباً، ${user.fullName}`)}
          </h1>
        </div>

        <div className="flex flex-col sm:items-end justify-center border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB] text-xs text-[#64748B]">
          <div className="inline-flex items-center gap-1.5 text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#BF9A56] shrink-0" />
            <span>
              {t(
                'Last Login (Mock Timestamp):',
                'آخر تسجيل دخول (بيانات تجريبية):'
              )}
            </span>
            <span
              dir="ltr"
              className="font-mono font-semibold text-[#1F2937] tabular-nums"
            >
              {formattedTimestamp}
            </span>
          </div>
          <p
            dir="ltr"
            className="mt-0.5 text-[11px] text-[#64748B] font-mono tabular-nums"
          >
            {user.lastLoginTimestamp}
          </p>
        </div>
      </div>
    </section>
  );
};
