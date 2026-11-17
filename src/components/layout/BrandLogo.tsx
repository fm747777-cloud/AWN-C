import React from 'react';
import { usePortal } from '../../context/PortalContext';

interface BrandLogoProps {
  logoSrc?: string;
  logoAlt?: string;
}

const OFFICIAL_AWN_LOGO_SRC = '/assets/aistudio/_____0c8971d0.png';

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoSrc = OFFICIAL_AWN_LOGO_SRC,
  logoAlt,
}) => {
  const { t } = usePortal();

  return (
    <img
      src={logoSrc}
      alt={logoAlt || t('AWN', 'عون')}
      className="h-11 sm:h-12 w-auto max-w-[150px] sm:max-w-[180px] object-contain shrink-0 block select-none"
      draggable={false}
    />
  );
};

