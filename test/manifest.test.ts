import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '@/blocks/registry';
import { buildManifest } from '@/manifest';

describe('manifest', () => {
	const m = buildManifest();
	it('lists the 14 primitives + 3 overlays, a theme, the icons and limits', () => {
		expect(m.blocks.map(b => b.type)).toEqual(
			['button', 'container', 'divider', 'drawer', 'embed', 'grid', 'heading', 'icon', 'image', 'link', 'modal', 'popover', 'section', 'spacer', 'stack', 'text', 'video']
		);
		expect(m.themes.map(t => t.key)).toEqual(['studio']);
		expect(m.icons.length).toBeGreaterThan(150);
		expect(m.icons.length).toBeLessThanOrEqual(200);
		expect(m.limits).toEqual({ maxNodes: 1500, maxDepth: 30, maxBytes: 524288 });
	});
	it('every block icon exists, every block is in the registry', () => {
		for (const b of m.blocks) {
			expect(m.icons, b.type).toContain(b.icon);
			expect(REGISTRY[b.type]?.def).toBe(b);
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
