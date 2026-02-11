import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function pageMetadata(title: string, description: string, path = ''): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description
    }
  };
}
