// A tree's node styles → one CSS string (D3, D14). Each node gets
// `[data-n="<id>"]{…}` rules, mobile first, with `@media (min-width:768px)` and
// `(min-width:1024px)` groups. Values are checked against the style schema and
// anything unknown is dropped, so data can never write raw CSS.
import type { Breakpoint, Node, Style } from '@/types';
import { isValidStyleValue } from './styleSchema';

export const BREAKPOINTS: { key: Breakpoint; min: number }[] = [
	{ key: 'base', min: 0 },
	{ key: 'md', min: 768 },
	{ key: 'lg', min: 1024 },
];

const ID = /^[A-Za-z0-9_-]{1,32}$/;
const MAX_DEPTH = 64;

const space = (n: number) => `var(--mint-space-${n})`;
const color = (c: string) =>
	c === 'transparent' || c === 'white' || c === 'black' ? c : `var(--mint-color-${c})`;

const ALIGN: Record<string, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	stretch: 'stretch',
	baseline: 'baseline',
};
const JUSTIFY: Record<string, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	between: 'space-between',
	around: 'space-around',
	evenly: 'space-evenly',
};
const MAX_WIDTH: Record<string, string> = {
	prose: '65ch',
	sm: '40rem',
	md: '48rem',
	lg: '64rem',
	xl: '80rem',
	container: 'var(--mint-container)',
	full: '100%',
};
export const FONT_SIZE: Record<string, string> = {
	xs: '0.75rem',
	sm: '0.875rem',
	base: '1rem',
	lg: '1.125rem',
	xl: '1.25rem',
	'2xl': '1.5rem',
	'3xl': '1.875rem',
	'4xl': '2.25rem',
	'5xl': '3rem',
	'6xl': '3.75rem',
};
const LEADING: Record<string, string> = {
	none: '1',
	tight: '1.25',
	snug: '1.375',
	normal: '1.5',
	relaxed: '1.625',
	loose: '2',
};
const TRACKING: Record<string, string> = {
	tighter: '-0.05em',
	tight: '-0.025em',
	normal: '0em',
	wide: '0.025em',
	wider: '0.05em',
	widest: '0.1em',
};

const len = (v: any) => (typeof v === 'string' ? v : `${v.n}${v.unit}`);
/** Percent-encode anything that could end a CSS url("…") or the <style> element. */
const cssUrl = (u: string) => `url("${u.replace(/["'()\\\s<>]/g, c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))}")`;

/** Only keys and values the schema allows. */
export function cleanStyle(style: unknown): Style {
	if (!style || typeof style !== 'object' || Array.isArray(style)) return {};
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(style)) if (isValidStyleValue(k, v)) out[k] = v;
	return out as Style;
}

/** Simple one-key → declarations. Background layers and display are handled apart. */
function declarations(s: Style): string[] {
	const d: string[] = [];
	const add = (prop: string, value: string | undefined) => value !== undefined && d.push(`${prop}:${value}`);
	if (s.display) add('display', s.display);
	add('flex-direction', s.direction);
	add('flex-wrap', s.wrap);
	if (s.gap !== undefined) add('gap', space(s.gap));
	if (s.rowGap !== undefined) add('row-gap', space(s.rowGap));
	if (s.align) add('align-items', ALIGN[s.align]);
	if (s.justify) add('justify-content', JUSTIFY[s.justify]);
	if (s.columns) add('grid-template-columns', `repeat(${s.columns},minmax(0,1fr))`);
	if (s.colSpan) add('grid-column', s.colSpan === 'full' ? '1/-1' : `span ${s.colSpan}/span ${s.colSpan}`);
	for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
		const p = s[`padding${side}`];
		if (p !== undefined) add(`padding-${side.toLowerCase()}`, space(p));
		const m = s[`margin${side}`];
		if (m !== undefined) add(`margin-${side.toLowerCase()}`, m === 'auto' ? 'auto' : space(m));
	}
	if (s.width) add('width', s.width === 'full' ? '100%' : len(s.width));
	if (s.maxWidth) add('max-width', MAX_WIDTH[s.maxWidth]);
	if (s.minHeight) add('min-height', len(s.minHeight));
	if (s.height) add('height', len(s.height));
	if (s.aspectRatio) add('aspect-ratio', s.aspectRatio.replace('/', ' / '));
	if (s.bgColor) add('background-color', color(s.bgColor));
	add('background-position', s.bgPosition);
	add('background-size', s.bgSize);
	if (s.borderWidth !== undefined) {
		add('border-width', `${s.borderWidth}px`);
		add('border-style', 'solid');
	}
	if (s.borderColor) add('border-color', color(s.borderColor));
	if (s.radius) add('border-radius', `var(--mint-radius-${s.radius})`);
	if (s.shadow) add('box-shadow', `var(--mint-shadow-${s.shadow})`);
	if (s.fontSize) add('font-size', FONT_SIZE[s.fontSize]);
	if (s.fontWeight) add('font-weight', String(s.fontWeight));
	add('text-align', s.textAlign);
	if (s.color) add('color', color(s.color));
	if (s.leading) add('line-height', LEADING[s.leading]);
	if (s.tracking) add('letter-spacing', TRACKING[s.tracking]);
	add('text-transform', s.transform);
	if (s.opacity !== undefined) add('opacity', String(s.opacity / 100));
	add('position', s.position);
	if (s.top !== undefined) add('top', space(s.top));
	if (s.zIndex !== undefined) add('z-index', String(s.zIndex));
	add('overflow', s.overflow);
	return d;
}

