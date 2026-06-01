import React, { createContext, useContext } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { themes, Palette, radius, spacing, type, shadow, fonts, easing } from './tokens';

export interface Theme {
  name: 'album';
  colors: Palette;
  radius: typeof radius;
  spacing: typeof spacing;
  type: typeof type;
  shadow: typeof shadow;
  fonts: typeof fonts;
  easing: typeof easing;
}

const themeName = 'album';
const currentTheme: Theme = { 
  name: themeName, 
  colors: themes[themeName], 
  radius, 
  spacing, 
  type, 
  shadow, 
  fonts, 
  easing 
};

// Paper configuration to match our custom tokens
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: currentTheme.colors.primary,
    onPrimary: currentTheme.colors.onPrimary,
    primaryContainer: currentTheme.colors.primarySoft,
    secondary: currentTheme.colors.secondary,
    secondaryContainer: currentTheme.colors.secondarySoft,
    background: currentTheme.colors.bg,
    surface: currentTheme.colors.surface,
  },
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={currentTheme}>
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

/** Acceso al tema activo. Lanza si se usa fuera del Provider. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
