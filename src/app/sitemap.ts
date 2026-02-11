import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { tools } from '@/lib/tools-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/tools', '/blog', '/courses', '/about', '/contact', '/learn'];
  const staticMap = staticRoutes.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date() }));
  const toolsMap = tools.map((tool) => ({ url: `${siteConfig.url}/tools/${tool.slug}`, lastModified: new Date() }));
  return [...staticMap, ...toolsMap];
}
