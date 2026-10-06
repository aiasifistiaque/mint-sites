import type { BlockDef } from '@/types';
import { opts, SPACE_OPTIONS } from '../util';

export const def: BlockDef = {
	type: 'grid',
	label: 'Grid',
	category: 'layout',
	icon: 'squares-four',
	description: 'Lays its content out in equal columns — fewer on smaller screens.',
	aiHint: 'For cards, features, logos and galleries: columns on desktop, columnsTablet and columnsMobile for smaller screens.',
	props: [
		{ key: 'columns', label: 'Columns (desktop)', kind: 'select', options: opts([1, 2, 3, 4, 5, 6]), default: 3 },
		{ key: 'columnsTablet', label: 'Columns (tablet)', kind: 'select', options: opts([1, 2, 3, 4]), default: 2 },
		{ key: 'columnsMobile', label: 'Columns (phone)', kind: 'select', options: opts([1, 2]), default: 1 },
		{ key: 'gap', label: 'Gap', kind: 'select', options: SPACE_OPTIONS, default: 6 },
	],
	slots: { children: {} },
	style: 'all',
	defaults: { props: { columns: 3, columnsTablet: 2, columnsMobile: 1, gap: 6 } },
};
