// The backend's render API (backend docs/site-builder "Render API"). Every
// call carries x-mint-renderer so the backend knows it's the renderer (one
// server drawing every site would otherwise hit the public API's per-IP limit).
import { cache } from 'react';
import type { Node, TokenOverrides } from '@/types';

export const API = (process.env.MINT_API_URL || 'http://localhost:5031').replace(/\/$/, '');

export const backendHeaders = (): Record<string, string> =>
	process.env.SITE_REVALIDATE_SECRET ? { 'x-mint-renderer': process.env.SITE_REVALIDATE_SECRET } : {};

/** Seconds a rendered page's data is kept before it's fetched again (Publish clears it at once). */
export const RENDER_TTL = 300;

export type SeoResolved = {
	title: string;
	titleTemplate: string;
	description: string;
	image: string;
	noIndex: boolean;
	canonical: string;
	keywords: string[];
};

export type RenderData = {
	projectId: string;
	version: number;
	site: {
		name: string;
		tagline: string;
		logo: string;
		favicon: string;
		locale: string;
		contact: Record<string, string>;
		social: Record<string, string>;
		colorScheme: 'light' | 'dark' | 'system';
		origin: string;
	};
	design: { theme: string; tokens: TokenOverrides; colorScheme: 'light' | 'dark' | 'system' };
	layout: { header: Node[]; footer: Node[] } | null;
	page: { id: string; path: string; name: string; tree: Node[]; seo: SeoResolved };
	data: { record?: Record<string, unknown>; nodes: Record<string, unknown>; contents: Record<string, unknown> };
	menu: { label: string; path: string; children?: { label: string; path: string }[] }[];
	links: Record<string, string>;
	tags: {
		head: string;
		bodyStart: string;
		bodyEnd: string;
		verification?: { google: string; bing: string };
		tracker?: { src: string; project: string } | null;
	};
	widgets: { enabled: string[]; apiBase: string };
};

export type RenderResult =
	| { kind: 'page'; data: RenderData }
	| { kind: 'redirect'; to: string; status: 307 | 308 }
	| { kind: 'not-found' };

/** One page of a site, cached by tag (site:<projectId>, site-slug:<slug>) until Publish revalidates it. */
export const getRender = cache(async (slug: string, path: string, projectId?: string): Promise<RenderResult> => {
	const url = `${API}/public/api/${encodeURIComponent(slug)}/render?path=${encodeURIComponent(path)}`;
	const tags = [`site-slug:${slug}`, ...(projectId ? [`site:${projectId}`] : [])];
	const res = await fetch(url, { headers: backendHeaders(), next: { tags, revalidate: RENDER_TTL } });
	if (res.status === 404) return { kind: 'not-found' };
	if (!res.ok) throw new Error(`render ${slug}${path}: ${res.status}`);
	const body = await res.json();
	if (body.redirect) return { kind: 'redirect', to: body.redirect.to, status: body.redirect.status === 307 ? 307 : 308 };
	return { kind: 'page', data: body as RenderData };
});

/** Which site a host is — the backend's GET /public/sites/resolve, kept a minute in memory. */
type Resolved = { slug: string; projectId: string } | null;
const RESOLVE_TTL = 60_000;
const MISS_TTL = 10_000;
const resolved = new Map<string, { at: number; value: Resolved }>();

export async function resolveHost(host: string): Promise<Resolved> {
	const key = host.toLowerCase();
	const hit = resolved.get(key);
	if (hit && Date.now() - hit.at < (hit.value ? RESOLVE_TTL : MISS_TTL)) return hit.value;
	let value: Resolved = null;
	try {
		const res = await fetch(`${API}/public/sites/resolve?host=${encodeURIComponent(key)}`, { headers: backendHeaders(), cache: 'no-store' });
		if (res.ok) {
			const body = await res.json();
			if (typeof body?.slug === 'string' && typeof body?.projectId === 'string') value = { slug: body.slug, projectId: body.projectId };
		} else if (res.status !== 404) {
			// The backend is down or erroring: don't remember a miss.
			console.error(`resolve ${key}: ${res.status}`);
			return null;
		}
	} catch (e) {
		console.error(`resolve ${key}:`, (e as Error).message);
		return null;
	}
	if (resolved.size > 5000) resolved.clear();
	resolved.set(key, { at: Date.now(), value });
	return value;
}
