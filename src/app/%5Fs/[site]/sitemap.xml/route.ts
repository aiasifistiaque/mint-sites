// The site's sitemap, from the backend, with this request's address in it.
import { headers } from 'next/headers';
import { API, backendHeaders, RENDER_TTL } from '@/lib/api';

export async function GET(_req: Request, { params }: { params: Promise<{ site: string }> }) {
	const { site } = await params;
	const h = await headers();
	if (h.get('x-mint-site') !== site) return new Response('Not found', { status: 404 });
	const origin = h.get('x-mint-origin') || '';
	const res = await fetch(`${API}/public/api/${encodeURIComponent(site)}/site/sitemap.xml?origin=${encodeURIComponent(origin)}`, {
		headers: backendHeaders(),
		next: { tags: [`site-slug:${site}`, ...(h.get('x-mint-project') ? [`site:${h.get('x-mint-project')}`] : [])], revalidate: RENDER_TTL },
	});
	if (!res.ok) return new Response('Not found', { status: 404 });
	return new Response(await res.text(), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
