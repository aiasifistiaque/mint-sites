// Structured data for a published page (backend docs/site-builder SB-31), as
// the AGS frontend writes it: the page's own schema (SEO → Structured data:
// "auto" is a WebPage, "none" leaves it out) with the page's custom JSON-LD
// merged over it, a BreadcrumbList when the page sits below another, and on
// the home page the WebSite and the Organization. `<` is escaped so nothing
// in it can close the script tag.
import type { RenderData } from '@/lib/api';
import { absolute, resolvedSeo } from './metadata';

const custom = (raw?: string) => {
	if (!raw?.trim()) return null;
	try {
		const v = JSON.parse(raw);
		return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
	} catch {
		return null;
	}
};

const clean = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)));

export function pageSchemas(data: RenderData, origin: string) {
	const { seo, isHome, title, description, canonical, image } = resolvedSeo(data, origin);
	const site = data.site;
	const home = origin || '';
	const out: Record<string, unknown>[] = [];
	const type = seo.schemaType || 'auto';

	if (type !== 'none') {
		const generated = clean({
			'@context': 'https://schema.org',
			'@type': type === 'auto' ? 'WebPage' : type,
			name: title,
			description,
			url: canonical,
			image,
			...(home && { isPartOf: { '@id': `${home}/#website` } }),
		});
		out.push({ ...generated, ...(custom(seo.schemaJson) || {}) });
	}

	const crumbs = data.crumbs || [];
	if (crumbs.length > 1)
		out.push({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: crumbs.map((c, i) => clean({ '@type': 'ListItem', position: i + 1, name: c.label, item: home ? (c.path === '/' ? home : `${home}${c.path}`) : undefined })),
		});

	if (isHome && home) {
		const sameAs = Object.values(site.social || {}).filter(v => typeof v === 'string' && /^https?:\/\//.test(v));
		out.push(clean({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${home}/#website`, name: site.name, url: home, publisher: { '@id': `${home}/#organization` } }));
		out.push(
			clean({
				'@context': 'https://schema.org',
				'@type': 'Organization',
				'@id': `${home}/#organization`,
				name: site.name,
				url: home,
				logo: absolute(site.logo, origin),
				email: site.contact?.email,
				telephone: site.contact?.phone,
				sameAs,
			})
		);
	}
	return out;
}

export function JsonLd({ data, origin }: { data: RenderData; origin: string }) {
	return (
		<>
			{pageSchemas(data, origin).map((block, i) => (
				<script
					key={i}
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\\u003c') }}
				/>
			))}
		</>
	);
}
