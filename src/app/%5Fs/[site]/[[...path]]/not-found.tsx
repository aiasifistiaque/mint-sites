// A path with no published page: the site's own /404 page if it has one,
// otherwise a plain "Page not found" in the site's theme, header and footer.
// The status stays 404 either way.
import { headers } from 'next/headers';
import { getRender } from '@/lib/api';
import { LivePage } from '@/render/LivePage';
import type { Node } from '@/types';

const DEFAULT_404: Node[] = [
	{
		id: 'nf404sec',
		type: 'section',
		props: { width: 'narrow', paddingY: 'xl' },
		children: [
			{
				id: 'nf404stk',
				type: 'stack',
				props: { direction: 'column', gap: 6, align: 'center' },
				style: { base: { textAlign: 'center' } },
				children: [
					{ id: 'nf404hed', type: 'heading', props: { text: 'Page not found', level: 1 } },
					{ id: 'nf404txt', type: 'text', props: { html: '<p>The page you’re looking for isn’t here. It may have moved.</p>', size: 'lg', muted: true } },
					{ id: 'nf404btn', type: 'button', props: { label: 'Go to the home page', variant: 'primary' }, action: { type: 'link', href: '/' } },
				],
			},
		],
	},
];

export default async function SiteNotFound() {
	const h = await headers();
	const slug = h.get('x-mint-site');
	const projectId = h.get('x-mint-project') || undefined;
	if (slug) {
		const own = await getRender(slug, '/404', projectId).catch(() => null);
		// The title comes from the page's generateMetadata (not-found files can't set one).
		if (own?.kind === 'page') return <LivePage data={own.data} slug={slug} />;
		const home = await getRender(slug, '/', projectId).catch(() => null);
		if (home?.kind === 'page') return <LivePage data={home.data} slug={slug} tree={DEFAULT_404} />;
	}
	return (
		<main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '15vh auto', padding: '0 16px' }}>
			<h1 style={{ fontSize: 22, fontWeight: 600 }}>Page not found</h1>
			<p style={{ color: '#666' }}>There’s nothing at this address.</p>
		</main>
	);
}
