// The backend calls this after Publish or restore: drop the site's cached
// pages so the next request renders the new version. The body is signed with
// SITE_REVALIDATE_SECRET (x-mint-signature: hex HMAC-SHA256 of the raw body).
import { createHmac, timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
	const secret = process.env.SITE_REVALIDATE_SECRET;
	if (!secret) return Response.json({ error: 'not configured' }, { status: 503 });
	const raw = await request.text();
	const sent = request.headers.get('x-mint-signature') || '';
	const expected = createHmac('sha256', secret).update(raw).digest('hex');
	if (sent.length !== expected.length || !timingSafeEqual(Buffer.from(sent), Buffer.from(expected)))
		return Response.json({ error: 'bad signature' }, { status: 401 });

	let body: { tag?: unknown; slug?: unknown };
	try {
		body = JSON.parse(raw);
	} catch {
		return Response.json({ error: 'bad body' }, { status: 400 });
	}
	const tags: string[] = [];
	if (typeof body.tag === 'string' && /^site:[a-f0-9]{24}$/.test(body.tag)) tags.push(body.tag);
	if (typeof body.slug === 'string' && /^[a-z0-9][a-z0-9-]{0,119}$/.test(body.slug)) tags.push(`site-slug:${body.slug}`);
	if (!tags.length) return Response.json({ error: 'nothing to revalidate' }, { status: 400 });
	// expire 0: the next request renders fresh instead of being served the old page.
	for (const tag of tags) revalidateTag(tag, { expire: 0 });
	console.log(`revalidated ${tags.join(', ')}`);
	return Response.json({ revalidated: true, tags });
}
