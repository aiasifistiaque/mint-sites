import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'icon',
	label: 'Icon',
	category: 'basic',
	icon: 'smiley',
	description: 'An icon from the built-in set, in the text colour.',
	aiHint: 'Pick a name from manifest.icons. Colour follows style.color; add a label only when the icon means something on its own.',
	props: [
		{ key: 'name', label: 'Icon', kind: 'icon', default: 'star' },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([[16, 'Small'], [24, 'Medium'], [32, 'Large'], [48, 'Extra large']]), default: 24 },
		{ key: 'label', label: 'Label for screen readers', kind: 'text', help: 'Leave empty when the icon is decoration next to text.' },
	],
	style: ['spacing', 'type', 'background', 'border', 'effects'],
	actions: true,
	defaults: { props: { name: 'star', size: 24 } },
};
