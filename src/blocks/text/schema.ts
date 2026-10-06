import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'text',
	label: 'Text',
	category: 'basic',
	icon: 'text-t',
	description: 'Paragraphs with bold, italics, links and lists.',
	aiHint: 'Body copy as simple HTML: <p>, <strong>, <em>, <a href>, <ul>/<ol>/<li>, <h2>–<h4>, <blockquote>, <code>. Nothing else survives.',
	props: [
		{ key: 'html', label: 'Text', kind: 'richtext', default: '<p>Write something here.</p>', bindable: true },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([['sm', 'Small'], ['base', 'Normal'], ['lg', 'Large'], ['xl', 'Lead']]), default: 'base' },
		{ key: 'muted', label: 'Muted colour', kind: 'boolean', default: false },
	],
	style: 'all',
	defaults: { props: { html: '<p>Write something here.</p>', size: 'base', muted: false } },
};
