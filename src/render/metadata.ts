// A published page's <head>: title (with the site's title template), description,
// canonical, robots, Open Graph / Twitter cards, favicon and search-engine
// verification — all from the render answer. The page's SEO is the AGS VSeo's
// (backend docs/site-builder SB-31), read the way the AGS frontend's
// buildMetadata reads it: what the page sets, then the meta title/description/
// share image, then the site's defaults (already filled in by the backend).
import type { Metadata } from 'next';
import type { RenderData } from '@/lib/api';

const OG_TYPES = new Set(['website', 'article', 'book', 'profile']);

export const absolute = (url: string, origin: string) => {
	if (!url) return undefined;
	if (/^https?:\/\//.test(url)) return url;
	return origin && url.startsWith('/') ? `${origin}${url}` : undefined;
};

/** The page's title, description, address and image as search engines get them — also for JSON-LD. */
export function resolvedSeo(data: RenderData, origin: string) {
	const { page } = data;
	const seo = page.seo;
	const isHome = page.path === '/';
	const template = seo.titleTemplate.includes('%s') ? seo.titleTemplate : '';
	const title = !isHome && template ? template.replace('%s', seo.title) : seo.title;
	const canonical = seo.canonical || (origin ? `${origin}${isHome ? '' : page.path}` : undefined);
	return { seo, isHome, title, description: seo.description || undefined, canonical, image: absolute(seo.image, origin) };
}

export function pageMetadata(data: RenderData, origin: string): Metadata {
	const { site, tags } = data;
	const { seo, title, description, canonical, image } = resolvedSeo(data, origin);
	const v = tags.verification;

	const ogTitle = seo.ogTitle || title;
	const ogDescription = seo.ogDescription || description;
	const ogType = seo.ogType && OG_TYPES.has(seo.ogType) ? seo.ogType : 'website';
	const twitterImage = absolute(seo.twitterImage || '', origin) || image;

	const index = !seo.noIndex;
	const follow = !seo.noIndex && !seo.noFollow;
	// Only when something is set: the default (index, follow, Google chooses) needs no tag.
	const custom = seo.noIndex || seo.noFollow || seo.noArchive || seo.noImageIndex || (seo.maxSnippet ?? -1) !== -1 || (seo.maxImagePreview && seo.maxImagePreview !== 'large');
	const googleBot = {
		index,
		follow,
		'max-snippet': seo.maxSnippet ?? -1,
		'max-image-preview': seo.maxImagePreview || 'large',
		...(seo.noArchive && { noarchive: true }),
		...(seo.noImageIndex && { noimageindex: true }),
	} as const;

	return {
		title: { absolute: title },
		description,
		keywords: seo.keywords?.length ? seo.keywords : undefined,
		...(origin && { metadataBase: new URL(origin) }),
		alternates: canonical ? { canonical } : undefined,
		robots: custom ? { index, follow, ...(seo.noArchive && { noarchive: true }), ...(seo.noImageIndex && { noimageindex: true }), googleBot } : undefined,
		icons: site.favicon ? { icon: absolute(site.favicon, origin) || site.favicon } : undefined,
		openGraph: {
			type: ogType,
			siteName: site.name,
			title: ogTitle,
			description: ogDescription,
			url: canonical,
			locale: site.locale,
			...(image && { images: [{ url: image, alt: seo.ogImageAlt || ogTitle }] }),
		},
		twitter: {
			card: seo.twitterCard || (twitterImage ? 'summary_large_image' : 'summary'),
			title: seo.twitterTitle || ogTitle,
			description: seo.twitterDescription || ogDescription,
			...(twitterImage && { images: [twitterImage] }),
		},
		verification: v && (v.google || v.bing) ? { ...(v.google && { google: v.google }), ...(v.bing && { other: { 'msvalidate.01': v.bing } }) } : undefined,
	} as Metadata;
}
