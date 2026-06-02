/* ============================================================
   Mi Recuerdo Vivo — Design Tokens (React Native)
   Extracted from styles.css → native values (no CSS vars).
   ============================================================ */

/* ---------- Palette by theme ---------- */
export type ThemeName = 'album' | 'sereno' | 'atardecer';

export interface Palette {
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  line: string;          // rgba — subtle border
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondarySoft: string;
  accent: string;
  accentSoft: string;
  heroFrom: string;
  heroTo: string;
  error: string;
}

export const themes: Record<ThemeName, Palette> = {
  /* THEME A · Warm album (default) */
  album: {
    bg: '#f4ece0',
    bg2: '#ede2d2',
    surface: '#fffdf8',
    surface2: '#faf2e7',
    ink: '#352a1f',
    inkSoft: '#786a59',
    inkFaint: '#a89a86',
    line: 'rgba(53,42,31,0.10)',
    primary: '#c0653b',
    primaryDeep: '#a3502b',
    primarySoft: '#f6e2d3',
    onPrimary: '#fffaf4',
    secondary: '#5a7d6f',
    secondarySoft: '#e1eae3',
    accent: '#d6992f',
    accentSoft: '#f6e8c9',
    heroFrom: '#f4ece0',
    heroTo: '#efe0cd',
    error: '#B3261E',
  },
  /* THEME B · Serene (wellness, sage) */
  sereno: {
    bg: '#eef1ec',
    bg2: '#e4eae3',
    surface: '#fdfefb',
    surface2: '#f1f5ef',
    ink: '#2b332c',
    inkSoft: '#5f6b60',
    inkFaint: '#98a298',
    line: 'rgba(43,51,44,0.10)',
    primary: '#4f7d6c',
    primaryDeep: '#3c6557',
    primarySoft: '#dde9e2',
    onPrimary: '#f6fbf8',
    secondary: '#c0653b',
    secondarySoft: '#f2e3d7',
    accent: '#c79a3e',
    accentSoft: '#efe6cd',
    heroFrom: '#eef1ec',
    heroTo: '#e3ebe4',
    error: '#B3261E',
  },
  /* THEME C · Sunset (deep warm) */
  atardecer: {
    bg: '#f6e7d6',
    bg2: '#f1dcc4',
    surface: '#fffaf2',
    surface2: '#fbecd9',
    ink: '#43271a',
    inkSoft: '#8a6149',
    inkFaint: '#bd9577',
    line: 'rgba(67,39,26,0.12)',
    primary: '#b9482c',
    primaryDeep: '#9a3a23',
    primarySoft: '#f7d9c2',
    onPrimary: '#fff6ef',
    secondary: '#a96a3c',
    secondarySoft: '#f4ddc4',
    accent: '#db8a32',
    accentSoft: '#f8e3c2',
    heroFrom: '#f8ead6',
    heroTo: '#f3d3b4',
    error: '#B3261E',
  },
};

/* ---------- Radius ---------- */
export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 9999,
} as const;

/* ---------- Spacing (base 4 scale) ---------- */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 44,
} as const;

/* ---------- Typography ----------
   Fonts: 'Nunito' (sans) and 'Lora' (serif).
   Loaded with expo-font / react-native fonts. The numerical weights
   from the web map to font families by weight if using separate .ttf files
   (see README). Here we also include RN fontWeight.   */
export const fonts = {
  sans: 'Nunito',
  serif: 'Lora',
} as const;

type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight?:
    | 'normal' | 'bold'
    | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase';
};

/* lineHeight is in absolute px (RN does not accept unitless) */
export const type: Record<string, TypeStyle> = {
  display: { fontFamily: 'Nunito_800', fontSize: 40, lineHeight: 42, letterSpacing: -0.4 },
  h1:      { fontFamily: 'Nunito_800', fontSize: 30, lineHeight: 33, letterSpacing: -0.3 },
  h2:      { fontFamily: 'Nunito_800', fontSize: 23, lineHeight: 26 },
  h3:      { fontFamily: 'Nunito_700', fontSize: 19, lineHeight: 23 },
  body:    { fontFamily: 'Nunito_500', fontSize: 17, lineHeight: 26 },
  bodyLg:  { fontFamily: 'Nunito_500', fontSize: 19, lineHeight: 29 },
  label:   { fontFamily: 'Nunito_700', fontSize: 15, lineHeight: 20, letterSpacing: 0.3 },
  small:   { fontFamily: 'Nunito_600', fontSize: 14, lineHeight: 19 },
  tiny:    { fontFamily: 'Nunito_700', fontSize: 12, lineHeight: 15, letterSpacing: 0.7, textTransform: 'uppercase' },
  /* serif variants (quotes, memory headlines) */
  serifBody: { fontFamily: 'Lora_500', fontSize: 18, lineHeight: 27 },
  serifLg:   { fontFamily: 'Lora_500', fontSize: 19, lineHeight: 29 },
};

/* ---------- Shadows ----------
   The web uses multi-layer box-shadows; RN only supports one layer
   (iOS: shadow*, Android: elevation). Equivalent approximation. */
export const shadow = {
  card: {
    shadowColor: 'rgba(40,30,20,1)',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  pop: {
    shadowColor: 'rgba(40,30,20,1)',
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  /* tinted shadow under primary buttons */
  primary: (color: string) => ({
    shadowColor: color,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  }),
} as const;

/* ---------- Animation curve (≈ var(--ease)) ----------
   cubic-bezier(.22,.61,.36,1). Use with Easing.bezier in Animated. */
export const easing = { x1: 0.22, y1: 0.61, x2: 0.36, y2: 1 } as const;
