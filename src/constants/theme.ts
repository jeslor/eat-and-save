export const themeColors = {
  background: '#0F0F14',
  surface: '#1A1A22',
  elevated: '#22222C',
  border: '#2E2E38',
  accent: '#FF8A00',
  accentSoft: '#FFB347',
  health: '#4CAF50',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#6B7280',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
} as const;

export const themeGradients = {
  accent: [themeColors.accent, themeColors.accentSoft] as const,
  surface: ['#22222C', '#1A1A22'] as const,
  imageOverlay: ['rgba(15,15,20,0.12)', 'rgba(15,15,20,0.72)', 'rgba(15,15,20,0.98)'] as const,
} as const;
