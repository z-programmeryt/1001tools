import FadeIn from '@/components/animations/FadeIn';
import Hero from '@/components/home/Hero';
import PopularTools from '@/components/home/PopularTools';
import ToolsGrid from '@/components/home/ToolsGrid';

export default function HomePage() {
  return (
    <>
      <FadeIn><Hero /></FadeIn>
      <FadeIn><PopularTools /></FadeIn>
      <FadeIn><ToolsGrid /></FadeIn>
    </>
  );
}
