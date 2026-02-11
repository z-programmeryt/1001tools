import Link from 'next/link';
import { navItems } from '@/config/navigation';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import ToolsDropdown from './ToolsDropdown';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-300/30 bg-white/70 backdrop-blur-xl dark:border-indigo-300/20 dark:bg-slate-900/60">
      <div className="mx-auto flex w-[min(1240px,92%)] items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/" className="bg-gradient-to-r from-primary via-cyan to-rose bg-clip-text text-xl font-black text-transparent">NovaTools</Link>
        </div>
        <nav className="hidden items-center gap-2 lg:flex">
          <Link className="glass rounded-full px-4 py-2 text-sm" href="/">Home</Link>
          <ToolsDropdown />
          {navItems.filter((n) => !['Home', 'All', 'Tools'].includes(n.label)).map((item) => (
            <Link key={item.href + item.label} className="glass rounded-full px-4 py-2 text-sm" href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SearchModal />
          <ThemeToggle />
          <button className="glass h-10 w-10 rounded-full" aria-label="Login">👤</button>
        </div>
      </div>
    </header>
  );
}
