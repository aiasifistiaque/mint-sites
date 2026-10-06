// The site's robots.txt, from the backend; points at this address's sitemap
// when the site allows indexing and the backend doesn't know its address yet.
import { headers } from 'next/headers';
import { API, backendHeaders, RENDER_TTL } from '@/lib/api';

export async function GET(_req: Request, { params }: { params: Promise<{ site: string }> }) {
	const { site } = await params;
	const h = await headers();
	if (h.get('x-mint-site') !== site) return new Response('Not found', { status: 404 });
	const origin = h.get('x-mint-origin') || '';
	const res = await fetch(`${API}/public/api/${encodeURIComponent(site)}/site/robots.txt`, {
		headers: backendHeaders(),
		next: { tags: [`site-slug:${site}`, ...(h.get('x-mint-project') ? [`site:${h.get('x-mint-project')}`] : [])], revalidate: RENDER_TTL },
	});
	if (!res.ok) return new Response('Not found', { status: 404 });
	let text = await res.text();
	if (origin && /^Allow: \/$/m.test(text) && !/^Sitemap:/m.test(text)) text = `${text.trimEnd()}\n\nSitemap: ${origin}/sitemap.xml\n`;
	return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
