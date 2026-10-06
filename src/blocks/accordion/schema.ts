import type { BlockDef } from '@/types';

const item = (n: number, q: string, a: string) => ({
	id: `acc0qst${n}`,
	type: 'accordion-item',
	props: { title: q },
	children: [{ id: `acc0ans${n}`, type: 'text', props: { html: `<p>${a}</p>`, muted: true } }],
});

export const def: BlockDef = {
	type: 'accordion',
	label: 'Accordion',
	category: 'layout',
	icon: 'list-checks',
	description: 'Questions that open to show their answers — FAQs, details, policies.',
	aiHint: 'children are accordion-item blocks (title + answer). single true closes the others when one opens.',
	props: [{ key: 'single', label: 'One open at a time', kind: 'boolean', default: false }],
	slots: { children: { allow: ['accordion-item'] } },
	style: 'all',
	defaults: {
		props: { single: false },
		children: [
			item(1, 'How long does it take?', 'Most orders are ready within a week.'),
			item(2, 'Can I change my booking?', 'Yes — up to a day before, at no cost.'),
			item(3, 'Do you deliver?', 'We deliver across the city; elsewhere by post.'),
		],
	},
};
