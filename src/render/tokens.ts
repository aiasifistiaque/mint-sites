// Theme tokens → CSS variables (D3). Light values go on :root, dark ones on
// [data-theme=dark]; globals.css maps the variables into Tailwind (`bg-primary`,
// `text-foreground`, `rounded-md` …). Overrides come from the tenant's design,
// so every value is checked before it reaches CSS — bad ones keep the theme's.
import {
	COLOR_TOKENS,
	RADIUS_TOKENS,
	SHADOW_TOKENS,
	SPACE_STEPS,
	type FontToken,
	type TokenOverrides,
	type Tokens,
} from '@/types';

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\([0-9.,%\s/+-]+\))$/i;
const LENGTH = /^(0|-?[0-9]*\.?[0-9]+(px|rem|em|%))$/;
const SHADOW = /^(none|([0-9a-z.,%#()\s/-]+))$/i;
const FAMILY = /^[A-Za-z0-9 ]{1,40}$/;

export const isColor = (v: unknown): v is string => typeof v === 'string' && v.length <= 64 && COLOR.test(v.trim());
const isLength = (v: unknown): v is string => typeof v === 'string' && LENGTH.test(v.trim());
const isShadow = (v: unknown): v is string =>
	typeof v === 'string' && v.length <= 200 && SHADOW.test(v) && !/url|expression|var\(/i.test(v);
export const isFamily = (v: unknown): v is string => typeof v === 'string' && FAMILY.test(v);

/** Families the browser has without a download; never sent to Google Fonts. */
const SYSTEM_FAMILIES = new Set(['system-ui', 'sans-serif', 'serif', 'monospace', 'ui-sans-serif', 'ui-serif', 'ui-monospace']);
const FALLBACK: Record<keyof Tokens['fonts'], string> = {
	heading: 'ui-sans-serif, system-ui, sans-serif',
	body: 'ui-sans-serif, system-ui, sans-serif',
	mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

function mergeFont(base: FontToken, o: unknown): FontToken {
	const f = (o || {}) as Partial<FontToken>;
	const weights = Array.isArray(f.weights)
		? f.weights.filter(w => Number.isInteger(w) && w >= 100 && w <= 900 && w % 100 === 0).slice(0, 6)
		: [];
	const ok = isFamily(f.family) || SYSTEM_FAMILIES.has(String(f.family));
	return { family: ok ? f.family! : base.family, weights: weights.length ? weights : base.weights };
}

/** The theme's tokens with the design's overrides applied (invalid values ignored). */
export function mergeTokens(theme: Tokens, o: TokenOverrides | null | undefined): Tokens {
	if (!o || typeof o !== 'object') return theme;
	const colors = { ...theme.colors };
	for (const key of COLOR_TOKENS) {
		const c = o.colors?.[key];
		if (!c) continue;
		colors[key] = {
			light: isColor(c.light) ? c.light : theme.colors[key].light,
			dark: isColor(c.dark) ? c.dark : theme.colors[key].dark,
		};
	}
	const pick = <K extends string>(keys: readonly K[], base: Record<K, string>, over: any, ok: (v: unknown) => boolean) =>
		Object.fromEntries(keys.map(k => [k, ok(over?.[k]) ? over[k] : base[k]])) as Record<K, string>;
	const b = o.button || {};
	return {
		colors,
		fonts: {
			heading: mergeFont(theme.fonts.heading, o.fonts?.heading),
			body: mergeFont(theme.fonts.body, o.fonts?.body),
			mono: mergeFont(theme.fonts.mono, o.fonts?.mono),
		},
		radius: pick(RADIUS_TOKENS, theme.radius, o.radius, isLength),
		shadow: pick(SHADOW_TOKENS, theme.shadow, o.shadow, isShadow),
		space: pick(SPACE_STEPS.map(String) as `${(typeof SPACE_STEPS)[number]}`[], theme.space, o.space, isLength),
		container:
			Number.isInteger(o.container) && o.container! >= 640 && o.container! <= 1920 ? o.container! : theme.container,
		button: {
			radius: (RADIUS_TOKENS as readonly string[]).includes(b.radius as string) ? b.radius! : theme.button.radius,
			weight: [400, 500, 600, 700, 800].includes(b.weight as number) ? b.weight! : theme.button.weight,
			uppercase: typeof b.uppercase === 'boolean' ? b.uppercase : theme.button.uppercase,
		},
	};
}

const family = (f: FontToken, key: keyof Tokens['fonts']) =>
	SYSTEM_FAMILIES.has(f.family) ? FALLBACK[key] : `"${f.family}", ${FALLBACK[key]}`;

/**
 * CSS variables for the tokens. `scheme` decides where dark values apply:
 * 'toggle' (default) — on [data-theme=dark]; 'system' — also when the visitor's
 * system is dark and nothing forces light; 'light' / 'dark' — that one only.
 */
export function tokensToCss(t: Tokens, scheme: 'toggle' | 'system' | 'light' | 'dark' = 'toggle'): string {
	const lightColors = COLOR_TOKENS.map(k => `--mint-color-${k}:${t.colors[k].light}`);
	const darkColors = COLOR_TOKENS.map(k => `--mint-color-${k}:${t.colors[k].dark}`);
	const rest = [
		`--mint-font-heading:${family(t.fonts.heading, 'heading')}`,
		`--mint-font-body:${family(t.fonts.body, 'body')}`,
		`--mint-font-mono:${family(t.fonts.mono, 'mono')}`,
		...RADIUS_TOKENS.map(k => `--mint-radius-${k}:${t.radius[k]}`),
		...SHADOW_TOKENS.map(k => `--mint-shadow-${k}:${t.shadow[k]}`),
		...SPACE_STEPS.map(k => `--mint-space-${k}:${t.space[`${k}`]}`),
		`--mint-container:${t.container}px`,
		`--mint-button-radius:var(--mint-radius-${t.button.radius})`,
		`--mint-button-weight:${t.button.weight}`,
		`--mint-button-transform:${t.button.uppercase ? 'uppercase' : 'none'}`,
	];
	const light = `${[...lightColors, 'color-scheme:light'].join(';')}`;
	const dark = `${[...darkColors, 'color-scheme:dark'].join(';')}`;
	if (scheme === 'dark') return `:root,[data-theme]{${[...rest, dark].join(';')}}`;
	if (scheme === 'light') return `:root,[data-theme]{${[...rest, light].join(';')}}`;
	let css = `:root,[data-theme=light]{${[...rest, light].join(';')}}[data-theme=dark]{${dark}}`;
	if (scheme === 'system') css += `@media (prefers-color-scheme:dark){:root:not([data-theme=light]){${dark}}}`;
	return css;
}

/** Google Fonts stylesheet URL for the tokens' families (runtime, never at build — fails on Vercel). */
export function fontHref(t: Tokens): string | null {
	const byFamily = new Map<string, Set<number>>();
	for (const f of Object.values(t.fonts)) {
		if (SYSTEM_FAMILIES.has(f.family) || !isFamily(f.family)) continue;
		const set = byFamily.get(f.family) || new Set<number>();
		f.weights.forEach(w => set.add(w));
		byFamily.set(f.family, set);
	}
	if (!byFamily.size) return null;
	const families = [...byFamily.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, w]) => {
			const weights = [...w].sort((a, b) => a - b);
			return `family=${name.replace(/ /g, '+')}${weights.length ? `:wght@${weights.join(';')}` : ''}`;
		});
	return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/** The `tokens` part of the manifest: which keys a theme has and their kinds. */
export const TOKENS_SCHEMA = {
	colors: { keys: COLOR_TOKENS, kind: 'color', modes: ['light', 'dark'] },
	fonts: { keys: ['heading', 'body', 'mono'], kind: 'font' },
	radius: { keys: RADIUS_TOKENS, kind: 'length' },
	shadow: { keys: SHADOW_TOKENS, kind: 'shadow' },
	space: { keys: SPACE_STEPS.map(String), kind: 'length' },
	container: { kind: 'int', min: 640, max: 1920, unit: 'px' },
	button: { radius: RADIUS_TOKENS, weight: [400, 500, 600, 700, 800], uppercase: 'boolean' },
};
