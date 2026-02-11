import Link from 'next/link';
import { tools } from '@/lib/tools-data';

export default function PopularTools() {
  const popular = tools.filter((t) => t.popular);
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">Popular Tools</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="glass rounded-xl p-4">
            <h3 className="font-semibold">{tool.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
