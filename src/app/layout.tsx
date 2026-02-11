import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} - AI Tools Directory`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main className="mx-auto w-[min(1240px,92%)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
