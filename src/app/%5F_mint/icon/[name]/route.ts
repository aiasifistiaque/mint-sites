// One icon of the curated set as an SVG file — the editor's icon picker shows
// these, so the admin app never bundles an icon library of its own.
import { ICONS } from '@/blocks/icon/icons';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
	const name = (await params).name.replace(/\.svg$/, '');
	const body = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : null;
	if (!body) return new Response('Not found', { status: 404 });
	return new Response(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">${body}</svg>`, {
		headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=86400' },
	});
}
