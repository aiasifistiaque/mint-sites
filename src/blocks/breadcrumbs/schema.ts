import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'breadcrumbs',
	label: 'Breadcrumbs',
	category: 'navigation',
	icon: 'caret-right',
	description: 'Home › Section › This page — the trail to the page, from its address.',
	aiHint: 'Built from the page path and page names; put it at the top of inner pages.',
	props: [
		{ key: 'separator', label: 'Between items', kind: 'select', options: opts([['chevron', '›'], ['slash', '/'], ['dot', '·']]), default: 'chevron' },
		{ key: 'homeLabel', label: 'First item', kind: 'text', default: 'Home' },
	],
	style: ['spacing', 'type', 'effects'],
	defaults: { props: { separator: 'chevron', homeLabel: 'Home' } },
};
