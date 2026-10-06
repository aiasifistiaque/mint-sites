import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'section',
	label: 'Section',
	category: 'layout',
	icon: 'list',
	description: 'A full-width band of the page with its content kept to a readable width.',
	aiHint:
		'Top-level building block of a page: one per band (hero, features, footer…). Set a background with style.bgColor / bgImage; put a stack or grid inside.',
	props: [
		{ key: 'tag', label: 'HTML element', kind: 'select', options: opts(['section', 'div', 'header', 'footer', 'main', 'aside']), default: 'section' },
		{ key: 'width', label: 'Content width', kind: 'select', options: opts([['narrow', 'Narrow'], ['container', 'Normal'], ['wide', 'Wide'], ['full', 'Full width']]), default: 'container' },
		{ key: 'paddingY', label: 'Space above and below', kind: 'select', options: opts([['none', 'None'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large']]), default: 'md' },
	],
	slots: { children: {} },
	style: 'all',
	defaults: { props: { tag: 'section', width: 'container', paddingY: 'md' } },
};
