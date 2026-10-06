import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'badge',
	label: 'Badge',
	category: 'basic',
	icon: 'tag',
	description: 'A small label — “New”, “Popular”, “Sold out”.',
	aiHint: 'One or two words. tone primary for highlights, muted for tags; variant soft by default.',
	props: [
		{ key: 'text', label: 'Text', kind: 'text', default: 'New', bindable: true },
		{ key: 'tone', label: 'Colour', kind: 'select', options: opts([['primary', 'Primary'], ['accent', 'Accent'], ['muted', 'Muted'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']]), default: 'primary' },
		{ key: 'variant', label: 'Look', kind: 'select', options: opts([['soft', 'Soft'], ['solid', 'Solid'], ['outline', 'Outline']]), default: 'soft' },
		{ key: 'icon', label: 'Icon', kind: 'icon' },
	],
	style: ['spacing', 'effects'],
	defaults: { props: { text: 'New', tone: 'primary', variant: 'soft' } },
};
