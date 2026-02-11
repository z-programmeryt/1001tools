import { notFound } from 'next/navigation';
import { tools } from '@/lib/tools-data';
import { pageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return pageMetadata(`${tool.name} - Free Online Tool`, tool.description, `/tools/${tool.slug}`);
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <article className="py-10 space-y-6">
      <header className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold">{tool.name}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{tool.description}</p>
      </header>
      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold">How to Use {tool.name}</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Enter your input data.</li>
          <li>Click process button.</li>
          <li>Copy or download output.</li>
        </ol>
      </section>
      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">All processing is privacy-focused and browser-friendly.</p>
      </section>
    </article>
  );
}