const BG_KEYS = ['bgImage', 'bgOverlay', 'bgOverlayOpacity', 'gradient'] as const;

/** background-image from the merged style: overlay on top, then the image, then the gradient. */
function backgroundImage(s: Style): string | undefined {
	const layers: string[] = [];
	if (s.bgOverlay) {
		const pct = s.bgOverlayOpacity ?? 50;
		const c = `color-mix(in srgb,${color(s.bgOverlay)} ${pct}%,transparent)`;
		layers.push(`linear-gradient(${c},${c})`);
	}
	if (s.bgImage) layers.push(cssUrl(s.bgImage));
	if (s.gradient) layers.push(`linear-gradient(${s.gradient.angle}deg,${color(s.gradient.from)},${color(s.gradient.to)})`);
	return layers.length ? layers.join(',') : undefined;
}

/** The CSS for one node, per breakpoint (declarations only, no selector). */
export function nodeRules(node: Pick<Node, 'style' | 'hidden'>): Record<Breakpoint, string[]> {
	const out: Record<Breakpoint, string[]> = { base: [], md: [], lg: [] };
	const own: Record<Breakpoint, Style> = {
		base: cleanStyle(node.style?.base),
		md: cleanStyle(node.style?.md),
		lg: cleanStyle(node.style?.lg),
	};
	let merged: Style = {};
	let wasHidden = false;
	for (const { key } of BREAKPOINTS) {
		const s = own[key];
		merged = { ...merged, ...s };
		const decl = declarations(s);
		// Background layers are one CSS property: rebuild it whenever a part changes.
		if (BG_KEYS.some(k => k in s)) {
			const img = backgroundImage(merged);
			decl.push(`background-image:${img ?? 'none'}`);
			if (merged.bgImage && !merged.bgSize) decl.push('background-size:cover');
			if (merged.bgImage) decl.push('background-repeat:no-repeat');
		}
		// Hidden is mobile first: hidden.base hides everywhere until md/lg says false.
		const h = node.hidden?.[key];
		const hidden: boolean = h === undefined ? wasHidden : h === true;
		const rest = decl.filter(x => !x.startsWith('display:'));
		if (hidden) { if (!wasHidden) rest.push('display:none'); }
		else if (wasHidden) rest.push(`display:${merged.display ?? 'revert-layer'}`);
		else if (s.display) rest.push(`display:${s.display}`);
		wasHidden = hidden;
		out[key] = rest;
	}
	return out;
}

function walk(nodes: unknown, depth: number, visit: (n: Node) => void) {
	if (!Array.isArray(nodes) || depth > MAX_DEPTH) return;
	for (const n of nodes) {
		if (!n || typeof n !== 'object') continue;
		visit(n as Node);
		walk((n as Node).children, depth + 1, visit);
		const slots = (n as Node).slots;
		if (slots && typeof slots === 'object') for (const s of Object.values(slots)) walk(s, depth + 1, visit);
	}
}

/** One CSS string for every node in the given tree(s). */
export function compileStyles(tree: Node[]): string {
	const groups: Record<Breakpoint, string[]> = { base: [], md: [], lg: [] };
	walk(tree, 0, node => {
		if (typeof node.id !== 'string' || !ID.test(node.id)) return;
		if (!node.style && !node.hidden) return;
		const rules = nodeRules(node);
		for (const { key } of BREAKPOINTS)
			if (rules[key].length) groups[key].push(`[data-n="${node.id}"]{${rules[key].join(';')}}`);
	});
	let css = groups.base.join('');
	for (const { key, min } of BREAKPOINTS.slice(1))
		if (groups[key].length) css += `@media (min-width:${min}px){${groups[key].join('')}}`;
	return css;
}
