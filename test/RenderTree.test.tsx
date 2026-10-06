import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { collectAnchors } from '@/render/actions';
import { RenderTree } from '@/render/RenderTree';
import { SiteDocument } from '@/render/SiteDocument';
import type { BlockEntry } from '@/blocks/types';
import type { Node, RenderContext } from '@/types';

const ctx: RenderContext = { mode: 'live' };
const html = (nodes: Node[], c: RenderContext = ctx, registry?: Record<string, BlockEntry>) =>
	renderToStaticMarkup(<RenderTree nodes={nodes} ctx={c} registry={registry} />);

describe('RenderTree', () => {
	it('puts data-n on every block root', () => {
		expect(html([{ id: 'h1aaaaaa', type: 'heading', props: { text: 'Hello', level: 1 } }])).toMatch(
			/^<h1 data-n="h1aaaaaa" class="[^"]+">Hello<\/h1>$/
		);
	});

	it('renders nothing for unknown types and junk nodes', () => {
		expect(html([{ id: 'xxxxxxxx', type: 'not-a-block', props: {} }, null as any, { type: 'heading' } as any])).toBe(
			'<h2 class="font-heading text-balance font-semibold tracking-tight text-3xl md:text-4xl">Heading</h2>'
		);
	});

	it('renders children only where the block declares a slot', () => {
		const out = html([
			{
				id: 'stack001',
				type: 'stack',
				props: {},
				children: [{ id: 'text0001', type: 'text', props: { html: '<p>in</p>' } }],
			},
			{
				id: 'head0001',
				type: 'heading',
				props: { text: 'T' },
				children: [{ id: 'text0002', type: 'text', props: { html: '<p>dropped</p>' } }],
			},
		]);
		expect(out).toContain('data-n="text0001"');
		expect(out).not.toContain('dropped');
	});

	it('renders named slots through the block', () => {
		const registry: Record<string, BlockEntry> = {
			card: {
				def: { type: 'card', label: 'Card', category: 'layout', icon: 'cards', description: '', aiHint: '', props: [], style: 'all', defaults: { props: {} }, slots: { media: {}, body: {} } },
				Component: ({ attrs, slots }) => (
					<div {...attrs}>
						<figure>{slots.media}</figure>
						<section>{slots.body}</section>
					</div>
				),
			},
			x: {
				def: { type: 'x', label: 'X', category: 'basic', icon: 'x', description: '', aiHint: '', props: [{ key: 't', label: 'T', kind: 'text', default: 'dflt' }], style: 'all', defaults: { props: {} } },
				Component: ({ attrs, props }) => <i {...attrs}>{props.t}</i>,
			},
		};
		const out = html(
			[{ id: 'card0001', type: 'card', props: {}, slots: { media: [{ id: 'x0000001', type: 'x', props: {} }], body: [{ id: 'x0000002', type: 'x', props: { t: 'set' } }], nope: [{ id: 'x0000003', type: 'x', props: {} }] } }],
			ctx,
			registry
		);
		expect(out).toBe('<div data-n="card0001"><figure><i data-n="x0000001">dflt</i></figure><section><i data-n="x0000002">set</i></section></div>');
	});

	it('drops unsafe ids from data-n', () => {
		expect(html([{ id: '"><script>', type: 'heading', props: { text: 'x' } }])).not.toContain('script');
	});

	it('turns actions into links, and gives scroll targets an id', () => {
		const tree: Node[] = [
			{ id: 'btn00001', type: 'button', props: { label: 'Go' }, action: { type: 'scroll', target: 'target01' } },
			{ id: 'btn00002', type: 'button', props: { label: 'Bad' }, action: { type: 'link', href: 'javascript:alert(1)' } },
			{ id: 'lnk00001', type: 'link', props: { text: 'Out' }, action: { type: 'link', href: 'https://x.com', newTab: true } },
			{ id: 'target01', type: 'section', props: {} },
		];
		const out = html(tree, { mode: 'live', anchors: collectAnchors([tree]) });
		expect(out).toContain('<a data-n="btn00001" href="#n-target01" data-mint-action="scroll" data-mint-target="target01"');
		expect(out).toContain('<button data-n="btn00002" type="button"');
		expect(out).not.toContain('javascript');
		expect(out).toContain('href="https://x.com" target="_blank" rel="noopener noreferrer"');
		expect(out).toContain('<section data-n="target01" id="n-target01"');
	});

	it('draws saved sections where section-ref blocks place them, with their styles', () => {
		const sections = {
			cta00001: { name: 'Call to action', tree: [{ id: 'ctahead1', type: 'heading', props: { text: 'Join us' }, style: { md: { color: 'primary' as const } } }] },
			unused01: { name: 'Unused', tree: [{ id: 'unusedh1', type: 'heading', props: { text: 'Never drawn' } }] },
		};
		const tree: Node[] = [
			{ id: 'ref00001', type: 'section-ref', props: { section: 'cta00001' } },
			{ id: 'ref00002', type: 'section-ref', props: { section: 'gone0001' } },
		];
		const out = renderToStaticMarkup(<SiteDocument tree={tree} sections={sections} />);
		expect(out).toContain('<div data-n="ref00001"><h2 data-n="ctahead1"');
		expect(out).toContain('Join us');
		expect(out).toContain('@media (min-width:768px){[data-n="ctahead1"]{color:var(--mint-color-primary)}}');
		expect(out).not.toContain('Never drawn');
		expect(out).not.toContain('ref00002'); // a deleted section draws nothing on the live site
		// In the editor: marked so a click selects the section-ref, and a hint where it's missing.
		const edit = renderToStaticMarkup(<SiteDocument tree={tree} sections={sections} ctx={{ mode: 'edit' }} />);
		expect(edit).toContain('<div data-n="ref00001" data-mint-ref="">');
		expect(edit).toContain('This saved section was deleted');
	});

	it('never draws a saved section inside a saved section', () => {
		const sections = { outer001: { name: 'Outer', tree: [{ id: 'inref001', type: 'section-ref', props: { section: 'outer001' } }] } };
		const out = renderToStaticMarkup(<SiteDocument tree={[{ id: 'ref00001', type: 'section-ref', props: { section: 'outer001' } }]} sections={sections} />);
		expect(out).toContain('data-n="ref00001"');
		expect(out).not.toContain('inref001');
	});
});
