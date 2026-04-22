import { vars } from 'nativewind';

export type ThemeMode = 'dark' | 'light';

export type ThemePalette = {
  background: string;
  surface: string;
  elevated: string;
  border: string;
  accent: string;
  accentSoft: string;
  health: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  danger: string;
};

const themePalettes: Record<ThemeMode, ThemePalette> = {
  dark: {
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
  },
  light: {
    background: '#F6F7FB',
    surface: '#FFFFFF',
    elevated: '#EEF1F6',
    border: '#D6DCE6',
    accent: '#FF8A00',
    accentSoft: '#FFB347',
    health: '#4CAF50',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
};

function hexToRgbTriplet(hex: string) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

export function getThemeColors(mode: ThemeMode): ThemePalette {
  return themePalettes[mode];
}

export function getThemeGradients(mode: ThemeMode) {
  const colors = getThemeColors(mode);

  return {
    accent: [colors.accent, colors.accentSoft] as const,
    surface: [colors.elevated, colors.surface] as const,
    imageOverlay:
      mode === 'dark'
        ? (['rgba(15,15,20,0.12)', 'rgba(15,15,20,0.72)', 'rgba(15,15,20,0.98)'] as const)
        : (['rgba(255,255,255,0.1)', 'rgba(246,247,251,0.78)', 'rgba(246,247,251,0.98)'] as const),
  } as const;
}

export function getThemeVariables(mode: ThemeMode) {
  const colors = getThemeColors(mode);

  return vars({
    '--color-background': hexToRgbTriplet(colors.background),
    '--color-surface': hexToRgbTriplet(colors.surface),
    '--color-elevated': hexToRgbTriplet(colors.elevated),
    '--color-border': hexToRgbTriplet(colors.border),
    '--color-accent': hexToRgbTriplet(colors.accent),
    '--color-accent-soft': hexToRgbTriplet(colors.accentSoft),
    '--color-health': hexToRgbTriplet(colors.health),
    '--color-text-primary': hexToRgbTriplet(colors.textPrimary),
    '--color-text-secondary': hexToRgbTriplet(colors.textSecondary),
    '--color-text-muted': hexToRgbTriplet(colors.textMuted),
    '--color-success': hexToRgbTriplet(colors.success),
    '--color-warning': hexToRgbTriplet(colors.warning),
    '--color-danger': hexToRgbTriplet(colors.danger),
  });
}
