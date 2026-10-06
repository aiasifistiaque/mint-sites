// A published page's <head>: title (with the site's title template), description,
// canonical, robots, Open Graph / Twitter cards, favicon and search-engine
// verification — all from the render answer.
import type { Metadata } from 'next';
import type { RenderData } from '@/lib/api';

const absolute = (url: string, origin: string) => {
	if (!url) return undefined;
	if (/^https?:\/\//.test(url)) return url;
	return origin && url.startsWith('/') ? `${origin}${url}` : undefined;
};

export function pageMetadata(data: RenderData, origin: string): Metadata {
	const { page, site, tags } = data;
	const seo = page.seo;
	const isHome = page.path === '/';
	const template = seo.titleTemplate.includes('%s') ? seo.titleTemplate : '';
	const title = !isHome && template ? template.replace('%s', seo.title) : seo.title;
	const canonical = seo.canonical || (origin ? `${origin}${isHome ? '' : page.path}` : undefined);
	const image = absolute(seo.image, origin);
	const v = tags.verification;
	return {
		title: { absolute: title },
		description: seo.description || undefined,
		keywords: seo.keywords?.length ? seo.keywords : undefined,
		...(origin && { metadataBase: new URL(origin) }),
		alternates: canonical ? { canonical } : undefined,
		robots: seo.noIndex ? { index: false, follow: false } : undefined,
		icons: site.favicon ? { icon: absolute(site.favicon, origin) || site.favicon } : undefined,
		openGraph: {
			type: 'website',
			siteName: site.name,
			title,
			description: seo.description || undefined,
			url: canonical,
			locale: site.locale,
			...(image && { images: [{ url: image }] }),
		},
		twitter: { card: image ? 'summary_large_image' : 'summary', title, description: seo.description || undefined, ...(image && { images: [image] }) },
		verification: v && (v.google || v.bing) ? { ...(v.google && { google: v.google }), ...(v.bing && { other: { 'msvalidate.01': v.bing } }) } : undefined,
	};
}
