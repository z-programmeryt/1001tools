import ToolGrid from '@/components/tools/ToolGrid';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('All Tools', 'Browse all available tools with drag-and-drop custom ordering.', '/tools');

export default function ToolsPage() {
  return (
    <section className="py-10">
      <h1 className="mb-4 text-3xl font-bold">All Tools</h1>
      <ToolGrid />
    </section>
  );
}
