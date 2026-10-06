import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { hasOverlays, OVERLAY_SCRIPT } from '@/render/overlays';
import { RenderTree } from '@/render/RenderTree';
import { SiteDocument } from '@/render/SiteDocument';
import type { Node } from '@/types';

const drawer: Node = { id: 'drawer01', type: 'drawer', props: { side: 'left' }, children: [{ id: 'txt00001', type: 'text', props: { html: '<p>Hi</p>' } }] };
const opener: Node = { id: 'btn00001', type: 'button', props: { label: 'Menu' }, action: { type: 'open', target: 'drawer01' } };

describe('overlays', () => {
	it('draws a drawer as a closed native dialog with its id, side and a close button', () => {
		const out = renderToStaticMarkup(<RenderTree nodes={[drawer]} ctx={{ mode: 'live' }} />);
		expect(out).toMatch(/^<dialog data-n="drawer01" id="n-drawer01" data-mint-overlay="drawer" data-side="left" aria-label="Drawer"/);
		expect(out).not.toContain(' open');
		expect(out).toContain('data-mint-action="close" data-mint-target="drawer01"');
	});

	it('a popover uses the popover attribute; a modal can drop its close button', () => {
		const pop = renderToStaticMarkup(<RenderTree nodes={[{ id: 'pop00001', type: 'popover', props: {} }]} ctx={{ mode: 'live' }} />);
		expect(pop).toContain('popover="auto"');
		const modal = renderToStaticMarkup(<RenderTree nodes={[{ id: 'mdl00001', type: 'modal', props: { closeButton: false } }]} ctx={{ mode: 'live' }} />);
		expect(modal).toContain('<dialog');
		expect(modal).not.toContain('data-mint-action="close"');
	});

	it('an open action becomes data attributes', () => {
		expect(renderToStaticMarkup(<RenderTree nodes={[opener]} ctx={{ mode: 'live' }} />)).toContain('data-mint-action="open" data-mint-target="drawer01"');
	});

	it('the script is on live pages with an overlay or an opener only', () => {
		expect(hasOverlays([[opener]])).toBe(true);
		expect(hasOverlays([[{ id: 'sec00001', type: 'section', props: {}, children: [drawer] }]])).toBe(true);
		expect(hasOverlays([[{ id: 'hd000001', type: 'heading', props: {} }]])).toBe(false);
		const live = renderToStaticMarkup(<SiteDocument tree={[opener, drawer]} />);
		expect(live).toContain(OVERLAY_SCRIPT.slice(0, 40));
		const plain = renderToStaticMarkup(<SiteDocument tree={[{ id: 'hd000001', type: 'heading', props: {} }]} />);
		expect(plain).not.toContain('<script');
		const edit = renderToStaticMarkup(<SiteDocument tree={[opener, drawer]} ctx={{ mode: 'edit' }} />);
		expect(edit).not.toContain('<script');
	});

	it('in the editor, empty containers say where to drop and text is marked for typing', () => {
		const out = renderToStaticMarkup(
			<RenderTree
				nodes={[{ id: 'stk00001', type: 'stack', props: {} }, { id: 'hd000001', type: 'heading', props: { text: 'Hi' } }]}
				ctx={{ mode: 'edit' }}
			/>
		);
		expect(out).toContain('data-mint-empty=""');
		expect(out).toContain('data-mint-text="text"');
		const live = renderToStaticMarkup(<RenderTree nodes={[{ id: 'stk00001', type: 'stack', props: {} }]} ctx={{ mode: 'live' }} />);
		expect(live).not.toContain('data-mint-empty');
	});
});
