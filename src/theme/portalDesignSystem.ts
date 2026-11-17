export const AWN_LIGHT_PALETTE = {
  pageBackground: '#FFFFFF',
  subtleSectionBackground: '#F8FAFC',
  cardBackground: '#FFFFFF',
  primaryTeal: '#37848C',
  darkTeal: '#1A7373',
  goldAccent: '#BF9A56',
  mainText: '#1F2937',
  secondaryText: '#64748B',
  borderColor: '#E5E7EB',
  hoverTint: '#F1F5F9',
} as const;

export type SemanticKpiCategory =
  | 'teal'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'slate';

export interface SemanticKpiToneConfig {
  hex: string;
  topBorderClass: string;
  iconContainerClass: string;
  iconColorClass: string;
  valueTextClass: string;
  badgeClass: string;
  dotColorClass: string;
}

/**
 * Shared Semantic KPI Color System across AWN Client Portal
 * - Primary totals / general metrics: Teal (#37848C)
 * - Completed / successful / active metrics: Green (#16A34A)
 * - Pending / awaiting action / in-progress metrics: Amber (#D97706)
 * - Rejected / failed / overdue / expired metrics: Red (#DC2626)
 * - Informational / secondary metrics: Blue (#2563EB)
 * - Neutral / inactive metrics: Slate (#64748B)
 */
export const SEMANTIC_KPI_TONES: Record<
  SemanticKpiCategory,
  SemanticKpiToneConfig
> = {
  teal: {
    hex: '#37848C',
    topBorderClass: 'border-t-2 border-t-[#37848C]',
    iconContainerClass: 'bg-[#37848C]/10 border border-[#37848C]/20',
    iconColorClass: 'text-[#37848C]',
    valueTextClass: 'text-[#1F2937]',
    badgeClass: 'bg-[#37848C]/10 text-[#1A7373] border border-[#37848C]/25',
    dotColorClass: 'bg-[#37848C]',
  },
  green: {
    hex: '#16A34A',
    topBorderClass: 'border-t-2 border-t-[#16A34A]',
    iconContainerClass: 'bg-[#16A34A]/10 border border-[#16A34A]/20',
    iconColorClass: 'text-[#16A34A]',
    valueTextClass: 'text-[#16A34A]',
    badgeClass: 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/25',
    dotColorClass: 'bg-[#16A34A]',
  },
  amber: {
    hex: '#D97706',
    topBorderClass: 'border-t-2 border-t-[#D97706]',
    iconContainerClass: 'bg-[#D97706]/10 border border-[#D97706]/20',
    iconColorClass: 'text-[#D97706]',
    valueTextClass: 'text-[#D97706]',
    badgeClass: 'bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/25',
    dotColorClass: 'bg-[#D97706]',
  },
  red: {
    hex: '#DC2626',
    topBorderClass: 'border-t-2 border-t-[#DC2626]',
    iconContainerClass: 'bg-[#DC2626]/10 border border-[#DC2626]/20',
    iconColorClass: 'text-[#DC2626]',
    valueTextClass: 'text-[#DC2626]',
    badgeClass: 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/25',
    dotColorClass: 'bg-[#DC2626]',
  },
  blue: {
    hex: '#2563EB',
    topBorderClass: 'border-t-2 border-t-[#2563EB]',
    iconContainerClass: 'bg-[#2563EB]/10 border border-[#2563EB]/20',
    iconColorClass: 'text-[#2563EB]',
    valueTextClass: 'text-[#1F2937]',
    badgeClass: 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/25',
    dotColorClass: 'bg-[#2563EB]',
  },
  slate: {
    hex: '#64748B',
    topBorderClass: 'border-t-2 border-t-[#64748B]',
    iconContainerClass: 'bg-[#64748B]/10 border border-[#64748B]/20',
    iconColorClass: 'text-[#64748B]',
    valueTextClass: 'text-[#1F2937]',
    badgeClass: 'bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/25',
    dotColorClass: 'bg-[#64748B]',
  },
};

/**
 * Shared Professional Chart Color System across AWN Client Portal
 */
export const AWN_CHART_PALETTE = {
  series1PrimaryTeal: '#37848C',
  series2DeepTeal: '#1A7373',
  series3Gold: '#BF9A56',
  series4Blue: '#4F7CAC',
  series5Green: '#4F9D69',
  series6Amber: '#D99A32',
  series7Red: '#D9534F',
  neutralSlate: '#64748B',
} as const;

export const AWN_CHART_SERIES_COLORS: readonly string[] = [
  AWN_CHART_PALETTE.series1PrimaryTeal,
  AWN_CHART_PALETTE.series2DeepTeal,
  AWN_CHART_PALETTE.series3Gold,
  AWN_CHART_PALETTE.series4Blue,
  AWN_CHART_PALETTE.series5Green,
  AWN_CHART_PALETTE.series6Amber,
  AWN_CHART_PALETTE.series7Red,
  AWN_CHART_PALETTE.neutralSlate,
];
