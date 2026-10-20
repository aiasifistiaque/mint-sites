import { describe, expect, it } from 'vitest';
import type { RenderData } from '@/lib/api';
import { pageMetadata } from '@/render/metadata';

const data = (over: Partial<RenderData['page']> = {}, tags: Partial<RenderData['tags']> = {}): RenderData =>
	({
		site: { name: 'Acme', favicon: '/fav.png', locale: 'en' },
		tags: { head: '', bodyStart: '', bodyEnd: '', ...tags },
		page: {
			id: 'p1',
			path: '/about',
			name: 'About',
			tree: [],
			seo: { title: 'About', titleTemplate: '%s · Acme', description: 'Who we are', image: '/og.png', noIndex: false, canonical: '', keywords: [] },
			...over,
		},
	}) as unknown as RenderData;

describe('pageMetadata', () => {
	it('applies the title template (not on the home page) and makes URLs absolute', () => {
		const m = pageMetadata(data(), 'https://acme.test');
		expect(m.title).toEqual({ absolute: 'About · Acme' });
		expect(m.alternates).toEqual({ canonical: 'https://acme.test/about' });
		expect(m.icons).toEqual({ icon: 'https://acme.test/fav.png' });
		expect((m.openGraph as any).images).toEqual([{ url: 'https://acme.test/og.png', alt: 'About · Acme' }]);
		expect(m.robots).toBeUndefined();
		expect(pageMetadata(data({ path: '/', seo: { ...data().page.seo, title: 'Acme' } }), 'https://acme.test').title).toEqual({ absolute: 'Acme' });
	});
	it('noIndex, the page’s own canonical, verification', () => {
		const m = pageMetadata(
			data({ seo: { ...data().page.seo, noIndex: true, canonical: 'https://acme.com/about' } }, { verification: { google: 'g-123', bing: 'b-456' } }),
			'https://acme.test'
		);
		expect(m.robots).toMatchObject({ index: false, follow: false, googleBot: { index: false, follow: false } });
		expect(m.alternates).toEqual({ canonical: 'https://acme.com/about' });
		expect(m.verification).toEqual({ google: 'g-123', other: { 'msvalidate.01': 'b-456' } });
	});
	it('the AGS VSeo’s social and indexing fields (SB-31)', () => {
		const seo = {
			...data().page.seo,
			ogTitle: 'Study abroad with us',
			ogDescription: 'Free counselling',
			ogType: 'article' as const,
			ogImageAlt: 'Students',
			twitterCard: 'summary' as const,
			twitterTitle: 'On X',
			twitterImage: 'https://cdn.test/x.png',
			noFollow: true,
			noArchive: true,
			maxSnippet: 50,
			maxImagePreview: 'standard' as const,
		};
		const m = pageMetadata(data({ seo }), 'https://acme.test');
		expect(m.openGraph).toMatchObject({ type: 'article', title: 'Study abroad with us', description: 'Free counselling', images: [{ url: 'https://acme.test/og.png', alt: 'Students' }] });
		expect(m.twitter).toMatchObject({ card: 'summary', title: 'On X', description: 'Free counselling', images: ['https://cdn.test/x.png'] });
		expect(m.robots).toEqual({
			index: true,
			follow: false,
			noarchive: true,
			googleBot: { index: true, follow: false, 'max-snippet': 50, 'max-image-preview': 'standard', noarchive: true },
		});
	});
});
