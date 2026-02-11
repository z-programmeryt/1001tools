'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, updateTheme } = useTheme();
  return (
    <select value={theme} onChange={(e) => updateTheme(e.target.value as 'light' | 'dark' | 'system')} className="glass rounded-full px-3 py-2 text-sm">
      <option value="light">🌞</option>
      <option value="dark">🌙</option>
      <option value="system">💻</option>
    </select>
  );
}
