import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'divider',
	label: 'Divider',
	category: 'layout',
	icon: 'minus',
	description: 'A thin horizontal line.',
	aiHint: 'Separates groups of content, e.g. above a footer’s copyright line.',
	props: [
		{ key: 'thickness', label: 'Thickness', kind: 'select', options: opts([[1, 'Thin'], [2, 'Thick']]), default: 1 },
		{ key: 'lineStyle', label: 'Line', kind: 'select', options: opts([['solid', 'Solid'], ['dashed', 'Dashed'], ['dotted', 'Dotted']]), default: 'solid' },
	],
	style: ['spacing', 'size', 'border', 'effects'],
	defaults: { props: { thickness: 1, lineStyle: 'solid' } },
};
