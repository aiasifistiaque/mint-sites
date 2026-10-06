import type { BlockDef } from '@/types';

export const def: BlockDef = {
	type: 'accordion-item',
	label: 'Question',
	category: 'layout',
	icon: 'caret-down',
	description: 'One row of an accordion: a title that opens to show its content.',
	aiHint: 'Only inside accordion. title is the question; children hold the answer (usually one text block).',
	props: [
		{ key: 'title', label: 'Title', kind: 'text', default: 'A question people ask', bindable: true },
		{ key: 'open', label: 'Open at first', kind: 'boolean', default: false },
	],
	slots: { children: {} },
	canBeChildOf: ['accordion'],
	style: ['spacing', 'type'],
	defaults: {
		props: { title: 'A question people ask', open: false },
		children: [{ id: 'acI0text', type: 'text', props: { html: '<p>The answer, in a sentence or two.</p>', muted: true } }],
	},
};
