import Link from 'next/link';
import { tools } from '@/lib/tools-data';

export default function ToolsDropdown() {
  return (
    <div className="group relative">
      <button className="glass rounded-full px-4 py-2 text-sm">All Tools ▾</button>
      <div className="invisible absolute left-0 top-12 z-40 grid w-[min(920px,94vw)] grid-cols-2 gap-2 rounded-2xl p-3 opacity-0 transition group-hover:visible group-hover:opacity-100 md:grid-cols-4 glass">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-xl border border-transparent p-2 text-sm hover:border-slate-300 dark:hover:border-indigo-300/40">
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
