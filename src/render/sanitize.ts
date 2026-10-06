// Rich text and URLs from page data. Rich text keeps only the allowlist in the
// README (p, h2–h4, strong, em, a, ul, ol, li, br, blockquote, code) and comes
// out balanced, so it can't close the element it's drawn in.

const ALLOWED = new Set(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'blockquote', 'code']);
const ALIAS: Record<string, string> = { b: 'strong', i: 'em' };
const VOID = new Set(['br']);
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|template|noscript|svg|math)\b[\s\S]*?<\/\1\s*>/gi;

/** Relative paths, anchors, http(s), mailto and tel — never javascript: or data:. */
export function isSafeHref(href: unknown): href is string {
	if (typeof href !== 'string') return false;
	const h = href.trim();
	if (!h || h.length > 2048 || /[\u0000-\u001f\s]/.test(h)) return false;
	if (h.startsWith('/') && !h.startsWith('//')) return true;
	if (h.startsWith('#') || h.startsWith('?')) return true;
	return /^(https?:\/\/[^/]|mailto:|tel:)/i.test(h);
}

export const escapeHtml = (s: string) =>
	s.replace(/&(?!(#\d{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,31});)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const attrValue = (attrs: string, name: string) => {
	const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'));
	return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null;
};
const decodeEntities = (s: string) =>
	s
		.replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&colon;/gi, ':')
		.replace(/&tab;|&newline;/gi, '')
		.replace(/&amp;/gi, '&');

export function sanitizeRichText(input: unknown): string {
	if (typeof input !== 'string' || !input) return '';
	const html = input.slice(0, 100_000).replace(/<!--[\s\S]*?-->/g, '').replace(DROP_WITH_CONTENT, '');
	const out: string[] = [];
	const open: string[] = [];
	const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|<|[^<]+/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(html))) {
		const token = m[0];
		if (!m[1]) {
			out.push(escapeHtml(token));
			continue;
		}
		const raw = m[1].toLowerCase();
		const tag = ALIAS[raw] || raw;
		if (!ALLOWED.has(tag)) continue;
		if (token.startsWith('</')) {
			const at = open.lastIndexOf(tag);
			if (at === -1) continue;
			while (open.length > at) out.push(`</${open.pop()}>`);
			continue;
		}
		if (VOID.has(tag)) {
			out.push(`<${tag}>`);
			continue;
		}
		if (tag === 'a') {
			const href = attrValue(m[2], 'href');
			const decoded = href === null ? null : decodeEntities(href);
			const safe = decoded !== null && isSafeHref(decoded);
			const external = safe && /^https?:/i.test(decoded!);
			out.push(
				safe ? `<a href="${escapeHtml(decoded!)}"${external ? ' rel="noopener noreferrer" target="_blank"' : ''}>` : '<a>'
			);
		} else out.push(`<${tag}>`);
		open.push(tag);
	}
	while (open.length) out.push(`</${open.pop()}>`);
	return out.join('');
}
