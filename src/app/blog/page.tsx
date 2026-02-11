import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Blog', 'Tutorials, updates and SEO content for tools.', '/blog');

export default function BlogPage() {
  return <section className="py-10"><h1 className="text-3xl font-bold">Blog</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Content hub for updates and guides.</p></section>;
}
