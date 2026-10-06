// A published page of a builder site (backend docs/site-builder SB-04). The
// proxy rewrote <host>/<path> to /_s/<slug>/<path> and passed the project id
// and the site's origin as headers. Data comes from the backend's render API,
// cached until the next Publish (lib/api.ts).
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { getRender } from '@/lib/api';
import { LivePage } from '@/render/LivePage';
import { pageMetadata } from '@/render/metadata';

type Props = { params: Promise<{ site: string; path?: string[] }>; searchParams: Promise<{ page?: string | string[] }> };

const load = async ({ params, searchParams }: Props) => {
	const { site, path } = await params;
	const raw = (await searchParams).page;
	const page = Math.min(Math.max(parseInt(String(Array.isArray(raw) ? raw[0] : raw || '1'), 10) || 1, 1), 1000);
	const h = await headers();
	// Only reachable through the proxy, which names the site itself.
	if (h.get('x-mint-site') !== site) notFound();
	const pagePath = `/${(path || []).join('/')}`;
	const result = await getRender(site, pagePath, h.get('x-mint-project') || undefined, page);
	return { site, result, origin: h.get('x-mint-origin') || '' };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { site, result, origin } = await load(props);
	if (result.kind === 'page') return pageMetadata(result.data, origin);
	if (result.kind === 'redirect') return {};
	// The 404 (not-found.tsx can't set metadata): the site's own /404 page's, or "Page not found · <site>".
	const h = await headers();
	const projectId = h.get('x-mint-project') || undefined;
	const own = await getRender(site, '/404', projectId).catch(() => null);
	if (own?.kind === 'page') return { ...pageMetadata(own.data, origin), alternates: undefined };
	const home = await getRender(site, '/', projectId).catch(() => null);
	return { title: { absolute: home?.kind === 'page' ? `Page not found · ${home.data.site.name}` : 'Page not found' } };
}

export default async function SitePage(props: Props) {
	const { site, result } = await load(props);
	if (result.kind === 'redirect') {
		if (result.status === 308) permanentRedirect(result.to);
		redirect(result.to);
	}
	if (result.kind === 'not-found') notFound();
	return <LivePage data={result.data} slug={site} />;
}
