// Every request: which site is this host (backend /public/sites/resolve,
// cached a minute) → rewrite to /_s/<slug>/<path>, passing the project id and
// the site's origin on as request headers. Unknown hosts get "No site here".
// /__mint (the editor's canvas, the fixture) and /api (revalidate) are the
// renderer's own. Nothing else is: a path like /_s/other on a site's domain
// is just a path of that site, so one site can never be shown on another's.
import { NextResponse, type NextRequest } from 'next/server';
import { resolveHost } from '@/lib/api';

export const config = {
	matcher: ['/((?!_next/static|api/).*)'],
};

export async function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;
	if (pathname === '/__mint' || pathname.startsWith('/__mint/')) return NextResponse.next();

	const host = request.headers.get('host') || '';
	const site = host ? await resolveHost(host) : null;
	if (!site) return NextResponse.rewrite(new URL('/_nosite', request.url));

	const proto = (request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')).split(',')[0];
	const headers = new Headers(request.headers);
	headers.set('x-mint-site', site.slug);
	headers.set('x-mint-project', site.projectId);
	headers.set('x-mint-origin', `${proto}://${host}`);
	const url = new URL(`/_s/${site.slug}${pathname === '/' ? '' : pathname}${search}`, request.url);
	return NextResponse.rewrite(url, { request: { headers } });
}
