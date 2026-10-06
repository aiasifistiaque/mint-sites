// WCAG 2 contrast between two #rrggbb colours (1–21). Themes must give
// ≥ 4.5:1 for every pair text is drawn with (test/contrast.test.ts); SB-24's
// brand-to-theme step uses the same check.
const channel = (c: number) => {
	const s = c / 255;
	return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function luminance(hex: string): number {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) throw new Error(`not a #rrggbb colour: ${hex}`);
	const n = parseInt(m[1], 16);
	return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** [text, background] token pairs that blocks draw text with. */
export const TEXT_PAIRS: [string, string][] = [
	['foreground', 'background'],
	['muted-foreground', 'background'],
	['primary', 'background'],
	['foreground', 'muted'],
	['muted-foreground', 'muted'],
	['primary-foreground', 'primary'],
	['secondary-foreground', 'secondary'],
	['accent-foreground', 'accent'],
	['card-foreground', 'card'],
	['muted-foreground', 'card'],
];
