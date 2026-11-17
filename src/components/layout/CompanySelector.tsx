import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const CompanySelector: React.FC = () => {
  const { companies, selectedCompany, setSelectedCompanyId, t } = usePortal();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] whitespace-nowrap shrink-0"
      >
        <Building2 className="w-3.5 h-3.5 text-[#37848C] shrink-0" />
        <span className="max-w-[140px] truncate">{selectedCompany.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('Select Company', 'اختيار المنشأة')}
          className="absolute end-0 mt-1.5 w-64 rounded-md border border-[#E5E7EB] bg-white shadow-lg z-50 py-1.5"
        >
          <div className="px-3 py-1.5 border-b border-[#E5E7EB]">
            <p className="text-[11px] font-medium text-[#64748B]">
              {t('Selected Entity (Mock Data)', 'المنشأة المحددة (بيانات تجريبية)')}
            </p>
          </div>
          {companies.map((company) => {
            const isSelected = company.id === selectedCompany.id;
            return (
              <button
                key={company.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCompanyId(company.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-start text-xs hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#1F2937] truncate">
                    {company.name}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    {company.registrationLabel}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#37848C] shrink-0" />
                )}
              </button>
            );
          })}
          <div className="px-3 pt-1.5 mt-1 border-t border-[#E5E7EB]">
            <p className="text-[11px] text-[#64748B]">
              {t(
                'Multi-entity switching will connect to live API in a future phase.',
                'سيتم تفعيل تعدد المنشآت عند الربط بالخادم.'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
