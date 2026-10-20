// The tenant's own scripts — Site setup → Add script (backend docs/site-builder
// SB-30) — printed into the page's HTML, so they run on the first load and
// checkers that read the HTML see them (track.js is told not to add them too).
//
// "In <head>": <meta> and <link> become React elements, which React puts in
// <head>; everything else (inline scripts, <noscript>, <style>…) goes first in
// <body>, in the order it was pasted — a script there runs before the page
// does, which is what head snippets need. "Start/End of <body>": as pasted.
// Raw HTML in a display:contents wrapper: the browser runs scripts in it as it
// reads the page; React leaves what's inside alone.
import type { ReactNode } from 'react';

const ATTR_NAMES: Record<string, string> = {
	charset: 'charSet',
	'http-equiv': 'httpEquiv',
	crossorigin: 'crossOrigin',
	hreflang: 'hrefLang',
	referrerpolicy: 'referrerPolicy',
	itemprop: 'itemProp',
	class: 'className',
	fetchpriority: 'fetchPriority',
	imagesizes: 'imageSizes',
	imagesrcset: 'imageSrcSet',
};

const attrsOf = (raw: string) => {
	const out: Record<string, string | boolean> = {};
	const re = /([^\s"'<>\/=]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(raw))) {
		const name = m[1].toLowerCase();
		// Never an event handler on a hoisted tag.
		if (name.startsWith('on')) continue;
		out[ATTR_NAMES[name] || name] = m[2] === undefined ? true : (m[3] ?? m[4] ?? m[5] ?? '');
	}
	return out;
};

/** Splits head code into hoistable tags (<meta>, <link>) and the rest, in order. */
export function splitHead(html: string) {
	const hoisted: { tag: 'meta' | 'link'; attrs: Record<string, string | boolean> }[] = [];
	const rest = html.replace(/<!--[\s\S]*?-->|<(meta|link)\b([^>]*?)\/?>/gi, (whole, tag, attrs) => {
		if (!tag) return whole;
		hoisted.push({ tag: tag.toLowerCase(), attrs: attrsOf(attrs || '') });
		return '';
	});
	return { hoisted, rest: rest.trim() };
}

const Raw = ({ html, place }: { html: string; place: string }) => (
	<div
		data-mint-code={place}
		style={{ display: 'contents' }}
		suppressHydrationWarning
		dangerouslySetInnerHTML={{ __html: html }}
	/>
);

export function SiteCodeHead({ html }: { html?: string }) {
	if (!html?.trim()) return null;
	const { hoisted, rest } = splitHead(html);
	const tags: ReactNode[] = hoisted.map(({ tag, attrs }, i) => (tag === 'meta' ? <meta key={`m${i}`} {...(attrs as any)} /> : <link key={`l${i}`} {...(attrs as any)} />));
	return (
		<>
			{tags}
			{rest && <Raw html={rest} place='head' />}
		</>
	);
}

export function SiteCodeBody({ html, place }: { html?: string; place: 'bodyStart' | 'bodyEnd' }) {
	if (!html?.trim()) return null;
	return <Raw html={html} place={place} />;
}
