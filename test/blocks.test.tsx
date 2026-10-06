import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { split } from '@/blocks/countdown';
import { mapSrc } from '@/blocks/map';
import { interactiveScript, usedTypes } from '@/render/interactive';
import { RenderTree } from '@/render/RenderTree';
import type { Node, RenderContext } from '@/types';

const site: RenderContext = {
	mode: 'live',
	site: { name: 'Café Nord', logo: '', contact: { email: 'hi@cafe.test', address: 'Storgatan 1, Umeå' }, social: { instagram: 'https://instagram.com/cafe', x: 'javascript:alert(1)' } },
	menu: [
		{ label: 'Home', path: '/' },
		{ label: 'Menu', path: '/menu' },
	],
	path: '/menu/lunch',
	crumbs: [
		{ label: 'Home', path: '/' },
		{ label: 'Menu', path: '/menu' },
		{ label: 'Lunch', path: '/menu/lunch' },
	],
};
const html = (nodes: Node[], c: RenderContext = site) => renderToStaticMarkup(<RenderTree nodes={nodes} ctx={c} />);
const n = (type: string, props: Record<string, any> = {}, children?: Node[], id = `${type.replace(/-/g, '').slice(0, 6)}01`.padEnd(8, 'x')): Node => ({
	id,
	type,
	props,
	...(children && { children }),
});

describe('SB-08 blocks', () => {
	it('header: site name, the menu with the current page, a phone menu that needs no script', () => {
		const out = html([n('header', {}, [n('button', { label: 'Book' }, undefined, 'btn00001')])]);
		expect(out).toContain('Café Nord');
		expect(out).toContain('<a href="/menu" aria-current="page"');
		expect(out).toMatch(/popovertarget="m-header01"/i); // React prints popoverTarget; HTML ignores case
		expect(out).toMatch(/id="m-header01" popover="auto"/);
		expect(out.match(/>Book</g)?.length).toBe(2); // the bar and the phone menu
	});

	it('header in the editor: no popover, a sample menu when no page is in the menu yet', () => {
		const out = html([n('header')], { mode: 'edit' });
		expect(out).not.toContain('popover=');
		expect(out).toContain('Services');
	});

	it('nav menu: custom links drop unsafe addresses', () => {
		const out = html([n('nav-menu', { source: 'custom', items: [{ label: 'Ok', href: '/ok' }, { label: 'Bad', href: 'javascript:alert(1)' }] })]);
		expect(out).toContain('href="/ok"');
		expect(out).not.toContain('Bad');
	});

	it('social links: from the site settings, unsafe ones dropped, email added', () => {
		const out = html([n('social-links')]);
		expect(out).toContain('href="https://instagram.com/cafe"');
		expect(out).toContain('aria-label="Instagram"');
		expect(out).not.toContain('javascript');
		expect(out).toContain('href="mailto:hi@cafe.test"');
	});

	it('breadcrumbs: the trail with the last one marked current', () => {
		const out = html([n('breadcrumbs')]);
		expect(out).toContain('aria-label="Breadcrumb"');
		expect(out).toContain('<a href="/menu"');
		expect(out).toContain('<span aria-current="page" class="text-foreground">Lunch</span>');
	});

	it('tabs: first panel shows, the others are hidden; the editor shows them all', () => {
		const tabs = n('tabs', {}, [n('tab', { label: 'A' }, [], 'tab00001'), n('tab', { label: 'B' }, [], 'tab00002')]);
		const live = html([tabs]);
		expect(live).toContain('role="tablist"');
		expect(live).toMatch(/aria-selected="true"[^>]*>A</);
		expect(live).toMatch(/id="p-tabs01xx-1"[^>]*hidden=""/);
		const edit = html([tabs], { mode: 'edit' });
		expect(edit).not.toContain('role="tablist"');
		expect(edit).toContain('Tab: B');
	});

	it('accordion: <details>, named when one may be open at a time', () => {
		const acc = (single: boolean) => n('accordion', { single }, [n('accordion-item', { title: 'Q' }, [], 'acc00001')]);
		expect(html([acc(true)])).toMatch(/<details [^>]*name="acc-accord01"/);
		expect(html([acc(false)])).not.toContain('name=');
	});

	it('marquee: the copy is hidden from screen readers and has no anchor ids', () => {
		const out = html([n('marquee', {}, [n('text', { html: '<p>Acme</p>' }, undefined, 'txt00001')])], { ...site, anchors: new Set(['txt00001']) });
		expect(out).toContain('aria-hidden="true" inert=""');
		expect(out.match(/id="n-txt00001"/g)?.length).toBe(1);
	});

	it('map: the typed address, else the site’s embed link, else its address', () => {
		expect(mapSrc('Main St 1', 14)).toBe('https://www.google.com/maps?q=Main%20St%201&z=14&output=embed');
		expect(mapSrc('', 16, { mapEmbedUrl: 'https://www.google.com/maps/embed?pb=xyz' })).toBe('https://www.google.com/maps/embed?pb=xyz');
		expect(mapSrc('', 16, { mapEmbedUrl: 'https://evil.test/x', address: 'A' })).toContain('q=A');
		expect(mapSrc('', 16, {})).toBeNull();
	});

	it('countdown: splits seconds; ends at zero', () => {
		expect(split(90061)).toEqual([
			['days', 1],
			['hours', 1],
			['minutes', 1],
			['seconds', 1],
		]);
		expect(split(-5).every(([, v]) => v === 0)).toBe(true);
		const out = html([n('countdown', { to: '2000-01-01T00:00:00Z', endedText: 'Done' })]);
		expect(out).toMatch(/data-mint-cd-units=""[^>]*role="timer"/);
		expect(out).toMatch(/class="[^"]*hidden[^"]*" data-mint-cd-units|data-mint-cd-units=""/);
		expect(out).toContain('>Done<');
	});

	it('form: mailto the site’s email on the live site, no action in the editor', () => {
		expect(html([n('form-placeholder')])).toContain('action="mailto:hi@cafe.test"');
		expect(html([n('form-placeholder')], { mode: 'edit' })).not.toContain('action=');
		expect(html([n('form-placeholder', { to: 'not an email' })], { mode: 'live' })).not.toContain('action=');
	});

	it('card with a link is one <a>; quote stars are labelled', () => {
		expect(html([{ ...n('card', {}, [n('heading', { text: 'T' }, undefined, 'hd000001')]), action: { type: 'link', href: '/x' } }])).toMatch(/^<a data-n="card01xx" href="\/x"/);
		expect(html([n('quote', { rating: 5 })])).toContain('aria-label="5 out of 5 stars"');
	});

	it('gallery: placeholders draw without the big view; the big view is a dialog', () => {
		const out = html([n('gallery', { items: [{ src: 'https://cdn.test/a.jpg', alt: 'A' }, { src: 'placeholder:10x10:P', alt: 'P' }] })]);
		expect(out).toContain('data-mint-lb-src="https://cdn.test/a.jpg"');
		expect(out.match(/data-mint-lb-src/g)?.length).toBe(1);
		expect(out).toContain('<dialog id="lb-galler01"');
	});

	it('page scripts only for the blocks a page has', () => {
		expect(interactiveScript(usedTypes([[n('heading')]]))).toBe('');
		const s = interactiveScript(usedTypes([[n('section', {}, [n('tabs', {}, [], 'tabs0001'), n('countdown', {}, undefined, 'cd000001')])]]));
		expect(s).toContain('data-mint-tabs');
		expect(s).toContain('data-mint-countdown');
		expect(s).not.toContain('data-mint-carousel');
	});
});
