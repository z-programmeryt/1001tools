import Link from 'next/link';
import type { Tool } from '@/lib/tools-data';

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="glass rounded-2xl p-4">
      <p className="mb-2 text-xs text-slate-500">{tool.category}</p>
      <h3 className="font-semibold">{tool.name}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
      <Link href={`/tools/${tool.slug}`} className="mt-3 inline-block rounded-full border border-slate-300/50 px-3 py-1.5 text-sm">Open</Link>
    </article>
  );
}
