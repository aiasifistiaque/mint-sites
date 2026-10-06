import { readFileSync, statSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '@/blocks/registry';
import { buildManifest } from '@/manifest';

describe('manifest', () => {
	const m = buildManifest();
	it('lists the blocks (primitives, overlays, saved sections, SB-08’s catalogue), the themes, the icons and limits', () => {
		expect(m.blocks.map(b => b.type)).toEqual([
			'accordion', 'accordion-item', 'badge', 'breadcrumbs', 'button', 'card', 'carousel', 'collection', 'container', 'countdown', 'divider', 'drawer',
			'embed', 'form-placeholder', 'gallery', 'grid', 'header', 'heading', 'icon', 'image', 'link', 'logo', 'map', 'marquee', 'modal',
			'nav-menu', 'popover', 'quote', 'section', 'section-ref', 'social-links', 'spacer', 'stack', 'stat', 'tab', 'tabs', 'text', 'video',
		]);
		expect(m.themes.map(t => t.key)).toEqual(['bistro', 'bright', 'calm', 'editorial', 'market', 'mono', 'studio']);
		expect(m.presets.length).toBeGreaterThanOrEqual(30);
		expect(m.icons.length).toBeGreaterThan(150);
		expect(m.icons.length).toBeLessThanOrEqual(200);
		expect(m.limits).toEqual({ maxNodes: 1500, maxDepth: 30, maxBytes: 524288 });
	});
	it('every theme has every token, and only fonts from the list', () => {
		const google = new Set(m.fonts.google.map(f => f.family));
		const studio = m.themes.find(t => t.key === 'studio')!;
		for (const t of m.themes) {
			for (const group of ['colors', 'radius', 'shadow', 'space'] as const)
				expect(Object.keys(t.tokens[group]).sort(), `${t.key} ${group}`).toEqual(Object.keys(studio.tokens[group]).sort());
			for (const f of Object.values(t.tokens.fonts)) expect(google, `${t.key}: ${f.family}`).toContain(f.family);
			expect(t.preview.font, t.key).toBe(t.tokens.fonts.heading.family);
		}
		expect(m.fonts.google.length).toBeGreaterThanOrEqual(40);
	});
	it('every block icon exists, every block is in the registry', () => {
		for (const b of m.blocks) {
			expect(m.icons, b.type).toContain(b.icon);
			expect(REGISTRY[b.type]?.def).toBe(b);
		}
	});
	it('every preset has a thumbnail file of at most 40 KB', () => {
		for (const p of m.presets) {
			expect(p.thumbnail, p.key).toMatch(/^\/__mint\/presets\/[a-z0-9-]+\.(png|jpg)$/);
			const file = path.join(__dirname, '..', 'public', p.thumbnail);
			expect(statSync(file).size, p.thumbnail).toBeLessThanOrEqual(40 * 1024);
		}
	});
	it('presets only use known blocks with unique ids', () => {
		const types = new Set(m.blocks.map(b => b.type));
		for (const p of m.presets) {
			const ids: string[] = [];
			const walk = (nodes: any[] = []) =>
				nodes.forEach(n => {
					expect(types, `${p.key}: ${n.type}`).toContain(n.type);
					expect(n.id).toMatch(/^[A-Za-z0-9_-]{8}$/);
					ids.push(n.id);
					walk(n.children);
				});
			walk(p.tree);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});
	it('the committed block-manifest.json is up to date (run npm run manifest)', () => {
		const file = JSON.parse(readFileSync(path.join(__dirname, '..', 'block-manifest.json'), 'utf8'));
		expect(file.version).toBe(m.version);
	});
});
