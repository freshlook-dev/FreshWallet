// src/constants/theme.ts

import { DarkColors } from './colors';

export const Theme = {
  colors: DarkColors,

  /* ========== SPACING ========== */
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  /* ========== RADIUS ========== */
  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },

  /* ========== TYPOGRAPHY ========== */
  typography: {
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500' as const,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
    },
  },

  /* ========== SHADOWS ========== */
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    button: {
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
  },
};
