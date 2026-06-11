import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const SENTINEL = Symbol('ThemeProvider');
const ThemeProviderContext = createContext<typeof SENTINEL | ThemeProviderState>(SENTINEL);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'yds-ui-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.removeAttribute('data-theme');
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {}
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === SENTINEL)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};