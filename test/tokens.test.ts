import { describe, expect, it } from 'vitest';
import { fontHref, mergeTokens, tokensToCss } from '@/render/tokens';
import { studio } from '@/themes/studio';

describe('tokens', () => {
	it('writes light variables on :root and dark ones on [data-theme=dark]', () => {
		const css = tokensToCss(studio.tokens);
		expect(css).toMatch(/^:root,\[data-theme=light\]\{[^}]*--mint-color-primary:#4f46e5/);
		expect(css).toMatch(/\[data-theme=dark\]\{[^}]*--mint-color-primary:#8b85ff[^}]*color-scheme:dark\}/);
		expect(css).toContain('--mint-font-heading:"Inter", ui-sans-serif, system-ui, sans-serif');
		expect(css).toContain('--mint-radius-md:0.5rem');
		expect(css).toContain('--mint-space-4:1rem');
		expect(css).toContain('--mint-container:1200px');
		expect(css).toContain('--mint-button-radius:var(--mint-radius-md)');
		expect(css).not.toContain('prefers-color-scheme');
	});

	it('follows the system scheme when asked', () => {
		expect(tokensToCss(studio.tokens, 'system')).toContain(
			'@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--mint-color-background:#0b0d12'
		);
	});

	it('applies valid overrides and ignores unsafe ones', () => {
		const t = mergeTokens(studio.tokens, {
			colors: { primary: { light: '#ff0066', dark: 'red;}body{display:none' } },
			fonts: { heading: { family: 'Playfair Display', weights: [400, 700, 750] }, body: { family: 'Evil"; x' } },
			radius: { md: '12px', lg: 'calc(1px)' },
			container: 99999,
			button: { uppercase: true, weight: 1 },
		});
		expect(t.colors.primary).toEqual({ light: '#ff0066', dark: studio.tokens.colors.primary.dark });
		expect(t.fonts.heading).toEqual({ family: 'Playfair Display', weights: [400, 700] });
		expect(t.fonts.body.family).toBe('Inter');
		expect(t.radius.md).toBe('12px');
		expect(t.radius.lg).toBe(studio.tokens.radius.lg);
		expect(t.container).toBe(1200);
		expect(t.button).toEqual({ radius: 'md', weight: 600, uppercase: true });
	});

	it('builds one Google Fonts link for the theme families', () => {
		expect(fontHref(studio.tokens)).toBe(
			'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap'
		);
		const system = mergeTokens(studio.tokens, {
			fonts: { heading: { family: 'system-ui' }, body: { family: 'system-ui' }, mono: { family: 'monospace' } },
		});
		expect(fontHref(system)).toBeNull();
	});
});
