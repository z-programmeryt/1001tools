'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = (localStorage.getItem('np:theme') as Theme | null) ?? 'system';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  const updateTheme = (next: Theme) => {
    setTheme(next);
    localStorage.setItem('np:theme', next);
    if (next === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', dark);
    } else {
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
  };

  return { theme, updateTheme };
}
