import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'card',
	label: 'Card',
	category: 'layout',
	icon: 'cards',
	description: 'A box that groups a picture, text and buttons. The whole card can be a link.',
	aiHint:
		'For features, products, posts, team members, prices. Children in order: optional image (edge to edge when it comes first), then heading / text / buttons. If node.action is set the whole card is the link — then don’t put buttons in it.',
	props: [
		{ key: 'variant', label: 'Look', kind: 'select', options: opts([['outline', 'Outlined'], ['elevated', 'Shadow'], ['filled', 'Filled'], ['plain', 'Plain']]), default: 'outline' },
		{ key: 'padding', label: 'Padding', kind: 'select', options: opts([['none', 'None'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
		{ key: 'gap', label: 'Gap', kind: 'select', options: opts([[2, 'Small'], [3, 'Medium'], [4, 'Large'], [6, 'Extra large']]), default: 3 },
		{ key: 'align', label: 'Align', kind: 'select', options: opts([['start', 'Left'], ['center', 'Centre']]), default: 'start' },
		{ key: 'lift', label: 'Lift on hover', kind: 'boolean', default: false },
	],
	slots: { children: {} },
	style: 'all',
	actions: true,
	defaults: {
		props: { variant: 'outline', padding: 'md', gap: 3, align: 'start' },
		children: [
			{ id: 'crd0head', type: 'heading', props: { text: 'Card title', level: 3, size: 'sm' } },
			{ id: 'crd0text', type: 'text', props: { html: '<p>A sentence or two about this.</p>', muted: true } },
		],
	},
};
