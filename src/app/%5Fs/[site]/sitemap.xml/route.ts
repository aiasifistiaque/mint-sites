// The site's sitemap, from the backend, with this request's address in it. Past 5,000 addresses it's an index of
// numbered parts, /sitemap.xml?part=2 (backend docs/seo SEO-08).
import { headers } from 'next/headers';
import { API, backendHeaders, RENDER_TTL } from '@/lib/api';

export async function GET(req: Request, { params }: { params: Promise<{ site: string }> }) {
	const { site } = await params;
	const h = await headers();
	if (h.get('x-mint-site') !== site) return new Response('Not found', { status: 404 });
	const origin = h.get('x-mint-origin') || '';
	const part = new URL(req.url).searchParams.get('part');
	const extra = part && /^\d{1,4}$/.test(part) ? `&part=${part}` : '';
	const res = await fetch(`${API}/public/api/${encodeURIComponent(site)}/site/sitemap.xml?origin=${encodeURIComponent(origin)}${extra}`, {
		headers: backendHeaders(),
		next: { tags: [`site-slug:${site}`, ...(h.get('x-mint-project') ? [`site:${h.get('x-mint-project')}`] : [])], revalidate: RENDER_TTL },
	});
	if (!res.ok) return new Response('Not found', { status: 404 });
	return new Response(await res.text(), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
