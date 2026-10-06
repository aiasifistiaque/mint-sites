import { describe, expect, it } from 'vitest';
import { bindingValue, interpolate, withData } from '@/render/bind';
import type { Node, PropDef } from '@/types';

const scope = {
	item: { title: 'Web design', price: 1200, author: { name: 'Ana' }, createdAt: '2026-10-07T10:00:00Z', tags: ['a', 'b'] },
	record: { title: 'Hello', body: '<p>Hi <b>there</b></p>' },
	site: { name: 'Acme', email: 'hi@acme.test' },
	content: { 'home-hero': { content: 'Grow faster', image: 'https://x.test/a.webp' } },
	currency: 'USD',
};

describe('bind', () => {
	it('reads item, record, site and content bindings', () => {
		expect(bindingValue({ from: 'item', field: 'author.name' }, scope)).toBe('Ana');
		expect(bindingValue({ from: 'record', field: 'title' }, scope)).toBe('Hello');
		expect(bindingValue({ from: 'site', field: 'email' }, scope)).toBe('hi@acme.test');
		expect(bindingValue({ from: 'content', slug: 'home-hero', field: 'content' }, scope)).toBe('Grow faster');
		expect(bindingValue({ from: 'customer', field: 'name' }, scope)).toBeUndefined();
	});

	it('fills {{ }} with filters and never reaches the prototype', () => {
		expect(interpolate('{{item.title}} — {{item.price | money}}', scope)).toBe('Web design — $1,200.00');
		expect(interpolate('{{item.createdAt | date}}', scope)).toBe('October 7, 2026');
		expect(interpolate('{{item.tags}} {{item.missing | default:"n/a"}}', scope)).toBe('a, b n/a');
		expect(interpolate('{{item.title | upper | truncate:3}}', scope)).toBe('WEB…');
		expect(interpolate('{{content.home-hero.content}}', scope)).toBe('Grow faster');
		expect(interpolate('{{item.constructor}}{{item.__proto__}}', scope)).toBe('');
	});

	it('fills a node’s props; HTML from data stays HTML, plain text is escaped', () => {
		const defs = new Map<string, PropDef>([
			['text', { key: 'text', label: 'Text', kind: 'text' }],
			['html', { key: 'html', label: 'Text', kind: 'richtext' }],
			['src', { key: 'src', label: 'Image', kind: 'image' }],
		]);
		const node: Node = { id: 'n1', type: 'x', props: {}, bind: { html: { from: 'record', field: 'body' }, src: { from: 'content', slug: 'home-hero', field: 'image' } } };
		const r = withData(node, { text: 'By {{item.author.name}}', html: '', src: '' }, defs, scope, false);
		expect(r.props).toEqual({ text: 'By Ana', html: '<p>Hi <b>there</b></p>', src: 'https://x.test/a.webp' });
		expect(r.bound.sort()).toEqual(['html', 'src', 'text']);
		const plain = withData({ id: 'n2', type: 'x', props: {} }, { html: '<p>{{item.title}} & <i>{{site.name}}</i></p>' }, defs, { ...scope, item: { title: '<script>' } }, false);
		expect(plain.props.html).toBe('<p>&lt;script&gt; &amp; <i>Acme</i></p>'.replace('&amp;', '&'));
	});

	it('keeps the placeholder in the editor when there is no value yet', () => {
		const defs = new Map<string, PropDef>([['text', { key: 'text', label: 'Text', kind: 'text' }]]);
		expect(withData({ id: 'n', type: 'x', props: {} }, { text: '{{item.title}}' }, defs, { item: {} }, true).props.text).toBe('{{item.title}}');
		expect(withData({ id: 'n', type: 'x', props: {} }, { text: '{{item.title}}' }, defs, { item: {} }, false).props.text).toBe('');
	});
});
