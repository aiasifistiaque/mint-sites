import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { RenderData } from '@/lib/api';
import { SiteCodeBody, splitHead } from '@/render/SiteCode';
import { pageSchemas } from '@/render/JsonLd';

describe('Add script (SB-30)', () => {
	it('hoists meta and link tags and keeps the rest in order', () => {
		const { hoisted, rest } = splitHead(
			'<meta name="facebook-domain-verification" content="abc"><!-- a note --><script>window.x=1</script>\n<link rel="preconnect" href="https://cdn.test" crossorigin><noscript><img src="/p"></noscript>'
		);
		expect(hoisted).toEqual([
			{ tag: 'meta', attrs: { name: 'facebook-domain-verification', content: 'abc' } },
			{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://cdn.test', crossOrigin: true } },
		]);
		expect(rest).toBe('<!-- a note --><script>window.x=1</script>\n<noscript><img src="/p"></noscript>');
	});
	it('drops event handlers from hoisted tags', () => {
		expect(splitHead('<link rel="icon" href="/i.png" onload="alert(1)">').hoisted[0].attrs).toEqual({ rel: 'icon', href: '/i.png' });
	});
	it('prints body code as pasted, so its scripts run on load', () => {
		const html = renderToStaticMarkup(<SiteCodeBody html='<div id="chat"></div><script src="https://w.test/w.js"></script>' place='bodyEnd' />);
		expect(html).toContain('data-mint-code="bodyEnd"');
		expect(html).toContain('<div id="chat"></div><script src="https://w.test/w.js"></script>');
		expect(renderToStaticMarkup(<SiteCodeBody html='  ' place='bodyStart' />)).toBe('');
	});
});

const page = (over: Record<string, unknown> = {}, path = '/services') =>
	({
		site: { name: 'AGS', logo: '/logo.png', contact: { email: 'hi@ags.test' }, social: { facebook: 'https://facebook.com/ags', x: '' } },
		crumbs: path === '/' ? [{ label: 'Home', path: '/' }] : [{ label: 'Home', path: '/' }, { label: 'Services', path: '/services' }],
		page: { path, seo: { title: 'Services', titleTemplate: '%s | AGS', description: 'What we do', image: '', canonical: '', keywords: [], noIndex: false, ...over } },
	}) as unknown as RenderData;

describe('structured data (SB-31)', () => {
	it('auto is a WebPage, merged with custom JSON-LD, plus breadcrumbs', () => {
		const [web, crumbs] = pageSchemas(page({ schemaJson: '{"@type":"Service","areaServed":"BD"}' }), 'https://ags.test');
		expect(web).toMatchObject({ '@type': 'Service', name: 'Services | AGS', url: 'https://ags.test/services', areaServed: 'BD' });
		expect(crumbs).toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [{ position: 1, item: 'https://ags.test' }, { position: 2, name: 'Services', item: 'https://ags.test/services' }] });
	});
	it('none leaves the page out; bad JSON is ignored; the home page adds WebSite and Organization', () => {
		expect(pageSchemas(page({ schemaType: 'none' }), 'https://ags.test').map(s => s['@type'])).toEqual(['BreadcrumbList']);
		expect(pageSchemas(page({ schemaJson: '{oops' }), 'https://ags.test')[0]['@type']).toBe('WebPage');
		const home = pageSchemas(page({ schemaType: 'LocalBusiness' }, '/'), 'https://ags.test');
		expect(home.map(s => s['@type'])).toEqual(['LocalBusiness', 'WebSite', 'Organization']);
		expect(home[2]).toMatchObject({ logo: 'https://ags.test/logo.png', email: 'hi@ags.test', sameAs: ['https://facebook.com/ags'] });
	});
});
