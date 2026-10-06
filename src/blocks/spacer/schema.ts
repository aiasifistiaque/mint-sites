import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'spacer',
	label: 'Spacer',
	category: 'layout',
	icon: 'arrows-vertical',
	description: 'Empty space of a fixed height.',
	aiHint: 'Prefer gaps and padding; use a spacer only for a one-off extra gap.',
	props: [{ key: 'size', label: 'Height', kind: 'select', options: opts([2, 4, 6, 8, 12, 16, 24, 32]), default: 8 }],
	style: ['spacing', 'effects'],
	defaults: { props: { size: 8 } },
};
