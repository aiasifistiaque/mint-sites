import { describe, expect, it } from 'vitest';
import { cleanStyle, compileStyles } from '@/render/compileStyles';
import type { Node } from '@/types';

const node = (over: Partial<Node>): Node => ({ id: 'abc12345', type: 'stack', props: {}, ...over });

describe('compileStyles', () => {
	it('writes base rules and per-breakpoint media queries', () => {
		const css = compileStyles([
			node({ style: { base: { paddingTop: 4, bgColor: 'primary' }, md: { paddingTop: 8 }, lg: { columns: 3, display: 'grid' } } }),
		]);
		expect(css).toBe(
			'[data-n="abc12345"]{padding-top:var(--mint-space-4);background-color:var(--mint-color-primary)}' +
				'@media (min-width:768px){[data-n="abc12345"]{padding-top:var(--mint-space-8)}}' +
				'@media (min-width:1024px){[data-n="abc12345"]{grid-template-columns:repeat(3,minmax(0,1fr));display:grid}}'
		);
	});

	it('walks children and named slots, one string for the whole tree', () => {
		const css = compileStyles([
			node({
				id: 'parent01',
				style: { base: { gap: 2 } },
				children: [node({ id: 'child001', style: { base: { color: 'muted-foreground' } } })],
				slots: { media: [node({ id: 'slot0001', style: { base: { radius: 'lg' } } })] },
			}),
		]);
		expect(css).toContain('[data-n="parent01"]{gap:var(--mint-space-2)}');
		expect(css).toContain('[data-n="child001"]{color:var(--mint-color-muted-foreground)}');
		expect(css).toContain('[data-n="slot0001"]{border-radius:var(--mint-radius-lg)}');
	});

	it('hides per breakpoint, mobile first, and restores the display after', () => {
		const css = compileStyles([node({ hidden: { base: true, md: false } }), node({ id: 'lgHidden', hidden: { lg: true } })]);
		expect(css).toBe(
			'[data-n="abc12345"]{display:none}' +
				'@media (min-width:768px){[data-n="abc12345"]{display:revert-layer}}' +
				'@media (min-width:1024px){[data-n="lgHidden"]{display:none}}'
		);
	});

	it('restores an explicit display when a hidden node shows again', () => {
		const css = compileStyles([node({ style: { base: { display: 'flex' } }, hidden: { base: true, lg: false } })]);
		expect(css).toBe('[data-n="abc12345"]{display:none}@media (min-width:1024px){[data-n="abc12345"]{display:flex}}');
	});

	it('drops unknown keys, bad values and raw CSS', () => {
		const junk = {
			paddingTop: 5, // not a step
			color: 'red; background:url(x)',
			bgColor: 'javascript:alert(1)',
			position: 'fixed',
			zIndex: 9999,
			width: { n: 100, unit: 'em' },
			minHeight: { n: 50, unit: 'vh' },
			'background-image': 'url(evil)',
			fontWeight: 650,
			gradient: { from: 'primary', to: '#fff', angle: 90 },
			bgImage: 'javascript:alert(1)',
		};
		expect(cleanStyle(junk)).toEqual({ minHeight: { n: 50, unit: 'vh' } });
		expect(compileStyles([node({ style: { base: junk as any } })])).toBe('[data-n="abc12345"]{min-height:50vh}');
	});

	it('skips nodes with unsafe ids and survives junk input', () => {
		expect(compileStyles([node({ id: '"]{}*{color:red', style: { base: { gap: 2 } } })])).toBe('');
		expect(compileStyles([null as any, 'x' as any, node({ style: 'nope' as any })])).toBe('');
	});

	it('layers overlay, image and gradient into one background-image', () => {
		const css = compileStyles([
			node({
				style: {
					base: { bgImage: "https://cdn.example.com/a'b(1).jpg", bgOverlay: 'black', bgOverlayOpacity: 40 },
					md: { gradient: { from: 'primary', to: 'accent', angle: 90 } },
				},
			}),
		]);
		expect(css).toContain(
			'background-image:linear-gradient(color-mix(in srgb,black 40%,transparent),color-mix(in srgb,black 40%,transparent)),url("https://cdn.example.com/a%27b%281%29.jpg");background-size:cover;background-repeat:no-repeat'
		);
		expect(css).toContain('@media (min-width:768px){[data-n="abc12345"]{background-image:linear-gradient(');
		expect(css).toContain('linear-gradient(90deg,var(--mint-color-primary),var(--mint-color-accent))');
	});
});
